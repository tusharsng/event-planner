import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEventAction } from "@/lib/actions/events";
import Link from "next/link";

export default function NewEventPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>
            Create Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createEventAction}>
            <FieldGroup>
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="Team Dinner..."
                />
              </Field>
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  required
                  placeholder="Optional details about the event"
                />
              </Field>
              <Field>
                <FieldLabel>Location</FieldLabel>
                <Input
                  id="location"
                  name="location"
                  required
                  placeholder="Where event is being hosted"
                />
              </Field>
              <Field>
                <FieldLabel>Date and Time</FieldLabel>
                <Input
                  id="event-date"
                  name="event-date"
                  type="datetime-local"
                  required
                  placeholder="Optional details about the event."
                />
                <FieldDescription>Optional, you can set this later</FieldDescription>
              </Field>
              <Field orientation={"horizontal"}>
                <Button type="submit">Submit</Button>
                <Button asChild type="button" variant={"outline"}>
                  <Link href={"/dashboard"}>Cancel</Link>
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}