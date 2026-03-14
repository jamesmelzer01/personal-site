"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Tab, Tabs } from "@/components/Tabs";
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

  useEffect(() => { localStorage.setItem("theme", theme); }, [theme]);
  useEffect(() => { localStorage.setItem("density", density); }, [density]);

  return (
    <div className={styles.page} data-theme={theme} data-density={density}>

      {/* Sticky controls bar */}
      <div className={styles.controlsBar}>
        <span className={`${styles.controlLabel} type-ui-small`}>Theme</span>
        <div className={styles.segmented} role="group" aria-label="Theme">
          {(["light", "dark"] as Theme[]).map((t) => (
            <button key={t} aria-pressed={theme === t} onClick={() => setTheme(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <span className={`${styles.controlLabel} type-ui-small`}>Density</span>
        <div className={styles.segmented} role="group" aria-label="Density">
          {(["compact", "default", "spacious"] as Density[]).map((d) => (
            <button key={d} aria-pressed={density === d} onClick={() => setDensity(d)}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Page content */}
      <div className={styles.container}>

        {/* Typography */}
        <section className={styles.section}>
          <ScrollReveal>
            <h2 className={`type-heading-2 ${styles.sectionHeading}`}>Typography</h2>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className={styles.sectionContent}>
              <div className={styles.card}>
                {TYPE_STACK.map(({ cls, label, sample }) => (
                  <div key={cls} className={styles.typeRow}>
                    <span className={`type-ui-small ${styles.typeLabel}`}>{label}</span>
                    <span className={`${cls} ${styles.typeSample}`}>{sample}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Buttons */}
        <section className={styles.section}>
          <ScrollReveal>
            <h2 className={`type-heading-2 ${styles.sectionHeading}`}>Button</h2>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className={styles.sectionContent}>
              <div className={styles.card}>
                <div className={styles.buttonRow}>
                  <Button hierarchy="primary">Primary</Button>
                  <Button hierarchy="alt">Alt</Button>
                  <Button hierarchy="secondary">Secondary</Button>
                  <Button hierarchy="ghost">Ghost</Button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Tabs */}
        <section className={styles.section}>
          <ScrollReveal>
            <h2 className={`type-heading-2 ${styles.sectionHeading}`}>Tabs</h2>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className={styles.sectionContent}>
              <div className={`${styles.card} ${styles.cardCentered}`}>
                <Tabs defaultValue="one">
                  <Tab value="one">One</Tab>
                  <Tab value="two">Two</Tab>
                  <Tab value="three">Three</Tab>
                </Tabs>
              </div>
            </div>
          </ScrollReveal>
        </section>

      </div>
    </div>
  );
}
