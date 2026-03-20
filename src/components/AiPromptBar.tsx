"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import styles from "./AiPromptBar.module.css";

const PROMPT = "Why did we choose token aliasing for the surface props?";

const RESPONSE = `The short answer: type safety and loud failures over silent ones.

The alternative — constructing the CSS variable name from the prop value at runtime — looks elegant but fails silently. A typo in a prop value, or a future token rename, produces a var() reference that resolves to nothing. No TypeScript error, no runtime warning, just a transparent background that you might not catch until it's live.

The lookup object in tokens.surface.ts inverts that failure mode. The Surface type is derived from the object's keys using keyof typeof surfaceTokens, so TypeScript rejects any invalid value at compile time. A token rename is a one-file change, not a grep-and-replace across every component.

There's also an intentional exclusion worth noting. The ground token is left out of the lookup because it's reserved for the page background and shouldn't be composable into section components. The lookup makes that constraint enforced rather than just documented.

It's a pattern sometimes called an alias table — a single authoritative mapping between design-intent names and implementation references. Small overhead, high leverage.`;

const WORD_DELAY_MS = 28;
const THINK_DELAY_MS = 700;
const CLOSE_DURATION_MS = 750;

type Phase = "idle" | "opening" | "thinking" | "streaming" | "done" | "closing";

const responseTokens = RESPONSE.split(/(\s+)/);

export function AiPromptBar() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [revealedCount, setRevealedCount] = useState(0);
  const responseRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (phase !== "idle") return;
    setPhase("opening");
    setTimeout(() => setPhase("thinking"), 500);
    setTimeout(() => setPhase("streaming"), 500 + THINK_DELAY_MS);
  };

  const handleClose = () => {
    setPhase("closing");
    setTimeout(() => {
      setPhase("idle");
      setRevealedCount(0);
    }, CLOSE_DURATION_MS);
  };

  useEffect(() => {
    if (phase !== "streaming") return;
    if (revealedCount >= responseTokens.length) {
      setPhase("done");
      return;
    }
    const t = setTimeout(() => setRevealedCount((n) => n + 1), WORD_DELAY_MS);
    return () => clearTimeout(t);
  }, [phase, revealedCount]);

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [revealedCount]);

  const visibleText = responseTokens.slice(0, revealedCount).join("");
  const paragraphs = visibleText.split("\n\n").filter((p) => p.trim().length > 0);
  const isStreaming = phase === "streaming";
  const isOpen = phase !== "idle" && phase !== "closing";
  const showClose = phase !== "idle";

  return (
    <div className={`${styles.container} ${isOpen ? styles.open : ""}`}>
      <div className={styles.responseArea} ref={responseRef}>
        <div className={styles.responseContent}>
          {phase === "thinking" && (
            <div className={styles.thinking} aria-label="Thinking">
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          )}
          {(isStreaming || phase === "done") &&
            paragraphs.map((p, i) => (
              <p key={i} className={`type-body-large ${styles.paragraph}`}>
                {p}
                {i === paragraphs.length - 1 && isStreaming && (
                  <span className={styles.cursor} aria-hidden="true" />
                )}
              </p>
            ))}
        </div>
      </div>

      <div className={styles.promptBar}>
        <div className={styles.inputGroup}>
          <Input
            defaultValue={PROMPT}
            disabled={isOpen}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <Button
            hierarchy="primary"
            label="Ask"
            disabled={isOpen}
            onClick={handleSubmit}
          />
        </div>
        {showClose && (
          <Button
            className={styles.closeButton}
            hierarchy="ghost"
            iconOnly
            iconBefore="close.svg"
            aria-label="Dismiss"
            onClick={handleClose}
          />
        )}
      </div>
    </div>
  );
}
