"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  MOCK_PROFILES,
  getMaterialsByProfileId,
  getMaterialCountByType,
  MATERIAL_TYPE_ICONS,
  MATERIAL_TYPE_LABELS,
  type Material,
} from "@/lib/mock-data"
import { Progress } from "@/components/ui/progress"
import { BottomNav } from "@/components/bottom-nav"

type OrganizeState = "idle" | "processing" | "done"

const STEPS = [
  { label: "分析素材内容", icon: "📊" },
  { label: "提取关键故事", icon: "🔍" },
  { label: "排列时间线", icon: "📅" },
  { label: "生成章节草稿", icon: "✍️" },
  { label: "润色叙述文字", icon: "✨" },
]

const GENERATED_CHAPTERS = [
  {
    id: "gen-1",
    title: "第一章：湘潭河边的童年",
    summary: "在湖南湘潭小村子度过的无忧岁月——小河、竹篓、妈妈的鱼汤，还有全村打糍粑的香气",
    wordCount: 680,
    sources: ["对话 · 童年记忆", "录音 · 家乡的春节"],
  },
  {
    id: "gen-2",
    title: "第二章：七里山路与煤油灯",
    summary: "走七里山路去求学，在昏黄灯光下苦读，遇见改变命运的周先生",
    wordCount: 520,
    sources: ["对话 · 求学经历"],
  },
  {
    id: "gen-3",
    title: "第三章：第一次进城",
    summary: "第一次踏进县城，看见百货大楼，站在门口不敢进去——那种震撼，几十年后还记得",
    wordCount: 340,
    sources: ["录音 · 第一次进城"],
  },
  {
    id: "gen-4",
    title: "第四章：那个挑水的男人",
    summary: "在生产队认识了后来的丈夫，简朴婚礼与几十年的相守",
    wordCount: 460,
    sources: ["对话 · 婚恋故事", "照片 · 结婚那天"],
  },
  {
    id: "gen-5",
    title: "第五章：1968年，那碗白米饭",
    summary: "从压箱底的老日记里，看见那个年代的喜悦与牵挂",
    wordCount: 280,
    sources: ["文字 · 日记节选"],
  },
]

