"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOutClient } from "@/lib/firebase/client";
import styles from "../admin.module.scss";

function initials(nameOrEmail) {
  const base = (nameOrEmail || "").trim();
  if (!base) return "?";
  const parts = base.split(/[\s@.]+/).filter(Boolean);
  return (parts[0]?.[0] || "?").toUpperCase();
}

export default function AdminNav({ user }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const closeTimer = useRef(null);

  // Close when clicking outside the menu.
  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Hover open with a small close delay so the menu is easy to reach.
  function onEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function onLeave() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  async function handleLogout() {
    await fetch("/api/auth/session", { method: "DELETE" });
    await signOutClient();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className={styles.nav}>
      <div
        className={styles.avatarMenu}
        ref={menuRef}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <button
          type="button"
          className={styles.avatarButton}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          {user.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={styles.avatar}
              src={user.picture}
              alt={user.name}
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className={`${styles.avatar} ${styles.avatarFallback}`}>
              {initials(user.name || user.email)}
            </span>
          )}
        </button>

        {open && (
          <div className={styles.dropdown} role="menu">
            <div className={styles.dropdownHeader}>
              <span className={styles.dropdownName}>{user.name}</span>
              <span className={styles.dropdownEmail}>{user.email}</span>
            </div>
            <Link
              href="/admin/settings"
              className={styles.dropdownItem}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Settings
            </Link>
            <button
              type="button"
              className={`${styles.dropdownItem} ${styles.dropdownDanger}`}
              role="menuitem"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <Link href="/admin" className={styles.navBrand}>
        Dashboard
      </Link>
    </nav>
  );
}
