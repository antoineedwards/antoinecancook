import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getRecipeBySlug, getAllRecipes } from "@/lib/recipes";
import { r2Url, formatDate, capitalise } from "@/lib/utils";
import styles from "./page.module.css";

// ── Static params for ISR/SSG ──────────────────────────────
export async function generateStaticParams() {
  try {
    const recipes = await getAllRecipes();
    return recipes.map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

// ── Metadata ───────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return { title: "Recipe not found" };
  return {
    title: recipe.title,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      images: recipe.heroImage ? [r2Url(recipe.heroImage)] : [],
    },
  };
}

// ── Page ───────────────────────────────────────────────────
export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();

  const imageUrl = recipe.heroImage ? r2Url(recipe.heroImage) : null;

  const allTags = [
    recipe.cuisine ? capitalise(recipe.cuisine) : null,
    recipe.mainIngredient ? capitalise(recipe.mainIngredient) : null,
    ...recipe.categories.map(capitalise),
    ...recipe.tags,
  ].filter(Boolean) as string[];

  return (
    <article className={styles.article}>
      {/* ── Hero Image ──────────────────────────────────── */}
      <div className={styles.hero}>
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={recipe.title}
              fill
              priority
              sizes="100vw"
              className={styles.heroImage}
            />
            <div className={styles.heroOverlay} aria-hidden="true" />
          </>
        ) : (
          <div className={styles.heroPlaceholder} aria-hidden="true">🍴</div>
        )}

        {/* Title overlay on hero */}
        <div className={styles.heroContent}>
          <div className="container">
            {/* Back link */}
            <Link href="/recipes" className={styles.backLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              All Recipes
            </Link>

            <div className={styles.heroMeta}>
              {allTags.slice(0, 3).map((t) => (
                <span key={t} className={styles.heroBadge}>{t}</span>
              ))}
            </div>
            <h1 className={styles.heroTitle}>{recipe.title}</h1>
            {recipe.description && (
              <p className={styles.heroDesc}>{recipe.description}</p>
            )}
            <p className={styles.heroDate}>Published {formatDate(recipe.publishedAt)}</p>
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────── */}
      <div className="container">
        <div className={styles.body}>

          {/* ── Sidebar: Ingredients ────────────────────── */}
          <aside className={styles.sidebar} aria-label="Ingredients">
            <div className={styles.sidebarInner}>
              <h2 className={styles.sidebarTitle}>Ingredients</h2>
              {recipe.ingredients.map((group, gi) => (
                <div key={gi} className={styles.ingredientGroup}>
                  {group.group && (
                    <p className={styles.groupLabel}>{group.group}</p>
                  )}
                  <ul className={styles.ingredientList}>
                    {group.items.map((item, ii) => (
                      <li key={ii} className={styles.ingredientItem}>
                        <span className={styles.ingredientDot} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Main: Instructions ──────────────────────── */}
          <div className={styles.main}>
            <h2 className={styles.sectionTitle}>Instructions</h2>
            <ol className={styles.steps}>
              {recipe.instructions.map((step) => (
                <li key={step.step} className={styles.step}>
                  <div className={styles.stepNumber} aria-hidden="true">
                    {step.step}
                  </div>
                  <div className={styles.stepContent}>
                    <p className={styles.stepText}>{step.text}</p>
                    {step.image && (
                      <div className={styles.stepImageWrap}>
                        <Image
                          src={r2Url(step.image)}
                          alt={`Step ${step.step}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 600px"
                          className={styles.stepImage}
                        />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            {/* Chef's Notes */}
            {recipe.notes && (
              <div className={styles.notes}>
                <h2 className={styles.notesTitle}>Chef&apos;s Notes</h2>
                <p className={styles.notesText}>{recipe.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Gallery ──────────────────────────────────────── */}
        {recipe.gallery && recipe.gallery.length > 0 && (
          <section className={styles.gallery} aria-label="Photo gallery">
            <h2 className={styles.galleryTitle}>Gallery</h2>
            <div className={styles.galleryGrid}>
              {recipe.gallery.map((key, idx) => (
                <div key={idx} className={styles.galleryItem}>
                  <Image
                    src={r2Url(key)}
                    alt={`${recipe.title} — photo ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={styles.galleryImage}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
