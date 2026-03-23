"use client";

import { useStory } from "@/lib/story-context";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Sparkles,
  Save,
  Loader2,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Auto-resize textarea hook
// ---------------------------------------------------------------------------

function useAutoResize(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return ref;
}

// ---------------------------------------------------------------------------
// Edit Page
// ---------------------------------------------------------------------------

export default function StoryEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { stories, updateStory } = useStory();

  const storyId = params.id;
  const story = stories.find((s) => s.id === storyId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const contentRef = useAutoResize(content);
  const summaryRef = useAutoResize(summary);

  // Initialize form from story data
  useEffect(() => {
    if (story) {
      setTitle(story.title);
      setContent(story.content);
      setSummary(story.summary);
    }
  }, [story]);

  const handlePolish = useCallback(async () => {
    if (!content.trim() || isPolishing) return;

    setIsPolishing(true);
    try {
      const res = await fetch("/api/polish-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        throw new Error("润色请求失败");
      }

      const data = await res.json();
      if (data.content) {
        setContent(data.content);
      }
    } catch (err) {
      console.error("AI 润色失败:", err);
    } finally {
      setIsPolishing(false);
    }
  }, [content, isPolishing]);

  const handleSave = useCallback(
    (finalize: boolean) => {
      if (!storyId) return;

      updateStory(storyId, {
        title: title.trim(),
        content: content.trim(),
        summary: summary.trim(),
        wordCount: content.trim().length,
        status: finalize ? "completed" : "draft",
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);

      if (finalize) {
        router.push("/stories");
      }
    },
    [storyId, title, content, summary, updateStory, router],
  );

  // Story not found
  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 gap-4">
        <p className="text-lg text-stone-500">未找到该故事</p>
        <Link href="/stories">
          <Button
            variant="outline"
            className="text-amber-600 border-amber-200 hover:bg-amber-50"
          >
            返回故事集
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-[700px] mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/stories">
            <Button
              variant="ghost"
              size="icon"
              aria-label="返回故事集"
              className="text-stone-500 hover:text-stone-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-lg font-semibold text-stone-800">
              {story.status === "draft" ? "编辑草稿" : "编辑故事"}
            </span>
          </div>
          {story.status === "draft" && (
            <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-3 py-1">
              草稿
            </span>
          )}
        </div>
      </header>

      {/* Editor area */}
      <main className="max-w-[700px] mx-auto px-4 py-8 space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <label
            htmlFor="story-title"
            className="text-sm font-medium text-stone-500"
          >
            标题
          </label>
          <input
            id="story-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="给故事起个标题..."
            className="w-full text-2xl font-semibold text-stone-800 bg-transparent border-b-2 border-stone-200 focus:border-amber-400 outline-none pb-3 transition-colors placeholder:text-stone-300"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label
            htmlFor="story-content"
            className="text-sm font-medium text-stone-500"
          >
            正文
          </label>
          <textarea
            id="story-content"
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="故事正文..."
            className="w-full text-lg leading-[1.75] text-stone-800 bg-white border border-stone-200 rounded-xl p-5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none min-h-[300px] placeholder:text-stone-300"
          />
          <p className="text-xs text-stone-400 text-right">
            {content.length} 字
          </p>
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <label
            htmlFor="story-summary"
            className="text-sm font-medium text-stone-500"
          >
            摘要
          </label>
          <textarea
            id="story-summary"
            ref={summaryRef}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="2-3 句话的摘要..."
            className="w-full text-base leading-[1.75] text-stone-700 bg-white border border-stone-200 rounded-xl p-4 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none min-h-[80px] placeholder:text-stone-300"
          />
        </div>
      </main>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-stone-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-[700px] mx-auto px-4 py-4 flex items-center gap-3">
          {/* AI Polish */}
          <Button
            onClick={handlePolish}
            disabled={isPolishing || !content.trim()}
            variant="outline"
            className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 gap-2 rounded-xl px-5 h-12"
          >
            {isPolishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                润色中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                AI 帮我润色
              </>
            )}
          </Button>

          <div className="flex-1" />

          {/* Save draft */}
          <Button
            onClick={() => handleSave(false)}
            variant="outline"
            className="border-stone-300 text-stone-600 hover:bg-stone-50 gap-2 rounded-xl px-5 h-12"
          >
            {isSaved ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                已保存
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                保存草稿
              </>
            )}
          </Button>

          {/* Finalize */}
          <Button
            onClick={() => handleSave(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white gap-2 rounded-xl px-6 h-12 shadow-sm"
          >
            <CheckCircle className="w-4 h-4" />
            确认定稿
          </Button>
        </div>
      </div>
    </div>
  );
}
