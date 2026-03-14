"use client";

import { createContext, useContext, useState } from "react";
import styles from "./Tabs.module.css";

// ---------------------------------------------------------------------------
// Context — shared between Tabs and Tab without prop-drilling
// ---------------------------------------------------------------------------

interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab must be used within a Tabs component");
  return ctx;
}

// ---------------------------------------------------------------------------
// Tabs — container, owns state
// ---------------------------------------------------------------------------

interface TabsProps {
  /** Uncontrolled: initial selected tab value. */
  defaultValue?: string;
  /** Controlled: current selected tab value. Use with onChange. */
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({
  defaultValue = "",
  value: controlledValue,
  onChange,
  className = "",
  children,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;
  const handleChange = onChange ?? setInternalValue;

  return (
    <TabsContext.Provider value={{ value, onChange: handleChange }}>
      <div className={`${styles.tabs} ${className}`} role="tablist">
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Tab — individual item, reads state from context
// ---------------------------------------------------------------------------

interface TabProps {
  /** Must match the value passed to Tabs defaultValue/value to mark selected. */
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function Tab({ value, className = "", children }: TabProps) {
  const { value: selectedValue, onChange } = useTabsContext();
  const selected = selectedValue === value;

  return (
    <button
      role="tab"
      aria-selected={selected}
      className={`${styles.tab} ${selected ? styles.selected : styles.unselected} ${className}`}
      onClick={() => onChange(value)}
    >
      {children}
    </button>
  );
}
