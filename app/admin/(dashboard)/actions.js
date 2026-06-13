"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { requireAdmin, getDb } from "@/lib/firebase/admin";

const COLLECTION = "posts";
const VALID_STATUS = new Set(["draft", "published"]);

// Save a new post or update an existing one. Every call re-verifies the admin
// session server-side, so the editor UI alone can never write to Firestore.
export async function savePost(input) {
  const session = await requireAdmin();
  if (!session) {
    return { ok: false, error: "Not authorized." };
  }

  const title = (input?.title || "").trim();
  const html = (input?.html || "").trim();
  const status = VALID_STATUS.has(input?.status) ? input.status : "draft";

  if (!title) return { ok: false, error: "Title is required." };
  if (!html || html === "<p></p>") {
    return { ok: false, error: "Post body is empty." };
  }

  const db = getDb();
  const now = FieldValue.serverTimestamp();

  try {
    if (input?.id) {
      await db.collection(COLLECTION).doc(input.id).set(
        { title, html, status, updatedAt: now },
        { merge: true }
      );
      revalidatePath("/admin");
      return { ok: true, id: input.id };
    }

    const ref = await db.collection(COLLECTION).add({
      title,
      html,
      status,
      authorEmail: session.email,
      createdAt: now,
      updatedAt: now,
    });
    revalidatePath("/admin");
    return { ok: true, id: ref.id };
  } catch (err) {
    return { ok: false, error: "Could not save. Is Firestore enabled?" };
  }
}

export async function deletePost(id) {
  const session = await requireAdmin();
  if (!session) {
    return { ok: false, error: "Not authorized." };
  }
  if (!id) return { ok: false, error: "Missing post id." };

  try {
    await getDb().collection(COLLECTION).doc(id).delete();
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: "Could not delete." };
  }
}
