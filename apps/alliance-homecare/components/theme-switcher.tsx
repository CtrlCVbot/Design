"use client";

import { type ChangeEvent, useEffect, useState } from "react";

const themeOptions = [
  { id: "original", label: "원본 테라코타" },
  { id: "yellow", label: "딥 옐로 코어" },
  { id: "gold-navy", label: "골든 네이비" },
  { id: "saesomang-heritage", label: "새소망 헤리티지" },
] as const;

type ThemeId = (typeof themeOptions)[number]["id"];

const storageKey = "alliance-homecare-theme";

function isThemeId(value: string | null): value is ThemeId {
  return themeOptions.some((theme) => theme.id === value);
}

function applyTheme(theme: ThemeId) {
  document.documentElement.dataset.theme = theme;
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>("original");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(storageKey);
    if (!isThemeId(savedTheme)) return;

    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  function changeTheme(event: ChangeEvent<HTMLSelectElement>) {
    const nextTheme = event.target.value;
    if (!isThemeId(nextTheme)) return;

    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
  }

  return <label className="theme-switcher"><span>테마 선택</span><select aria-label="테마 선택" value={theme} onChange={changeTheme}>{themeOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>;
}
