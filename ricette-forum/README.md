# Ricette Forum

Forum online per condividere ricette, sviluppato con **Next.js**, **Supabase**, **PostgreSQL**, **Redis**, **TailwindCSS**, **shadcn/ui**, **React Hook Form** e **Zod**.

---

## 🚀 Tecnologie utilizzate

* **Frontend / Backend**: Next.js (JavaScript, App Router, API routes)
* **Autenticazione e DB**: Supabase
* **Database locale**: PostgreSQL (Docker)
* **Caching / Session**: Redis (Docker)
* **UI**: TailwindCSS + shadcn/ui
* **Form + Validazione**: React Hook Form + Zod
* **Hosting Frontend**: Vercel
* **Containerizzazione**: Docker + Docker Compose

---

## 🗂 Struttura progetto

```
ricette-forum/
├─ src/
│  ├─ app/                   # Pagine e API routes di Next.js
│  ├─ components/            # Componenti UI riutilizzabili
│  ├─ lib/                   # supabaseClient.js
│  ├─ hooks/                 # Custom React hooks
│  ├─ context/               # Context globale
│  └─ utils/                 # Helper functions
├─ public/
├─ .env.local                # Variabili ambiente
├─ package.json
├─ docker-compose.yml
└─ tailwind.config.js
```

---

## ⚙️ Configurazione variabili ambiente

Crea un file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=TUO_URL_SUPABASE
NEXT_PUBLIC_SUPABASE_ANON_KEY=TUO_ANON_KEY
DATABASE_URL=postgres://postgres:password@db:5432/recipesdb
REDIS_URL=redis://redis:6379
```

---

## 🐳 Docker Compose

**docker-compose.yml**

```yaml
version: '3.8'

services:
  web:
    image: node:20
    working_dir: /app
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    command: sh -c "npm install && npm run dev"
    environment:
      DATABASE_URL: postgres://postgres:password@db:5432/recipesdb
      REDIS_URL: redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: recipesdb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

---

## ⚡ Installazione e avvio locale

1. Clona il repository:

```bash
git clone https://github.com/tuo-username/ricette-forum.git
cd ricette-forum
```

2. Installa dipendenze:

```bash
npm install
```

3. Avvia Docker (PostgreSQL + Redis):

```bash
docker-compose up -d
```

4. Avvia Next.js in locale:

```bash
npm run dev
```

5. Apri l'app nel browser:

```
http://localhost:3000
```

---

## ✅ Comandi principali

* Avvio server di sviluppo Next.js:

```bash
npm run dev
```

* Build progetto per produzione:

```bash
npm run build
```

* Avvio servizi Docker:

```bash
docker-compose up -d
```

* Stop Docker:

```bash
docker-compose down
```

---

## 🔗 Deploy su Vercel

1. Crea un account su [Vercel](https://vercel.com/)
2. Importa il repository GitHub
3. Aggiungi variabili d'ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy automatico

---

## 🌍 Avvio e gestione ambienti

### 1. Sviluppo locale (Docker/PostgreSQL/Redis)

1. Copia il contenuto di `.env.development` in `.env.local`.
2. Avvia i servizi database e cache:
   ```pwsh
   docker-compose up
   ```
3. Installa le dipendenze:
   ```pwsh
   npm install
   ```
4. Avvia Next.js:
   ```pwsh
   npm run dev
   ```

### 2. Produzione (Vercel/Supabase)

1. Imposta le variabili ambiente dalla dashboard di Vercel (usa i valori di `.env.production`).
2. Deploy su Vercel:
   ```pwsh
   vercel --prod
   ```
3. Next.js userà le variabili configurate su Vercel.

### 3. Test

1. Crea un file `.env.test` con le variabili dedicate ai test.
2. Avvia i test con:
   ```pwsh
   npm test
   ```

---

## 📦 Gestione variabili ambiente

- `.env.development`: per sviluppo locale
- `.env.production`: per produzione/cloud
- `.env.test`: per test
- `.env.local`: usato da Next.js in locale (puoi copiarci il contenuto di `.env.development`)

---

## 🔗 Note

- In locale, usa `localhost` per i servizi Docker.
- Nei container, usa il nome del servizio (`db`, `redis`).
- In produzione, usa le credenziali fornite da Supabase/Vercel.

---

## 📌 Note

* Supabase gestisce autenticazione, database e storage file.
* PostgreSQL e Redis sono utilizzati per un ambiente locale completo e caching.
* Form gestiti con React Hook Form e validazione con Zod.
* UI basata su TailwindCSS e shadcn/ui per componenti riutilizzabili.

---

## 🛠 Prossimi step

* Creare tabelle e relazioni nel DB Supabase
* Implementare autenticazione e profili utenti
* Creare CRUD ricette e commenti con API routes di Next.js
* Implementare caching con Redis
* Deploy finale su Vercel + eventuale DB remoto
