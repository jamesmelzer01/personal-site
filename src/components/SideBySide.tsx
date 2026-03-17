import { surfaceTokens, Surface } from "@/styles/tokens.surface";
import styles from "./SideBySide.module.css";

interface SideBySideProps {
  image: string;
  imageAlt?: string;
  heading: string;
  body: string;
  surface?: Surface;
}

export function SideBySide({ image, imageAlt = "", heading, body, surface = "low" }: SideBySideProps) {
  return (
    <div className={styles.container} style={{ backgroundColor: surfaceTokens[surface] }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={imageAlt} className={styles.image} />
      <div className={styles.caption}>
        <h3 className={`type-heading-2 ${styles.heading}`}>{heading}</h3>
        <p className={`type-body-large ${styles.body}`}>{body}</p>
      </div>
    </div>
  );
}
