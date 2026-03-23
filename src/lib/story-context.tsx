"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  Story,
  Conversation,
  ConversationMessage,
  BookData,
  Chapter,
  Project,
} from "./types";
import { LIFE_PHASES } from "./types";
import {
  getProjects as loadProjects,
  saveProject as persistProject,
  deleteProject as removeProject,
  getCurrentProjectId,
  setCurrentProjectId,
  getConversations,
  saveConversation as persistConversation,
  getConversation,
  getStories,
  saveStory as persistStory,
  getBook,
  saveBook as persistBook,
  generateId,
} from "./storage";
import { useAuth } from "./auth-context";

// ---------- Context 类型 ----------

interface StoryContextType {
  // 项目管理
  projects: Project[];
  currentProject: Project | null;
  createProject: (data: Omit<Project, "id" | "createdAt">) => Project;
  switchProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;

  // 对话
  conversations: Conversation[];
  currentConversation: Conversation | null;
  startConversation: (topic: string, phase: string) => string;
  addMessage: (convId: string, message: ConversationMessage) => void;
  endConversation: (convId: string) => void;

  // 故事
  stories: Story[];
  addStory: (story: Story) => void;
  updateStory: (storyId: string, updates: Partial<Story>) => void;

  // 回忆录
  book: BookData | null;
  updateBook: (book: BookData) => void;

  // 故事生成（返回生成的 story id）
  generateStoryFromConversation: (convId: string) => Promise<string | null>;
  isGenerating: boolean;

  // 兼容旧代码 - profile 映射到 currentProject
  profile: { name: string; birthYear: string; hometown: string; createdAt: string } | null;
  setProfile: (p: { name: string; birthYear: string; hometown: string; createdAt: string }) => void;
}

const StoryContext = createContext<StoryContextType | null>(null);

// ---------- Provider ----------

