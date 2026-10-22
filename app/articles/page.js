import { site, getArticles } from "@/lib/data";
import { ArticleList, Breadcrumb } from "@/components/ui";

export const metadata = {
  title: `${site.mainKeyword} 정보 전체 글`,
  description: `${site.mainKeyword} 매장 위치, 역 출구별 가는 길, 구매 전 확인할 내용을 정리한 글 목록입니다.`,
  alternates: { canonical: "/articles/" },
};

export default function Articles() {
  return (
    <>
      <Breadcrumb items={[{ name: "홈", path: "/" }, { name: "전체 글", path: "/articles/" }]} />
      <h1>{site.mainKeyword} 정보 전체 글</h1>
      <ArticleList articles={getArticles()} />
    </>
  );
}
