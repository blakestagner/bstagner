import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionCookie, SESSION_COOKIE } from "@/lib/firebase/admin";

// firebase-admin requires the Node.js runtime (not Edge).
export const runtime = "nodejs";

// POST { idToken } -> verify the Google ID token, enforce the admin email,
// and set an httpOnly session cookie. 403 if the account is not the admin.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const idToken = body?.idToken;
  if (!idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  let result;
  try {
    result = await createSessionCookie(idToken);
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 401 });
  }

  if (!result) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, result.cookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: result.maxAge,
  });

  return NextResponse.json({ ok: true });
}

// DELETE -> clear the session cookie (logout).
export async function DELETE() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
