// 사용법: npm run new -- --keyword "상록수역 전자담배" --stores ansan-sangnok --slug sangnoksu-parking --title "제목"
// stores는 쉼표로 여러 개 지정 가능: --stores ansan-bonjeom,ansan-jungang
import fs from "node:fs";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith("--")) acc.push([cur.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : "true"]);
    return acc;
  }, [])
);

const stores = JSON.parse(fs.readFileSync("data/stores.json", "utf8")).stores.map((s) => s.slug);
const { keyword, slug, title = "" } = args;
const storeList = (args.stores || "").split(",").map((s) => s.trim()).filter(Boolean);

if (!keyword || !slug || !storeList.length) {
  console.log("필수: --keyword, --slug, --stores");
  console.log("매장 slug:", stores.join(", "));
  process.exit(1);
}
const bad = storeList.filter((s) => !stores.includes(s));
if (bad.length) {
  console.log("없는 매장 slug:", bad.join(", "), "\n사용 가능:", stores.join(", "));
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.log("slug는 영문 소문자, 숫자, 하이픈만 사용하세요.");
  process.exit(1);
}

const file = path.join("content", "articles", `${slug}.md`);
if (fs.existsSync(file)) {
  console.log("이미 있는 파일:", file);
  process.exit(1);
}

const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
const body = `---
title: ${title || `${keyword} (제목 입력)`}
description: ${keyword} 관련 설명 80자 내외로 입력
keyword: ${keyword}
stores: [${storeList.join(", ")}]
date: ${today}
draft: true
faq:
  - q: 질문 입력
    a: 답변 입력
---

${keyword} 를 첫 문단 첫 문장 안에 자연스럽게 넣어 주세요. 이 문단에 글의 결론을 먼저 씁니다.

## 소제목 1

매장에서만 알 수 있는 정보(실제 동선, 사진 설명, 상담에서 자주 받는 질문)를 넣어 주세요.

## 소제목 2

## 정리
`;
fs.writeFileSync(file, body);
console.log("생성:", file, "(draft: true 상태. 작성 후 draft 줄을 지우면 발행됩니다)");
