"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostEditor from "./post-editor";
import PostList from "./post-list";
import { deletePost } from "./actions";
import styles from "../admin.module.scss";

// Coordinates the editor and the list: selecting a post loads it into the
// editor; saving or deleting refreshes the server-rendered post data.
export default function BlogAdmin({ initialPosts }) {
  const router = useRouter();
  const [editing, setEditing] = useState(null);

  function handleSaved() {
    setEditing(null);
    router.refresh();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    const res = await deletePost(id);
    if (res.ok) {
      if (editing?.id === id) setEditing(null);
      router.refresh();
    } else {
      alert(res.error || "Could not delete.");
    }
  }

  return (
    <div className={styles.blogGrid}>
      <PostEditor
        key={editing?.id || "new"}
        editing={editing}
        onSaved={handleSaved}
        onCancel={() => setEditing(null)}
      />
      <PostList
        posts={initialPosts}
        editingId={editing?.id || null}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
    </div>
  );
}
