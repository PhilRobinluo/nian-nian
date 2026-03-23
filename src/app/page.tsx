"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  BookOpen,
  Gift,
  ArrowRight,
  Heart,
  Clock,
  Share2,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

// ——————————————————————————————————————————
// Hero 配图组件（public/hero.png 存在时显示图片，否则显示装饰性 fallback）
// ——————————————————————————————————————————

function HeroImage() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Fallback: 温暖的装饰性 CSS 图案
    return (
      <div className="w-full aspect-[3/2] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border border-amber-200/60 shadow-lg flex items-center justify-center">
        <div className="text-center space-y-3 px-8">
          <BookOpen className="w-16 h-16 text-amber-300 mx-auto" />
          <p className="text-amber-600/70 text-sm">
            将 hero.png 放入 public/ 目录即可显示配图
          </p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src="/hero.png"
      alt="老人坐在摇椅上，记忆从书中流淌出来"
      width={600}
      height={400}
      className="w-full h-auto rounded-2xl shadow-lg border border-amber-100/50"
      priority
      onError={() => setHasError(true)}
    />
  );
}

// ——————————————————————————————————————————
// 数据常量
// ——————————————————————————————————————————

const VALUE_CARDS = [
  {
    icon: MessageCircle,
    title: "像老朋友一样聊天",
    desc: "AI 主动引导话题，不用担心『不知道说什么』。就像老友叙旧，想到哪说到哪。",
  },
  {
    icon: BookOpen,
    title: "自动整理成章节",
    desc: "零散对话变成连贯故事，时间线清晰有条理。每段记忆都有它应在的位置。",
  },
  {
    icon: Gift,
    title: "生成一本回忆录",
    desc: "精美排版，可导出 PDF。送给全家人的礼物，一本独一无二的人生之书。",
  },
];

const STEPS = [
  { icon: MessageCircle, label: "开始对话" },
  { icon: Heart, label: "AI 引导" },
  { icon: Clock, label: "整理成书" },
  { icon: Share2, label: "分享传承" },
];

// ——————————————————————————————————————————
// 组件
// ——————————————————————————————————————————

