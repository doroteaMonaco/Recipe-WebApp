# Riepilogo variabili d'ambiente

Questo file spiega le differenze tra i vari file di variabili d'ambiente e come configurarli nel progetto.

---

## Tipi di file `.env`

- **.env.local**
  - Usato per lo sviluppo locale con Next.js.
  - Non viene mai committato (aggiunto a `.gitignore`).
  - Esempio:
    ```env
    DATABASE_URL="postgres://postgres:postgres@localhost:5432/ricette"
    REDIS_URL="redis://localhost:6379"
    ```

- **.env.development**
  - Puoi usarlo come template per lo sviluppo locale.
  - Copia il contenuto in `.env.local` quando lavori in locale.

- **.env.production**
  - Usato come template per la produzione (cloud, Vercel, Supabase).
  - Le variabili vengono configurate direttamente sulla piattaforma di deploy (Vercel dashboard, Supabase settings).
  - Esempio:
    ```env
    DATABASE_URL="postgres://<user>:<password>@<host>:5432/<database>"
    REDIS_URL="redis://<host>:6379"
    ```

- **.env.test**
  - Usato per i test automatici.
  - Puoi definire variabili specifiche per l'ambiente di test.

---

## Differenze principali

- **DATABASE_URL**
  - Cambia in base all'ambiente:
    - Locale: punta a PostgreSQL su Docker o installato localmente.
    - Produzione: punta al database cloud (Supabase o altro provider).
- **REDIS_URL**
  - Cambia in base all'ambiente:
    - Locale: `redis://localhost:6379` (Docker o installato localmente).
    - Produzione: URL del servizio Redis cloud.

---

## Best practice

- Non committare file `.env.local` con dati sensibili.
- Mantieni i template `.env.development` e `.env.production` per facilitare la configurazione.
- Aggiorna le variabili ambiente in base all'ambiente in cui lavori.
- Su Vercel/Supabase, configura le variabili direttamente dalla dashboard.

---

## Esempio di utilizzo

- Sviluppo locale:
  1. Copia `.env.development` in `.env.local`.
  2. Avvia Docker e Next.js.
- Produzione:
  1. Configura le variabili su Vercel.
  2. Deploy con `vercel --prod`.
- Test:
  1. Usa `.env.test` per i test automatici.

---
