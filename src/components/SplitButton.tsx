"use client";

import React from "react";
import styles from "./SplitButton.module.css";

interface SplitButtonProps {
  children: React.ReactNode;
}

export function SplitButton({ children }: SplitButtonProps) {
  const items = React.Children.toArray(children).filter(
    React.isValidElement
  ) as React.ReactElement[];
  const count = items.length;
  const r = "var(--component-button-border-radius)";

  return (
    <div className={styles.container}>
      {items.map((child, i) => {
        const isFirst = i === 0;
        const isLast = i === count - 1;
        const borderRadius = isFirst
          ? `${r} 0 0 ${r}`
          : isLast
          ? `0 ${r} ${r} 0`
          : "0";

        return React.cloneElement(child, {
          key: i,
          style: { borderRadius, ...((child.props as Record<string, unknown>).style ?? {}) },
          className: [
            (child.props as Record<string, unknown>).className,
            i > 0 ? styles.notFirst : "",
          ].filter(Boolean).join(" "),
        });
      })}
    </div>
  );
}
