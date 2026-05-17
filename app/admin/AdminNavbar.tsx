"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

export default function AdminNavbar() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <nav className={styles.adminNav}>
      <Link href="/admin/dashboard" className={styles.adminNavBrand} id="admin-logo">
        <span className={styles.adminNavLogo}>Antoine Can Cook</span>
        <span className={styles.adminBadge}>Admin</span>
      </Link>
      <div className={styles.adminNavLinks}>
        <Link href="/admin/dashboard" className={styles.adminNavLink}>Recipes</Link>
      </div>
      <div className={styles.adminNavRight}>
        <Link href="/" className={styles.viewSiteLink} target="_blank">
          View site ↗
        </Link>
        <button className={styles.logoutBtn} onClick={logout} id="logout-btn">
          Sign out
        </button>
      </div>
    </nav>
  );
}
