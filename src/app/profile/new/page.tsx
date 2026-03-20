"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewProfilePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [birthYear, setBirthYear] = useState("")
  const [hometown, setHometown] = useState("")
  const [gender, setGender] = useState<"grandma" | "grandpa">("grandma")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // mock: 直接跳转到第一个档案详情
    router.push("/profile/wang-xiulan")
  }

  function handleAvatarClick() {
    // mock: 点击头像区域假装上传
    setAvatarPreview("mock")
  }

  const avatarColors = ["#C8956C", "#8B6914", "#795548", "#A0522D", "#6D4C41"]
  const [selectedColor, setSelectedColor] = useState(avatarColors[0])

  return (
    <div className="min-h-screen pb-8">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="mx-auto max-w-md px-4 py-4 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-muted transition-colors text-xl"
            aria-label="返回首页"
          >
            ‹
          </Link>
          <h1 className="text-xl font-semibold text-foreground">创建新档案</h1>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* 头像上传区 */}
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={handleAvatarClick}
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-md hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-primary"
              style={{ backgroundColor: selectedColor }}
              aria-label="点击上传头像"
            >
              {avatarPreview ? (name ? name[0] : "人") : <span className="text-3xl">📷</span>}
            </button>
            <p className="text-sm text-muted-foreground">点击上传头像（可选）</p>

            {/* 颜色选择 */}
            <div className="flex gap-3" role="group" aria-label="选择头像颜色">
              {avatarColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className="w-9 h-9 rounded-full border-2 transition-all focus-visible:outline-2 focus-visible:outline-primary"
                  style={{
                    backgroundColor: color,
                    borderColor: selectedColor === color ? "#3E2723" : "transparent",
                    transform: selectedColor === color ? "scale(1.15)" : "scale(1)",
                  }}
                  aria-label={`选择颜色 ${color}`}
                  aria-pressed={selectedColor === color}
                />
              ))}
            </div>
          </div>

          {/* 性别选择 */}
          <div className="space-y-2">
            <label className="text-base font-medium text-foreground">称呼</label>
            <div className="grid grid-cols-2 gap-3" role="group" aria-label="选择称呼">
              {(["grandma", "grandpa"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={[
                    "h-14 rounded-xl border-2 text-lg font-medium transition-all",
                    gender === g
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/50",
                  ].join(" ")}
                  aria-pressed={gender === g}
                >
                  {g === "grandma" ? "👵 奶奶" : "👴 爷爷"}
                </button>
              ))}
            </div>
          </div>

          {/* 姓名 */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-base font-medium text-foreground">
              姓名 <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              type="text"
              placeholder="请输入老人的姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-14 text-lg px-4 bg-card border-border focus:border-primary"
              aria-required="true"
            />
          </div>

          {/* 出生年份 */}
          <div className="space-y-2">
            <label htmlFor="birthYear" className="text-base font-medium text-foreground">
              出生年份
            </label>
            <Input
              id="birthYear"
              type="number"
              placeholder="例如：1943"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              min={1920}
              max={2010}
              className="h-14 text-lg px-4 bg-card border-border focus:border-primary"
            />
          </div>

          {/* 籍贯 */}
          <div className="space-y-2">
            <label htmlFor="hometown" className="text-base font-medium text-foreground">
              籍贯
            </label>
            <Input
              id="hometown"
              type="text"
              placeholder="例如：湖南省湘潭县"
              value={hometown}
              onChange={(e) => setHometown(e.target.value)}
              className="h-14 text-lg px-4 bg-card border-border focus:border-primary"
            />
          </div>

          {/* 提示语 */}
          <div className="rounded-xl bg-secondary/60 border border-border p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              💡 创建档案后，AI 会根据老人的信息，用温暖的方式引导 TA 讲述自己的故事。
            </p>
          </div>

          {/* 提交按钮 */}
          <Button
            type="submit"
            disabled={!name.trim()}
            className="w-full h-14 text-lg font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            开始记录故事
          </Button>
        </form>
      </main>
    </div>
  )
}
