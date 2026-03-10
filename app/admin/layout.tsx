import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import "../globals.css"; // Ensure globals are applied if not inherited, though they usually are

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <div className="admin-brand">Admin Dashboard</div>
        <div className="admin-links">
          <Link href="/">Back to Cafe</Link>
          <Link href="/api/auth/signout" className="logout-btn">Logout</Link>
        </div>
      </nav>
      <main className="admin-content">{children}</main>

    </div>
  );
}
