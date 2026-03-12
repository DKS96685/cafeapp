import { NextAuthOptions } from 'next-auth';
import { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: string;
        } & DefaultSession['user'];
    }
}

export const authOptions: NextAuthOptions = {
    // @ts-ignore - Prisma Adapter type mismatch with next-auth v4 is common but works
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            profile(profile) {
                // Determine role based on email using environment variable or fallback
                // E.g. ADMIN_EMAIL="your.email@gmail.com"
                const userRole = profile.email === process.env.ADMIN_EMAIL ? 'ADMIN' : 'USER';
                
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: userRole,
                };
            },
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'user@cafe.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || (!user.password && credentials.password)) {
                    return null;
                }

                if (user.password) {
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // When user first logs in, user object is present
            if (user) {
                // @ts-ignore
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                // @ts-ignore
                session.user.role = token.role;
                session.user.id = (token.id as string) || (token.sub as string);
            }
            return session;
        },
    },
    pages: {
        signIn: '/login', 
    },
};
