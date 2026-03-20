"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { MOCK_PROFILES, getAge } from "@/lib/mock-data"

export default function MemoirPage() {
  const params = useParams()
  const id = params.id as string
  const profile = MOCK_PROFILES.find((p) => p.id === id) ?? MOCK_PROFILES[0]
  const age = getAge(profile.birthYear)

  const [activeChapter, setActiveChapter] = useState<string | null>(null)
  const [showShareToast, setShowShareToast] = useState(false)

  function handleShare() {
    setShowShareToast(true)
    setTimeout(() => setShowShareToast(false), 2500)
  }

  const currentChapter = activeChapter
    ? profile.chapters.find((c) => c.id === activeChapter)
    : null

  return (
    <div className="min-h-screen pb-24 bg-[#F5EDD8]">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 bg-[#F5EDD8]/95 backdrop-blur-sm border-b border-[#D4B483]">
        <div className="mx-auto max-w-md px-4 py-4 flex items-center gap-3">
          <Link
            href={`/profile/${id}`}
            className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-[#EDD9B0] transition-colors text-2xl text-[#795548]"
            aria-label="返回档案"
          >
            ‹
          </Link>
          <h1 className="text-xl font-semibold text-[#3E2723] flex-1">人生回忆录</h1>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-6 space-y-6">
        {/* 封面 */}
        <div
          className="rounded-3xl overflow-hidden shadow-lg"
          style={{
            background: "linear-gradient(145deg, #8B6914 0%, #C8956C 50%, #D4B483 100%)",
          }}
        >
          <div className="px-8 py-10 text-center space-y-4">
            {/* 装饰线 */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-white/30" />
              <span className="text-white/80 text-sm">回忆录</span>
              <div className="h-px flex-1 bg-white/30" />
            </div>

            {/* 头像 */}
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white shadow-md border-4 border-white/30"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              role="img"
              aria-label={`${profile.name}的头像`}
            >
              {profile.avatarInitial}
            </div>

            {/* 标题 */}
            <div>
              <h2 className="text-3xl font-bold text-white memoir-font">
                {profile.name}
              </h2>
              <p className="text-white/90 text-lg mt-1 memoir-font">的人生回忆录</p>
            </div>

            {/* 基本信息 */}
            <div className="text-white/70 text-sm space-y-1">
              <p>{profile.birthYear} 年生于 {profile.hometown}</p>
              <p>今年 {age} 岁</p>
            </div>

            {/* 装饰线 */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-white/30" />
              <span className="text-white/60 text-xs">共 {profile.chapters.length} 个章节</span>
              <div className="h-px flex-1 bg-white/30" />
            </div>
          </div>
        </div>

        {/* 寄语 */}
        <div className="rounded-2xl bg-card border border-[#D4B483] p-5 shadow-sm">
          <p className="memoir-font text-foreground/80 text-base leading-loose text-center italic">
            "岁月深处，总有些光，照亮了我们走过的路。<br />
            这本书，献给我爱的家人。"
          </p>
          <p className="text-right text-sm text-muted-foreground mt-3">—— {profile.name}</p>
        </div>

        {/* 目录 */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span aria-hidden="true">📑</span> 目录
          </h3>
          <div className="space-y-2">
            {profile.chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                onClick={() =>
                  setActiveChapter(activeChapter === chapter.id ? null : chapter.id)
                }
                className="w-full text-left rounded-xl bg-card border border-[#D4B483] px-5 py-4 hover:bg-[#EDD9B0]/50 transition-colors"
                aria-expanded={activeChapter === chapter.id}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center shrink-0"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <span className="text-base font-medium text-foreground">{chapter.title}</span>
                  </div>
                  <span
                    className={[
                      "text-muted-foreground transition-transform text-lg",
                      activeChapter === chapter.id ? "rotate-90" : "",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 ml-10 leading-relaxed line-clamp-2">
                  {chapter.summary}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* 章节正文 */}
        {currentChapter && (
          <div className="rounded-2xl bg-card border border-[#D4B483] overflow-hidden shadow-sm">
            {/* 章节标题 */}
            <div
              className="px-6 py-5 border-b border-[#D4B483]"
              style={{
                background: "linear-gradient(135deg, #F5EDD8, #EDD9B0)",
              }}
            >
              <h4 className="text-xl font-bold text-foreground memoir-font">
                {currentChapter.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">{currentChapter.createdAt}</p>
            </div>

            {/* 正文 */}
            <div className="px-6 py-6">
              <div className="memoir-font text-foreground/90 text-base leading-loose space-y-4">
                {currentChapter.content.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 未完待续 */}
        <div className="rounded-2xl bg-secondary/40 border border-dashed border-[#D4B483] p-5 text-center">
          <p className="text-muted-foreground text-sm">
            故事还在继续……
          </p>
          <Link
            href={`/profile/${id}/chat`}
            className="inline-flex items-center gap-2 mt-3 text-primary text-sm font-medium hover:underline"
          >
            <span aria-hidden="true">💬</span> 继续聊聊，记录更多章节
          </Link>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3 pb-4">
          <button
            className="w-full h-14 rounded-xl border-2 border-primary bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            onClick={() => alert("PDF 导出功能即将上线")}
            aria-label="导出 PDF"
          >
            <span aria-hidden="true">📄</span> 导出 PDF
          </button>
          <button
            className="w-full h-14 rounded-xl border border-border bg-card text-foreground font-semibold text-base hover:bg-muted transition-colors flex items-center justify-center gap-2"
            onClick={handleShare}
            aria-label="分享给家人"
          >
            <span aria-hidden="true">❤️</span> 分享给家人
          </button>
        </div>
      </main>

      {/* 分享 Toast */}
      {showShareToast && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-foreground text-background px-5 py-3 rounded-full text-sm font-medium shadow-lg z-50 whitespace-nowrap"
          role="status"
          aria-live="polite"
        >
          链接已复制，快分享给家人吧！
        </div>
      )}
    </div>
  )
}
