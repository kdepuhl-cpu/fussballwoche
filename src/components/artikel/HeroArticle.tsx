import { Artikel, KATEGORIE_LABELS } from "@/lib/types";
import { formatDate, getLigaById } from "@/lib/data";
import { calculateReadingTime } from "@/lib/utils";

interface HeroArticleProps {
  article: Artikel;
}

export default function HeroArticle({ article }: HeroArticleProps) {
  const liga = getLigaById(article.ligaId);

  return (
    <article className="cursor-pointer group">
      {/* Image 16:9 */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden rounded-lg">
        {article.bild && (
          <img
            src={article.bild.url}
            alt={article.bild.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>

      {/* Content */}
      <div className="py-4">
        {/* Dachzeile (Kategorie) */}
        <span className="text-orange text-xs font-bold uppercase tracking-wider">
          {KATEGORIE_LABELS[article.kategorie]}
        </span>

        {/* Headline */}
        <h2 className="font-headline text-2xl md:text-3xl text-off-black mt-2 leading-tight">
          {article.titel}
        </h2>

        {/* Teaser */}
        <p className="text-off-black/70 text-sm mt-2 line-clamp-2 leading-relaxed">
          {article.teaser}
        </p>

        {/* Meta: Liga + Datum */}
        <div className="flex items-center gap-3 mt-3">
          {liga && (
            <span className="text-xs font-semibold text-forest-green bg-mint/30 px-2 py-0.5 rounded">
              {liga.name}
            </span>
          )}
          <span className="text-off-black/40 text-xs">
            {formatDate(article.datum)}
          </span>
          <span className="text-off-black/40 text-xs">
            {article.lesedauer ?? calculateReadingTime(article.inhalt ?? article.teaser)} Min.
          </span>
        </div>
      </div>
    </article>
  );
}
