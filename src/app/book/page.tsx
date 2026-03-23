"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, ArrowLeft, BookOpen, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStory } from "@/lib/story-context";
import { useAuth } from "@/lib/auth-context";
import { LIFE_PHASES } from "@/lib/types";
import type { Story } from "@/lib/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CHAPTER_NUMBERS = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

function chapterNum(index: number): string {
  return CHAPTER_NUMBERS[index] ?? String(index + 1);
}

interface PhaseChapter {
  phase: string;
  chapterIndex: number;
  stories: Story[];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function BookCover({
  title,
  authorName,
  birthYear,
  totalWords,
  chapterCount,
}: {
  title: string;
  authorName: string;
  birthYear: string;
  totalWords: number;
  chapterCount: number;
}) {
  const today = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="book-cover relative overflow-hidden min-h-[85vh] flex flex-col items-center justify-center"
      aria-label="回忆录封面"
      style={{
        background: "linear-gradient(180deg, #FDF8F0 0%, #F5EDE0 40%, #EDE3D3 100%)",
      }}
    >
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
        aria-hidden="true"
      />

      {/* Decorative top line */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-4" aria-hidden="true">
        <div className="w-16 h-px bg-amber-400/40" />
        <div className="w-2 h-2 rotate-45 border border-amber-400/40" />
        <div className="w-16 h-px bg-amber-400/40" />
      </div>

      <div className="relative text-center px-8 py-16 max-w-lg">
        {/* Author subtitle */}
        {authorName && (
          <p
            className="text-base text-amber-700/60 tracking-[0.3em] mb-8"
            style={{ fontFamily: "'Noto Serif SC', 'Songti SC', serif" }}
          >
            {authorName} 口述
          </p>
        )}

        {/* Main title */}
        <h1
          className="text-4xl md:text-5xl font-bold text-amber-900 leading-tight tracking-tight mb-6"
          style={{ fontFamily: "'Noto Serif SC', 'Songti SC', serif" }}
        >
          {title}
        </h1>

        {/* Year range */}
        <p
          className="text-xl text-amber-700/70 font-light tracking-[0.2em] mb-8"
          style={{ fontFamily: "'Noto Serif SC', 'Songti SC', serif" }}
        >
          {birthYear ? `${birthYear} — ${new Date().getFullYear()}` : "人生故事"}
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 mb-8" aria-hidden="true">
          <div className="w-20 h-px bg-amber-400/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
          <div className="w-20 h-px bg-amber-400/50" />
        </div>

        {/* Subtitle */}
        <p
          className="text-lg text-amber-700/60 italic leading-relaxed max-w-sm mx-auto mb-10"
          style={{ fontFamily: "'Noto Serif SC', 'Songti SC', serif" }}
        >
          一段普通而珍贵的人生
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-3">
          <Badge
            variant="outline"
            className="text-xs border-amber-300/60 text-amber-700/70 bg-transparent px-3 py-1"
          >
            共 {chapterCount} 章
          </Badge>
          <Badge
            variant="outline"
            className="text-xs border-amber-300/60 text-amber-700/70 bg-transparent px-3 py-1"
          >
            {totalWords.toLocaleString()} 字
          </Badge>
        </div>

        {/* Generation date */}
        <p className="text-xs text-amber-600/40 mt-12">念念 · {today} 生成</p>
      </div>

      {/* Decorative bottom line */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4" aria-hidden="true">
        <div className="w-16 h-px bg-amber-400/40" />
        <div className="w-2 h-2 rotate-45 border border-amber-400/40" />
        <div className="w-16 h-px bg-amber-400/40" />
      </div>
    </div>
  );
}

function TableOfContents({ chapters }: { chapters: PhaseChapter[] }) {
  return (
    <nav
      aria-label="目录"
      className="book-toc py-12 px-4"
    >
      <div className="max-w-md mx-auto">
        <h2
          className="text-2xl font-bold text-amber-900 text-center mb-2 tracking-wide"
          style={{ fontFamily: "'Noto Serif SC', 'Songti SC', serif" }}
        >
          目录
        </h2>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 mb-10" aria-hidden="true">
          <div className="w-12 h-px bg-amber-300/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-300/50" />
          <div className="w-12 h-px bg-amber-300/50" />
        </div>

        <ol className="space-y-4">
          {chapters.map((ch) => (
            <li key={ch.phase}>
              <a
                href={`#chapter-${ch.phase}`}
                className="
                  flex items-baseline justify-between gap-3 group
                  py-2 rounded-md
                  hover:text-amber-700 transition-colors
                  print:hover:text-inherit
                "
              >
                <span
                  className="text-lg text-foreground/80 group-hover:text-amber-700 transition-colors"
                  style={{ fontFamily: "'Noto Serif SC', 'Songti SC', serif" }}
                >
                  第{chapterNum(ch.chapterIndex)}章&emsp;{ch.phase}
                </span>
                <span
                  className="flex-1 border-b border-dotted border-amber-200/60 mx-2 mb-1"
                  aria-hidden="true"
                />
                <span className="text-sm text-muted-foreground/50 shrink-0 tabular-nums">
                  {ch.stories.length} 篇
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

function ChapterSection({ chapter }: { chapter: PhaseChapter }) {
  return (
    <article
      id={`chapter-${chapter.phase}`}
      className="chapter-break scroll-mt-20"
    >
      {/* Chapter heading */}
      <header className="text-center py-16">
        <p
          className="text-sm font-medium tracking-[0.3em] text-amber-500 uppercase mb-3"
          style={{ fontFamily: "'Noto Serif SC', 'Songti SC', serif" }}
        >
          第{chapterNum(chapter.chapterIndex)}章
        </p>
        <h2
          className="text-3xl font-bold tracking-tight text-foreground leading-snug mb-4"
          style={{ fontFamily: "'Noto Serif SC', 'Songti SC', serif" }}
        >
          {chapter.phase}
        </h2>

        {/* Chapter decorative divider */}
        <div className="flex items-center justify-center gap-3 mt-6" aria-hidden="true">
          <div className="w-8 h-px bg-amber-300/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-300/50" />
          <div className="w-8 h-px bg-amber-300/50" />
        </div>
      </header>

      {/* Stories */}
      <div className="max-w-[640px] mx-auto px-4 space-y-12">
        {chapter.stories.map((story, storyIndex) => (
          <div key={story.id} className="space-y-6">
            {/* Story title if multiple stories */}
            {chapter.stories.length > 1 && (
              <h3
                className="text-xl font-semibold text-foreground/85 text-center"
                style={{ fontFamily: "'Noto Serif SC', 'Songti SC', serif" }}
              >
                {story.title}
              </h3>
            )}

            {/* Story content paragraphs */}
            <div className="space-y-1">
              {story.content.split(/\n\n+/).map((para, i) => (
                <p
                  key={i}
                  className="book-paragraph text-[1.0625rem] leading-[1.85] text-foreground/90"
                  style={{
                    textIndent: "2em",
                    fontFamily: "'Noto Serif SC', 'Songti SC', 'STSong', serif",
                  }}
                >
                  {para.trim()}
                </p>
              ))}
            </div>

            {/* Divider between stories within same phase */}
            {storyIndex < chapter.stories.length - 1 && (
              <div
                className="flex items-center justify-center gap-4 py-6"
                aria-hidden="true"
              >
                <div className="w-1 h-1 rounded-full bg-amber-300/40" />
                <div className="w-1 h-1 rounded-full bg-amber-300/40" />
                <div className="w-1 h-1 rounded-full bg-amber-300/40" />
              </div>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}

function ChapterDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-4" aria-hidden="true">
      <div className="flex-1 max-w-[200px] h-px bg-border/40" />
      <div className="w-2 h-2 rotate-45 border border-amber-300/40" />
      <div className="flex-1 max-w-[200px] h-px bg-border/40" />
    </div>
  );
}

function Colophon({
  authorName,
  chapterCount,
  totalWords,
}: {
  authorName: string;
  chapterCount: number;
  totalWords: number;
}) {
  const today = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="colophon text-center py-16 mt-12 border-t border-amber-200/40">
      <div className="flex items-center justify-center gap-3 mb-8" aria-hidden="true">
        <div className="w-12 h-px bg-amber-300/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-amber-300/40" />
        <div className="w-12 h-px bg-amber-300/40" />
      </div>

      <p
        className="text-lg text-amber-800/60 mb-2"
        style={{ fontFamily: "'Noto Serif SC', 'Songti SC', serif" }}
      >
        {authorName ? `${authorName}的人生故事` : "人生故事"}
      </p>
      <p className="text-sm text-amber-700/40 mb-1">
        共 {chapterCount} 章 | {totalWords.toLocaleString()} 字
      </p>
      <p className="text-sm text-amber-700/40 mb-6">
        生成日期：{today}
      </p>
      <p className="text-xs text-amber-600/30 italic">
        由「念念」AI 人生故事记录器生成
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-20 flex flex-col items-center gap-5 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-dashed border-amber-200 flex items-center justify-center">
        <BookOpen className="w-7 h-7 text-amber-300" />
      </div>
      <div className="space-y-2 max-w-xs">
        <p className="text-base font-medium text-foreground/80">回忆录还是一张白纸</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          去和念念聊聊，让故事填满这些页面。
        </p>
      </div>
      <Link href="/chat">
        <Button
          size="lg"
          className="bg-amber-500 hover:bg-amber-600 text-white gap-2 px-8 rounded-xl shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          和念念聊聊
        </Button>
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BookPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { stories, currentProject } = useStory();

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [authLoading, user, router]);

  // Project guard
  useEffect(() => {
    if (!authLoading && user && !currentProject) {
      router.replace("/projects");
    }
  }, [authLoading, user, currentProject, router]);

  const completedStories = stories.filter((s) => s.status === "completed");

  // Build chapters: only phases that have at least one completed story
  const chapters: PhaseChapter[] = LIFE_PHASES.reduce<PhaseChapter[]>(
    (acc, phase) => {
      const phaseStories = completedStories.filter((s) => s.phase === phase);
      if (phaseStories.length > 0) {
        acc.push({
          phase,
          chapterIndex: acc.length,
          stories: phaseStories,
        });
      }
      return acc;
    },
    [],
  );

  const totalWords = completedStories.reduce((sum, s) => sum + (s.wordCount ?? 0), 0);
  const bookTitle = currentProject?.subjectName ? `${currentProject.subjectName}的人生故事` : "我的人生故事";
  const authorName = currentProject?.subjectName ?? "";
  const birthYear = currentProject?.birthYear ?? "";

  const handleExport = () => {
    window.print();
  };

  if (authLoading || (!authLoading && !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky header ──────────────────────────────────────────── */}
      <header className="no-print sticky top-0 z-10 border-b border-border/60 bg-background/95 backdrop-blur-sm">
        <div className="max-w-[720px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/stories">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-1.5 px-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回故事集
            </Button>
          </Link>

          <span className="text-sm text-muted-foreground hidden sm:block truncate max-w-[200px]">
            {bookTitle}
          </span>

          <Button
            size="sm"
            onClick={handleExport}
            disabled={chapters.length === 0}
            className="bg-amber-500 hover:bg-amber-600 text-white gap-1.5 shrink-0 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            导出 PDF
          </Button>
        </div>
      </header>

      {/* ── Main content ───────────────────────────────────────────── */}
      <main id="book-content">
        {chapters.length === 0 ? (
          <div className="max-w-[720px] mx-auto px-4 py-10">
            <EmptyState />
          </div>
        ) : (
          <>
            {/* Cover */}
            <BookCover
              title={bookTitle}
              authorName={authorName}
              birthYear={birthYear}
              totalWords={totalWords}
              chapterCount={chapters.length}
            />

            {/* Table of contents */}
            <TableOfContents chapters={chapters} />

            {/* Chapters */}
            <div>
              {chapters.map((chapter, index) => (
                <div key={chapter.phase}>
                  <ChapterSection chapter={chapter} />
                  {index < chapters.length - 1 && <ChapterDivider />}
                </div>
              ))}
            </div>

            {/* Colophon / endpage */}
            <Colophon
              authorName={authorName}
              chapterCount={chapters.length}
              totalWords={totalWords}
            />

            {/* ── Bottom actions ──────────────────────────────────── */}
            <div className="no-print max-w-[720px] mx-auto px-4 border-t border-border/60 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link href="/stories">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  返回故事集
                </Button>
              </Link>

              <Button
                size="lg"
                onClick={handleExport}
                className="bg-amber-500 hover:bg-amber-600 text-white gap-2 px-8 rounded-xl shadow-sm"
              >
                <Download className="w-4 h-4" />
                导出 PDF
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
