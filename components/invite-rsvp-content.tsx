import Link from "next/link";
import { Button } from "./ui/button";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import type { RsvpStatus } from "@/app/generated/prisma/enums";
import { notFound } from "next/navigation";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { submitRsvpAction } from "@/lib/actions/events";


export default async function InviteRsvpContent({
  token,
  submitted,
}: {
  token: string;
  submitted: boolean;
}) {

  const data = await prisma.eventInvite.findFirst({
    where: { token },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          location: true,
          description: true,
          eventDate: true,
        }
      }
    }
  })

  if (!data) {
    notFound()
  }

  const { event } = data;

  const submitRsvpForToken = submitRsvpAction.bind(null, token);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardHeader className="space-y-3">
          <Badge variant="secondary" className="w-fit">
            RSVP
          </Badge>
          <CardTitle>{event.title}</CardTitle>
          <p>
            {event.eventDate ? new Date(event.eventDate).toLocaleString() : "No Date"}
            {event.location ? ` - ${event.location}` : ""}
          </p>
          {event.description && (
            <p className="text-sm text-muted-foreground">
              {event.description}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {submitted ? (
            <p className="mb-4 rounded-md border border-accent bg-accent p-4 text-sm text-muted-foreground">
              Thank you for your RSVP! We look forward to seeing you at the event.
            </p>
          ) : null}
          <form action={submitRsvpForToken}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Your name"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Your email"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="status">Attendence</FieldLabel>
                <Select name="status" defaultValue="going">
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select your attendance" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="going">Going</SelectItem>
                    <SelectItem value="maybe">Maybe</SelectItem>
                    <SelectItem value="not_going">Not Going</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Button type="submit">Submit RSVP</Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}