import Link from "next/link";
import { site, stores, getArticles, hoursLines, telHref } from "@/lib/data";
import { homeSchema, faqSchema, storeSchema } from "@/lib/schema";
import { JsonLd, Faq, ArticleList } from "@/components/ui";

const commonFaq = [
  { q: "안산에 전자담배갤러리 매장은 몇 곳인가요?", a: "본점(안산전자담배갤러리, 중앙역 2번 출구), 상록점(상록수역 3번 출구), 중앙점(대동조이월드 1층) 3곳이 있습니다." },
  { q: "세 매장 모두 지역화폐를 쓸 수 있나요?", a: "네, 세 매장 모두 지역화폐와 지원금(카드형) 결제가 가능합니다." },
  { q: "주차가 편한 매장은 어디인가요?", a: "상록점이 공영주차장 옆 건물 1층에 있어 차량 방문이 가장 편합니다." },
  { q: "온라인 주문도 되나요?", a: "상록점과 중앙점은 첫 이용 시 본인 인증 1회 후 온라인 주문이 가능하고, 평일 오후 4시 이전 주문은 당일 출고됩니다. 본점은 매장에 문의해 주세요." },
];

export default function Home() {
  const articles = getArticles().slice(0, 6);
  return (
    <>
      <JsonLd data={[homeSchema(), ...stores.map(storeSchema), faqSchema(commonFaq)]} />
      <section className="hero">
        <h1>{site.mainKeyword} 매장 안내: 전자담배갤러리 안산 3개 매장</h1>
        <p className="lead">
          {site.mainKeyword} 매장을 찾고 있다면 전자담배갤러리 안산 매장 3곳을 확인해 보세요. 중앙역 2번 출구의 본점,
          상록수역 3번 출구의 상록점, 롯데시네마가 있는 대동조이월드 1층의 중앙점까지 위치와 영업시간, 주차, 온라인 주문 여부를 매장별로 정리했습니다.
        </p>
      </section>

      <section>
        <h2>안산 전자담배 매장 3곳 한눈에 비교</h2>
        <div className="tablewrap">
          <table className="cmp">
            <thead>
              <tr><th>매장</th><th>위치</th><th>가까운 역</th><th>영업시간</th><th>전화</th></tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s.slug}>
                  <td><Link href={`/stores/${s.slug}/`}>{s.name}</Link></td>
                  <td>{s.address.full}</td>
                  <td>{s.stations[0].name} {s.stations[0].exit} {s.stations[0].distance}</td>
                  <td>{hoursLines(s).map((l) => <div key={l}>{l}</div>)}</td>
                  <td><a href={telHref(s.phone)}>{s.phone}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>상황별로 가기 편한 매장</h2>
        <ul className="pick">
          <li><strong>중앙역 2번 출구, 고잔역 방향</strong>에서 오신다면 <Link href="/stores/ansan-bonjeom/">본점(안산전자담배갤러리)</Link></li>
          <li><strong>상록구, 상록수역 이용</strong>하시거나 <strong>차량으로 방문</strong>한다면 <Link href="/stores/ansan-sangnok/">상록점</Link></li>
          <li><strong>롯데시네마 센트럴락, 대동조이월드</strong>에 들르신다면 <Link href="/stores/ansan-jungang/">중앙점</Link></li>
        </ul>
      </section>

      <section>
        <h2>매장별 안내</h2>
        <div className="cards">
          {stores.map((s) => (
            <article key={s.slug} className="card">
              <h3><Link href={`/stores/${s.slug}/`}>{s.name}</Link></h3>
              <p className="muted">{s.stations[0].name} {s.stations[0].exit} {s.stations[0].distance}</p>
              <p>{s.intro[0]}</p>
              <Link className="more" href={`/stores/${s.slug}/`}>{s.shortName} 자세히 보기</Link>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>안산 전자담배 최신 글</h2>
        <ArticleList articles={articles} />
      </section>

      <Faq items={commonFaq} />
    </>
  );
}
