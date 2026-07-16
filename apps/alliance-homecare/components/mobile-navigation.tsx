"use client";

import Link from "next/link";
import { useState } from "react";

type NavigationLink = readonly [label: string, href: string];

export function MobileNavigation({ links, active }: { links: readonly NavigationLink[]; active?: string }) {
  const [open, setOpen] = useState(false);

  return <div className="mobile-navigation" data-open={open}>
    <button className="mobile-navigation-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((current) => !current)}>
      <span aria-hidden="true">{open ? "×" : "☰"}</span>
      <span className="sr-only">{open ? "메뉴 닫기" : "메뉴 열기"}</span>
    </button>
    <nav id="mobile-menu" className="mobile-navigation-panel" aria-label="모바일 메뉴">
      {links.map(([label, href]) => <Link key={href} className={active === href ? "active" : ""} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
      <Link className="mobile-contact-link" href="/contact" onClick={() => setOpen(false)}>상담 신청</Link>
      <a href="tel:15882470" onClick={() => setOpen(false)}>1588-2470</a>
    </nav>
  </div>;
}
