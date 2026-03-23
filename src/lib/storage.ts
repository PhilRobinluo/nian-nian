import type { Story, Conversation, BookData, Project } from "./types";

// Storage keys are now prefixed with userId + projectId for data isolation
function storageKeys(userId?: string, projectId?: string) {
  const base = userId ? `nianninan_${userId}` : "nianninan";
  const prefix = projectId ? `${base}_${projectId}` : base;
  return {
    STORIES: `${prefix}_stories`,
    CONVERSATIONS: `${prefix}_conversations`,
    BOOK: `${prefix}_book`,
    USER_PROFILE: `${base}_profile`, // profile is per-user, not per-project (legacy)
  } as const;
}

// ---------- 项目管理 ----------

function projectKeys(userId: string) {
  return {
    PROJECTS: `nianninan_${userId}_projects`,
    CURRENT_PROJECT: `nianninan_${userId}_current_project`,
  } as const;
}

export function getProjects(userId: string): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(projectKeys(userId).PROJECTS);
    return raw ? (JSON.parse(raw) as Project[]) : [];
  } catch {
    return [];
  }
}

export function saveProject(userId: string, project: Project): void {
  if (typeof window === "undefined") return;
  try {
    const all = getProjects(userId);
    const idx = all.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      all[idx] = project;
    } else {
      all.push(project);
    }
    localStorage.setItem(projectKeys(userId).PROJECTS, JSON.stringify(all));
  } catch {
    // storage error
  }
}

export function deleteProject(userId: string, projectId: string): void {
  if (typeof window === "undefined") return;
  try {
    const all = getProjects(userId).filter((p) => p.id !== projectId);
    localStorage.setItem(projectKeys(userId).PROJECTS, JSON.stringify(all));

    // Also clear project data
    const keys = storageKeys(userId, projectId);
    localStorage.removeItem(keys.STORIES);
    localStorage.removeItem(keys.CONVERSATIONS);
    localStorage.removeItem(keys.BOOK);

    // If current project is deleted, clear it
    const current = getCurrentProjectId(userId);
    if (current === projectId) {
      localStorage.removeItem(projectKeys(userId).CURRENT_PROJECT);
    }
  } catch {
    // storage error
  }
}

export function getCurrentProjectId(userId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(projectKeys(userId).CURRENT_PROJECT);
  } catch {
    return null;
  }
}

export function setCurrentProjectId(userId: string, projectId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(projectKeys(userId).CURRENT_PROJECT, projectId);
  } catch {
    // storage error
  }
}

// ---------- 用户资料 (legacy, kept for migration) ----------

export interface UserProfile {
  name: string;
  birthYear: string;
  hometown: string;
  createdAt: string;
}

export function getUserProfile(userId?: string): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const prefix = userId ? `nianninan_${userId}` : "nianninan";
    const raw = localStorage.getItem(`${prefix}_profile`);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile, userId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const prefix = userId ? `nianninan_${userId}` : "nianninan";
    localStorage.setItem(`${prefix}_profile`, JSON.stringify(profile));
  } catch {
    // quota exceeded or other storage error — silently ignore
  }
}

// ---------- 对话管理 ----------

export function getConversations(userId?: string, projectId?: string): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKeys(userId, projectId).CONVERSATIONS);
    return raw ? (JSON.parse(raw) as Conversation[]) : [];
  } catch {
    return [];
  }
}

export function saveConversation(conv: Conversation, userId?: string, projectId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const all = getConversations(userId, projectId);
    const idx = all.findIndex((c) => c.id === conv.id);
    if (idx >= 0) {
      all[idx] = conv;
    } else {
      all.push(conv);
    }
    localStorage.setItem(storageKeys(userId, projectId).CONVERSATIONS, JSON.stringify(all));
  } catch {
    // storage error
  }
}

export function getConversation(id: string, userId?: string, projectId?: string): Conversation | null {
  if (typeof window === "undefined") return null;
  try {
    const all = getConversations(userId, projectId);
    return all.find((c) => c.id === id) ?? null;
  } catch {
    return null;
  }
}

// ---------- 故事管理 ----------

export function getStories(userId?: string, projectId?: string): Story[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKeys(userId, projectId).STORIES);
    return raw ? (JSON.parse(raw) as Story[]) : [];
  } catch {
    return [];
  }
}

export function saveStory(story: Story, userId?: string, projectId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const all = getStories(userId, projectId);
    const idx = all.findIndex((s) => s.id === story.id);
    if (idx >= 0) {
      all[idx] = story;
    } else {
      all.push(story);
    }
    localStorage.setItem(storageKeys(userId, projectId).STORIES, JSON.stringify(all));
  } catch {
    // storage error
  }
}

export function getStoriesByPhase(phase: string, userId?: string, projectId?: string): Story[] {
  return getStories(userId, projectId).filter((s) => s.phase === phase);
}

// ---------- 回忆录 ----------

export function getBook(userId?: string, projectId?: string): BookData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKeys(userId, projectId).BOOK);
    return raw ? (JSON.parse(raw) as BookData) : null;
  } catch {
    return null;
  }
}

export function saveBook(book: BookData, userId?: string, projectId?: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKeys(userId, projectId).BOOK, JSON.stringify(book));
  } catch {
    // storage error
  }
}

// ---------- 工具 ----------

export function generateId(): string {
  return crypto.randomUUID();
}
