import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				try {
					if (!credentials?.email || !credentials?.password) return null;

					  const base = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
					  const res = await fetch(`${base.replace(/\/$$/, '')}/api/v1/auth/login`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ email: credentials.email, password: credentials.password }),
					});

					if (!res.ok) return null;

					const data = await res.json();

					return {
						id: String(data.user.id),
						email: data.user.email,
						role: data.user.role,
						accessToken: data.token,
					} as any;
				} catch (error) {
					console.error('Auth error:', error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }: any) {
			if (user) {
				token.accessToken = user.accessToken;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }: any) {
			// @ts-ignore
			session.user = session.user ?? {};
			// @ts-ignore
			session.user.role = token.role as string;
			// @ts-ignore
			session.accessToken = token.accessToken as string;
			return session;
		},
	},
	pages: {
		signIn: '/login',
	},
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
};
