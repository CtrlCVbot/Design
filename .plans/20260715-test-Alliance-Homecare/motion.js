// 새소망 방문요양 — 공용 스크롤 모션 헬퍼 (디자인 시스템 v1.1)
// Fail-safe 설계: 콘텐츠는 항상 보이는 상태가 기본값. JS/옵저버가 실패해도 숨겨지지 않는다.
// [data-reveal]        : 뷰포트 진입 시 1회 등장 애니메이션 (24px 상승)
// [data-reveal-group]  : 자식들을 70ms 스태거로 등장
// [data-count]         : 숫자 카운트업 (data-count 목표값, data-count-suffix 접미사)

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function reduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function playIn(el, delayMs) {
  if (!el.animate) return;
  el.animate(
    [
      { opacity: 0, transform: "translateY(24px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 500, delay: delayMs || 0, easing: EASE, fill: "backwards" }
  );
}

function runCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.countSuffix || "";
  if (!isFinite(target)) return;
  const t0 = performance.now();
  const dur = 900;
  const tick = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * e).toLocaleString("ko-KR") + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function initMotion() {
  if (reduced() || typeof IntersectionObserver === "undefined") return () => {};

  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const el = en.target;
        io.unobserve(el);
        if (el.hasAttribute("data-reveal-group")) {
          Array.from(el.children).forEach((kid, i) => playIn(kid, Math.min(i, 5) * 70));
        } else if (el.hasAttribute("data-count")) {
          runCount(el);
        } else {
          playIn(el, 0);
        }
      }
    },
    { threshold: 0.15 }
  );

  const inFirstView = (el) => el.getBoundingClientRect().top < window.innerHeight * 0.85;

  document.querySelectorAll("[data-reveal], [data-reveal-group]").forEach((el) => {
    if (inFirstView(el)) return; // 첫 화면에 이미 보이는 요소는 그대로 둔다
    io.observe(el);
  });

  document.querySelectorAll("[data-count]").forEach((el) => {
    io.observe(el);
  });

  return () => io.disconnect();
}
