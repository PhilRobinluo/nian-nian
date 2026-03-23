"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, ArrowLeft, Loader2, Mail, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, user, isLoading: authLoading } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // If already logged in, redirect
  if (!authLoading && user) {
    router.replace("/projects");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.trim() || !password.trim()) {
      setError("请填写邮箱和密码");
      return;
    }

    if (password.length < 6) {
      setError("密码至少需要 6 位");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error === "Invalid login credentials" ? "邮箱或密码错误" : result.error);
        } else {
          router.replace("/projects");
        }
      } else {
        const result = await signUp(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          setSuccessMessage("注册成功！请查收验证邮件，然后登录。");
          setMode("login");
          setPassword("");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-white border-b border-stone-200 shadow-sm shrink-0">
        <Link href="/">
          <Button
            variant="ghost"
            size="icon"
            aria-label="返回首页"
            className="text-stone-500 hover:text-stone-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <span
          className="text-xl font-bold text-amber-700"
          style={{ fontFamily: "'Noto Serif SC', serif", letterSpacing: "0.12em" }}
        >
          念念
        </span>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-amber-500" />
            </div>
            <h1 className="text-2xl font-semibold text-stone-800 mb-2">
              {mode === "login" ? "欢迎回来" : "创建账号"}
            </h1>
            <p className="text-stone-500 text-base">
              {mode === "login"
                ? "登录后继续记录您的珍贵回忆"
                : "注册后开始用念念记录人生故事"}
            </p>
          </div>

          {/* Tab switch */}
          <div className="flex bg-stone-100 rounded-2xl p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setSuccessMessage("");
              }}
              className={`flex-1 py-2.5 text-base font-medium rounded-xl transition-all ${
                mode === "login"
                  ? "bg-white text-stone-800 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
                setSuccessMessage("");
              }}
              className={`flex-1 py-2.5 text-base font-medium rounded-xl transition-all ${
                mode === "register"
                  ? "bg-white text-stone-800 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              注册
            </button>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-base font-medium text-stone-700">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱"
                  className="text-lg h-14 pl-12 pr-5 rounded-2xl border-stone-300 focus-visible:ring-amber-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-base font-medium text-stone-700">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "register" ? "至少 6 位密码" : "请输入密码"}
                  className="text-lg h-14 pl-12 pr-5 rounded-2xl border-stone-300 focus-visible:ring-amber-400"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-lg rounded-2xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm mt-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : mode === "login" ? (
                "登录"
              ) : (
                "注册"
              )}
            </Button>
          </form>

          {/* Footer hint */}
          <p className="text-center text-sm text-stone-400 mt-6">
            {mode === "login" ? "还没有账号？" : "已有账号？"}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
                setSuccessMessage("");
              }}
              className="text-amber-600 hover:text-amber-700 font-medium ml-1"
            >
              {mode === "login" ? "立即注册" : "去登录"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
