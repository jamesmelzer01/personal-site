"use client";

import { ScrollReveal } from "./ScrollReveal";
import { Button } from "./Button";
import { SplitButton } from "./SplitButton";
import styles from "./ButtonShowcase.module.css";

export function ButtonShowcase() {
  return (
    <div className={styles.container}>
      <ScrollReveal>
        <div className={styles.headingBlock}>
          <h2 className={`type-display ${styles.heading}`}>Button</h2>
        </div>
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <div className={styles.buttonRows}>
          <div className={styles.buttonRow}>
            <SplitButton>
              <Button hierarchy="primary" label="Action" />
              <Button hierarchy="primary" iconOnly iconBefore="keyboard_arrow_down.svg" aria-label="More options" />
            </SplitButton>
            <SplitButton>
              <Button hierarchy="alt" label="Action" />
              <Button hierarchy="alt" iconOnly iconBefore="keyboard_arrow_down.svg" aria-label="More options" />
            </SplitButton>
            <SplitButton>
              <Button hierarchy="secondary" label="Action" />
              <Button hierarchy="secondary" iconOnly iconBefore="keyboard_arrow_down.svg" aria-label="More options" />
            </SplitButton>
          </div>
          <div className={styles.buttonRow}>
            <Button hierarchy="primary" label="Primary" />
            <Button hierarchy="alt" label="Alt" />
            <Button hierarchy="secondary" label="Secondary" />
            <Button hierarchy="ghost" label="Ghost" />
          </div>
          <div className={styles.buttonRow}>
            <Button hierarchy="primary" iconOnly iconBefore="arrow_forward.svg" aria-label="Forward" />
            <Button hierarchy="alt" iconOnly iconBefore="arrow_forward.svg" aria-label="Forward" />
            <Button hierarchy="secondary" iconOnly iconBefore="arrow_forward.svg" aria-label="Forward" />
            <Button hierarchy="ghost" iconOnly iconBefore="arrow_forward.svg" aria-label="Forward" />
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
