import { abs } from "@/lib/data";

export const dynamic = "force-static";

// 네이버(Yeti), 구글, AI 검색 봇을 명시적으로 허용
const bots = ["Yeti", "Googlebot", "Bingbot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended"];

export default function robots() {
  return {
    rules: [...bots.map((b) => ({ userAgent: b, allow: "/" })), { userAgent: "*", allow: "/" }],
    sitemap: abs("/sitemap.xml"),
  };
}
