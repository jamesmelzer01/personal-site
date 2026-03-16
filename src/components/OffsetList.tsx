import { ScrollReveal } from "./ScrollReveal";
import styles from "./OffsetList.module.css";

interface OffsetListProps {
  heading: string;
  items: string[];
}

export function OffsetList({ heading, items }: OffsetListProps) {
  const columnCount = 3;
  const columns: string[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, i) => columns[i % columnCount].push(item));

  return (
    <div className={styles.container}>
      <div className={styles.headingCol}>
        <ScrollReveal>
          <h2 className={`type-heading-2 ${styles.heading}`}>{heading}</h2>
        </ScrollReveal>
      </div>
      <div className={styles.cardRowCol}>
        <ScrollReveal delay={120}>
        <div className={styles.cardRow}>
          {columns.map((col, ci) => (
            <div key={ci} className={styles.column}>
              {col.map((item) => (
                <p key={item} className={`type-body ${styles.item}`}>{item}</p>
              ))}
            </div>
          ))}
        </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
