# 🚀 Guide Rapide - Connexion Backend

## ✅ État Actuel (Mode Développement)

Votre système fonctionne **parfaitement** en mode développement avec des données simulées :

### Flow Actuel :
```
1. Utilisateur sur "/" (Login)
2. Entre email + password (n'importe lesquels)
3. Clic "Se connecter"
4. ⏱️ 800ms de simulation
5. ✅ Token créé + User stocké
6. 🎯 Redirect automatique vers "/dashboard"
7. ✨ Dashboard s'affiche avec données utilisateur
```

## 🔌 Pour Connecter au Backend

### Étape 1 : Remplacer la simulation dans `src/auth/auth.context.tsx`

**Ligne 49-88** - Fonction `login()` :

```tsx
// ❌ ENLEVER CECI (simulation)
await new Promise(resolve => setTimeout(resolve, 800));
const mockUser: User = {
  id: '1',
  email: email,
  name: email.split('@')[0],
  role: 'user',
};
const mockToken = 'mock_jwt_token_' + Date.now();

// ✅ REMPLACER PAR CECI (vraie API)
const response = await fetch('https://votre-backend.com/api/auth/login', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password }),
});

if (!response.ok) {
  const error = await response.json();
  throw new Error(error.message || 'Identifiants incorrects');
}

const { token, user } = await response.json();
// Le reste du code reste identique (stockage + navigation)
```

### Étape 2 : Format de réponse attendu du Backend

Votre endpoint `/api/auth/login` doit retourner :

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### Étape 3 : Endpoints Backend Nécessaires

```bash
# Connexion
POST /api/auth/login
Body: { "email": "user@example.com", "password": "password123" }
Response: { "token": "...", "user": {...} }

# Inscription (optionnel maintenant)
POST /api/auth/register
Body: { "email": "...", "password": "...", "name": "..." }
Response: { "token": "...", "user": {...} }

# Vérifier token (optionnel pour refresh)
GET /api/auth/me
Headers: { "Authorization": "Bearer <token>" }
Response: { "user": {...} }
```

## 🎯 Exemple Complet avec Axios (recommandé)

### Installation
```bash
npm install axios
```

### Dans `auth.context.tsx`
```tsx
import axios from 'axios';

// Configuration de base
const api = axios.create({
  baseURL: 'https://votre-backend.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const login = async (email: string, password: string, rememberMe = false) => {
  setIsLoading(true);
  try {
    // Appel API réel
    const { data } = await api.post('/auth/login', { email, password });
    
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
    navigate('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Erreur de connexion');
    }
    throw new Error('Échec de la connexion');
  } finally {
    setIsLoading(false);
  }
};
```

## 🔒 Ajouter l'Authentification aux Requêtes

Créer un interceptor Axios pour ajouter le token automatiquement :

```tsx
// Dans un nouveau fichier: src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://votre-backend.com/api',
});

// Interceptor pour ajouter le token automatiquement
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

// Interceptor pour gérer les erreurs 401 (non authentifié)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user_data');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 📋 Checklist Avant Production

- [ ] Remplacer les mocks par vraies API calls
- [ ] Installer axios ou utiliser fetch
- [ ] Configurer la baseURL du backend
- [ ] Tester avec de vrais identifiants
- [ ] Gérer les erreurs spécifiques (401, 403, 500)
- [ ] Ajouter interceptor pour auto-ajout du token
- [ ] Implémenter refresh token (optionnel)
- [ ] Tester "Remember Me" true/false
- [ ] Tester déconnexion
- [ ] Tester navigation après expiration du token

## 🎨 Test Actuel (Mode Dev)

1. Ouvrez `http://localhost:3001/`
2. Entrez **n'importe quel email/password**
3. Cliquez "Se connecter"
4. ⏱️ 800ms d'attente (simulation)
5. ✅ Vous êtes redirigé vers le dashboard
6. 🎉 Le Header affiche votre email
7. 🔓 Cliquez "Déconnexion" → Retour au login

## 💡 Avantage de cette Architecture

✅ **Frontend fonctionnel** sans backend  
✅ **Facile à tester** l'UI et le flow  
✅ **Prêt pour connexion backend** (juste remplacer 10 lignes)  
✅ **Gestion complète** des tokens et sessions  
✅ **Navigation automatique** login → dashboard → logout  

## 🔧 Variables d'Environnement (Recommandé)

Créer `.env` :
```env
VITE_API_BASE_URL=https://votre-backend.com/api
```

Dans le code :
```tsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
```

---

**Le système est prêt ! Il suffit de remplacer la simulation par votre API réelle quand le backend sera prêt.** 🚀
