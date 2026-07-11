"use client";

import { forwardRef, useEffect, useRef, useState } from "react";

interface TerminalCaretInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  placeholder?: string;
  ariaLabel: string;
  /** Typography shared by the fake text layer and the real (invisible) input — keep them pixel-identical. */
  textClassName: string;
}

/**
 * A styled fake-terminal input: the real <input> is fully transparent and
 * only handles keystrokes/focus, while a sibling layer renders the visible
 * text plus a thick block cursor (reusing .caret from globals.css) —
 * blinking on an empty field, solid right after the last character once
 * there's content. Native caret can't be restyled to look like this, so
 * this replaces it rather than trying to theme it.
 */
export const TerminalCaretInput = forwardRef<HTMLInputElement, TerminalCaretInputProps>(
  function TerminalCaretInput(
    { value, onChange, onKeyDown, onFocus, placeholder, ariaLabel, textClassName },
    ref,
  ) {
    const [focused, setFocused] = useState(false);
    const textLayerRef = useRef<HTMLDivElement>(null);

    // Native inputs auto-scroll to keep the caret visible as text overflows;
    // replicate that for the fake text layer so long input stays readable.
    useEffect(() => {
      const el = textLayerRef.current;
      if (el) el.scrollLeft = el.scrollWidth;
    }, [value]);

    return (
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={textLayerRef}
          aria-hidden
          className={`pointer-events-none overflow-hidden whitespace-pre text-text ${textClassName}`}
        >
          {value ? (
            <>
              {value}
              {focused && <span className="caret-static" />}
            </>
          ) : (
            <>
              {focused && <span className="caret" />}
              {placeholder ? (
                <span className="text-dim">{placeholder}</span>
              ) : (
                // Absolutely-positioned children don't give this wrapper a
                // height; without visible content the line box collapses to
                // 0px and the field becomes unclickable. A permanent
                // non-breaking space keeps a real line box at all times.
                <span aria-hidden>{" "}</span>
              )}
            </>
          )}
        </div>
        <input
          ref={ref}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => {
            setFocused(true);
            onFocus?.();
          }}
          onBlur={() => setFocused(false)}
          aria-label={ariaLabel}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className={`absolute inset-0 w-full appearance-none bg-transparent [color:transparent] [caret-color:transparent] outline-none ${textClassName}`}
        />
      </div>
    );
  },
);
