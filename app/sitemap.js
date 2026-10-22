import { stores, getArticles, getGuides, abs } from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap() {
  const articles = getArticles();
  const latest = articles[0]?.updated || new Date().toISOString().slice(0, 10);
  return [
    { url: abs("/"), lastModified: latest, changeFrequency: "weekly", priority: 1 },
    ...stores.map((s) => ({ url: abs(`/stores/${s.slug}/`), lastModified: latest, changeFrequency: "weekly", priority: 0.9 })),
    { url: abs("/articles/"), lastModified: latest, changeFrequency: "weekly", priority: 0.6 },
    { url: abs("/guide/"), lastModified: latest, changeFrequency: "monthly", priority: 0.6 },
    ...getGuides().map((g) => ({ url: abs(`/guide/${g.slug}/`), lastModified: g.updated, changeFrequency: "monthly", priority: 0.7 })),
    ...articles.map((a) => ({ url: abs(`/articles/${a.slug}/`), lastModified: a.updated, changeFrequency: "monthly", priority: 0.7 })),
  ];
}
