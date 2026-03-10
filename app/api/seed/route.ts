import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const adminPassword = await bcrypt.hash('admin123', 10);
        const userPassword = await bcrypt.hash('user123', 10);

        // use upsert so we don't fail if they exist
        await prisma.user.upsert({
            where: { email: 'admin@cafe.com' },
            update: {},
            create: {
                email: 'admin@cafe.com',
                name: 'Admin User',
                password: adminPassword,
                role: 'ADMIN',
            },
        });

        await prisma.user.upsert({
            where: { email: 'user@cafe.com' },
            update: {},
            create: {
                email: 'user@cafe.com',
                name: 'Normal User',
                password: userPassword,
                role: 'USER',
            },
        });

        const menuItems = [
            { name: 'Monday Macchiato', description: 'A strong start to the week', price: 4.5, dayOfWeek: 'Monday' },
            { name: 'Tuesday Tiramisu', description: 'Sweet treats for Tuesday', price: 6.0, dayOfWeek: 'Tuesday' },
            { name: 'Wednesday Waffles', description: 'Mid-week energy boost', price: 8.5, dayOfWeek: 'Wednesday' },
            { name: 'Thursday Tea', description: 'Calming herbal blend', price: 3.5, dayOfWeek: 'Thursday' },
            { name: 'Friday Frappe', description: 'Celebrate the weekend early', price: 5.5, dayOfWeek: 'Friday' },
            { name: 'Saturday Smoothie', description: 'Healthy and refreshing', price: 6.5, dayOfWeek: 'Saturday' },
            { name: 'Sunday Sundae', description: 'Relaxing weekend treat', price: 7.0, dayOfWeek: 'Sunday' },
        ];

        for (const item of menuItems) {
            await prisma.menuItem.create({
                data: item,
            });
        }

        return NextResponse.json({ message: 'Seeded successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
