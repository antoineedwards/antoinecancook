import Link from "next/link";
import styles from "./page.module.css";

const CATEGORIES = [
  { slug: "airfryer", label: "Air Fryer", emoji: "♨️" },
  { slug: "dinner", label: "Dinners", emoji: "🍽️" },
  { slug: "vegetarian", label: "Vegetarian", emoji: "🥦" },
  { slug: "cuisine/jamaican", label: "Jamaican", emoji: "🌿" },
  { slug: "cuisine/indian", label: "Indian", emoji: "🍛" },
  { slug: "cuisine/italian", label: "Italian", emoji: "🍝" },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className={styles.heroSection} aria-label="Hero">
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroPhotoWrap} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/me.jpg" alt="" className={styles.heroPhoto} />
        </div>
        <div className={`container ${styles.heroContent}`} id="hero">
          <p className={styles.heroEyebrow}>Home Cooking, Elevated</p>
          <h1 className={styles.heroTitle}>
            Food made with <em>intention</em>.
          </h1>
          <p className={styles.heroSub}>
            Recipes built around real ingredients, bold flavours, and the kind
            of meals worth coming home for.
          </p>
          <Link href="/recipes" className={styles.heroCta} id="hero-browse-cta">
            Browse Recipes
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Category Rail ─────────────────────────────────── */}
      <section className={styles.categorySection} aria-label="Browse by category">
        <div className="container">
          <div className={styles.categoryRail}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={styles.categoryPill}
                id={`cat-pill-${cat.slug.replace("/", "-")}`}
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

          {/* Empty state — until MongoDB is connected */}
          <div className={styles.comingSoon} role="status">
            <span className={styles.comingSoonIcon} aria-hidden="true">🍴</span>
            <p className={styles.comingSoonTitle}>Recipes coming soon</p>
            <p className={styles.comingSoonText}>
              Connect MongoDB Atlas and add your first recipe to see it here.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
