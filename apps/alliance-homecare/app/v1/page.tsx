import type { Metadata } from "next";
import { HomeContent } from "../../components/home";
import { SiteShell } from "../../components/site-shell";
import { VersionSwitcher } from "../../components/version-switcher";

export const metadata: Metadata = {
  title: "V1 기존 홈페이지",
  description: "새소망 방문요양의 기존 홈페이지 디자인입니다.",
};

export default function V1Page() {
  return (
    <>
      <VersionSwitcher current="v1" />
      <SiteShell><HomeContent /></SiteShell>
    </>
  );
}
