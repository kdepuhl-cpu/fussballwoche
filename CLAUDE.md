# CLAUDE.md – DIAGO

## Projektübersicht
DIAGO ist eine News-PWA für Berliner Amateurfußball-Fans. Inspiriert von der "Fußball-Woche", einer Berliner Print-Institution die 2024 eingestellt wurde.

**Ziel:** Lokale Fußball-News aus verschiedenen Ligen an einem Ort – von Bundesliga bis Kreisliga.

**Design-Vorbild:** The Athletic

---

## Tech-Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Sprache:** TypeScript
- **Backend:** Supabase (PostgreSQL, Auth, RLS, RPC)
- **PWA:** Manifest + Install Prompt
- **Deployment:** Netlify (Static Export, `output: "export"`)

---

## Deployment
- **GitHub:** `kdepuhl-cpu/diago`
- **Netlify:** https://diagonista.netlify.app/
- **Branch `main`:** Produktions-Code, Auto-Deploy bei Push
- **Netlify CLI:** Projekt gelinkt (`netlify link`)
- **Environment Variables** (Netlify): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_ADMIN_EMAILS`
- **Build:** `npm run build` → Publish-Dir: `out`

### Wichtige Constraints
- `output: "export"` → alle dynamischen Seiten brauchen `generateStaticParams()`
- `"use client"` + `generateStaticParams()` geht NICHT — Server Component nötig
- Root `layout.tsx` darf NICHT `"use client"` sein (Metadata + Error Boundaries)
- Supabase-Client wird nur erstellt wenn env vars vorhanden (Build-Schutz)

---

## Supabase Backend

### Tabellen
| Tabelle | Zweck |
|---------|-------|
| `profiles` | User-Profile (display_name, favorite_club_ids, bezirk, reader_points, articles_read) |
| `bookmarks` | Gespeicherte Artikel (user_id + article_slug) |
| `match_votes` | Tippspiel-Votes (user_id, match_id, vote: 1/X/2) |
| `match_results` | Admin-Ergebnisse (match_id, result: 1/X/2) |

### RPC-Funktionen
- `record_article_read(p_article_slug)` — Artikel als gelesen markieren, +10 Punkte, Duplikat-Schutz
- `get_vote_stats(p_match_id)` — Aggregierte Vote-Prozentsätze pro Match

### RLS-Policies
- Profiles: User sieht/editiert nur eigenes Profil
- Bookmarks: User sieht/erstellt/löscht nur eigene
- match_votes: User sieht eigene, kann erstellen (kein Update/Delete)
- match_results: Alle lesen, nur Admin (`kdepuhl@gmail.com`) kann INSERT/UPDATE

### SQL-Migrationen
```
supabase/migrations/
├── 001_initial.sql
├── 002_admin_policies.sql
├── 003_user_profiles.sql
├── 004_tippspiel.sql (match_votes + match_results + RPC)
└── 006_reader_score.sql (reader_points + articles_read + RPC)
```

### API-Layer (`src/lib/api/`)
- `profile.ts` — Profile CRUD, Bookmarks CRUD, recordArticleRead, getReaderLevel, syncLocalBookmarks
- `votes.ts` — submitVote, getUserVote(s), getVoteStats, getScoreboard, setMatchResult
- `admin.ts` — Admin-Queries

---

## Design-System

### Farben
| Name | Hex | Verwendung |
|------|-----|------------|
| Forest Green | `#044110` | Primary, aktive Tabs, Buttons, Vote-Akzent |
| Electric Orange | `#FC401D` | Akzente, Dachzeilen, CTAs, Progress Bar |
| Mint Green | `#D0FDDA` | Subtle Backgrounds, Hover |
| Off White | `#FAFAFA` | Page Background (Light Mode) |
| Off Black | `#1F1F1F` | Header, Text, Footer |

### Dark Mode
- Aktiviert via `darkMode: "class"` in Tailwind
- Toggle im Header (Sonne/Mond Icon)
- Speicherung in localStorage + System-Präferenz

