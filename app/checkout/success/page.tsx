'use client';

import { useEffect } from 'react';
import { useCart } from '../../../components/CartProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
    const { clearCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        // Clear the cart only after a successful payment
        clearCart();
    }, []);

    return (
        <div className="success-container">
            <div className="success-card">
                <div className="icon-container">
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>
                <h2>Payment Successful!</h2>
                <p>Thank you for your order. We are preparing it now.</p>
                <div className="button-group">
                    <Link href="/orders" className="primary-btn">View My Orders</Link>
                    <Link href="/" className="secondary-btn">Return to Menu</Link>
                </div>
            </div>

            <style /* eslint-disable-next-line react/no-unknown-property */ jsx>{`
        .success-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          padding: 2rem;
        }
        .success-card {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 3rem;
          border-radius: 24px;
          text-align: center;
          max-width: 500px;
          width: 100%;
          color: #f8fafc;
          animation: slideUp 0.5s ease-out;
        }
        .icon-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .checkmark {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: block;
          stroke-width: 2;
          stroke: #10b981;
          stroke-miterlimit: 10;
          box-shadow: inset 0px 0px 0px #10b981;
          animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
        }
        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #10b981;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        @keyframes stroke {
          100% { stroke-dashoffset: 0; }
        }
        @keyframes scale {
          0%, 100% { transform: none; }
          50% { transform: scale3d(1.1, 1.1, 1); }
        }
        h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #10b981;
        }
        p {
          color: #94a3b8;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .button-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .primary-btn {
          display: block;
          padding: 1rem;
          background: linear-gradient(to right, #10b981, #059669);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          transition: transform 0.2s;
        }
        .primary-btn:hover {
          transform: translateY(-2px);
        }
        .secondary-btn {
          display: block;
          padding: 1rem;
          background: transparent;
          color: #cbd5e1;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          font-weight: 500;
          transition: background 0.2s;
        }
        .secondary-btn:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
