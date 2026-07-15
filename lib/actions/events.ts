"use server";

import { redirect } from "next/navigation";
import { auth } from "../auth/server";
import prisma from "../prisma";
import { RsvpStatus } from "@/app/generated/prisma/enums";

function parseFormData(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 3 || title.length > 100) {
    throw new Error("Title must be between 3 and 100 characters");
  }
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const eventDate = String(formData.get("event-date") ?? "").trim();

  return {
    title,
    description: description.length > 0 ? description.slice(0, 2000) : null,
    location: location.length > 0 ? location.slice(0, 200) : null,
    eventDate: eventDate.length > 0 ? new Date(eventDate) : null,
  };
}

const RSVP_STATUS = ["going", "maybe", "not_going"] as const;

function isRsvpStatus(status: string): status is RsvpStatus {
  return (RSVP_STATUS as readonly string[]).includes(status);
}

function parseRsvp(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 3 || name.length > 100) {
    throw new Error("Name must be between 2 and 100 characters");
  }
  const email = String(formData.get("email") ?? "").trim();
  if (email.length < 3 || email.length > 100 || !email.includes("@")) {
    throw new Error("Email must be a valid email address");
  }
  const status = String(formData.get("status") ?? "").trim();
  if (!isRsvpStatus(status)) {
    throw new Error("Status must be one of 'going', 'maybe', or 'not-going'");
  }
  return { name, email, status };
}

export async function createEventAction(formData: FormData) {
  const session = await auth.getSession();
  const userId = session.data?.user.id;

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const input = parseFormData(formData);

  const event = await prisma.event.create({
    data: {
      ownerUserId: userId,
      title: input.title,
      description: input.description,
      location: input.location,
      eventDate: input.eventDate,
    }
  })

  redirect(`/events/${event.id}`);
}

export async function createInviteAction(eventId: string) {
  const session = await auth.getSession();
  const userId = session.data?.user.id;

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const authorizedEvent = await prisma.event.findFirst({
    where: { id: eventId, ownerUserId: userId },
    select: { id: true }
  })

  if (!authorizedEvent) {
    throw new Error("Event not found or user is not authorized to create an invite for this event");
  }

  const token = crypto.randomUUID().replace(/-/g, "");

  await prisma.eventInvite.upsert({
    where: { eventId: eventId },
    create: { eventId: eventId, token: token },
    update: { token: token }
  })
}

export async function submitRsvpAction(
  token: string,
  formData: FormData
) {
  const input = parseRsvp(formData);

  const invite = await prisma.eventInvite.findFirst({
    where: { token },
    select: {
      id: true,
      event: {
        select: {
          id: true
        }
      }
    }
  });

  if (!invite) {
    throw new Error("Invalid invite token");
  }

  const eventId = invite.event.id;
  const emailNormalized = input.email.toLowerCase();

  await prisma.eventRsvp.upsert({
    where: {
      eventId_emailNormalized: {
        eventId: eventId,
        emailNormalized
      }
    },
    create: {
      eventId,
      inviteId: invite.id,
      name: input.name,
      email: input.email,
      emailNormalized,
      status: input.status as RsvpStatus
    },
    update: {
      name: input.name,
      status: input.status as RsvpStatus
    }
  })

  redirect(`/invite/${token}?submitted=1`);
}