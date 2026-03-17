"use client";

import { useState, useEffect, Children, isValidElement } from "react";
import { Tabs, Tab } from "./Tabs";
import { ScrollReveal } from "./ScrollReveal";
import { surfaceTokens, Surface } from "@/styles/tokens.surface";
import styles from "./TabbedSlideshow.module.css";

type Density = "compact" | "default" | "spacious";

interface DensityBreakpoint {
  /** Minimum viewport width in px at which this density applies. */
  minWidth: number;
  density: Density;
}

interface SlideshowPanelProps {
  label: string;
  children: React.ReactNode;
}

export function SlideshowPanel({ children }: SlideshowPanelProps) {
  return <div role="tabpanel">{children}</div>;
}

interface TabbedSlideshowProps {
  heading: string;
  surface?: Surface;
  children: React.ReactNode;
  /**
   * Breakpoint-responsive density overrides. Evaluated in minWidth order —
   * last match wins (same logic as CSS cascade). Falls back to the page-level
   * data-density when omitted.
   *
   * Example: [{ minWidth: 0, density: "default" }, { minWidth: 800, density: "spacious" }]
   */
  densityByBreakpoint?: DensityBreakpoint[];
}

export function TabbedSlideshow({ heading, surface = "base", children, densityByBreakpoint }: TabbedSlideshowProps) {
  const panels = Children.toArray(children).filter(
    (child) => isValidElement(child) && child.type === SlideshowPanel
  ) as React.ReactElement<SlideshowPanelProps>[];

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward" | null>(null);
  const [density, setDensity] = useState<Density | undefined>(undefined);

  useEffect(() => {
    if (!densityByBreakpoint?.length) return;

    const sorted = [...densityByBreakpoint].sort((a, b) => a.minWidth - b.minWidth);

    const evaluate = () => {
      const match = sorted.reduce<Density | undefined>(
        (current, bp) => (window.innerWidth >= bp.minWidth ? bp.density : current),
        undefined
      );
      setDensity(match);
    };

    evaluate();
    window.addEventListener("resize", evaluate);
    return () => window.removeEventListener("resize", evaluate);
  }, [densityByBreakpoint]);

  return (
    <div className={styles.container} style={{ backgroundColor: surfaceTokens[surface] }} {...(density ? { "data-density": density } : {})}>
      <ScrollReveal>
        <div className={styles.headingBlock}>
          <h2 className={`type-display ${styles.heading}`}>{heading}</h2>
        </div>
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <div className={styles.tabsWrap}>
          <Tabs
            value={String(activeIndex)}
            onChange={(v) => {
              const next = Number(v);
              setDirection(next > activeIndex ? "forward" : "backward");
              setActiveIndex(next);
            }}
          >
            {panels.map((panel, i) => (
              <Tab key={i} value={String(i)}>{panel.props.label}</Tab>
            ))}
          </Tabs>
        </div>
      </ScrollReveal>
      <ScrollReveal delay={240}>
        <div className={styles.slot}>
          <div
            key={activeIndex}
            className={styles.panel}
            {...(direction ? { "data-direction": direction } : {})}
          >
            {panels[activeIndex]}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
