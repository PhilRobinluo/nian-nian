"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { MOCK_PROFILES, getAge } from "@/lib/mock-data"

// 完整章节内容（温暖第一人称）
const FULL_CHAPTER_CONTENT: Record<string, string> = {
  "ch-1": `我叫王秀兰，生于一九四三年，湖南湘潭县的一个小村子。村子不大，几十户人家，靠山傍水，家家都种着水稻。

我们家门口有一条小河，清清亮亮的，夏天水不深，刚好到膝盖。那时候天一热，我就和村里的孩子们往河里跑。我们用竹篓子堵在石头缝里，等鱼儿游进去。有时候一个下午能捉好几条，我举着篓子往家里跑，高兴得喊着"妈，今天有鱼汤喝！"

妈妈做的鱼汤，加几片姜，几段葱，汤白白的，香气顺着厨房的窗子飘出来。我那时候不懂，以为家家都这样。后来离家了才知道，那个味道，是再也找不回来的东西。

每到过年，整个村子都活了起来。杀猪、打糍粑，男人们在院子里用大木杵捶，糍粑的香气弥漫在冬天的冷空气里。那个香气，我闭上眼睛就能闻到。

那时候穷，但不觉得苦。孩子们在一起，整天玩，整天笑。那种快乐，是后来我活了八十多年，再也没有找到过的东西。`,
  "ch-2": `上学要走七里路，天不亮就得出发，走过两座山头才到学校。冬天最难熬，路上结了冰，我们就互相搀扶，生怕滑倒。

我们的老师叫周先生，从城里来的。他讲课很好听，声音洪亮，普通话说得好，我们都爱上他的语文课。有一次他说了一句话，我记了一辈子——"读书，是穷人家孩子唯一能改变命运的路。"

那时候家里没有电，晚上做功课只能靠煤油灯。灯光昏黄，熏得眼睛发酸。但我每次都把功课做完了才睡觉，一次都没有偷懒过。妈妈看我这么用功，省下了买盐的钱，给我买了一支新钢笔，说，"秀兰，你将来一定有出息。"

那支钢笔我用了好多年，后来磨损了也舍不得扔，一直放在抽屉里。有时候翻出来，就想起那盏煤油灯，想起妈妈举着灯给我照亮书本的样子。

周先生后来调回城里了。走的那天，我们全班都哭了。他是我这辈子最感激的人之一。`,
  "ch-3": `认识他是在生产队干活的时候。那时候大家一起插秧、收割，整个村子的年轻人都在一起，热热闹闹的。

第一次见面，他帮我挑了一担水。我看了他一眼，心想这个人挺踏实的，不多说话，就是默默做事。后来慢慢开始说话，说着说着就定了亲。

那个年代结婚没有什么大排场。就是请了两桌邻居吃饭，妈妈炒了几个菜，爸爸拿出珍藏多年的一瓶酒。我穿着自己缝的红棉袄，他骑着借来的自行车把我接到他家。

就这么成了家。没有蜡烛，没有戒指，但我那天特别高兴，高兴得睡不着觉。

这么多年过去了，有过争吵，有过难熬的日子，但他一直都是那个踏实的人。现在我常想，那年他帮我挑的那担水，是我这辈子接到的最好的礼物。`,
}

