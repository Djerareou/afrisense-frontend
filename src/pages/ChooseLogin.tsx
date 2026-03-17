import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChooseLogin() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Connectez-vous</h2>
        <p className="text-sm text-gray-600 mb-6">Choisissez si vous voulez vous connecter en tant qu'utilisateur ou en tant qu'administrateur.</p>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => {
              navigate('/login');
            }}
            className="w-full px-4 py-3 bg-gradient-to-r from-[#00BFA6] to-[#00d4b8] text-white rounded-lg font-semibold"
          >
            Se connecter en tant qu'utilisateur
          </button>

          <button
            onClick={() => {
              navigate('/admin/login');
            }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
          >
            Se connecter en tant qu'administrateur
          </button>
        </div>
      </div>
    </div>
  );
}
