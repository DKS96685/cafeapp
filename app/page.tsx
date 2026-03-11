import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import { prisma } from '../lib/prisma';
import CanvasPlaceholder from '../components/CanvasPlaceholder';
import Link from 'next/link';
import AddToCartButton from '../components/AddToCartButton';

export const revalidate = 0; // Dynamic rendering to always show current day menu

async function getDailyMenu() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    const currentDayName = days[today];

    const allItems = await prisma.menuItem.findMany();

    return {
        todayItems: allItems.filter((item: { id: string; name: string; description: string; price: number; dayOfWeek: string; imageUrl: string | null; createdAt: Date; updatedAt: Date }) => item.dayOfWeek === currentDayName),
        currentDayName,
    };
}

export default async function Home() {
    const { todayItems, currentDayName } = await getDailyMenu();
    const session = await getServerSession(authOptions);

    return (
        <>
            <div className="app-background"></div>

            <nav className="navbar">
                <Link href="/" className="nav-brand">Cafe DK</Link>
                <div className="nav-links">
                    <Link href="/menu">Menu</Link>
                    <Link href="/about">About</Link>
                    {session ? (
                        <>
                            {session.user.role === 'ADMIN' && (
                                <Link href="/admin" className="admin-link">Admin Dashboard</Link>
                            )}
                            <Link href="/orders" className="orders-link">Orders</Link>
                            <Link href="/api/auth/signout" className="login-btn">Logout</Link>
                        </>
                    ) : (
                        <Link href="/login" className="login-btn">Admin/Login</Link>
                    )}
                </div>
            </nav>

            <main>
                <section className="hero">
                    <h1>Experience The Taste</h1>
                    <p>
                        Welcome to Cafe DK, where every day brings a new flavor. Discover our aesthetically crafted
                        daily menus designed to delight your senses.
                    </p>
                    <CanvasPlaceholder />
                </section>

                <section className="menu-section">
                    <h2 className="section-title">Today is {currentDayName}</h2>
                    <div className="menu-grid">
                        {todayItems.length > 0 ? (
                            todayItems.map((item: { id: string; name: string; description: string; price: number }) => (
                                <div key={item.id} className="menu-card">
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                    <span className="price">₹{item.price.toFixed(2)}</span>
                                    <AddToCartButton item={item} />
                                </div>
                            ))
                        ) : (
                            <div className="menu-card">
                                <h3>Check back soon!</h3>
                                <p>We're brewing up something special for {currentDayName}.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}
