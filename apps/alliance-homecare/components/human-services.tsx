"use client";

import { useState } from "react";

const services = [
  {
    id: "home-care",
    index: "01",
    name: "방문요양",
    summary: "식사·이동·위생·말벗까지 일상 가까이",
    description:
      "요양보호사가 정해진 시간에 가정을 방문해 일상생활과 정서적 안정을 돕습니다. 어르신이 스스로 할 수 있는 일은 오래 유지하도록 기다리고 격려합니다.",
  },
  {
    id: "bath-care",
    index: "02",
    name: "방문목욕",
    summary: "안전하고 편안한 목욕 지원",
    description:
      "전문 인력이 위생 상태와 신체 컨디션을 먼저 살핀 뒤 안전하게 목욕을 돕습니다. 이동이 어려운 어르신도 익숙한 공간에서 편안하게 이용할 수 있습니다.",
  },
  {
    id: "family-care",
    index: "03",
    name: "가족요양 상담",
    summary: "가족이 돌보는 경우의 제도 안내",
    description:
      "가족요양 가능 여부, 인정 시간, 신청 절차처럼 어려운 제도를 이해하기 쉽게 설명합니다. 현재 상황을 기준으로 실제 선택지를 함께 정리합니다.",
  },
  {
    id: "long-term-care",
    index: "04",
    name: "장기요양 등급 안내",
    summary: "처음 신청하는 가족을 위한 동행",
    description:
      "등급 신청에 필요한 과정과 준비 사항을 순서대로 안내합니다. 이미 등급을 받은 경우에는 이용 가능한 서비스와 본인부담 범위를 확인해 드립니다.",
  },
] as const;

type ServiceId = (typeof services)[number]["id"];

export function HumanServices() {
  const [openServiceId, setOpenServiceId] = useState<ServiceId>(services[0].id);

  return (
    <div className="human-modern-service-list" data-reveal>
      {services.map((service) => {
        const isOpen = openServiceId === service.id;
        const panelId = `human-service-${service.id}`;
        const triggerId = `${panelId}-trigger`;

        return (
          <article className="human-modern-service" key={service.id}>
            <h3>
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenServiceId(service.id)}
              >
                <span className="human-modern-service-index">{service.index}</span>
                <span className="human-modern-service-name">{service.name}</span>
                <span className="human-modern-service-summary">{service.summary}</span>
                <span className="human-modern-service-plus" aria-hidden="true">＋</span>
              </button>
            </h3>
            <div id={panelId} className="human-modern-service-panel" role="region" aria-labelledby={triggerId} hidden={!isOpen}>
              <p>{service.description}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
