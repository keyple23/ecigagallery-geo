import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));

export const site = readJson("site.config.json");
export const SITE_URL = (process.env.SITE_URL || site.siteUrl || "https://example.com").replace(/\/$/, "");
const storeData = readJson("data/stores.json");
export const stores = storeData.stores;
// 매장 정보 기준일 (stores.json의 updated, 없으면 빌드일)
export const DATA_DATE = storeData.updated || new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);

export const abs = (p = "/") => SITE_URL + (p.startsWith("/") ? p : "/" + p);
export const getStore = (slug) => stores.find((s) => s.slug === slug);

// 구별 묶음 (브레드크럼·목록용)
export const districts = [...new Set(stores.map((s) => s.address.district))].map((name) => ({
  name,
  stores: stores.filter((s) => s.address.district === name),
}));

// gray-matter는 날짜를 Date로 읽으므로 YYYY-MM-DD 문자열로 통일
const ymd = (d) => (!d ? "" : d instanceof Date ? d.toISOString().slice(0, 10) : String(d).slice(0, 10));

function loadDir(dirName) {
  const dir = path.join(root, "content", dirName);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      if (data.draft) return null;
      const storeSlugs = Array.isArray(data.stores) ? data.stores : data.stores ? [data.stores] : [];
      return {
        slug: data.slug || file.replace(/\.md$/, ""),
        title: data.title,
        navTitle: data.navTitle || data.title,
        description: data.description || "",
        keyword: data.keyword || site.mainKeyword,
        stores: storeSlugs,
        order: data.order ?? 99,
        date: ymd(data.date),
        updated: ymd(data.updated || data.date),
        faq: data.faq || [],
        html: marked.parse(content),
        text: content,
      };
    })
    .filter(Boolean);
}

let aCache, gCache;
export const getArticles = () => (aCache ??= loadDir("articles").sort((a, b) => (a.date < b.date ? 1 : -1)));
export const getArticle = (slug) => getArticles().find((a) => a.slug === slug);
export const articlesForStore = (slug) => getArticles().filter((a) => a.stores.includes(slug));

export const getGuides = () => (gCache ??= loadDir("guides").sort((a, b) => a.order - b.order));
export const getGuide = (slug) => getGuides().find((g) => g.slug === slug);

export const hoursLines = (store) => store.hours.map((h) => `${h.label} ${h.opens} ~ ${h.closes}`);
export const telHref = (phone) => "tel:" + phone.replace(/[^0-9]/g, "");
export const storePath = (s) => `/stores/${s.slug}/`;
