"use client";

import React, { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { breakpoints } from "@/styles/tokens.breakpoints";
import styles from "./FeatureAccordion.module.css";

type Density = "compact" | "default" | "spacious";
interface DensityBreakpoint { minWidth: number; density: Density; }

// ---------------------------------------------------------------------------
// AccordionPanel — compound child (data carrier, rendered by FeatureAccordion)
// ---------------------------------------------------------------------------

interface AccordionPanelProps {
  label: string;
  children: React.ReactNode;
}

export function AccordionPanel(_props: AccordionPanelProps): null {
  return null;
}

// ---------------------------------------------------------------------------
// AccordionItem — internal, renders each row
// ---------------------------------------------------------------------------

interface AccordionItemProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionItem({ label, isOpen, onToggle, children }: AccordionItemProps) {
  return (
    <div className={styles.item} data-open={isOpen}>
      <button className={styles.face} onClick={onToggle} aria-expanded={isOpen}>
        <span className={`type-ui-large ${styles.label}`}>{label}</span>
        <span className={styles.icon} aria-hidden="true" />
      </button>
      <div className={styles.content}>
        <div className={styles.contentInner}>{children}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FeatureAccordion — full-row section component
// ---------------------------------------------------------------------------

interface FeatureAccordionProps {
  heading: string;
  body: string;
  densityByBreakpoint?: DensityBreakpoint[];
  children: React.ReactNode;
}

export function FeatureAccordion({
  heading,
  body,
  densityByBreakpoint,
  children,
}: FeatureAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [density, setDensity] = useState<Density | undefined>(undefined);

  React.useEffect(() => {
    if (!densityByBreakpoint?.length) return;
    const evaluate = () => {
      const sorted = [...densityByBreakpoint].sort((a, b) => b.minWidth - a.minWidth);
      const match = sorted.find((bp) => window.innerWidth >= bp.minWidth);
      if (match) setDensity(match.density);
    };
    evaluate();
    window.addEventListener("resize", evaluate);
    return () => window.removeEventListener("resize", evaluate);
  }, [densityByBreakpoint]);

  const panels = React.Children.toArray(children) as React.ReactElement<AccordionPanelProps>[];
  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <div
      className={styles.container}
      {...(density ? { "data-density": density } : {})}
    >
      <div className={styles.headingCol}>
        <ScrollReveal>
          <div className={styles.headingBlock}>
            <h2 className={`type-heading-2 ${styles.heading}`}>{heading}</h2>
            <p className={`type-body-large ${styles.body}`}>{body}</p>
          </div>
        </ScrollReveal>
      </div>
      <div className={styles.contentCol}>
        <ScrollReveal delay={120}>
          <div className={styles.list}>
            {panels.map((panel, i) => (
              <AccordionItem
                key={i}
                label={panel.props.label}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              >
                {panel.props.children}
              </AccordionItem>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
