import crypto from "node:crypto";

export const maxDuration = 30;

// 腾讯云 API 签名 v3
function sign(secretKey: string, date: string, service: string, stringToSign: string) {
  const kDate = crypto.createHmac("sha256", `TC3${secretKey}`).update(date).digest();
  const kService = crypto.createHmac("sha256", kDate).update(service).digest();
  const kSigning = crypto.createHmac("sha256", kService).update("tc3_request").digest();
  return crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex");
}

function buildAuth(secretId: string, secretKey: string, payload: string) {
  const service = "asr";
  const host = "asr.tencentcloudapi.com";
  const now = new Date();
  const timestamp = Math.floor(now.getTime() / 1000);
  const date = now.toISOString().slice(0, 10);

  const hashedPayload = crypto.createHash("sha256").update(payload).digest("hex");

  const canonicalRequest = [
    "POST",
    "/",
    "",
    `content-type:application/json; charset=utf-8\nhost:${host}\n`,
    "content-type;host",
    hashedPayload,
  ].join("\n");

  const credentialScope = `${date}/${service}/tc3_request`;
  const hashedCanonical = crypto.createHash("sha256").update(canonicalRequest).digest("hex");
  const stringToSign = `TC3-HMAC-SHA256\n${timestamp}\n${credentialScope}\n${hashedCanonical}`;

  const signature = sign(secretKey, date, service, stringToSign);

  return {
    authorization: `TC3-HMAC-SHA256 Credential=${secretId}/${credentialScope}, SignedHeaders=content-type;host, Signature=${signature}`,
    timestamp: String(timestamp),
  };
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const audioFile = formData.get("audio") as File;

  if (!audioFile) {
    return Response.json({ error: "No audio file" }, { status: 400 });
  }

  const secretId = process.env.TENCENT_SECRET_ID;
  const secretKey = process.env.TENCENT_SECRET_KEY;

  if (!secretId || !secretKey) {
    return Response.json({ error: "腾讯云密钥未配置" }, { status: 500 });
  }

  try {
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const payload = JSON.stringify({
      EngSerViceType: "16k_zh",
      SourceType: 1,
      VoiceFormat: "webm",
      Data: base64,
      DataLen: arrayBuffer.byteLength,
    });

    const { authorization, timestamp } = buildAuth(secretId, secretKey, payload);

    const resp = await fetch("https://asr.tencentcloudapi.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Host: "asr.tencentcloudapi.com",
        Authorization: authorization,
        "X-TC-Action": "SentenceRecognition",
        "X-TC-Version": "2019-06-14",
        "X-TC-Timestamp": timestamp,
      },
      body: payload,
    });

    const data = await resp.json();

    if (data.Response?.Error) {
      console.error("Tencent ASR error:", data.Response.Error);
      return Response.json({ error: data.Response.Error.Message }, { status: 500 });
    }

    const text = data.Response?.Result?.trim() || "";
    return Response.json({ text });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "转写失败";
    console.error("Transcribe error:", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
