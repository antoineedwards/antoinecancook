"use client";

import { useEffect } from "react";
import styles from "./error.module.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className={styles.errorPage}>
          <span className={styles.icon} aria-hidden="true">⚠️</span>
          <h1 className={styles.title}>Something went wrong</h1>
          <p className={styles.message}>{error.message}</p>
          <button className={styles.retryBtn} onClick={reset}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