### Typografie
| Verwendung | Font | Quelle |
|------------|------|--------|
| Headlines | Manuka Bold | `public/fonts/manuka-bold.woff2` |
| Subheadings | Manrope Bold | Google Fonts |
| Body | Manrope Regular | Google Fonts |

---

## Projektstruktur
```
src/
├── app/
│   ├── layout.tsx (Providers: ToastProvider + UserAuthProvider)
│   ├── page.tsx (Startseite: LiveTicker, Hero, Jobs, VideoReels)
│   ├── artikel/[slug]/page.tsx (Artikel-Detail + ReadingTracker)
│   ├── liga/[slug]/page.tsx (Liga-Seiten mit Tabelle)
│   ├── spiel/[id]/page.tsx (Match-Detail + VoteButtons)
│   ├── tippspiel/page.tsx (Scoreboard / Rangliste)
│   ├── jobs/page.tsx (Job-Übersicht)
│   ├── jobs/[id]/page.tsx (Job-Detail)
│   ├── jobs/kategorie/[slug]/page.tsx (Jobs nach Kategorie)
│   ├── login/page.tsx (Auth)
│   ├── onboarding/page.tsx (3-Step: Name, Vereine, Bezirk)
│   ├── profil/page.tsx (User-Profil)
│   ├── gespeichert/page.tsx (Bookmarks)
│   ├── admin/page.tsx (Dashboard)
│   ├── admin/articles/... (Artikel CRUD)
│   ├── admin/clubs/... (Vereine CRUD)
│   ├── admin/jobs/... (Jobs CRUD)
│   ├── admin/votes/page.tsx (Tippspiel-Ergebnisse eintragen)
│   ├── admin/login/page.tsx (Admin-Auth)
│   ├── tag/[slug]/page.tsx (Tag-Seiten)
│   └── offline/page.tsx (PWA Offline)
├── components/
│   ├── navigation/
│   │   ├── Header.tsx (Herren|Frauen|Pokal|Jugend + Jobs, Tippspiel)
│   │   └── Footer.tsx (Kurzpass Newsletter)
│   ├── artikel/
│   │   ├── HeroSection.tsx (Hero + Sidebar Grid)
│   │   ├── HeroArticle.tsx
│   │   ├── MostPopular.tsx (Meistgelesen)
│   │   ├── ReadingProgressBar.tsx
│   │   ├── ReadingTracker.tsx (30s Timer → Reader Score)
│   │   ├── MarkAsReadButton.tsx
│   │   └── MarkAsReadOnView.tsx
│   ├── tippspiel/
│   │   └── VoteButtons.tsx (Segmented 1|X|2 Pill)
│   ├── jobs/
│   │   └── JobHighlights.tsx (Horizontal Cards für Startseite)
│   ├── user/
│   │   └── UserMenu.tsx (Avatar-Dropdown + Reader Score)
│   ├── admin/
│   │   ├── Sidebar.tsx
│   │   └── AdminGuard.tsx
│   ├── LiveTicker.tsx (DIAGO Topspiele Widget)
│   ├── LeagueResults.tsx (Spieltag-Ansicht + VoteButtons)
│   ├── VideoReels.tsx (Video-Karussell)
│   ├── VideoModal.tsx (Video-Player Modal)
│   ├── Providers.tsx (ToastProvider + UserAuthProvider)
│   └── ui/
│       ├── Toast.tsx (ToastProvider)
│       ├── SearchOverlay.tsx (Cmd+K)
│       ├── BookmarkButton.tsx (Supabase-first + localStorage)
│       ├── ShareButton.tsx
│       ├── NewBadge.tsx ("Neu" für <24h)
│       ├── ReadBadge.tsx (Gelesen-Haken)
│       ├── FavoritesBadge.tsx ("Dein Verein")
│       ├── PWAInstallPrompt.tsx
│       ├── ScrollToTop.tsx
│       └── Skeleton.tsx
├── hooks/
│   ├── useReadArticles.ts (localStorage)
│   ├── useBookmarks.ts (Supabase-first + localStorage-Fallback)
│   ├── useTheme.ts (Dark Mode)
│   └── useKeyboardNavigation.ts (j/k)
├── lib/
│   ├── supabase.ts (Client-Init mit Build-Schutz)
│   ├── types.ts (Artikel, Liga, etc.)
│   ├── data.ts (Artikel-Daten)
│   ├── leagues.ts (30+ Ligen inkl. Jugend)
│   ├── jobs.ts (Job-Daten)
│   ├── utils.ts (calculateReadingTime)
│   ├── user/
│   │   └── auth.tsx (UserAuthProvider Context)
│   ├── api/
│   │   ├── profile.ts (Profile, Bookmarks, Reader Score)
│   │   ├── votes.ts (Tippspiel CRUD + Scoreboard)
│   │   └── admin.ts (Admin-Queries)
│   └── mock/
│       ├── matches.ts (Ergebnis-Daten, 12 Berliner Vereine)
│       └── videos.ts (Video-Daten)
└── styles/
    └── globals.css
```

