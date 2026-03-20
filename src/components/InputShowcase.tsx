import { Input } from "./Input";
import { ScrollReveal } from "./ScrollReveal";
import styles from "./InputShowcase.module.css";

export function InputShowcase() {
  return (
    <div className={styles.container}>
      <ScrollReveal>
        <div className={styles.headingBlock}>
          <h2 className={`type-display ${styles.heading}`}>Input</h2>
        </div>
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <div className={styles.inputRow}>
          <Input placeholder="Placeholder" />
          <Input placeholder="Search" icon="search.svg" />
        </div>
      </ScrollReveal>
    </div>
  );
}
