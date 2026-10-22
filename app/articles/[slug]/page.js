import Link from "next/link";
import { notFound } from "next/navigation";
import { site, getArticles, getArticle, getStore } from "@/lib/data";
import { articleSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd, Breadcrumb, StoreInfoTable, StoreLinks, Faq } from "@/components/ui";

export const dynamicParams = false;
export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    keywords: [a.keyword],
    alternates: { canonical: `/articles/${a.slug}/` },
    openGraph: { type: "article", title: a.title, description: a.description, url: `/articles/${a.slug}/`, publishedTime: a.date, modifiedTime: a.updated },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const related = a.stores.map(getStore).filter(Boolean);
  const first = related[0];
  const crumbs = [
    { name: "홈", path: "/" },
    ...(related.length === 1 ? [{ name: first.name, path: `/stores/${first.slug}/` }] : [{ name: "전체 글", path: "/articles/" }]),
    { name: a.title, path: `/articles/${a.slug}/` },
  ];

  return (
    <>
      <JsonLd data={[articleSchema(a), faqSchema(a.faq), breadcrumbSchema(crumbs)]} />
      <Breadcrumb items={crumbs} />
      <article>
        <h1>{a.title}</h1>
        <p className="meta">
          {related.map((s) => <Link key={s.slug} className="tag" href={`/stores/${s.slug}/`}>{s.shortName}</Link>)}
          <time dateTime={a.date}>작성 {a.date}</time>
          {a.updated !== a.date && <time dateTime={a.updated}> · 수정 {a.updated}</time>}
        </p>
        <div className="prose" dangerouslySetInnerHTML={{ __html: a.html }} />
      </article>

      <Faq items={a.faq} />

      {related.map((s) => (
        <section key={s.slug} className="storebox">
          <h2>{s.name} 정보</h2>
          <StoreInfoTable store={s} />
          <StoreLinks store={s} />
        </section>
      ))}

      <p><Link href="/">{site.mainKeyword} 매장 3곳 비교 보기</Link></p>
    </>
  );
}
