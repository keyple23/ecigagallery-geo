import Link from "next/link";
import { hoursLines, telHref } from "@/lib/data";

export function JsonLd({ data }) {
  const list = (Array.isArray(data) ? data : [data]).filter(Boolean);
  return list.map((d, i) => (
    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
  ));
}

export function Breadcrumb({ items }) {
  return (
    <nav className="crumb" aria-label="현재 위치">
      {items.map((it, i) => (
        <span key={it.path}>
          {i > 0 && <span className="sep">/</span>}
          {i === items.length - 1 ? <span>{it.name}</span> : <Link href={it.path}>{it.name}</Link>}
        </span>
      ))}
    </nav>
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
    </div>
  );
}

export function Faq({ items, title = "자주 묻는 질문" }) {
  if (!items?.length) return null;
  return (
    <section className="faq">
      <h2>{title}</h2>
      {items.map((f) => (
        <details key={f.q} open>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </section>
  );
}

export function ArticleList({ articles }) {
  if (!articles.length) return <p className="muted">아직 등록된 글이 없습니다.</p>;
  return (
    <ul className="alist">
      {articles.map((a) => (
        <li key={a.slug}>
          <Link href={`/articles/${a.slug}/`}>
            <strong>{a.title}</strong>
            <span>{a.description}</span>
            <time dateTime={a.date}>{a.date}</time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
