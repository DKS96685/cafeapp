import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import '../../app/globals.css';

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

            <style /* eslint-disable-next-line react/no-unknown-property */ jsx>{`
        .orders-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 6rem 2rem 2rem;
          color: #f8fafc;
        }
        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 2rem;
          background: linear-gradient(to right, #60a5fa, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: rgba(30, 41, 59, 0.5);
          border-radius: 20px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
        }
        .empty-state p {
          color: #94a3b8;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
        .primary-btn {
          display: inline-block;
          background: #8b5cf6;
          color: white;
          padding: 0.75rem 2rem;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: background 0.2s;
        }
        .primary-btn:hover {
          background: #7c3aed;
        }
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .order-card {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
        }
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .order-id {
          display: block;
          font-weight: 700;
          font-size: 1.2rem;
          margin-bottom: 0.25rem;
        }
        .order-date {
          display: block;
          color: #94a3b8;
          font-size: 0.875rem;
        }
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .status-badge.pending {
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.5);
        }
        .status-badge.completed {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.5);
        }
        .status-badge.cancelled {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.5);
        }
        .order-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .order-item-row {
          display: flex;
          justify-content: space-between;
          color: #cbd5e1;
        }
        .order-footer {
          display: flex;
          justify-content: space-between;
          padding-top: 1rem;
          border-top: 1px dashed rgba(255, 255, 255, 0.1);
          font-size: 1.25rem;
          color: #10b981;
        }
      `}</style>
        </>
    );
}
