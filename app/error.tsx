"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./error.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isDbError =
    error.message?.includes("ECONNRESET") ||
    error.message?.includes("MongoServer") ||
    error.message?.includes("MongoNetwork");

  return (
    <div className={styles.errorPage}>
      <span className={styles.icon} aria-hidden="true">
        {isDbError ? "🔌" : "⚠️"}
      </span>
      <h1 className={styles.title}>
        {isDbError ? "Database connection issue" : "Something went wrong"}
      </h1>
      <p className={styles.message}>
        {isDbError
          ? "Unable to reach the database. Check that your IP is whitelisted in MongoDB Atlas under Network Access."
          : error.message}
      </p>
      <div className={styles.actions}>
        <button className={styles.retryBtn} onClick={reset}>
          Try again
        </button>
        <Link href="/" className={styles.homeLink}>
          Go home
        </Link>
      </div>
    </div>
  );
}
