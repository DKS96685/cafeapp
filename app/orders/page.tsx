import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import '../../app/globals.css';
import './orders.css';

export const revalidate = 0;

export default async function OrdersPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/login');
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        include: {
            items: {
                include: {
                    menuItem: true,
                },
            },
        },
    });

    return (
        <>
            <nav className="navbar">
                <Link href="/" className="nav-brand">Cafe Luma</Link>
                <div className="nav-links">
                    <Link href="/">Back to Menu</Link>
                    {session.user.role === 'ADMIN' && (
                        <Link href="/admin" className="admin-link">Admin Dashboard</Link>
                    )}
                    <Link href="/api/auth/signout" className="logout-btn">Logout</Link>
                </div>
            </nav>

            <main className="orders-container">
                <h1 className="page-title">Your Order History</h1>

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <p>You haven't placed any orders yet.</p>
                        <Link href="/" className="primary-btn">Explore Menu</Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <span className="order-id">Order #{order.id.slice(-6).toUpperCase()}</span>
                                        <span className="order-date">
                                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="order-item-row">
                                            <span>{item.quantity}x {item.menuItem.name}</span>
                                            <span>₹{(item.priceAtTimeOfOrder * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <strong>Total</strong>
                                    <strong>₹{order.totalAmount.toFixed(2)}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

        </>
    );
}