export default function HomePage() {
  const { user, isLoading, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── 导航栏 ── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 select-none">
            <span
              className="text-2xl font-bold tracking-wide text-primary"
              style={{ fontFamily: "'Noto Serif SC', serif", letterSpacing: "0.12em" }}
            >
              念念
            </span>
          </Link>

          {/* Nav actions */}
          <nav className="flex items-center gap-3">
            <Link
              href="#values"
              className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
            >
              了解更多
            </Link>
            <Link
              href="/projects"
              className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
            >
              我的项目
            </Link>

            {!isLoading && user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm text-muted-foreground truncate max-w-[140px]">
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-muted-foreground hover:text-foreground gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">退出</span>
                </Button>
                <Link
                  href="/projects"
                  className={cn(buttonVariants({ size: "sm" }), "rounded-xl px-5")}
                >
                  我的项目
                </Link>
              </div>
            ) : !isLoading ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
                >
                  登录
                </Link>
                <Link
                  href="/auth"
                  className={cn(buttonVariants({ size: "sm" }), "rounded-xl px-5")}
                >
                  开始使用
                </Link>
              </div>
            ) : null}
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section
          className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20 pb-16 text-center overflow-hidden"
          aria-label="主要介绍"
        >
          {/* 纸张纹理背景 */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
              backgroundSize: "200px 200px",
            }}
            aria-hidden="true"
          />
          {/* 暖光晕 */}
          <div
            className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse, oklch(0.85 0.10 75) 0%, transparent 70%)" }}
            aria-hidden="true"
          />

          <div className="relative max-w-4xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm text-primary font-medium">
              <Heart className="size-3.5" aria-hidden="true" />
              AI 人生故事记录器
            </p>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl md:leading-[1.15]">
              每个人的一生，
              <br />
              <span className="text-primary">都值得被记住</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              用 AI 陪老人聊过去的故事，自动整理成一本独一无二的人生回忆录
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href={user ? "/projects" : "/auth"}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full rounded-xl px-8 py-6 text-base sm:w-auto",
                )}
              >
                {user ? "我的项目" : "为爸妈开始记录"}
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
              <Link
                href={user ? "/projects/new" : "/auth"}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full rounded-xl px-8 py-6 text-base sm:w-auto",
                )}
              >
                {user ? "新建回忆录" : "我是老人，想讲故事"}
              </Link>
            </div>

            {/* 社会证明小字 */}
            <p className="mt-8 text-sm text-muted-foreground">
              已有 <span className="font-semibold text-foreground">2,000+</span> 个家庭开始记录
            </p>
          </div>

          {/* Hero 配图 —— 将 hero.png 放到 public/ 目录即可显示 */}
          <div className="relative mt-16 max-w-xl mx-auto">
            <HeroImage />
          </div>
        </section>

        {/* ── 成品展示 ── */}
        <section className="px-6 py-20 bg-gradient-to-b from-background to-secondary/20" aria-label="成品展示">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
              每个人的故事，都值得成为一本书
            </h2>
            <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
              AI 帮您整理、排版，生成一本可以印刷的精装回忆录
            </p>
            <div className="relative max-w-3xl mx-auto">
              <Image
                src="/showcase.png"
                alt="精美的人生回忆录精装书展示"
                width={1200}
                height={675}
                className="rounded-2xl shadow-2xl border border-amber-200/40"
                priority={false}
              />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-2 shadow-md border border-amber-100">
                <p className="text-sm text-muted-foreground font-medium">
                  ✨ 这就是念念帮您生成的回忆录
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 价值卡片 ── */}
        <section
          id="values"
          className="bg-secondary/30 px-6 py-24"
          aria-label="产品价值"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                为什么选择念念？
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                专为家庭记忆保存而设计，简单、温暖、有意义
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {VALUE_CARDS.map(({ icon: Icon, title, desc }) => (
                <Card
                  key={title}
                  className="group cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 border-border/50"
                >
                  <CardContent className="flex flex-col gap-4 p-8">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                      <Icon className="size-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── 流程展示 ── */}
        <section className="px-6 py-24" aria-label="使用流程">
          <div className="mx-auto max-w-5xl">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                四步，留住珍贵记忆
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">简单到任何人都能上手</p>
            </div>

            <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-0">
              {STEPS.map(({ icon: Icon, label }, idx) => (
                <div key={label} className="flex items-center md:flex-1">
                  {/* 步骤卡 */}
                  <div className="flex flex-col items-center gap-3 flex-1">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Icon className="size-7" aria-hidden="true" />
                    </div>
                    <div className="text-center">
                      <span className="block text-xs font-medium text-muted-foreground mb-1">
                        Step {idx + 1}
                      </span>
                      <span className="text-base font-semibold">{label}</span>
                    </div>
                  </div>
                  {/* 箭头连接 */}
                  {idx < STEPS.length - 1 && (
                    <ArrowRight
                      className="hidden md:block size-5 text-muted-foreground/40 shrink-0 mx-1"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 情感区域 ── */}
        <section
          className="px-6 py-24"
          style={{ background: "linear-gradient(to bottom, oklch(0.96 0.015 80), oklch(0.99 0.005 85))" }}
          aria-label="情感共鸣"
        >
          <div className="mx-auto max-w-3xl text-center">
            <div className="relative">
              {/* 装饰引号 */}
              <span
                className="pointer-events-none absolute -top-8 -left-4 text-8xl font-serif text-primary/15 leading-none select-none"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <blockquote className="relative text-xl leading-relaxed text-foreground/80 md:text-2xl md:leading-relaxed font-medium">
                对老人来说，是带着故事离开的遗憾；
                <br className="hidden sm:block" />
                对子女来说，是再也问不出口的遗憾。
              </blockquote>
              <span
                className="pointer-events-none absolute -bottom-8 -right-4 text-8xl font-serif text-primary/15 leading-none select-none"
                aria-hidden="true"
              >
                &rdquo;
              </span>
            </div>
            <p className="mt-10 text-muted-foreground text-lg">
              在还来得及的时候，把故事留下来。
            </p>
          </div>
        </section>

        {/* ── 底部 CTA ── */}
        <section className="px-6 py-24 text-center" aria-label="行动号召">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              现在就开始，留住 TA 的故事
            </h2>
            <p className="mt-5 text-muted-foreground text-lg">
              每一次对话，都是珍贵的礼物
            </p>
            <Link
              href={user ? "/projects" : "/auth"}
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-10 rounded-xl px-12 py-6 text-base",
              )}
            >
              开始记录
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span
            className="text-base font-bold text-primary"
            style={{ fontFamily: "'Noto Serif SC', serif", letterSpacing: "0.12em" }}
          >
            念念
          </span>
          <span>老人念叨过去，子女念念不忘</span>
          <span>&copy; {new Date().getFullYear()} 念念. 保留所有权利。</span>
        </div>
      </footer>
    </div>
  );
}
