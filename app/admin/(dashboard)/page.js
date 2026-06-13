import { getDb } from "@/lib/firebase/admin";
import BlogAdmin from "./blog-admin";
import styles from "../admin.module.scss";

export const metadata = { title: "Admin" };

// Always render fresh data (Firestore reads happen per request).
export const dynamic = "force-dynamic";

// Format on the server with a fixed timezone so the string is identical on
// server render and client hydration (no locale/timezone mismatch).
const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function toDisplay(ts) {
  if (!ts || typeof ts.toMillis !== "function") return "";
  return DATE_FMT.format(new Date(ts.toMillis()));
}

async function loadPosts() {
  try {
    const snap = await getDb()
      .collection("posts")
      .orderBy("updatedAt", "desc")
      .get();
    const posts = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        title: d.title || "",
        html: d.html || "",
        status: d.status || "draft",
        updatedDisplay: toDisplay(d.updatedAt),
      };
    });
    return { posts, ready: true };
  } catch (err) {
    // Most likely the Firestore database has not been created yet.
    return { posts: [], ready: false };
  }
}

export default async function AdminPage() {
  const { posts, ready } = await loadPosts();

  return (
    <section className={styles.panel}>
      <h1 className={styles.panelTitle}>Write a post</h1>
      {!ready && (
        <p className={styles.notice}>
          Firestore is not reachable yet. In the Firebase Console go to Build →
          Firestore Database → Create database (Native mode), then reload.
        </p>
      )}
      <BlogAdmin initialPosts={posts} />
    </section>
  );
}
