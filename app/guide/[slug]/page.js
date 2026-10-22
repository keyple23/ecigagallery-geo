import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuides, getGuide, abs } from "@/lib/data";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd, Breadcrumb, Faq, StoreTable } from "@/components/ui";
import { site } from "@/lib/data";

export const dynamicParams = false;
export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    keywords: [g.keyword],
    alternates: { canonical: `/guide/${g.slug}/` },
    openGraph: { type: "article", title: g.title, description: g.description, url: `/guide/${g.slug}/` },
  };
}

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const crumbs = [{ name: "홈", path: "/" }, { name: "가이드", path: "/guide/" }, { name: g.navTitle, path: `/guide/${g.slug}/` }];
  const others = getGuides().filter((x) => x.slug !== g.slug);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    datePublished: g.date,
    dateModified: g.updated,
    inLanguage: "ko-KR",
    mainEntityOfPage: abs(`/guide/${g.slug}/`),
    keywords: g.keyword,
    author: { "@type": "Organization", name: site.brand },
    publisher: { "@type": "Organization", name: site.brand },
  };

  return (
    <>
      <JsonLd data={[schema, faqSchema(g.faq), breadcrumbSchema(crumbs)]} />
      <Breadcrumb items={crumbs} />
      <article>
        <h1>{g.title}</h1>
        <p className="meta"><time dateTime={g.updated}>업데이트 {g.updated}</time></p>
        <div className="prose" dangerouslySetInnerHTML={{ __html: g.html }} />
      </article>

      <Faq items={g.faq} />

      <section>
        <h2>매장에서 직접 비교해 보려면</h2>
        <p>설명만으로 고르기 어렵다면 매장에서 기기와 액상을 직접 보고 상담받는 편이 빠릅니다. 지역별 매장은 아래와 같습니다.</p>
        <StoreTable />
      </section>

      <section>
        <h2>다른 가이드</h2>
        <ul className="dir">{others.map((o) => <li key={o.slug}><Link href={`/guide/${o.slug}/`}>{o.title}</Link></li>)}</ul>
      </section>
    </>
  );
}
