'use server';

import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { CartItem } from '../../components/CartProvider';

import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function submitOrder(items: CartItem[], totalAmount: number) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, error: 'You must be logged in to place an order.' };
    }

    if (session.user.role === 'ADMIN') {
        return { success: false, error: 'Admins cannot place orders. Please use a regular user account.' };
    }

    try {
        // 1. Create the order in the database explicitly as UNPAID
        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                totalAmount,
                status: 'PENDING',
                paymentStatus: 'UNPAID',
                items: {
                    create: items.map(item => ({
                        menuItemId: item.menuItemId,
                        quantity: item.quantity,
                        priceAtTimeOfOrder: item.price,
                    })),
                },
            },
        });

        // 2. Create Razorpay Order
        const amountInPaise = Math.round(totalAmount * 100);
        
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: order.id,
            notes: {
                userId: session.user.id
            }
        });

        // 3. Update database order with the razorpay order id for tracking
        if (razorpayOrder.id) {
             await prisma.order.update({
                 where: { id: order.id },
                 data: { razorpayOrderId: razorpayOrder.id }
             });
        }

        // Return the Razorpay Order details so the frontend can open the popup
        return { 
            success: true, 
            orderId: order.id, 
            razorpayOrderId: razorpayOrder.id,
            amount: amountInPaise,
            keyId: process.env.RAZORPAY_KEY_ID
        };
        
    } catch (error) {
        console.error('Failed to create Razorpay sequence:', error);
        return { success: false, error: 'Failed to initiate payment. Please try again.' };
    }
}

export async function verifyPayment(
    razorpayOrderId: string, 
    razorpayPaymentId: string, 
    razorpaySignature: string
) {
    try {
        const body = razorpayOrderId + "|" + razorpayPaymentId;
        
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(body.toString())
            .digest('hex');
            
        const isAuthentic = expectedSignature === razorpaySignature;
        
        if (isAuthentic) {
            // Update the order in our database
            await prisma.order.update({
                where: { razorpayOrderId: razorpayOrderId },
                data: {
                    paymentStatus: 'PAID',
                    razorpayPaymentId: razorpayPaymentId,
                    status: 'RECEIVED' // Mark as received by kitchen
                },
            });
            return { success: true };
        } else {
            return { success: false, error: 'Invalid Payment Signature' };
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        return { success: false, error: 'Internal Server Error' };
    }
}
