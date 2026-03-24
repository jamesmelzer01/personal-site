"use client";

import { useEffect, useState } from "react";
import { TypeShowcase } from "@/components/TypeShowcase";
import { ButtonShowcase } from "@/components/ButtonShowcase";
import { TabsShowcase } from "@/components/TabsShowcase";
import { TabbedSlideshow, SlideshowPanel } from "@/components/TabbedSlideshow";
import { SideBySide } from "@/components/SideBySide";
import { StackedImage } from "@/components/StackedImage";
import { OffsetList } from "@/components/OffsetList";
import { FeatureAccordion, AccordionPanel } from "@/components/FeatureAccordion";
import { Button } from "@/components/Button";
import { InputShowcase } from "@/components/InputShowcase";
import { AiPromptBar } from "@/components/AiPromptBar";
import { Card } from "@/components/Card";
import { CardBand } from "@/components/CardBand";
import { ButtonGroup } from "@/components/ButtonGroup";
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

      <AiPromptBar />

      {/* Controls bar */}
      <div className={styles.controlsBar}>
        <h1 className={`type-heading-2 ${styles.controlsTitle}`}>Tokens Demo</h1>
        <div className={styles.controls}>
        <span className={`${styles.controlLabel} type-ui-small`}>Theme</span>
        <ButtonGroup>
          {(["light", "dark"] as Theme[]).map((t) => (
            <Button
              key={t}
              hierarchy={theme === t ? "primary" : "secondary"}
              label={t.charAt(0).toUpperCase() + t.slice(1)}
              onClick={() => setTheme(t)}
            />
          ))}
        </ButtonGroup>

        <span className={`${styles.controlLabel} type-ui-small`}>Density</span>
        <ButtonGroup>
          {(["compact", "default", "spacious"] as Density[]).map((d) => (
            <Button
              key={d}
              hierarchy={density === d ? "primary" : "secondary"}
              label={d.charAt(0).toUpperCase() + d.slice(1)}
              onClick={() => setDensity(d)}
            />
          ))}
        </ButtonGroup>
        </div>
      </div>

      {/* Page content */}
      <div className={styles.pageContainer}>

        <TabbedSlideshow
            heading="Travel"
            surface="base"
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
          <SlideshowPanel label="Valley Approach">
            <StackedImage
                image="/img/sample-panorama-2.jpeg"
                imageAlt="Panoramic landscape in Peru"
                title="Valley Approach"
                heading="Wide open spaces"
                body="Horizon-spanning landscape captured at the edge of the golden hour, where the light flattens distance into layers of tone."
            />
          </SlideshowPanel>
          <SlideshowPanel label="Machu Pichu">
            <StackedImage
                image="/img/sample-panorama-3.jpeg"
                imageAlt="Machu Pichu"
                title="Machu Pichu"
                heading="Depth and scale"
                body="A study in natural geometry — converging lines and graduated atmosphere pushing the eye toward a vanishing point."
            />
          </SlideshowPanel>
        </TabbedSlideshow>

        <FeatureAccordion
            heading="Services"
            body="Design systems strategy and hands-on craft, from token architecture to shipped components."
            surface="low"
            showCta
            label="Get in touch"
            href="/work"
            densityByBreakpoint={[
              { minWidth: breakpoints.mobile, density: "default" },
              { minWidth: breakpoints.tablet, density: "spacious" },
            ]}
        >
          <AccordionPanel label="Design Systems">
            <p className="type-body" style={{ padding: "8px 0 16px 16px", color: "var(--semantic-color-text-primary)" }}>End-to-end design systems work — token architecture, component libraries, documentation, and adoption strategy across large product organizations.</p>
          </AccordionPanel>
          <AccordionPanel label="UX Strategy">
            <p className="type-body" style={{ padding: "8px 0 16px 16px", color: "var(--semantic-color-text-primary)" }}>Framing complex product problems through research synthesis, journey mapping, and systems thinking before any design work begins.</p>
          </AccordionPanel>
          <AccordionPanel label="Interaction Design">
            <p className="type-body" style={{ padding: "8px 0 16px 16px", color: "var(--semantic-color-text-primary)" }}>High-fidelity interaction design with a focus on motion, feedback, and component-level behavior validated through usability testing.</p>
          </AccordionPanel>
          <AccordionPanel label="Design Tooling">
            <p className="type-body" style={{ padding: "8px 0 16px 16px", color: "var(--semantic-color-text-primary)" }}>Custom Figma plugins, token pipelines, and developer handoff infrastructure that close the gap between design intent and production output.</p>
          </AccordionPanel>
        </FeatureAccordion>

        <OffsetList
            heading="Clients"
            surface="low"
            items={[
              "Amgen", "Autodesk", "Cisco", "Collibra", "Cvent", "Discovery", "Faire",
              "International Monetary Fund", "JDRF", "JLL", "Kelly Services", "Key Bank",
              "Lockheed Martin", "Macys", "Marriott", "NetApp", "Qurate (QVC/HSN)",
              "Rally Health", "Riot Games", "Ritz Carlton", "Salesforce", "USAC",
              "Wells Fargo", "World Bank",
            ]}
        />

        <TabbedSlideshow
          heading="Featured Work"
          surface="low"
          densityByBreakpoint={[
            { minWidth: breakpoints.mobile, density: "default" },
            { minWidth: breakpoints.tablet, density: "spacious" },
          ]}
        >
          <SlideshowPanel label="Discovery">
            <SideBySide
              image="/img/sample-img.jpg"
              imageAlt="Discovery phase work"
              surface="base"
              heading="Understanding the problem space"
              body="Research, stakeholder interviews, and competitive analysis to frame the design challenge before touching a single wireframe."
            />
          </SlideshowPanel>
          <SlideshowPanel label="Structure">
            <SideBySide
              image="/img/sample-img-2.jpg"
              imageAlt="Information architecture work"
              surface="base"
              heading="Shaping the information architecture"
              body="Card sorting, tree testing, and IA diagrams to establish a navigation model users can predict and trust."
            />
          </SlideshowPanel>
          <SlideshowPanel label="Design">
            <SideBySide
              image="/img/sample-img-3.jpg"
              imageAlt="Final design work"
              surface="base"
              heading="High-fidelity interaction design"
              body="Component-based layouts built on a token-driven design system, validated through usability testing before handoff."
            />
          </SlideshowPanel>
        </TabbedSlideshow>


        <CardBand heading="Destinations" surface="low">
          <Card
            variant="image"
            interactive="card-link"
            image="/img/sample-img-square-2.jpg"
            imageAlt="Skógafoss"
            metadata="Iceland"
            heading="Mossy cliffs of Skógafoss near the Eyjafjallajökull glacier"
          />
          <Card
            variant="image"
            interactive="card-link"
            image="/img/sample-img-square-4.jpg"
            imageAlt="Palm House Parterre"
            metadata="England"
            heading="Kew Royal Botanic Gardens is a gardener's paradise"
          />
          <Card
            variant="image"
            interactive="card-link"
            image="/img/sample-img-square-3.jpg"
            imageAlt="Caernarfon castle"
            metadata="Wales"
            heading="A chain of British fortifications like Caernarfon castle"
          />
        </CardBand>

        <CardBand heading="Capabilities" surface="base">
          <Card
            variant="heading"
            interactive="none"
            heading="Token pipelines"
            body="End-to-end infrastructure connecting Figma Variables to production CSS, with Style Dictionary transforms and GitHub Actions automation."
          />
          <Card
            variant="heading"
            interactive="none"
            heading="Component libraries"
            body="Accessible, density-responsive components built on semantic tokens — designed for handoff and engineered for longevity."
          />
          <Card
            variant="heading"
            interactive="none"
            heading="Systems strategy"
            body="Adoption roadmaps, governance models, and documentation systems that keep design and engineering aligned as products scale."
          />
          <Card
            variant="heading"
            interactive="none"
            heading="Design tooling"
            body="Custom Figma plugins, token validators, and linting rules that close the gap between design intent and production output."
          />
        </CardBand>

        <CardBand heading="Guides" surface="base">
          <Card
            variant="text"
            interactive="cta"
            metadata="Buyers Guide"
            heading="How to scope your design system refresh project"
            ctaLabel="Learn how"
          />
          <Card
            variant="text"
            interactive="cta"
            metadata="Datasheet"
            heading="Token-driven component generation using AI"
            ctaLabel="Download now"
          />
          <Card
            variant="text"
            interactive="cta"
            metadata="Infographic"
            heading="Information architecture in the age of AI everything"
            ctaLabel="View"
          />
        </CardBand>

        <TypeShowcase />
        <ButtonShowcase />
        <TabsShowcase />
        <InputShowcase />

      </div>
    </div>
  );
}
