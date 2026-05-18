import Link from "next/link";
import { getRecentRecipes } from "@/lib/recipes";
import RecipeGrid from "@/components/RecipeGrid/RecipeGrid";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { type: "category", slug: "airfryer", label: "Air Fryer", emoji: "♨️" },
  { type: "category", slug: "dinner", label: "Dinners", emoji: "🍽️" },
  { type: "category", slug: "vegetarian", label: "Vegetarian", emoji: "🥦" },
  { type: "cuisine", slug: "jamaican", label: "Jamaican", emoji: "🌿" },
  { type: "cuisine", slug: "indian", label: "Indian", emoji: "🍛" },
  { type: "cuisine", slug: "italian", label: "Italian", emoji: "🍝" },
];

export default async function HomePage() {
  const recentRecipes = await getRecentRecipes(6);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className={styles.heroSection} aria-label="Hero">
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroPhotoWrap} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/me.png" alt="" className={styles.heroPhoto} />
        </div>
        <div className={`container ${styles.heroContent}`} id="hero">
          <p className={styles.heroEyebrow}>Chef Antoine Edwards</p>
          <h1 className={styles.heroTitle}>
            Part time cook, <em>full time student</em>.
          </h1>
          <p className={styles.heroSub}>
            Recipes built around minimal effort and maximum flavor.
          </p>
          <div className={styles.heroActions}>
            <Link href="/recipes" className={styles.heroCta} id="hero-browse-cta">
              Browse Recipes
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="https://instagram.com/antoinecancook"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.heroSocial}
              aria-label="Follow me on Instagram"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>Follow me on Instagram</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Category Rail ─────────────────────────────────── */}
      <section className={styles.categorySection} aria-label="Browse by category">
        <div className="container">
          <div className={styles.categoryRail}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.type}/${cat.slug}`}
                className={styles.categoryPill}
                id={`cat-pill-${cat.slug}`}
              >
                <span className={styles.categoryEmoji} aria-hidden="true">
                  {cat.emoji}
                </span>
                <span className={styles.categoryLabel}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Recipes ────────────────────────────────── */}
      <section className={styles.section} aria-label="Recent recipes">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Recipes</h2>
            <Link href="/recipes" className={styles.sectionLink}>
              View all →
            </Link>
          </div>

          {recentRecipes.length > 0 ? (
            <RecipeGrid recipes={recentRecipes} />
          ) : (
            <div className={styles.comingSoon} role="status">
              <span className={styles.comingSoonIcon} aria-hidden="true">🍴</span>
              <p className={styles.comingSoonTitle}>Recipes coming soon</p>
              <p className={styles.comingSoonText}>
                Connect MongoDB Atlas and add your first recipe to see it here.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
