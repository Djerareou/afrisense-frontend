# 🔌 Guide Complet - Connexion avec votre Backend

## 📋 Ce que vous devez savoir

### 1️⃣ **Votre Backend doit avoir ces endpoints**

```
POST   /api/auth/login     - Connexion utilisateur
POST   /api/auth/register  - Inscription (optionnel)
GET    /api/auth/me        - Infos utilisateur (optionnel)
POST   /api/auth/logout    - Déconnexion (optionnel)
```

### 2️⃣ **Format de réponse attendu**

Votre endpoint `/api/auth/login` doit retourner :

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

---

## 🔧 Méthode 1 : Avec `fetch` (Simple)

### Étape 1 : Ouvrez `src/auth/auth.context.tsx`

### Étape 2 : Ligne 49-88, remplacez la fonction `login()` :

**❌ AVANT (code actuel - simulation)**
```tsx
const login = async (email: string, password: string, rememberMe = false) => {
  setIsLoading(true);
  try {
    // Simulate API call - Quick simulation for development
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock user data
    const mockUser: User = {
      id: '1',
      email: email,
      name: email.split('@')[0],
      role: 'user',
    };

    const mockToken = 'mock_jwt_token_' + Date.now();

    // Store token and user data
    if (rememberMe) {
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_data', JSON.stringify(mockUser));
    } else {
      sessionStorage.setItem('auth_token', mockToken);
      sessionStorage.setItem('user_data', JSON.stringify(mockUser));
    }

    setUser(mockUser);
    navigate('/');
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Échec de la connexion. Veuillez vérifier vos identifiants.');
  } finally {
    setIsLoading(false);
  }
};
```

**✅ APRÈS (avec votre API)**
```tsx
const login = async (email: string, password: string, rememberMe = false) => {
  setIsLoading(true);
  try {
    // ✅ REMPLACER L'URL PAR VOTRE BACKEND
    const response = await fetch('https://votre-backend.com/api/auth/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Vérifier si la réponse est OK
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Identifiants incorrects');
    }

    // Récupérer les données
    const data = await response.json();
    const { token, user } = data;

    // Store token and user data (RESTE IDENTIQUE)
    if (rememberMe) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
    } else {
      sessionStorage.setItem('auth_token', token);
      sessionStorage.setItem('user_data', JSON.stringify(user));
    }

    setUser(user);
    navigate('/');
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Échec de la connexion'
    );
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🚀 Méthode 2 : Avec `axios` (Recommandé)

### Pourquoi axios ?
- ✅ Plus simple à utiliser
- ✅ Gère automatiquement les erreurs
- ✅ Interceptors pour ajouter le token automatiquement
- ✅ Meilleure gestion des timeouts

### Étape 1 : Installer axios

```bash
npm install axios
```

### Étape 2 : Créer un fichier de configuration API

**Créer `src/api/axios.config.ts`**

```typescript
import axios from 'axios';

// ✅ REMPLACER PAR L'URL DE VOTRE BACKEND
const API_BASE_URL = 'https://votre-backend.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 secondes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pour ajouter le token automatiquement à toutes les requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || 
                  sessionStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si 401 (non authentifié), déconnecter l'utilisateur
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Étape 3 : Utiliser axios dans `auth.context.tsx`

**En haut du fichier, ajouter :**
```typescript
import api from '../api/axios.config';
```

**Remplacer la fonction login :**
```tsx
const login = async (email: string, password: string, rememberMe = false) => {
  setIsLoading(true);
  try {
    // ✅ Appel API avec axios
    const { data } = await api.post('/auth/login', { email, password });
    
    const { token, user } = data;

    // Store token and user data
    if (rememberMe) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
    } else {
      sessionStorage.setItem('auth_token', token);
      sessionStorage.setItem('user_data', JSON.stringify(user));
    }

    setUser(user);
    navigate('/');
  } catch (error) {
    console.error('Login error:', error);
    
    // Gestion des erreurs axios
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Erreur de connexion';
      throw new Error(message);
    }
    throw new Error('Échec de la connexion');
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🌐 Méthode 3 : Avec Variables d'Environnement (Production)

### Étape 1 : Créer un fichier `.env`

À la racine du projet :

```env
VITE_API_BASE_URL=https://votre-backend.com/api
```

### Étape 2 : Modifier `axios.config.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
```

### Avantages :
- ✅ URL différente en dev et en production
- ✅ Facile à déployer
- ✅ Sécurisé

---

## 🔒 Utiliser le Token pour les autres requêtes

### Exemple : Récupérer la liste des trackers

**Créer `src/api/trackers.api.ts`**

```typescript
import api from './axios.config';