export default function OrganizePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const profile = MOCK_PROFILES.find((p) => p.id === id) ?? MOCK_PROFILES[0]

  const allMaterials = getMaterialsByProfileId(id)
  const counts = getMaterialCountByType(id)

  const [state, setState] = useState<OrganizeState>("idle")
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null)

  useEffect(() => {
    if (state !== "processing") return

    setProgress(0)
    setCurrentStep(0)
    let step = 0
    let prog = 0

    const interval = setInterval(() => {
      prog += 2
      setProgress(prog)

      // 切换步骤
      const newStep = Math.floor((prog / 100) * STEPS.length)
      if (newStep !== step && newStep < STEPS.length) {
        step = newStep
        setCurrentStep(step)
      }

      if (prog >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setState("done")
        }, 400)
      }
    }, 60)

    return () => clearInterval(interval)
  }, [state])

  const MATERIAL_TYPE_STATS = (
    [
      { type: "chat" as const, count: counts.chat },
      { type: "audio" as const, count: counts.audio },
      { type: "text" as const, count: counts.text },
      { type: "photo" as const, count: counts.photo },
    ] as { type: Material["type"]; count: number }[]
  ).filter((s) => s.count > 0)

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="mx-auto max-w-md px-4 py-4 flex items-center gap-3">
          <Link
            href={`/profile/${id}/materials`}
            className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-muted transition-colors text-2xl text-muted-foreground"
            aria-label="返回资料管理"
          >
            ‹
          </Link>
          <h1 className="text-xl font-semibold text-foreground flex-1">AI 智能整理</h1>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ backgroundColor: profile.avatarColor }}
            aria-hidden="true"
          >
            {profile.avatarInitial}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-5 space-y-5">
        {/* 素材概览卡 */}
        <div className="rounded-2xl bg-card border border-border p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-4">
            {profile.name}的素材概览
          </p>
          <div className="flex gap-3 justify-around">
            {MATERIAL_TYPE_STATS.map(({ type, count }) => (
              <div key={type} className="text-center">
                <p className="text-2xl" aria-hidden="true">{MATERIAL_TYPE_ICONS[type]}</p>
                <p className="text-xl font-bold text-foreground mt-1">{count}</p>
                <p className="text-xs text-muted-foreground">{MATERIAL_TYPE_LABELS[type]}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              共 <span className="font-bold text-foreground text-base">{allMaterials.length}</span> 条素材待整理
            </p>
          </div>
        </div>

        {/* 空状态 */}
        {state === "idle" && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-secondary/40 border border-border p-5 space-y-3">
              <p className="text-sm font-medium text-foreground">AI 整理会做什么？</p>
              <div className="space-y-2">
                {STEPS.map((step, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <span aria-hidden="true">{step.icon}</span>
                    <span>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setState("processing")}
              className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all active:scale-[0.98] shadow-sm"
            >
              🧠 开始 AI 整理
            </button>

            <p className="text-xs text-muted-foreground text-center">
              整理过程约需 10-30 秒，请稍候
            </p>
          </div>
        )}

        {/* 处理中 */}
        {state === "processing" && (
          <div className="rounded-2xl bg-card border border-border p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="text-5xl animate-pulse" aria-hidden="true">🧠</div>
              <p className="text-lg font-semibold text-foreground">AI 正在整理中…</p>
              <p className="text-sm text-muted-foreground">请稍候，不要关闭页面</p>
            </div>

            <Progress value={progress} className="h-3" />
            <p className="text-sm text-center text-muted-foreground">{progress}%</p>

            <div className="space-y-2">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className={[
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                    i === currentStep
                      ? "bg-primary/10 text-primary font-medium"
                      : i < currentStep
                      ? "text-muted-foreground"
                      : "text-muted-foreground/50",
                  ].join(" ")}
                >
                  <span aria-hidden="true">
                    {i < currentStep ? "✅" : i === currentStep ? step.icon : "○"}
                  </span>
                  <span>{step.label}</span>
                  {i === currentStep && (
                    <span className="ml-auto text-xs text-primary">处理中…</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 整理完成 */}
        {state === "done" && (
          <div className="space-y-4">
            {/* 完成提示 */}
            <div className="rounded-2xl bg-green-50 border border-green-200 p-4 flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">🎉</span>
              <div>
                <p className="text-sm font-bold text-green-800">整理完成！</p>
                <p className="text-xs text-green-600 mt-0.5">
                  已生成 {GENERATED_CHAPTERS.length} 个章节，共约{" "}
                  {GENERATED_CHAPTERS.reduce((s, c) => s + c.wordCount, 0)} 字
                </p>
              </div>
            </div>

            {/* 章节列表 */}
            <div>
              <h2 className="text-base font-semibold text-foreground mb-3">章节预览</h2>
              <div className="space-y-3" role="list">
                {GENERATED_CHAPTERS.map((chapter, idx) => (
                  <div
                    key={chapter.id}
                    className="rounded-2xl bg-card border border-border overflow-hidden"
                    role="listitem"
                  >
                    <button
                      onClick={() =>
                        setExpandedChapter(
                          expandedChapter === chapter.id ? null : chapter.id
                        )
                      }
                      className="w-full text-left px-5 py-4 hover:bg-muted/30 transition-colors"
                      aria-expanded={expandedChapter === chapter.id}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-foreground">
                            {chapter.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                            {chapter.summary}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {chapter.sources.map((src, si) => (
                              <span
                                key={si}
                                className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
                              >
                                {src}
                              </span>
                            ))}
                            <span className="text-xs text-muted-foreground ml-auto">
                              约 {chapter.wordCount} 字
                            </span>
                          </div>
                        </div>
                        <span
                          className={[
                            "text-muted-foreground text-xl transition-transform duration-200 shrink-0",
                            expandedChapter === chapter.id ? "rotate-90" : "",
                          ].join(" ")}
                          aria-hidden="true"
                        >
                          ›
                        </span>
                      </div>
                    </button>

                    {expandedChapter === chapter.id && (
                      <div className="px-5 pb-5 border-t border-border">
                        <p className="text-sm text-muted-foreground italic mt-4 leading-relaxed">
                          （章节内容预览）{chapter.summary}……整理后的完整内容包含{chapter.wordCount}字的第一人称叙述，融合了所有相关素材的细节与情感。
                        </p>
                        <div className="flex gap-2 mt-3">
                          <button className="flex-1 h-9 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors">
                            ✏️ 编辑章节
                          </button>
                          <button className="flex-1 h-9 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors">
                            🔀 调整顺序
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 生成回忆录按钮 */}
            <button
              onClick={() => router.push(`/profile/${id}/memoir`)}
              className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all active:scale-[0.98] shadow-sm"
            >
              📖 生成完整回忆录
            </button>

            <button
              onClick={() => {
                setState("idle")
                setProgress(0)
                setCurrentStep(0)
                setExpandedChapter(null)
              }}
              className="w-full h-10 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              重新整理
            </button>
          </div>
        )}
      </main>

      <BottomNav profileId={id} />
    </div>
  )
}
