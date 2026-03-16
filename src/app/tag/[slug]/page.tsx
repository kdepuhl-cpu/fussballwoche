import TagContent from "@/components/artikel/TagContent";
import { getArticles } from "@/lib/api/articles";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  return <TagContent slug={slug} />;
}

export async function generateStaticParams() {
  const articles = await getArticles();
  const allTags = new Set<string>();
  articles.forEach((a) => {
    a.tags?.forEach((tag) => {
      allTags.add(tag.toLowerCase().replace(/\s+/g, "-").replace(/\./g, ""));
    });
  });
  return Array.from(allTags).map((tag) => ({ slug: tag }));
}
