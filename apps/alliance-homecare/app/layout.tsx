import type { Metadata } from "next";
import "./styles.css";
import "./theme.css";
import "./ux.css";

export const metadata: Metadata = { title: { default: "새소망 방문요양 | 프리미엄 홈케어", template: "%s | 새소망 방문요양" }, description: "집에서 만나는 프리미엄 홈케어", robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko" data-theme="original"><body>{children}</body></html>; }
