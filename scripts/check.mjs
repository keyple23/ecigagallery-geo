// 발행 전 점검: npm run check
// 1) 도메인·인증코드 설정 여부  2) 글별 키워드 배치  3) 글 사이 유사도(네이버 유사문서 위험)
// 4) 금지 표현(em dash, 근거 없는 최상급 표현)  5) 키워드 커버리지
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const site = JSON.parse(fs.readFileSync("site.config.json", "utf8"));
const kw = JSON.parse(fs.readFileSync("data/keywords.json", "utf8"));
const stores = JSON.parse(fs.readFileSync("data/stores.json", "utf8")).stores;
const dir = "content/articles";
let warn = 0;
const W = (m) => { warn++; console.log("  [주의]", m); };

console.log("\n[설정]");
if (!site.siteUrl && !process.env.SITE_URL) W("site.config.json의 siteUrl이 비어 있습니다. 배포 도메인을 넣어야 sitemap·canonical이 맞게 나옵니다.");
if (!site.naverVerification) W("naverVerification이 비어 있습니다. 네이버 서치어드바이저 사이트 등록 후 HTML 태그 content 값을 넣으세요.");

const banned = [/—/, /ㅡ/, /No\.?\s?1/i, /최저가/, /전국 최대/];
const scan = (label, text) => banned.forEach((re) => re.test(text) && W(`${label}: 금지 표현 발견 (${re})`));
stores.forEach((s) => scan(`매장 ${s.shortName}`, s.intro.join(" ") + s.faq.map((f) => f.q + f.a).join(" ")));

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
const docs = files.map((f) => {
  const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
  return { f, data, content };
});

console.log("\n[글 점검]");
for (const { f, data, content } of docs) {
  console.log("-", f, data.draft ? "(draft)" : "");
  const k = data.keyword;
  const nospace = (s) => (s || "").replace(/\s/g, "");
  if (!k) { W("keyword 없음"); continue; }
  if (!nospace(data.title).includes(nospace(k))) W("제목에 키워드 없음");
  const firstPara = content.trim().split(/\n\s*\n/)[0];
  if (!nospace(firstPara).includes(nospace(k))) W("첫 문단에 키워드 없음");
  if (!data.description || data.description.length < 40) W("description이 짧음(40자 이상 권장)");
  const len = content.replace(/\s/g, "").length;
  if (len < 600) W(`본문 ${len}자(공백 제외): 600자 이상 권장`);
  const count = (content.match(new RegExp(k.replace(/\s/g, "\\s?"), "g")) || []).length;
  if (count > 8) W(`키워드 ${count}회 반복: 과다 반복은 어뷰징으로 보일 수 있음`);
  scan("본문", content + data.title);
  (data.stores || []).forEach((s) => !stores.find((x) => x.slug === s) && W(`없는 매장 slug: ${s}`));
}

console.log("\n[유사도 점검] (3-gram 기준, 0.35 이상 주의)");
const grams = (t) => { const s = t.replace(/\s+/g, ""); const g = new Set(); for (let i = 0; i < s.length - 2; i++) g.add(s.slice(i, i + 3)); return g; };
const G = docs.map((d) => grams(d.content));
let simHit = false;
for (let i = 0; i < docs.length; i++)
  for (let j = i + 1; j < docs.length; j++) {
    const a = G[i], b = G[j];
    let inter = 0; a.forEach((x) => b.has(x) && inter++);
    const sim = inter / (a.size + b.size - inter);
    if (sim >= 0.35) { simHit = true; W(`${docs[i].f} ↔ ${docs[j].f} 유사도 ${sim.toFixed(2)}`); }
  }
if (!simHit) console.log("  문제 없음");

console.log("\n[키워드 커버리지]");
for (const t of kw.targets) {
  const hit = docs.filter((d) => !d.data.draft && (d.data.keyword || "").replace(/\s/g, "") === t.keyword.replace(/\s/g, ""));
  console.log(`  ${t.keyword.padEnd(14)} 담당 페이지: ${t.page || "(미지정)"}  전용 글: ${hit.length}편`);
}

console.log(`\n완료: 주의 ${warn}건\n`);
