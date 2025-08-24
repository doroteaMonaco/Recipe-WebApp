# 📖 Guida Context e Provider - Recipe Forum

## 🎯 **Panoramica**

Questa guida spiega cosa sono Context e Provider in React, come usarli nel progetto Recipe Forum e la differenza con l'architettura basata su Controller.

---

## 📚 **Context - Concetti Base**

### Cos'è il Context?
Il **Context** è una funzionalità di React che permette di condividere dati tra componenti senza passarli manualmente attraverso le props (evita il "prop drilling").

### Problema che risolve:
```jsx
// ❌ SENZA Context (prop drilling - brutto)
function App() {
  const [user, setUser] = useState(null);
  return <Header user={user} setUser={setUser} />;
}

function Header({ user, setUser }) {
  return <Navigation user={user} setUser={setUser} />;
}

function Navigation({ user, setUser }) {
  return <LoginButton user={user} setUser={setUser} />;
}

function LoginButton({ user, setUser }) {
  return <button onClick={() => setUser(newUser)}>Login</button>;
}
```

```jsx
// ✅ CON Context (pulito)
const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Header />
    </UserContext.Provider>
  );
}

function LoginButton() {
  const { user, setUser } = useContext(UserContext); // Accesso diretto!
  return <button onClick={() => setUser(newUser)}>Login</button>;
}
```

---

## 🏗️ **Provider - Struttura e Utilizzo**

### Cos'è un Provider?
Il **Provider** è il componente che "fornisce" (provide) i valori del Context ai componenti figli.

### Struttura base completa:
```jsx
// 1. Crei il Context
const MyContext = createContext();

// 2. Crei il Provider (wrapper component)
function MyProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const updateData = (newData) => {
    setLoading(true);
    setData(newData);
    setLoading(false);
  };
  
  const value = {
    data,
    loading,
    updateData
  };
  
  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
}

// 3. Crei un hook personalizzato per usare il context
export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
}

// 4. Usi il Provider per avvolgere i componenti
function App() {
  return (
    <MyProvider>
      <Header />
      <Main />
    </MyProvider>
  );
}

// 5. I componenti accedono al Context
function Header() {
  const { data, loading } = useMyContext();
  return <h1>{loading ? 'Loading...' : data}</h1>;
}
```

---

## 🏛️ **Architettura del Progetto Recipe Forum**

### Pattern Tradizionale (NON usato nel progetto):
```
┌─────────────────────────────────────┐
│            Context Heavy            │
│  ┌─────────────────────────────────┐ │
│  │         AuthContext             │ │
│  │  • Stato utente                 │ │
│  │  • Login API calls              │ │
│  │  • Register API calls           │ │
│  │  • Error handling               │ │
│  │  • Loading states               │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Pattern Moderno (USATO nel progetto):
```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│    Providers     │  │   Controllers    │  │    Services      │
│                  │  │                  │  │                  │
│ • Stato UI       │  │ • HTTP requests  │  │ • Business logic │
│ • Modal state    │  │ • Validation     │  │ • Database       │
│ • Theme          │  │ • Error mapping  │  │ • External APIs  │
│ • Notifications  │  │ • Response format│  │ • Data transform │
└──────────────────┘  └──────────────────┘  └──────────────────┘
        │                       │                       │
        └─────────── UI ────────┼──── HTTP/API ────────┘
                                │
                         ┌──────────────┐
                         │  Components  │
                         │              │
                         │ • Render UI  │
                         │ • User input │
                         │ • Event hand │
                         └──────────────┘
