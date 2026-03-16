import VereinContent from "@/components/verein/VereinContent";
import { getClubSlugs } from "@/lib/api/clubs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function VereinDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <VereinContent slug={slug} />;
}

export async function generateStaticParams() {
  const slugs = await getClubSlugs();
  return slugs.map((slug) => ({ slug }));
}
