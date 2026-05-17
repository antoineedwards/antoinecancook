import RecipeCard from "@/components/RecipeCard/RecipeCard";
import type { RecipeDoc } from "@/lib/types";
import styles from "./RecipeGrid.module.css";

interface RecipeGridProps {
  recipes: RecipeDoc[];
}

export function RecipeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={styles.grid} aria-busy="true" aria-label="Loading recipes">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.skeleton}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonBody}>
            <div className={styles.skeletonLine} style={{ width: "40%" }} />
            <div className={styles.skeletonLine} style={{ width: "85%" }} />
            <div className={styles.skeletonLine} style={{ width: "60%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <div className={styles.grid}>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}