export function StoryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id;

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [book, setBook] = useState<BookData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load projects and current project when userId changes
  useEffect(() => {
    if (!userId) {
      setProjects([]);
      setCurrentProject(null);
      setConversations([]);
      setStories([]);
      setBook(null);
      return;
    }

    const allProjects = loadProjects(userId);
    setProjects(allProjects);

    const currentProjId = getCurrentProjectId(userId);
    if (currentProjId) {
      const proj = allProjects.find((p) => p.id === currentProjId) ?? null;
      setCurrentProject(proj);
      if (proj) {
        setConversations(getConversations(userId, proj.id));
        setStories(getStories(userId, proj.id));
        setBook(getBook(userId, proj.id));
      }
    } else {
      setCurrentProject(null);
      setConversations([]);
      setStories([]);
      setBook(null);
    }
  }, [userId]);

  // ---- 项目管理 ----

  const createProject = useCallback(
    (data: Omit<Project, "id" | "createdAt">): Project => {
      const project: Project = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      if (userId) {
        persistProject(userId, project);
        setProjects((prev) => [...prev, project]);
        // Auto-switch to new project
        setCurrentProjectId(userId, project.id);
        setCurrentProject(project);
        setConversations([]);
        setStories([]);
        setBook(null);
      }
      return project;
    },
    [userId],
  );

  const switchProject = useCallback(
    (projectId: string) => {
      if (!userId) return;
      const proj = projects.find((p) => p.id === projectId);
      if (!proj) return;

      setCurrentProjectId(userId, projectId);
      setCurrentProject(proj);
      setConversations(getConversations(userId, projectId));
      setStories(getStories(userId, projectId));
      setBook(getBook(userId, projectId));
      setCurrentConversation(null);
    },
    [userId, projects],
  );

  const deleteProjectFn = useCallback(
    (projectId: string) => {
      if (!userId) return;
      removeProject(userId, projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
        setConversations([]);
        setStories([]);
        setBook(null);
      }
    },
    [userId, currentProject],
  );

  // ---- 对话管理 ----

  const projectId = currentProject?.id;

  const startConversation = useCallback(
    (topic: string, phase: string): string => {
      const conv: Conversation = {
        id: generateId(),
        topic,
        messages: [],
        createdAt: new Date().toISOString(),
        phase,
      };
      setConversations((prev) => {
        const next = [...prev, conv];
        persistConversation(conv, userId, projectId);
        return next;
      });
      setCurrentConversation(conv);
      return conv.id;
    },
    [userId, projectId],
  );

  const addMessage = useCallback(
    (convId: string, message: ConversationMessage) => {
      setConversations((prev) => {
        const next = prev.map((c) => {
          if (c.id !== convId) return c;
          const updated = { ...c, messages: [...c.messages, message] };
          persistConversation(updated, userId, projectId);
          setCurrentConversation((cur) =>
            cur?.id === convId ? updated : cur,
          );
          return updated;
        });
        return next;
      });
    },
    [userId, projectId],
  );

  const endConversation = useCallback((convId: string) => {
    setCurrentConversation((cur) => (cur?.id === convId ? null : cur));
  }, []);

  // ---- 故事管理 ----

  const addStory = useCallback(
    (story: Story) => {
      setStories((prev) => {
        const next = [...prev, story];
        persistStory(story, userId, projectId);
        return next;
      });
    },
    [userId, projectId],
  );

  const updateStory = useCallback(
    (storyId: string, updates: Partial<Story>) => {
      setStories((prev) => {
        const next = prev.map((s) => {
          if (s.id !== storyId) return s;
          const updated = { ...s, ...updates };
          persistStory(updated, userId, projectId);
          return updated;
        });
        return next;
      });
    },
    [userId, projectId],
  );

  // ---- 回忆录 ----

  const updateBook = useCallback(
    (b: BookData) => {
      setBook(b);
      persistBook(b, userId, projectId);
    },
    [userId, projectId],
  );

  // ---- profile 兼容层 (映射到 currentProject) ----

  const profile = currentProject
    ? {
        name: currentProject.subjectName,
        birthYear: currentProject.birthYear,
        hometown: currentProject.hometown,
        createdAt: currentProject.createdAt,
      }
    : null;

  const setProfile = useCallback(
    (p: { name: string; birthYear: string; hometown: string; createdAt: string }) => {
      // 如果有 currentProject，更新它；否则创建新项目
      if (currentProject && userId) {
        const updated: Project = {
          ...currentProject,
          subjectName: p.name,
          birthYear: p.birthYear,
          hometown: p.hometown,
        };
        persistProject(userId, updated);
        setCurrentProject(updated);
        setProjects((prev) =>
          prev.map((proj) => (proj.id === updated.id ? updated : proj)),
        );
      }
    },
    [currentProject, userId],
  );

  // ---- 故事生成 ----

  const generateStoryFromConversation = useCallback(
    async (convId: string): Promise<string | null> => {
      const conv = getConversation(convId, userId, projectId);
      if (!conv || conv.messages.length === 0) return null;

      setIsGenerating(true);
      try {
        const res = await fetch("/api/generate-story", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: conv.messages,
            phase: conv.phase,
          }),
        });

        if (!res.ok) {
          throw new Error(`故事生成失败: ${res.status}`);
        }

        const data = await res.json();

        const story: Story = {
          id: generateId(),
          phase: data.phase ?? conv.phase,
          title: data.title,
          content: data.content,
          summary: data.summary,
          date: new Date().toISOString(),
          wordCount: data.content.length,
          conversationIds: [convId],
          status: "draft",
        };

        // 保存故事（草稿状态）
        addStory(story);

        // 更新回忆录
        setBook((prev) => {
          const subjectName = currentProject?.subjectName ?? "";
          const current = prev ?? {
            title: subjectName
              ? `${subjectName}的人生故事`
              : "我的人生故事",
            subtitle: "用念念记录的珍贵回忆",
            authorName: subjectName,
            chapters: LIFE_PHASES.map((phase) => ({
              id: generateId(),
              title: phase,
              phase,
              content: "",
              storyIds: [],
            })),
          };

          const updatedChapters = current.chapters.map((ch: Chapter) => {
            if (ch.phase !== story.phase) return ch;
            return {
              ...ch,
              storyIds: [...ch.storyIds, story.id],
              content: ch.content
                ? `${ch.content}\n\n---\n\n${story.content}`
                : story.content,
            };
          });

          const updatedBook: BookData = {
            ...current,
            chapters: updatedChapters,
          };
          persistBook(updatedBook, userId, projectId);
          return updatedBook;
        });

        return story.id;
      } catch (err) {
        console.error("故事生成失败:", err);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [addStory, currentProject, userId, projectId],
  );

  return (
    <StoryContext
      value={{
        projects,
        currentProject,
        createProject,
        switchProject,
        deleteProject: deleteProjectFn,
        conversations,
        currentConversation,
        startConversation,
        addMessage,
        endConversation,
        stories,
        addStory,
        updateStory,
        book,
        updateBook,
        generateStoryFromConversation,
        isGenerating,
        profile,
        setProfile,
      }}
    >
      {children}
    </StoryContext>
  );
}

// ---------- Hook ----------

export function useStory(): StoryContextType {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStory must be used within StoryProvider");
  }
  return context;
}
