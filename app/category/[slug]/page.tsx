import { Suspense } from "react";
import { getRecipesByCategory } from "@/lib/recipes";
import { FLAT_CATEGORIES } from "@/lib/types";
import { capitalise } from "@/lib/utils";
import RecipeGrid, { RecipeGridSkeleton } from "@/components/RecipeGrid/RecipeGrid";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import styles from "../../recipes/page.module.css";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const cat = FLAT_CATEGORIES.find((c) => c.slug === slug);
  const label = cat ? cat.label : capitalise(slug);
  
  return {
    title: `${label} Recipes`,
    description: `Browse all our delicious ${label.toLowerCase()} recipes.`,
  };
}

async function CategoryContent({ slug }: { slug: string }) {
  const recipes = await getRecipesByCategory(slug);

  if (recipes.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon} aria-hidden="true">🍴</span>
        <p className={styles.emptyTitle}>No recipes yet</p>
        <p className={styles.emptyText}>There are currently no recipes in this category.</p>
      </div>
    );
  }

  return <RecipeGrid recipes={recipes} />;
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  
  // Optional: check if slug is valid or let it be dynamic
  const cat = FLAT_CATEGORIES.find((c) => c.slug === slug);
  const label = cat ? cat.label : capitalise(slug);

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <p className={styles.eyebrow}>Category</p>
          <h1 className={styles.title}>{label}</h1>
          <p className={styles.subtitle}>Explore our favorite {label.toLowerCase()} meals.</p>
        </header>

        <Suspense fallback={<RecipeGridSkeleton count={9} />}>
          <CategoryContent slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}
