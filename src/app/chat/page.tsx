"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Send,
  ArrowLeft,
  Sparkles,
  Clock,
  Heart,
  Briefcase,
  Users,
  Mic,
  Square,
  BookOpen,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { useStory } from "@/lib/story-context";
import { useAuth } from "@/lib/auth-context";
import type { ConversationMessage } from "@/lib/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const INITIAL_TOPICS = [
  { icon: Clock, label: "聊聊您的童年", text: "我想聊聊我的童年故事。", phase: "童年时光" },
  { icon: Briefcase, label: "说说您的工作经历", text: "我想说说我的工作经历。", phase: "工作生涯" },
  { icon: Users, label: "回忆您的家庭", text: "我想回忆一下我的家庭。", phase: "家庭生活" },
  { icon: Heart, label: "讲讲您最骄傲的事", text: "我想讲讲我这辈子最骄傲的事。", phase: "家庭生活" },
];

// ---------------------------------------------------------------------------
// Voice input hook (MediaRecorder + server-side transcription)
// ---------------------------------------------------------------------------

function useVoiceInput() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Determine best supported mimeType
      let mimeType = "audio/webm";
      if (typeof MediaRecorder !== "undefined") {
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4";
        } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
          mimeType = "audio/ogg";
        }
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // collect data every second
      setIsRecording(true);
      setRecordingTime(0);
      setTranscript("");

      // Timer
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (err) {
      console.error("录音权限被拒绝", err);
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
        resolve("");
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        if (timerRef.current) clearInterval(timerRef.current);

        const mimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setIsRecording(false);
        setIsTranscribing(true);

        // Stop microphone tracks
        mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());

        try {
          const formData = new FormData();
          formData.append("audio", blob, "recording.webm");

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();

          if (data.text) {
            setTranscript(data.text);
            resolve(data.text);
          } else {
            resolve("");
          }
        } catch {
          resolve("");
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorderRef.current.stop();
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return {
    isRecording,
    isTranscribing,
    transcript,
    recordingTime,
    startRecording,
    stopRecording,
  };
}

// ---------------------------------------------------------------------------
// Format recording time
// ---------------------------------------------------------------------------

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ---------------------------------------------------------------------------
// Main Chat Page
// ---------------------------------------------------------------------------

