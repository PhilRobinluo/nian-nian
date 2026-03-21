import Link from "next/link"
import { notFound } from "next/navigation"
import { getProfileById, getAge, getMaterialsByProfileId } from "@/lib/mock-data"
import { BottomNav } from "@/components/bottom-nav"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params
  const profile = getProfileById(id)

  if (!profile) {
    notFound()
  }

  const age = getAge(profile.birthYear)
  const materials = getMaterialsByProfileId(id)
  const materialCount = materials.length
  const chapterCount = profile.chapters.length

  const ACTION_CARDS = [
    {
      href: `/profile/${id}/chat`,
      icon: "🎙️",
      label: "语音对话",
      desc: "AI 陪伴倾听，记录故事",
      bg: "bg-[#8B6914]",
      text: "text-white",
    },
    {
      href: `/profile/${id}/import`,
      icon: "📁",
      label: "导入资料",
      desc: "录音、文字、照片",
      bg: "bg-card",
      text: "text-foreground",
    },
    {
      href: `/profile/${id}/materials`,
      icon: "✏️",
      label: "资料管理",
      desc: `已收集 ${materialCount} 条素材`,
      bg: "bg-card",
      text: "text-foreground",
    },
    {
      href: `/profile/${id}/memoir`,
      icon: "📖",
      label: "阅读回忆录",
      desc: `已生成 ${chapterCount} 个章节`,
      bg: "bg-card",
      text: "text-foreground",
    },
  ]

  return (
    <div className="min-h-screen pb-24">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="mx-auto max-w-md px-4 py-4 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-muted transition-colors text-2xl text-muted-foreground"
            aria-label="返回首页"
          >
            ‹
          </Link>
          <h1 className="text-xl font-semibold text-foreground flex-1">{profile.name}的档案</h1>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-6 space-y-6">
        {/* 个人信息卡 */}
        <div className="rounded-2xl bg-card border border-border p-6 shadow-sm paper-texture">
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white shrink-0 shadow-md"
              style={{ backgroundColor: profile.avatarColor }}
              role="img"
              aria-label={`${profile.name}的头像`}
            >
              {profile.avatarInitial}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
                <span className="text-base text-muted-foreground">
                  {profile.gender === "grandma" ? "奶奶" : "爷爷"}
                </span>
              </div>
              <p className="text-base text-muted-foreground mt-1">
                {age} 岁 · 生于 {profile.birthYear} 年
              </p>
              <p className="text-base text-muted-foreground">{profile.hometown}</p>
            </div>
          </div>

          {/* 统计行 */}
          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border">
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-primary">{materialCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">条素材</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-primary">{chapterCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">个章节</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-primary">{profile.stories}</p>
              <p className="text-xs text-muted-foreground mt-0.5">个故事</p>
            </div>
          </div>
        </div>

        {/* 功能入口 */}
        <div>
          <h3 className="text-base font-semibold text-muted-foreground mb-3 px-1">功能入口</h3>

          {/* 语音对话 — 主按钮，占一整行 */}
          <Link href={`/profile/${id}/chat`} className="block mb-3">
            <div className="rounded-2xl bg-[#8B6914] text-white p-5 shadow-sm hover:bg-[#7a5c10] transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <span className="text-4xl leading-none" aria-hidden="true">🎙️</span>
                <div>
                  <p className="text-lg font-bold">语音对话</p>
                  <p className="text-sm text-white/80 mt-0.5">AI 陪伴倾听，记录生命故事</p>
                </div>
                <span className="ml-auto text-white/60 text-2xl" aria-hidden="true">›</span>
              </div>
            </div>
          </Link>

          {/* 其余 3 个 — 2 列 */}
          <div className="grid grid-cols-3 gap-3">
            <Link href={`/profile/${id}/import`} className="block">
              <div className="rounded-2xl bg-card border border-border p-4 hover:border-primary/40 hover:shadow-sm transition-all active:scale-[0.97] text-center">
                <span className="text-3xl leading-none block mb-2" aria-hidden="true">📁</span>
                <p className="text-sm font-semibold text-foreground">导入资料</p>
                <p className="text-xs text-muted-foreground mt-0.5">录音 · 文字 · 照片</p>
              </div>
            </Link>
            <Link href={`/profile/${id}/materials`} className="block">
              <div className="rounded-2xl bg-card border border-border p-4 hover:border-primary/40 hover:shadow-sm transition-all active:scale-[0.97] text-center">
                <span className="text-3xl leading-none block mb-2" aria-hidden="true">✏️</span>
                <p className="text-sm font-semibold text-foreground">资料管理</p>
                <p className="text-xs text-muted-foreground mt-0.5">{materialCount} 条素材</p>
              </div>
            </Link>
            <Link href={`/profile/${id}/memoir`} className="block">
              <div className="rounded-2xl bg-card border border-border p-4 hover:border-primary/40 hover:shadow-sm transition-all active:scale-[0.97] text-center">
                <span className="text-3xl leading-none block mb-2" aria-hidden="true">📖</span>
                <p className="text-sm font-semibold text-foreground">回忆录</p>
                <p className="text-xs text-muted-foreground mt-0.5">{chapterCount} 个章节</p>
              </div>
            </Link>
          </div>
        </div>

        {/* AI 整理入口 */}
        <Link href={`/profile/${id}/organize`} className="block">
          <div className="rounded-2xl bg-accent/10 border border-accent/30 p-4 hover:bg-accent/20 transition-all active:scale-[0.98]">
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">🧠</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">AI 智能整理</p>
                <p className="text-xs text-muted-foreground mt-0.5">一键将所有素材整理成完整回忆录</p>
              </div>
              <span className="text-muted-foreground text-xl" aria-hidden="true">›</span>
            </div>
          </div>
        </Link>

        {/* 最新章节预览 */}
        {profile.chapters.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-foreground">最新章节</h3>
              <Link href={`/profile/${id}/memoir`} className="text-sm text-primary hover:underline">
                查看全部
              </Link>
            </div>
            <div className="rounded-2xl bg-card border border-border p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0 mt-0.5">
                  {profile.chapters.length}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-foreground">
                    {profile.chapters[profile.chapters.length - 1].title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {profile.chapters[profile.chapters.length - 1].summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav profileId={id} />
    </div>
  )
}
