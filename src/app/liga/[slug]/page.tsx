import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import LeagueTable from "@/components/liga/LeagueTable";
import LeagueMatches from "@/components/liga/LeagueMatches";
import LeagueResults from "@/components/LeagueResults";
import VideoReels from "@/components/VideoReels";
import {
  getLeagueBySlug,
  getStaffelBySlug,
  getAllLeagueSlugs,
  getTierLabel,
  getRegionLabel,
  getCategoryLabel,
  hasStaffeln,
  League,
  Staffel,
} from "@/lib/leagues";
import { getVideosByLeague } from "@/lib/mock/videos";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Tier badge colors
function getTierBadgeColor(tier: number): string {
  if (tier <= 2) return "bg-yellow-500 text-yellow-900";
  if (tier <= 4) return "bg-gray-300 text-gray-800";
  if (tier <= 6) return "bg-amber-600 text-white";
  return "bg-gray-500 text-white";
}

// Region badge colors
function getRegionBadgeColor(region: League["region"]): string {
  const colors: Record<League["region"], string> = {
    national: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    nordost: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    berlin: "bg-forest-green/20 text-forest-green dark:bg-forest-green/30",
  };
  return colors[region];
}

export default async function LigaPage({ params }: PageProps) {
  const { slug } = await params;

  // Try to find as main league first
  let league = getLeagueBySlug(slug);
  let staffel: Staffel | undefined;
  let isStaffelPage = false;

  // If not found, try to find as staffel
  if (!league) {
    const staffelResult = getStaffelBySlug(slug);
    if (staffelResult) {
      league = staffelResult.league;
      staffel = staffelResult.staffel;
      isStaffelPage = true;
    }
  }

  // Still not found? 404
  if (!league) {
    notFound();
  }

  const leagueHasStaffeln = hasStaffeln(league);
  const pageTitle = isStaffelPage && staffel
    ? `${league.name} - ${staffel.name}`
    : league.name;

  // Welche league_id für die Tabellen-Query? Bei Staffel: staffel.id, sonst league.id
  const tableLeagueId = isStaffelPage && staffel ? staffel.id : league.id;

  // Get videos for this league
  const leagueVideos = getVideosByLeague(league.id);

  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-forest-green transition-colors">
            Start
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/liga/${league.slug}`}
            className={`hover:text-forest-green transition-colors ${!isStaffelPage ? "text-off-black dark:text-white font-medium" : ""}`}
          >
            {league.name}
          </Link>
          {isStaffelPage && staffel && (
            <>
              <span className="mx-2">/</span>
              <span className="text-off-black dark:text-white font-medium">{staffel.name}</span>
            </>
          )}
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${getTierBadgeColor(league.tier)}`}>
              {getTierLabel(league.tier)}
            </span>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRegionBadgeColor(league.region)}`}>
              {getRegionLabel(league.region)}
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {getCategoryLabel(league.category)}
            </span>
          </div>

          <h1 className="font-headline text-4xl lg:text-5xl text-off-black dark:text-white">
            {pageTitle}
          </h1>

          {/* Staffel Tabs */}
          {leagueHasStaffeln && league.staffeln && (
            <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
              <nav className="flex gap-1 -mb-px overflow-x-auto hide-scrollbar snap-x">
                <Link
                  href={`/liga/${league.slug}`}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    !isStaffelPage
                      ? "border-forest-green text-forest-green"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  Übersicht
                </Link>
                {league.staffeln.map((s) => (
                  <Link
                    key={s.id}
                    href={`/liga/${s.slug}`}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      staffel?.id === s.id
                        ? "border-forest-green text-forest-green"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    {s.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Table */}
          <div className="lg:col-span-2">
            <LeagueTable leagueId={tableLeagueId} />

            {/* Video Highlights for this league */}
            {leagueVideos.length > 0 && (
              <div className="mt-8">
                <VideoReels videos={leagueVideos} title={`${league.shortName} Video-Highlights`} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Real matches from Supabase */}
            <LeagueMatches leagueId={tableLeagueId} />

            {/* Mock league results (Tippspiel) */}
            <LeagueResults leagueId={league.id} />

            {/* News Placeholder */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-headline text-xl text-off-black dark:text-white">News</h2>
              </div>
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="text-sm">Noch keine News für diese Liga</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Generate static paths for all leagues and staffeln
export async function generateStaticParams() {
  return getAllLeagueSlugs().map((slug) => ({ slug }));
}
