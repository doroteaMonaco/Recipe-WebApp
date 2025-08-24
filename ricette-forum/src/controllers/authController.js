import {z} from 'zod';
import { NextResponse } from 'next/server';
import { userService } from '../services/userService';
import {signIn} from 'next-auth/react';
import bcrypt from 'bcryptjs';

const registerSchema = z.object({
    email: z.string().email("Email non valida"),
    name: z.string().min(2, "Nome troppo corto").max(50, "Nome troppo lungo"),
    password: z.string().min(6, "Password troppo corta").max(20, "Password troppo lunga")
});

const loginSchema = z.object({
    email: z.string().email("Email non valida"),
    password: z.string().min(6, "Password troppo corta").max(20, "Password troppo lunga")
});

export class AuthController {
    async register(req){
        try{
            const body = await req.json();
            const data = await registerSchema.parse(body);

            const exUser = await userService.findByEmail(data.email);
            if(exUser){
                return NextResponse.json({message: 'Email già in uso'}, {status: 409});
            }

            const newUser = await userService.createUser({
                name: data.name,
                email: data.email,
                password: data.password
            });

            return NextResponse.json({
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                    createdAt: newUser.createdAt,
                }}, {status: 201});
        }
        catch(error){
            if (error instanceof z.ZodError) {
                return NextResponse.json({message: 'Dati non validi', issues: error.errors}, {status: 422});
            }
            return NextResponse.json({message: 'Errore interno'}, {status: 500});
        }
    }

    async login(req){
        try{
            const body = await req.json();
            const data = await loginSchema.parse(body);

            const exUser = await userService.findByEmail(data.email);

            if(!exUser){
                return NextResponse.json({error: 'Utente non trovato'}, {status: 404});
            }

            const isValidPassword = await bcrypt.compare(data.password, exUser.password);
            if (!isValidPassword) {
                return NextResponse.json({error: 'Password errata'}, {status: 401});
            }

            return NextResponse.json({
                message: 'Login avvenuto con successo',
                user: {
                    id: exUser.id,
                    email: exUser.email,
                    name: exUser.name,
                    createdAt: exUser.createdAt,
                }
            }, {status: 200});
        }
        catch(error){
            if (error instanceof z.ZodError) {
                return NextResponse.json({message: 'Dati non validi', issues: error.errors}, {status: 422});
            }
            return NextResponse.json({message: 'Errore interno'}, {status: 500});
        }
    }
}