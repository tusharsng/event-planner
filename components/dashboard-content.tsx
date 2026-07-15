import Link from "next/link";
import { Button } from "./ui/button";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import type { RsvpStatus } from "@/app/generated/prisma/enums";

export function getRsvpCount( rsvps: { status: RsvpStatus }[]) {
  let goingCount = 0;
  let maybeCount = 0;
  let notGoingCount = 0;

  for (const rsvp of rsvps) {
    if (rsvp.status === 'going') goingCount++;
    else if (rsvp.status === 'maybe') maybeCount++;
    else if (rsvp.status === 'not_going') notGoingCount++;
  }

  return { goingCount, maybeCount, notGoingCount };
}

export default async function DashboardContent({ userId }: { userId: string | undefined }) {

  const data = await prisma.event.findMany({
    where: { ownerUserId: userId },
    orderBy: { eventDate: 'desc' },
    select: {
      id: true,
      title: true,
      location: true,
      eventDate: true,
      rsvps: { select: { status: true } }
    }
  })

  const events = data.map((event) => ({
    id: event.id,
    title: event.title,
    location: event.location,
    eventDate: event.eventDate ? event.eventDate.toISOString() : null,
    ...getRsvpCount(event.rsvps)
  }))

  return (
    <div className="flex flex-1 flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight ">Your Events</h1>
          <p className="text-sm text-muted-foreground">Here you can view and manage your events.</p>
        </div>

        <Button asChild>
          <Link href={'/events/new'}>
            Create Event
          </Link>
        </Button>
      </div>

      {/* List of Events */}
      {events.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No events yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create your first event to start collectiong RSVPs.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Button asChild size={'sm'}>
                    <Link href={`events/${event.id}`}>Open</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant={'default'}>Going: {event.goingCount}</Badge>
                  <Badge variant={'secondary'}>Maybe: {event.maybeCount}</Badge>
                  <Badge variant={'outline'}>Not Going: {event.notGoingCount}</Badge>
                </div>
                <p>{event.eventDate ? new Date(event.eventDate).toLocaleString() : "No date"} - {event.location ? event.location : ""}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}