```

---

## 🎨 **Provider nel Progetto Recipe Forum**

### 1. AuthModalProvider (Gestione UI Modal)
```jsx
// src/providers/AuthModalProvider.jsx
"use client";
import { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext();

export function AuthModalProvider({ children }) {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);

  const value = {
    isLoginOpen,
    isSignupOpen,
    openLogin: () => setLoginOpen(true),
    closeLogin: () => setLoginOpen(false),
    openSignup: () => setSignupOpen(true),
    closeSignup: () => setSignupOpen(false),
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return context;
}
```

### 2. ThemeProvider (Gestione Tema)
```jsx
// src/providers/ThemeProvider.jsx
"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`theme-${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### 3. NotificationProvider (Gestione Toast)
```jsx
// src/providers/NotificationProvider.jsx
"use client";
import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove dopo 5 secondi
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      removeNotification 
    }}>
      {children}
      {/* Render notifications */}
      <div className="notifications">
        {notifications.map(notification => (
          <div key={notification.id} className={`toast toast-${notification.type}`}>
            {notification.message}
            <button onClick={() => removeNotification(notification.id)}>×</button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
```

### 4. Provider Combinato
```jsx
// src/providers/Providers.jsx
"use client";
import { SessionProvider } from 'next-auth/react';
import { AuthModalProvider } from './AuthModalProvider';
import { ThemeProvider } from './ThemeProvider';
import { NotificationProvider } from './NotificationProvider';

export function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <NotificationProvider>
          <AuthModalProvider>
            {children}
          </AuthModalProvider>
        </NotificationProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
```

### 5. Utilizzo nel Layout Principale
```jsx
// app/layout.jsx
import { Providers } from '@/src/providers/Providers';

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

---

## 🔗 **Integrazione con Controller**

### Come i Provider lavorano con i Controller:

```jsx
// Component che usa Provider + Controller
function LoginButton() {
  const { openLogin } = useAuthModal(); // Provider per UI
  const { addNotification } = useNotification(); // Provider per feedback
  
  const handleLogin = async (email, password) => {
    try {
      // Controller gestisce API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        addNotification('Login effettuato con successo!', 'success');
        // NextAuth aggiorna automaticamente la sessione
      } else {
        const error = await response.json();
        addNotification(error.message, 'error');
      }
    } catch (err) {
      addNotification('Errore di connessione', 'error');
    }
  };
  
  return <button onClick={openLogin}>Login</button>;
}
```

---

## ✅ **Quando Usare Cosa**

### 🟢 **USA Provider per:**
- **Stato UI condiviso**: modal aperti/chiusi, tema, sidebar
- **Notifiche/Toast**: messaggi success/error globali
- **Configurazioni**: impostazioni utente, preferenze
- **Dati session semplici**: info utente corrente (con NextAuth)

### 🔴 **NON usare Provider per:**
- **API calls**: gestite dai Controller
- **Business logic**: gestita dai Services
- **Validazione**: gestita dai Controller
- **Database operations**: gestite dai Services

### 🟡 **Controller per:**
- **HTTP requests/responses**
- **Validazione input**
- **Error handling HTTP**
- **Status codes**

### 🔵 **Services per:**
- **Business logic**
- **Database queries**
- **Data transformation**
- **External API calls**

---

## 📁 **Struttura File Finale**

```
src/
├── providers/
│   ├── AuthModalProvider.jsx      # Gestione modal login/signup
│   ├── ThemeProvider.jsx          # Gestione tema dark/light
│   ├── NotificationProvider.jsx   # Gestione toast/notifiche
│   └── Providers.jsx              # Provider combinato
├── controllers/
│   ├── authController.js          # API login/register
│   ├── recipeController.js        # API ricette
│   └── ...
├── services/
│   ├── userService.js             # Business logic utenti
│   ├── recipeService.js           # Business logic ricette
│   └── ...
├── components/
│   ├── auth/
│   ├── recipes/
│   └── ui/
└── hooks/
    ├── useAuth.js                 # Hook sessione (NextAuth wrapper)
    ├── useRecipes.js              # Hook ricette
    └── ...

app/
├── layout.jsx                     # Usa Providers
├── page.jsx
└── api/
    ├── auth/
    │   ├── [...nextauth]/route.js # NextAuth
    │   ├── login/route.js         # Chiama authController
    │   └── register/route.js      # Chiama authController
    └── recipes/
        └── route.js               # Chiama recipeController
```

---

## 🎯 **Best Practices**

### 1. **Provider Leggeri**
```jsx
// ✅ BENE - Solo stato UI
function AuthModalProvider({ children }) {
  const [isOpen, setOpen] = useState(false);
  return <Context.Provider value={{ isOpen, setOpen }}>{children}</Context.Provider>;
}

// ❌ MALE - Logica pesante
function AuthProvider({ children }) {
  const login = async () => { /* logica API pesante */ };
  const register = async () => { /* altra logica pesante */ };
  // Troppa logica nel provider!
}
```

### 2. **Hook Personalizzati**
```jsx
// ✅ SEMPRE crea hook personalizzati
export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return context;
}
```

### 3. **Error Boundaries**
```jsx
// ✅ Gestisci errori nei provider
function NotificationProvider({ children }) {
  try {
    // logica provider
  } catch (error) {
    console.error('Provider error:', error);
    // fallback UI
  }
}
```

### 4. **Performance**
```jsx
// ✅ Usa useMemo per valori costosi
function ThemeProvider({ children }) {
  const value = useMemo(() => ({
    theme,
    toggleTheme
  }), [theme]);
  
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
```

---

## 🚀 **Prossimi Passi**

1. **Implementa AuthModalProvider** per gestire apertura/chiusura modal
2. **Crea ThemeProvider** se vuoi supporto tema dark/light
3. **Aggiungi NotificationProvider** per feedback utente
4. **Testa l'integrazione** con i Controller esistenti
5. **Documenta hook personalizzati** per ogni provider

---

## 📞 **Riferimenti Rapidi**

### Import Pattern:
```jsx
import { useAuthModal } from '@/src/providers/AuthModalProvider';
import { useTheme } from '@/src/providers/ThemeProvider';
import { useNotification } from '@/src/providers/NotificationProvider';
```

### Usage Pattern:
```jsx
function MyComponent() {
  const { openLogin } = useAuthModal();
  const { theme, toggleTheme } = useTheme();
  const { addNotification } = useNotification();
  
  // Usa i provider per UI, controller per API
}
```

---

*Creato per Recipe Forum - Aggiornato Agosto 2025*
