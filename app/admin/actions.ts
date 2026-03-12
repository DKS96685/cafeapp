'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

export async function addMenuItem(data: FormData) {
    const name = data.get('name') as string;
    const description = data.get('description') as string;
    const price = parseFloat(data.get('price') as string);
    const dayOfWeek = data.get('dayOfWeek') as string;

    await prisma.menuItem.create({
        data: { name, description, price, dayOfWeek },
    });

    revalidatePath('/admin');
    revalidatePath('/');
}

export async function deleteMenuItem(id: string) {
    await prisma.menuItem.delete({
        where: { id },
    });

    revalidatePath('/admin');
    revalidatePath('/');
}

export async function updateMenuItemPrice(id: string, price: number) {
    await prisma.menuItem.update({
        where: { id },
        data: { price },
    });

    revalidatePath('/admin');
    revalidatePath('/');
}

export async function updateUserRole(userId: string, newRole: string) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        return { success: false, error: 'Unauthorized. Only admins can change user roles.' };
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
        });
        
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to update user role:', error);
        return { success: false, error: 'Database error occurred while updating role.' };
    }
}
