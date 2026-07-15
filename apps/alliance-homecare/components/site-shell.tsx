import Link from "next/link";

const links = [["홈케어 서비스", "/services"], ["이용 후기", "/reviews"], ["만성질환 케어", "/conditions"], ["회사 소개", "/about"]] as const;

export function SiteShell({ children, active }: { children: React.ReactNode; active?: string }) {
  return <div className="site-frame">
    <header className="site-nav" style={{ background: "#1C3A2E", borderBottom: "1px solid rgba(250,246,238,0.12)" }}>
      <Link className="brand" href="/" style={{ color: "#FAF6EE" }}>가온<span style={{ color: "#D9A05B" }}>홈케어</span></Link>
      <nav aria-label="주요 메뉴">{links.map(([label, href]) => <Link key={href} className={active === href ? "active" : ""} href={href} style={{ color: active === href ? "#E2A265" : "rgba(250,246,238,0.85)" }}>{label}</Link>)}</nav>
      <a href="tel:15882470" style={{ color: "#FAF6EE", fontSize: 16, fontWeight: 700, textDecoration: "none" }}>1588-2470</a>
      <Link className="nav-cta" href="/contact">상담 신청</Link>
    </header>
    <main>{children}</main>
    <footer className="site-footer">
      <div><Link className="brand" href="/">가온<span>홈케어</span></Link><p>2006년부터 집에서 받는 돌봄의 기준을 높여 왔습니다. 전문 간호사의 관리 아래 모든 단계의 의료 돌봄을 집에서 편안하게 — 고객과 가족 모두에게 완전한 안심을 드립니다.</p><p>인스타그램　페이스북　유튜브　블로그</p></div>
      <div className="footer-contact"><b>24시간 365일 상담</b><a href="tel:15882470">1588-2470</a><p>서울 전 지역 · 경기·인천 주요 지역</p><Link className="nav-cta" href="/contact">상담 신청</Link></div>
      <div><p>방문 간호　요양보호사 파견　만성질환 관리　시니어 케어　소아 홈케어　웰니스 멤버십</p><p>회사 소개　이용 후기　채용 안내　문의하기</p></div>
      <small>본 기관은 관련 법령에 따라 지정된 재가급여 제공 기관으로, 서울 전 지역과 경기·인천 주요 지역에서 방문 간호 및 방문 요양 서비스를 제공합니다.</small>
      <small>개인정보처리방침　이용약관</small>
    </footer>
  </div>;
}
