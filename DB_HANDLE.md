# Confronto Database: Prisma + PostgreSQL locale vs Supabase Cloud

Questo documento riassume il funzionamento e la configurazione di due approcci comuni per la gestione del database in progetti web.

---

## 1️⃣ Prisma + PostgreSQL locale

### Come funziona:
1. **Database locale:** installi PostgreSQL sul PC o tramite Docker.
2. **Definizione schema:** scrivi i modelli nel file `prisma/schema.prisma`.

```prisma
model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  password String
}
```

### Configurazione ambiente:
- Imposta la variabile `DATABASE_URL` in `.env.local`:
  ```env
  DATABASE_URL="postgres://postgres:postgres@localhost:5432/ricette"
  ```
- Installa Prisma:
  ```pwsh
  npm install prisma --save-dev
  npm install @prisma/client
  npx prisma init
  ```
- Definisci i modelli in `prisma/schema.prisma`.
- Esegui la migration per creare le tabelle:
  ```pwsh
  npx prisma migrate dev --name init
  ```
- Usa Prisma Client nel codice:
  ```js
  import { PrismaClient } from '@prisma/client';
  const prisma = new PrismaClient();
  // Esempio query
  const users = await prisma.user.findMany();
  ```

---

## 2️⃣ Supabase Cloud

### Come funziona:
1. **Database cloud:** PostgreSQL gestito da Supabase.
2. **Definizione schema:** puoi creare tabelle tramite dashboard Supabase o SQL query.

### Configurazione ambiente:
- Ottieni la stringa di connessione dalla dashboard Supabase (Settings → Database):
  ```env
  DATABASE_URL="postgres://postgres:<password>@db.<codice>.supabase.co:5432/<database_name>"
  ```
- Puoi gestire le tabelle tramite dashboard o SQL editor.
- Per il frontend/backend, usa la libreria `@supabase/supabase-js`:
  ```js
  import { createClient } from '@supabase/supabase-js';
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  // Esempio query
  const { data, error } = await supabase.from('user').select('*');
  ```

---

## 🔄 Migrazione tra ambienti
- Mantieni lo stesso schema tra locale e cloud per evitare problemi.
- Puoi esportare/importare dati tra PostgreSQL locale e Supabase con strumenti come pgAdmin o dump SQL.

---

## 📝 Note
- Prisma è ideale per sviluppo locale e gestione tramite codice.
- Supabase è ottimo per progetti cloud, autenticazione e API pronte all’uso.
- Puoi usare entrambi: Prisma per locale, Supabase per produzione/cloud.
