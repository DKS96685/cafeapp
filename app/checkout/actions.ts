'use server';

import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { CartItem } from '../../components/CartProvider';

export async function submitOrder(items: CartItem[], totalAmount: number) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, error: 'You must be logged in to place an order.' };
    }

    try {
        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                totalAmount,
                status: 'PENDING',
                items: {
                    create: items.map(item => ({
                        menuItemId: item.menuItemId,
                        quantity: item.quantity,
                        priceAtTimeOfOrder: item.price,
                    })),
                },
            },
        });

        return { success: true, orderId: order.id };
    } catch (error) {
        console.error('Failed to create order:', error);
        return { success: false, error: 'Failed to place order. Please try again.' };
    }
}
