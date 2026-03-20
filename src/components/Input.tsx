import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  hasError?: boolean;
}

function Icon({ src }: { src: string }) {
  return (
    <span
      className={styles.icon}
      aria-hidden="true"
      style={{ maskImage: `url('/img/${src}')` }}
    />
  );
}

export function Input({ icon, hasError = false, className = "", ...props }: InputProps) {
  return (
    <div className={`${styles.wrap}${hasError ? ` ${styles.error}` : ""}`}>
      <input
        className={`${styles.input}${className ? ` ${className}` : ""}`}
        aria-invalid={hasError || undefined}
        {...props}
      />
      {icon && <Icon src={icon} />}
    </div>
  );
}
