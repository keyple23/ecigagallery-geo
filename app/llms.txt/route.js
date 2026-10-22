import { site, stores, regions, getArticles, getGuides, abs, hoursLines, stationFull, paymentText } from "@/lib/data";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${site.siteShort}`,
    "",
    `> ${site.description}`,
    "",
    "## 지역",
    ...regions.map((r) => `- [${r.keyword} 매장](${abs(`/${r.slug}/`)}): ${r.province} ${r.city} ${r.stores.length}곳 (${r.stores.map((s) => s.name).join(", ")})`),
    "",
    "## 매장",
    ...stores.flatMap((s) => [
      `- [${s.name}](${abs(`/stores/${s.slug}/`)}): ${s.address.full}. ${stationFull(s.stations[0])}. 영업시간 ${hoursLines(s).join(", ")}. 전화 ${s.phone}.${s.payment?.length ? ` 결제 ${paymentText(s)}.` : ""} 관련 지역 ${(s.relatedAreas || []).join(", ")}. 채널 ${[["네이버 지도", s.placeUrl], ["블로그", s.blogUrl], ["인스타그램", s.instagramUrl], ["톡톡", s.talktalkUrl]].filter((c) => c[1]).map((c) => `${c[0]} ${c[1]}`).join(", ")}.`,
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
