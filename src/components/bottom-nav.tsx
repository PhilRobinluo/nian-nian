"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItem {
  href: string
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/profile/wang-xiulan/chat", label: "对话", icon: "💬" },
  { href: "/profile/wang-xiulan/memoir", label: "回忆录", icon: "📖" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t border-border bg-card/95 backdrop-blur-sm z-50"
      aria-label="底部导航"
    >
      <div className="flex items-stretch">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.includes(item.label === "对话" ? "/chat" : item.label === "回忆录" ? "/memoir" : "")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors",
                "min-h-[56px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
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
