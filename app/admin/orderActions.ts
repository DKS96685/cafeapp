'use server';

import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId: string, status: string) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Not authorized');
    }

    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to update order status:', error);
        throw new Error('Failed to update order status');
    }
}
