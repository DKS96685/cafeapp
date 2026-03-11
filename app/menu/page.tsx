import { prisma } from '../../lib/prisma';
import Link from 'next/link';
import AddToCartButton from '../../components/AddToCartButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import '../../app/globals.css';
import './menu.css';

export const revalidate = 0; // Dynamic rendering

export default async function MenuPage() {
    const allItems = await prisma.menuItem.findMany();
    const session = await getServerSession(authOptions);

    // Group items by Day
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Everyday'];
    const groupedItems: Record<string, typeof allItems> = {};

    days.forEach(day => {
        groupedItems[day] = allItems.filter(item => item.dayOfWeek === day);
    });

    return (
        <>
            <div className="app-background"></div>

            <nav className="navbar">
                <Link href="/" className="nav-brand">Cafe DK</Link>
                <div className="nav-links">
                    <Link href="/">Home</Link>
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

            <main className="menu-page-container">
                <h1 className="page-title">Our Full Menu</h1>

                {days.map(day => (
                    groupedItems[day].length > 0 && (
                        <div key={day} className="day-section">
                            <h2 className="day-title">{day}</h2>
                            <div className="menu-grid">
                                {groupedItems[day].map(item => (
                                    <div key={item.id} className="menu-card">
                                        {item.imageUrl && (
                                            <div className="menu-image-container">
                                                <img src={item.imageUrl} alt={item.name} className="menu-image" />
                                            </div>
                                        )}
                                        <div className="menu-content">
                                            <h3>{item.name}</h3>
                                            <p>{item.description}</p>
                                            <span className="price">₹{item.price.toFixed(2)}</span>
                                            <AddToCartButton item={item} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </main>
        </>
    );
}
