"use client";

import styles from "../admin.module.scss";

export default function PostList({ posts, editingId, onEdit, onDelete }) {
  return (
    <div className={styles.postList}>
      <h2 className={styles.listTitle}>Posts</h2>
      {!posts?.length ? (
        <p className={styles.muted}>No posts yet. Write your first one.</p>
      ) : (
        <ul className={styles.postUl}>
          {posts.map((p) => (
            <li
              key={p.id}
              className={`${styles.postItem} ${
                editingId === p.id ? styles.postItemActive : ""
              }`}
            >
              <div className={styles.postMeta}>
                <span className={styles.postName}>{p.title || "Untitled"}</span>
                <span className={styles.postSub}>
                  <span
                    className={`${styles.badge} ${
                      p.status === "published"
                        ? styles.badgePub
                        : styles.badgeDraft
                    }`}
                  >
                    {p.status}
                  </span>
                  {p.updatedDisplay}
                </span>
              </div>
              <div className={styles.postActions}>
                <button
                  type="button"
                  className={styles.smallBtn}
                  onClick={() => onEdit(p)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={`${styles.smallBtn} ${styles.smallDanger}`}
                  onClick={() => onDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
