"use client";

import { ScrollReveal } from "./ScrollReveal";
import { Tab, Tabs } from "./Tabs";
import styles from "./TabsShowcase.module.css";

export function TabsShowcase() {
  return (
    <div className={styles.container}>
      <ScrollReveal>
        <div className={styles.headingBlock}>
          <h2 className={`type-display ${styles.heading}`}>Tabs</h2>
        </div>
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <div className={styles.tabsWrap}>
          <Tabs defaultValue="one">
            <Tab value="one">One</Tab>
            <Tab value="two">Two</Tab>
            <Tab value="three">Three</Tab>
          </Tabs>
        </div>
      </ScrollReveal>
    </div>
  );
}
