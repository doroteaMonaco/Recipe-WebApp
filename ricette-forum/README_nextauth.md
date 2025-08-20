# Autenticazione con NextAuth.js in Next.js

Questa guida ti aiuta a configurare NextAuth.js per gestire l'autenticazione nel tuo progetto Next.js.

---

## 1️⃣ Installazione

```pwsh
npm install next-auth
```

---

## 2️⃣ Configurazione API route

- Se usi **Pages Router**:
  - Crea la cartella `pages/api/auth/`
  - Crea il file `pages/api/auth/[...nextauth].js`
- Se usi **App Router** (Next.js 13+):
  - Crea la cartella `app/api/auth/`
  - Crea il file `app/api/auth/[...nextauth]/route.js`

---

## 3️⃣ Esempio di configurazione base

```js
// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // Puoi aggiungere altri provider (Google, Email, ecc.)
  ],
  // Puoi aggiungere adapter per PostgreSQL, Supabase, ecc.
};

export default NextAuth(authOptions);
```

---

## 4️⃣ Variabili ambiente

Aggiungi le chiavi dei provider e del database nel file `.env.local`:
```
GITHUB_ID=tuo_client_id
GITHUB_SECRET=tuo_client_secret
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ricette
```

---

## 5️⃣ Login/Logout nella UI

Esempio di utilizzo:
```js
import { signIn, signOut, useSession } from "next-auth/react";

function AuthButtons() {
  const { data: session } = useSession();
  return session ? (
    <button onClick={() => signOut()}>Logout</button>
  ) : (
    <button onClick={() => signIn("github")}>Login con GitHub</button>
  );
}
```

---

## 6️⃣ Risorse utili
- [Documentazione NextAuth.js](https://next-auth.js.org/)
- [Provider supportati](https://next-auth.js.org/providers/)
- [Adapter per database](https://next-auth.js.org/adapters/overview)

---

## Note
- Puoi aggiungere più provider e personalizzare la logica di sessione.
- NextAuth.js supporta JWT, OAuth, email/password, social login.
- Per la produzione, configura le variabili ambiente su Vercel.
