import type { Metadata } from "next";
import { HumanModernHome } from "../../components/human-modern-home";
import { VersionSwitcher } from "../../components/version-switcher";

export const metadata: Metadata = {
  title: "V2 휴먼 모던",
  description: "사람 중심의 사진과 현대적인 탐색 흐름으로 고도화한 새소망 방문요양 홈페이지입니다.",
};

export default function V2Page() {
  return (
    <>
      <VersionSwitcher current="v2" />
      <HumanModernHome />
    </>
  );
}
