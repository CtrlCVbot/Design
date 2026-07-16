import Link from "next/link";

const versions = [
  { id: "v1", label: "V1 기존", href: "/v1" },
  { id: "v2", label: "V2 휴먼 모던", href: "/v2" },
] as const;

type VersionId = (typeof versions)[number]["id"];

export function VersionSwitcher({ current }: { current: VersionId }) {
  return (
    <nav className="version-switcher" aria-label="홈페이지 디자인 버전">
      <span>디자인 비교</span>
      <div>
        {versions.map((version) => (
          <Link
            key={version.id}
            href={version.href}
            aria-current={current === version.id ? "page" : undefined}
          >
            {version.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
