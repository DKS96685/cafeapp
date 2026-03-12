import { prisma } from '../../lib/prisma';
import AdminMenuManager from './AdminMenuManager';
import AdminOrderManager from './AdminOrderManager';
import AdminUserManager from './AdminUserManager';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const allItems = await prisma.menuItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const allOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { menuItem: { select: { name: true } } } },
    },
  });

  const allUsers = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Cafe Management</h1>
        <p>Manage menu items, check incoming orders, and control user access.</p>
      </header>

      <AdminMenuManager initialItems={allItems} />
      <AdminOrderManager orders={allOrders as any} />
      <AdminUserManager initialUsers={allUsers} />

    </div>
  );
}
