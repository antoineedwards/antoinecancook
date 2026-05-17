import Link from "next/link";
import { getDistinctCuisines, getDistinctIngredients } from "@/lib/recipes";
import { FLAT_CATEGORIES } from "@/lib/types";
import { capitalise } from "@/lib/utils";
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

function ChevronDownIcon() {
  return (
    <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
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

        {/* Category navigation */}
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
          <div className={styles.navItem}>
            <button
              className={styles.navDropdownTrigger}
              aria-haspopup="true"
              aria-expanded="false"
              id="nav-cuisines"
            >
              Cuisines
              <ChevronDownIcon />
            </button>
            <div className={styles.dropdown} role="menu" aria-labelledby="nav-cuisines">
              {cuisines.length > 0 ? (
                cuisines.map((c) => (
                  <Link
                    key={c}
                    href={`/cuisine/${c}`}
                    className={styles.dropdownLink}
                    role="menuitem"
                  >
                    {capitalise(c)}
                  </Link>
                ))
              ) : (
                <>
                  {["Jamaican", "Indian", "Italian"].map((c) => (
                    <Link
                      key={c}
                      href={`/cuisine/${c.toLowerCase()}`}
                      className={styles.dropdownLink}
                      role="menuitem"
                    >
                      {c}
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Ingredients dropdown */}
          <div className={styles.navItem}>
            <button
              className={styles.navDropdownTrigger}
              aria-haspopup="true"
              aria-expanded="false"
              id="nav-ingredients"
            >
              Ingredients
              <ChevronDownIcon />
            </button>
            <div className={styles.dropdown} role="menu" aria-labelledby="nav-ingredients">
              {ingredients.length > 0 ? (
                ingredients.map((i) => (
                  <Link
                    key={i}
                    href={`/ingredient/${i}`}
                    className={styles.dropdownLink}
                    role="menuitem"
                  >
                    {capitalise(i)}
                  </Link>
                ))
              ) : (
                <span className={styles.dropdownEmpty}>Add recipes to populate</span>
              )}
            </div>
          </div>

        </nav>

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
