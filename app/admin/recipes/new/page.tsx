import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import AdminNavbar from "../../AdminNavbar";
import RecipeForm from "../RecipeForm";
import styles from "../../admin.module.css";

export const metadata = { title: "New Recipe — Admin" };

export default async function NewRecipePage() {
  await requireAdmin();

  return (
    <>
      <AdminNavbar />
      <div className={styles.adminPage}>
        <div className={styles.pageHeader}>
          <Link href="/admin/dashboard" className={styles.btnSecondary} id="back-to-dashboard">
            ← Dashboard
          </Link>
          <h1 className={styles.pageTitle}>New Recipe</h1>
        </div>
        <RecipeForm mode="new" />
      </div>
    </>
  );
}
