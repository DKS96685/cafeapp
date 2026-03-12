'use client';

import { useCart } from '../../components/CartProvider';
import { submitOrder, verifyPayment } from './actions';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Add razorpay type to window
declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const { items, totalAmount, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    // Load Razorpay Script seamlessly
    useEffect(() => {
        const loadScript = () => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        };
        loadScript();
    }, []);

    if (status === 'loading') {
        return <div className="checkout-container"><h2>Loading...</h2></div>;
    }

    if (session?.user?.role === 'ADMIN') {
        return (
            <div className="checkout-container">
                <h2>Admins Cannot Order</h2>
                <p style={{ textAlign: 'center', marginBottom: '2rem' }}>As an administrator, your account is restricted to managing the menu and viewing orders. To place a test order, please log out and use a regular user account.</p>
                <button onClick={() => router.push('/')} className="back-btn">Return to Home</button>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="checkout-container">
                <h2>Your cart is empty</h2>
                <button onClick={() => router.push('/')} className="back-btn">Go back to menu</button>
            </div>
        );
    }

    const handleCheckout = async () => {
        setLoading(true);
        setError('');

        if (!window.Razorpay) {
            setError('Razorpay SDK failed to load. Please check your connection.');
            setLoading(false);
            return;
        }

        // 1. Create order on the backend
        const result = await submitOrder(items, totalAmount);

        if (!result.success || !result.razorpayOrderId) {
            setError(result.error || 'Failed to initialize payment.');
            setLoading(false);
            return;
        }

        // 2. Initialize Razorpay Checkout Options
        const options = {
            key: result.keyId, // The public key passed from backend
            amount: result.amount, 
            currency: 'INR',
            name: 'Cafe App',
            description: 'Delicious Food Order',
            order_id: result.razorpayOrderId,
            handler: async function (response: any) {
                // 3. User paid successfully on the popup! Verify the signature on our backend.
                setLoading(true);
                const verificationResult = await verifyPayment(
                    response.razorpay_order_id,
                    response.razorpay_payment_id,
                    response.razorpay_signature
                );

                if (verificationResult.success) {
                    // Navigate to success
                    router.push('/checkout/success');
                } else {
                    setError('Payment verification failed.');
                    setLoading(false);
                    router.push('/checkout/cancel');
                }
            },
            prefill: {
                name: session?.user?.name || '',
                email: session?.user?.email || '',
            },
            theme: {
                color: '#8b5cf6',
            },
            modal: {
                ondismiss: function() {
                    setLoading(false);
                    setError('Payment window closed. Your order was saved but remains unpaid.');
                }
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response: any) {
            setError(response.error.description);
            setLoading(false);
            router.push('/checkout/cancel');
        });
        
        paymentObject.open();
    };

    return (
        <div className="checkout-container">
            <h2>Review Your Order</h2>

            <div className="checkout-items">
                {items.map(item => (
                    <div key={item.menuItemId} className="checkout-item">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <div className="checkout-total">
                <strong>Total Amount:</strong>
                <strong>₹{totalAmount.toFixed(2)}</strong>
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button
                className="place-order-btn"
                onClick={handleCheckout}
                disabled={loading}
            >
                {loading ? 'Processing...' : 'Place Order'}
            </button>

            <style /* eslint-disable-next-line react/no-unknown-property */ jsx>{`
        .checkout-container {
          max-width: 600px;
          margin: 4rem auto;
          padding: 2rem;
          background: rgba(30, 41, 59, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #f8fafc;
        }
        .checkout-container h2 {
          text-align: center;
          margin-top: 0;
          margin-bottom: 2rem;
        }
        .checkout-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .checkout-item {
          display: flex;
          justify-content: space-between;
          padding-bottom: 1rem;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
        }
        .checkout-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.25rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: rgba(139, 92, 246, 0.1);
          border-radius: 8px;
        }
        .error-msg {
          color: #ef4444;
          text-align: center;
          margin-bottom: 1rem;
        }
        .place-order-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(to right, #10b981, #3b82f6);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .place-order-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        .place-order-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .back-btn {
          display: block;
          margin: 0 auto;
          padding: 0.75rem 1.5rem;
          background: transparent;
          color: #8b5cf6;
          border: 1px solid #8b5cf6;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
}
