export interface Story {
  id: string;
  phase: string; // 人生阶段：童年时光、求学岁月、工作生涯、家庭生活、退休生活
  title: string;
  content: string; // 完整故事正文
  summary: string; // 2-3 句摘要
  date: string; // 生成日期
  wordCount: number;
  conversationIds: string[]; // 关联的对话 ID
  status: "draft" | "completed" | "pending";
}

export interface Conversation {
  id: string;
  topic: string; // 对话主题
  messages: ConversationMessage[];
  createdAt: string;
  phase: string; // 关联的人生阶段
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface BookData {
  title: string;
  subtitle: string;
  authorName: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  phase: string;
  content: string;
  storyIds: string[];
}

export interface Project {
  id: string;
  name: string;        // 项目名称，如"爸爸的回忆录"
  subjectName: string; // 被记录人姓名，如"王建国"
  birthYear: string;
  hometown: string;
  relationship?: string; // 与项目关系：本人/父亲/母亲/爷爷/奶奶/其他
  createdAt: string;
  coverImage?: string; // 可选封面
}

export const LIFE_PHASES = [
  "童年时光",
  "求学岁月",
  "工作生涯",
  "家庭生活",
  "退休生活",
] as const;
