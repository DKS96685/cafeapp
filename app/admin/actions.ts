'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

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
