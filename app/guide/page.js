import { getGuides } from "@/lib/data";
import { Breadcrumb, PostList } from "@/components/ui";

export const metadata = {
  title: "전자담배 가이드: 액상 종류, 입호흡·폐호흡, 기기 종류, 관리법",
  description: "전자담배를 처음 고르는 분을 위해 액상 종류, 입호흡과 폐호흡 차이, 기기 종류, 기기 관리법을 정리했습니다.",
  alternates: { canonical: "/guide/" },
};

export default function GuideIndex() {
  return (
    <>
      <Breadcrumb items={[{ name: "홈", path: "/" }, { name: "가이드", path: "/guide/" }]} />
      <h1>전자담배 가이드</h1>
      <p className="lead">기기와 액상을 고르기 전에 알아두면 좋은 기본 정보를 정리했습니다.</p>
      <PostList items={getGuides()} base="/guide/" />
    </>
  );
}
