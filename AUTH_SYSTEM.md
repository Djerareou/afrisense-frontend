# 🔐 Système d'Authentification AfriSense

## Architecture Implémentée

### 📁 Structure des fichiers
```
src/
├── auth/
│   ├── auth.context.tsx       # Contexte d'authentification global
│   ├── ProtectedRoute.tsx     # Composant de protection des routes
│   └── pages/
│       └── Login.tsx          # Page de connexion
├── app/
│   └── App.tsx                # Router principal avec AuthProvider
└── components/
    └── layout/
        └── Header.tsx         # Header avec bouton de déconnexion
```

### ✨ Fonctionnalités

#### 1. **AuthContext** (`auth.context.tsx`)
- Gestion globale de l'état d'authentification
- Stockage des tokens (localStorage pour "Remember Me", sessionStorage sinon)
- Fonctions : `login()`, `logout()`, `register()`
- Hook personnalisé : `useAuth()`

#### 2. **ProtectedRoute** (`ProtectedRoute.tsx`)
- Protège les routes privées
- Redirige vers `/` si non authentifié
- Affiche un loader pendant la vérification

#### 3. **Login** (`Login.tsx`)
- Design split-screen premium
- Validation de formulaire
- Gestion des erreurs
- Option "Remember Me"
- Auto-redirect si déjà connecté

#### 4. **Header** (`Header.tsx`)
- Affichage du nom/email utilisateur
- Bouton de déconnexion (desktop + mobile)
- Menu utilisateur avec dropdown

## 🚀 Flow d'Authentification

### Connexion
```
1. Utilisateur sur "/" (Login)
2. Entre email/password
3. Clique "Se connecter"
4. AuthContext.login() appelé
5. Token stocké (localStorage/sessionStorage)
6. User state mis à jour
7. Redirection automatique vers "/dashboard"
```

### Routes Protégées
```
1. Utilisateur tente d'accéder "/dashboard"
2. ProtectedRoute vérifie isAuthenticated
3. Si non authentifié → Redirect vers "/"
4. Si authentifié → Affiche Dashboard
```

### Déconnexion
```
1. Clic sur "Déconnexion" (Header)
2. AuthContext.logout() appelé
3. Clear localStorage + sessionStorage
4. User state = null
5. Redirection vers "/"
```

### Auto-login
```
1. Utilisateur ouvre l'app
2. AuthContext vérifie localStorage/sessionStorage
3. Si token trouvé → Parse user data
4. User state restauré
5. Accès direct au Dashboard
```

## 🔧 Utilisation

### Dans un composant
```tsx
import { useAuth } from '../auth/auth.context';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (isAuthenticated) {
    return <div>Bonjour {user?.name}</div>;
  }

  return <button onClick={() => login('email', 'password')}>Login</button>;
}
```

### Protéger une route
```tsx
import ProtectedRoute from '../auth/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## 🔌 Connexion API Backend

### Remplacer les mocks dans `auth.context.tsx`

```tsx
// Actuellement (MOCK)
await new Promise(resolve => setTimeout(resolve, 1500));
const mockUser = { id: '1', email, name: email.split('@')[0], role: 'user' };
const mockToken = 'mock_jwt_token_' + Date.now();

// Remplacer par (REAL API)
const response = await fetch('https://votre-api.com/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

if (!response.ok) {
  throw new Error('Identifiants incorrects');
}

const { token, user } = await response.json();
```

## 📦 Stockage

### localStorage (Remember Me = true)
- Token persisté après fermeture navigateur
- Utilisé pour connexion automatique
- Clé : `auth_token`, `user_data`

### sessionStorage (Remember Me = false)
- Token supprimé à la fermeture du navigateur
- Plus sécurisé pour ordinateurs partagés
- Clé : `auth_token`, `user_data`

## 🎨 Personnalisation

### Modifier le temps de simulation
```tsx
// Dans auth.context.tsx
await new Promise(resolve => setTimeout(resolve, 1500)); // Changez 1500
```

### Ajouter des rôles
```tsx
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator'; // Ajoutez vos rôles
}
```

### Protéger par rôle
```tsx
function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

## 🔒 Sécurité

### ✅ Implémenté
- Protection des routes privées
- Tokens stockés côté client
- Auto-redirect si non authentifié
- Loading states

### ⚠️ À ajouter (Production)
- HTTPS obligatoire
- JWT refresh tokens
- CSRF protection
- Rate limiting
- Validation backend des tokens
- Expiration des sessions
- 2FA (Two-Factor Authentication)

## 🐛 Debugging

### Vérifier l'état auth
```tsx
const { user, isAuthenticated, isLoading } = useAuth();
console.log('User:', user);
console.log('Authenticated:', isAuthenticated);
console.log('Loading:', isLoading);
```

### Vérifier le localStorage
```javascript
console.log('Token:', localStorage.getItem('auth_token'));
console.log('User:', localStorage.getItem('user_data'));
```

### Clear manuel
```javascript
localStorage.clear();
sessionStorage.clear();
window.location.reload();
```

## 📝 TODO Backend

Pour connecter au backend, vous aurez besoin de ces endpoints :

```
POST   /api/auth/login       - Connexion
POST   /api/auth/register    - Inscription
POST   /api/auth/logout      - Déconnexion
GET    /api/auth/me          - Récupérer infos utilisateur
POST   /api/auth/refresh     - Refresh token
```

Exemple de réponse attendue :
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

## 🎉 C'est tout !

Le système d'authentification est maintenant complet et prêt à être connecté à votre API backend.
