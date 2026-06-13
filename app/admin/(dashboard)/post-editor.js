"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { savePost } from "./actions";
import styles from "../admin.module.scss";

export default function PostEditor({ editing, onSaved, onCancel }) {
  const [title, setTitle] = useState(editing?.title || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const editor = useEditor({
    // Required for SSR in the App Router to avoid hydration mismatches.
    immediatelyRender: false,
    extensions: [StarterKit.configure({ link: { openOnClick: false } })],
    content: editing?.html || "",
    editorProps: {
      attributes: { class: styles.proseInput },
    },
  });

  async function submit(status) {
    if (!editor) return;
    setError("");
    const html = editor.getHTML();
    setSaving(true);
    const res = await savePost({ id: editing?.id, title, html, status });
    setSaving(false);
    if (res.ok) {
      onSaved?.();
    } else {
      setError(res.error || "Could not save.");
    }
  }

  function addLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link")?.href || "";
    const url = window.prompt("Link URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  if (!editor) return null;

  const cls = (active) => `${styles.tbBtn} ${active ? styles.tbActive : ""}`;

  return (
    <div className={styles.editorWrap}>
      <input
        className={styles.titleInput}
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className={styles.toolbar}>
        <button type="button" className={cls(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></button>
        <button type="button" className={cls(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
        <button type="button" className={cls(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>
        <button type="button" className={cls(editor.isActive("heading", { level: 1 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        <button type="button" className={cls(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className={cls(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button type="button" className={cls(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
        <button type="button" className={cls(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</button>
        <button type="button" className={cls(editor.isActive("link"))} onClick={addLink}>Link</button>
        <span className={styles.tbSpacer} />
        <button type="button" className={styles.tbBtn} onClick={() => editor.chain().focus().undo().run()} aria-label="Undo">↺</button>
        <button type="button" className={styles.tbBtn} onClick={() => editor.chain().focus().redo().run()} aria-label="Redo">↻</button>
      </div>

      <EditorContent editor={editor} className={styles.editorScroll} />

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.editorActions}>
        {editing && (
          <span className={styles.editingBadge}>Editing “{editing.title}”</span>
        )}
        <span className={styles.tbSpacer} />
        {editing && (
          <button type="button" className={`${styles.button} ${styles.secondary}`} onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        )}
        <button type="button" className={`${styles.button} ${styles.secondary}`} onClick={() => submit("draft")} disabled={saving}>
          {saving ? "Saving…" : "Save draft"}
        </button>
        <button type="button" className={styles.button} onClick={() => submit("published")} disabled={saving}>
          {saving ? "Saving…" : "Publish"}
        </button>
      </div>
    </div>
  );
}
