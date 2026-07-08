import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";

// Firebase web config. These NEXT_PUBLIC_* values are not secrets — Firebase web
// apps ship them in the client bundle by design. Access is controlled by Auth
// rules and the project's Authorized domains, not by hiding these values.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGIN_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Opens the Google sign-in popup and returns the user plus a fresh ID token.
// The ID token is sent to the server to mint an httpOnly session cookie.
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const credential = await signInWithPopup(auth, provider);
  const idToken = await credential.user.getIdToken();
  return { user: credential.user, idToken };
}

export async function signOutClient() {
  await firebaseSignOut(auth);
}
