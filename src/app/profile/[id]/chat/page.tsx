"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { MOCK_CHAT_MESSAGES, MOCK_PROFILES, type ChatMessage } from "@/lib/mock-data"

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const profile = MOCK_PROFILES.find((p) => p.id === id) ?? MOCK_PROFILES[0]

  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showEndDialog, setShowEndDialog] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  function handleSend() {
    const text = input.trim()
    if (!text) return

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    // 模拟 AI 回复
    setTimeout(() => {
      const aiReplies = [
        "您说得真好！那个时候的生活虽然朴素，却充满了温情。能再跟我说说，您最难忘的一个场景是什么吗？",
        "听您说这些，我仿佛也看到了那个年代的画面。您觉得那段经历对您后来的人生有什么影响呢？",
        "真是珍贵的记忆啊！您当时的心情是什么样的？是高兴，还是有些难过？",
        "谢谢您分享这么温暖的故事。那家里还有哪些人，也给您留下了深刻的印象吗？",
      ]
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "ai",
        content: aiReplies[Math.floor(Math.random() * aiReplies.length)],
        timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 1500)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleEndConversation() {
    setShowEndDialog(true)
  }

  function handleConfirmEnd() {
    router.push(`/profile/${id}`)
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto">
      {/* 顶部导航 */}
      <header className="shrink-0 bg-background/95 backdrop-blur-sm border-b border-border z-40">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link
            href={`/profile/${id}`}
            className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-muted transition-colors text-2xl text-muted-foreground"
            aria-label="返回档案"
          >
            ‹
          </Link>

          {/* 档案信息 */}
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white shrink-0"
              style={{ backgroundColor: profile.avatarColor }}
              aria-hidden="true"
            >
              {profile.avatarInitial}
            </div>
            <div>
              <p className="text-base font-semibold text-foreground leading-tight">{profile.name}</p>
              <p className="text-xs text-muted-foreground">AI 正在陪伴倾听</p>
            </div>
          </div>

          {/* 结束对话按钮 */}
          <button
            onClick={handleEndConversation}
            className="shrink-0 h-9 px-3 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
            aria-label="结束对话并生成章节"
          >
            结束对话
          </button>
        </div>
      </header>

      {/* 消息列表 */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="对话记录"
      >
        {/* 对话开始提示 */}
        <div className="text-center py-2">
          <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
            今天 · AI 陪您聊聊过去
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={[
              "flex gap-3 bubble-animate",
              msg.role === "user" ? "flex-row-reverse" : "flex-row",
            ].join(" ")}
          >
            {/* 头像 */}
            {msg.role === "ai" ? (
              <div
                className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0 mt-1"
                aria-hidden="true"
              >
                念
              </div>
            ) : (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold text-white shrink-0 mt-1"
                style={{ backgroundColor: profile.avatarColor }}
                aria-hidden="true"
              >
                {profile.avatarInitial}
              </div>
            )}

            {/* 气泡 */}
            <div className={["max-w-[75%]", msg.role === "user" ? "items-end" : "items-start", "flex flex-col gap-1"].join(" ")}>
              <div
                className={[
                  "px-4 py-3 rounded-2xl text-base leading-relaxed",
                  msg.role === "ai"
                    ? "bg-card border border-border text-foreground rounded-tl-sm"
                    : "bg-primary text-primary-foreground rounded-tr-sm",
                ].join(" ")}
              >
                {msg.content}
              </div>
              <span className="text-xs text-muted-foreground px-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {/* AI 正在输入 */}
        {isTyping && (
          <div className="flex gap-3 bubble-animate" aria-live="polite" aria-label="AI 正在回复">
            <div
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0 mt-1"
              aria-hidden="true"
            >
              念
            </div>
            <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1.5 items-center h-5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 输入区域 */}
      <div className="shrink-0 border-t border-border bg-background px-4 py-3 pb-safe">
        <div className="flex items-end gap-2">
          {/* 语音按钮 */}
          <button
            type="button"
            className="w-12 h-12 rounded-full border border-border bg-card flex items-center justify-center text-xl text-muted-foreground hover:bg-muted hover:text-primary transition-colors shrink-0"
            aria-label="语音输入（功能即将上线）"
            title="语音输入"
          >
            🎤
          </button>

          {/* 文字输入 */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="说说您的故事……"
              rows={1}
              className="w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors max-h-32"
              style={{ minHeight: "48px" }}
              aria-label="输入消息"
            />
          </div>

          {/* 发送按钮 */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-xl text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            aria-label="发送消息"
          >
            ↑
          </button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          按 Enter 发送 · Shift+Enter 换行
        </p>
      </div>

      {/* 结束对话确认弹窗 */}
      {showEndDialog && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="end-dialog-title"
        >
          <div
            className="w-full max-w-md bg-card rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-2">
              <div className="text-4xl" aria-hidden="true">📝</div>
              <h2 id="end-dialog-title" className="text-xl font-bold text-foreground">
                结束这次对话
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                AI 将把这次对话整理成一个新章节，加入{profile.name}的回忆录
              </p>
            </div>

            <div className="rounded-xl bg-secondary/60 p-4 border border-border">
              <p className="text-sm text-foreground font-medium mb-1">本次对话将生成：</p>
              <p className="text-sm text-muted-foreground">✨ 第三章：小河边的童年时光</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleConfirmEnd}
                className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors"
              >
                生成章节，结束对话
              </button>
              <button
                onClick={() => setShowEndDialog(false)}
                className="w-full h-12 rounded-xl border border-border text-foreground font-medium text-base hover:bg-muted transition-colors"
              >
                继续聊
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
