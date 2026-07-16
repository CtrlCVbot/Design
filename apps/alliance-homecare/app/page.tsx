import { HomeContent } from "../components/home";
import { SiteShell } from "../components/site-shell";
import { VersionSwitcher } from "../components/version-switcher";

export default function Page() {
  return (
    <>
      <VersionSwitcher current="v1" />
      <SiteShell><HomeContent /></SiteShell>
    </>
  );
}
