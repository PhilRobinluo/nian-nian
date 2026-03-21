"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { MOCK_PROFILES } from "@/lib/mock-data"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BottomNav } from "@/components/bottom-nav"

type AudioState = "idle" | "uploading" | "transcribing" | "done"
type TextSource = "diary" | "letter" | "wechat" | "other"

const SOURCE_LABELS: Record<TextSource, string> = {
  diary: "日记",
  letter: "书信",
  wechat: "微信记录",
  other: "其他文字",
}

const MOCK_TRANSCRIPT = `那时候我们住在湖南湘潭的一个小村子里，村子不大，几十户人家，家家户户都种着水稻。

我们村子门口有一条小河，清清亮亮的，夏天的时候河水不深，刚好到膝盖。我小时候最喜欢的事情，就是和村子里的孩子们一起去河里捉鱼。有时候一下午能捉好几条，拿回家让妈妈做成鱼汤。

那时候家里穷，但是我不觉得苦。妈妈会给我们做甜酒酿，爸爸会在冬天用稻草编出漂亮的草鞋。`

interface PhotoItem {
  id: string
  color: string
  caption: string
  timePeriod: string
}

const PHOTO_COLORS = ["#C8956C", "#8B6914", "#795548", "#A0785A", "#D4A574"]

export default function ImportPage() {
  const params = useParams()
  const id = params.id as string
  const profile = MOCK_PROFILES.find((p) => p.id === id) ?? MOCK_PROFILES[0]

  // 录音 Tab
  const [audioState, setAudioState] = useState<AudioState>("idle")
  const [audioProgress, setAudioProgress] = useState(0)
  const [transcript, setTranscript] = useState("")
  const [audioFileName, setAudioFileName] = useState("")
  const [audioDone, setAudioDone] = useState(false)
  const audioInputRef = useRef<HTMLInputElement>(null)

  // 文字 Tab
  const [textContent, setTextContent] = useState("")
  const [textSource, setTextSource] = useState<TextSource>("diary")
  const [timePeriod, setTimePeriod] = useState("")
  const [textDone, setTextDone] = useState(false)

  // 照片 Tab
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [photoDone, setPhotoDone] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)

  function simulateAudioUpload(fileName: string) {
    setAudioFileName(fileName)
    setAudioState("uploading")
    setAudioProgress(0)

    const uploadInterval = setInterval(() => {
      setAudioProgress((p) => {
        if (p >= 100) {
          clearInterval(uploadInterval)
          setAudioState("transcribing")
          setAudioProgress(0)

          const transcribeInterval = setInterval(() => {
            setAudioProgress((p2) => {
              if (p2 >= 100) {
                clearInterval(transcribeInterval)
                setAudioState("done")
                setTranscript(MOCK_TRANSCRIPT)
                return 100
              }
              return p2 + 8
            })
          }, 120)
          return 100
        }
        return p + 15
      })
    }, 100)
  }

  function handleAudioFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    simulateAudioUpload(file.name)
    e.target.value = ""
  }

  function handleAudioDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    simulateAudioUpload(file.name)
  }

  function handleAddPhoto() {
    const newPhoto: PhotoItem = {
      id: `p-${Date.now()}`,
      color: PHOTO_COLORS[photos.length % PHOTO_COLORS.length],
      caption: "",
      timePeriod: "",
    }
    setPhotos((prev) => [...prev, newPhoto])
  }

  function updatePhotoCaption(photoId: string, caption: string) {
    setPhotos((prev) => prev.map((p) => (p.id === photoId ? { ...p, caption } : p)))
  }

  function updatePhotoTimePeriod(photoId: string, tp: string) {
    setPhotos((prev) => prev.map((p) => (p.id === photoId ? { ...p, timePeriod: tp } : p)))
  }

  function removePhoto(photoId: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId))
  }

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
          <h1 className="text-xl font-semibold text-foreground flex-1">导入资料</h1>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ backgroundColor: profile.avatarColor }}
            aria-hidden="true"
          >
            {profile.avatarInitial}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-4">
        <Tabs defaultValue="audio">
          <TabsList className="w-full mb-5">
            <TabsTrigger value="audio" className="flex-1">
              🎙️ 导入录音
            </TabsTrigger>
            <TabsTrigger value="text" className="flex-1">
              📄 导入文字
            </TabsTrigger>
            <TabsTrigger value="photo" className="flex-1">
              🖼️ 导入照片
            </TabsTrigger>
          </TabsList>

          {/* ── 录音 Tab ─────────────────────────────── */}
          <TabsContent value="audio" className="space-y-4">
            {audioState === "idle" ? (
              <div
                onDrop={handleAudioDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => audioInputRef.current?.click()}
                className="rounded-2xl border-2 border-dashed border-border bg-card p-10 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all"
                role="button"
                tabIndex={0}
                aria-label="上传录音文件"
                onKeyDown={(e) => e.key === "Enter" && audioInputRef.current?.click()}
              >
                <span className="text-5xl" aria-hidden="true">🎙️</span>
                <p className="text-base font-semibold text-foreground text-center">
                  点击上传，或拖拽文件到这里
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  支持 MP3、M4A、WAV、AAC 格式
                </p>
                <div className="mt-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
                  选择录音文件
                </div>
              </div>
            ) : audioState === "uploading" ? (
              <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">📤</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{audioFileName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">正在上传…</p>
                  </div>
                </div>
                <Progress value={audioProgress} className="h-2" />
              </div>
            ) : audioState === "transcribing" ? (
              <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl animate-pulse" aria-hidden="true">🧠</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">AI 正在转写语音…</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{audioFileName}</p>
                  </div>
                </div>
                <Progress value={audioProgress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">识别语音内容，通常需要 10-30 秒</p>
              </div>
            ) : (
              /* done */
              <div className="space-y-4">
                <div className="rounded-2xl bg-green-50 border border-green-200 p-4 flex items-center gap-3">
                  <span className="text-xl" aria-hidden="true">✅</span>
                  <div>
                    <p className="text-sm font-medium text-green-800">转写完成！</p>
                    <p className="text-xs text-green-600 mt-0.5">{audioFileName}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    转写结果（可编辑修正）
                  </label>
                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground focus:outline-none focus:border-primary resize-none"
                    rows={8}
                    aria-label="转写文字内容"
                  />
                </div>
                {audioDone ? (
                  <div className="rounded-xl bg-primary/10 border border-primary/30 p-4 text-center">
                    <p className="text-sm font-medium text-primary">已加入素材库 ✓</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setAudioDone(true)}
                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors"
                  >
                    确认导入到素材库
                  </button>
                )}
                <button
                  onClick={() => {
                    setAudioState("idle")
                    setAudioProgress(0)
                    setTranscript("")
                    setAudioFileName("")
                    setAudioDone(false)
                  }}
                  className="w-full h-10 rounded-xl border border-border text-foreground text-sm hover:bg-muted transition-colors"
                >
                  重新上传
                </button>
              </div>
            )}

            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*,.mp3,.m4a,.wav,.aac"
              className="hidden"
              onChange={handleAudioFile}
              aria-label="选择录音文件"
            />

            <div className="rounded-xl bg-secondary/50 p-4 space-y-1">
              <p className="text-xs font-medium text-foreground">使用建议</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                可以把老人讲故事的录音、电话录音、甚至老磁带翻录都上传进来。AI 会自动识别普通话和方言。
              </p>
            </div>
          </TabsContent>

          {/* ── 文字 Tab ─────────────────────────────── */}
          <TabsContent value="text" className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                粘贴文字内容
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="把日记、书信、微信聊天记录，或任何文字内容粘贴到这里……"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                rows={8}
                aria-label="文字内容"
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {textContent.length} 字
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">内容来源</label>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(SOURCE_LABELS) as TextSource[]).map((src) => (
                  <button
                    key={src}
                    onClick={() => setTextSource(src)}
                    className={[
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                      textSource === src
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/40",
                    ].join(" ")}
                  >
                    {SOURCE_LABELS[src]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                大约是什么年代的内容？
              </label>
              <input
                type="text"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                placeholder="例如：1970年代、改革开放前、近年……"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                aria-label="内容年代"
              />
            </div>

            {textDone ? (
              <div className="rounded-xl bg-primary/10 border border-primary/30 p-4 text-center">
                <p className="text-sm font-medium text-primary">已加入素材库 ✓</p>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (textContent.trim().length > 0) setTextDone(true)
                }}
                disabled={!textContent.trim()}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                导入到素材库
              </button>
            )}
          </TabsContent>

          {/* ── 照片 Tab ─────────────────────────────── */}
          <TabsContent value="photo" className="space-y-4">
            {/* 上传区域 */}
            <div
              onClick={() => photoInputRef.current?.click()}
              className="rounded-2xl border-2 border-dashed border-border bg-card p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all"
              role="button"
              tabIndex={0}
              aria-label="上传照片"
              onKeyDown={(e) => e.key === "Enter" && photoInputRef.current?.click()}
            >
              <span className="text-4xl" aria-hidden="true">🖼️</span>
              <p className="text-base font-semibold text-foreground text-center">
                点击上传照片
              </p>
              <p className="text-sm text-muted-foreground">支持 JPG、PNG、HEIC</p>
              <div className="px-5 py-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground">
                选择照片
              </div>
            </div>

            {/* 照片预览网格 */}
            {photos.length > 0 && (
              <div className="space-y-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="rounded-2xl bg-card border border-border overflow-hidden">
                    {/* 照片预览（mock 色块） */}
                    <div
                      className="w-full h-40 flex items-center justify-center text-4xl text-white relative"
                      style={{ backgroundColor: photo.color }}
                      role="img"
                      aria-label="照片预览"
                    >
                      <span aria-hidden="true">🖼️</span>
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 text-white text-sm flex items-center justify-center hover:bg-black/60 transition-colors"
                        aria-label="删除这张照片"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="p-4 space-y-3">
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => updatePhotoCaption(photo.id, e.target.value)}
                        placeholder="这张照片是……（写几句说明）"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                        aria-label="照片说明"
                      />
                      <input
                        type="text"
                        value={photo.timePeriod}
                        onChange={(e) => updatePhotoTimePeriod(photo.id, e.target.value)}
                        placeholder="拍摄时间（如：1982年、婚礼那天）"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                        aria-label="拍摄时间"
                      />
                    </div>
                  </div>
                ))}

                {photoDone ? (
                  <div className="rounded-xl bg-primary/10 border border-primary/30 p-4 text-center">
                    <p className="text-sm font-medium text-primary">{photos.length} 张照片已加入素材库 ✓</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setPhotoDone(true)}
                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors"
                  >
                    导入 {photos.length} 张照片到素材库
                  </button>
                )}
              </div>
            )}

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAddPhoto}
              aria-label="选择照片"
            />
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav profileId={id} />
    </div>
  )
}
