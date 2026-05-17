"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

interface NavDropdownProps {
  label: string;
  id: string;
  links: { href: string; label: string }[];
  emptyMessage?: string;
}

function ChevronDownIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className={styles.chevron}
      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function NavDropdown({ label, id, links, emptyMessage = "Add items" }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className={styles.navItem} ref={dropdownRef}>
      <button
        className={styles.navDropdownTrigger}
        aria-haspopup="true"
        aria-expanded={isOpen}
        id={id}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {label}
        <ChevronDownIcon isOpen={isOpen} />
      </button>

      <div
        className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ""}`}
        role="menu"
        aria-labelledby={id}
      >
        {links.length > 0 ? (
          links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.dropdownLink}
              role="menuitem"
            >
              {link.label}
            </Link>
          ))
        ) : (
          <span className={styles.dropdownEmpty}>{emptyMessage}</span>
        )}
      </div>
    </div>
  );
}
