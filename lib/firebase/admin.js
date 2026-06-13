import "server-only";
import { cookies } from "next/headers";
import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export const SESSION_COOKIE = "__session";
const SESSION_EXPIRES_MS = 60 * 60 * 24 * 5 * 1000; // 5 days

function adminEmail() {
  return (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
}

// Service-account values are often pasted straight from the JSON key file,
// dragging along the wrapping double-quotes and trailing commas. Strip those
// so cert() receives a clean client email and a parseable PEM.
function cleanEnv(value) {
  if (!value) return value;
  let s = value.trim().replace(/,+$/, "").trim();
  s = s.replace(/^"+/, "").replace(/"+$/, "");
  return s.trim();
}

function getAdminApp() {
  if (getApps().length) return getApp();
  // Note: the env var is currently named FREBASE_PRIVATE_KEY (typo) — read both.
  const privateKey = cleanEnv(
    process.env.FIREBASE_PRIVATE_KEY || process.env.FREBASE_PRIVATE_KEY || ""
  ).replace(/\\n/g, "\n");

  return initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      clientEmail: cleanEnv(process.env.FIREBASE_CLIENT_EMAIL),
      privateKey,
    }),
  });
}

function adminAuth() {
  return getAuth(getAdminApp());
}

// Firestore handle (server-side, privileged — bypasses security rules).
export function getDb() {
  return getFirestore(getAdminApp());
}

// Verifies a Google ID token, enforces the single-admin email allow-list, and
// returns a minted session cookie. Returns null if the account is not the admin.
export async function createSessionCookie(idToken) {
  const auth = adminAuth();
  const decoded = await auth.verifyIdToken(idToken, true);
  if (
    !decoded.email_verified ||
    !decoded.email ||
    decoded.email.toLowerCase() !== adminEmail()
  ) {
    return null;
  }
  const cookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRES_MS,
  });
  return { cookie, maxAge: SESSION_EXPIRES_MS / 1000 };
}

// Server-side gate for /admin routes. Reads the session cookie, verifies it
// (checking revocation), re-checks the admin email, and returns the decoded
// claims — or null if the request is not an authenticated admin.
export async function requireAdmin() {
  const store = await cookies();
  const sessionCookie = store.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;
  try {
    const decoded = await adminAuth().verifySessionCookie(sessionCookie, true);
    if (!decoded.email || decoded.email.toLowerCase() !== adminEmail()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}
