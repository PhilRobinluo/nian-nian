import * as tencentcloud from "tencentcloud-sdk-nodejs-asr";

const AsrClient = tencentcloud.asr.v20190614.Client;

const client = new AsrClient({
  credential: {
    secretId: process.env.TENCENT_SECRET_ID!,
    secretKey: process.env.TENCENT_SECRET_KEY!,
  },
  region: "",
  profile: {
    httpProfile: { endpoint: "asr.tencentcloudapi.com" },
  },
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const formData = await req.formData();
  const audioFile = formData.get("audio") as File;

  if (!audioFile) {
    return Response.json({ error: "No audio file" }, { status: 400 });
  }

  try {
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const resp = await client.SentenceRecognition({
      EngSerViceType: "16k_zh",
      SourceType: 1,
      VoiceFormat: "webm",
      Data: base64,
      DataLen: arrayBuffer.byteLength,
    });

    const text = resp.Result?.trim() || "";
    return Response.json({ text });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "转写失败";
    console.error("Tencent ASR error:", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
