import ArtikelContent from "@/components/artikel/ArtikelContent";
import { getArticleSlugs } from "@/lib/api/articles";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArtikelPage({ params }: PageProps) {
  const { slug } = await params;
  return <ArtikelContent slug={slug} />;
}

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}
