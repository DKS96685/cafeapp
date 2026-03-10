'use client';

import { updateOrderStatus } from './orderActions';

type OrderItemProps = {
    id: string;
    quantity: number;
    priceAtTimeOfOrder: number;
    menuItem: { name: string };
};

type OrderProps = {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
    user: { name: string | null; email: string };
    items: OrderItemProps[];
};

export default function AdminOrderManager({ orders }: { orders: OrderProps[] }) {
    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            await updateOrderStatus(orderId, newStatus);
        } catch (e) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="orders-dashboard">
            <h2>Incoming Orders</h2>

            {orders.length === 0 ? (
                <p className="no-orders">No orders yet.</p>
            ) : (
                <div className="orders-grid">
                    {orders.map((order) => (
                        <div key={order.id} className="admin-order-card">
                            <div className="order-header">
                                <div>
                                    <span className="order-id">#{order.id.slice(-6).toUpperCase()}</span>
                                    <p className="order-user">{order.user.name || 'User'} ({order.user.email})</p>
                                </div>
                                <select
                                    className={`status-select ${order.status.toLowerCase()}`}
                                    value={order.status}
                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                            </div>

                            <div className="order-items">
                                {order.items.map(item => (
                                    <div key={item.id} className="item-row">
                                        <span>{item.quantity}x {item.menuItem.name}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <span>Total: ₹{order.totalAmount.toFixed(2)}</span>
                                <span className="order-time">{new Date(order.createdAt).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style /* eslint-disable-next-line react/no-unknown-property */ jsx>{`
        .orders-dashboard {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .orders-dashboard h2 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: #f8fafc;
        }
        .no-orders {
          color: #94a3b8;
        }
        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        .admin-order-card {
          background: rgba(30, 41, 59, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
        }
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
        }
        .order-id {
          font-weight: 700;
          color: #f8fafc;
          display: block;
        }
        .order-user {
          color: #94a3b8;
          font-size: 0.875rem;
          margin: 0.25rem 0 0 0;
        }
        .status-select {
          background: #0f172a;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          outline: none;
          cursor: pointer;
        }
        .status-select.pending { border-color: #fbbf24; color: #fbbf24; }
        .status-select.completed { border-color: #34d399; color: #34d399; }
        .status-select.cancelled { border-color: #ef4444; color: #ef4444; }
        
        .order-items {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .item-row {
          color: #cbd5e1;
          font-size: 0.95rem;
        }
        .order-footer {
          display: flex;
          justify-content: space-between;
          color: #10b981;
          font-weight: 600;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .order-time {
          color: #94a3b8;
          font-weight: 400;
          font-size: 0.875rem;
        }
      `}</style>
        </div>
    );
}
