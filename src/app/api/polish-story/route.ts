import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { content, instruction } = await req.json();

  if (!content || typeof content !== "string") {
    return Response.json({ error: "缺少内容" }, { status: 400 });
  }

  const { text } = await generateText({
    model: openrouter("deepseek/deepseek-v3.2"),
    prompt: `你是一位资深的传记编辑。请对以下自传章节进行润色。

## 润色原则
1. 保留原作者的口吻和个人特色表达
2. 修正语法和逻辑问题
3. 让叙述更流畅、更有画面感
4. 不要添加作者没有说过的事实
5. 保留方言词和口头禅
${instruction ? `6. 用户特别要求：${instruction}` : ""}

## 原文
${content}

## 请输出润色后的完整文章（纯文本，不要 Markdown）`,
  });

  return Response.json({ content: text });
}
