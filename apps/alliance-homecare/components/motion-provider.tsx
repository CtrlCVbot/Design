"use client";

import { useEffect } from "react";

const motionEase = "cubic-bezier(0.22, 1, 0.36, 1)";
const countDuration = 900;

function playReveal(element: Element, delay = 0) {
  element.animate(
    [
      { opacity: 0, transform: "translateY(24px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 500, delay, easing: motionEase, fill: "backwards" },
  );
}

function playCount(element: HTMLElement, animationFrames: Set<number>) {
  const target = Number(element.dataset.count);
  if (!Number.isFinite(target)) return;

  const suffix = element.dataset.countSuffix ?? "";
  const startedAt = performance.now();

  function update(now: number) {
    const progress = Math.min(1, (now - startedAt) / countDuration);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * easedProgress).toLocaleString("ko-KR")}${suffix}`;
    if (progress < 1) {
      const frame = requestAnimationFrame(update);
      animationFrames.add(frame);
    }
  }

  const frame = requestAnimationFrame(update);
  animationFrames.add(frame);
}

export function MotionProvider() {
  useEffect(() => {
    const navigation = document.querySelector<HTMLElement>(".site-nav");
    const updateNavigation = () => { navigation?.toggleAttribute("data-scrolled", window.scrollY > 24); };
    updateNavigation();
    window.addEventListener("scroll", updateNavigation, { passive: true });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      return () => window.removeEventListener("scroll", updateNavigation);
    }

    const animationFrames = new Set<number>();
    document.querySelectorAll("[data-hero-reveal]").forEach((group) => {
      Array.from(group.children).forEach((child, index) => playReveal(child, Math.min(index, 5) * 70));
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const element = entry.target;
        if (element.hasAttribute("data-reveal-group")) {
          Array.from(element.children).forEach((child, index) => playReveal(child, Math.min(index, 5) * 70));
          return;
        }
        if (element instanceof HTMLElement && element.hasAttribute("data-count")) {
          playCount(element, animationFrames);
          return;
        }
        playReveal(element);
      });
    }, { threshold: 0.15 });

    document.querySelectorAll("[data-reveal], [data-reveal-group], [data-count]").forEach((element) => {
      const isFirstViewReveal = !element.hasAttribute("data-count") && element.getBoundingClientRect().top < window.innerHeight * 0.85;
      if (!isFirstViewReveal) observer.observe(element);
    });

    return () => {
      observer.disconnect();
      animationFrames.forEach(cancelAnimationFrame);
      window.removeEventListener("scroll", updateNavigation);
    };
  }, []);

  return <span hidden data-motion-runtime="true" />;
}
