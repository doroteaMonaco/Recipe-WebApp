# Guida Completa Prisma Database Setup - Recipe Forum

## 🎯 Panoramica Generale

Questa guida spiega passo per passo come creare e gestire il database del Recipe Forum usando Prisma ORM con PostgreSQL.

---

## 📋 Prerequisiti

### Software Necessario:
- ✅ **Docker** e Docker Compose (per PostgreSQL)
- ✅ **Node.js** e npm
- ✅ **Prisma CLI** (installato nel progetto)

### Servizi Esterni:
- ✅ **PostgreSQL** (locale via Docker o Supabase)
- ✅ **Redis** (per caching, opzionale)

---

## 🗄️ Comandi Prisma - Guida Completa

### **1. Preparazione Ambiente Database**

#### Comando:
```bash
docker compose up -d db redis
```

#### Spiegazione:
- **Avvia PostgreSQL** (porta 5432) e **Redis** (porta 6379) in background
- Necessario **prima** di qualsiasi operazione Prisma
- Database **vuoto** pronto per ricevere lo schema
- Flag `-d` = detached mode (background)

#### Verifica che funzioni:
```bash
docker ps  # Deve mostrare container db e redis in esecuzione
```

---

### **2. Generazione Client Prisma**

#### Comando:
```bash
npx prisma generate
```

#### Spiegazione Dettagliata:
- **Legge** il file `prisma/schema.prisma`
- **Genera** client TypeScript/JavaScript in `src/generated/prisma/`
- **Crea** tutte le funzioni type-safe per query database
- Da eseguire **sempre** dopo modifiche allo schema

#### Cosa Genera:
```javascript
// Esempio di quello che crea
import { PrismaClient } from '../src/generated/prisma'
const prisma = new PrismaClient()

// Ora puoi fare query type-safe:
const users = await prisma.user.findMany()
const recipe = await prisma.recipe.create({
  data: {
    title: "Pasta Carbonara",
    authorId: "user123"
  }
})
```

#### Output Tipico:
```
✔ Generated Prisma Client (v6.14.0) to ./src/generated/prisma in 269ms
```

#### Quando Usarlo:
- ✅ Dopo **ogni modifica** a schema.prisma
- ✅ Prima di **scrivere codice** che usa Prisma
- ✅ Durante **sviluppo** per aggiornare TypeScript types
- ✅ Dopo **git pull** se schema è cambiato

---

### **3. Migrazione Database (Comando Principale)**

#### Comando:
```bash
npx prisma migrate dev --name init
```

#### Spiegazione Passo per Passo:

##### **Cosa fa `migrate dev`:**
1. **Analizza** differenze tra schema.prisma e database attuale
2. **Calcola** cosa aggiungere/rimuovere/modificare
3. **Genera** file SQL migration in `prisma/migrations/`
4. **Applica** automaticamente la migration al database
5. **Rigenera** il client Prisma con nuove definizioni

##### **Il flag `--name init`:**
- Assegna nome **"init"** alla migration
- Crea cartella `prisma/migrations/YYYYMMDDHHMMSS_init/`
- File risultante: `migration.sql` con tutto il SQL necessario

##### **Struttura File Generati:**
```
prisma/
├── schema.prisma              ← Il tuo schema (scritto da te)
└── migrations/
    └── 20250821150801_init/
        └── migration.sql      ← SQL generato automaticamente
```

##### **Contenuto migration.sql:**
```sql
-- CreateTable (tutte le tue tabelle)
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    -- ...altri campi
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."recipes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    -- ...altri campi
    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (per performance)
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey (relazioni tra tabelle)
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE "public"."recipes" ADD CONSTRAINT "recipes_authorId_fkey" 
FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE CASCADE;

-- ...tutte le altre foreign keys
```

#### Output Tipico:
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "ricette", schema "public" at "localhost:5432"

Applying migration `20250821150801_init`

The following migration(s) have been created and applied:
  prisma\migrations\20250821150801_init\migration.sql

Your database is now in sync with your schema.
✔ Generated Prisma Client (v6.14.0) to .\src\generated\prisma in 293ms
```

#### Quando Usarlo:
- ✅ Per **creare nuovo database** da zero
- ✅ Quando **aggiungi tabelle/campi** allo schema
- ✅ Durante **sviluppo** per tracking delle modifiche
- ✅ Prima del **deploy in production**

---

### **4. Verifica Sincronizzazione Database**

#### Comando:
```bash
npx prisma db push
```

#### Spiegazione:
- **Confronta** schema.prisma con stato attuale del database
- **NON crea** file migration (a differenza di migrate dev)
- **Applica** direttamente modifiche se necessario
- Utile per **debugging** e **double-check**

#### Output quando tutto OK:
```
The database is already in sync with the Prisma schema.
✔ Generated Prisma Client (v6.14.0) to .\src\generated\prisma in 221ms
```

#### Quando Usarlo:
- ✅ **Verifica** che database sia sincronizzato
- ✅ **Debugging** problemi di schema
- ✅ **Prototipazione** rapida (no migration files)
- ❌ **NON per production** (non crea tracking)

---

### **5. Visualizzazione Database**

#### Comando:
```bash
npx prisma studio
```

#### Spiegazione:
- Avvia **web server** su http://localhost:5555
- **Interfaccia grafica** per esplorare database
- Visualizza **tutte le tabelle** con dati
- Permette **inserimento/modifica** dati in tempo reale

#### Funzionalità Prisma Studio:
- 🔍 **Browse** tutte le tabelle
- ➕ **Inserisci** record manualmente
- ✏️ **Modifica** dati esistenti
- 🗑️ **Elimina** record
- 🔗 **Naviga** relazioni tra tabelle
- 📊 **Statistiche** database

#### Quando Usarlo:
- ✅ **Debugging** struttura database
- ✅ **Inserire dati** di test durante sviluppo
- ✅ **Esplorare** relazioni tra tabelle
- ✅ **Verificare** che migrations siano andate a buon fine

---

## 🔄 Workflow Completo di Sviluppo

### **Fase 1: Progettazione Schema**
```prisma
// 1. Modifica prisma/schema.prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  name  String?
  
  recipes Recipe[]
  
  @@map("users")
}

