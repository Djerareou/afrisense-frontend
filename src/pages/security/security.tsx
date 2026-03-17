import SecuritySection from '@/pages/settings/components/SecuritySection';

export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Sécurité</h1>
        <p className="text-sm text-gray-600">Gérez la sécurité de votre compte et les méthodes d'authentification</p>
      </div>

      <SecuritySection />
    </div>
  );
}
