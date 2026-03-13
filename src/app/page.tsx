import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.leading}>
        <Image
          src="/img/JMLogoDisk.svg"
          alt="JM Signature"
          width={400}
          height={400}
          priority
        />
        <h1>James Melzer</h1>
        <h2>User Experience Designer and Information Architect</h2>
      </div>

      <div className={styles.meat}>
        <p>New site coming soon.</p>
      </div>

      <div className={styles.trailing}>
        <p>
          This is my personal site. For my consultancy, please head to:
        </p>
        <a href="https://bearings-ux.com">
          <Image
            src="/img/bearings-ux-logo-2024.svg"
            alt="Bearings UX"
            width={400}
            height={120}
            className={styles.bearingsLogo}
          />
        </a>
      </div>
    </div>
  );
}
