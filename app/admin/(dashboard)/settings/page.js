import styles from "../../admin.module.scss";

export const metadata = { title: "Settings — Admin" };

export default function SettingsPage() {
  return (
    <section className={styles.panel}>
      <h1 className={styles.panelTitle}>Settings</h1>
      <p className={styles.muted}>
        Settings will live here. Placeholder for now — account preferences, blog
        defaults, and integrations are coming soon.
      </p>
    </section>
  );
}
