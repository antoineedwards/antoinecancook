import { Suspense } from "react";
import { getRecipesByCuisine } from "@/lib/recipes";
import { capitalise } from "@/lib/utils";
import RecipeGrid, { RecipeGridSkeleton } from "@/components/RecipeGrid/RecipeGrid";
import type { Metadata } from "next";
import styles from "../../recipes/page.module.css";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const label = capitalise(slug);

  return {
    title: `${label} Cuisine`,
    description: `Browse all my ${label} recipes.`,
  };
}

async function CuisineContent({ slug }: { slug: string }) {
  const recipes = await getRecipesByCuisine(slug);

  if (recipes.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon} aria-hidden="true">🍴</span>
        <p className={styles.emptyTitle}>No recipes yet</p>
        <p className={styles.emptyText}>There are currently no recipes for this cuisine.</p>
      </div>
    );
  }

  return <RecipeGrid recipes={recipes} />;
}

export default async function CuisinePage({ params }: { params: Params }) {
  const { slug } = await params;
  const label = capitalise(slug);

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <p className={styles.eyebrow}>Cuisine</p>
          <h1 className={styles.title}>{label}</h1>
          <p className={styles.subtitle}>Explore my favorite {label} dishes.</p>
        </header>

        <Suspense fallback={<RecipeGridSkeleton count={9} />}>
          <CuisineContent slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}
