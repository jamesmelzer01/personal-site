"use client";

import { useEffect, useState } from "react";
import { TypeShowcase } from "@/components/TypeShowcase";
import { ButtonShowcase } from "@/components/ButtonShowcase";
import { TabsShowcase } from "@/components/TabsShowcase";
import { TabbedSlideshow, SlideshowPanel } from "@/components/TabbedSlideshow";
import { SideBySide } from "@/components/SideBySide";
import { StackedImage } from "@/components/StackedImage";
import { OffsetList } from "@/components/OffsetList";
import { breakpoints } from "@/styles/tokens.breakpoints";
import styles from "./page.module.css";

type Theme = "light" | "dark";
type Density = "compact" | "default" | "spacious";

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
      <div className={styles.pageContainer}>

        <TypeShowcase />
        <ButtonShowcase />
        <TabsShowcase />

        <TabbedSlideshow
          heading="Featured Work"
          densityByBreakpoint={[
            { minWidth: breakpoints.mobile, density: "default" },
            { minWidth: breakpoints.tablet, density: "spacious" },
          ]}
        >
          <SlideshowPanel label="Discovery">
            <SideBySide
              image="/img/sample-img.jpg"
              imageAlt="Discovery phase work"
              heading="Understanding the problem space"
              body="Research, stakeholder interviews, and competitive analysis to frame the design challenge before touching a single wireframe."
            />
          </SlideshowPanel>
          <SlideshowPanel label="Structure">
            <SideBySide
              image="/img/sample-img-2.jpg"
              imageAlt="Information architecture work"
              heading="Shaping the information architecture"
              body="Card sorting, tree testing, and IA diagrams to establish a navigation model users can predict and trust."
            />
          </SlideshowPanel>
          <SlideshowPanel label="Design">
            <SideBySide
              image="/img/sample-img-3.jpg"
              imageAlt="Final design work"
              heading="High-fidelity interaction design"
              body="Component-based layouts built on a token-driven design system, validated through usability testing before handoff."
            />
          </SlideshowPanel>
        </TabbedSlideshow>

        <OffsetList
          heading="Clients"
          items={[
            "Amgen", "Autodesk", "Cisco", "Collibra", "Cvent", "Discovery", "Faire",
            "International Monetary Fund", "JDRF", "JLL", "Kelly Services", "Key Bank",
            "Lockheed Martin", "Macys", "Marriott", "NetApp", "Qurate (QVC/HSN)",
            "Rally Health", "Riot Games", "Ritz Carlton", "Salesforce", "USAC",
            "Wells Fargo", "World Bank",
          ]}
        />

        <TabbedSlideshow
          heading="Selected Photography"
          densityByBreakpoint={[
            { minWidth: breakpoints.mobile, density: "default" },
            { minWidth: breakpoints.tablet, density: "spacious" },
          ]}
        >
          <SlideshowPanel label="Sacred Valley">
            <StackedImage
              image="/img/sample-panorama.jpg"
              imageAlt="Sacred Valley, Peru"
              title="Sacred Valley"
              heading="Sacred Valley, Peru"
              body="Sweeping views across the Urubamba valley, framed by Andean peaks and the terraced hillsides of the Inca heartland."
            />
          </SlideshowPanel>
          <SlideshowPanel label="Panorama Two">
            <StackedImage
              image="/img/sample-panorama-2.jpeg"
              imageAlt="Panoramic landscape"
              title="Panorama Two"
              heading="Wide open spaces"
              body="Horizon-spanning landscape captured at the edge of the golden hour, where the light flattens distance into layers of tone."
            />
          </SlideshowPanel>
          <SlideshowPanel label="Panorama Three">
            <StackedImage
              image="/img/sample-panorama-3.jpeg"
              imageAlt="Panoramic landscape"
              title="Panorama Three"
              heading="Depth and scale"
              body="A study in natural geometry — converging lines and graduated atmosphere pushing the eye toward a vanishing point."
            />
          </SlideshowPanel>
        </TabbedSlideshow>

      </div>
    </div>
  );
}
