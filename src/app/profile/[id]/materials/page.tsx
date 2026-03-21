"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  MOCK_PROFILES,
  getMaterialsByProfileId,
  getMaterialCountByType,
  MATERIAL_TYPE_LABELS,
  MATERIAL_TYPE_ICONS,
  SOURCE_LABELS,
  type Material,
} from "@/lib/mock-data"
import { BottomNav } from "@/components/bottom-nav"

type FilterType = "all" | Material["type"]

const FILTER_OPTIONS: { key: FilterType; label: string; icon: string }[] = [
  { key: "all", label: "全部", icon: "📋" },
  { key: "chat", label: "对话", icon: "💬" },
  { key: "audio", label: "录音", icon: "🎙️" },
  { key: "text", label: "文字", icon: "📄" },
  { key: "photo", label: "照片", icon: "🖼️" },
]

export default function MaterialsPage() {
  const params = useParams()
  const id = params.id as string
  const profile = MOCK_PROFILES.find((p) => p.id === id) ?? MOCK_PROFILES[0]

  const allMaterials = getMaterialsByProfileId(id)
  const counts = getMaterialCountByType(id)
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered =
    activeFilter === "all"
      ? allMaterials
      : allMaterials.filter((m) => m.type === activeFilter)

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="mx-auto max-w-md px-4 py-4 flex items-center gap-3">
          <Link
            href={`/profile/${id}`}
            className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-muted transition-colors text-2xl text-muted-foreground"
            aria-label="返回档案"
          >
            ‹
          </Link>
          <h1 className="text-xl font-semibold text-foreground flex-1">资料管理</h1>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ backgroundColor: profile.avatarColor }}
            aria-hidden="true"
          >
            {profile.avatarInitial}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-4 space-y-5">
        {/* 统计概览 */}
        <div className="rounded-2xl bg-card border border-border p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-3">素材来源分布</p>
          <div className="grid grid-cols-4 gap-3">
            {(["chat", "audio", "text", "photo"] as Material["type"][]).map((type) => (
              <div key={type} className="text-center">
                <p className="text-2xl" aria-hidden="true">{MATERIAL_TYPE_ICONS[type]}</p>
                <p className="text-xl font-bold text-foreground mt-1">{counts[type]}</p>
                <p className="text-xs text-muted-foreground">{MATERIAL_TYPE_LABELS[type]}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">共 <span className="font-semibold text-foreground">{allMaterials.length}</span> 条素材</p>
            <Link
              href={`/profile/${id}/organize`}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              🧠 一键 AI 整理
            </Link>
          </div>
        </div>

        {/* 筛选栏 */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="素材筛选">
          {FILTER_OPTIONS.map((opt) => {
            const count = opt.key === "all" ? allMaterials.length : counts[opt.key as Material["type"]]
            return (
              <button
                key={opt.key}
                onClick={() => setActiveFilter(opt.key)}
                role="tab"
                aria-selected={activeFilter === opt.key}
                className={[
                  "shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border",
                  activeFilter === opt.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-primary/40",
                ].join(" ")}
              >
                <span aria-hidden="true">{opt.icon}</span>
                <span>{opt.label}</span>
                <span
                  className={[
                    "text-xs px-1.5 py-0.5 rounded-full",
                    activeFilter === opt.key
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* 素材时间线列表 */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-card border border-dashed border-border p-10 text-center">
            <p className="text-muted-foreground">暂无该类型素材</p>
            <Link
              href={`/profile/${id}/import`}
              className="inline-flex items-center gap-1.5 mt-3 text-primary text-sm font-medium hover:underline"
            >
              去导入资料 →
            </Link>
          </div>
        ) : (
          <div className="space-y-3" role="list">
            {filtered.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                expanded={expandedId === material.id}
                onToggle={() =>
                  setExpandedId(expandedId === material.id ? null : material.id)
                }
              />
            ))}
          </div>
        )}

        {/* 底部整理入口 */}
        {allMaterials.length > 0 && (
          <Link href={`/profile/${id}/organize`} className="block">
            <div className="rounded-2xl bg-primary p-5 text-center hover:bg-primary/90 transition-all active:scale-[0.98] shadow-sm">
              <p className="text-lg font-bold text-primary-foreground">🧠 一键 AI 整理成回忆录</p>
              <p className="text-sm text-primary-foreground/80 mt-1">
                将 {allMaterials.length} 条素材整理成完整故事
              </p>
            </div>
          </Link>
        )}
      </main>

      <BottomNav profileId={id} />
    </div>
  )
}

function MaterialCard({
  material,
  expanded,
  onToggle,
}: {
  material: Material
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden"
      role="listitem"
    >
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 hover:bg-muted/30 transition-colors"
        aria-expanded={expanded}
        aria-label={`${material.title}，点击展开`}
      >
        <div className="flex items-start gap-3">
          {/* 类型图标 */}
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xl shrink-0 mt-0.5">
            {MATERIAL_TYPE_ICONS[material.type]}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-semibold text-foreground">{material.title}</span>
              {material.important && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  重要
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
              {material.summary}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>{MATERIAL_TYPE_LABELS[material.type]}</span>
              {material.duration && <span>· {material.duration}</span>}
              {material.source && <span>· {SOURCE_LABELS[material.source] ?? material.source}</span>}
              {material.timePeriod && <span>· {material.timePeriod}</span>}
              <span className="ml-auto">{material.createdAt}</span>
            </div>
          </div>

          <span
            className={[
              "text-muted-foreground text-xl transition-transform duration-200 shrink-0",
              expanded ? "rotate-90" : "",
            ].join(" ")}
            aria-hidden="true"
          >
            ›
          </span>
        </div>
      </button>

      {/* 展开内容 */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-border">
          {material.type === "photo" ? (
            <div className="mt-4 space-y-3">
              <div
                className="w-full h-32 rounded-xl flex items-center justify-center text-4xl text-white"
                style={{ backgroundColor: material.imageColor ?? "#C8956C" }}
                role="img"
                aria-label="照片预览"
              >
                🖼️
              </div>
              <p className="text-base text-foreground leading-relaxed">{material.content}</p>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
                {material.content}
              </p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button className="flex-1 h-9 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
              ✏️ 编辑
            </button>
            <button className="flex-1 h-9 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
              {material.important ? "★ 已标重要" : "☆ 标为重要"}
            </button>
            <button className="w-9 h-9 rounded-lg border border-border text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center">
              🗑
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
