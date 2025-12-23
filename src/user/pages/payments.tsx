import { useState } from 'react';
import { CreditCard, CheckCircle, Clock, XCircle, Smartphone } from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  method: 'MobileMoney' | 'Card' | 'Cash';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  isPopular: boolean;
}

export default function PaymentsPage() {
  const [payments] = useState<Payment[]>([
    {
      id: '1',
      amount: 5000,
      method: 'MobileMoney',
      status: 'completed',
      date: '2025-12-20',
      description: 'Abonnement mensuel - Premium',
    },
    {
      id: '2',
      amount: 5000,
      method: 'MobileMoney',
      status: 'completed',
      date: '2025-11-20',
      description: 'Abonnement mensuel - Premium',
    },
    {
      id: '3',
      amount: 2500,
      method: 'Card',
      status: 'pending',
      date: '2025-10-20',
      description: 'Abonnement mensuel - Basic',
    },
  ]);

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 2500,
      duration: 'mois',
      features: [
        '1 tracker GPS',
        'Suivi en temps réel',
        'Historique 30 jours',
        '5 géofences',
        'Alertes email',
      ],
      isPopular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 5000,
      duration: 'mois',
      features: [
        '5 trackers GPS',
        'Suivi en temps réel',
        'Historique illimité',
        'Géofences illimitées',
        'Alertes email + SMS',
        'Rapports détaillés',
        'Support prioritaire',
      ],
      isPopular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 15000,
      duration: 'mois',
      features: [
        'Trackers illimités',
        'Suivi en temps réel',
        'Historique illimité',
        'Géofences illimitées',
        'Alertes multi-canaux',
        'API complète',
        'Tableau de bord admin',
        'Support 24/7',
        'Formation dédiée',
      ],
      isPopular: false,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />;
      case 'failed':
        return <XCircle className="text-red-600" size={20} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Complété';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échoué';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Abonnement & Paiements</h1>
        <p className="mt-2 text-gray-600">
          Gérez votre abonnement et consultez l'historique de vos paiements
        </p>
      </div>

      {/* Current Subscription Status */}
      <div className="bg-gradient-to-br from-[#00BFA6] to-[#3B6EA5] rounded-xl p-8 text-white mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 mb-2">Plan actuel</p>
            <h2 className="text-3xl font-bold mb-4">Premium</h2>
            <div className="space-y-2">
              <p className="text-white/90">✓ 5 trackers actifs</p>
              <p className="text-white/90">✓ Renouvellement le 20 janvier 2026</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">5,000 XAF</p>
            <p className="text-white/80">par mois</p>
            <button className="mt-4 px-6 py-2 bg-white text-[#00BFA6] rounded-lg font-medium hover:shadow-lg transition-all">
              Modifier le plan
            </button>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Changer de plan</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl p-6 shadow-sm border-2 transition-all hover:shadow-lg ${
                plan.isPopular
                  ? 'border-[#00BFA6] ring-2 ring-[#00BFA6]/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-[#00BFA6] to-[#3B6EA5] text-white text-sm font-semibold rounded-full">
                    Populaire
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price.toLocaleString()}</span>
                  <span className="text-gray-600">XAF/{plan.duration}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  plan.isPopular
                    ? 'bg-gradient-to-r from-[#00BFA6] to-[#3B6EA5] text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Choisir ce plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Méthodes de paiement</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 border-2 border-[#00BFA6] rounded-lg bg-[#00BFA6]/5">
            <div className="w-12 h-12 bg-[#00BFA6] rounded-lg flex items-center justify-center">
              <Smartphone className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Mobile Money</p>
              <p className="text-sm text-gray-600">MTN, Orange, etc.</p>
            </div>
            <div className="w-4 h-4 bg-[#00BFA6] rounded-full"></div>
          </div>

          <div className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <CreditCard className="text-gray-600" size={24} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Carte bancaire</p>
              <p className="text-sm text-gray-600">Visa, Mastercard</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <CreditCard className="text-gray-600" size={24} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Virement</p>
              <p className="text-sm text-gray-600">Transfert bancaire</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Historique des paiements</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Méthode</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Montant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(payment.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{payment.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.method}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {payment.amount.toLocaleString()} XAF
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
