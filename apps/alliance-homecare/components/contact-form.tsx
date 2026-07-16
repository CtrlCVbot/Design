"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  type ConsultationStatus,
  createDemoConsultationState,
  getNextConsultationStatus,
  getNextOpenFaq,
} from "../lib/consultation";

const consultationSchema = z.object({
  name: z.string().trim().min(1, "성함을 입력해 주세요."),
  phone: z.string().trim().regex(/^[0-9+\-\s]{9,}$/, "연락 가능한 전화번호를 입력해 주세요."),
  region: z.string().trim().min(1, "돌봄이 필요한 지역을 입력해 주세요."),
  service: z.enum(["nursing", "aide", "chronic", "membership", "senior", "pediatric", "etc"], { error: "관심 서비스를 선택해 주세요." }),
  message: z.string().optional(),
  consent: z.boolean().refine((value) => value, "개인정보 수집·이용에 동의해 주세요."),
});

type ConsultationFormValues = z.infer<typeof consultationSchema>;

const faqs = [
  ["비용은 어떻게 되나요?", "서비스 종류와 이용 시간에 따라 달라집니다. 상담에서 상황을 확인한 뒤, 숨은 비용 없는 투명한 견적을 먼저 안내해 드립니다."],
  ["얼마나 빨리 시작할 수 있나요?", "보통 상담 후 2~3일 안에 케어를 시작합니다. 퇴원 직후 등 긴급한 상황에는 당일 매칭도 가능합니다."],
  ["케어기버가 맞지 않으면 교체할 수 있나요?", "네, 언제든 가능합니다. 전담 매니저에게 말씀해 주시면 성향과 상황을 반영해 빠르게 재매칭해 드립니다."],
  ["장기요양보험이 적용되나요?", "장기요양등급에 따라 방문요양·방문간호에 보험 급여가 적용될 수 있습니다. 등급 신청 절차부터 함께 도와드립니다."],
] as const;

const submitDelay = 1200;

export function ContactForm() {
  const [status, setStatus] = useState<ConsultationStatus>("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: { name: "", phone: "", region: "", service: undefined, message: "", consent: false },
  });

  async function submit() {
    setStatus(getNextConsultationStatus("idle"));
    await new Promise((resolve) => setTimeout(resolve, submitDelay));
    createDemoConsultationState();
    setStatus(getNextConsultationStatus("submitting"));
  }

  function startNewRequest() {
    reset();
    setStatus(getNextConsultationStatus("submitted"));
  }

  const submitting = status === "submitting";

  return <>
    <section className="section contact-layout" data-reveal>
      <div className="form-card">
        {status === "submitted" ? <div className="form-success" data-reveal>
          <b aria-hidden="true">✓</b>
          <h2>신청이 접수되었습니다</h2>
          <p>전담 케어 매니저가 24시간 안에 남겨주신 연락처로 전화드리겠습니다. 급하신 경우 1588-2470으로 바로 연락 주세요.</p>
          <p>Preview에서는 입력한 개인정보를 저장하거나 전송하지 않습니다.</p>
          <button className="button outline" type="button" onClick={startNewRequest}>새 신청서 작성</button>
        </div> : <form noValidate onSubmit={handleSubmit(submit)}>
          <p className="eyebrow">CONSULTATION</p>
          <h2>상담 신청서</h2>
          <p>아래 내용을 남겨주시면 24시간 안에 연락드립니다.</p>
          <div className="fields">
            <label>성함 *<input {...register("name")} autoComplete="name" placeholder="홍길동" />{errors.name && <span className="field-error">{errors.name.message}</span>}</label>
            <label>연락처 *<input {...register("phone")} autoComplete="tel" inputMode="tel" placeholder="010-0000-0000" />{errors.phone && <span className="field-error">{errors.phone.message}</span>}</label>
            <label>돌봄이 필요한 지역 *<input {...register("region")} autoComplete="address-level2" placeholder="예) 서울 서초구" />{errors.region && <span className="field-error">{errors.region.message}</span>}</label>
            <label>관심 서비스 *<select {...register("service")} defaultValue=""><option value="" disabled>선택해 주세요</option><option value="nursing">방문 간호</option><option value="aide">요양보호사 파견</option><option value="chronic">만성질환 관리</option><option value="membership">웰니스 멤버십</option><option value="senior">시니어 케어</option><option value="pediatric">소아 홈케어</option><option value="etc">잘 모르겠어요 (상담으로 결정)</option></select>{errors.service && <span className="field-error">{errors.service.message}</span>}</label>
          </div>
          <label>현재 상황<textarea {...register("message")} rows={5} placeholder="돌봄이 필요한 분의 연세, 건강 상태, 희망하는 케어 시간 등을 편하게 적어주세요." /></label>
          <label className="consent"><input {...register("consent")} type="checkbox" /><span>개인정보 수집·이용에 동의합니다. (상담 목적 외 사용하지 않습니다) <em>Preview에서는 저장·전송하지 않습니다.</em>{errors.consent && <small className="field-error">{errors.consent.message}</small>}</span></label>
          <div className="form-status" role="status" aria-live="polite">{submitting ? "상담 신청을 접수하고 있습니다." : ""}</div>
          <button className="button primary" type="submit" disabled={submitting}>{submitting ? <><span className="spinner" aria-hidden="true" />접수 중...</> : <>상담 신청하기 <span>→</span></>}</button>
        </form>}
      </div>
      <aside data-reveal-group>
        <div className="aside-dark"><p>전화 상담</p><a href="tel:15882470">1588-2470</a><span>24시간 · 365일 언제든 받습니다. 새벽 응급 상담도 가능합니다.</span></div>
        <div><p className="eyebrow">서비스 지역</p><h3>서울 전 지역<br />경기·인천 주요 지역</h3><p>외곽 지역도 케어팀 배정이 가능한 경우가 있으니 문의해 주세요.</p></div>
      </aside>
    </section>
    <section className="section sand faq" data-reveal>
      <p className="eyebrow">자주 묻는 질문</p>
      <h2>궁금하신 점을 먼저 답해드립니다</h2>
      {faqs.map(([question, answer], index) => {
        const opened = openFaq === index;
        const answerId = `faq-answer-${index}`;
        return <div className="faq-item" data-open={opened} key={question}>
          <button type="button" aria-expanded={opened} aria-controls={answerId} onClick={() => setOpenFaq(getNextOpenFaq(openFaq, index))}>{question}<span aria-hidden="true">+</span></button>
          <div className="faq-answer" id={answerId} data-open={opened} aria-hidden={!opened}><div><p>{answer}</p></div></div>
        </div>;
      })}
    </section>
  </>;
}
