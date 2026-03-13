"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Theme = "light" | "dark";
type Density = "compact" | "default" | "spacious";

const TYPE_STACK = [
  { cls: "type-heading-1",  label: "heading-1",  sample: "The quick brown fox" },
  { cls: "type-heading-2",  label: "heading-2",  sample: "The quick brown fox" },
  { cls: "type-heading-3",  label: "heading-3",  sample: "The quick brown fox" },
  { cls: "type-body-large", label: "body-large", sample: "The quick brown fox jumps over the lazy dog." },
  { cls: "type-body",       label: "body",       sample: "The quick brown fox jumps over the lazy dog." },
  { cls: "type-body-small", label: "body-small", sample: "The quick brown fox jumps over the lazy dog." },
  { cls: "type-ui-large",   label: "ui-large",   sample: "Button Label" },
  { cls: "type-ui",         label: "ui",         sample: "Button Label" },
  { cls: "type-ui-small",   label: "ui-small",   sample: "Button Label" },
];

export default function TokensPage() {
  const [theme, setTheme] = useState<Theme>("light");
  const [density, setDensity] = useState<Density>("default");

  // On mount: restore from localStorage, fall back to prefers-color-scheme.
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }

    const savedDensity = localStorage.getItem("density") as Density | null;
    if (savedDensity === "compact" || savedDensity === "default" || savedDensity === "spacious") {
      setDensity(savedDensity);
    }
  }, []);

  // Persist changes.
  useEffect(() => { localStorage.setItem("theme", theme); }, [theme]);
  useEffect(() => { localStorage.setItem("density", density); }, [density]);

  return (
    <div
      className={styles.page}
      data-theme={theme}
      data-density={density}
    >
      {/* Controls */}
      <div className={styles.controls}>
        <span className={`${styles.controlLabel} type-ui-small`}>Theme</span>
        <div className={styles.segmented} role="group" aria-label="Theme">
          {(["light", "dark"] as Theme[]).map((t) => (
            <button
              key={t}
              aria-pressed={theme === t}
              onClick={() => setTheme(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <span className={`${styles.controlLabel} type-ui-small`}>Density</span>
        <div className={styles.segmented} role="group" aria-label="Density">
          {(["compact", "default", "spacious"] as Density[]).map((d) => (
            <button
              key={d}
              aria-pressed={density === d}
              onClick={() => setDensity(d)}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className={styles.card}>
        <p className={`type-ui-small ${styles.cardTitle}`}>Typography</p>
        {TYPE_STACK.map(({ cls, label, sample }) => (
          <div key={cls} className={styles.typeRow}>
            <span className={`type-ui-small ${styles.typeLabel}`}>{label}</span>
            <span className={`${cls} ${styles.typeSample}`}>{sample}</span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className={styles.card}>
        <p className={`type-ui-small ${styles.cardTitle}`}>Button</p>
        <div className={styles.buttonRow}>
          <button className={`${styles.btnPrimary} type-ui`}>Primary Action</button>
          <button className={`${styles.btnSecondary} type-ui`}>Secondary Action</button>
        </div>
      </div>
    </div>
  );
}
