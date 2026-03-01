"use client";

import { useState, useEffect, useCallback, useRef, forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { EPaperIssue, ArchivIssue } from "@/lib/mock/epaper";

interface EPaperReaderPageProps {
  issue: EPaperIssue | ArchivIssue;
}

// ── Single page wrapper for react-pageflip (requires forwardRef) ──
const FlipPage = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  function FlipPage(props, ref) {
    return (
      <div ref={ref} className="bg-white">
        {props.children}
      </div>
    );
  }
);

export default function EPaperReaderPage({ issue }: EPaperReaderPageProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // PDF rendering state
  const isPdf = !!issue.pdfUrl;
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [pdfLoading, setPdfLoading] = useState(isPdf);
  const [pdfProgress, setPdfProgress] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [FlipBook, setFlipBook] = useState<React.ComponentType<any> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipBookRef = useRef<any>(null);

  const totalPages = isPdf ? pdfPages.length : issue.pages.length;

  // ── Load react-pageflip dynamically (no SSR) ──
  useEffect(() => {
    import("react-pageflip").then((mod) => {
      setFlipBook(() => mod.default);
    });
  }, []);

  // ── Render PDF pages to images (progressive: show after first batch) ──
  useEffect(() => {
    if (!isPdf || !issue.pdfUrl) return;
    let cancelled = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function renderPage(pdf: any, pageNum: number, scale: number): Promise<string> {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await page.render({ canvasContext: ctx, canvas, viewport } as unknown as any).promise;
      const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      canvas.width = 0;
      canvas.height = 0;
      return dataUrl;
    }

    async function renderPdf() {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const pdf = await pdfjsLib.getDocument(issue.pdfUrl!).promise;
      const numPages = pdf.numPages;

      // Phase 1: Render first 4 pages quickly at lower res to show flipbook fast
      const FAST_BATCH = Math.min(4, numPages);
      const firstPages: string[] = [];
      for (let i = 1; i <= FAST_BATCH; i++) {
        if (cancelled) return;
        firstPages.push(await renderPage(pdf, i, 1.2));
        if (!cancelled) setPdfProgress(Math.round((i / numPages) * 100));
      }

      if (cancelled) return;
      // Show flipbook immediately with first pages
      setPdfPages([...firstPages]);
      setPdfLoading(false);

      // Phase 2: Render remaining pages in background
      const allPages = [...firstPages];
      for (let i = FAST_BATCH + 1; i <= numPages; i++) {
        if (cancelled) return;
        allPages.push(await renderPage(pdf, i, 1.2));
        if (!cancelled) {
          setPdfPages([...allPages]);
          setPdfProgress(Math.round((i / numPages) * 100));
        }
      }
    }

    renderPdf().catch(console.error);
    return () => { cancelled = true; };
  }, [isPdf, issue.pdfUrl]);

  // ── Navigation ──
  const goToPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    } else {
      goToPage(currentPage + 1);
    }
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    } else {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setControlsVisible(false), 4000);
  }, []);

  // Auto-hide controls after 4s
  useEffect(() => {
    hideTimeoutRef.current = setTimeout(() => setControlsVisible(false), 4000);
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      showControls();
      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          nextPage();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevPage();
          break;
        case "Home":
          e.preventDefault();
          goToPage(0);
          break;
        case "End":
          e.preventDefault();
          goToPage(totalPages - 1);
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [nextPage, prevPage, goToPage, totalPages, showControls]);

  // Touch swipe (for non-flipbook pages)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextPage();
      else prevPage();
    }
    touchStartX.current = null;
    showControls();
  };

  // Click on left/right side (for non-flipbook pages)
  const handleAreaClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const thirdWidth = rect.width / 3;
    if (clickX < thirdWidth) prevPage();
    else if (clickX > thirdWidth * 2) nextPage();
    showControls();
  };

  // FlipBook page change handler
  const onFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
    showControls();
  }, [showControls]);

  // ── Loading state for PDF ──
  if (isPdf && pdfLoading) {
    return (
      <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col items-center justify-center">
        <Link
          href="/epaper"
          className="absolute top-4 left-4 flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zurück
        </Link>

        <div className="text-center">
          {/* Animated newspaper icon */}
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-2 border-white/20 rounded-lg animate-pulse" />
            <div className="absolute inset-2 border border-white/10 rounded" />
            <div className="absolute top-4 left-4 right-4 h-1 bg-white/20 rounded" />
            <div className="absolute top-7 left-4 right-6 h-1 bg-white/15 rounded" />
            <div className="absolute top-10 left-4 right-8 h-1 bg-white/10 rounded" />
          </div>

          <h2 className="text-white font-headline text-xl mb-2">{issue.title}</h2>
          <p className="text-white/60 text-sm mb-8">Ausgabe wird vorbereitet...</p>

          {/* Progress bar */}
          <div className="w-64 mx-auto">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-forest-green rounded-full transition-all duration-300"
                style={{ width: `${pdfProgress}%` }}
              />
            </div>
            <p className="text-white/40 text-xs mt-2 tabular-nums">{pdfProgress}%</p>
          </div>
        </div>
      </div>
    );
  }

  // ── PDF FlipBook Reader ──
  if (isPdf && pdfPages.length > 0 && FlipBook) {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 bg-gray-950 z-50 flex flex-col select-none"
        onMouseMove={showControls}
      >
        {/* Top Bar */}
        <div
          className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent reader-controls ${
            controlsVisible ? "" : "reader-controls-hidden"
          }`}
        >
          <Link
            href="/epaper"
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zurück
          </Link>
          <span className="text-white/80 text-sm font-medium truncate mx-4">
            {issue.title}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-sm tabular-nums">
              Seite {currentPage + 1} / {issue.pageCount}
            </span>
            {pdfPages.length < issue.pageCount && (
              <span className="text-white/40 text-xs flex items-center gap-1.5">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {pdfPages.length}/{issue.pageCount}
              </span>
            )}
          </div>
        </div>

        {/* FlipBook */}
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <FlipBook
            ref={flipBookRef}
            width={550}
            height={733}
            size="stretch"
            minWidth={280}
            maxWidth={800}
            minHeight={373}
            maxHeight={1066}
            showCover={true}
            mobileScrollSupport={false}
            drawShadow={true}
            flippingTime={800}
            usePortrait={true}
            maxShadowOpacity={0.5}
            showPageCorners={true}
            useMouseEvents={true}
            renderOnlyPageLengthChange={true}
            className=""
            style={{}}
            onFlip={onFlip}
          >
            {pdfPages.map((dataUrl, i) => (
              <FlipPage key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dataUrl}
                  alt={`Seite ${i + 1}`}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </FlipPage>
            ))}
          </FlipBook>
        </div>

        {/* Bottom navigation arrows */}
        <div
          className={`absolute bottom-4 left-0 right-0 flex items-center justify-center gap-6 reader-controls ${
            controlsVisible ? "" : "reader-controls-hidden"
          }`}
        >
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all ${
              currentPage === 0 ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="text-white/60 text-sm tabular-nums min-w-[80px] text-center">
            {currentPage + 1} / {issue.pageCount}
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage >= pdfPages.length - 1}
            className={`p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all ${
              currentPage >= pdfPages.length - 1 ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // ── Image-based reader (non-PDF issues) ──
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-gray-950 z-50 flex flex-col select-none"
      onMouseMove={showControls}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent reader-controls ${
          controlsVisible ? "" : "reader-controls-hidden"
        }`}
      >
        <Link
          href="/epaper"
          className="flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zurück
        </Link>
        <span className="text-white/80 text-sm font-medium truncate mx-4">
          {issue.title}
        </span>
        <span className="text-white/60 text-sm tabular-nums">
          Seite {currentPage + 1} / {totalPages}
        </span>
      </div>

      {/* Page Content */}
      <div
        className="flex-1 flex items-center justify-center relative cursor-pointer"
        onClick={handleAreaClick}
      >
        {/* Left Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevPage();
            showControls();
          }}
          disabled={currentPage === 0}
          className={`absolute left-2 sm:left-6 z-10 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all reader-controls ${
            controlsVisible ? "" : "reader-controls-hidden"
          } ${currentPage === 0 ? "opacity-30 cursor-not-allowed" : ""}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page Image */}
        <div className="relative w-full h-full max-w-[600px] max-h-[90vh] mx-auto px-12 sm:px-20 py-4">
          <Image
            src={issue.pages[currentPage]}
            alt={`${issue.title} — Seite ${currentPage + 1}`}
            fill
            className="object-contain"
            priority
          />
          {currentPage + 1 < totalPages && (
            <link rel="preload" as="image" href={issue.pages[currentPage + 1]} />
          )}
          {currentPage - 1 >= 0 && (
            <link rel="preload" as="image" href={issue.pages[currentPage - 1]} />
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextPage();
            showControls();
          }}
          disabled={currentPage === totalPages - 1}
          className={`absolute right-2 sm:right-6 z-10 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all reader-controls ${
            controlsVisible ? "" : "reader-controls-hidden"
          } ${currentPage === totalPages - 1 ? "opacity-30 cursor-not-allowed" : ""}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Page Dots */}
      <div
        className={`absolute bottom-4 left-0 right-0 flex items-center justify-center gap-1.5 reader-controls ${
          controlsVisible ? "" : "reader-controls-hidden"
        }`}
      >
        {issue.pages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              goToPage(index);
              showControls();
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentPage
                ? "bg-white w-3"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Seite ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
