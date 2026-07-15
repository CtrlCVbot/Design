import type { Metadata } from "next";
import { ContentPage } from "../../components/content-page";
import { SiteShell } from "../../components/site-shell";
export const metadata: Metadata = { title: "회사 소개" };
export default function AboutPage() { return <SiteShell active="/about"><ContentPage kind="about" /></SiteShell>; }
