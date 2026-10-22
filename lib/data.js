import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));

export const site = readJson("site.config.json");
export const SITE_URL = (process.env.SITE_URL || site.siteUrl || "https://example.com").replace(/\/$/, "");
export const stores = readJson("data/stores.json").stores;

export const abs = (p = "/") => SITE_URL + (p.startsWith("/") ? p : "/" + p);
export const getStore = (slug) => stores.find((s) => s.slug === slug);

// gray-matter는 날짜를 Date로 읽으므로 YYYY-MM-DD 문자열로 통일
const ymd = (d) => (!d ? "" : d instanceof Date ? d.toISOString().slice(0, 10) : String(d).slice(0, 10));

const ARTICLE_DIR = path.join(root, "content", "articles");

function loadArticles() {
  if (!fs.existsSync(ARTICLE_DIR)) return [];
  return fs
    .readdirSync(ARTICLE_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(ARTICLE_DIR, file), "utf8");
      const { data, content } = matter(raw);
      if (data.draft) return null;
      const slug = data.slug || file.replace(/\.md$/, "");
      const storeSlugs = Array.isArray(data.stores) ? data.stores : data.stores ? [data.stores] : [];
      return {
        slug,
        title: data.title,
        description: data.description || "",
        keyword: data.keyword || site.mainKeyword,
        stores: storeSlugs,
        date: ymd(data.date),
        updated: ymd(data.updated || data.date),
        faq: data.faq || [],
        html: marked.parse(content),
        text: content,
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

let cache;
export const getArticles = () => (cache ??= loadArticles());
export const getArticle = (slug) => getArticles().find((a) => a.slug === slug);
export const articlesForStore = (slug) => getArticles().filter((a) => a.stores.includes(slug));

export const hoursLines = (store) => store.hours.map((h) => `${h.label} ${h.opens} ~ ${h.closes}`);
export const telHref = (phone) => "tel:" + phone.replace(/[^0-9]/g, "");
