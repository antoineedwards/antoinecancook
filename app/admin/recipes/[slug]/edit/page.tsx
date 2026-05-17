import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getRecipeBySlug } from "@/lib/recipes";
import AdminNavbar from "../../../AdminNavbar";
import RecipeForm from "../../RecipeForm";
import styles from "../../../admin.module.css";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();

  return (
    <>
      <AdminNavbar />
      <div className={styles.adminPage}>
        <div className={styles.pageHeader}>
          <Link href="/admin/dashboard" className={styles.btnSecondary} id="back-to-dashboard">
            ← Dashboard
          </Link>
          <h1 className={styles.pageTitle}>Edit Recipe</h1>
        </div>
        <RecipeForm mode="edit" recipe={recipe} />
      </div>
    </>
  );
}
