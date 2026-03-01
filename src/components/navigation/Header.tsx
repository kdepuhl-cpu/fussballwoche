"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/hooks/useTheme";
import SearchOverlay from "@/components/ui/SearchOverlay";
import { useUser } from "@/lib/user/auth";
import UserMenu from "@/components/user/UserMenu";
import {
  getLeaguesByCategory,
  hasStaffeln,
  LeagueCategory,
  League,
} from "@/lib/leagues";

const categories: { id: LeagueCategory; label: string }[] = [
  { id: "herren", label: "Herren" },
  { id: "frauen", label: "Frauen" },
  { id: "jugend", label: "Jugend" },
  { id: "pokal", label: "Pokal" },
];

// Chevron icon component
function ChevronIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<LeagueCategory | null>(null);
  const [expandedLeague, setExpandedLeague] = useState<string | null>(null);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<LeagueCategory | null>(null);
  const [mobileExpandedLeague, setMobileExpandedLeague] = useState<string | null>(null);
  const { theme, toggleTheme, mounted } = useTheme();
  const { user, loading: authLoading, signOut } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [navOverflowing, setNavOverflowing] = useState(false);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect scroll for header shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut for search (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Detect nav overflow for Athletic-style "..." indicator
  const checkOverflow = useCallback(() => {
    const el = navContainerRef.current;
    if (el) {
      setNavOverflowing(el.scrollWidth > el.clientWidth + 2);
    }
  }, []);

  useEffect(() => {
    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    if (navContainerRef.current) {
      observer.observe(navContainerRef.current);
    }
    return () => observer.disconnect();
  }, [checkOverflow]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveCategory(null);
        setExpandedLeague(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleCategoryEnter = (category: LeagueCategory) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Measure button position relative to the dropdown wrapper
    const btn = categoryRefs.current.get(category);
    const wrapper = dropdownRef.current;
    if (btn && wrapper) {
      const btnRect = btn.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      setDropdownLeft(btnRect.left - wrapperRect.left);
    }
    setActiveCategory(category);
    setExpandedLeague(null);
  };

  const handleCategoryLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
      setExpandedLeague(null);
    }, 150);
  };

  const handleDropdownEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
      setExpandedLeague(null);
    }, 150);
  };

  const renderLeagueItem = (league: League, onClose: () => void) => {
    const hasSubItems = hasStaffeln(league);

    if (hasSubItems) {
      return (
        <div
          key={league.id}
          className="relative"
          onMouseEnter={() => setExpandedLeague(league.id)}
          onMouseLeave={() => setExpandedLeague(null)}
        >
          <div className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer">
            <span>{league.name}</span>
            <ChevronIcon className="w-3 h-3 text-gray-500" />
          </div>

          {/* Staffel Submenu */}
          {expandedLeague === league.id && league.staffeln && (
            <div className="absolute left-full top-0 ml-1 bg-off-black border border-gray-700 rounded-md shadow-lg py-2 min-w-[180px] z-50">
              {/* Link to main league page */}
              <Link
                href={`/liga/${league.slug}`}
                className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white border-b border-gray-700 mb-1"
                onClick={onClose}
              >
                Übersicht
              </Link>
              {league.staffeln.map((staffel) => (
                <Link
                  key={staffel.id}
                  href={`/liga/${staffel.slug}`}
                  className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                  onClick={onClose}
                >
                  {staffel.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={league.id}
        href={`/liga/${league.slug}`}
        className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
        onClick={onClose}
      >
        {league.name}
      </Link>
    );
  };

  return (
    <>
      <header className={`bg-off-black dark:bg-gray-950 text-white border-b border-gray-800 transition-shadow duration-200 ${scrolled ? "header-scrolled" : ""}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-12">
            {/* Burger Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="-ml-2 p-2 hover:bg-white/10 rounded transition-colors mr-2"
              aria-label="Menu öffnen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo — responsive: full "Fußball-Woche" on wide, compact "FuWo" on narrow */}
            <Link href="/" className="flex items-center">
              <Image
                src="/icons/fussball-woche_white.svg"
                alt="Fußball-Woche"
                width={140}
                height={22}
                className="h-5 w-auto hidden lg:block"
              />
              <Image
                src="/icons/fuwo_white.svg"
                alt="Fußball-Woche"
                width={60}
                height={22}
                className="h-5 w-auto lg:hidden"
              />
            </Link>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-600 mx-5 hidden md:block" />

            {/* Desktop Navigation — Athletic-style with overflow fade */}
            <div className="hidden md:flex items-stretch flex-1 relative min-w-0" ref={dropdownRef}>
              <div
                ref={navContainerRef}
                className="flex items-stretch gap-1 overflow-hidden flex-1 min-w-0"
              >
                {/* League category dropdowns — buttons only (dropdowns render below) */}
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    ref={(el) => { if (el) categoryRefs.current.set(cat.id, el); }}
                    className="relative flex-shrink-0"
                    onMouseEnter={() => handleCategoryEnter(cat.id)}
                    onMouseLeave={handleCategoryLeave}
                  >
                    <button
                      className={`px-3 py-3 flex items-center gap-1.5 text-sm font-medium transition-colors relative h-full whitespace-nowrap
                        ${activeCategory === cat.id
                          ? "bg-white/10 text-white"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      {cat.label}
                      <svg
                        className={`w-3 h-3 transition-transform ${activeCategory === cat.id ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {activeCategory === cat.id && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric-orange" />
                      )}
                    </button>
                  </div>
                ))}

                <div className="h-6 w-px bg-gray-700 self-center flex-shrink-0" />

                {/* E-Paper, Tippspiel, Jobs, Vereine */}
                <Link
                  href="/epaper"
                  className="px-3 py-3 flex items-center text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors relative h-full whitespace-nowrap flex-shrink-0"
                >
                  E-Paper
                </Link>

                <Link
                  href="/tippspiel"
                  className="px-3 py-3 flex items-center text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors relative h-full whitespace-nowrap flex-shrink-0"
                >
                  Tippspiel
                </Link>

                <Link
                  href="/jobs"
                  className="px-3 py-3 flex items-center text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors relative h-full whitespace-nowrap flex-shrink-0"
                >
                  Jobs
                </Link>

                <Link
                  href="/vereine"
                  className="px-3 py-3 flex items-center text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors relative h-full whitespace-nowrap flex-shrink-0"
                >
                  Vereine
                </Link>
              </div>

              {/* Overflow fade + dots indicator */}
              {navOverflowing && (
                <div className="flex items-center flex-shrink-0">
                  <div className="w-8 h-full bg-gradient-to-r from-transparent to-off-black dark:to-gray-950 pointer-events-none -ml-8" />
                  <button
                    onClick={() => setMenuOpen(true)}
                    className="px-2 py-3 text-gray-400 hover:text-white transition-colors"
                    aria-label="Mehr anzeigen"
                    title="Mehr"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="5" cy="12" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="19" cy="12" r="2" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Dropdown panels — rendered outside overflow-hidden container */}
              {activeCategory && (
                <div
                  className="absolute top-full mt-0 bg-off-black border border-gray-700 rounded-b-md shadow-lg py-2 min-w-[220px] z-50"
                  style={{ left: `${dropdownLeft}px` }}
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  {getLeaguesByCategory(activeCategory).map((league) =>
                    renderLeagueItem(league, () => {
                      setActiveCategory(null);
                      setExpandedLeague(null);
                    })
                  )}
                </div>
              )}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-white/10 rounded transition-colors"
                aria-label="Suchen"
                title="Suchen (⌘K)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Dark Mode Toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  aria-label={theme === "dark" ? "Light Mode" : "Dark Mode"}
                >
                  {theme === "dark" ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              )}

              {/* User Auth */}
              {!authLoading && (
                user ? (
                  <UserMenu />
                ) : (
                  <Link
                    href="/login"
                    className="hidden md:block ml-1 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Anmelden
                  </Link>
                )
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 z-50 transition-opacity duration-300 ${
            menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          <div
            className={`absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-off-black shadow-2xl transform transition-transform duration-300 ease-out ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <Image
                src="/icons/fussball-woche_white.svg"
                alt="Fußball-Woche"
                width={180}
                height={30}
                className="h-7 w-auto"
              />
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Menu schließen"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100%-65px)]">
              {/* Quick Links — Priority items */}
              <nav className="space-y-1 mb-4">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Startseite
                </Link>
                <Link
                  href="/epaper"
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  E-Paper
                </Link>
                <Link
                  href="/tippspiel"
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tippspiel
                </Link>
                <Link
                  href="/jobs"
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Jobs
                </Link>
              </nav>

              <div className="my-4 border-t border-gray-800" />

              {/* Ligen — Category Accordions */}
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-4 font-semibold">
                Ligen
              </p>
              {categories.map((cat) => (
                <div key={cat.id} className="mb-4">
                  <button
                    onClick={() => setMobileExpandedCategory(
                      mobileExpandedCategory === cat.id ? null : cat.id
                    )}
                    className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-white uppercase tracking-wider bg-gray-800/50 rounded-lg"
                  >
                    {cat.label}
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        mobileExpandedCategory === cat.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {mobileExpandedCategory === cat.id && (
                    <nav className="mt-2 space-y-1">
                      {getLeaguesByCategory(cat.id).map((league) => {
                        const hasSubItems = hasStaffeln(league);

                        if (hasSubItems) {
                          return (
                            <div key={league.id}>
                              <button
                                onClick={() => setMobileExpandedLeague(
                                  mobileExpandedLeague === league.id ? null : league.id
                                )}
                                className="flex items-center justify-between w-full px-4 py-2.5 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                              >
                                <span className="flex items-center gap-3">
                                  <span className="w-1.5 h-1.5 bg-electric-orange rounded-full" />
                                  {league.name}
                                </span>
                                <ChevronIcon
                                  className={`w-3 h-3 transition-transform ${
                                    mobileExpandedLeague === league.id ? "rotate-90" : ""
                                  }`}
                                />
                              </button>

                              {mobileExpandedLeague === league.id && league.staffeln && (
                                <div className="ml-6 mt-1 space-y-1 border-l border-gray-700 pl-4">
                                  <Link
                                    href={`/liga/${league.slug}`}
                                    className="block py-2 text-sm text-gray-400 hover:text-white transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                  >
                                    Übersicht
                                  </Link>
                                  {league.staffeln.map((staffel) => (
                                    <Link
                                      key={staffel.id}
                                      href={`/liga/${staffel.slug}`}
                                      className="block py-2 text-sm text-gray-400 hover:text-white transition-colors"
                                      onClick={() => setMenuOpen(false)}
                                    >
                                      {staffel.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }

                        return (
                          <Link
                            key={league.id}
                            href={`/liga/${league.slug}`}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                            onClick={() => setMenuOpen(false)}
                          >
                            <span className="w-1.5 h-1.5 bg-electric-orange rounded-full" />
                            {league.name}
                          </Link>
                        );
                      })}
                    </nav>
                  )}
                </div>
              ))}

              <div className="my-4 border-t border-gray-800" />

              {/* Mehr */}
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-4 font-semibold">
                Mehr
              </p>
              <nav className="space-y-1">
                <Link
                  href="/archiv"
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  FUWO Archiv
                </Link>
                <Link
                  href="/vereine"
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  Vereine
                </Link>
                <Link
                  href="/gespeichert"
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Gespeichert
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors w-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Suchen
                </button>

                {/* User Auth in Mobile */}
                {!authLoading && (
                  user ? (
                    <>
                      <div className="my-3 border-t border-gray-800" />
                      <div className="px-4 py-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-forest-green flex items-center justify-center text-white text-xs font-bold">
                          {((user.user_metadata?.display_name as string) ?? user.email ?? "?")[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-300 truncate">
                          {(user.user_metadata?.display_name as string) ?? user.email}
                        </span>
                      </div>
                      <Link
                        href="/profil"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mein Profil
                      </Link>
                      <button
                        onClick={async () => {
                          setMenuOpen(false);
                          await signOut();
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors w-full"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Abmelden
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Anmelden
                    </Link>
                  )
                )}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
