import Link from "next/link";
import { site, stores, regions, regionPath, getArticles, getGuides, brands } from "@/lib/data";
import { homeSchema, faqSchema, storeSchema } from "@/lib/schema";
import { JsonLd, Faq, PostList, StoreTable, SourceNote } from "@/components/ui";

export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
  const regionNames = regions.map((r) => r.short).join("·");
  const onlineStores = stores.filter((s) => s.onlineOrder.available).map((s) => s.navLabel);
  const faq = [
    { q: "전자담배갤러리 매장은 어디에 있나요?", a: `현재 ${regions.map((r) => `${r.city} ${r.stores.length}곳(${r.stores.map((s) => s.shortName).join(", ")})`).join(", ")}에서 운영하고 있습니다.` },
    { q: "온라인 주문도 되나요?", a: onlineStores.length ? `${onlineStores.join(", ")}은 첫 이용 시 본인 인증 1회 후 온라인 주문이 가능합니다. 다른 매장은 각 매장에 문의해 주세요.` : "매장별로 다르니 각 매장에 문의해 주세요." },
    { q: "가까운 매장은 어떻게 찾나요?", a: "아래 지역별 매장 표에서 지역을 고르면 역 출구와 거리, 영업시간을 매장별로 비교할 수 있습니다." },
  ];

  return (
    <>
      <JsonLd data={[homeSchema(), ...stores.map(storeSchema), faqSchema(faq)]} />
      <h1>{site.brand} 매장 안내: 지역별 전자담배 매장 위치와 영업시간</h1>
      <p className="lead">
        {brands.join("와 ")}는 전자담배 기기와 액상을 판매하는 오프라인 전자담배 매장입니다. 현재 {regions.map((r) => r.short).join(", ")}에서 {stores.length}개 매장을 운영하며,
        매장마다 주소, 가까운 역 출구, 영업시간, 찾아오는 길을 정리했습니다.
      </p>
      <SourceNote />

      <section>
        <h2>지역별 전자담배갤러리 매장</h2>
        <div className="tablewrap">
          <table className="dir-table">
            <thead><tr><th>지역</th><th>매장</th><th>매장 수</th><th>바로가기</th></tr></thead>
            <tbody>
              {regions.map((r) => (
                <tr key={r.slug}>
                  <td>{r.province} {r.city}</td>
                  <td>{r.stores.map((s) => s.shortName).join(", ")}</td>
                  <td>{r.stores.length}곳</td>
                  <td><Link href={regionPath(r)}>{r.keyword} 매장 보기</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>전체 매장 목록</h2>
        <StoreTable />
      </section>

      <section>
        <h2>전자담배 매장, 이렇게 고르면 편합니다</h2>
        <p>
          처음 전자담배를 고른다면 기기 종류와 흡입 방식부터 정해 두는 것이 좋습니다. 입으로 머금었다가 들이마시는 입호흡과 바로 폐로 들이마시는 폐호흡은 맞는 기기와 액상이 다릅니다.
          자세한 차이는 <Link href="/guide/mtl-vs-dtl/">입호흡·폐호흡 차이</Link>와 <Link href="/guide/device-types/">전자담배 기기 종류</Link>에서 확인할 수 있습니다.
        </p>
        <p>
          액상은 과일, 멘솔, 디저트, 연초 계열로 나뉘고 같은 계열이라도 단맛과 시원함의 정도가 다릅니다. 매장에 가기 전에 <Link href="/guide/liquid-types/">액상 종류</Link>를 보고 좋아하는 방향을 정해 가면 상담이 빨라집니다.
          지금 쓰는 기기에서 탄맛이나 누수가 생긴다면 <Link href="/guide/device-care/">기기 관리법</Link>을 먼저 확인해 보세요.
        </p>
      </section>

      <section>
        <h2>전자담배 가이드</h2>
        <PostList items={getGuides()} base="/guide/" />
      </section>

      <section>
        <h2>매장 정보 글</h2>
        <PostList items={getArticles().slice(0, 6)} />
      </section>

      <Faq items={faq} />

      <section className="method">
        <h2>정보 기준 안내</h2>
        <p>이 사이트의 매장 정보는 각 매장의 네이버 플레이스 등록 정보와 매장에서 제공한 자료를 기준으로 정리했습니다. 정보가 바뀌면 기준일과 함께 갱신합니다.</p>
      </section>
    </>
  );
}
