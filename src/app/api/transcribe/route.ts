import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const audioFile = formData.get("audio") as File;

  if (!audioFile) {
    return Response.json({ error: "No audio file" }, { status: 400 });
  }

  // Convert audio to base64 data URL
  const arrayBuffer = await audioFile.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const mimeType = audioFile.type || "audio/webm";
  const dataUrl = `data:${mimeType};base64,${base64}`;

  try {
    // Use Gemini Flash for audio transcription (works well in China)
    const { text } = await generateText({
      model: openrouter("google/gemini-2.0-flash-001"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "请将以下音频精确转写为中文文字。只输出转写的文字内容，不要添加任何其他说明。",
            },
            {
              type: "file",
              data: dataUrl,
              mediaType: mimeType,
            },
          ],
        },
      ],
    });

    return Response.json({ text: text.trim() });
  } catch (error: unknown) {
    console.error("Transcription error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: "转写失败", details: message },
      { status: 500 },
    );
  }
}
