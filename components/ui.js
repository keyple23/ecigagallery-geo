import Link from "next/link";
import { hoursLines, telHref, stores, storePath, DATA_DATE } from "@/lib/data";

export function JsonLd({ data }) {
  const list = (Array.isArray(data) ? data : [data]).filter(Boolean);
  return list.map((d, i) => (
    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
  ));
}

// 홈 › 경기도 안산시 › 단원구 › 매장명 형태
export function Breadcrumb({ items }) {
  return (
    <nav className="crumb" aria-label="현재 위치">
      <ol>
        {items.map((it, i) => (
          <li key={it.path + i}>
            {i === items.length - 1 || !it.path ? <span aria-current={i === items.length - 1 ? "page" : undefined}>{it.name}</span> : <Link href={it.path}>{it.name}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SourceNote({ extra }) {
  return (
    <div className="src">
      <p>기준일 {DATA_DATE} · 각 매장 네이버 플레이스 등록 정보와 매장 제공 자료 기준입니다.</p>
      <p className="warn">영업시간과 행사는 바뀔 수 있으니 방문 전 전화나 네이버 톡톡으로 확인해 주세요.{extra ? " " + extra : ""}</p>
    </div>
  );
}

// 디렉터리형 매장 목록 표
export function StoreTable({ list = stores, current }) {
  return (
    <div className="tablewrap">
      <table className="dir-table">
        <thead>
          <tr><th>매장명</th><th>주소</th><th>구</th><th>가까운 역</th><th>영업시간</th></tr>
        </thead>
        <tbody>
          {list.map((s) => (
            <tr key={s.slug} className={s.slug === current ? "on" : undefined}>
              <td>{s.slug === current ? <strong>{s.name}</strong> : <Link href={storePath(s)}>{s.name}</Link>}<div className="sub"><a href={telHref(s.phone)}>{s.phone}</a></div></td>
              <td>{s.address.full}</td>
              <td>{s.address.district}</td>
              <td>{s.stations[0].name} {s.stations[0].exit}<div className="sub">{s.stations[0].distance}</div></td>
              <td>{hoursLines(s).map((l) => <div key={l}>{l}</div>)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StoreInfoTable({ store }) {
  const st = store.stations[0];
  return (
    <table className="info">
      <tbody>
        <tr><th>상호</th><td>{store.name}</td></tr>
        <tr><th>주소</th><td>{store.address.full}{store.address.jibun && <><br /><span className="muted">지번 {store.address.jibun}</span></>}</td></tr>
        <tr><th>가까운 역</th><td>{st.line} {st.name} {st.exit}에서 {st.distance}</td></tr>
        <tr><th>영업시간</th><td>{hoursLines(store).map((l) => <div key={l}>{l}</div>)}</td></tr>
        <tr><th>전화</th><td><a href={telHref(store.phone)}>{store.phone}</a></td></tr>
        <tr><th>결제</th><td>{store.payment.join(", ")} 사용 가능</td></tr>
        <tr><th>편의시설</th><td>{store.facilities.join(", ")}</td></tr>
        <tr><th>온라인 주문</th><td>{store.onlineOrder.available ? "가능 (첫 이용 시 본인 인증 1회)" : "매장 문의"}</td></tr>
      </tbody>
    </table>
  );
}

export function StoreLinks({ store }) {
  return (
    <div className="btns">
      <a className="btn primary" href={store.placeUrl} target="_blank" rel="noopener">네이버 지도에서 보기</a>
      <a className="btn" href={telHref(store.phone)}>전화하기</a>
      <a className="btn" href={store.blogUrl} target="_blank" rel="noopener">매장 블로그</a>
      {store.instagramUrl && <a className="btn" href={store.instagramUrl} target="_blank" rel="noopener">인스타그램</a>}
      {store.talktalkUrl && <a className="btn" href={store.talktalkUrl} target="_blank" rel="noopener">네이버 톡톡 문의</a>}
    </div>
  );
}

// 참고 사이트처럼 질문을 소제목(H3)으로 노출
export function Faq({ items, title = "자주 묻는 질문" }) {
  if (!items?.length) return null;
  return (
    <section className="faq">
      <h2>{title}</h2>
      {items.map((f) => (
        <div key={f.q} className="qa">
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}
    </section>
  );
}

export function PostList({ items, base = "/articles/" }) {
  if (!items.length) return <p className="muted">아직 등록된 글이 없습니다.</p>;
  return (
    <ul className="alist">
      {items.map((a) => (
        <li key={a.slug}>
          <Link href={`${base}${a.slug}/`}>
            <strong>{a.title}</strong>
            <span>{a.description}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
export const ArticleList = ({ articles }) => <PostList items={articles} />;
