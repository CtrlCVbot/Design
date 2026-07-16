import Image from "next/image";
import Link from "next/link";
import { HumanServices } from "./human-services";
import { MotionProvider } from "./motion-provider";
import { ThemeSwitcher } from "./theme-switcher";

const principles = [
  ["01", "관계가 보이는 사진", "맞잡은 손과 눈높이를 맞춘 대화처럼 관계가 느껴지는 장면을 사용합니다."],
  ["02", "말하듯 쓰는 문장", "추상적인 서비스 용어 대신 보호자와 어르신이 실제로 듣고 싶은 말을 씁니다."],
  ["03", "필요한 순간에만 보이는 행동", "서비스 이해, 이용 절차, 상담의 순서로 안내하고 모바일에서는 전화와 상담만 고정합니다."],
] as const;

const processSteps = [
  ["01", "편하게 문의", "전화 또는 온라인으로 지금 가장 어려운 점만 알려주세요."],
  ["02", "전담 상담", "가족 상황, 등급, 희망 시간과 돌봄 방식을 차분히 확인합니다."],
  ["03", "요양보호사 연결", "생활 습관과 성향까지 고려해 잘 맞는 분을 연결합니다."],
  ["04", "함께 조정", "첫 방문 이후에도 전담 매니저가 정기적으로 살피고 조율합니다."],
] as const;

const changes = [
  ["그라디언트 이미지 placeholder", "관계가 느껴지는 실제 생활 사진과 과감한 크롭"],
  ["작은 카드가 반복되는 서비스 영역", "필요한 것만 펼치는 큰 서비스 행"],
  ["명조 중심의 전통적인 분위기", "큰 명조 제목과 현대적인 산세리프 UI의 대비"],
  ["서비스 설명과 수치 중심의 신뢰", "가족의 말과 실제 과정으로 증명"],
  ["모든 섹션에서 반복되는 CTA", "이해 → 확신 → 상담에 맞춘 단계별 행동"],
  ["데스크톱을 축소한 모바일", "전화·상담을 고정한 모바일 전용 흐름"],
] as const;

const consultationPhone = {
  label: "031-726-5288",
  href: "tel:0317265288",
} as const;

