import Link from "next/link";
import Image from "next/image";
import type { RecipeDoc } from "@/lib/types";
import { formatDate, r2Url, capitalise } from "@/lib/utils";
import styles from "./RecipeCard.module.css";

interface RecipeCardProps {
  recipe: RecipeDoc;
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const imageUrl = recipe.heroImage ? r2Url(recipe.heroImage) : null;

  // Build a compact tag list: cuisine first, then flat categories
  const displayTags: { label: string; isCuisine: boolean }[] = [];
  if (recipe.cuisine) {
    displayTags.push({ label: capitalise(recipe.cuisine), isCuisine: true });
  }
  recipe.categories.slice(0, 2).forEach((c) =>
    displayTags.push({ label: capitalise(c), isCuisine: false })
  );

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className={styles.card}
      id={`recipe-card-${recipe.slug}`}
      aria-label={recipe.title}
    >
      {/* Image */}
      <div className={styles.imageWrap}>
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={recipe.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={styles.image}
            />
            <div className={styles.imageOverlay} aria-hidden="true" />
          </>
        ) : (
          <div className={styles.noImage} aria-hidden="true">🍴</div>
        )}
        {recipe.featured && (
          <span className={styles.featuredBadge}>★ Featured</span>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        {displayTags.length > 0 && (
          <div className={styles.tags}>
            {displayTags.map((t) => (
              <span
                key={t.label}
                className={`${styles.tag} ${t.isCuisine ? styles.cuisine : ""}`}
              >
                {t.label}
              </span>
            ))}
          </div>
        )}

        <h2 className={styles.title}>{recipe.title}</h2>

        {recipe.description && (
          <p className={styles.description}>{recipe.description}</p>
        )}

        <div className={styles.footer}>
          <span className={styles.date}>
            {formatDate(recipe.publishedAt)}
          </span>
          <span className={styles.arrow}>
            <ArrowIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}
