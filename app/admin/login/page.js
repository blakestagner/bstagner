"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signOutClient } from "@/lib/firebase/client";
import styles from "../admin.module.scss";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      const { idToken } = await signInWithGoogle();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (res.status === 403) {
        await signOutClient();
        setError("That account is not authorized.");
        return;
      }
      if (!res.ok) {
        await signOutClient();
        setError("Sign-in failed. Please try again.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      // Closing the popup is not an error worth surfacing.
      if (err?.code !== "auth/popup-closed-by-user") {
        setError("Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin</h1>
        <p className={styles.subtitle}>Sign in to continue.</p>
        <button
          className={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </main>
  );
}
