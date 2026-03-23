import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages, phase } = await req.json();

  const conversationText = (messages as { role: string; content: string }[])
    .map((m) => `${m.role === "user" ? "老人" : "念念"}：${m.content}`)
    .join("\n");

  const { text } = await generateText({
    model: openrouter("deepseek/deepseek-v3.2"),
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

## 输出格式
请严格以 JSON 格式输出，不要有其他内容：
{
  "title": "故事标题",
  "content": "完整故事正文（800-2000字，第一人称）",
  "summary": "2-3句话摘要",
  "phase": "${phase}"
}`,
  });

  try {
    // 提取 JSON（处理可能的 markdown 代码块包裹）
    let jsonStr = text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const data = JSON.parse(jsonStr);
    return Response.json(data);
  } catch {
    // 解析失败时返回原文作为故事内容
    return Response.json({
      title: "未命名故事",
      content: text,
      summary: text.slice(0, 100),
      phase: phase,
    });
  }
}
