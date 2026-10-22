import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));

// site.config.json = 도메인·인증값(GitHub에서 직접 관리), data/site-text.json = 사이트 문구
const siteText = fs.existsSync(path.join(root, "data/site-text.json")) ? readJson("data/site-text.json") : {};
export const site = { ...readJson("site.config.json"), ...siteText };
export const SITE_URL = (process.env.SITE_URL || site.siteUrl || "https://example.com").replace(/\/$/, "");
const storeData = readJson("data/stores.json");
export const stores = storeData.stores;

// 지역(시) 단위 묶음
export const regions = readJson("data/regions.json").regions
  .map((r) => ({ ...r, stores: stores.filter((s) => s.region === r.slug) }))
  .filter((r) => r.stores.length);
export const getRegion = (slug) => regions.find((r) => r.slug === slug);
export const regionPath = (r) => `/${r.slug}/`;
export const regionOf = (store) => getRegion(store.region);
export const districtsOf = (r) =>
  [...new Set(r.stores.map((s) => s.address.district))].map((name) => ({ name, stores: r.stores.filter((s) => s.address.district === name) }));
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

// 역(또는 랜드마크) 표기: 비어 있는 칸은 건너뜀
const j = (...xs) => xs.filter(Boolean).join(" ");
export const stationName = (st) => j(st.line, st.name, st.exit);
export const stationFull = (st) => j(st.line, st.name, st.exit, st.distance);
export const stationShort = (st) => j(st.name, st.exit);
export const areaText = (s) => j(s.address.city, s.address.district);
export const brands = [...new Set(stores.map((s) => s.brand || site.brand))];
export const brandText = brands.join("·");
export const paymentText = (s) => (s.payment?.length ? `${s.payment.join(", ")} 사용 가능` : "매장 문의");
