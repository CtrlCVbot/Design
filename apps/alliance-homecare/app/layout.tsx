import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = { title: { default: "가온홈케어 | 프리미엄 홈케어", template: "%s | 가온홈케어" }, description: "집에서 만나는 프리미엄 홈케어", robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body>{children}</body></html>; }
