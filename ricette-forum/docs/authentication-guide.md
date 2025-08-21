# Guida Autenticazione - Recipe Forum

## 🔐 NextAuth.js con JWT Strategy

### Configurazione Scelta
- **Session Strategy**: JWT (cookie-based)
- **Login Types**: Locale (email+password) + Social (GitHub, Google)
- **Session Storage**: Cookie del browser (non database)

---

## 📊 Schema Database

### User Table
```sql
users {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String?  -- Opzionale: null per social, required per locale
  name      String?
  image     String?
  bio       String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Account Table (Solo per Social Login)
```sql
accounts {
  id                String  @id @default(cuid())
  userId            String
  provider          String  -- "github" o "google"
  providerAccountId String  -- ID utente su GitHub/Google
  access_token      String? -- Token per chiamare API GitHub/Google
  refresh_token     String? -- Per rinnovare token scaduti
  expires_at        Int?
  -- altri campi OAuth...
}
```

---

## 🎯 Come Funziona

### Login con Credenziali Locali (email + password)
1. **Database**:
   ```sql
   -- Tabella User
   email: "mario@gmail.com"
   password: "$2b$10$hashedPassword..."
   
   -- Tabella Account
   ❌ NESSUN RECORD (non serve!)
   ```

2. **Cookie JWT**:
   ```json
   {
     "userId": "user_abc123",
     "email": "mario@gmail.com",
     "name": "Mario Rossi",
     "exp": 1234567890
   }
   ```

### Login Social (GitHub/Google)
1. **Database**:
   ```sql
   -- Tabella User
   email: "mario@gmail.com"
   password: null
   
   -- Tabella Account
   provider: "github"
   access_token: "gho_abc123..."  ← Per chiamare API GitHub
   refresh_token: "ghr_def456..." ← Per rinnovare token
   ```

2. **Cookie JWT**:
   ```json
   {
     "userId": "user_abc123", 
     "email": "mario@gmail.com",
     "name": "Mario Rossi",
     "image": "https://github.com/avatar.jpg",
     "exp": 1234567890
   }
   ```

---

## 🔑 Tipi di Token

### 1. JWT Session Token (NextAuth.js)
- **Dove**: Cookie del browser
- **Contiene**: Dati sessione utente (id, email, name)
- **Scopo**: Autenticazione nell'app
- **Storage**: ❌ NON nel database

### 2. OAuth Provider Tokens (GitHub/Google)
- **Dove**: Database (tabella Account)
- **Contiene**: access_token, refresh_token
- **Scopo**: Chiamare API di GitHub/Google
- **Storage**: ✅ Nel database

---

## 💡 Esempi Pratici

### Verificare se utente è autenticato
```javascript
// pages/api/recipes/create.js
import { getServerSession } from "next-auth"

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ error: "Not authenticated" })
  }
  
  // session.user.id disponibile per creare ricetta
}
```

### Usare token GitHub per sincronizzare avatar
```javascript
// Esempio: aggiornare foto profilo da GitHub
const account = await prisma.account.findFirst({
  where: { 
    userId: session.user.id, 
    provider: "github" 
  }
})

if (account?.access_token) {
  const response = await fetch("https://api.github.com/user", {
    headers: { 
      Authorization: `Bearer ${account.access_token}` 
    }
  })
  
  const githubUser = await response.json()
  
  // Aggiorna avatar utente
  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: githubUser.avatar_url }
  })
}
```

---

## ⚙️ Configurazione NextAuth.js

### Struttura File
```
app/api/auth/[...nextauth]/route.js
```

### Configurazione Base
```javascript
import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    // Login Locale
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Logica verifica email + password
        // Ritorna user object o null
      }
    }),
    
    // Login Social
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  
  session: {
    strategy: "jwt", // ← IMPORTANTE: usa JWT non database
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      // Personalizza JWT token
      if (user) {
        token.userId = user.id
      }
      return token
    },
    
    async session({ session, token }) {
      // Personalizza session object
      session.user.id = token.userId
      return session
    }
  }
}

export default NextAuth(authOptions)
```

---

## 🚀 Prossimi Passi

1. **Applicare Schema Prisma**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

2. **Configurare NextAuth.js** con providers

3. **Creare pagine**:
   - `/auth/signin` - Login
   - `/auth/signup` - Registrazione
   - `/profile` - Profilo utente

4. **Implementare API routes** per autenticazione

---

## 📝 Note Importanti

- ✅ Account table serve SOLO per social login
- ✅ Password opzionale nel User (null per social)
- ✅ JWT contiene session, non salvato in DB
- ✅ OAuth tokens salvati per chiamare API esterne
- ❌ NO Session table needed con JWT strategy
- ❌ NO VerificationToken table needed con JWT strategy

---

*Ultima modifica: 21 Agosto 2025*
