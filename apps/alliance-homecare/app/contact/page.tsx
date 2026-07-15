"use client";

import { ContactForm } from "../../components/contact-form";
import { SiteShell } from "../../components/site-shell";
export default function ContactPage() { return <SiteShell active="/contact"><section className="hero page-hero"><div className="hero-copy"><p className="eyebrow gold">상담 신청</p><h1>하루 안에,<br />전담 매니저가 연락드립니다</h1><p>상담은 무료이며, 어떤 의무도 발생하지 않습니다. 지금 상황을 편하게 알려주세요.</p></div></section><ContactForm /></SiteShell>; }