export default function ChatPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const {
    isRecording,
    isTranscribing,
    transcript,
    recordingTime,
    startRecording,
    stopRecording,
  } = useVoiceInput();

  // Story context
  const {
    addMessage,
    startConversation,
    endConversation,
    generateStoryFromConversation,
    isGenerating,
    currentProject,
  } = useStory();

  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<string>("童年时光");

  // Auth guard: redirect to /auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [authLoading, user, router]);

  // Project guard: redirect to /projects if no project selected
  useEffect(() => {
    if (!authLoading && user && !currentProject) {
      router.replace("/projects");
    }
  }, [authLoading, user, currentProject, router]);

  // Build dynamic welcome message
  const subjectName = currentProject?.subjectName ?? "您";
  const welcomeText = currentProject
    ? `您好！我是念念，很高兴能帮您记录${subjectName}的故事。每个人的经历都是独一无二的宝藏，我很想听听。咱们可以从任何时候开始——${subjectName}小时候住在哪里呀？`
    : "您好！我是念念，很高兴能陪您聊聊过去的故事。每个人的经历都是独一无二的宝藏，我很想听听您的。咱们可以从任何时候开始——您小时候住在哪里呀？";

  const WELCOME_MESSAGE = {
    id: "welcome",
    role: "assistant" as const,
    content: welcomeText,
    parts: [{ type: "text" as const, text: welcomeText }],
  };

  // useChat with onFinish to capture completed assistant messages
  const { messages, sendMessage, status } = useChat({
    onFinish: ({ message }) => {
      if (message.role === "assistant" && currentConvId) {
        const textContent =
          message.parts
            ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
            .map((p) => p.text)
            .join("") || "";

        const convMsg: ConversationMessage = {
          role: "assistant",
          content: textContent,
          timestamp: new Date().toISOString(),
        };
        addMessage(currentConvId, convMsg);
      }
    },
  });

  const isStreaming = status === "streaming";
  const hasUserMessages = messages.length > 0;
  const showTopics = !hasUserMessages;

  // Sync voice transcript to input
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Ensure conversation exists, return its id
  const ensureConversation = useCallback(
    (phase: string): string => {
      if (currentConvId) return currentConvId;
      const topic = `关于${phase}的对话`;
      const convId = startConversation(topic, phase);
      setCurrentConvId(convId);
      setCurrentPhase(phase);
      return convId;
    },
    [currentConvId, startConversation],
  );

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isStreaming) return;
    setInputValue("");

    // Create conversation on first user message
    const convId = ensureConversation(currentPhase);

    // Save user message to conversation
    const userMsg: ConversationMessage = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    addMessage(convId, userMsg);

    sendMessage({ text });
  };

  const handleTopicClick = (text: string, phase: string) => {
    if (isStreaming) return;

    // Set the phase and create conversation
    setCurrentPhase(phase);
    const topic = `关于${phase}的对话`;
    const convId = startConversation(topic, phase);
    setCurrentConvId(convId);

    // Save user message
    const userMsg: ConversationMessage = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    addMessage(convId, userMsg);

    sendMessage({ text });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      const text = await stopRecording();
      if (text) {
        setInputValue(text);
      }
    } else {
      setInputValue("");
      await startRecording();
    }
  };

  const handleEndConversation = async () => {
    if (!currentConvId) return;

    endConversation(currentConvId);

    try {
      const storyId = await generateStoryFromConversation(currentConvId);
      if (storyId) {
        // 跳转到编辑页，让用户审阅和修改草稿
        router.push(`/stories/${storyId}/edit`);
      } else {
        router.push("/stories");
      }
    } catch (err) {
      console.error("故事生成失败:", err);
      router.push("/stories");
    }
  };

  // Loading state
  if (authLoading || (!authLoading && !user)) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-50">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  // No project selected - show loading while redirecting
  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-50">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  const allMessages = [WELCOME_MESSAGE, ...messages];

  return (
    <div className="flex flex-col h-screen bg-stone-50">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-white border-b border-stone-200 shadow-sm shrink-0">
        <Link href="/projects">
          <Button
            variant="ghost"
            size="icon"
            aria-label="返回项目列表"
            className="text-stone-500 hover:text-stone-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
          <span className="text-lg font-semibold text-stone-800 truncate">
            {currentProject.name}
          </span>
        </div>

        {/* Switch project button */}
        <Link href="/projects">
          <Button
            variant="ghost"
            size="sm"
            className="text-stone-400 hover:text-stone-600 gap-1 text-xs hidden sm:inline-flex"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            切换项目
          </Button>
        </Link>

        {/* End conversation button - only shown when conversation has started */}
        {hasUserMessages && !isGenerating && (
          <Button
            onClick={handleEndConversation}
            disabled={isStreaming}
            className="text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-4 py-2 shadow-sm gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            结束对话并生成故事
          </Button>
        )}

        {/* Generating indicator */}
        {isGenerating && (
          <Badge
            variant="secondary"
            className="text-sm bg-amber-100 text-amber-700 border-amber-200 gap-1.5 animate-pulse"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            正在生成故事...
          </Badge>
        )}

        {!hasUserMessages && !isGenerating && (
          <Link href="/stories">
            <Badge
              variant="secondary"
              className="text-sm bg-stone-100 text-stone-500 border-stone-200 cursor-pointer hover:bg-stone-200 transition-colors"
            >
              故事集
            </Badge>
          </Link>
        )}
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-5 pb-2">
          {allMessages.map((message) => {
            const isAI = message.role === "assistant";
            return (
              <div
                key={message.id}
                className={`flex ${isAI ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`
                    max-w-[80%] rounded-2xl px-5 py-4
                    ${
                      isAI
                        ? "bg-amber-50 border border-amber-100 text-stone-800 rounded-tl-sm"
                        : "bg-amber-500 text-white rounded-tr-sm shadow-sm"
                    }
                  `}
                >
                  {message.parts.map((part, i) => {
                    if (part.type === "text") {
                      return (
                        <p
                          key={i}
                          className="text-lg leading-relaxed"
                          style={{ lineHeight: "1.65" }}
                        >
                          {part.text}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          })}

          {/* Streaming indicator */}
          {isStreaming && (
            <div className="flex justify-start">
              <div className="bg-amber-50 border border-amber-100 rounded-2xl rounded-tl-sm px-5 py-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          {/* Topic guide cards — shown before any user message */}
          {showTopics && (
            <div className="mt-4">
              <p className="text-base text-stone-500 mb-3 text-center">
                — 或者选一个话题开始聊 —
              </p>
              <div className="grid grid-cols-2 gap-3">
                {INITIAL_TOPICS.map(({ icon: Icon, label, text, phase }) => (
                  <Card
                    key={label}
                    onClick={() => handleTopicClick(text, phase)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-amber-50 hover:border-amber-300 transition-colors border-stone-200 active:scale-95"
                  >
                    <Icon className="w-5 h-5 text-amber-500 shrink-0" />
                    <span className="text-base text-stone-700 leading-snug">{label}</span>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Voice Recording Indicator */}
      {isRecording && (
        <div className="shrink-0 bg-red-50 border-t border-red-200 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-600 text-base font-medium">
              正在录音 {formatTime(recordingTime)}
            </span>
          </div>
        </div>
      )}

      {/* Transcribing Indicator */}
      {isTranscribing && (
        <div className="shrink-0 bg-amber-50 border-t border-amber-200 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
            <span className="text-amber-700 text-base font-medium">
              正在识别您的语音...
            </span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="shrink-0 bg-white border-t border-stone-200 px-4 py-4 shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
        <div className="max-w-2xl mx-auto flex gap-3 items-center">
          {/* Voice Button - Big & Prominent */}
          <Button
            onClick={handleVoiceToggle}
            size="icon"
            disabled={isTranscribing}
            aria-label={isRecording ? "停止录音" : "开始语音输入"}
            className={`w-14 h-14 rounded-2xl shrink-0 shadow-sm transition-all ${
              isRecording
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : isTranscribing
                  ? "bg-amber-100 text-amber-500 cursor-wait"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-600"
            }`}
          >
            {isRecording ? (
              <Square className="w-5 h-5 text-white" />
            ) : isTranscribing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </Button>

          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isRecording
                ? "正在录音中..."
                : isTranscribing
                  ? "正在识别..."
                  : "说说您的故事..."
            }
            disabled={isStreaming || isRecording || isTranscribing}
            className="flex-1 text-lg h-14 px-5 rounded-2xl border-stone-300 focus-visible:ring-amber-400 placeholder:text-stone-400"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isStreaming || isRecording || isTranscribing}
            size="icon"
            aria-label="发送消息"
            className="w-14 h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 shrink-0 shadow-sm"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        {/* Voice hint for first-time users */}
        {!hasUserMessages && !isRecording && !isTranscribing && (
          <p className="text-center text-sm text-stone-400 mt-2 max-w-2xl mx-auto">
            点击麦克风按钮，直接说话就行，不用打字
          </p>
        )}
      </div>
    </div>
  );
}
