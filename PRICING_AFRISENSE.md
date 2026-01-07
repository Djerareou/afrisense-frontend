# Plan d'abonnement AfriSense – MVP

## 📋 Résumé des Plans

| Fonctionnalité | Starter | Pro | Premium |
|----------------|---------|-----|---------|
| **Prix/jour** | 200 FCFA | 350 FCFA | 500 FCFA |
| **Prix/mois** | 6 000 FCFA | 10 500 FCFA | 15 000 FCFA |
| **Prix/an** | 73 000 FCFA | 127 750 FCFA | 182 500 FCFA |
| **Essai gratuit** | ✔ 3 jours | ✔ 3 jours | ✔ 3 jours |
| **Véhicules max** | 3 | 50 | Illimité |
| **Fréquence tracking** | 2 minutes | 30 secondes | 5 secondes |
| **Historique serveur** | 24h | 7 jours | 30-90 jours |
| **Type d'alertes** | Basiques | Intelligentes | IA prédictive |
| **Geofencing** | Basique | Multi-zones | Expert + auto. |
| **Dashboard** | Mobile simple | Web + Mobile | Avancé + Analytics |
| **Mode offline** | ❌ | ✔ | ✔ Avancé + SMS |
| **API** | ❌ | ❌ | ✔ Complète |
| **Support** | Email/WhatsApp | Prioritaire | 24/7 SLA |

## 🎯 Cibles par Plan

### 1️⃣ Plan Starter
**Public cible:** Moto-taxis, petits taxis, micro-entrepreneurs (1 à 3 véhicules)

**Fonctionnalités:**
- ✅ Tracking GPS toutes les 2 minutes
- ✅ Historique côté serveur : 24h (limité)
- ✅ Alertes basiques : mouvement, arrêt prolongé
- ✅ Geofencing basique : notification lorsqu'un véhicule sort d'une zone définie
- ✅ Dashboard mobile simple
- ✅ Tracking passif si non-paiement : le véhicule reste localisable pour événements critiques
- ✅ Support email / WhatsApp basique

**Services post-event:**
- 🆘 Localisation / assistance vol : **2 000 FCFA**
- 📄 Reporting basique : **1 000 FCFA**

---

### 2️⃣ Plan Pro
**Public cible:** PME, petites flottes, sociétés de livraison (3 à 50 véhicules)

**Fonctionnalités:**
- ✅ Tracking GPS toutes les 30 secondes
- ✅ Historique côté serveur : 7 jours
- ✅ Alertes intelligentes : vitesse, déviation d'itinéraire, zones interdites
- ✅ Geofencing avancé : multi-zones, notifications en temps réel
- ✅ Dashboard web + mobile complet
- ✅ Multi-device (jusqu'à 50 véhicules)
- ✅ Mode offline / résilience réseau : les positions sont stockées et envoyées automatiquement après coupure Internet
- ✅ Suivi passif si non-paiement
- ✅ Support prioritaire : chat / email / téléphone

**Services post-event:**
- 🆘 Localisation / assistance vol : **3 000 FCFA**
- 📄 Export PDF / reporting complet : **2 000 FCFA**

---

### 3️⃣ Plan Premium
**Public cible:** Grandes flottes > 50 véhicules, ONG internationales, sociétés de sécurité

**Fonctionnalités:**
- ✅ Tracking GPS temps réel (5 sec)
- ✅ Historique côté serveur : 30 à 90 jours
- ✅ Alertes IA : comportement suspect, maintenance prédictive
- ✅ Geofencing expert : multi-zones, alertes critiques, actions automatisées
- ✅ Dashboard avancé avec analytics et reporting détaillé
- ✅ Multi-pays / multi-device illimité
- ✅ Mode offline avancé avec envoi automatique et alertes SMS pour événements critiques
- ✅ API complète pour intégration ERP / systèmes tiers
- ✅ Suivi passif si non-paiement
- ✅ Support 24/7 avec SLA garantie (ex. réponse <1h, intervention <24h)

**Services post-event:**
- 🆘 Localisation / assistance vol : **5 000 FCFA**
- 📄 Analyse / reporting avancé : **3 000–5 000 FCFA**

---

## 💡 Avantages Compétitifs

### ✅ Tracking Passif
Tous les plans incluent le **tracking passif** en cas de non-paiement. Le véhicule reste localisable pour les événements critiques (vol, urgence), garantissant une sécurité continue même sans abonnement actif.

### ✅ Paiement Mobile
Intégration avec **Orange Money** et **MTN Mobile Money** pour des paiements faciles et sécurisés adaptés au marché africain.

### ✅ Mode Offline
Plans Pro et Premium : Stockage automatique des positions en cas de coupure réseau, avec synchronisation automatique dès le retour de la connexion.

### ✅ Support Local
Support adapté au contexte africain avec assistance en français, WhatsApp, et numéros locaux.

---

## 📊 Calcul des Prix

### Prix journaliers
- **Starter**: 200 FCFA/jour
- **Pro**: 350 FCFA/jour  
- **Premium**: 500 FCFA/jour

### Prix mensuels (30 jours)
- **Starter**: 6 000 FCFA/mois
- **Pro**: 10 500 FCFA/mois
- **Premium**: 15 000 FCFA/mois

### Prix annuels (365 jours)
- **Starter**: 73 000 FCFA/an
- **Pro**: 127 750 FCFA/an
- **Premium**: 182 500 FCFA/an

---

## 🚀 Implémentation Technique

### Page d'abonnement (`/subscriptions`)
✅ Affichage des 3 plans avec détails complets  
✅ Toggle mensuel/annuel avec calcul automatique  
✅ Badge "Essai gratuit 3 jours" sur tous les plans  
✅ Affichage du prix journalier sous le prix principal  
✅ Section "Services post-événement" avec tarifs  
✅ Historique des paiements avec Mobile Money  
✅ Devise: **FCFA** (Franc CFA)  
✅ Emojis pour une meilleure lisibilité  

### Données mockées actuelles
- Plan actif: **Pro** (10 500 FCFA/mois)
- Trackers utilisés: 6/50
- Méthode de paiement: Mobile Money (Orange/MTN)
- Historique: 3 transactions payées (Dec, Nov, Oct 2025)

---

## 📝 Prochaines Étapes

1. **Intégration Mobile Money**
   - Orange Money API
   - MTN Mobile Money API
   - Gestion des webhooks de paiement

2. **Gestion des essais gratuits**
   - Activation automatique de 3 jours
   - Notification avant expiration
   - Transition vers plan payant

3. **Services post-événement**
   - Formulaire de demande d'assistance vol
   - Génération de rapports PDF
   - Système de facturation pour services ponctuels

4. **Mode offline**
   - Buffer local des positions GPS
   - Synchronisation automatique
   - Alertes SMS pour événements critiques (Premium)

5. **API Enterprise**
   - Documentation API REST
   - Authentification JWT
   - Webhooks pour intégrations ERP
