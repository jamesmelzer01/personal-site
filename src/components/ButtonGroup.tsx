"use client";

import React from "react";
import styles from "./ButtonGroup.module.css";

interface ButtonGroupProps {
  children: React.ReactNode;
}

export function ButtonGroup({ children }: ButtonGroupProps) {
  const items = React.Children.toArray(children).filter(
    React.isValidElement
  ) as React.ReactElement<Record<string, unknown>>[];
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
          style: { borderRadius, ...((child.props.style as object) ?? {}) },
          className: [
            child.props.className,
            i > 0 ? styles.notFirst : "",
          ].filter(Boolean).join(" "),
        });
      })}
    </div>
  );
}