model Recipe {
  id       String @id @default(cuid())
  title    String
  authorId String
  
  author User @relation(fields: [authorId], references: [id])
  
  @@map("recipes")
}
```

### **Fase 2: Generazione Client**
```bash
# 2. Genera client per usare nel codice
npx prisma generate
```

### **Fase 3: Migrazione Database**
```bash
# 3. Crea database dalle definizioni
npx prisma migrate dev --name add_user_recipe_tables
```

### **Fase 4: Verifica e Test**
```bash
# 4. Controlla che tutto sia sincronizzato
npx prisma db push

# 5. Esplora visivamente e testa
npx prisma studio
```

### **Fase 5: Sviluppo Applicazione**
```javascript
// 6. Usa nel codice Next.js
import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const recipes = await prisma.recipe.findMany({
    include: { author: true }
  })
  
  res.json(recipes)
}
```

---

## 📊 Confronto Comandi

| Comando | Genera Migration | Modifica DB | Genera Client | Quando Usare |
|---------|------------------|-------------|---------------|--------------|
| `prisma generate` | ❌ | ❌ | ✅ | Dopo modifica schema |
| `prisma migrate dev` | ✅ | ✅ | ✅ | Sviluppo + tracking |
| `prisma db push` | ❌ | ✅ | ✅ | Prototipazione veloce |
| `prisma studio` | ❌ | ❌ | ❌ | Visualizzazione/debug |

---

## 🚀 Comandi per Ambienti Diversi

### **Sviluppo Locale (quello che abbiamo fatto):**
```bash
# Database locale con Docker
npx prisma migrate dev --name init
npx prisma studio
```

### **Deploy Production (Supabase/Vercel):**
```bash
# Usa migration SQL generata
# Copia prisma/migrations/XXXX_init/migration.sql 
# Incolla in Supabase SQL Editor

# Oppure migrazione automatica
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### **Reset Database (se serve):**
```bash
# Cancella tutto e ricrea
npx prisma migrate reset
```

---

## 🗂️ Struttura File Finale

```
ricette-forum/
├── prisma/
│   ├── schema.prisma                    ← Schema definizioni (TUO)
│   └── migrations/
│       └── 20250821150801_init/
│           └── migration.sql            ← SQL generato (AUTOMATICO)
├── src/
│   └── generated/
│       └── prisma/                      ← Client generato (AUTOMATICO)
│           ├── index.js
│           ├── index.d.ts
│           └── ...
├── .env                                 ← Variabili ambiente
├── docker-compose.yml                   ← Setup PostgreSQL
└── package.json
```

---

## ⚡ Comandi Rapidi di Riferimento

```bash
# Setup iniziale
docker compose up -d db redis
npx prisma generate
npx prisma migrate dev --name init

# Sviluppo quotidiano
npx prisma generate              # Dopo modifica schema
npx prisma migrate dev --name <nome>  # Nuove migrazioni
npx prisma studio               # Debug visuale

# Verifica
npx prisma db push              # Check sincronizzazione
docker ps                       # Check database running

# Production deploy
npx prisma migrate deploy       # Deploy migrazioni
```

---

## 🎯 Database Schema Finale Creato

### Tabelle Generate:
- **`users`** - Utenti con autenticazione (NextAuth.js)
- **`accounts`** - Login social (GitHub, Google)
- **`recipes`** - Ricette con informazioni nutrizionali
- **`ingredients`** - Database ingredienti riutilizzabili
- **`recipe_ingredients`** - Ingredienti specifici per ricetta (quantità)
- **`comments`** - Sistema commenti con reply annidate + menzioni @username
- **`reactions`** - Sistema reazioni multiple (like, love, wow, helpful, yummy)
- **`ratings`** - Rating stelle 1-5 per ricette
- **`badges`** - Badge gamification del forum
- **`user_badges`** - Badge assegnati agli utenti

### Caratteristiche:
- ✅ **NextAuth.js ready** con JWT strategy
- ✅ **Relazioni complete** tra tutte le tabelle
- ✅ **Constraint di integrità** (foreign keys, unique)
- ✅ **Ottimizzazioni performance** (indici automatici)
- ✅ **Pronto per Supabase** (migration.sql compatibile)

---

## 🔧 Troubleshooting Comuni

### **Errore: Database connection failed**
```bash
# Verifica che Docker sia attivo
docker ps

# Riavvia database
docker compose down
docker compose up -d db redis
```

### **Errore: Schema out of sync**
```bash
# Sincronizza forzatamente
npx prisma db push

# O resetta tutto
npx prisma migrate reset
```

### **Errore: Client out of date**
```bash
# Rigenera client
npx prisma generate
```

---

*Guida creata: 21 Agosto 2025*
*Database Recipe Forum: Pronto per lo sviluppo! 🎉*
