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
