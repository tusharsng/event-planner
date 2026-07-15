import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <Badge variant={"secondary"} className="w-fit">
          Next.js 16 + Better Auth + Neon Postgres
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight">
          Plan Evetns and track RSVPs fast
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Create events, share a unique invite link, and watch attendee status update in real-time.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={"/auth/sign-up"}>Create Account</Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={"/auth/sign-in"}>Sign In</Link>
          </Button>
          <Button variant={"ghost"} asChild>
            <Link href={"/dashboard"}>Open Dashboard</Link>
          </Button>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Create Event</CardTitle>
            <CardDescription>Set title, date and details in seconds.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Share invite links</CardTitle>
            <CardDescription>Generate a unique event token per event.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Track attendence</CardTitle>
            <CardDescription>See attendee list and response total at glance.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Going, Maybe, and Not Going are always up-to-date
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
