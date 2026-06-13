import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/firebase/admin";
import AdminNav from "./admin-nav";
import styles from "../admin.module.scss";

// Server-side guard for every route in the (dashboard) group. Verification runs
// in the Node runtime on each request, so /admin cannot be reached by editing
// client state or reading the bundle. The /admin/login route lives outside this
// group and stays public.
export default async function DashboardLayout({ children }) {
  const session = await requireAdmin();
  if (!session) {
    redirect("/admin/login");
  }

  const user = {
    email: session.email,
    name: session.name || session.email,
    picture: session.picture || null,
  };

  return (
    <div className={styles.shell}>
      <AdminNav user={user} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
