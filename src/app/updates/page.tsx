import { fetchPublishedUpdates } from "@/lib/db";
import UpdatesContent from "./UpdatesContent";

export const metadata = {
  title: "Updates & News | TNF Global Summit",
  description: "Latest news and upcoming events for the TNF Global Summit.",
};

export default async function UpdatesPage() {
  const updates = await fetchPublishedUpdates();
  return <UpdatesContent initialUpdates={updates} />;
}
