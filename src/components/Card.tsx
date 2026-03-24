import { Button } from "./Button";
import styles from "./Card.module.css";

export type CardVariant = "image" | "heading" | "text";
export type CardInteractive = "cta" | "card-link" | "none";

interface CardProps {
  variant?: CardVariant;
  interactive?: CardInteractive;
  metadata?: string;
  heading: string;
  body?: string;
  image?: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function Card({
  variant = "text",
  interactive = "none",
  metadata,
  heading,
  body,
  image,
  imageAlt = "",
  ctaLabel,
  ctaHref,
}: CardProps) {
  const buttonHierarchy = variant === "image" ? "secondary" : "alt";

  const inner = (
    <>
      {variant === "image" && image && (
        <div className={styles.media}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={imageAlt} className={styles.image} />
        </div>
      )}
      <div className={styles.cardText}>
        <div className={styles.headingBlock}>
          {metadata && (
            <span className={`type-ui-small ${styles.metadata}`}>{metadata}</span>
          )}
          <h3 className={`type-heading-3 ${styles.heading}`}>
            {heading}
            {interactive === "card-link" && (
              <span className={styles.arrowIcon} aria-hidden="true" />
            )}
          </h3>
        </div>
        {variant === "heading" && body && (
          <p className={`type-body-large ${styles.body}`}>{body}</p>
        )}
        {interactive === "cta" && ctaLabel && (
          <div>
            <Button
              hierarchy={buttonHierarchy}
              label={ctaLabel}
              {...(ctaHref ? { href: ctaHref } : {})}
            />
          </div>
        )}
      </div>
    </>
  );

  if (interactive === "card-link") {
    return (
      <a href={ctaHref} className={`${styles.card} ${styles.cardLink}`}>
        {inner}
      </a>
    );
  }

  return <div className={styles.card}>{inner}</div>;
}
