import { notFound } from "next/navigation";
import { site, stores, getStore, articlesForStore } from "@/lib/data";
import { storeSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd, Breadcrumb, StoreInfoTable, StoreLinks, Faq, ArticleList } from "@/components/ui";

export const dynamicParams = false;
export function generateStaticParams() {
  return stores.map((s) => ({ slug: s.slug }));
}

const pageTitle = (s) => `${s.name}: ${site.mainKeyword} ${s.areaLabel} 매장`;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = getStore(slug);
  if (!s) return {};
  const description = `${s.name} 위치(${s.address.full}), ${s.stations[0].name} ${s.stations[0].exit} 가는 길, 영업시간, 전화번호, 결제·온라인 주문 안내.`;
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
  const crumbs = [{ name: "홈", path: "/" }, { name: s.name, path: `/stores/${s.slug}/` }];
  const articles = articlesForStore(s.slug);

  return (
    <>
      <JsonLd data={[storeSchema(s), faqSchema(s.faq), breadcrumbSchema(crumbs)]} />
      <Breadcrumb items={crumbs} />
      <h1>{pageTitle(s)}</h1>
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

      <Faq items={s.faq} title={`${s.shortName} 자주 묻는 질문`} />

      <section>
        <h2>{s.shortName} 관련 글</h2>
        <ArticleList articles={articles} />
      </section>
    </>
  );
}
