import { notFound } from "next/navigation";
import { fetchUpdateById, fetchUpdateAttachments } from "@/lib/db";
import JsonLd from "@/components/JsonLd";
import { articleJsonLd, pageMetadata } from "@/lib/seo";
import UpdateDetailContent from "./UpdateDetailContent";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const update = await fetchUpdateById(id);
  if (!update) return pageMetadata({ title: "Update", description: "Summit news update.", path: `/updates/${id}` });
  return pageMetadata({
    title: update.title,
    description: update.description?.slice(0, 160) ?? "Summit news update.",
    path: `/updates/${id}`,
    openGraphType: "article",
    publishedTime: update.publishedAt ?? update.createdAt,
    image: update.imageUrl || undefined,
  });
}

export default async function UpdateDetailPage({ params }: Props) {
  const { id } = await params;
  const [update, attachments] = await Promise.all([
    fetchUpdateById(id),
    fetchUpdateAttachments(id, { showOnEvent: true }),
  ]);
  if (!update) notFound();

  const articleSchema = articleJsonLd({
    title: update.title,
    description: update.description?.slice(0, 160) ?? "",
    path: `/updates/${id}`,
    publishedAt: update.publishedAt,
    image: update.imageUrl,
  });

  return (
    <>
      <JsonLd data={articleSchema} />
      <UpdateDetailContent update={update} attachments={attachments} />
    </>
  );
}
