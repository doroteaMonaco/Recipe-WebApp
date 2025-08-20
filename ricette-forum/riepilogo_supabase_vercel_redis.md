# Riepilogo configurazione Supabase, Vercel e Redis

Questo file ti aiuta a ricordare tutti i passaggi fondamentali per configurare il tuo progetto con Supabase, Vercel e Redis.

---

## Supabase (Database PostgreSQL)

1. Vai su [supabase.com](https://supabase.com/) e crea un nuovo progetto.
2. Nella dashboard del progetto:
   - Vai su **Settings** → **Database**.
   - Trova le informazioni:
     - **User**: di solito `postgres`
     - **Password**: clicca su "Show" accanto a "Database Password"
     - **Host**: simile a `db.<codice>.supabase.co`
     - **Database name**: di solito uguale al nome del progetto
   - Se disponibile, copia la **connection string** (es. `postgres://postgres:password@db.abcd.supabase.co:5432/nome_db`)
3. Inserisci la stringa in `.env.production`:
   ```env
   DATABASE_URL="postgres://postgres:<password>@db.<codice>.supabase.co:5432/<database_name>"
   ```

---

## Redis (Upstash o altro servizio cloud)

1. Vai su [upstash.com](https://upstash.com/) e registrati.
2. Crea un nuovo database Redis.
3. Nella dashboard, copia l’URL Redis fornito (es. `redis://default:password@eu1-upstash-redis.upstash.io:6379`)
4. Inserisci questo URL nella variabile `REDIS_URL` del tuo `.env.production` e su Vercel (Environment Variables):
   ```env
   REDIS_URL="redis://default:password@eu1-upstash-redis.upstash.io:6379"
   ```

---

## Vercel (Deploy e variabili ambiente)

1. Vai su [vercel.com](https://vercel.com/) e crea un account.
2. Collega il tuo repository o carica il progetto.
3. Nella dashboard del progetto, vai su **Settings** → **Environment Variables**.
4. Aggiungi le variabili:
   - `DATABASE_URL` (stringa Supabase)
   - `REDIS_URL` (stringa Upstash o altro provider)
   - Altre variabili necessarie (es. `SUPABASE_URL`, `SUPABASE_ANON_KEY`)
5. Fai il deploy:
   ```pwsh
   vercel --prod
   ```

---

## Note importanti

- Su Supabase, se non trovi la connection string, costruiscila manualmente con i dati che vedi in dashboard.
- Su Upstash, la creazione del database è solo per ottenere l’URL: non serve configurare tabelle o modelli.
- Su Vercel, le variabili ambiente vanno inserite dalla dashboard, non serve il file `.env.production` fisico.
- Puoi sempre consultare questo file per ricordare i passaggi!

---
