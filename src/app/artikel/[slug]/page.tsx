import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import ReadingProgressBar from "@/components/artikel/ReadingProgressBar";
import MarkAsReadButton from "@/components/artikel/MarkAsReadButton";
import MarkAsReadOnView from "@/components/artikel/MarkAsReadOnView";
import ShareButton from "@/components/ui/ShareButton";
import BookmarkButton from "@/components/ui/BookmarkButton";
import FeedbackButton from "@/components/ui/FeedbackButton";
import { artikel, getArtikelBySlug, formatDate } from "@/lib/data";
import { KATEGORIE_LABELS } from "@/lib/types";
import { calculateReadingTime } from "@/lib/utils";
import ReadingTracker from "@/components/artikel/ReadingTracker";
import PaywallGate from "@/components/abo/PaywallGate";

function CommentIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

const ARTICLE_TEXT = `Der Sieg war mehr als verdient. Von Beginn an zeigte die Mannschaft, dass sie es ernst meinte mit dem Angriff auf die Tabellenspitze. Bereits in der fünften Minute setzte der Mittelfeldspieler das erste Ausrufezeichen, als sein Schuss nur knapp am Pfosten vorbeiging. Die Fans auf den Rängen spürten sofort: Heute würde etwas Besonderes passieren. Die Defensive stand sicher, das Mittelfeld kontrollierte das Spiel mit beeindruckender Souveränität. Wir haben genau das umgesetzt, was wir uns vorgenommen hatten, erklärte der Trainer nach dem Spiel. Die Jungs haben von der ersten bis zur letzten Minute gezeigt, dass sie bereit sind für die großen Aufgaben. Das 1:0 fiel dann in der 34. Minute – ein sehenswert herausgespielter Treffer über mehrere Stationen. Der Stürmer vollendete nach einer butterweichen Flanke von der rechten Seite per Kopf. Zur Halbzeit führte das Heimteam verdient. In der 78. Minute dann die Entscheidung: Ein Konter wie aus dem Lehrbuch, abgeschlossen vom eingewechselten Youngster. Die Schlussphase wurde dann noch einmal hitzig. Mit diesem Sieg schiebt sich das Team auf Platz drei der Tabelle vor.`;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArtikelPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArtikelBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = artikel
    .filter((a) => a.ligaId === article.ligaId && a.slug !== slug)
    .slice(0, 3);

  const tags = [
    ...(article.tags || []),
    KATEGORIE_LABELS[article.kategorie],
  ];

  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <MarkAsReadOnView slug={slug} />
      <ReadingTracker articleSlug={slug} />

      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <ReadingProgressBar />

      {/* Hero Image */}
      {article.bild && (
        <div className="w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] relative bg-gray-200 dark:bg-gray-800">
          <Image
            src={article.bild.url}
            alt={article.bild.alt}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Image Caption */}
      {article.bild && (
        <div className="text-center py-3 px-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {article.bild.alt}
            {article.bild.credit && (
              <span className="italic text-gray-400 dark:text-gray-500"> — {article.bild.credit}</span>
            )}
          </p>
        </div>
      )}

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Category */}
        <p className="uppercase text-sm tracking-wide text-center mt-8 text-forest-green dark:text-green-400 font-semibold">
          {KATEGORIE_LABELS[article.kategorie]}
        </p>

        {/* Headline */}
        <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-center mt-4 leading-tight text-off-black dark:text-white">
          {article.titel}
        </h1>

        {/* Teaser */}
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 text-center mt-4 leading-relaxed">
          {article.teaser}
        </p>

        {/* Author */}
        <div className="flex flex-col items-center mt-8">
          {article.autor?.bild ? (
            <Image src={article.autor.bild} alt={article.autor.name} width={40} height={40} className="w-10 h-10 rounded-full mb-3 object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 mb-3 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
          <div className="text-center">
            <p className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Von </span>
              <span className="font-semibold text-off-black dark:text-white">
                {article.autor?.name || "Redaktion"}
              </span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formatDate(article.datum)}
              <span> · {article.lesedauer || calculateReadingTime(article.inhalt || ARTICLE_TEXT)} Min. Lesezeit</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 mt-6 pb-8 border-b border-gray-200 dark:border-gray-700">
          <ShareButton
            title={article.titel}
            text={article.teaser}
            url={typeof window !== "undefined" ? window.location.href : `/artikel/${slug}`}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-off-black dark:text-white"
          />
          <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-off-black dark:text-white">
            <CommentIcon />
          </button>
          <BookmarkButton
            slug={article.slug}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          />
        </div>

        {/* Article Body */}
        {article.premium ? (
          <PaywallGate previewLines={3}>
            {article.inhalt ? (
              <article className="prose prose-lg max-w-none mt-10 space-y-6">
                {article.inhalt.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </article>
            ) : (
              <article className="prose prose-lg max-w-none mt-10 space-y-6">
                <p>{ARTICLE_TEXT}</p>
              </article>
            )}
          </PaywallGate>
        ) : article.inhalt ? (
          <article className="prose prose-lg max-w-none mt-10 space-y-6">
            {article.inhalt.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </article>
        ) : (
          <>
            <article className="prose prose-lg max-w-none mt-10 space-y-6">
              <p>
                Der Sieg war mehr als verdient. Von Beginn an zeigte die Mannschaft, dass sie
                es ernst meinte mit dem Angriff auf die Tabellenspitze. Bereits in der fünften
                Minute setzte der Mittelfeldspieler das erste Ausrufezeichen, als sein Schuss
                nur knapp am Pfosten vorbeiging. Die Fans auf den Rängen spürten sofort: Heute
                würde etwas Besonderes passieren.
              </p>

              <p>
                Die Defensive stand sicher, das Mittelfeld kontrollierte das Spiel mit
                beeindruckender Souveränität. &ldquo;Wir haben genau das umgesetzt, was wir uns
                vorgenommen hatten&rdquo;, erklärte der Trainer nach dem Spiel. &ldquo;Die Jungs haben
                von der ersten bis zur letzten Minute gezeigt, dass sie bereit sind für die
                großen Aufgaben.&rdquo; Seine Worte hallten durch die Mixed Zone, während draußen
                die Fans noch immer feierten.
              </p>

              <p>
                Das 1:0 fiel dann in der 34. Minute – ein sehenswert herausgespielter Treffer
                über mehrere Stationen. Der Stürmer vollendete nach einer butterweichen Flanke
                von der rechten Seite per Kopf. Es war sein achter Saisontreffer und unterstrich
                einmal mehr seine Klasse. Die gegnerische Abwehr stand wie angewurzelt, konnte
                dem perfekt getimten Laufweg nichts entgegensetzen.
              </p>

              <p>
                Zur Halbzeit führte das Heimteam verdient. In der Kabine schwor der Kapitän
                seine Mitspieler ein: &ldquo;45 Minuten noch, dann haben wir es geschafft.&rdquo; Die
                Ansprache zeigte Wirkung. Nach dem Seitenwechsel drückten die Gäste zwar auf
                den Ausgleich, doch die Abwehrreihe hielt stand. Jeder Zweikampf wurde
                angenommen, jeder Ball mit letztem Einsatz verteidigt.
              </p>

              <p>
                Die taktische Umstellung des Trainers erwies sich als Geniestreich. Mit einer
                Fünferkette und zwei schnellen Außenbahnspieler wurden die Räume eng gemacht.
                Der gegnerische Spielaufbau lief ins Leere, immer wieder prallten die Angriffe
                an der kompakten Formation ab. &ldquo;Wir haben heute gezeigt, dass wir auch defensiv
                auf höchstem Niveau agieren können&rdquo;, lobte der Co-Trainer später.
              </p>
            </article>

            {/* Inline Image */}
            <div className="-mx-4 sm:-mx-6 md:-mx-16 lg:-mx-32 my-10">
              {article.bild && (
                <div className="relative aspect-[21/9] bg-gray-200 dark:bg-gray-800">
                  <Image
                    src={article.bild.url}
                    alt="Spielszene"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3 px-4">
                Spielszene aus der zweiten Halbzeit
                <span className="italic text-gray-400 dark:text-gray-500"> — Foto: Redaktion</span>
              </p>
            </div>

            {/* More Content */}
            <article className="prose prose-lg max-w-none space-y-6">
              <p>
                In der 78. Minute dann die Entscheidung: Ein Konter wie aus dem Lehrbuch,
                abgeschlossen vom eingewechselten Youngster, der damit sein erstes Profitor
                erzielte. Die Fans feierten ihn frenetisch. Mit gerade einmal 18 Jahren steht
                er nun in den Geschichtsbüchern des Vereins. &ldquo;Das ist ein Traum&rdquo;, sagte er
                mit Tränen in den Augen nach dem Abpfiff.
              </p>

              <p>
                Die Schlussphase wurde dann noch einmal hitzig. Zwei Gelbe Karten auf jeder
                Seite zeugten von der Intensität dieser Partie. Doch das Heimteam ließ sich
                nicht aus der Ruhe bringen. Mit kluger Spielverzögerung und sicherem Passspiel
                wurde die Zeit heruntergewürfelt. Als der Schiedsrichter schließlich abpfiff,
                kannte der Jubel keine Grenzen.
              </p>

              <p>
                Mit diesem Sieg schiebt sich das Team auf Platz drei der Tabelle vor. Nur noch
                zwei Punkte trennen sie vom Tabellenführer. &ldquo;Wir schauen von Spiel zu Spiel&rdquo;,
                betont der Kapitän bescheiden, doch die Ambitionen sind unverkennbar. Die
                Mannschaft hat Blut geleckt und will jetzt den ganz großen Wurf.
              </p>

              <p>
                Am kommenden Samstag wartet bereits die nächste Bewährungsprobe. Im Auswärtsspiel
                beim direkten Konkurrenten wird sich zeigen, ob die Mannschaft auch auswärts so
                souverän auftreten kann. Die Fans jedenfalls sind optimistisch – der Gästeblock
                ist bereits ausverkauft. Über 2.000 Anhänger werden die Reise antreten und ihr
                Team lautstark unterstützen. Die Saison könnte noch sehr lang und sehr erfolgreich
                werden.
              </p>
            </article>
          </>
        )}

        {/* Author Box */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-12">
          <div className="flex items-start gap-4">
            {article.autor?.bild ? (
              <Image src={article.autor.bild} alt={article.autor?.name || "Autor"} width={48} height={48} className="w-12 h-12 rounded-full flex-shrink-0 object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
            <div>
              <p className="font-semibold text-off-black dark:text-white">
                {article.autor?.name || "Redaktion"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Fußball-Woche
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "")}`}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-mint dark:hover:bg-green-900/30 text-sm font-medium text-off-black dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 hover:border-forest-green transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <MarkAsReadButton articleId={article.id} />
        </div>

        {/* Feedback */}
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-400 dark:text-gray-500">Hat dir dieser Artikel gefallen?</span>
          <FeedbackButton pageUrl={`/artikel/${slug}`} context="article" />
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="border-t-4 border-off-black dark:border-white pt-6 mt-10 pb-12">
            <h2 className="font-headline text-2xl text-off-black dark:text-white mb-6">Lies auch</h2>

            <div className="space-y-0">
              {relatedArticles.map((related) => (
                <article key={related.slug} className="py-5 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <Link href={`/artikel/${related.slug}`} className="group flex gap-4 sm:gap-6">
                    {related.bild && (
                      <div className="w-[100px] sm:w-[180px] aspect-[3/2] relative flex-shrink-0 overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800">
                        <Image
                          src={related.bild.url}
                          alt={related.bild.alt}
                          fill
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="text-base sm:text-lg font-semibold text-off-black dark:text-white leading-snug line-clamp-2 group-hover:text-forest-green dark:group-hover:text-green-400 transition-colors">
                        {related.titel}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1.5 line-clamp-2 text-sm hidden sm:block">
                        {related.teaser}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {related.autor && <span>{related.autor.name}</span>}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return artikel.map((article) => ({
    slug: article.slug,
  }));
}
