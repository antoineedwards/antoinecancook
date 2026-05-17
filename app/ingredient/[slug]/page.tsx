import { Suspense } from "react";
import { getRecipesByIngredient } from "@/lib/recipes";
import { capitalise } from "@/lib/utils";
import RecipeGrid, { RecipeGridSkeleton } from "@/components/RecipeGrid/RecipeGrid";
import type { Metadata } from "next";
import styles from "../../recipes/page.module.css";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const label = capitalise(slug);
  
  return {
    title: `Recipes with ${label}`,
    description: `Browse all our delicious recipes made with ${label}.`,
  };
}

async function IngredientContent({ slug }: { slug: string }) {
  const recipes = await getRecipesByIngredient(slug);

  if (recipes.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon} aria-hidden="true">🍴</span>
        <p className={styles.emptyTitle}>No recipes yet</p>
        <p className={styles.emptyText}>There are currently no recipes featuring this ingredient.</p>
      </div>
    );
  }

  return <RecipeGrid recipes={recipes} />;
}

export default async function IngredientPage({ params }: { params: Params }) {
  const { slug } = await params;
  const label = capitalise(slug);

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <p className={styles.eyebrow}>Main Ingredient</p>
          <h1 className={styles.title}>{label}</h1>
          <p className={styles.subtitle}>Delicious recipes featuring {label}.</p>
        </header>

        <Suspense fallback={<RecipeGridSkeleton count={9} />}>
          <IngredientContent slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}