---

## Ligen-System (`lib/leagues.ts`)

**30+ Ligen, 80+ Slugs** (inkl. Staffeln + Jugend)

### Kategorien
- **Herren (Tier 1-11):** Bundesliga → 2. Bundesliga → 3. Liga → Regionalliga NO → Berlin-Liga → Landesliga → Bezirksliga → Kreisliga A/B/C
- **Frauen (Tier 1-6):** Frauen-BL → 2. Frauen-BL → Frauen-RL NO → Frauen Berlin-Liga → Frauen-LL → Frauen-BZL
- **Pokal:** DFB-Pokal, DFB-Pokal Frauen, Berliner Pilsner-Pokal, Polytan-Pokal
- **Jugend:** A-Jugend Verbandsliga, A-Jugend Landesliga, B-Jugend Verbandsliga, B-Jugend Landesliga, C-Jugend Verbandsliga, C-Jugend Landesliga

### Liga-Naming
Eindeutige shortNames: "Berlin-Liga" (nicht "BL"), "Frauen-BL" (nicht "F-BL"), Jugend mit Altersklasse

### Helper-Funktionen
- `getLeaguesByCategory(category)` – Ligen nach Kategorie
- `getLeagueBySlug(slug)` – Liga per Slug finden
- `getLeagueById(id)` – Liga per ID finden
- `getStaffelBySlug(slug)` – Staffel per Slug finden
- `getAllLeagueSlugs()` – Alle Slugs für Static Params

---

## Features

### Phase 1 — Core (done) ✅

**Content & Navigation:**
- [x] Startseite mit Hero + Sidebar Layout (Athletic-Style)
- [x] Artikel-Detailseite mit Reading Progress Bar
- [x] Liga-Seiten mit Tabelle & Spielplan
- [x] Liga-Navigation (Herren|Frauen|Pokal|Jugend Dropdowns)
- [x] DIAGO Topspiele Widget (dynamischer Spieltag + Logo)
- [x] Video-Reels Karussell (9:16) + Video-Modal
- [x] Tag-Seiten, Suche (Cmd+K), Meistgelesen-Sektion

**Jobs:**
- [x] Job-Listings für Berliner Fußball (Trainer, Spieler, Ehrenamt)
- [x] Job-Detail-Seiten + Kategorie-Filter
- [x] Job-Highlights auf Startseite (horizontale Cards)

**PWA & UI:**
- [x] PWA Manifest + Install Prompt + Offline-Seite
- [x] Dark Mode (Toggle + System-Präferenz)
- [x] Toast-Benachrichtigungen, Skeleton States, Mobile Menu
- [x] Share Button, Scroll-to-Top, Keyboard Navigation (j/k)

### Phase 2 — Backend & User (done) ✅

**Supabase Backend:**
- [x] Supabase-Integration (Auth, DB, RLS, RPC)
- [x] API-Layer (profile.ts, votes.ts, admin.ts)

