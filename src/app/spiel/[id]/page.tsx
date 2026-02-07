import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import VoteButtons from "@/components/tippspiel/VoteButtons";
import { ALL_MATCHES, type Match } from "@/lib/mock/matches";
import { getLeagueById } from "@/lib/leagues";

function TeamLogo({ name, shortName, color, size = "lg" }: {
  name: string;
  shortName: string;
  color: string;
  size?: "md" | "lg";
}) {
  const sizeClasses = size === "lg" ? "w-16 h-16 text-xl" : "w-12 h-12 text-base";
  const initials = shortName.slice(0, 2).toUpperCase();

  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials}
    </div>
  );
}

function StatusBadge({ match }: { match: Match }) {
  if (match.status === "finished") {
    return (
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
        Beendet
      </span>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
      {match.time} Uhr
    </span>
  );
}

export function generateStaticParams() {
  return ALL_MATCHES.map((match) => ({ id: match.id }));
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function SpielPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = ALL_MATCHES.find((m) => m.id === id);

  if (!match) {
    notFound();
  }

  const league = getLeagueById(match.leagueId);

  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-forest-green">Start</Link>
          <span>/</span>
          {league && (
            <>
              <Link href={`/liga/${league.slug}`} className="hover:text-forest-green">
                {league.shortName}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-700 dark:text-gray-300">
            {match.homeTeam.shortName} vs {match.awayTeam.shortName}
          </span>
        </nav>

        {/* Match Hero Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Status */}
          <div className="flex justify-center pt-6 pb-4">
            <StatusBadge match={match} />
          </div>

          {/* Teams & Score */}
          <div className="flex items-center justify-center gap-6 md:gap-10 px-4 pb-6">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <TeamLogo
                name={match.homeTeam.name}
                shortName={match.homeTeam.shortName}
                color={match.homeTeam.color}
              />
              <span className="text-sm md:text-base font-semibold text-off-black dark:text-white text-center">
                {match.homeTeam.name}
              </span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-3">
              <span className="text-4xl md:text-5xl font-bold tabular-nums text-off-black dark:text-white">
                {match.homeScore ?? "-"}
              </span>
              <span className="text-2xl text-gray-400">:</span>
              <span className="text-4xl md:text-5xl font-bold tabular-nums text-off-black dark:text-white">
                {match.awayScore ?? "-"}
              </span>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <TeamLogo
                name={match.awayTeam.name}
                shortName={match.awayTeam.shortName}
                color={match.awayTeam.color}
              />
              <span className="text-sm md:text-base font-semibold text-off-black dark:text-white text-center">
                {match.awayTeam.name}
              </span>
            </div>
          </div>

          {/* VoteButtons */}
          {match.status !== "finished" && (
            <div className="px-6 pb-6">
              <VoteButtons matchId={match.id} />
            </div>
          )}

          {/* Match Info */}
          <div className="border-t border-gray-100 dark:border-gray-700 px-6 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {league && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Liga</span>
                  <p className="font-medium text-off-black dark:text-white">{league.name}</p>
                </div>
              )}
              <div>
                <span className="text-gray-500 dark:text-gray-400">Spieltag</span>
                <p className="font-medium text-off-black dark:text-white">{match.matchday}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Datum</span>
                <p className="font-medium text-off-black dark:text-white">{formatDate(match.date)}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Anstoß</span>
                <p className="font-medium text-off-black dark:text-white">{match.time} Uhr</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
