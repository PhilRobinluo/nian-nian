import Link from "next/link"
import { notFound } from "next/navigation"
import { getProfileById, getAge } from "@/lib/mock-data"
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
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-base" aria-hidden="true">✨</span>
                <span className="text-sm font-medium text-primary">
                  {profile.stories} 个故事 · {profile.chapters.length} 个章节
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 主要操作按钮 */}
        <div className="grid grid-cols-2 gap-3">
          <Link href={`/profile/${id}/chat`} className="block">
            <div className="h-16 flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground font-semibold text-base shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98]">
              <span aria-hidden="true">💬</span>
              <span>开始新对话</span>
            </div>
          </Link>
          <Link href={`/profile/${id}/memoir`} className="block">
            <div className="h-16 flex items-center justify-center gap-2 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-base border border-border hover:bg-secondary/80 transition-all active:scale-[0.98]">
              <span aria-hidden="true">📚</span>
              <span>阅读回忆录</span>
            </div>
          </Link>
        </div>

        {/* 章节列表 */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">已生成的章节</h3>

          {profile.chapters.length === 0 ? (
            <div className="rounded-2xl bg-card border border-dashed border-border p-8 text-center">
              <p className="text-muted-foreground text-base">还没有章节</p>
              <p className="text-sm text-muted-foreground mt-1">开始对话，AI 将自动整理成章节</p>
            </div>
          ) : (
            <div className="space-y-3">
              {profile.chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="rounded-2xl bg-card border border-border p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    {/* 章节序号 */}
                    <div
                      className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0 mt-0.5"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-foreground">{chapter.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {chapter.summary}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-2">{chapter.createdAt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 继续对话提示 */}
        <div className="rounded-2xl bg-accent/10 border border-accent/30 p-4">
          <p className="text-sm text-foreground/80 leading-relaxed text-center">
            📝 每次对话结束后，AI 会自动整理生成新章节，汇入回忆录
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
