import styles from "./StackedImage.module.css";

interface StackedImageProps {
  image: string;
  imageAlt?: string;
  title?: string;
  heading: string;
  body: string;
}

export function StackedImage({ image, imageAlt = "", title, heading, body }: StackedImageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={imageAlt} className={styles.image} />
        {title && <p className={styles.imageTitle}>{title}</p>}
      </div>
      <div className={styles.caption}>
        <h3 className={`type-heading-2 ${styles.heading}`}>{heading}</h3>
        <p className={`type-body-large ${styles.body}`}>{body}</p>
      </div>
    </div>
  );
}
