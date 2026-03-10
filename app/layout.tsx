import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import CartModal from "@/components/CartModal";

export const metadata: Metadata = {
    title: "Cafe Web App",
    description: "Daily altering menu cafe application",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {children}
                    <CartModal />
                </Providers>
            </body>
        </html>
    );
}
