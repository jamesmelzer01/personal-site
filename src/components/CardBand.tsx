import { surfaceTokens, Surface } from "@/styles/tokens.surface";
import { ScrollReveal } from "./ScrollReveal";
import styles from "./CardBand.module.css";

interface CardBandProps {
  heading?: string;
  surface?: Surface;
  children: React.ReactNode;
}

export function CardBand({ heading, surface = "base", children }: CardBandProps) {
  return (
    <div className={styles.container} style={{ backgroundColor: surfaceTokens[surface] }}>
      {heading && (
        <ScrollReveal>
          <div className={styles.headingBlock}>
            <h2 className={`type-display ${styles.heading}`}>{heading}</h2>
          </div>
        </ScrollReveal>
      )}
      <ScrollReveal delay={80}>
        <div className={styles.cards}>{children}</div>
      </ScrollReveal>
    </div>
  );
}
