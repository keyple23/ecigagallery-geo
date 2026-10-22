import { site, getArticles } from "@/lib/data";
import { ArticleList, Breadcrumb } from "@/components/ui";

export const metadata = {
  title: "전자담배갤러리 매장 정보 글",
  description: "전자담배갤러리 매장 위치, 역 출구별 가는 길, 구매 전 확인할 내용을 정리한 글 목록입니다.",
  alternates: { canonical: "/articles/" },
};

export default function Articles() {
  return (
    <>
      <Breadcrumb items={[{ name: "홈", path: "/" }, { name: "전체 글", path: "/articles/" }]} />
      <h1>전자담배갤러리 매장 정보 글</h1>
      <ArticleList articles={getArticles()} />
    </>
  );
}