**Admin-Dashboard:**
- [x] `/admin` mit Auth-Schutz (AdminGuard, email-basiert)
- [x] Artikel-, Vereine-, Jobs-CRUD
- [x] Tippspiel-Ergebnisse eintragen (`/admin/votes`)

**User-Accounts:**
- [x] Login/Register (`/login`)
- [x] 3-Step Onboarding (Name, Vereine, Bezirk)
- [x] Profil-Seite (`/profil`)
- [x] UserMenu im Header (Avatar-Dropdown)
- [x] "Mein Verein" Personalisierung (FavoritesSection + FavoritesBadge)
- [x] Bookmarks: Supabase-first + localStorage-Fallback

**Tippspiel:**
- [x] 1-X-2 Voting pro Spiel (VoteButtons Segmented Pill)
- [x] Prozentanzeige nach Vote (mit 15% Minimum-Floor)
- [x] Match-Detail-Seite (`/spiel/[id]`)
- [x] Scoreboard / Rangliste (`/tippspiel`)
- [x] VoteButtons in LiveTicker + LeagueResults (compact)
- [x] Login-Hinweis für nicht-eingeloggte User

**Reader Score / Gamification:**
- [x] 30s Lesezeit → 10 Punkte (ReadingTracker)
- [x] Duplikat-Schutz (articles_read Array)
- [x] Leser-Level im UserMenu mit Progress Bar
- [x] `calculateReadingTime()` Utility

### Phase 3 — Eigene Daten (next) 🚀

- [ ] Echte Tabellen-API (fussball.de Scraper oder manuelle Eingabe)
- [ ] Echte Ergebnis-API
- [ ] Artikel-CMS (Supabase statt Mock-Daten)
- [ ] Verein-Profile mit echten Daten
- [ ] Push-Notifications

### Phase 4 — Community

- [ ] Kommentar-System
- [ ] Leaderboard (Top-Leser)
- [ ] Streaks (Tägliches Lesen)
- [ ] User-generierte Inhalte

---

## Reader Score System

### Punkte
- 10 Punkte pro gelesenem Artikel (nach 30s Lesezeit)
- Gespeichert in Supabase (`profiles.reader_points` + `profiles.articles_read`)
- RPC `record_article_read` mit Duplikat-Schutz

### Level
| Level | Punkte | Name |
|-------|--------|------|
| 1 | 0–99 | Kreisliga-Leser |
| 2 | 100–499 | Bezirksliga-Leser |
| 3 | 500–999 | Landesliga-Leser |
| 4 | 1000+ | Berlin-Liga-Leser |

### Anzeige
- UserMenu: Level-Name + Punktzahl + Progress Bar (forest-green)

---

## Coding-Regeln

### Sprache
- **Code:** Englisch (Variablen, Funktionen)
- **Content/UI:** Deutsch (Texte, Labels)

### Komponenten
- Functional Components mit TypeScript
- Props immer typisieren
- Eine Komponente pro Datei
- Mobile-first entwickeln

### Styling
- Tailwind CSS Utility Classes
- Dark Mode: immer `dark:` Varianten hinzufügen
- Keine separaten CSS-Dateien außer globals.css

### Git
- Kleine, fokussierte Commits
- Commit-Messages auf Deutsch
- Format: `feat:`, `fix:`, `chore:`

---

## Mock-Daten

### Berliner Vereine (`lib/mock/matches.ts`)
BAK, Tennis Borussia, Türkiyemspor, VSG Altglienicke, BFC Dynamo, Hertha Zehlendorf, Viktoria Berlin, Croatia Berlin, SC Staaken, Füchse Berlin Reinickendorf, Sparta Lichtenberg, Stern 1900

### Video-Plattformen (`lib/mock/videos.ts`)
Instagram Reels, TikTok, YouTube Shorts

---

## Bekannte Issues
- [ ] PWA braucht noch PNG Icons (192x192, 512x512)
- [ ] Nur SVG Icons vorhanden

---

## Kontakt / Kontext
Bei Unklarheiten: Nachfragen! Lieber einmal mehr fragen als falsch bauen.
