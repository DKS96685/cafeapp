# Cafe App ☕️

Welcome to the **Cafe Web Application** – your one-stop digital solution for ordering from our dynamic daily menu, all accompanied by an immersive 3D experience!

---

## 🌟 Welcome to Our Virtual Cafe! (Humanized Overview)

Imagine walking into a sleek, modern cafe, but right from your screen. This application brings that cozy, premium coffee shop vibe directly to your device. We’ve designed an experience where you can seamlessly browse our daily, ever-changing menu, see mouth-watering descriptions, and place your order in just a few clicks. 

Our goal is not just to provide a platform to buy coffee or pastries, but to offer a visually stunning, responsive, and delightful journey from the moment you log in (using your Google account) to the satisfying moment your payment is confirmed. Whether you’re quickly grabbing your usual or exploring our rotating daily specials, this app is built to make your cafe experience faster, more intuitive, and a lot more fun.

---

## 🚀 Features

### Customer Experience
- **Dynamic Daily Menu:** A curated menu that rotates based on the day of the week, ensuring fresh offerings every day.
- **Immersive 3D UI:** Interactive 3D elements powered by React Three Fiber and Spline for a premium visual experience.
- **Seamless Ordering:** Add items to your cart and place orders instantly.
- **Secure Authentication:** Easy and secure login using Google OAuth.
- **Smooth Payments:** Integrated Razorpay checkout for fast, reliable transaction processing.

### Administrator Capabilities
- **Menu Management:** Admins can effortlessly add, update, or remove menu items and set their availability by day.
- **Order Tracking:** Real-time visibility into customer orders to prepare and fulfill them efficiently.
- **Secure Access:** Dedicated Admin Panel restricted only to authorized personnel.

---

## 🛠 Tech Stack

Our application is built using modern, bleeding-edge web technologies to ensure performance, security, and scalability:

- **Framework:** [Next.js](https://nextjs.org/) (v16+) with React 19 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite
- **ORM:** [Prisma](https://www.prisma.io/) 
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (OAuth & Prisma Adapter)
- **Payments:** [Razorpay](https://razorpay.com/)
- **3D Graphics:** [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/getting-started/introduction), [@splinetool](https://spline.design/)

---

## 📁 Project Structure

```
cafe-webapp/
├── app/                  # Next.js App Router (pages, layouts, api routes)
│   ├── api/              # API endpoints (Auth, Razorpay, Seed, etc.)
│   ├── admin/            # Secure Admin Panel routes
│   ├── checkout/         # Payment and checkout flow
│   └── orders/           # User order history
├── components/           # Reusable React components (UI, 3D Canvas, Cart)
├── prisma/               # Prisma schema and SQLite database
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

---

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "cafe app"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables Configuration

Create a `.env` file in the root directory. You can use `.env.example` as a template if available. You will need the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_SECRET="your_super_secret_string"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth Credentials (for Authentication)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Admin Setup
ADMIN_EMAIL="your_email@domain.com" # The email that will automatically receive ADMIN privileges

# Razorpay Credentials (for Payments)
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

### 4. Database Setup (Prisma)

Initialize the SQLite database and run migrations to create the required tables:

```bash
npx prisma generate
npx prisma db push
```

*(Optional)* Seed the database with initial menu items:
```bash
# You can trigger the /api/seed endpoint or run a custom seed script if configured
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🗄️ Database Models Overview

- **User**: Handles authentication and role-based access (`USER` or `ADMIN`).
- **Account / Session**: Managed automatically by NextAuth for OAuth integration.
- **MenuItem**: Stores product details (name, price, description) and attributes like `dayOfWeek`.
- **Order**: Tracks customer checkout sessions, including total amounts and Razorpay transaction IDs.
- **OrderItem**: Acts as the junction between Orders and MenuItems, recording quantities and historical prices.

---
*Built with ❤️ for a better food experience.*
