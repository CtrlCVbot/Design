import type { Metadata } from "next";
import { ContentPage } from "../../components/content-page";
import { SiteShell } from "../../components/site-shell";
export const metadata: Metadata = { title: "만성질환 케어" };
export default function ConditionsPage() { return <SiteShell active="/conditions"><ContentPage kind="conditions" /></SiteShell>; }
