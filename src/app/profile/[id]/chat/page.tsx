"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  MOCK_CHAT_MESSAGES,
  MOCK_PROFILES,
  PRESET_TOPICS,
  AI_REPLIES_BY_TOPIC,
  type ChatMessage,
  type TopicKey,
} from "@/lib/mock-data"

export default function ChatPage() {
  const params = useParams()
  const id = params.id as string
  const profile = MOCK_PROFILES.find((p) => p.id === id) ?? MOCK_PROFILES[0]

  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeTopic, setActiveTopic] = useState<TopicKey>("childhood")
  const [showTopicPicker, setShowTopicPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const questionsRef = useRef<HTMLDivElement>(null)
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentTopic = PRESET_TOPICS.find((t) => t.key === activeTopic)!
  const aiReplies = AI_REPLIES_BY_TOPIC[activeTopic]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // 录音计时
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0)
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1)
      }, 1000)
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
    }
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }, [isRecording])

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return

      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: new Date().toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
      setMessages((prev) => [...prev, userMsg])
      setInput("")
      setIsTyping(true)

      const delay = 1200 + Math.random() * 800
      setTimeout(() => {
        const reply = aiReplies[Math.floor(Math.random() * aiReplies.length)]
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: "ai",
          content: reply,
          timestamp: new Date().toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }
        setMessages((prev) => [...prev, aiMsg])
        setIsTyping(false)
      }, delay)
    },
    [isTyping, aiReplies]
  )

  function handleSend() {
    sendMessage(input)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleQuestionClick(question: string) {
    sendMessage(question)
    // 滚动问题列表回起点
    questionsRef.current?.scrollTo({ left: 0, behavior: "smooth" })
  }

  function handleRecordStart() {
    setIsRecording(true)
  }

  function handleRecordEnd() {
    setIsRecording(false)
    if (recordingSeconds < 1) return
    // mock 转文字
    const mockTranscripts = [
      "我记得小时候，家里有一口大锅，妈妈每天早上都在那个锅里煮粥",
      "那时候我们村子里过年是最热闹的，家家户户都出来，整条街都是人",
      "我第一次进城是跟着大伯去的，看见那么高的楼，吓了一跳",
      "他来提亲那天，我躲在屋里不敢出来，后来妈妈叫我，我才出去见了他",
    ]
    const transcript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)]
    sendMessage(transcript)
    setRecordingSeconds(0)
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

          {/* 话题切换按钮 */}
          <button
            onClick={() => setShowTopicPicker((v) => !v)}
            className="shrink-0 h-9 px-3 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
            aria-label="切换话题"
          >
            <span aria-hidden="true">{currentTopic.emoji}</span>
            <span>{currentTopic.label}</span>
            <span className="text-muted-foreground text-xs" aria-hidden="true">▾</span>
          </button>
        </div>

        {/* 话题选择器下拉 */}
        {showTopicPicker && (
          <div className="px-4 pb-3 border-t border-border bg-background">
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
              {PRESET_TOPICS.map((topic) => (
                <button
                  key={topic.key}
                  onClick={() => {
                    setActiveTopic(topic.key)
                    setShowTopicPicker(false)
                  }}
                  className={[
                    "shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                    activeTopic === topic.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80",
                  ].join(" ")}
                >
                  <span aria-hidden="true">{topic.emoji}</span>
                  <span>{topic.label}</span>
                  <span className="text-xs opacity-60">{topic.ageRange}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* 消息列表 */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="对话记录"
      >
        <div className="text-center py-2">
          <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {currentTopic.emoji} {currentTopic.label} · {currentTopic.ageRange}
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

            <div
              className={[
                "max-w-[75%] flex flex-col gap-1",
                msg.role === "user" ? "items-end" : "items-start",
              ].join(" ")}
            >
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
      <div className="shrink-0 border-t border-border bg-background">
        {/* 预设问题横向滑动 */}
        <div
          ref={questionsRef}
          className="flex gap-2 overflow-x-auto no-scrollbar px-4 pt-3 pb-2"
          role="list"
          aria-label="预设问题"
        >
          {currentTopic.questions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleQuestionClick(q)}
              disabled={isTyping}
              className="shrink-0 px-3 py-2 rounded-full bg-secondary border border-border text-sm text-foreground hover:bg-secondary/80 hover:border-primary/40 disabled:opacity-50 transition-colors whitespace-nowrap"
              role="listitem"
            >
              {q}
            </button>
          ))}
        </div>

        {/* 录音中状态 */}
        {isRecording && (
          <div className="mx-4 mb-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm text-red-700 font-medium">正在录音 {recordingSeconds}s</span>
            <span className="text-xs text-red-500 ml-auto">松开发送</span>
          </div>
        )}

        {/* 输入行 */}
        <div className="flex items-end gap-2 px-4 pb-4 pt-1">
          {/* 语音大圆按钮 */}
          <button
            type="button"
            onPointerDown={handleRecordStart}
            onPointerUp={handleRecordEnd}
            onPointerLeave={handleRecordEnd}
            disabled={isTyping}
            className={[
              "w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-150 shrink-0 select-none",
              isRecording
                ? "bg-red-500 text-white scale-110 shadow-lg shadow-red-300 voice-pulse"
                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
              isTyping ? "opacity-40 cursor-not-allowed" : "",
            ].join(" ")}
            aria-label={isRecording ? "松开发送录音" : "按住录音"}
          >
            {isRecording ? "⏺" : "🎤"}
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
              className="w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              style={{ minHeight: "48px", maxHeight: "120px" }}
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
      </div>
    </div>
  )
}
