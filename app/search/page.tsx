import { Suspense } from "react";
import { searchRecipes, getAllRecipes } from "@/lib/recipes";
import RecipeGrid, { RecipeGridSkeleton } from "@/components/RecipeGrid/RecipeGrid";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Search Recipes",
  description: "Find the perfect recipe by searching for ingredients, titles, or cuisines.",
};

async function SearchResults({ query }: { query: string }) {
  // If no query, show all recipes or an empty state. Let's show all recipes.
  const recipes = query ? await searchRecipes(query) : await getAllRecipes();

  if (recipes.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon} aria-hidden="true">🔍</span>
        <p className={styles.emptyTitle}>No results found</p>
        <p className={styles.emptyText}>We couldn't find any recipes matching "{query}". Try another search term.</p>
      </div>
    );
  }

  return <RecipeGrid recipes={recipes} />;
}

type Params = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SearchPage({ searchParams }: { searchParams: Params }) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <p className={styles.eyebrow}>Discover</p>
          <h1 className={styles.title}>Search Recipes</h1>
          
          <form className={styles.searchForm} action="/search" method="GET">
            <div className={styles.inputWrap}>
              <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input 
                type="search" 
                name="q" 
                defaultValue={query}
                placeholder="Search for 'chicken', 'pasta', etc..." 
                className={styles.searchInput}
                autoFocus
              />
            </div>
            <button type="submit" className={styles.searchBtn}>Search</button>
          </form>
        </header>

        {query && (
          <p className={styles.resultsText}>
            Showing results for <strong>{query}</strong>
          </p>
        )}

        <Suspense fallback={<RecipeGridSkeleton count={6} />} key={query}>
          <SearchResults query={query} />
        </Suspense>
      </div>
    </div>
  );
}
