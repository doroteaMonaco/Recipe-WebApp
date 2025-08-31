import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { userService } from '../services/userService.js';

export const authConfig = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: 'credentials',
            credentials: {
                email: {label: 'Email', type: 'email'},
                password: {label: 'Password', type: 'password'}
            },

            async authorize(credentials){
                if(!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await userService.findforAuth(credentials.email, credentials.password);
                if(!user){
                    return null;
                }
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                if(!isPasswordValid){
                    return null;
                }
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    bio: user.bio,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                };
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.id = user.id;
            }
            return token;
        },
        async session({session, token}){
            if(token){
                session.user.id = token.id;
            }
            return session;
        },
        async signIn({user, account, profile, email}){
            if(account?.provider == 'github' || account?.provider == 'google'){
                try{
                    const existingUser = await userService.findByEmail(user.email);
                    if(!existingUser){
                        await userService.createUser({
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            bio: ''
                        });
                    }
                    return true;
                }
                catch(error){
                    console.error('SignIn Error', error);
                    return false;
                }
            }
            return true;
        }
    },
    pages: {
        signIn: '/login',
        signUp: '/signUp'
    }
};

export default NextAuth(authConfig);