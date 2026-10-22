import Link from "next/link";
import { site, stores, districts, getArticles, getGuides, storePath } from "@/lib/data";
import { homeSchema, faqSchema, storeSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd, Faq, PostList, StoreTable, SourceNote, Breadcrumb } from "@/components/ui";

const commonFaq = [
  { q: "안산에 전자담배갤러리 매장은 몇 곳인가요?", a: "단원구에 본점(안산전자담배갤러리, 중앙역 2번 출구)과 중앙점(대동조이월드 1층), 상록구에 상록점(상록수역 3번 출구)까지 모두 3곳입니다." },
  { q: "세 매장 모두 지역화폐를 쓸 수 있나요?", a: "네, 세 매장 모두 지역화폐와 지원금(카드형) 결제가 가능합니다." },
  { q: "주차가 편한 매장은 어디인가요?", a: "상록점이 공영주차장 옆 건물 1층에 있어 차량 방문이 가장 편합니다." },
  { q: "온라인 주문도 되나요?", a: "상록점과 중앙점은 첫 이용 시 본인 인증 1회 후 온라인 주문이 가능하고, 평일 오후 4시 이전 주문은 당일 출고됩니다. 본점은 매장에 문의해 주세요." },
  { q: "늦게까지 여는 매장은 어디인가요?", a: "상록점과 중앙점은 금요일부터 일요일까지 22:30까지 영업합니다. 본점은 매일 22:00에 영업을 마칩니다." },
];

const crumbs = [{ name: "홈", path: "/" }, { name: "경기도", path: "" }, { name: "안산시", path: "/" }];

export default function Home() {
  return (
    <>
      <JsonLd data={[homeSchema(), ...stores.map(storeSchema), faqSchema(commonFaq), breadcrumbSchema([{ name: "홈", path: "/" }, { name: "안산시", path: "/" }])]} />
      <Breadcrumb items={crumbs} />
      <h1>안산 전자담배 매장 위치·영업시간 정리 (경기 안산시)</h1>
      <p className="lead">
        {site.mainKeyword} 매장을 찾는 분을 위해 안산시 단원구와 상록구에 있는 전자담배갤러리 매장 {stores.length}곳의 주소, 가까운 역 출구, 영업시간을 한 표로 정리했습니다.
        안산 전담 가게나 액상 전자담배 매장을 찾는 분도 아래 목록에서 가까운 곳을 고르면 됩니다.
      </p>
      <SourceNote />

      <section>
        <h2>안산 전자담배 매장 목록</h2>
        <StoreTable />
      </section>

      <section>
        <h2>안산 구별 전자담배 매장</h2>
        <div className="tablewrap">
          <table className="dir-table">
            <thead><tr><th>구</th><th>매장</th><th>매장 수</th></tr></thead>
            <tbody>
              {districts.map((d) => (
                <tr key={d.name} id={d.name}>
                  <td>안산시 {d.name}</td>
                  <td>{d.stores.map((s, i) => <span key={s.slug}>{i > 0 && ", "}<Link href={storePath(s)}>{s.name}</Link></span>)}</td>
                  <td>{d.stores.length}곳</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>안산 지역·역별 가까운 전자담배 매장</h2>
        <div className="tablewrap">
          <table className="dir-table">
            <thead>
              <tr><th>지역·역</th><th>가까운 매장</th><th>참고</th></tr>
            </thead>
            <tbody>
              <tr><td>중앙역 2번 출구, 고잔역 방향</td><td><Link href="/stores/ansan-bonjeom/">본점</Link></td><td>중앙역 2번 출구 315m</td></tr>
              <tr><td>고잔동, 안산 단원구</td><td><Link href="/stores/ansan-bonjeom/">본점</Link>, <Link href="/stores/ansan-jungang/">중앙점</Link></td><td>두 매장 모두 단원구</td></tr>
              <tr><td>중앙역 1번 출구, 중앙동</td><td><Link href="/stores/ansan-jungang/">중앙점</Link></td><td>롯데시네마 센트럴락 건물 1층</td></tr>
              <tr><td>상록수역, 본오동</td><td><Link href="/stores/ansan-sangnok/">상록점</Link></td><td>상록수역 3번 출구 151m</td></tr>
              <tr><td>상록구, 차량 방문</td><td><Link href="/stores/ansan-sangnok/">상록점</Link></td><td>공영주차장 옆 건물</td></tr>
            </tbody>
          </table>
        </div>
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
        <h2>안산 매장 정보 글</h2>
        <PostList items={getArticles().slice(0, 6)} />
      </section>

      <Faq items={commonFaq} />

      <section className="method">
        <h2>정보 기준 안내</h2>
        <p>이 페이지의 매장 정보는 각 매장의 네이버 플레이스 등록 정보와 매장에서 제공한 자료를 기준으로 정리했습니다. 정보가 바뀌면 기준일과 함께 갱신합니다.</p>
      </section>
    </>
  );
}
