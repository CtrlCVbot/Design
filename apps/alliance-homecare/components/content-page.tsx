import Link from "next/link";

type Kind = "services" | "reviews" | "conditions" | "about";
const contact = "/contact";
const phone = "tel:15882470";
const services = [
  [
    "nursing",
    "방문 간호",
    "숙련된 전문 간호사가 정기적으로 방문해 투약 관리부터 상처 치료, 건강 상태 모니터링까지 의료 중심의 케어를 제공합니다. 담당 간호사가 케어 플랜을 직접 설계하고 필요할 때마다 조율합니다.",
    "투약·주사 및 상처 관리|정기 건강 모니터링과 기록 관리|주치의·병원과의 협진 연계",
  ],
  [
    "aide",
    "요양보호사 파견",
    "식사, 목욕, 이동, 가사까지 — 일상의 크고 작은 순간을 세심하게 돕습니다. 어르신의 생활 리듬과 습관을 존중하는 돌봄을 원칙으로 합니다.",
    "식사 준비와 영양 관리|목욕·위생·이동 보조|말벗과 정서적 교감",
  ],
  [
    "chronic",
    "만성질환 관리",
    "파킨슨, 치매, 뇌졸중 후 회복처럼 긴 호흡의 관리가 필요한 질환에는 질환별 전문 케어팀이 배정됩니다. 증상의 변화를 기록하고, 의료진과 같은 방향으로 움직입니다.",
    "질환별 전문 교육을 받은 케어팀|증상 변화 추적과 정기 보고|응급 상황 대응 프로토콜",
  ],
  [
    "membership",
    "웰니스 멤버십",
    "아직 돌봄이 필요하지 않아도, 건강한 일상은 미리 설계할 수 있습니다. 정기 건강 체크와 전담 매니저의 컨시어지 서비스를 멤버십으로 만나보세요.",
    "분기별 방문 건강 체크|전담 케어 매니저 배정|돌봄 필요 시 우선 매칭 혜택",
  ],
  [
    "senior",
    "시니어 케어",
    "어르신의 존엄과 자립을 지키는 것이 우리의 원칙입니다. 하루 몇 시간의 방문부터 24시간 상주까지, 필요한 만큼 유연하게 이용하실 수 있습니다.",
    "시간제·입주형 등 유연한 이용 방식|치매 전문 교육을 이수한 인력|정기 가족 리포트 제공",
  ],
  [
    "pediatric",
    "소아 홈케어",
    "의료적 돌봄이 필요한 아이가 병원이 아닌 집에서 자랄 수 있도록, 소아 전문 간호사가 함께합니다. 아이의 하루와 부모의 마음을 함께 돌봅니다.",
    "소아 전문 간호 인력|의료기기 관리와 사용 교육|부모 교육과 심리적 지지",
  ],
] as const;
function Hero({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <section className="hero page-hero">
      <div className="hero-copy" data-hero-reveal>
        <p className="eyebrow gold">{label}</p>
        <h1>
          {title.split("\n").map((x) => (
            <span key={x}>
              {x}
              <br />
            </span>
          ))}
        </h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
function Close({ title, description }: { title: string; description: string }) {
  return (
    <section className="section closing" data-reveal>
      <h2>
        {title.split("\n").map((x) => (
          <span key={x}>
            {x}
            <br />
          </span>
        ))}
      </h2>
      <p>{description}</p>
      <div className="actions">
        <Link className="button primary" href={contact}>
          상담 신청하기 →
        </Link>
        <a className="button outline" href={phone}>
          1588-2470
        </a>
      </div>
    </section>
  );
}
function Services() {
  return (
    <>
      <Hero
        label="홈케어 서비스"
        title="필요한 돌봄을, 필요한 만큼"
        description="하루 몇 시간의 도움부터 24시간 전문 간호까지. 여섯 가지 서비스를 상황에 맞게 조합해 하나의 케어 플랜으로 설계해 드립니다."
      />
      <section className="service-jump" data-reveal>
        {services.map(([id, title]) => (
          <a href={`#${id}`} key={id}>
            {title}
          </a>
        ))}
      </section>
      {services.map(([id, title, text, benefits], index) => (
        <section
          id={id}
          data-screen-label={title}
          data-reveal
          className={`section service-detail ${index % 2 ? "reverse" : ""}`}
          key={id}
        >
          <div className={`image-placeholder service-image shape-${index + 1}`}>
            <span>{title}</span>
          </div>
          <div>
            <p className="eyebrow">0{index + 1}</p>
            <h2>{title}</h2>
            <p>{text}</p>
            <ul className="check-list">
              {benefits.split("|").map((x) => (
                <li key={x}>✓ {x}</li>
              ))}
            </ul>
            <Link className="button primary" href={contact}>
              상담 신청하기
            </Link>
            {id === "chronic" && (
              <Link className="text-link" href="/conditions">
                질환별 케어 보기 →
              </Link>
            )}
          </div>
        </section>
      ))}
      <section className="section dark-process" data-reveal>
        <h2>시작은 이렇게 간단합니다</h2>
        <div className="process-grid" data-reveal-group>
          {[
            [
              "01",
              "무료 상담",
              "전화 또는 신청서로 상황을 알려주시면 전담 매니저가 24시간 안에 연락드립니다.",
            ],
            [
              "02",
              "맞춤 케어 플랜",
              "방문 평가를 통해 건강 상태와 생활 환경에 꼭 맞는 케어 플랜을 설계합니다.",
            ],
            [
              "03",
              "케어 시작과 상시 관리",
              "케어기버 매칭 후에도 정기 모니터링과 가족 리포트로 돌봄의 질을 관리합니다.",
            ],
          ].map(([n, t, p]) => (
            <div key={n}>
              <b>{n}</b>
              <h3>{t}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>
      <Close
        title="어떤 서비스가 맞을지\n고민되시나요?"
        description="상황을 말씀해 주시면 전담 케어 매니저가 가장 알맞은 조합을 제안해 드립니다."
      />
    </>
  );
}
const reviewItems = [
  [
    "파킨슨을 앓는 아버지를 3년째 부탁드리고 있습니다. 담당 간호사님의 세심함 덕분에 온 가족이 처음으로 마음 편히 잠들 수 있었습니다.",
    "김O현 님",
    "보호자 · 방문 간호 이용",
  ],
  [
    "95세 어머니의 존엄을 지켜 주는 돌봄이었습니다. 의료진과의 협진, 가족과의 소통까지 무엇 하나 빈틈이 없습니다.",
    "박O순 님 가족",
    "시니어 케어 이용",
  ],
  [
    "퇴원 직후 막막했던 시기에 병원에서 집까지, 회복의 전 과정을 함께해 주셨습니다. 주저 없이 추천합니다.",
    "이O든 님",
    "보호자 · 퇴원 후 회복 케어",
  ],
  [
    "요양보호사 선생님이 어머니의 식성까지 기억해 주십니다. 딸인 저보다 낫다는 농담을 할 정도예요.",
    "최O영 님",
    "보호자 · 요양보호사 파견 이용",
  ],
  [
    "인공호흡기를 쓰시는 아버지 때문에 늘 긴장 속에 살았는데, 전문 간호사님이 계시니 온 가족의 일상이 돌아왔습니다.",
    "정O훈 님",
    "보호자 · 만성질환 관리 이용",
  ],
  [
    "멤버십으로 시작했다가 어머니 수술 후 회복 케어까지 자연스럽게 이어졌어요. 미리 관계를 맺어둔 게 큰 힘이 되었습니다.",
    "한O미 님",
    "웰니스 멤버십 이용",
  ],
] as const;
function Reviews() {
  return (
    <>
      <Hero
        label="이용 후기"
        title="가족들이 전하는\n진심의 기록"
        description="광고보다 정확한 것은 돌봄을 직접 맡겨 본 가족의 말입니다. 있는 그대로의 이야기를 전합니다."
      />
      <section className="section feature-review" data-reveal>
        <strong>4.9</strong>
        <span>/ 5.0</span>
        <blockquote>
          돌봄을 맡긴다는 건 가족의 일부를 맡기는 일입니다.
          <br />그 무게를 아는 분들이었습니다.
        </blockquote>
        <b>서O진 님</b>
        <p>보호자 · 3년째 이용 중</p>
      </section>
      <section className="section sand" data-reveal>
        <h2>돌봄을 맡긴 가족들이 말합니다</h2>
        <div className="review-grid" data-reveal-group>
          {reviewItems.map(([q, n, t]) => (
            <figure key={n}>
              <i>“</i>
              <blockquote>{q}</blockquote>
              <figcaption>
                <b>{n}</b>
                <span>{t}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="disclaimer">
          개인정보 보호를 위해 성함 일부를 가렸습니다. 모든 후기는 실제 이용
          가족의 동의를 받아 게재합니다.
        </p>
      </section>
      <Close
        title="다음 이야기의 주인공이\n되어 주세요"
        description="우리 가족에게 맞는 돌봄이 궁금하시다면, 부담 없이 상담부터 시작하세요."
      />
    </>
  );
}
const conditionItems = [
  ["루게릭병 (ALS)", "호흡·연하 기능의 변화까지 단계별로 대응하는 전문 케어."],
  ["다발성 경화증", "증상의 기복에 맞춰 유연하게 조정되는 케어 플랜."],
  ["뇌졸중 후 회복", "재활 운동 보조와 재발 방지를 위한 상시 모니터링."],
  ["욕창·상처 관리", "전문 간호사의 체계적인 상처 치료와 예방 관리."],
  ["알츠하이머·치매", "치매 전문 교육을 이수한 케어팀의 인지 중심 돌봄."],
  ["파킨슨병", "운동 증상 변화를 기록하고 낙상을 예방하는 돌봄."],
  [
    "기관절개·인공호흡기",
    "의료기기 관리에 숙련된 전문 간호 인력이 배정됩니다.",
  ],
  ["외상성 뇌손상", "인지·신체 회복을 함께 돕는 긴 호흡의 케어."],
] as const;
function Conditions() {
  return (
    <>
      <Hero
        label="만성질환 케어"
        title="질환을 이해하는 돌봄은\n다릅니다"
        description="오래 이어지는 질환일수록 돌봄의 전문성이 삶의 질을 좌우합니다. 질환별 교육과 경험을 갖춘 전문 케어팀이 배정됩니다."
      />
      <section className="section" data-reveal>
        <h2>세 가지 원칙으로 움직입니다</h2>
        <div className="principle-grid" data-reveal-group>
          {[
            [
              "질환 전문 케어팀 배정",
              "질환별 교육과 실무 경험을 갖춘 간호사·요양보호사가 한 팀으로 배정되어, 담당이 바뀌어도 돌봄의 기준은 바뀌지 않습니다.",
            ],
            [
              "주치의·병원 협진",
              "진료 기록과 케어 기록을 연계해 의료진과 같은 방향으로 움직입니다. 증상 변화는 즉시 공유됩니다.",
            ],
            [
              "정기 가족 리포트",
              "상태 변화와 케어 내용을 정기적으로 정리해 보내드립니다. 멀리 있어도 곁에 있는 것처럼 안심할 수 있습니다.",
            ],
          ].map(([t, p]) => (
            <article key={t}>
              <h3>{t}</h3>
              <p>{p}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section sand" data-reveal>
        <h2>이런 질환을 돌보고 있습니다</h2>
        <div className="condition-grid" data-reveal-group>
          {conditionItems.map(([t, p]) => (
            <article key={t}>
              <h3>{t}</h3>
              <p>{p}</p>
              <Link className="text-link" href={contact}>
                상담하기 →
              </Link>
            </article>
          ))}
        </div>
        <p>
          목록에 없는 질환도 상담해 주세요. 케어 가능 여부를 정직하게
          말씀드립니다.
        </p>
      </section>
      <section className="condition-quote" data-reveal>
        “인공호흡기를 쓰시는 아버지 때문에 늘 긴장 속에 살았는데, 전문
        간호사님이 계시니 온 가족의 일상이 돌아왔습니다.”<b>정O훈 님</b>
        <span>보호자 · 만성질환 관리 이용</span>
      </section>
      <Close
        title="지금 겪고 계신 상황을\n들려주세요"
        description="질환명과 현재 상태만 알려주시면, 담당 케어 매니저가 가능한 케어 방안을 상세히 안내해 드립니다."
      />
    </>
  );
}
function About() {
  const history = [
    [
      "2006",
      "방문간호팀 설립",
      "간호사 1명, 세 가정과 함께 서울에서 첫걸음을 뗐습니다.",
    ],
    [
      "2011",
      "방문요양으로 확대",
      "요양보호사 파견을 시작하며 일상 돌봄까지 영역을 넓혔습니다.",
    ],
    [
      "2017",
      "만성질환 전문 케어팀",
      "파킨슨·치매 등 질환별 전문 케어팀 체계를 도입했습니다.",
    ],
    [
      "2023",
      "웰니스 멤버십 출시",
      "돌봄이 필요해지기 전부터 함께하는 예방 중심 서비스를 시작했습니다.",
    ],
  ];
  return (
    <>
      <Hero
        label="회사 소개"
        title="돌봄의 기준을 다시 씁니다"
        description="병원의 전문성과 가족의 따뜻함, 둘 중 하나를 포기하지 않아도 되는 돌봄. 그것이 우리가 2006년부터 지켜 온 약속입니다."
      />
      <section className="section split" data-reveal>
        <div className="image-placeholder story-image">
          <span>우리의 시작</span>
        </div>
        <div>
          <h2>
            한 명의 간호사,
            <br />세 가정에서 시작된 이야기
          </h2>
          <p>
            2006년, 병원을 나선 환자들이 집에서 제대로 된 돌봄을 받지 못하는
            현실을 본 한 간호사가 방문간호팀을 꾸렸습니다. 원칙은 단순했습니다.
            “병원에서 받던 수준의 케어를, 집에서.”
          </p>
          <p>
            20년이 지난 지금도 그 원칙은 변하지 않았습니다. 규모가 커질수록
            기준은 더 엄격해졌고, 돌봄의 마지막 책임은 언제나 사람에게 있다는
            믿음으로 케어팀 한 사람 한 사람을 직접 검증해 모십니다.
          </p>
          <blockquote>
            “좋은 돌봄은 기술이 아니라 태도에서 시작됩니다. 기술은 가르칠 수
            있지만, 태도는 선별해야 합니다.”<small>대표 · 설립자</small>
          </blockquote>
        </div>
      </section>
      <section className="section sand" data-reveal>
        <h2>20년의 기록</h2>
        <div className="history-grid" data-reveal-group>
          {history.map(([y, t, p]) => (
            <article key={y}>
              <b>{y}</b>
              <h3>{t}</h3>
              <p>{p}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="stats about-stats" data-reveal-group>
        {[
          ["20", "년", "한결같은 돌봄 경력"],
          ["1200", "+", "함께해 온 가정"],
          ["97", "%", "가족 추천 지수"],
          ["24", "시간", "상담·긴급 대응"],
        ].map(([value, suffix, label]) => (
          <div key={label}>
            <strong data-count={value} data-count-suffix={suffix}>{Number(value).toLocaleString("ko-KR")}{suffix}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>
      <section id="careers" className="career" data-reveal>
        <h2>
          돌봄의 전문성이
          <br />
          존중받는 일터
        </h2>
        <p>
          간호사·요양보호사님의 시간과 전문성이 제값을 받는 곳. 정당한 보상,
          지속적인 교육, 그리고 존중하는 문화를 약속합니다.
        </p>
        <ul className="check-list">
          <li>✓ 업계 최고 수준의 보상 체계</li>
          <li>✓ 질환별 전문 교육 프로그램 무상 제공</li>
          <li>✓ 전담 매니저의 현장 지원과 케어 백업</li>
        </ul>
        <Link className="button primary" href={contact}>
          채용 문의하기
        </Link>
      </section>
    </>
  );
}
export function ContentPage({ kind }: { kind: Kind }) {
  if (kind === "services") return <Services />;
  if (kind === "reviews") return <Reviews />;
  if (kind === "conditions") return <Conditions />;
  return <About />;
}
