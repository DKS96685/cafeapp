'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItem = {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
};

type CartContextType = {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (menuItemId: string) => void;
    clearCart: () => void;
    totalAmount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('cafe-cart');
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse cart');
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('cafe-cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
        setItems(current => {
            const existing = current.find(i => i.menuItemId === newItem.menuItemId);
            if (existing) {
                return current.map(i =>
                    i.menuItemId === newItem.menuItemId ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...current, { ...newItem, quantity: 1 }];
        });
    };

    const removeFromCart = (menuItemId: string) => {
        setItems(current => current.filter(i => i.menuItemId !== menuItemId));
    };

    const clearCart = () => setItems([]);

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
