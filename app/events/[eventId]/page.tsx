import { EventDetailsContent } from "@/components/event-detail-content";
import { auth } from "@/lib/auth/server";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const session = await auth.getSession();
  const userId = session.data?.user.id ?? "";

  return (
    <EventDetailsContent userId={userId} eventId={eventId} />
  )
}