export default function MemoirPage() {
  const params = useParams()
  const id = params.id as string
  const profile = MOCK_PROFILES.find((p) => p.id === id) ?? MOCK_PROFILES[0]
  const age = getAge(profile.birthYear)

  const [activeChapter, setActiveChapter] = useState<string | null>(null)
  const [showShareToast, setShowShareToast] = useState(false)
  const [viewMode, setViewMode] = useState<"cover" | "toc" | "reading">("cover")

  function handleShare() {
    setShowShareToast(true)
    setTimeout(() => setShowShareToast(false), 2500)
  }

  function handleReadChapter(chapterId: string) {
    setActiveChapter(chapterId)
    setViewMode("reading")
  }

  const currentChapter = activeChapter
    ? profile.chapters.find((c) => c.id === activeChapter)
    : null

  const currentContent = activeChapter
    ? FULL_CHAPTER_CONTENT[activeChapter] ?? currentChapter?.content ?? ""
    : ""

  return (
    <div className="min-h-screen pb-24 bg-[#F5EDD8]">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 bg-[#F5EDD8]/95 backdrop-blur-sm border-b border-[#D4B483]">
        <div className="mx-auto max-w-md px-4 py-4 flex items-center gap-3">
          {viewMode === "reading" ? (
            <button
              onClick={() => setViewMode("toc")}
              className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-[#EDD9B0] transition-colors text-2xl text-[#795548]"
              aria-label="返回目录"
            >
              ‹
            </button>
          ) : (
            <Link
              href={`/profile/${id}`}
              className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-[#EDD9B0] transition-colors text-2xl text-[#795548]"
              aria-label="返回档案"
            >
              ‹
            </Link>
          )}
          <h1 className="text-xl font-semibold text-[#3E2723] flex-1">
            {viewMode === "reading" && currentChapter ? currentChapter.title : "人生回忆录"}
          </h1>
          {viewMode !== "cover" && (
            <button
              onClick={() => setViewMode("cover")}
              className="text-xs text-[#795548] border border-[#D4B483] px-3 py-1.5 rounded-full hover:bg-[#EDD9B0] transition-colors"
            >
              封面
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-6 space-y-6">
        {/* 封面视图 */}
        {viewMode === "cover" && (
          <>
            {/* 精致封面 */}
            <div
              className="rounded-3xl overflow-hidden shadow-xl"
              style={{
                background: "linear-gradient(145deg, #5D3A1A 0%, #8B6914 40%, #C8956C 80%, #D4B483 100%)",
              }}
            >
              <div className="px-8 py-12 text-center space-y-5">
                {/* 上装饰 */}
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px flex-1 bg-white/20" />
                  <div className="flex gap-1">
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                  </div>
                  <div className="h-px flex-1 bg-white/20" />
                </div>

                {/* 副标题 */}
                <p className="text-white/70 text-sm tracking-widest memoir-font">— 人生回忆录 —</p>

                {/* 头像 */}
                <div
                  className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-white shadow-lg border-4 border-white/20 backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                  role="img"
                  aria-label={`${profile.name}的头像`}
                >
                  {profile.avatarInitial}
                </div>

                {/* 姓名 */}
                <div>
                  <h2 className="text-4xl font-bold text-white memoir-font tracking-wide">
                    {profile.name}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="h-px w-8 bg-white/30" />
                    <p className="text-white/80 text-base memoir-font">的人生故事</p>
                    <div className="h-px w-8 bg-white/30" />
                  </div>
                </div>

                {/* 基本信息 */}
                <div className="text-white/60 text-sm space-y-1 memoir-font">
                  <p>{profile.birthYear} 年生</p>
                  <p>{profile.hometown}</p>
                  <p>今年 {age} 岁</p>
                </div>

                {/* 下装饰 */}
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px flex-1 bg-white/20" />
                  <span className="text-white/50 text-xs tracking-wider">
                    共 {profile.chapters.length} 章
                  </span>
                  <div className="h-px flex-1 bg-white/20" />
                </div>
              </div>
            </div>

            {/* 寄语 */}
            <div className="rounded-2xl bg-card border border-[#D4B483] p-6 shadow-sm">
              <p className="memoir-font text-foreground/80 text-base leading-loose text-center italic">
                "岁月深处，总有些光，<br />
                照亮了我们走过的路。<br />
                这本书，献给我爱的家人。"
              </p>
              <p className="text-right text-sm text-muted-foreground mt-4">—— {profile.name}</p>
            </div>

            {/* 开始阅读按钮 */}
            <button
              onClick={() => setViewMode("toc")}
              className="w-full h-14 rounded-xl bg-[#8B6914] text-white font-semibold text-base hover:bg-[#7a5c10] transition-all active:scale-[0.98]"
            >
              📖 开始阅读
            </button>
          </>
        )}

        {/* 目录视图 */}
        {viewMode === "toc" && (
          <>
            <div>
              <h3 className="text-lg font-bold text-[#3E2723] mb-1 memoir-font">目录</h3>
              <p className="text-sm text-[#795548]">{profile.chapters.length} 个章节，点击阅读</p>
            </div>

            <div className="space-y-3" role="list">
              {profile.chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => handleReadChapter(chapter.id)}
                  className="w-full text-left rounded-2xl bg-card border border-[#D4B483] px-5 py-4 hover:bg-[#EDD9B0]/50 hover:border-[#8B6914]/50 transition-all active:scale-[0.98]"
                  role="listitem"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="w-9 h-9 rounded-full bg-[#8B6914]/10 text-[#8B6914] text-sm font-bold flex items-center justify-center shrink-0 memoir-font"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-[#3E2723] memoir-font">
                        {chapter.title}
                      </p>
                      <p className="text-sm text-[#795548] mt-1 leading-relaxed line-clamp-2">
                        {chapter.summary}
                      </p>
                    </div>
                    <span className="text-[#D4B483] text-2xl shrink-0" aria-hidden="true">›</span>
                  </div>
                </button>
              ))}
            </div>

            {/* 未完待续 */}
            <div className="rounded-2xl bg-[#F5EDD8] border border-dashed border-[#D4B483] p-5 text-center">
              <p className="text-[#795548] text-sm">故事还在继续……</p>
              <Link
                href={`/profile/${id}/chat`}
                className="inline-flex items-center gap-2 mt-2 text-[#8B6914] text-sm font-medium hover:underline"
              >
                💬 继续对话，记录更多
              </Link>
            </div>

            {/* 导出操作 */}
            <ExportActions onShare={handleShare} />
          </>
        )}

        {/* 阅读视图 */}
        {viewMode === "reading" && currentChapter && (
          <>
            {/* 章节头 */}
            <div
              className="rounded-2xl overflow-hidden shadow-sm"
              style={{ background: "linear-gradient(135deg, #F5EDD8, #EDD9B0)" }}
            >
              <div className="px-6 py-6 border border-[#D4B483] rounded-2xl">
                <p className="text-xs text-[#795548] memoir-font mb-2 tracking-widest">
                  第 {profile.chapters.findIndex((c) => c.id === currentChapter.id) + 1} 章
                </p>
                <h2 className="text-2xl font-bold text-[#3E2723] memoir-font leading-tight">
                  {currentChapter.title}
                </h2>
                <p className="text-sm text-[#795548] mt-2 memoir-font italic leading-relaxed">
                  {currentChapter.summary}
                </p>
                <p className="text-xs text-[#D4B483] mt-3">
                  记录于 {currentChapter.createdAt}
                </p>
              </div>
            </div>

            {/* 正文 */}
            <div className="rounded-2xl bg-card border border-[#D4B483] px-6 py-7 shadow-sm">
              <div className="memoir-font text-[#3E2723]/90 text-base leading-loose space-y-5">
                {currentContent.split("\n\n").map((para, i) => (
                  <p key={i} className="text-justify">{para}</p>
                ))}
              </div>
            </div>

            {/* 章节导航 */}
            <div className="flex gap-3">
              {(() => {
                const idx = profile.chapters.findIndex((c) => c.id === currentChapter.id)
                const prev = idx > 0 ? profile.chapters[idx - 1] : null
                const next = idx < profile.chapters.length - 1 ? profile.chapters[idx + 1] : null
                return (
                  <>
                    {prev ? (
                      <button
                        onClick={() => handleReadChapter(prev.id)}
                        className="flex-1 h-12 rounded-xl border border-[#D4B483] text-[#795548] text-sm font-medium hover:bg-[#EDD9B0] transition-colors text-left px-4"
                      >
                        ‹ 上一章
                      </button>
                    ) : (
                      <div className="flex-1" />
                    )}
                    {next ? (
                      <button
                        onClick={() => handleReadChapter(next.id)}
                        className="flex-1 h-12 rounded-xl bg-[#8B6914] text-white text-sm font-medium hover:bg-[#7a5c10] transition-colors text-right px-4"
                      >
                        下一章 ›
                      </button>
                    ) : (
                      <button
                        onClick={() => setViewMode("toc")}
                        className="flex-1 h-12 rounded-xl bg-[#8B6914] text-white text-sm font-medium hover:bg-[#7a5c10] transition-colors"
                      >
                        回到目录
                      </button>
                    )}
                  </>
                )
              })()}
            </div>

            <ExportActions onShare={handleShare} />
          </>
        )}
      </main>

      {/* 分享 Toast */}
      {showShareToast && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#3E2723] text-white px-5 py-3 rounded-full text-sm font-medium shadow-lg z-50 whitespace-nowrap"
          role="status"
          aria-live="polite"
        >
          链接已复制，快分享给家人吧！
        </div>
      )}
    </div>
  )
}

function ExportActions({ onShare }: { onShare: () => void }) {
  return (
    <div className="space-y-3 pb-4">
      <button
        className="w-full h-14 rounded-xl bg-[#8B6914] text-white font-semibold text-base hover:bg-[#7a5c10] transition-colors flex items-center justify-center gap-2"
        onClick={() => alert("PDF 导出功能即将上线")}
        aria-label="导出 PDF"
      >
        <span aria-hidden="true">📄</span> 导出 PDF
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button
          className="h-12 rounded-xl border border-[#D4B483] bg-card text-[#795548] font-medium text-sm hover:bg-[#EDD9B0] transition-colors flex items-center justify-center gap-2"
          onClick={() => alert("生成长图功能即将上线")}
          aria-label="生成长图"
        >
          <span aria-hidden="true">🖼️</span> 生成长图
        </button>
        <button
          className="h-12 rounded-xl border border-[#D4B483] bg-card text-[#795548] font-medium text-sm hover:bg-[#EDD9B0] transition-colors flex items-center justify-center gap-2"
          onClick={onShare}
          aria-label="分享给家人"
        >
          <span aria-hidden="true">❤️</span> 分享给家人
        </button>
      </div>
    </div>
  )
}
