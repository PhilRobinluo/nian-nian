import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Vercel 函数超时设置（秒）
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, phase } = await req.json();

  const conversationText = (messages as { role: string; content: string }[])
    .map((m) => `${m.role === "user" ? "老人" : "念念"}：${m.content}`)
    .join("\n");

  const { text } = await generateText({
    model: openrouter("deepseek/deepseek-v3.2"),
    prompt: `你是一位忠实的口述历史记录者。请将以下对话整理成一篇流畅的故事。

## 铁律（最重要）
1. **只能写老人实际说过的内容**，一个字都不能编造
2. 老人没提到的事，绝对不能加
3. 不要"补充"任何细节、场景、对话、情感
4. 不要添加"编者注"
5. 不要写老人没说的年份、地名、人名

## 整理规则
1. 以第一人称（老人视角）重新组织语言
2. 去掉 AI 的提问，只保留老人说的内容
3. 让叙述连贯流畅，但不添加新信息
4. 保留老人原话中的口头禅、方言词
5. 如果内容很少，就写短文，不要凑字数

## 对话所属人生阶段
${phase}

## 原始对话
${conversationText}

## 输出 JSON（不要其他内容）
{
  "title": "简短标题",
  "content": "整理后的故事正文（只包含老人说过的内容）",
  "summary": "一句话摘要",
  "phase": "${phase}"
}`,
  });

  try {
    let jsonStr = text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const data = JSON.parse(jsonStr);
    return Response.json(data);
  } catch {
    return Response.json({
      title: "未命名故事",
      content: text,
      summary: text.slice(0, 100),
      phase: phase,
    });
  }
}
