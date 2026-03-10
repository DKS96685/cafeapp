import { prisma } from '../../lib/prisma';
import AdminMenuManager from './AdminMenuManager';
import AdminOrderManager from './AdminOrderManager';

export const revalidate = 0;

export default async function AdminPage() {
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

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Cafe Menu Management</h1>
        <p>Manage your daily rotating menu items and check incoming orders.</p>
      </header>

      <AdminMenuManager initialItems={allItems} />
      <AdminOrderManager orders={allOrders as any} />

    </div>
  );
}
