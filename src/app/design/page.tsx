"use client";

import Link from "next/link";

// Proxy fonts loaded via Google Fonts in the style block below:
// Söhne → Inter
// Söhne Mono → JetBrains Mono
// Söhne Schmal → Barlow Condensed (Bold Italic for headlines)

const COLORS = {
  neonGreen: "#28D200",
  darkGreen: "#144B23",
  forestOld: "#044110",
  orangeOld: "#FC401D",
  black: "#000000",
  white: "#FFFFFF",
  offWhite: "#FAFAFA",
  gray100: "#F3F4F6",
  gray300: "#D1D5DB",
  gray500: "#6B7280",
  gray700: "#374151",
  gray900: "#111827",
};

const LIGA_TAGS = [
  "Regionalliga",
  "Berlin-Liga",
  "Frauen",
  "Berliner Fussball",
  "Oberliga",
  "Jugend",
];

const MOCK_ARTICLES = [
  {
    tag: "Berlin-Liga",
    title: "Stern 1900 empfängt Empor Berlin zum Spitzenspiel",
    subtitle: "Aufstiegsrennen spitzt sich zu — Stern braucht drei Punkte",
    author: "Max Mustermann",
    date: "11. März 2026",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop",
  },
  {
    tag: "Frauen",
    title: "Viktoria Berlin jetzt allein davon. Der Negativlauf des 1. FC Union Berlin",
    subtitle: "Drei Niederlagen in Folge — was ist los bei Union?",
    author: "Lisa Schmidt",
    date: "10. März 2026",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop",
  },
  {
    tag: "Regionalliga",
    title: "Berliner AK präsentiert Jeffrey Seitz als neuen Cheftrainer",
    subtitle: "Dramatische Lage in Britz — der BAK sucht den Neuanfang",
    author: "Tino Loest",
    date: "9. März 2026",
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&h=400&fit=crop",
  },
];

function ColorSwatch({ color, name, hex }: { color: string; name: string; hex: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-20 h-20 rounded-xl shadow-md border border-black/10"
        style={{ backgroundColor: color }}
      />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: COLORS.gray500 }}>
        {hex}
      </span>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600 }}>
        {name}
      </span>
    </div>
  );
}

function LigaTag({ label }: { label: string }) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.02em",
        background: COLORS.neonGreen,
        color: COLORS.black,
        padding: "3px 8px",
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

function ArticleCard({ article }: { article: typeof MOCK_ARTICLES[0] }) {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="relative overflow-hidden rounded-sm mb-3" style={{ aspectRatio: "3/2" }}>
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="mb-2">
        <LigaTag label={article.tag} />
      </div>
      <h3
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontStyle: "italic",
          fontSize: "1.4rem",
          lineHeight: 1.15,
          color: COLORS.black,
          marginBottom: "0.4rem",
        }}
      >
        {article.title}
      </h3>
      <p style={{ fontSize: "0.9rem", color: COLORS.gray500, lineHeight: 1.5, marginBottom: "0.5rem" }}>
        {article.subtitle}
      </p>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.7rem",
          color: COLORS.gray500,
        }}
      >
        {article.author} — {article.date}
      </span>
    </div>
  );
}

