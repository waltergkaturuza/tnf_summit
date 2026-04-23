import { notFound } from "next/navigation";
import { fetchUpdateById, fetchUpdateAttachments } from "@/lib/db";
import UpdateDetailContent from "./UpdateDetailContent";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const update = await fetchUpdateById(id);
  if (!update) return { title: "Update | Zimbabwe TNF Global Summit" };
  return { title: `${update.title} | Updates & News | Zimbabwe TNF Global Summit`, description: update.description?.slice(0, 160) };
}

export default async function UpdateDetailPage({ params }: Props) {
  const { id } = await params;
  const [update, attachments] = await Promise.all([
    fetchUpdateById(id),
    fetchUpdateAttachments(id, { showOnEvent: true }),
  ]);
  if (!update) notFound();
  return <UpdateDetailContent update={update} attachments={attachments} />;
}
