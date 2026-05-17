import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAllRecipes } from "@/lib/recipes";
import { formatDate } from "@/lib/utils";
import styles from "../admin.module.css";
import AdminNavbar from "../AdminNavbar";
import FeaturedToggle from "./FeaturedToggle";

export const metadata = { title: "Dashboard — Admin" };

export default async function DashboardPage() {
  await requireAdmin();
  const recipes = await getAllRecipes();

  return (
    <>
      <AdminNavbar />
      <div className={styles.adminPage}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Recipes</h1>
          <Link href="/admin/recipes/new" className={styles.btnPrimary} id="add-recipe-btn">
            + Add Recipe
          </Link>
        </div>

        {recipes.length === 0 ? (
          <div className={styles.emptyDash}>
            <p>No recipes yet. Add your first one above.</p>
          </div>
        ) : (
          <div className={styles.recipeTable}>
            <div className={styles.tableHeader}>
              <span className={styles.tableHeaderCell}>Recipe</span>
              <span className={styles.tableHeaderCell}>Published</span>
              <span className={styles.tableHeaderCell}>Featured</span>
              <span className={styles.tableHeaderCell}>Actions</span>
            </div>
            {recipes.map((recipe) => (
              <div key={recipe._id} className={styles.tableRow}>
                <div>
                  <p className={styles.recipeName}>{recipe.title}</p>
                  <p className={styles.recipeSlug}>{recipe.slug}</p>
                </div>
                <span className={styles.recipeDate}>
                  {formatDate(recipe.publishedAt)}
                </span>
                <FeaturedToggle slug={recipe.slug} featured={recipe.featured ?? false} />
                <div className={styles.tableActions}>
                  <Link
                    href={`/admin/recipes/${recipe.slug}/edit`}
                    className={styles.btnSecondary}
                    id={`edit-${recipe.slug}`}
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/recipes/${recipe.slug}`}
                    className={styles.btnSecondary}
                    target="_blank"
                    id={`view-${recipe.slug}`}
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
