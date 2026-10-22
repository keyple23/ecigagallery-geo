import Link from "next/link";
import { notFound } from "next/navigation";
import { site, regions, getRegion, regionPath, districtsOf, getArticles, getGuides, getStore, storePath, abs } from "@/lib/data";
import { faqSchema, storeSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd, Faq, PostList, StoreTable, SourceNote, Breadcrumb } from "@/components/ui";

export const dynamicParams = false;
export function generateStaticParams() {
  return regions.map((r) => ({ region: r.slug }));
}

const h1 = (r) => `${r.keyword} 매장 위치·영업시간 정리 (${r.provinceShort} ${r.city})`;

export async function generateMetadata({ params }) {
  const { region } = await params;
  const r = getRegion(region);
  if (!r) return {};
  const names = r.stores.map((s) => s.shortName).join("·");
  const rb = [...new Set(r.stores.map((s) => s.brand || site.brand))].join("·");
  return {
    title: { absolute: `${r.keyword} 매장 안내 | ${rb} ${r.short} ${names}` },
    description: `${r.keyword} 매장 ${rb} ${r.short} ${r.stores.length}곳(${names})의 위치, 가까운 역 출구, 영업시간, 온라인 주문 정보를 정리했습니다.`,
    keywords: [r.keyword, `${r.keyword} 매장`, `${r.short} 전담`, `${r.short} 액상 전자담배`],
    alternates: { canonical: regionPath(r) },
    openGraph: { title: `${r.keyword} 매장 안내`, url: regionPath(r) },
  };
}

export default async function RegionPage({ params }) {
  const { region } = await params;
  const r = getRegion(region);
  if (!r) notFound();
  const crumbs = [{ name: "홈", path: "/" }, { name: r.province, path: "" }, { name: r.city, path: regionPath(r) }];
  const slugs = r.stores.map((s) => s.slug);
  const articles = getArticles().filter((a) => a.stores.some((s) => slugs.includes(s)));
  const districts = districtsOf(r);
  const others = regions.filter((x) => x.slug !== r.slug);
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${r.keyword} 매장 목록`,
    url: abs(regionPath(r)),
    itemListElement: r.stores.map((s, i) => ({ "@type": "ListItem", position: i + 1, url: abs(storePath(s)), name: s.name })),
  };

  return (
    <>
      <JsonLd data={[listSchema, ...r.stores.map(storeSchema), faqSchema(r.faq), breadcrumbSchema([{ name: "홈", path: "/" }, { name: r.city, path: regionPath(r) }])]} />
      <Breadcrumb items={crumbs} />
      <h1>{h1(r)}</h1>
      <p className="lead">{r.lead}</p>
      <SourceNote />

      <section>
        <h2>{r.keyword} 매장 목록</h2>
        <StoreTable list={r.stores} />
      </section>

      {districts.length > 1 && (
        <section>
          <h2>{r.short} 구별 전자담배 매장</h2>
          <div className="tablewrap">
            <table className="dir-table">
              <thead><tr><th>구</th><th>매장</th><th>매장 수</th></tr></thead>
              <tbody>
                {districts.map((d) => (
                  <tr key={d.name} id={d.name}>
                    <td>{r.city} {d.name}</td>
                    <td>{d.stores.map((s, i) => <span key={s.slug}>{i > 0 && ", "}<Link href={storePath(s)}>{s.name}</Link></span>)}</td>
                    <td>{d.stores.length}곳</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section>
        <h2>{r.short} 지역·역별 가까운 전자담배 매장</h2>
        <div className="tablewrap">
          <table className="dir-table">
            <thead><tr><th>지역·역</th><th>가까운 매장</th><th>참고</th></tr></thead>
            <tbody>
              {r.areaGuide.map((g) => (
                <tr key={g.area}>
                  <td>{g.area}</td>
                  <td>{g.stores.map(getStore).filter(Boolean).map((s, i) => <span key={s.slug}>{i > 0 && ", "}<Link href={storePath(s)}>{s.shortName}</Link></span>)}</td>
                  <td>{g.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>방문 전에 읽어보면 좋은 가이드</h2>
        <PostList items={getGuides()} base="/guide/" />
      </section>

      {articles.length > 0 && (
        <section>
          <h2>{r.short} 매장 정보 글</h2>
          <PostList items={articles} />
        </section>
      )}

      <Faq items={r.faq} />

      {others.length > 0 && (
        <section>
          <h2>다른 지역 매장</h2>
          <ul className="dir">
            {others.map((o) => <li key={o.slug}><Link href={regionPath(o)}>{o.keyword} 매장</Link> ({o.stores.map((s) => s.shortName).join(", ")})</li>)}
          </ul>
        </section>
      )}

      <section className="method">
        <h2>정보 기준 안내</h2>
        <p>이 페이지의 매장 정보는 각 매장의 네이버 플레이스 등록 정보와 매장에서 제공한 자료를 기준으로 정리했습니다. 정보가 바뀌면 기준일과 함께 갱신합니다.</p>
      </section>
    </>
  );
}
