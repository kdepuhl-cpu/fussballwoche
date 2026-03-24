"use client";

import { useState } from "react";

interface SocialFeedProps {
  instagramUrl?: string;
  facebookUrl?: string;
  clubName: string;
}

function InstagramIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

type TabId = "instagram" | "facebook";

export default function SocialFeed({ instagramUrl, facebookUrl, clubName }: SocialFeedProps) {
  const defaultTab: TabId = instagramUrl ? "instagram" : "facebook";
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  if (!instagramUrl && !facebookUrl) return null;

  const availableTabs: { id: TabId; label: string }[] = [];
  if (instagramUrl) availableTabs.push({ id: "instagram", label: "Instagram" });
  if (facebookUrl) availableTabs.push({ id: "facebook", label: "Facebook" });

  // Extract Facebook page name from URL for the Page Plugin
  const fbPageUrl = facebookUrl || "";

  // Build Instagram profile URL from handle
  const instaHandle = instagramUrl?.replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "") || "";
  const instaProfileUrl = instaHandle ? `https://www.instagram.com/${instaHandle}/` : "";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="font-headline text-xl text-off-black dark:text-white mb-1">
        Newsroom
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        Neuigkeiten von {clubName}
      </p>

      {/* Tab Switcher */}
      {availableTabs.length > 1 && (
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-5">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-forest-green text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {tab.id === "instagram" ? <InstagramIcon className="w-4 h-4" /> : <FacebookIcon className="w-4 h-4" />}
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Instagram */}
      {activeTab === "instagram" && instaProfileUrl && (
        <div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900 p-6 text-center">
            <InstagramIcon className="w-12 h-12 mx-auto mb-3 text-pink-500" />
            <p className="font-semibold text-gray-900 dark:text-white mb-1">@{instaHandle}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Folge {clubName} auf Instagram für aktuelle Beiträge, Stories und mehr.
            </p>
            <a
              href={instaProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <InstagramIcon className="w-4 h-4" />
              Auf Instagram ansehen
            </a>
          </div>
        </div>
      )}

      {/* Facebook — Page Plugin */}
      {activeTab === "facebook" && fbPageUrl && (
        <div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <iframe
              src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(fbPageUrl)}&tabs=timeline&width=500&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`}
              width="100%"
              height={500}
              style={{ border: "none", overflow: "hidden" }}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title={`${clubName} auf Facebook`}
            />
          </div>
          <a
            href={fbPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-forest-green/10 dark:bg-green-900/20 text-forest-green dark:text-green-400 text-sm font-semibold hover:bg-forest-green/20 dark:hover:bg-green-900/30 transition-colors"
          >
            <FacebookIcon className="w-4 h-4" />
            {clubName} auf Facebook folgen
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
