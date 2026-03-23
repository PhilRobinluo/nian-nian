"use client";

import { AuthProvider } from "@/lib/auth-context";
import { StoryProvider } from "@/lib/story-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StoryProvider>{children}</StoryProvider>
    </AuthProvider>
  );
}
