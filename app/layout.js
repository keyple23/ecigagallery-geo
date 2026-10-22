import "./globals.css";
import Link from "next/link";
import { site, stores, SITE_URL, telHref } from "@/lib/data";

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
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <header className="top">
          <div className="wrap row">
            <Link href="/" className="logo">{site.mainKeyword} <span>가이드</span></Link>
            <nav className="gnb" aria-label="매장 카테고리">
              {stores.map((s) => (
                <Link key={s.slug} href={`/stores/${s.slug}/`}>{s.shortName}</Link>
              ))}
              <Link href="/articles/">전체 글</Link>
            </nav>
          </div>
        </header>
        <main className="wrap">{children}</main>
        <footer className="foot">
          <div className="wrap">
            <div className="fstores">
              {stores.map((s) => (
                <address key={s.slug}>
                  <strong>{s.name}</strong>
                  <span>{s.address.full}</span>
                  <a href={telHref(s.phone)}>{s.phone}</a>
                </address>
              ))}
            </div>
            <p className="notice">청소년보호법에 따라 청소년에게는 전자담배 기기와 액상을 판매하지 않습니다. 구매 시 신분증 확인을 요청할 수 있습니다.</p>
            <p className="muted">© {site.brand} 안산</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