export function HumanModernHome() {
  return (
    <div className="human-modern-home">
      <MotionProvider />
      <header className="human-modern-nav" data-motion-nav>
        <Link className="human-modern-brand" href="/v2" aria-label="새소망 방문요양 V2 홈">
          <span>새</span>새소망 방문요양
        </Link>
        <nav className="human-modern-nav-links" aria-label="휴먼 모던 주요 메뉴">
          <a href="#principles">새소망 이야기</a>
          <a href="#services">방문요양 서비스</a>
          <a href="#process">이용 안내</a>
        </nav>
        <div className="human-modern-nav-actions">
          <ThemeSwitcher />
          <a className="human-modern-phone" href={consultationPhone.href}>{consultationPhone.label}</a>
          <a className="human-modern-nav-cta" href="#contact">상담 신청</a>
        </div>
      </header>

      <main>
        <section className="human-modern-hero" id="home">
          <Image className="human-modern-hero-image" src="/images/human-modern/care-hands.jpg" alt="서로의 손을 따뜻하게 맞잡은 돌봄 장면" fill priority sizes="100vw" />
          <div className="human-modern-hero-shade" />
          <div className="human-modern-hero-inner" data-hero-reveal>
            <p className="human-modern-kicker">Human care, thoughtfully modern</p>
            <h1>돌봄은 기술보다<br />먼저, <em>사람입니다.</em></h1>
            <p className="human-modern-hero-copy">익숙한 집에서 평소의 일상을 이어갈 수 있도록. 새소망은 어르신 한 분 한 분의 속도와 마음을 살피는 방문요양을 제공합니다.</p>
            <div className="human-modern-actions">
              <a className="human-modern-button human-modern-button-primary" href="#contact">우리 가족 상담하기 <span aria-hidden="true">↗</span></a>
              <a className="human-modern-button human-modern-button-secondary" href="#services">서비스 먼저 보기</a>
            </div>
            <aside className="human-modern-hero-aside">
              <strong>상담부터 첫 방문까지</strong><span>한 명의 전담 매니저</span>가 가족과 요양보호사 사이의 모든 과정을 함께 조율합니다.
            </aside>
          </div>
        </section>

        <section className="human-modern-trust" aria-label="새소망 핵심 신뢰 지표">
          <div><p>오래 머무는 돌봄은, 서로를 알아가는 데서 시작합니다.</p></div>
          <div><strong>20년</strong><span>지역과 함께한 경험</span></div>
          <div><strong>24시간</strong><span>상담 연결</span></div>
          <div><strong>1:1</strong><span>전담 매니저</span></div>
        </section>

        <section className="human-modern-section human-modern-principles" id="principles">
          <div className="human-modern-section-inner">
            <p className="human-modern-eyebrow" data-reveal>01 · A more human homepage</p>
            <h2 data-reveal>서비스를 설명하기 전에,<br />어떤 마음으로 돌보는지 보여줍니다.</h2>
            <p className="human-modern-lead" data-reveal>돌봄 홈페이지의 첫 인상은 시설이나 기술이 아니라 사람이어야 합니다. 실제 생활의 온도와 가족이 안심하는 순간을 디자인의 중심에 둡니다.</p>
            <div className="human-modern-principles-layout">
              <figure className="human-modern-portrait" data-reveal>
                <div className="human-modern-portrait-media">
                  <Image src="/images/human-modern/care-hands.jpg" alt="두 사람이 서로의 손을 따뜻하게 맞잡은 모습" fill sizes="(max-width: 900px) 100vw, 42vw" />
                </div>
              </figure>
              <div>
                {principles.map(([index, title, description]) => (
                  <article className="human-modern-principle" key={index} data-reveal>
                    <span>{index}</span><div><h3>{title}</h3><p>{description}</p></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="human-modern-section human-modern-services" id="services">
          <div className="human-modern-section-inner">
            <p className="human-modern-eyebrow" data-reveal>02 · Care that fits daily life</p>
            <h2 data-reveal>필요한 도움만,<br />생활의 리듬에 맞게.</h2>
            <p className="human-modern-lead" data-reveal>가족은 이름과 한 줄 설명을 먼저 읽고, 필요한 항목만 펼쳐볼 수 있습니다.</p>
            <HumanServices />
          </div>
        </section>

        <section className="human-modern-story" aria-label="이용 가족 이야기">
          <blockquote data-reveal>
            <p>“어머니를 돌봐주는 분을 만난 게 아니라,<br /><em>우리 가족을 이해해 주는 사람</em>을 만났어요.”</p>
            <cite>성남시 중원구 · 방문요양 이용 가족</cite>
          </blockquote>
        </section>

        <section className="human-modern-section human-modern-process" id="process">
          <div className="human-modern-section-inner">
            <p className="human-modern-eyebrow" data-reveal>03 · A calm first journey</p>
            <h2 data-reveal>복잡한 시작을<br />네 번의 대화로 단순하게.</h2>
            <div className="human-modern-process-steps" data-reveal-group>
              {processSteps.map(([index, title, description]) => (
                <article key={index}><span>{index}</span><h3>{title}</h3><p>{description}</p></article>
              ))}
            </div>
          </div>
        </section>

        <section className="human-modern-section human-modern-local">
          <div className="human-modern-section-inner human-modern-local-layout">
            <figure className="human-modern-sign" data-reveal>
              <Image src="/images/human-modern/brand-sign.jpg" alt="새소망 방문요양 목욕센터의 실제 노란색 간판" fill sizes="(max-width: 900px) 100vw, 48vw" />
            </figure>
            <div>
              <p className="human-modern-eyebrow" data-reveal>04 · Rooted in the neighborhood</p>
              <h2 data-reveal>브랜드는 화면보다 먼저,<br />동네에서 신뢰를 쌓았습니다.</h2>
              <p className="human-modern-lead" data-reveal>간판의 개나리색은 버리지 않고 더 차분한 골드 옐로로 정돈합니다. 지역성과 친근함은 유지하고, 디지털에서는 잉크 네이비로 전문성을 보완합니다.</p>
              <ul data-reveal>
                <li><strong>옐로</strong> 상담·선택·안내처럼 중요한 순간</li>
                <li><strong>잉크 네이비</strong> 의료·제도 정보의 신뢰와 대비</li>
                <li><strong>따뜻한 종이색</strong> 긴 글을 편안하게 읽는 배경</li>
                <li><strong>살구 코랄</strong> 사람의 온도를 연결하는 보조색</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="human-modern-section human-modern-changes" id="changes">
          <div className="human-modern-section-inner">
            <p className="human-modern-eyebrow" data-reveal>05 · What should change</p>
            <h2 data-reveal>현재 구조는 유지하고,<br />인상과 탐색 방식을 바꿉니다.</h2>
            <div className="human-modern-change-list">
              {changes.map(([before, after], index) => (
                <div className="human-modern-change" key={before} data-reveal>
                  <span>{String(index + 1).padStart(2, "0")}</span><p>{before}</p><b aria-hidden="true">→</b><strong>{after}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="human-modern-section human-modern-rules" id="rules">
          <div className="human-modern-section-inner">
            <p className="human-modern-eyebrow" data-reveal>06 · Interaction rules</p>
            <h2 data-reveal>조용하지만 살아 있는<br />인터랙션 규칙.</h2>
            <div className="human-modern-rule-grid" data-reveal-group>
              <article><span>MOTION 01</span><h3>첫 화면은 0.75초</h3><p>브랜드, 제목, 설명, 행동 순서로 등장해 우선순위를 자연스럽게 읽게 합니다.</p></article>
              <article><span>MOTION 02</span><h3>스크롤은 깊이만</h3><p>본문은 24px 이내에서 나타나며 과한 패럴랙스와 자동 재생을 사용하지 않습니다.</p></article>
              <article><span>ACCESSIBILITY</span><h3>움직임보다 내용</h3><p>모션 축소 환경에서는 전환을 제거하고 포커스 링과 44px 이상의 클릭 영역을 유지합니다.</p></article>
            </div>
          </div>
        </section>

        <section className="human-modern-final" id="contact">
          <div data-reveal>
            <h2>가족의 오늘을 듣는 것부터<br />돌봄을 시작합니다.</h2>
            <p>무엇을 신청해야 할지 몰라도 괜찮습니다. 지금 상황을 말씀해 주시면 가능한 방법부터 차근차근 안내해 드립니다.</p>
            <div className="human-modern-actions">
              <a className="human-modern-button human-modern-button-primary" href={consultationPhone.href}>{consultationPhone.label} 전화하기</a>
              <Link className="human-modern-button human-modern-button-secondary" href="/contact">상담 내용 남기기</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="human-modern-footer">
        <Link className="human-modern-brand" href="/v2"><span>새</span>새소망 방문요양</Link>
        <p>사람 중심의 사진과 카피, 차분한 탐색 흐름으로 이어가는 휴먼 모던 홈페이지입니다.</p>
        <small>© 2026 새소망 방문요양</small>
      </footer>

      <div className="human-modern-mobile-contact" aria-label="모바일 빠른 상담">
        <a href={consultationPhone.href}>전화하기</a><a href="#contact">상담 신청</a>
      </div>
    </div>
  );
}
