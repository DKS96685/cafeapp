'use client';

import { useCart } from '../components/CartProvider';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({ item }: { item: { id: string; name: string; price: number } }) {
    const { addToCart } = useCart();
    const { data: session } = useSession();
    const router = useRouter();

    const handleAddToCart = () => {
        if (!session) {
            router.push('/login');
            return;
        }
        if (session.user.role === 'ADMIN') {
            alert("Admins cannot place orders. Please use a regular user account to test ordering.");
            return;
        }
        addToCart({ menuItemId: item.id, name: item.name, price: item.price });
    };

    return (
        <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
        >
            Add to Order
            <style /* eslint-disable-next-line react/no-unknown-property */ jsx>{`
        .add-to-cart-btn {
          margin-top: 1rem;
          width: 100%;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .add-to-cart-btn:hover {
          background: rgba(16, 185, 129, 0.2);
          transform: translateY(-2px);
        }
      `}</style>
        </button>
    );
}
