import type { Metadata } from "next";
import { ContentPage } from "../../components/content-page";
import { SiteShell } from "../../components/site-shell";
export const metadata: Metadata = { title: "이용 후기" };
export default function ReviewsPage() { return <SiteShell active="/reviews"><ContentPage kind="reviews" /></SiteShell>; }
