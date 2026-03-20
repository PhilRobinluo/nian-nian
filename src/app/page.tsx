import Link from "next/link"
import { MOCK_PROFILES, getAge } from "@/lib/mock-data"
import { BottomNav } from "@/components/bottom-nav"

export default function HomePage() {
  return (
    <div className="min-h-screen pb-20">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="mx-auto max-w-md px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary tracking-wide">念念</h1>
              <p className="text-sm text-muted-foreground mt-0.5">老人念叨过去，子女念念不忘</p>
            </div>
            <div className="text-3xl" aria-hidden="true">📖</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-6 space-y-6">
        {/* 欢迎语 */}
        <div className="rounded-2xl bg-card border border-border p-5 shadow-sm paper-texture">
          <p className="text-foreground leading-relaxed">
            每一位老人，都是一本还未写完的书。<br />
            用 AI 陪 TA 聊聊过去，留下专属的人生回忆录。
          </p>
        </div>

        {/* 档案列表标题 */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">我的档案</h2>
          <span className="text-sm text-muted-foreground">{MOCK_PROFILES.length} 位</span>
        </div>

        {/* 档案卡片列表 */}
        <div className="space-y-4">
          {MOCK_PROFILES.map((profile) => (
            <Link
              key={profile.id}
              href={`/profile/${profile.id}`}
              className="block"
              aria-label={`查看${profile.name}的档案`}
            >
              <div className="rounded-2xl bg-card border border-border p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all active:scale-[0.99]">
                <div className="flex items-center gap-4">
                  {/* 头像 */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: profile.avatarColor }}
                    role="img"
                    aria-label={`${profile.name}的头像`}
                  >
                    {profile.avatarInitial}
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-semibold text-foreground">{profile.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        {profile.gender === "grandma" ? "奶奶" : "爷爷"}
                      </span>
                    </div>
                    <p className="text-base text-muted-foreground mt-0.5">
                      {getAge(profile.birthYear)} 岁 · {profile.hometown}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-base" aria-hidden="true">✨</span>
                      <span className="text-sm text-primary font-medium">
                        已记录 {profile.stories} 个故事
                      </span>
                    </div>
                  </div>

                  {/* 箭头 */}
                  <div className="text-muted-foreground text-2xl shrink-0" aria-hidden="true">›</div>
                </div>

                {/* 章节预览 */}
                {profile.chapters.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      最新章节：{profile.chapters[profile.chapters.length - 1].title}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* 创建新档案按钮 */}
        <Link
          href="/profile/new"
          className="block w-full"
          aria-label="记录新故事，创建新档案"
        >
          <div className="flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 p-6 hover:bg-primary/10 hover:border-primary transition-all active:scale-[0.99] min-h-[80px]">
            <span className="text-3xl text-primary" aria-hidden="true">+</span>
            <span className="text-xl font-semibold text-primary">记录新故事</span>
          </div>
        </Link>
      </main>

      <BottomNav />
    </div>
  )
}
