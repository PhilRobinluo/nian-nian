"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Plus,
  ArrowLeft,
  Loader2,
  LogOut,
  Trash2,
  MapPin,
  Calendar,
  FileText,
} from "lucide-react";
import { useStory } from "@/lib/story-context";
import { useAuth } from "@/lib/auth-context";

export default function ProjectsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { projects, stories, switchProject, deleteProject, currentProject } = useStory();

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [authLoading, user, router]);

  const handleSelectProject = (projectId: string) => {
    switchProject(projectId);
    router.push("/chat");
  };

  const handleDeleteProject = (e: React.MouseEvent, projectId: string, projectName: string) => {
    e.stopPropagation();
    if (window.confirm(`确定要删除「${projectName}」吗？所有故事和对话都会被删除，无法恢复。`)) {
      deleteProject(projectId);
    }
  };

  if (authLoading || (!authLoading && !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              aria-label="返回首页"
              className="text-stone-500 hover:text-stone-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span
              className="text-xl font-bold text-amber-700"
              style={{ fontFamily: "'Noto Serif SC', serif", letterSpacing: "0.08em" }}
            >
              我的回忆录
            </span>
          </div>
          <span className="hidden sm:inline text-sm text-stone-400 truncate max-w-[140px]">
            {user?.email}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="text-stone-400 hover:text-stone-600 gap-1"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {projects.length === 0 ? (
          /* 空状态 */
          <div className="py-20 flex flex-col items-center gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-dashed border-amber-200 flex items-center justify-center">
              <BookOpen className="w-9 h-9 text-amber-300" />
            </div>
            <div className="space-y-3 max-w-sm">
              <h2 className="text-2xl font-semibold text-stone-800">
                还没有回忆录项目
              </h2>
              <p className="text-stone-500 text-base leading-relaxed">
                每个项目记录一个人的人生故事。
                <br />
                为爸爸、妈妈、或自己，开始记录吧。
              </p>
            </div>
            <Link href="/projects/new">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-white gap-2 px-8 rounded-xl shadow-sm text-lg h-14"
              >
                <Plus className="w-5 h-5" />
                新建回忆录项目
              </Button>
            </Link>
          </div>
        ) : (
          /* 项目列表 */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-stone-800">
                选择一个项目继续
              </h2>
              <Link href="/projects/new">
                <Button
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 gap-2 rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                  新建
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project) => {
                // Count stories for this project: we need to check via the storage
                // But since stories state reflects currentProject, we show a static indicator
                const isActive = currentProject?.id === project.id;

                return (
                  <Card
                    key={project.id}
                    onClick={() => handleSelectProject(project.id)}
                    className={`cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 border-amber-100 ${
                      isActive ? "ring-2 ring-amber-400 border-amber-300" : ""
                    }`}
                  >
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5 text-amber-500" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-stone-800 leading-tight">
                              {project.name}
                            </h3>
                            <p className="text-sm text-stone-500 mt-0.5">
                              {project.subjectName}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDeleteProject(e, project.id, project.name)}
                          className="text-stone-300 hover:text-red-500 hover:bg-red-50 shrink-0 w-8 h-8"
                          aria-label="删除项目"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm text-stone-500">
                        {project.birthYear && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {project.birthYear}年生
                          </span>
                        )}
                        {project.hometown && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {project.hometown}
                          </span>
                        )}
                        {project.relationship && (
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            {project.relationship}
                          </span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-stone-100">
                        <Button
                          className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl h-10 text-sm shadow-sm"
                        >
                          {isActive ? "继续记录" : "选择此项目"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* 底部新建入口 */}
            <div className="pt-4 flex justify-center">
              <Link href="/projects/new">
                <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 border-dashed border-stone-300 hover:border-amber-300 bg-stone-50/50">
                  <CardContent className="px-8 py-6 flex flex-col items-center gap-2 text-center">
                    <div className="w-12 h-12 rounded-full bg-amber-50 border-2 border-dashed border-amber-200 flex items-center justify-center">
                      <Plus className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-base font-medium text-stone-600">
                      新建回忆录项目
                    </p>
                    <p className="text-sm text-stone-400">
                      为另一个人开始记录
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
