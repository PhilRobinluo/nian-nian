"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  FileText,
  ChevronRight,
  MessageCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Pencil,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStory } from "@/lib/story-context";
import { useAuth } from "@/lib/auth-context";
import { LIFE_PHASES } from "@/lib/types";
import type { Story } from "@/lib/types";

// ---------------------------------------------------------------------------
// Total chapters target
// ---------------------------------------------------------------------------

const TOTAL_CHAPTERS = 10;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>已录制 {completed} 个故事 / 目标 {total} 个</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-amber-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StoryCard({ story }: { story: Story }) {
  const [expanded, setExpanded] = useState(false);
  const isDraft = story.status === "draft";

  const formattedDate = story.date
    ? new Date(story.date).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <Card
      className={`shadow-sm hover:shadow-md transition-shadow ${
        isDraft ? "border-amber-300 border-dashed bg-amber-50/30" : "border-amber-100"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug text-foreground">
            {story.title}
          </CardTitle>
          <Badge
            variant="secondary"
            className={`shrink-0 text-xs ${
              isDraft
                ? "bg-orange-100 text-orange-700 border-orange-200"
                : "bg-amber-100 text-amber-700 border-amber-200"
            }`}
          >
            {isDraft ? "草稿" : "已完成"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <CardDescription className="text-sm leading-relaxed">
          {story.summary}
        </CardDescription>

        {/* Expanded full content */}
        {expanded && story.content && (
          <div className="pt-2 border-t border-amber-100 space-y-4">
            {story.content.split(/\n\n+/).map((para, i) => (
              <p
                key={i}
                className="text-[0.9375rem] leading-[1.85] text-foreground/90 indent-[2em]"
              >
                {para.trim()}
              </p>
            ))}
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {formattedDate && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          )}
          {story.wordCount > 0 && (
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {story.wordCount.toLocaleString()} 字
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((v) => !v)}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 px-2"
          >
            {expanded ? (
              <>
                收起 <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                阅读全文 <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </Button>
          <Link href={`/stories/${story.id}/edit`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-stone-500 hover:text-amber-600 hover:bg-amber-50 gap-1 px-2"
            >
              <Pencil className="w-3.5 h-3.5" />
              编辑
            </Button>
          </Link>
        </div>
        <Link href="/book">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-amber-600 hover:bg-amber-50 gap-1 px-2"
          >
            看回忆录
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function PendingPhaseCard({ phase }: { phase: string }) {
  return (
    <Card className="border-dashed border-stone-200 bg-muted/30">
      <CardContent className="py-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-dashed border-stone-300 flex items-center justify-center shrink-0">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{phase}</p>
          <p className="text-xs text-muted-foreground/70 mt-0.5">等待探索</p>
        </div>
        <Link href="/chat" className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-amber-200 text-amber-600 hover:bg-amber-50"
          >
            开始聊
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function GeneratingBanner() {
  return (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-700">
      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      <span>念念正在整理您的故事，稍等片刻...</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-16 flex flex-col items-center gap-5 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-dashed border-amber-200 flex items-center justify-center">
        <BookOpen className="w-7 h-7 text-amber-300" />
      </div>
      <div className="space-y-2 max-w-xs">
        <p className="text-base font-medium text-foreground/80">还没有开始记录哦</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          去和念念聊聊，您的故事就会出现在这里。
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

export default function StoriesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { stories, isGenerating, currentProject } = useStory();

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

  const draftStories = stories.filter((s) => s.status === "draft");
  const completedStories = stories.filter((s) => s.status === "completed");
  const allVisibleStories = [...draftStories, ...completedStories];

  // Group by LIFE_PHASES order (include both draft and completed)
  const storiesByPhase = LIFE_PHASES.map((phase) => ({
    phase,
    stories: allVisibleStories.filter((s) => s.phase === phase),
  }));

  const authorName = currentProject?.subjectName ? `${currentProject.subjectName}的故事集` : "故事集";

  if (authLoading || (!authLoading && !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-10 no-print">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground px-2"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </Button>
          </Link>
          <BookOpen className="w-5 h-5 text-amber-500" />
          <h1 className="text-lg font-semibold">故事集</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-10">
        {/* ── Intro ──────────────────────────────────────────────────── */}
        <section className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">{authorName}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            每一段记忆都值得被好好保存。这里是已经整理好的故事章节。
          </p>
        </section>

        {/* ── Generating banner ───────────────────────────────────────── */}
        {isGenerating && <GeneratingBanner />}

        {/* ── Empty state ─────────────────────────────────────────────── */}
        {allVisibleStories.length === 0 && !isGenerating ? (
          <EmptyState />
        ) : (
          <>
            {/* ── Progress ─────────────────────────────────────────── */}
            <section className="bg-amber-50/60 border border-amber-100 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-800">录制进度</span>
              </div>
              <ProgressBar
                completed={completedStories.length}
                total={TOTAL_CHAPTERS}
              />
            </section>

            {/* ── Draft stories ────────────────────────────────────── */}
            {draftStories.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-base font-semibold text-orange-700 flex items-center gap-2">
                  <Pencil className="w-4 h-4" />
                  待编辑的草稿（{draftStories.length}）
                </h3>
                <div className="space-y-3">
                  {draftStories.map((story) => (
                    <Card
                      key={story.id}
                      className="border-dashed border-amber-300 bg-amber-50/40 shadow-sm"
                    >
                      <CardContent className="py-4 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {story.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {story.summary}
                          </p>
                        </div>
                        <Link href={`/stories/${story.id}/edit`}>
                          <Button
                            size="sm"
                            className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg gap-1.5 text-xs"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            继续编辑
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* ── Timeline ─────────────────────────────────────────── */}
            <section>
              <h3 className="text-base font-semibold text-muted-foreground mb-6 flex items-center gap-2">
                <span className="w-4 h-px bg-border inline-block" />
                人生时间线
                <span className="flex-1 h-px bg-border inline-block" />
              </h3>

              <div className="relative">
                {/* Vertical line */}
                <div
                  className="absolute left-[15px] top-2 bottom-2 w-px bg-amber-200"
                  aria-hidden="true"
                />

                <ol className="space-y-8" aria-label="人生故事时间线">
                  {storiesByPhase.map(({ phase, stories: phaseStories }, phaseIndex) => {
                    const hasStories = phaseStories.length > 0;

                    return (
                      <li key={phase} className="pl-10 relative">
                        {/* Timeline dot */}
                        <div
                          aria-hidden="true"
                          className={[
                            "absolute left-0 top-1 w-[30px] h-[30px] rounded-full",
                            "flex items-center justify-center border-2 transition-colors",
                            hasStories
                              ? "bg-amber-500 border-amber-500 text-white"
                              : "bg-background border-stone-300 text-muted-foreground",
                          ].join(" ")}
                        >
                          <span className="text-xs font-bold">{phaseIndex + 1}</span>
                        </div>

                        {/* Phase label */}
                        <div className="mb-3 -mt-0.5">
                          <span
                            className={`text-sm font-semibold ${
                              hasStories ? "text-amber-700" : "text-muted-foreground"
                            }`}
                          >
                            {phase}
                          </span>
                          {hasStories && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              {phaseStories.length} 个故事
                            </span>
                          )}
                        </div>

                        {/* Stories or pending slot */}
                        <div className="space-y-3">
                          {hasStories ? (
                            phaseStories.map((story) => (
                              <StoryCard key={story.id} story={story} />
                            ))
                          ) : (
                            <PendingPhaseCard phase={phase} />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </section>

            {/* ── Bottom CTA ───────────────────────────────────────── */}
            <section className="py-6 flex flex-col items-center gap-3 text-center border-t border-border/60">
              <p className="text-sm text-muted-foreground">
                还有更多故事等待着被记录下来
              </p>
              <Link href="/chat">
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-white gap-2 px-8 rounded-xl shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  继续录制
                </Button>
              </Link>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
