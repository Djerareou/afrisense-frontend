import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Check, X, Calendar, Clock, 
  Download, RefreshCw, Crown,
  Zap, TrendingUp, Shield, Smartphone,
  HelpCircle, ChevronDown, ChevronUp, Percent, Save
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  devices: number;
  features: string[];
  popular?: boolean;
  color: string;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  plan: string;
  method: string;
}

export default function SubscriptionsPage() {
  const navigate = useNavigate();
  
  const [currentPlan] = useState('pro');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  // Subscription plans
  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: billingPeriod === 'monthly' ? 200 * 30 : 200 * 365,
      period: billingPeriod,
      devices: 3,
      features: [
        '🎁 Essai gratuit 3 jours',
        '📍 Tracking GPS toutes les 2 min',
        '🕐 Historique serveur : 24h',
        '🔔 Alertes basiques (mouvement, arrêt)',
        '🗺️ Geofencing basique',
        '📱 Dashboard mobile simple',
        '💤 Tracking passif si non-paiement',
        '📧 Support email / WhatsApp',
      ],
      color: 'from-gray-500 to-gray-600',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingPeriod === 'monthly' ? 350 * 30 : 350 * 365,
      period: billingPeriod,
      devices: 50,
      features: [
        '🎁 Essai gratuit 3 jours',
        '📍 Tracking GPS toutes les 30 sec',
        '🕐 Historique serveur : 7 jours',
        '🔔 Alertes intelligentes (vitesse, déviation)',
        '🗺️ Geofencing avancé multi-zones',
        '💻 Dashboard web + mobile complet',
        '📶 Mode offline / résilience réseau',
        '🚗 Jusqu\'à 50 véhicules',
        '⚡ Support prioritaire (chat/email/tél.)',
      ],
      popular: true,
      color: 'from-[#00BFA6] to-[#00d4b8]',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: billingPeriod === 'monthly' ? 500 * 30 : 500 * 365,
      period: billingPeriod,
      devices: 999,
      features: [
        '🎁 Essai gratuit 3 jours',
        '📍 Tracking GPS temps réel (5 sec)',
        '🕐 Historique serveur : 30-90 jours',
        '🤖 Alertes IA (maintenance prédictive)',
        '🗺️ Geofencing expert + actions auto.',
        '📊 Dashboard avancé avec analytics',
        '🌍 Multi-pays / multi-device illimité',
        '🔌 API complète (intégration ERP)',
        '📶 Mode offline avancé + alertes SMS',
        '🆘 Support 24/7 avec SLA garantie',
      ],
      color: 'from-[#3B6EA5] to-[#4A8CD4]',
    },
  ];

  // Transaction history
  const transactions: Transaction[] = [
    {
      id: '1',
      date: '01 Déc 2025',
      amount: 10500,
      status: 'paid',
      plan: 'Pro',
      method: 'Mobile Money (Orange/MTN)',
    },
    {
      id: '2',
      date: '01 Nov 2025',
      amount: 10500,
      status: 'paid',
      plan: 'Pro',
      method: 'Mobile Money (Orange/MTN)',
    },
    {
      id: '3',
      date: '01 Oct 2025',
      amount: 10500,
      status: 'paid',
      plan: 'Pro',
      method: 'Mobile Money (Orange/MTN)',
    },
  ];

  const currentSubscription = plans.find(p => p.id === currentPlan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span 
              onClick={() => navigate('/')} 
              className="hover:text-[#00BFA6] transition-colors cursor-pointer"
            >
              Tableau de bord
            </span>
            <span>›</span>
            <span className="text-[#00BFA6] font-semibold">Abonnement</span>
          </div>

          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#00BFA6] via-[#3B6EA5] to-[#00BFA6] bg-clip-text text-transparent mb-2">
            Mon Abonnement
          </h1>
          <p className="text-gray-600">
            Gérez votre abonnement et consultez l'historique de vos paiements
          </p>
        </div>

        {/* Current Plan Overview */}
        {currentSubscription && (
          <div className="bg-gradient-to-br from-[#00BFA6] to-[#3B6EA5] rounded-2xl p-8 mb-8 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Crown size={32} />
                  <h2 className="text-3xl font-bold">Plan {currentSubscription.name}</h2>
                </div>
                <p className="text-white/90 mb-4">
                  Votre abonnement est actif et sera renouvelé le <strong>01 Janvier 2026</strong>
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-sm text-white/80">Trackers actifs</p>
                    <p className="text-2xl font-bold">6 / {currentSubscription.devices}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-sm text-white/80">Prochain paiement</p>
                    <p className="text-2xl font-bold">{currentSubscription.price.toLocaleString('fr-FR')} FCFA</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button className="px-6 py-3 bg-white text-[#00BFA6] rounded-xl font-semibold hover:shadow-xl transition-all flex items-center gap-2">
                  <RefreshCw size={20} />
                  Changer de plan
                </button>
                <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2">
                  <CreditCard size={20} />
                  Modifier le paiement
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Billing Period Toggle */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200 flex gap-2">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-[#00BFA6] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensuel (30 jours)
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all relative ${
                billingPeriod === 'yearly'
                  ? 'bg-[#00BFA6] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annuel (365 jours)
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                -17%
              </span>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
            <span className="text-xl">🎁</span>
            <span>Tous les plans incluent <strong>3 jours d'essai gratuit</strong></span>
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular ? 'border-[#00BFA6]' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Plus populaire
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-gray-900">
                    {plan.price.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-gray-600">FCFA</span>
                  <span className="text-gray-500">/ {plan.period === 'monthly' ? 'mois' : 'an'}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {billingPeriod === 'monthly' 
                    ? `${plan.price / 30} FCFA/jour` 
                    : `${plan.price / 365} FCFA/jour`}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Jusqu'à {plan.devices === 999 ? 'illimité' : plan.devices} véhicule{plan.devices > 1 ? 's' : ''}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check size={20} className="text-[#00BFA6] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  plan.id === currentPlan
                    ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                    : `bg-gradient-to-r ${plan.color} text-white hover:shadow-xl hover:scale-105`
                }`}
                disabled={plan.id === currentPlan}
              >
                {plan.id === currentPlan ? 'Plan actuel' : 'Choisir ce plan'}
              </button>
            </div>
          ))}
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Historique des paiements</h2>
            <p className="text-gray-600 mt-1">Consultez toutes vos transactions</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Plan</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Montant</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Méthode</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Facture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-gray-900 font-medium">{transaction.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">{transaction.plan}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-bold">{transaction.amount.toLocaleString('fr-FR')} FCFA</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          transaction.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.status === 'paid' && <Check size={14} />}
                        {transaction.status === 'pending' && <Clock size={14} />}
                        {transaction.status === 'failed' && <X size={14} />}
                        {transaction.status === 'paid' ? 'Payé' : transaction.status === 'pending' ? 'En attente' : 'Échoué'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{transaction.method}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-[#00BFA6] hover:text-[#00a896] font-semibold flex items-center gap-1 mx-auto">
                        <Download size={16} />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Savings Calculator */}
        {billingPeriod === 'yearly' && (
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl shadow-lg border border-orange-200 p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center">
                <Save className="text-white" size={32} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  💰 Économisez avec le paiement annuel!
                </h2>
                <p className="text-gray-700 mb-4">
                  En choisissant le paiement annuel, vous économisez l'équivalent de <strong>2 mois gratuits</strong> sur l'année.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Plan Starter</p>
                    <p className="text-2xl font-bold text-orange-600 flex items-center gap-2">
                      <Percent size={20} />
                      {((200 * 365) - (6000 * 12)).toLocaleString('fr-FR')} FCFA
                    </p>
                    <p className="text-xs text-gray-500 mt-1">économisés par an</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-orange-400">
                    <p className="text-sm text-gray-600 mb-1">Plan Pro ⭐</p>
                    <p className="text-2xl font-bold text-orange-600 flex items-center gap-2">
                      <Percent size={20} />
                      {((350 * 365) - (10500 * 12)).toLocaleString('fr-FR')} FCFA
                    </p>
                    <p className="text-xs text-gray-500 mt-1">économisés par an</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Plan Premium</p>
                    <p className="text-2xl font-bold text-orange-600 flex items-center gap-2">
                      <Percent size={20} />
                      {((500 * 365) - (15000 * 12)).toLocaleString('fr-FR')} FCFA
                    </p>
                    <p className="text-xs text-gray-500 mt-1">économisés par an</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Comparaison détaillée des plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Fonctionnalité</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-600 bg-gray-50">Starter</th>
                  <th className="text-center py-4 px-4 font-bold text-white bg-gradient-to-r from-[#00BFA6] to-[#00d4b8]">
                    Pro ⭐
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-white bg-gradient-to-r from-[#3B6EA5] to-[#4A8CD4]">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-semibold text-gray-900">Prix (mensuel)</td>
                  <td className="py-4 px-4 text-center text-gray-700">6 000 FCFA</td>
                  <td className="py-4 px-4 text-center font-bold text-[#00BFA6]">10 500 FCFA</td>
                  <td className="py-4 px-4 text-center text-gray-700">15 000 FCFA</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-semibold text-gray-900">Prix par jour</td>
                  <td className="py-4 px-4 text-center text-gray-700">200 FCFA</td>
                  <td className="py-4 px-4 text-center font-bold text-[#00BFA6]">350 FCFA</td>
                  <td className="py-4 px-4 text-center text-gray-700">500 FCFA</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-semibold text-gray-900">Essai gratuit</td>
                  <td className="py-4 px-4 text-center"><Check className="text-green-500 mx-auto" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="text-green-500 mx-auto" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="text-green-500 mx-auto" size={20} /></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-semibold text-gray-900">Nombre de véhicules</td>
                  <td className="py-4 px-4 text-center text-gray-700">Jusqu'à 3</td>
                  <td className="py-4 px-4 text-center font-bold text-[#00BFA6]">Jusqu'à 50</td>
                  <td className="py-4 px-4 text-center text-gray-700">Illimité</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-semibold text-gray-900">Fréquence de tracking</td>
                  <td className="py-4 px-4 text-center text-gray-700">Toutes les 2 min</td>
                  <td className="py-4 px-4 text-center font-bold text-[#00BFA6]">Toutes les 30 sec</td>
                  <td className="py-4 px-4 text-center text-gray-700">Temps réel (5 sec)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-semibold text-gray-900">Historique serveur</td>
                  <td className="py-4 px-4 text-center text-gray-700">24 heures</td>
                  <td className="py-4 px-4 text-center font-bold text-[#00BFA6]">7 jours</td>
                  <td className="py-4 px-4 text-center text-gray-700">30-90 jours</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-semibold text-gray-900">Alertes</td>
                  <td className="py-4 px-4 text-center text-gray-700">Basiques</td>
                  <td className="py-4 px-4 text-center font-bold text-[#00BFA6]">Intelligentes</td>
                  <td className="py-4 px-4 text-center text-gray-700">IA prédictive</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-semibold text-gray-900">Geofencing</td>
                  <td className="py-4 px-4 text-center text-gray-700">Basique</td>
                  <td className="py-4 px-4 text-center font-bold text-[#00BFA6]">Multi-zones</td>
                  <td className="py-4 px-4 text-center text-gray-700">Expert + actions auto.</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-semibold text-gray-900">Dashboard</td>
                  <td className="py-4 px-4 text-center text-gray-700">Mobile simple</td>
                  <td className="py-4 px-4 text-center font-bold text-[#00BFA6]">Web + Mobile</td>
                  <td className="py-4 px-4 text-center text-gray-700">Avancé + Analytics</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-semibold text-gray-900">Mode offline</td>
                  <td className="py-4 px-4 text-center"><X className="text-red-500 mx-auto" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="text-green-500 mx-auto" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="text-green-500 mx-auto" size={20} /></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-semibold text-gray-900">API / Intégration ERP</td>
                  <td className="py-4 px-4 text-center"><X className="text-red-500 mx-auto" size={20} /></td>
                  <td className="py-4 px-4 text-center"><X className="text-red-500 mx-auto" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="text-green-500 mx-auto" size={20} /></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-semibold text-gray-900">Support</td>
                  <td className="py-4 px-4 text-center text-gray-700">Email / WhatsApp</td>
                  <td className="py-4 px-4 text-center font-bold text-[#00BFA6]">Prioritaire</td>
                  <td className="py-4 px-4 text-center text-gray-700">24/7 SLA</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-semibold text-gray-900">Tracking passif</td>
                  <td className="py-4 px-4 text-center"><Check className="text-green-500 mx-auto" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="text-green-500 mx-auto" size={20} /></td>
                  <td className="py-4 px-4 text-center"><Check className="text-green-500 mx-auto" size={20} /></td>
                </tr>
                <tr className="bg-orange-50 hover:bg-orange-100">
                  <td className="py-4 px-4 font-semibold text-gray-900">Assistance vol</td>
                  <td className="py-4 px-4 text-center text-gray-700">2 000 FCFA</td>
                  <td className="py-4 px-4 text-center font-bold text-[#00BFA6]">3 000 FCFA</td>
                  <td className="py-4 px-4 text-center text-gray-700">5 000 FCFA</td>
                </tr>
                <tr className="bg-orange-50 hover:bg-orange-100">
                  <td className="py-4 px-4 font-semibold text-gray-900">Reporting avancé</td>
                  <td className="py-4 px-4 text-center text-gray-700">1 000 FCFA</td>
                  <td className="py-4 px-4 text-center font-bold text-[#00BFA6]">2 000 FCFA</td>
                  <td className="py-4 px-4 text-center text-gray-700">3 000-5 000 FCFA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HelpCircle className="text-[#00BFA6]" size={28} />
            Questions fréquentes (FAQ)
          </h2>
          <div className="space-y-4">
            {[
              {
                id: 1,
                question: "Comment fonctionne l'essai gratuit de 3 jours?",
                answer: "L'essai gratuit de 3 jours commence dès votre inscription. Vous avez accès à toutes les fonctionnalités de votre plan choisi sans aucun paiement. Aucune carte bancaire n'est requise. À la fin de l'essai, vous pouvez décider de continuer avec un paiement, ou votre compte passera en mode 'tracking passif' qui conserve la localisation pour les événements critiques."
              },
              {
                id: 2,
                question: "Quels modes de paiement acceptez-vous?",
                answer: "Nous acceptons Orange Money et MTN Mobile Money, les deux solutions de paiement mobile les plus utilisées en Afrique. Le paiement est sécurisé et instantané. Vous recevez une confirmation par SMS après chaque transaction réussie."
              },
              {
                id: 3,
                question: "Qu'est-ce que le 'tracking passif' si je ne paie pas?",
                answer: "Le tracking passif est une fonctionnalité unique d'AfriSense. Même si votre abonnement expire, votre véhicule continue d'être localisé en cas d'événement critique (vol, urgence). Vous ne pouvez pas accéder aux fonctionnalités avancées, mais vous gardez la sécurité de base. C'est notre engagement pour la sécurité de tous nos utilisateurs."
              },
              {
                id: 4,
                question: "Puis-je changer de plan à tout moment?",
                answer: "Oui, vous pouvez passer à un plan supérieur à tout moment. L'upgrade est immédiat et vous ne payez que la différence proratisée jusqu'à la fin de votre période de facturation. Pour un downgrade, le changement prendra effet à la fin de votre période actuelle."
              },
              {
                id: 5,
                question: "Y a-t-il des frais cachés ou des frais d'installation?",
                answer: "Non, absolument aucun frais caché. Le prix affiché est le prix que vous payez. Les seuls frais additionnels sont les services post-événement (assistance vol, reporting avancé) que vous pouvez commander à la demande si nécessaire."
              },
              {
                id: 6,
                question: "Que se passe-t-il en cas de coupure Internet ou réseau?",
                answer: "Les plans Pro et Premium incluent le mode offline. Votre tracker stocke automatiquement les positions GPS localement pendant la coupure, puis les envoie au serveur dès que la connexion revient. Le plan Premium ajoute même des alertes SMS pour les événements critiques pendant les coupures réseau."
              },
              {
                id: 7,
                question: "Comment fonctionne l'assistance en cas de vol?",
                answer: "En cas de vol, contactez immédiatement notre équipe via WhatsApp ou téléphone. Nous activons le tracking prioritaire en temps réel (5 secondes) et travaillons avec vous et les autorités pour localiser votre véhicule. Le service coûte 2 000 à 5 000 FCFA selon votre plan et inclut le support jusqu'à la récupération."
              },
              {
                id: 8,
                question: "Puis-je obtenir une facture pour mon entreprise?",
                answer: "Oui, toutes les transactions génèrent automatiquement une facture PDF téléchargeable depuis votre espace 'Historique des paiements'. La facture inclut tous les détails nécessaires pour la comptabilité d'entreprise (TVA, numéro de facture, détails de paiement)."
              }
            ].map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-left text-gray-900">{faq.question}</span>
                  {openFaqId === faq.id ? (
                    <ChevronUp className="text-[#00BFA6] flex-shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                  )}
                </button>
                {openFaqId === faq.id && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-gradient-to-r from-[#00BFA6]/10 to-[#3B6EA5]/10 rounded-xl border border-[#00BFA6]/20">
            <p className="text-gray-800 font-medium mb-2">Vous avez d'autres questions?</p>
            <p className="text-gray-600 mb-4">Notre équipe de support est disponible pour vous aider.</p>
            <div className="flex flex-wrap gap-3">
              <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <Smartphone size={18} />
                WhatsApp
              </a>
              <a href="mailto:support@afrisense.com" className="inline-flex items-center gap-2 px-4 py-2 bg-[#00BFA6] text-white rounded-lg hover:bg-[#00a890] transition-colors">
                📧 Email
              </a>
            </div>
          </div>
        </div>

        {/* Post-Event Services */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🆘 Services post-événement</h2>
          <p className="text-gray-600 mb-6">
            En cas de vol ou besoin d'assistance, bénéficiez de nos services d'intervention rapide
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter Services */}
            <div className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Plan Starter</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Localisation / assistance vol</p>
                    <p className="text-xl font-bold text-[#00BFA6]">2 000 FCFA</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Reporting basique</p>
                    <p className="text-xl font-bold text-[#00BFA6]">1 000 FCFA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Services */}
            <div className="border-2 border-[#00BFA6] rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#00BFA6] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAIRE
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Plan Pro</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-[#00BFA6] rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Localisation / assistance vol</p>
                    <p className="text-xl font-bold text-[#00BFA6]">3 000 FCFA</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-[#00BFA6] rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Export PDF / reporting complet</p>
                    <p className="text-xl font-bold text-[#00BFA6]">2 000 FCFA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Services */}
            <div className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Plan Premium</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-[#3B6EA5] rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Localisation / assistance vol</p>
                    <p className="text-xl font-bold text-[#3B6EA5]">5 000 FCFA</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-[#3B6EA5] rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Analyse / reporting avancé</p>
                    <p className="text-xl font-bold text-[#3B6EA5]">3 000–5 000 FCFA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pourquoi choisir AfriSense?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="text-blue-600" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Temps réel</h3>
              <p className="text-sm text-gray-600">Suivi GPS en direct avec rafraîchissement toutes les 10 secondes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sécurisé</h3>
              <p className="text-sm text-gray-600">Données chiffrées et conformité RGPD garantie</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-purple-600" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Analytique</h3>
              <p className="text-sm text-gray-600">Rapports détaillés et statistiques avancées</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-orange-600" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Multi-plateforme</h3>
              <p className="text-sm text-gray-600">Accessible sur web, iOS et Android</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
