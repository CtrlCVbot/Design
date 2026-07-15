"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const services = [
  ["방문 간호", "숙련된 전문 간호사가 집에서 제공하는 의료 중심의 케어 매니지먼트.", "/services#nursing"],
  ["요양보호사 파견", "식사·목욕·이동 등 일상생활 전반을 돕는 따뜻하고 세심한 손길.", "/services#aide"],
  ["만성질환 관리", "장기적인 건강 변화에 맞춘 전문 케어 플랜과 의료 지원.", "/conditions"],
  ["웰니스 멤버십", "나에게 맞춘 건강한 일상 설계, 컨시어지 웰니스 멤버십.", "/services#membership"],
  ["시니어 케어", "어르신의 존엄과 자립을 지키는 어르신 맞춤 돌봄 서비스.", "/services#senior"],
  ["소아 홈케어", "아이가 집에서 안전하고 건강하게 자라도록 돕는 소아 전문 간호.", "/services#pediatric"],
] as const;

export function HomeContent() {
  const [counted, setCounted] = useState(false);
  useEffect(() => { const frame = requestAnimationFrame(() => setCounted(true)); return () => cancelAnimationFrame(frame); }, []);
  return <>
    <section id="hero" data-screen-label="히어로" className="hero home-hero"><div className="hero-copy"><p className="eyebrow gold">PREMIUM HOMECARE</p><h1>돌봄이 가장 필요한 순간,<br />집에서 만나는 프리미엄 홈케어</h1><p>2006년부터 이어온 신뢰. 전문 간호사와 숙련된 요양보호사가 24시간 365일, 어르신과 가족의 곁을 지킵니다.</p><div className="actions"><Link className="button primary" href="/contact">상담 신청하기</Link><a className="button ghost" href="tel:15882470">1588-2470</a></div></div><div className="hero-art arch" aria-label="홈케어 이미지 placeholder" /></section>
    <section data-screen-label="언론 보도" className="press"><div className="press-inner"><b>언론이 주목한 홈케어</b><div className="press-outlets"><span className="press-serif">헬스투데이</span><span>시니어저널</span><span className="press-serif">메디컬포스트</span><span>위클리케어</span><span className="press-rating"><i>★★★★★</i>보호자 평점 4.9</span></div></div></section>
    <section id="about" data-screen-label="소개" className="section split home-about"><div className="arch image-placeholder" aria-label="방문 간호 이미지 placeholder" /><div><p className="eyebrow">ABOUT GAON</p><h2>2006년, 작은 방문간호팀에서<br />시작했습니다</h2><p>오늘날 전문 간호사와 요양보호사로 이루어진 케어팀이 서울·경기·인천 전 지역에서 종합 재가 돌봄을 제공합니다. 높은 기준의 돌봄은 고객의 건강으로, 그리고 가족의 안심으로 이어집니다.</p><div className="about-stats"><div><strong>{counted ? "20년" : "0년"}</strong><span>홈케어 전문 경험</span></div><div><strong>{counted ? "1,200+" : "0"}</strong><span>전문 케어 인력</span></div><div><strong>{counted ? "97%" : "0%"}</strong><span>고객 추천 의향</span></div></div></div></section>
    <section id="reviews" data-screen-label="이용 후기" className="section sand"><div className="section-head"><div><p className="eyebrow">FAMILY STORIES</p><h2>돌봄을 맡긴 가족들이 말합니다</h2></div><Link className="text-link" href="/reviews">전체 후기 보기 <span>→</span></Link></div><blockquote>“처음부터 끝까지 가족처럼 함께해 주셨어요. 덕분에 어머니가 집에서 편안하게 회복하고 계십니다.”<cite>김○○님 · 방문 간호 이용</cite></blockquote></section>
    <section id="services" data-screen-label="서비스" className="section"><p className="eyebrow">OUR SERVICES</p><h2>필요한 돌봄을, 필요한 만큼</h2><div className="service-grid">{services.map(([title, description, href]) => <article key={title} className="service-item"><h3>{title}</h3><p>{description}</p><Link className="text-link" href={href}>자세히 보기 <span>→</span></Link></article>)}</div></section>
    <section id="conditions" data-screen-label="만성질환 케어" className="section dark-callout"><p className="eyebrow gold">CHRONIC CARE</p><h2>만성질환, 질환별 전문 케어팀이 함께합니다</h2><p>질환의 특성을 깊이 이해하는 케어팀이 배정되어, 오래 지속되는 돌봄도 흔들림 없이 이어집니다.</p><div className="condition-chips">{["루게릭병 (ALS)", "다발성 경화증", "뇌졸중 후 회복", "욕창·상처 관리", "알츠하이머·치매", "파킨슨병", "기관절개·인공호흡기", "외상성 뇌손상"].map((item) => <Link href="/conditions" key={item}>{item}</Link>)}</div></section>
    <section id="promise" data-screen-label="우리의 약속" className="section split promise"><div><p className="eyebrow">OUR PROMISE</p><h2>내 가족에게 맡길 수 있는<br />사람만 모십니다</h2><p>새로운 케어기버를 만날 때마다 스스로에게 묻습니다. “이분께 우리 부모님을 맡길 수 있을까?” 조금의 망설임도 없이 “네”라고 답할 수 있을 때, 비로소 우리 케어팀의 가족이 됩니다.</p><Link className="button outline" href="/about">회사 소개 더 보기</Link></div><div className="arch image-placeholder" aria-label="케어팀 이미지 placeholder" /></section>
    <section id="cta" data-screen-label="상담 CTA" className="section sand center"><p className="eyebrow">FREE CONSULTATION</p><h2>돌봄이 필요한 순간,<br />함께 하겠습니다</h2><p>전화 한 통이면 충분합니다. 전담 케어 매니저가 24시간 안에 연락드려 상황에 꼭 맞는 케어 플랜을 안내해 드립니다.</p><div className="actions"><Link className="button primary" href="/contact">상담 신청하기</Link><a className="button outline" href="tel:15882470">1588-2470</a></div></section>
    <section id="careers" data-screen-label="채용" className="career"><div><h2>훌륭한 간호사·요양보호사님을 찾습니다</h2><p>당신의 시간과 전문성이 존중받는 곳, 헌신이 보상으로 이어지는 일터에서 함께하세요.</p></div><Link className="button career-button" href="/about#careers">채용 안내 보기</Link></section>
  </>;
}