function SonderausgabeCard({ article }: { article: typeof MOCK_ARTICLES[0] }) {
  return (
    <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "3/4" }}>
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
        }}
      />
      {/* Masthead */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between">
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontStyle: "italic",
            fontSize: "1.8rem",
            color: COLORS.white,
          }}
        >
          FuWo
        </span>
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontStyle: "italic",
            fontSize: "0.85rem",
            color: COLORS.white,
            textAlign: "right",
            lineHeight: 1.3,
          }}
        >
          Fußball-Woche
        </span>
      </div>
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            color: COLORS.gray300,
            letterSpacing: "0.02em",
          }}
        >
          {article.tag}
        </span>
        <h3
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontStyle: "italic",
            fontSize: "1.6rem",
            lineHeight: 1.1,
            color: COLORS.white,
            marginTop: "0.25rem",
          }}
        >
          {article.title}
        </h3>
        {/* Liga tags bar */}
        <div className="flex gap-2 mt-3">
          {LIGA_TAGS.slice(0, 4).map((tag) => (
            <LigaTag key={tag} label={tag} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DesignPreview() {
  return (
    <>
      {/* Google Fonts for proxy */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600;1,700;1,800&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.offWhite, minHeight: "100vh" }}>
        {/* Navigation bar */}
        <Link
          href="/"
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            zIndex: 100,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.75rem",
            background: COLORS.gray900,
            color: COLORS.gray300,
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Zurueck zur App
        </Link>

        {/* Header Preview */}
        <header
          style={{
            background: COLORS.darkGreen,
            color: COLORS.white,
            padding: "0 1.5rem",
            height: "48px",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          {/* Burger */}
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ opacity: 0.7 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>

          {/* Logo */}
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontStyle: "italic",
              fontSize: "1.5rem",
              letterSpacing: "-0.02em",
              color: COLORS.white,
            }}
          >
            FuWo
          </span>
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontStyle: "italic",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.6)",
              display: "none",
            }}
            className="sm:inline"
          >
            Fußball-Woche
          </span>

          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)", margin: "0 0.5rem" }} />

          {/* Nav items */}
          {["Herren", "Frauen", "Jugend", "Pokal"].map((item) => (
            <span
              key={item}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "rgba(255,255,255,0.7)",
                cursor: "pointer",
                display: "none",
              }}
              className="md:inline"
            >
              {item}
            </span>
          ))}

          <div style={{ flex: 1 }} />

          {/* Search + User */}
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ opacity: 0.7 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </header>

        {/* Section: Intro */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 1.5rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: COLORS.neonGreen,
              }}
            >
              Design Preview
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontStyle: "italic",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              lineHeight: 0.95,
              color: COLORS.black,
              marginBottom: "1rem",
            }}
          >
            FuWo Redesign
          </h1>
          <p style={{ fontSize: "1.1rem", color: COLORS.gray500, maxWidth: 560, lineHeight: 1.6 }}>
            Design-System Preview basierend auf Peer Hempels Redesign-Präsentation.
            Proxy-Fonts: Inter (Söhne), JetBrains Mono (Söhne Mono), Barlow Condensed (Söhne Schmal).
          </p>
        </div>

        {/* Section: Farben */}
        <section style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: "1.8rem",
              color: COLORS.black,
              marginBottom: "0.5rem",
            }}
          >
            Farbpalette
          </h2>
          <p style={{ fontSize: "0.85rem", color: COLORS.gray500, marginBottom: "2rem" }}>
            Neu (oben) vs. Alt (unten)
          </p>

          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: COLORS.neonGreen,
              marginBottom: "0.75rem",
            }}
          >
            Neu
          </p>
          <div className="flex flex-wrap gap-6 mb-8">
            <ColorSwatch color={COLORS.neonGreen} name="Neon Green" hex="#28D200" />
            <ColorSwatch color={COLORS.darkGreen} name="Dark Green" hex="#144B23" />
            <ColorSwatch color={COLORS.black} name="Black" hex="#000000" />
            <ColorSwatch color={COLORS.white} name="White" hex="#FFFFFF" />
          </div>

          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: COLORS.gray500,
              marginBottom: "0.75rem",
            }}
          >
            Alt (aktuell in der App)
          </p>
          <div className="flex flex-wrap gap-6 mb-4">
            <ColorSwatch color={COLORS.forestOld} name="Forest Green" hex="#044110" />
            <ColorSwatch color={COLORS.orangeOld} name="Electric Orange" hex="#FC401D" />
            <ColorSwatch color="#D0FDDA" name="Mint" hex="#D0FDDA" />
            <ColorSwatch color={COLORS.offWhite} name="Off-White" hex="#FAFAFA" />
          </div>
        </section>

        <hr style={{ maxWidth: 960, margin: "0 auto", border: "none", borderTop: `1px solid ${COLORS.gray300}` }} />

        {/* Section: Typografie */}
        <section style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: "1.8rem",
              color: COLORS.black,
              marginBottom: "1.5rem",
            }}
          >
            Typografie
          </h2>

          {/* Headline font */}
          <div className="mb-8">
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: COLORS.neonGreen,
                marginBottom: "0.5rem",
              }}
            >
              Söhne Schmal → Barlow Condensed (Proxy)
            </p>
            <p
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontStyle: "italic",
                fontSize: "3.5rem",
                lineHeight: 0.95,
                color: COLORS.black,
              }}
            >
              Der pure Wahnsinn<br />Eiskalt vor dem Tor
            </p>
          </div>

          {/* Body font */}
          <div className="mb-8">
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: COLORS.neonGreen,
                marginBottom: "0.5rem",
              }}
            >
              Söhne → Inter (Proxy)
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: 1.7, color: COLORS.gray700, maxWidth: 600 }}>
              Seit über 103 Jahren begleitet die Fussball-Woche den Berliner Amateurfußball.
              Kaum ein anderes Medium ist so eng mit der lokalen Fußballkultur verbunden.
              Generationen von Spielerinnen, Spielern, Trainern und Fans sind mit ihr aufgewachsen.
            </p>
          </div>

          {/* Mono font */}
          <div className="mb-4">
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: COLORS.neonGreen,
                marginBottom: "0.5rem",
              }}
            >
              Söhne Mono → JetBrains Mono (Proxy)
            </p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: COLORS.gray700 }}>
              Montag, 13. Oktober 26 — 103. Jahrgang — Nr. 1 — 2,50 EUR
            </p>
          </div>
        </section>

        <hr style={{ maxWidth: 960, margin: "0 auto", border: "none", borderTop: `1px solid ${COLORS.gray300}` }} />

        {/* Section: Liga Tags */}
        <section style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: "1.8rem",
              color: COLORS.black,
              marginBottom: "1.5rem",
            }}
          >
            Liga-Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {LIGA_TAGS.map((tag) => (
              <LigaTag key={tag} label={tag} />
            ))}
          </div>
        </section>

        <hr style={{ maxWidth: 960, margin: "0 auto", border: "none", borderTop: `1px solid ${COLORS.gray300}` }} />

        {/* Section: Buttons */}
        <section style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: "1.8rem",
              color: COLORS.black,
              marginBottom: "1.5rem",
            }}
          >
            Buttons
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <button
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                background: COLORS.neonGreen,
                color: COLORS.darkGreen,
                border: "none",
                padding: "0.7rem 1.5rem",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Jetzt lesen
            </button>
            <button
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                background: COLORS.darkGreen,
                color: COLORS.white,
                border: "none",
                padding: "0.7rem 1.5rem",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Abonnieren
            </button>
            <button
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem",
                background: "transparent",
                color: COLORS.darkGreen,
                border: `2px solid ${COLORS.darkGreen}`,
                padding: "0.6rem 1.5rem",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Mehr erfahren
            </button>
            <button
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem",
                background: COLORS.black,
                color: COLORS.white,
                border: "none",
                padding: "0.7rem 1.5rem",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Eintragen
            </button>
          </div>
        </section>

        <hr style={{ maxWidth: 960, margin: "0 auto", border: "none", borderTop: `1px solid ${COLORS.gray300}` }} />

        {/* Section: Article Cards */}
        <section style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: "1.8rem",
              color: COLORS.black,
              marginBottom: "1.5rem",
            }}
          >
            Artikel-Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_ARTICLES.map((article, i) => (
              <ArticleCard key={i} article={article} />
            ))}
          </div>
        </section>

        <hr style={{ maxWidth: 960, margin: "0 auto", border: "none", borderTop: `1px solid ${COLORS.gray300}` }} />

        {/* Section: Sonderausgabe Cover */}
        <section style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: "1.8rem",
              color: COLORS.black,
              marginBottom: "1.5rem",
            }}
          >
            Sonderausgabe-Cover (Digital)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ maxWidth: 720 }}>
            {MOCK_ARTICLES.map((article, i) => (
              <SonderausgabeCard key={i} article={article} />
            ))}
          </div>
        </section>

        <hr style={{ maxWidth: 960, margin: "0 auto", border: "none", borderTop: `1px solid ${COLORS.gray300}` }} />

        {/* Section: Dark Mode Preview */}
        <section
          style={{
            background: COLORS.darkGreen,
            padding: "3rem 1.5rem",
            marginTop: "2rem",
          }}
        >
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontStyle: "italic",
                fontSize: "1.8rem",
                color: COLORS.white,
                marginBottom: "1.5rem",
              }}
            >
              Dark Mode Preview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_ARTICLES.map((article, i) => (
                <div key={i} style={{ fontFamily: "'Inter', sans-serif" }}>
                  <div className="relative overflow-hidden rounded-sm mb-3" style={{ aspectRatio: "3/2" }}>
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="mb-2">
                    <LigaTag label={article.tag} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontStyle: "italic",
                      fontSize: "1.4rem",
                      lineHeight: 1.15,
                      color: COLORS.white,
                      marginBottom: "0.4rem",
                    }}
                  >
                    {article.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                    {article.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Full Masthead Preview */}
        <section style={{ background: COLORS.black, padding: "4rem 1.5rem" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontStyle: "italic",
                fontSize: "clamp(4rem, 12vw, 8rem)",
                color: COLORS.neonGreen,
                lineHeight: 0.9,
                display: "block",
              }}
            >
              FuWo
            </span>
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontStyle: "italic",
                fontSize: "clamp(1rem, 3vw, 1.5rem)",
                color: "rgba(255,255,255,0.4)",
                display: "block",
                marginTop: "0.5rem",
              }}
            >
              Fußball-Woche
            </span>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.3)",
                marginTop: "2rem",
              }}
            >
              traditionell — modern · bodenständig — selbstbewusst · nahbar — prägnant
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ textAlign: "center", padding: "2rem 1.5rem", background: COLORS.offWhite }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: COLORS.gray500,
            }}
          >
            Design Preview — Proxy-Fonts (nicht final) — Nur interne Ansicht
          </p>
        </footer>
      </div>
    </>
  );
}
