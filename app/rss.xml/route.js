import { site, getArticles, stores, abs } from "@/lib/data";

export const dynamic = "force-static";

const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const items = [
    ...getArticles().map((a) => ({ title: a.title, link: abs(`/articles/${a.slug}/`), desc: a.description, date: a.date })),
    ...stores.map((s) => ({ title: `${s.name} 매장 안내`, link: abs(`/stores/${s.slug}/`), desc: s.intro[0], date: "" })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(site.siteShort)}</title>
<link>${abs("/")}</link>
<description>${esc(site.description)}</description>
<language>ko</language>
${items
  .map(
    (i) => `<item><title>${esc(i.title)}</title><link>${i.link}</link><guid>${i.link}</guid><description>${esc(i.desc)}</description>${
      i.date ? `<pubDate>${new Date(i.date + "T09:00:00+09:00").toUTCString()}</pubDate>` : ""
    }</item>`
  )
  .join("\n")}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
