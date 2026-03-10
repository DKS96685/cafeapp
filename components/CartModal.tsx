'use client';

import { useCart } from './CartProvider';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartModal() {
    const { items, removeFromCart, totalAmount, clearCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const handleCheckout = () => {
        setIsOpen(false);
        router.push('/checkout');
    };

    return (
        <>
            <button
                className="cart-toggle-btn"
                onClick={() => setIsOpen(true)}
                aria-label="Open Cart"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>

            {isOpen && (
                <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
                    <div className="cart-modal" onClick={e => e.stopPropagation()}>
                        <div className="cart-header">
                            <h2>Your Order</h2>
                            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                        </div>

                        <div className="cart-items">
                            {items.length === 0 ? (
                                <p className="empty-cart">Your cart is feeling a bit empty.</p>
                            ) : (
                                items.map(item => (
                                    <div key={item.menuItemId} className="cart-item">
                                        <div className="item-info">
                                            <h4>{item.name}</h4>
                                            <p>₹{item.price.toFixed(2)} x {item.quantity}</p>
                                        </div>
                                        <div className="item-actions">
                                            <span className="item-total">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            <button onClick={() => removeFromCart(item.menuItemId)} className="remove-btn">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="cart-footer">
                                <div className="cart-total">
                                    <span>Total:</span>
                                    <span>₹{totalAmount.toFixed(2)}</span>
                                </div>
                                <button className="checkout-btn" onClick={handleCheckout}>
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style /* eslint-disable-next-line react/no-unknown-property */ jsx>{`
        .cart-toggle-btn {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 90;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          transition: transform 0.2s, background 0.2s;
        }
        .cart-toggle-btn:hover {
          transform: scale(1.05);
          background: rgba(15, 23, 42, 0.9);
        }
        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(2, 6, 23, 0.6);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .cart-modal {
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          width: 100%;
          max-width: 450px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease-out forwards;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cart-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .cart-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }
        .close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 2rem;
          cursor: pointer;
          line-height: 1;
        }
        .close-btn:hover {
          color: white;
        }

        .cart-items {
          padding: 1.5rem;
          overflow-y: auto;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .empty-cart {
          text-align: center;
          color: #94a3b8;
          padding: 2rem 0;
        }
        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.05);
        }
        .item-info h4 {
          margin: 0 0 0.25rem 0;
        }
        .item-info p {
          margin: 0;
          color: #94a3b8;
          font-size: 0.875rem;
        }
        .item-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }
        .item-total {
          font-weight: 600;
          color: #10b981;
        }
        .remove-btn {
          background: transparent;
          border: none;
          color: #ef4444;
          font-size: 0.75rem;
          cursor: pointer;
          padding: 0;
        }
        .remove-btn:hover {
          text-decoration: underline;
        }

        .cart-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(30, 41, 59, 0.5);
          border-bottom-left-radius: 24px;
          border-bottom-right-radius: 24px;
        }
        .cart-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }
        .checkout-btn {
          width: 100%;
          background: linear-gradient(to right, #8b5cf6, #ec4899);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .checkout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(139, 92, 246, 0.6);
        }
      `}</style>
        </>
    );
}
