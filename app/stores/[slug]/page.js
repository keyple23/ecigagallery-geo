import Link from "next/link";
import { notFound } from "next/navigation";
import { site, stores, getStore, articlesForStore, getGuides, regionOf, regionPath, stationShort } from "@/lib/data";
import { storeSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd, Breadcrumb, StoreInfoTable, StoreLinks, Faq, ArticleList, StoreTable, SourceNote } from "@/components/ui";

export const dynamicParams = false;
export function generateStaticParams() {
  return stores.map((s) => ({ slug: s.slug }));
}

const pageTitle = (s) => `${s.name}: ${s.keyword} ${s.areaLabel} 매장`;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = getStore(slug);
  if (!s) return {};
  const description = `${s.name} 위치(${s.address.full}), ${stationShort(s.stations[0])} 가는 길, 영업시간, 전화번호, 온라인 주문 안내.`;
  return {
    title: { absolute: `${pageTitle(s)} | ${site.siteShort}` },
    description,
    keywords: [s.keyword, ...(s.subKeywords || [])],
    alternates: { canonical: `/stores/${s.slug}/` },
    openGraph: { title: pageTitle(s), description, url: `/stores/${s.slug}/` },
  };
}

export default async function StorePage({ params }) {
  const { slug } = await params;
  const s = getStore(slug);
  if (!s) notFound();
  const r = regionOf(s);
  const crumbs = [
    { name: "홈", path: "/" },
    { name: r.city, path: regionPath(r) },
    ...(s.address.district ? [{ name: s.address.district, path: `${regionPath(r)}#${s.address.district}` }] : []),
    { name: s.name, path: `/stores/${s.slug}/` },
  ];
  const articles = articlesForStore(s.slug);

  return (
    <>
      <JsonLd data={[storeSchema(s), faqSchema(s.faq), breadcrumbSchema(crumbs.filter((c) => !c.path.includes("#")))]} />
      <Breadcrumb items={crumbs} />
      <h1>{pageTitle(s)}</h1>
      <SourceNote />
      <div className="prose">
        {s.intro.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <StoreLinks store={s} />

      <section>
        <h2>{s.shortName} 매장 정보</h2>
        <StoreInfoTable store={s} />
      </section>

      {s.nearbyText && (
        <section>
          <h2>{s.nearby.slice(0, 2).join(", ")} 근처 전자담배 매장</h2>
          <p>{s.nearbyText}</p>
        </section>
      )}

      <section>
        <h2>{s.name} 찾아오는 길</h2>
        <ul className="dir">{s.directions.map((d) => <li key={d}>{d}</li>)}</ul>
      </section>

      <section>
        <h2>온라인 주문 안내</h2>
        <ul className="dir">{s.onlineOrder.notes.map((n) => <li key={n}>{n}</li>)}</ul>
      </section>

      <section>
        <h2>방문 전 읽어보면 좋은 가이드</h2>
        <ul className="dir">
          {getGuides().map((g) => <li key={g.slug}><Link href={`/guide/${g.slug}/`}>{g.title}</Link></li>)}
        </ul>
      </section>

      <Faq items={s.faq} title={`${s.shortName} 자주 묻는 질문`} />

      {articles.length > 0 && (
        <section>
          <h2>{s.shortName} 관련 글</h2>
          <ArticleList articles={articles} />
        </section>
      )}

      <section>
        <h2>{r.short} 지역 매장</h2>
        <StoreTable list={r.stores} current={s.slug} />
        <p><Link href={regionPath(r)}>{r.keyword} 매장 전체 보기</Link> · <Link href="/">전체 지역 매장 보기</Link></p>
      </section>
    </>
  );
}
