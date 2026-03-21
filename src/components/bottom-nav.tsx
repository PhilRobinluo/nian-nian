"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface BottomNavProps {
  profileId?: string
}

export function BottomNav({ profileId }: BottomNavProps) {
  const pathname = usePathname()

  // 首页 tab 始终用固定路径
  const homeActive = pathname === "/" || pathname === "/profile/new"

  // 动态 profile tab，用传入的 profileId 或从路径解析
  const resolvedProfileId =
    profileId ??
    (() => {
      const match = pathname.match(/^\/profile\/([^/]+)/)
      return match ? match[1] : null
    })()

  // 如果没有 profileId，二到五个 tab 不激活
  const basePath = resolvedProfileId ? `/profile/${resolvedProfileId}` : null

  type NavItem = {
    href: string
    label: string
    icon: string
    isActive: () => boolean
  }

  const NAV_ITEMS: NavItem[] = [
    {
      href: "/",
      label: "首页",
      icon: "🏠",
      isActive: () => homeActive,
    },
    {
      href: basePath ? `${basePath}/chat` : "/",
      label: "对话",
      icon: "🎙️",
      isActive: () => !!basePath && pathname.includes("/chat"),
    },
    {
      href: basePath ? `${basePath}/import` : "/",
      label: "导入",
      icon: "📁",
      isActive: () => !!basePath && pathname.includes("/import"),
    },
    {
      href: basePath ? `${basePath}/materials` : "/",
      label: "资料",
      icon: "✏️",
      isActive: () =>
        !!basePath &&
        (pathname.includes("/materials") || pathname.includes("/organize")),
    },
    {
      href: basePath ? `${basePath}/memoir` : "/",
      label: "回忆录",
      icon: "📖",
      isActive: () => !!basePath && pathname.includes("/memoir"),
    },
  ]

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t border-border bg-card/95 backdrop-blur-sm z-50"
      aria-label="底部导航"
    >
      <div className="flex items-stretch">
        {NAV_ITEMS.map((item) => {
          const active = item.isActive()
          const disabled = !basePath && item.label !== "首页"

          return (
            <Link
              key={`${item.label}-${item.href}`}
              href={disabled ? "/" : item.href}
              className={[
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors",
                "min-h-[56px]",
                active
                  ? "text-primary"
                  : disabled
                  ? "text-muted-foreground/40 pointer-events-none"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
              aria-disabled={disabled}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
