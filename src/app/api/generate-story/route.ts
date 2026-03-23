import { generateText, Output } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const storySchema = z.object({
  title: z.string().describe("故事标题，简短有温度"),
  content: z
    .string()
    .describe("完整的故事正文，800-2000字，以第一人称叙述"),
  summary: z.string().describe("2-3句话的故事摘要"),
  phase: z
    .string()
    .describe(
      "人生阶段：童年时光/求学岁月/工作生涯/家庭生活/退休生活",
    ),
});

export async function POST(req: Request) {
  const { messages, phase } = await req.json();

  // 将对话内容拼接成原始文本
  const conversationText = (messages as { role: string; content: string }[])
    .map((m) => `${m.role === "user" ? "老人" : "念念"}：${m.content}`)
    .join("\n");

  const result = await generateText({
    model: openrouter("deepseek/deepseek-v3.2"),
    output: Output.object({ schema: storySchema }),
    prompt: `你是一位资深的传记作家和口述历史整理者。请将以下对话整理成一个完整的故事章节。

## 要求
1. 以第一人称（老人的视角）重新叙述
2. 保留老人的口头禅、方言词、个人特色表达
3. 补充必要的时代背景（但要标注"编者注"）
4. 按时间顺序组织内容
5. 语言朴实温暖，像一个老人在跟你聊天
6. 不要添加老人没有提到的事实
7. 标题要简短有温度，比如"在河南老家的日子"

## 对话所属人生阶段
${phase}

## 原始对话内容
${conversationText}

请生成结构化的故事数据。`,
  });

  return Response.json(result.output);
}
