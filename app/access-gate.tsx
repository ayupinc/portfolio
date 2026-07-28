"use client";

import { FormEvent, useEffect, useState } from "react";

const accessKey = "maple-leaf-intelligence-preview";

export function AccessGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const hasAccess = sessionStorage.getItem(accessKey) === "granted";
    setUnlocked(hasAccess);
    document.documentElement.classList.toggle("gate-locked", !hasAccess);
    return () => document.documentElement.classList.remove("gate-locked");
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code === "222") {
      sessionStorage.setItem(accessKey, "granted");
      setUnlocked(true);
      setError("");
      document.documentElement.classList.remove("gate-locked");
      return;
    }
    setError("Please check the three-digit code and try again.");
    setCode("");
  }

  return (
    <>
      {!unlocked && (
        <div className="access-gate" role="dialog" aria-modal="true" aria-labelledby="access-title">
          <div className="access-gate__panel">
            <p className="access-gate__brand">Maple Leaf Intelligence</p>
            <p className="eyebrow">Private preview</p>
            <h1 id="access-title">The site is taking shape.</h1>
            <p>
              This is a working preview for invited reviewers. Enter the
              three-digit access code to continue.
            </p>
            <form onSubmit={submit}>
              <label htmlFor="preview-code">Access code</label>
              <div>
                <input
                  id="preview-code"
                  value={code}
                  onChange={(event) => {
                    setCode(event.target.value.replace(/\D/g, "").slice(0, 3));
                    setError("");
                  }}
                  type="password"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{3}"
                  maxLength={3}
                  autoFocus
                  required
                />
                <button type="submit">Enter site</button>
              </div>
              <p className="access-gate__error" aria-live="polite">{error}</p>
            </form>
          </div>
        </div>
      )}
      <div
        className="site-content"
        aria-hidden={!unlocked ? true : undefined}
        inert={!unlocked ? true : undefined}
      >
        {children}
      </div>
    </>
  );
}
