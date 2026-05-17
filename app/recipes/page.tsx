import { Suspense } from "react";
import { getAllRecipes } from "@/lib/recipes";
import RecipeGrid, { RecipeGridSkeleton } from "@/components/RecipeGrid/RecipeGrid";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "All Recipes",
  description: "Browse every recipe — from Jamaican and Indian to Italian, Air Fryer meals, and vegetarian dishes.",
};

async function RecipesContent() {
  const recipes = await getAllRecipes();

  if (recipes.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon} aria-hidden="true">🍴</span>
        <p className={styles.emptyTitle}>No recipes yet</p>
        <p className={styles.emptyText}>Add your first recipe via the admin panel to see it here.</p>
      </div>
    );
  }

  return <RecipeGrid recipes={recipes} />;
}

export default function RecipesPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <p className={styles.eyebrow}>The Collection</p>
          <h1 className={styles.title}>All Recipes</h1>
          <p className={styles.subtitle}>Everything in one place.</p>
        </header>

        <Suspense fallback={<RecipeGridSkeleton count={9} />}>
          <RecipesContent />
        </Suspense>
      </div>
    </div>
  );
}
