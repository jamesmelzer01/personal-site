"use client";

import { ScrollReveal } from "./ScrollReveal";
import styles from "./TypeShowcase.module.css";

const TYPE_STACK = [
  { cls: "type-display-l",  label: "display-l",  sample: "The quick brown fox" },
  { cls: "type-display",    label: "display",    sample: "The quick brown fox" },
  { cls: "type-heading-1",  label: "heading-1",  sample: "The quick brown fox" },
  { cls: "type-heading-2",  label: "heading-2",  sample: "The quick brown fox" },
  { cls: "type-heading-3",  label: "heading-3",  sample: "The quick brown fox" },
  { cls: "type-body-large", label: "body-large", sample: "The quick brown fox jumps over the lazy dog." },
  { cls: "type-body",       label: "body",       sample: "The quick brown fox jumps over the lazy dog." },
  { cls: "type-body-small", label: "body-small", sample: "The quick brown fox jumps over the lazy dog." },
  { cls: "type-eyebrow",    label: "eyebrow",    sample: "Section Label" },
  { cls: "type-ui-large",   label: "ui-large",   sample: "Button Label" },
  { cls: "type-ui",         label: "ui",         sample: "Button Label" },
  { cls: "type-ui-small",   label: "ui-small",   sample: "Button Label" },
];

export function TypeShowcase() {
  return (
    <div className={styles.container}>
      <ScrollReveal>
        <div className={styles.headingBlock}>
          <h2 className={`type-display ${styles.heading}`}>Typography</h2>
        </div>
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <div className={styles.content}>
          {TYPE_STACK.map(({ cls, label, sample }) => (
            <div key={cls} className={styles.typeRow}>
              <span className={`type-ui-small ${styles.typeLabel}`}>{label}</span>
              <span className={`${cls} ${styles.typeSample}`}>{sample}</span>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
