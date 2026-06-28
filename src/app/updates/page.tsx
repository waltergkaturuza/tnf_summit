import { fetchPublishedUpdates } from "@/lib/db";
import UpdatesContent from "./UpdatesContent";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata(PAGE_SEO.updates);

export default async function UpdatesPage() {
  const updates = await fetchPublishedUpdates();
  return <UpdatesContent initialUpdates={updates} />;
}
