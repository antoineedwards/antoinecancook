"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";

export default function FeaturedToggle({
  slug,
  featured,
}: {
  slug: string;
  featured: boolean;
}) {
  const [isFeatured, setIsFeatured] = useState(featured);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    const next = !isFeatured;
    setIsFeatured(next); // optimistic
    try {
      await fetch(`/api/admin/recipes/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: next }),
      });
      router.refresh();
    } catch {
      setIsFeatured(!next); // revert
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={`${styles.featuredToggle} ${isFeatured ? styles.on : styles.off}`}
      onClick={toggle}
      disabled={loading}
      id={`featured-toggle-${slug}`}
      aria-label={isFeatured ? "Unfeature recipe" : "Feature recipe"}
    >
      {isFeatured ? "★ Featured" : "☆ Feature"}
    </button>
  );
}
