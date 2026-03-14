import styles from "./Button.module.css";

export type ButtonHierarchy = "primary" | "alt" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hierarchy?: ButtonHierarchy;
}

export function Button({
  hierarchy = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.btn} ${styles[hierarchy]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
