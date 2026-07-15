import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getRsvpCount } from "./dashboard-content";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { createInviteAction } from "@/lib/actions/events";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "./ui/table";

export async function EventDetailsContent({
  userId,
  eventId
}: {
  userId: string;
  eventId: string;
}) {
  const eventData = await prisma.event.findFirst({
    where: {
      id: eventId,
      ownerUserId: userId
    },
    select: {
      id: true,
      title: true,
      location: true,
      eventDate: true,
      description: true,
      invite: { select: { token: true } },
      rsvps: { select: { status: true } }
    }
  });

  if (!eventData) {
    notFound();
  }

  const rsvpData = await prisma.eventRsvp.findMany({
    where: { eventId },
    orderBy: { respondedAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      respondedAt: true
    }
  });

  const rsvps = rsvpData.map((rsvp) => ({
    id: rsvp.id,
    name: rsvp.name,
    email: rsvp.email,
    status: rsvp.status,
    respondedAt: rsvp.respondedAt?.toISOString()
  }))

  const counts = getRsvpCount(eventData.rsvps);

  const event = {
    id: eventData.id,
    title: eventData.title,
    location: eventData.location,
    eventDate: eventData.eventDate ? eventData.eventDate.toISOString() : null,
    description: eventData.description,
    inviteToken: eventData.invite?.token ?? null,
    goingCount: counts.goingCount,
    maybeCount: counts.maybeCount,
    notGoingCount: counts.notGoingCount
  }

  const createInviteActionForEvent = createInviteAction.bind(null, event.id);

  const inviteLink = event.inviteToken ? `${process.env.NEXT_PUBLIC_APP_URL}/invite/${event.inviteToken}` : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{event.title}</h1>
          <p>
            {event.eventDate ? new Date(event.eventDate).toLocaleString() : "No Date"}
            {event.location ? ` - ${event.location}` : ""}
          </p>
          {event.description && (
            <p className="max-w-2xl text-sm text-muted-foreground">
              {event.description}
            </p>
          )}
        </div>
        <Button asChild variant={"outline"}>
          <Link href={"/dashboard"}>Back</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant={"default"}>Going: {event.goingCount}</Badge>
        <Badge variant={"secondary"}>Maybe: {event.maybeCount}</Badge>
        <Badge variant={"outline"}>Not Going: {event.notGoingCount}</Badge>
      </div>

      <Card>
        <CardHeader>Invite Link</CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Share this link with your friends to invite them to your event. They can RSVP without needing an account.
          </p>
          {inviteLink ? (
            <div className="rounded-md border border-surface bg-surface p-3 text-sm">
              {inviteLink}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No invite link generated yet.</p>
          )}
          <form action={createInviteActionForEvent}>
            <Button type="submit">Generate Link</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendees</CardTitle>
        </CardHeader>
        <CardContent>
          {rsvps.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No Attendees yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsvps.map((rsvp) => (
                  <TableRow key={rsvp.id}>
                    <TableCell>{rsvp.name}</TableCell>
                    <TableCell>{rsvp.email}</TableCell>
                    <TableCell>
                      <Badge variant={"secondary"}>
                        {rsvp.status === "not_going"
                          ? "not going"
                          : rsvp.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {rsvp.respondedAt ? new Date(rsvp.respondedAt).toLocaleDateString() : ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}