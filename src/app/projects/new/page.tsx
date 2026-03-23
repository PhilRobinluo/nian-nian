"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Heart, Loader2 } from "lucide-react";
import { useStory } from "@/lib/story-context";
import { useAuth } from "@/lib/auth-context";

const RELATIONSHIPS = ["本人", "父亲", "母亲", "爷爷", "奶奶", "外公", "外婆", "其他"];

export default function NewProjectPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { createProject } = useStory();

  const [subjectName, setSubjectName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [hometown, setHometown] = useState("");
  const [projectName, setProjectName] = useState("");
  const [relationship, setRelationship] = useState("");

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [authLoading, user, router]);

  // Auto-generate project name
  const displayName = projectName.trim() || (subjectName.trim() ? `${subjectName.trim()}的回忆录` : "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;

    createProject({
      name: displayName || `${subjectName.trim()}的回忆录`,
      subjectName: subjectName.trim(),
      birthYear: birthYear.trim(),
      hometown: hometown.trim(),
      relationship: relationship || undefined,
    });

    router.push("/chat");
  };

  if (authLoading || (!authLoading && !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-white border-b border-stone-200 shadow-sm shrink-0">
        <Link href="/projects">
          <Button
            variant="ghost"
            size="icon"
            aria-label="返回项目列表"
            className="text-stone-500 hover:text-stone-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <span
          className="text-xl font-bold text-amber-700"
          style={{ fontFamily: "'Noto Serif SC', serif", letterSpacing: "0.08em" }}
        >
          念念
        </span>
      </header>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-amber-500" />
            </div>
            <h1 className="text-2xl font-semibold text-stone-800 mb-2">
              为谁记录人生故事？
            </h1>
            <p className="text-stone-500 text-base">
              每个人的经历都是独一无二的宝藏
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 被记录人姓名 */}
            <div className="space-y-2">
              <label htmlFor="subjectName" className="text-base font-medium text-stone-700">
                被记录人姓名 <span className="text-red-400">*</span>
              </label>
              <Input
                id="subjectName"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="比如：王建国"
                className="text-lg h-14 px-5 rounded-2xl border-stone-300 focus-visible:ring-amber-400"
                required
              />
            </div>

            {/* 与TA的关系 */}
            <div className="space-y-2">
              <label className="text-base font-medium text-stone-700">
                与TA的关系
              </label>
              <div className="flex flex-wrap gap-2">
                {RELATIONSHIPS.map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => setRelationship(relationship === rel ? "" : rel)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      relationship === rel
                        ? "bg-amber-500 text-white shadow-sm"
                        : "bg-white border border-stone-200 text-stone-600 hover:border-amber-300 hover:bg-amber-50"
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>

            {/* 出生年份 */}
            <div className="space-y-2">
              <label htmlFor="birthYear" className="text-base font-medium text-stone-700">
                出生年份
              </label>
              <Input
                id="birthYear"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder="比如 1950"
                className="text-lg h-14 px-5 rounded-2xl border-stone-300 focus-visible:ring-amber-400"
              />
            </div>

            {/* 家乡 */}
            <div className="space-y-2">
              <label htmlFor="hometown" className="text-base font-medium text-stone-700">
                家乡
              </label>
              <Input
                id="hometown"
                value={hometown}
                onChange={(e) => setHometown(e.target.value)}
                placeholder="比如：河南信阳"
                className="text-lg h-14 px-5 rounded-2xl border-stone-300 focus-visible:ring-amber-400"
              />
            </div>

            {/* 项目名称 */}
            <div className="space-y-2">
              <label htmlFor="projectName" className="text-base font-medium text-stone-700">
                项目名称
              </label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder={subjectName.trim() ? `${subjectName.trim()}的回忆录` : "自动生成"}
                className="text-lg h-14 px-5 rounded-2xl border-stone-300 focus-visible:ring-amber-400"
              />
              <p className="text-xs text-stone-400">
                不填则自动命名为「{subjectName.trim() || "XX"}的回忆录」
              </p>
            </div>

            <Button
              type="submit"
              disabled={!subjectName.trim()}
              className="w-full h-14 text-lg rounded-2xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm mt-4"
            >
              开始记录
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
