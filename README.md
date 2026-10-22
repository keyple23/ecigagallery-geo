# 안산 전자담배 GEO 사이트 (전자담배갤러리 안산 3개 매장)

웰컴드링크 매거진과 같은 구조: Next.js 정적 사이트 + 마크다운 글, Vercel 배포.

## 폴더 구조

| 경로 | 역할 |
| --- | --- |
| site.config.json | 도메인(siteUrl), 네이버·구글 인증코드, 사이트 제목 |
| data/stores.json | 매장 3곳 정보(주소, 영업시간, 전화, 길안내, 소개글, FAQ). 매장 = 카테고리 |
| data/keywords.json | 타겟 키워드와 담당 페이지. 키워드 추가·수정은 여기서 |
| content/articles/*.md | 글. stores 항목에 매장 slug를 넣으면 해당 매장 카테고리에 노출 |
| scripts/new-article.mjs | 새 글 템플릿 생성 |
| scripts/check.mjs | 발행 전 점검(키워드 배치, 글 간 유사도, 금지 표현, 설정 누락) |

매장 slug: ansan-bonjeom(본점), ansan-sangnok(상록점), ansan-jungang(중앙점)

## 처음 한 번 할 일

1. site.config.json의 siteUrl에 배포 도메인 입력 (예: https://ansan-vape.com)
2. GitHub 저장소 생성 후 이 폴더 push, Vercel에서 Import (Build: next build, Output: out)
3. 네이버 서치어드바이저에 사이트 등록, HTML 태그 방식 content 값을 naverVerification에 넣고 재배포
4. 서치어드바이저 > 요청 > 사이트맵 제출: /sitemap.xml, RSS 제출: /rss.xml
5. 각 매장 네이버 플레이스 '홈페이지' 항목에 해당 매장 페이지 URL 등록 (/stores/ansan-sangnok/ 등)

## 글 쓰는 순서

```
npm install
npm run new -- --keyword "상록수 전자담배" --stores ansan-sangnok --slug sangnoksu-guide --title "제목"
# content/articles/sangnoksu-guide.md 작성 후 draft: true 줄 삭제
npm run check
npm run build
git add . && git commit -m "글 추가" && git push   # Vercel 자동 배포
```

배포 후 서치어드바이저 > 웹페이지 수집 요청에 새 글 URL 입력.

## 글 작성 원칙

- 키워드는 제목과 첫 문단에 넣고, 본문 반복은 8회 이하
- 매장 블로그 글을 그대로 복사하지 않음 (네이버 유사문서 처리 위험). check 스크립트가 글끼리 유사도를 점검
- 지역명만 바꾼 템플릿 글 금지. 글마다 실제 동선, 사진 설명, 상담에서 받은 질문 같은 매장 고유 정보 넣기
- 'No.1', '최저가', '전국 최대' 같은 근거 없는 최상급 표현은 쓰지 않음 (check에서 경고)
