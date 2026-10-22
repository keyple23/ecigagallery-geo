import "./globals.css";
import Link from "next/link";
import { site, stores, regions, regionPath, getGuides, SITE_URL, telHref, storePath, stationFull, brands } from "@/lib/data";

const verificationOther = {};
if (site.naverVerification) verificationOther["naver-site-verification"] = site.naverVerification;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: site.siteTitle, template: `%s | ${site.siteShort}` },
  description: site.description,
  applicationName: site.siteShort,
  alternates: { canonical: "/", types: { "application/rss+xml": "/rss.xml" } },
  verification: { google: site.googleVerification || undefined, other: verificationOther },
  openGraph: { type: "website", locale: "ko_KR", siteName: site.siteShort, title: site.siteTitle, description: site.description, url: "/" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: "#0F766E" };

// 상단은 지역만, 푸터는 매장까지 전부 노출 (매장이 늘어도 상단 메뉴가 길어지지 않게)
function NavLinks({ withStores = false }) {
  return (
    <>
      <li className="grp">지역</li>
      {regions.map((r) => (
        <li key={r.slug}><Link href={regionPath(r)}>{r.short}</Link></li>
      ))}
      {withStores && <li className="grp">매장</li>}
      {withStores && stores.map((s) => (
        <li key={s.slug}><Link href={storePath(s)}>{s.navLabel || s.shortName}</Link></li>
      ))}
      <li className="grp">가이드</li>
      {getGuides().map((g) => (
        <li key={g.slug}><Link href={`/guide/${g.slug}/`}>{g.navTitle}</Link></li>
      ))}
      <li className="grp">정보</li>
      <li><Link href="/articles/">매장 정보 글</Link></li>
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <a href="#main" className="skip">본문 바로가기</a>
        <header className="top">
          <div className="wrap">
            <Link href="/" className="logo">{site.brand} <span>매장</span></Link>
            <nav aria-label="주요 메뉴"><ul className="gnb"><NavLinks /></ul></nav>
          </div>
        </header>
        <main id="main" className="wrap">{children}</main>
        <footer className="foot">
          <div className="wrap">
            <p className="fbrand">{site.brand} 매장소개</p>
            <p className="fabout">
              {brands.join("와 ")}는 전자담배 기기와 액상을 판매하는 오프라인 전자담배 매장입니다. 현재 {regions.map((r) => `${r.provinceShort} ${r.city} ${r.stores.map((s) => s.shortName).join("·")}`).join(", ")}까지 {stores.length}개 매장을 운영하며,
              입문용 기기부터 과일·멘솔·디저트·연초 계열 액상까지 상담 후 비교해 구매할 수 있습니다. 영업시간과 찾아오는 길, 온라인 주문 여부는 매장별 페이지에서 확인할 수 있습니다.
            </p>
            <div className="fstores">
              {stores.map((s) => (
                <address key={s.slug}>
                  <strong><Link href={storePath(s)}>{s.name}</Link></strong>
                  <span>{s.address.full}</span>
                  <span>{stationFull(s.stations[0])}</span>
                  <span>{s.hours.map((h) => `${h.label} ${h.opens}~${h.closes}`).join(" / ")}</span>
                  <span>전화 <a href={telHref(s.phone)}>{s.phone}</a></span>
                  <span className="farea">{`관련 지역: ${s.relatedAreas.join(", ")} 전자담배`}</span>
                  <span className="fsns">
                    <a href={s.placeUrl} target="_blank" rel="noopener">네이버 지도</a>
                    <a href={s.blogUrl} target="_blank" rel="noopener">블로그</a>
                    {s.instagramUrl && <a href={s.instagramUrl} target="_blank" rel="noopener">인스타그램</a>}
                    {s.facebookUrl && <a href={s.facebookUrl} target="_blank" rel="noopener">페이스북</a>}
                    {s.talktalkUrl && <a href={s.talktalkUrl} target="_blank" rel="noopener">네이버 톡톡</a>}
                  </span>
                </address>
              ))}
            </div>
            <p className="notice">이 사이트는 {site.brand} 매장 위치와 이용 정보를 안내합니다. 청소년보호법에 따라 청소년에게는 전자담배 기기와 액상을 판매하지 않으며, 구매 시 신분증 확인을 요청할 수 있습니다.</p>
            <ul className="fnav"><NavLinks withStores /></ul>
            <p className="muted">© 2026 {site.brand}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
