# Recommandations pour l'ajout de graphiques

## ✅ Navigation ajoutée
- Le bouton "Mes véhicules" dans le header (desktop et mobile) navigue maintenant vers `/devices`
- Vous pouvez accéder à la liste des véhicules depuis n'importe quelle page

---

## 📊 Où ajouter des graphiques dans la page Tracker Details

### 1. **Tab "Statistiques" (PRIORITÉ HAUTE)** 
**Emplacement:** `tracker/[id].tsx` - ligne 703
**État actuel:** Placeholder avec message "disponibles prochainement"

#### Graphiques recommandés:

**A. Graphique en ligne - Distance parcourue par jour**
```typescript
// Données: 7 derniers jours avec distance quotidienne
{
  labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  datasets: [{
    label: 'Distance (km)',
    data: [45, 67, 89, 34, 78, 123, 56]
  }]
}
```
**Bibliothèque:** Chart.js ou Recharts
**Intérêt:** Voir les tendances d'utilisation quotidienne

---

**B. Graphique en barres - Vitesse moyenne par trajet**
```typescript
// Données: Top 10 trajets avec vitesse moyenne
{
  labels: ['Trajet 1', 'Trajet 2', 'Trajet 3', ...],
  datasets: [{
    label: 'Vitesse moy (km/h)',
    data: [45, 67, 34, 78, 56, 42, 61, 39, 52, 48]
  }]
}
```
**Intérêt:** Identifier les trajets les plus rapides/lents

---

**C. Graphique en secteurs (Pie/Doughnut) - Répartition du temps**
```typescript
// Données: Temps en mouvement vs arrêt vs stationné
{
  labels: ['En mouvement', 'Arrêts', 'Stationné'],
  datasets: [{
    data: [60, 25, 15], // pourcentage
    backgroundColor: ['#00BFA6', '#FFA726', '#EF5350']
  }]
}
```
**Intérêt:** Comprendre l'utilisation du véhicule

---

**D. Graphique en ligne - Évolution de la batterie**
```typescript
// Données: Niveau de batterie sur 7 jours
{
  labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  datasets: [{
    label: 'Batterie (%)',
    data: [100, 95, 87, 78, 92, 85, 90],
    borderColor: '#00BFA6'
  }]
}
```
**Intérêt:** Surveiller la santé de la batterie du tracker

---

### 2. **Tab "Historique des trajets"** 
**Emplacement:** `tracker/[id].tsx` - ligne 590-698
**État actuel:** Liste de trajets avec métriques

#### Graphiques recommandés:

**E. Mini graphique en ligne par trajet (Sparkline)**
- Afficher la vitesse en temps réel pendant le trajet
- Position: À côté de chaque carte de trajet
- Hauteur: 40-60px
- Données: Vitesse par minute pendant le trajet

**F. Heatmap des heures de trajet**
```typescript
// Données: Nombre de trajets par heure de la journée
{
  hours: [0, 1, 2, ..., 23],
  values: [0, 0, 0, 2, 8, 15, 10, 5, 8, 12, 9, 3, 1, 0]
}
```
**Intérêt:** Identifier les heures de pointe d'utilisation

---

### 3. **Tab "Position en direct"**
**Emplacement:** `tracker/[id].tsx` - ligne 425-588
**État actuel:** Carte Leaflet avec position actuelle

#### Graphiques recommandés:

**G. Jauge (Gauge Chart) pour la vitesse**
- Remplacer ou compléter l'affichage textuel de la vitesse
- Style: Compteur de voiture (0-200 km/h)
- Couleurs: Vert (0-60), Jaune (60-90), Rouge (90+)

**H. Mini timeline des 24 dernières heures**
- Graphique en barre horizontale montrant:
  - Périodes en mouvement (vert)
  - Périodes d'arrêt (jaune)
  - Périodes offline (rouge)

---

### 4. **Page liste des véhicules (devices.tsx)**
**Emplacement:** `user/pages/devices.tsx`
**État actuel:** Table avec 4 stats cards en haut

#### Graphiques recommandés:

**I. Graphique en barres empilées - Vue d'ensemble de la flotte**
```typescript
// Données: Distance totale par véhicule cette semaine
{
  labels: ['Camry', 'Civic', 'Sprinter', 'Transit', 'Patrol'],
  datasets: [{
    label: 'Distance (km)',
    data: [543, 234, 789, 456, 321]
  }]
}
```
**Position:** En-dessous des stats cards
**Intérêt:** Comparer l'utilisation des véhicules

---

## 🛠️ Bibliothèques recommandées

### Option 1: **Chart.js** (Recommandé)
```bash
npm install chart.js react-chartjs-2
```
**Avantages:**
- Simple à utiliser
- Très personnalisable
- Documentation excellente
- Légère (50kb)
- Animations fluides

**Types disponibles:**
- Line, Bar, Pie, Doughnut, Radar, Polar Area, Bubble, Scatter

---

### Option 2: **Recharts**
```bash
npm install recharts
```
**Avantages:**
- Components React natifs
- Syntaxe JSX intuitive
- Responsive par défaut
- Animations élégantes

**Types disponibles:**
- LineChart, BarChart, AreaChart, PieChart, RadarChart, ScatterChart

---

### Option 3: **ApexCharts**
```bash
npm install apexcharts react-apexcharts
```
**Avantages:**
- Design moderne
- Interactivité avancée
- Zoom, pan, tooltips riches
- Plus lourd (150kb)

---

## 📝 Exemple d'implémentation (Chart.js)

```tsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Enregistrer les composants
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Dans votre composant
const data = {
  labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  datasets: [
    {
      label: 'Distance parcourue (km)',
      data: [45, 67, 89, 34, 78, 123, 56],
      borderColor: '#00BFA6',
      backgroundColor: 'rgba(0, 191, 166, 0.1)',
      tension: 0.4,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Distance quotidienne - 7 derniers jours',
    },
  },
};

// Dans le JSX
<div className="bg-white rounded-xl p-6 shadow-lg">
  <Line data={data} options={options} />
</div>
```

---

## 🎯 Ordre d'implémentation recommandé

1. **Tab Statistiques - Graphique distance par jour** (Impact max, facilité)
2. **Tab Statistiques - Pie chart répartition temps** (Visuel, facile)
3. **Tab Historique - Heatmap heures** (Utile pour analytics)
4. **Page Devices - Barres flotte** (Vue d'ensemble)
5. **Tab Live - Jauge vitesse** (Esthétique)
6. **Tab Statistiques - Évolution batterie** (Monitoring)
7. **Tab Historique - Sparklines trajets** (Polish final)

---

## 💡 Notes importantes

- **Responsive:** Tous les graphiques doivent s'adapter mobile/tablette/desktop
- **Couleurs:** Utiliser la palette existante (#00BFA6, #3B6EA5, #FFA726, #EF5350)
- **Performance:** Limiter les points de données (max 100 par graphique)
- **Mock data:** Générer des données réalistes pour la démo
- **API ready:** Prévoir les endpoints pour les données réelles:
  - `GET /api/user/devices/:id/stats/daily` (distance par jour)
  - `GET /api/user/devices/:id/stats/battery` (historique batterie)
  - `GET /api/user/devices/:id/stats/speed` (historique vitesse)
  - `GET /api/user/fleet/overview` (vue d'ensemble flotte)

---

## 🚀 Prêt à implémenter?

Dites-moi quel graphique vous voulez ajouter en premier, et je l'implémenterai avec:
- Installation de la bibliothèque
- Composant réutilisable
- Données mock réalistes
- Style cohérent avec votre design
- Responsive mobile
