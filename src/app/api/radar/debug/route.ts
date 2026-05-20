import { NextResponse } from "next/server";
import crypto from "crypto";

function generateSign(params: Record<string, string>, secret: string): string {
  const sorted = Object.keys(params).sort();
  let str = secret;
  for (const key of sorted) str += key + params[key];
  str += secret;
  return crypto.createHash("md5").update(str, "utf8").digest("hex").toUpperCase();
}

export async function GET() {
  const appKey = process.env.ALIEXPRESS_APP_KEY!;
  const appSecret = process.env.ALIEXPRESS_APP_SECRET!;
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);

  const params: Record<string, string> = {
    app_key: appKey,
    method: "aliexpress.affiliate.product.smartmatch",
    sign_method: "md5",
    timestamp,
    keywords: "camiseta masculina",
    page_size: "2",
    page_no: "1",
    tracking_id: "orangefy",
  };
  params.sign = generateSign(params, appSecret);

  const res = await fetch("https://api-sg.aliexpress.com/sync", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
