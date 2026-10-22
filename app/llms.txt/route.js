import { site, stores, getArticles, getGuides, abs, hoursLines } from "@/lib/data";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${site.siteShort}`,
    "",
    `> ${site.description}`,
    "",
    "## 매장",
    ...stores.flatMap((s) => [
      `- [${s.name}](${abs(`/stores/${s.slug}/`)}): ${s.address.full}. ${s.stations[0].line} ${s.stations[0].name} ${s.stations[0].exit} ${s.stations[0].distance}. 영업시간 ${hoursLines(s).join(", ")}. 전화 ${s.phone}. 결제 ${s.payment.join(", ")}.`,
    ]),
    "",
    "## 가이드",
    ...getGuides().map((g) => `- [${g.title}](${abs(`/guide/${g.slug}/`)}): ${g.description}`),
    "",
    "## 글",
    ...getArticles().map((a) => `- [${a.title}](${abs(`/articles/${a.slug}/`)}): ${a.description}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