export const getTrackers = async () => {
  const { data } = await api.get('/trackers');
  return data;
};

export const getTrackerById = async (id: string) => {
  const { data } = await api.get(`/trackers/${id}`);
  return data;
};

export const createTracker = async (tracker: any) => {
  const { data } = await api.post('/trackers', tracker);
  return data;
};
```

**Utilisation dans un composant :**

```tsx
import { useEffect, useState } from 'react';
import { getTrackers } from '../api/trackers.api';

function Dashboard() {
  const [trackers, setTrackers] = useState([]);

  useEffect(() => {
    const fetchTrackers = async () => {
      try {
        const data = await getTrackers();
        setTrackers(data);
      } catch (error) {
        console.error('Error fetching trackers:', error);
      }
    };

    fetchTrackers();
  }, []);

  return (
    <div>
      {trackers.map(tracker => (
        <div key={tracker.id}>{tracker.name}</div>
      ))}
    </div>
  );
}
```

---

## 📋 Checklist Avant de Tester

- [ ] Backend en cours d'exécution
- [ ] Endpoint `/api/auth/login` créé
- [ ] Retourne format JSON correct (token + user)
- [ ] CORS configuré sur le backend
- [ ] URL du backend correcte dans le code

### ⚠️ Problème CORS ?

Si vous avez une erreur CORS, ajoutez sur votre backend :

**Node.js/Express :**
```javascript
app.use(cors({
  origin: 'http://localhost:3001', // URL de votre frontend
  credentials: true
}));
```

**Django :**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3001",
]
```

---

## 🧪 Test Rapide

### 1. Test avec curl

```bash
curl -X POST https://votre-backend.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Résultat attendu :
```json
{
  "token": "eyJhbG...",
  "user": {
    "id": "1",
    "email": "test@example.com",
    "name": "Test User",
    "role": "user"
  }
}
```

### 2. Test dans le frontend

1. Ouvrez `http://localhost:3001/login`
2. Entrez vos **vrais identifiants** du backend
3. Cliquez "Se connecter"
4. Ouvrez la Console (F12)
5. Vérifiez qu'il n'y a pas d'erreurs

---

## 🐛 Debugging

### Voir les requêtes

Ajoutez dans `axios.config.ts` :

```typescript
api.interceptors.request.use(
  (config) => {
    console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    console.log('📦 Data:', config.data);
    return config;
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);
```

---

## 📝 Exemple Complet

Voici un exemple complet avec un backend Node.js :

### Backend (Express)

```javascript
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Vérifier l'utilisateur dans la DB
  const user = await User.findOne({ email });
  
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Identifiants incorrects' });
  }
  
  // Créer le token JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // Retourner la réponse
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});
```

### Frontend (React)

```tsx
// src/auth/auth.context.tsx
const login = async (email: string, password: string, rememberMe = false) => {
  setIsLoading(true);
  try {
    const { data } = await api.post('/auth/login', { email, password });
    
    if (rememberMe) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
    } else {
      sessionStorage.setItem('auth_token', data.token);
      sessionStorage.setItem('user_data', JSON.stringify(data.user));
    }

    setUser(data.user);
    navigate('/');
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Échec de la connexion');
  } finally {
    setIsLoading(false);
  }
};
```

---

## ✅ Résumé

1. **Installer axios** : `npm install axios`
2. **Créer** `src/api/axios.config.ts`
3. **Modifier** `src/auth/auth.context.tsx` (fonction login)
4. **Tester** avec vos vrais identifiants

**C'est tout !** Le reste du système (routes, protection, déconnexion) fonctionne automatiquement. 🎉
