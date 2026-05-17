import Link from "next/link";
import { getDistinctCuisines, getDistinctIngredients } from "@/lib/recipes";
import { FLAT_CATEGORIES } from "@/lib/types";
import { capitalise } from "@/lib/utils";
import NavDropdown from "./NavDropdown";
import MobileMenu from "./MobileMenu";
import styles from "./Navbar.module.css";

// ── Icons ──────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

// ── Navbar is a Server Component — it fetches cuisine/ingredient
//    lists directly. No client JS needed for the hover dropdowns.
export default async function Navbar() {
  // These will be empty arrays until the DB is set up — graceful degradation
  let cuisines: string[] = [];
  let ingredients: string[] = [];

  try {
    [cuisines, ingredients] = await Promise.all([
      getDistinctCuisines(),
      getDistinctIngredients(),
    ]);
  } catch {
    // DB not yet configured — navbar still renders with static categories
  }

  return (
    <header className={styles.navbar} role="banner">
      <div className={styles.inner}>

        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="Antoine Can Cook — home">
          <span className={styles.logoName}>Antoine Can Cook</span>
          <span className={styles.logoTagline}>Recipes</span>
        </Link>

        {/* Category navigation wrapped for mobile */}
        <MobileMenu>
          <nav className={styles.nav} aria-label="Recipe categories">

            {/* Flat categories */}
            {FLAT_CATEGORIES.map((cat) => (
              <div key={cat.slug} className={styles.navItem}>
                <Link
                  href={`/category/${cat.slug}`}
                  className={styles.navLink}
                  id={`nav-${cat.slug}`}
                >
                  {cat.label}
                </Link>
              </div>
            ))}

            {/* Cuisines dropdown */}
            <NavDropdown
              id="nav-cuisines"
              label="Cuisines"
              links={
                cuisines.length > 0
                  ? cuisines.map((c) => ({ href: `/cuisine/${c}`, label: capitalise(c) }))
                  : ["Jamaican", "Indian", "Italian"].map((c) => ({
                      href: `/cuisine/${c.toLowerCase()}`,
                      label: c,
                    }))
              }
            />

            {/* Ingredients dropdown */}
            <NavDropdown
              id="nav-ingredients"
              label="Ingredients"
              emptyMessage="Add recipes to populate"
              links={ingredients.map((i) => ({ href: `/ingredient/${i}`, label: capitalise(i) }))}
            />

          </nav>
        </MobileMenu>

        {/* Right actions */}
        <div className={styles.actions}>
          <Link
            href="/search"
            className={styles.iconBtn}
            aria-label="Search recipes"
            id="nav-search"
          >
            <SearchIcon />
          </Link>
        </div>

      </div>
    </header>
  );
}
