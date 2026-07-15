import type { Metadata } from "next";
import { ContentPage } from "../../components/content-page";
import { SiteShell } from "../../components/site-shell";
export const metadata: Metadata = { title: "홈케어 서비스" };
export default function ServicesPage() { return <SiteShell active="/services"><ContentPage kind="services" /></SiteShell>; }
