import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../auth/auth.context';
// Import Login and Register pages
import Login from '../auth/pages/Login';
import Register from '../auth/pages/Register';
import PasswordResetRequest from '../auth/pages/PasswordResetRequest';
import AdminLogin from '../auth/pages/AdminLoginFixed';
import ProtectedRoute from '../auth/ProtectedRoute';
import Alerts from '../pages/Alerts';
import Geofences from '../user/pages/geofences';
import Devices from '../user/pages/devices';
import TrackerDetails from '../user/pages/tracker/[id]';
import Subscriptions from '../user/pages/subscriptions';
import ProfilePage from '../user/pages/profile';
import SettingsPage from '../pages/settings/settings';
import SecurityPage from '../pages/security/security';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ChooseLogin from '../pages/ChooseLogin';
import TrackerList from '../components/tracking/TrackerList';
import AlertsPanel from '../components/alerts/AlertsPanel';
import MapView from '../components/map/MapView';
import AdminLayout from './layouts/AdminLayout';
import AdminRoute from '../auth/AdminRoute';
// Dynamically import all admin pages from src/admin/pages — each file becomes a nested route under /admin
const adminModules = import.meta.glob('../admin/pages/*.tsx', { eager: true }) as Record<string, any>;
// Build an array of { path, component } for each admin page
const adminRoutes = Object.keys(adminModules).map((filePath) => {
  // filePath example: '../admin/pages/users.tsx' → name 'users'
  const match = filePath.match(/\.\.\/admin\/pages\/(.*)\.tsx$/);
  const name = match ? match[1] : filePath;
  // index route when file is 'dashboard' -> treat as index
  const path = name === 'dashboard' ? '' : name;
  const component = adminModules[filePath].default;
  return { path, component };
});



function Dashboard() {
  const [selectedTrackerId, setSelectedTrackerId] = useState('car1');
  const [activeTab, setActiveTab] = useState<'map' | 'trackers' | 'alerts'>('map');

  // Mock data
  const trackers = [
    {
      id: 'car1',
      name: 'Car 1',
      status: 'online' as const,
      speed: 45,
      battery: 80,
    },
    {
      id: 'bike1',
      name: 'Bike 01',
      status: 'offline' as const,
      lastSeen: 'Dernière connexion il y a 2h',
    },
    {
      id: 'truck1',
      name: 'Truck 01',
      status: 'online' as const,
      speed: 60,
      battery: 95,
    },
  ];

  const alerts = [
    {
      id: '1',
      type: 'battery' as const,
      title: 'Battery Low',
      severity: 'medium' as const,
      time: '12:30 PM',
    },
    {
      id: '2',
      type: 'speed' as const,
      title: 'Speed Alert',
      severity: 'high' as const,
      time: '12:15 PM',
    },
    {
      id: '3',
      type: 'geofence' as const,
      title: 'Geofence Entered',
      severity: 'low' as const,
      time: '12:45 PM',
    },
  ];

  // Map coordinates (N'Djamena, Chad)
  const mapCenter: [number, number] = [12.1348, 15.0557];
  const trackerPosition: [number, number] = [12.1348, 15.0557];
  const geofenceCenter: [number, number] = [12.1348, 15.0557];
  const historyPath: [number, number][] = [
    [12.1300, 15.0500],
    [12.1320, 15.0530],
    [12.1335, 15.0540],
    [12.1348, 15.0557],
  ];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-100 max-w-full">
      <Header />
      
          {/* Mobile Tabs - Only visible on small screens */}
          <div className="lg:hidden bg-white border-b border-gray-200 flex font-['Inter'] w-full shrink-0">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all ${
            activeTab === 'map'
              ? 'bg-[#00BFA6] text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="mr-1 sm:mr-2">🗺️</span>
          Carte
        </button>
        <button
          onClick={() => setActiveTab('trackers')}
          className={`flex-1 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all ${
            activeTab === 'trackers'
              ? 'bg-[#00BFA6] text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="mr-1 sm:mr-2">🚗</span>
          Traqueurs
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all relative ${
            activeTab === 'alerts'
              ? 'bg-[#00BFA6] text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="mr-1 sm:mr-2">🔔</span>
          Alertes
          <span className="absolute top-1 right-1 sm:right-2 bg-[#FF7F50] text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
            3
          </span>
        </button>
      </div>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Hidden on mobile, visible on desktop */}
        <div className={`${activeTab === 'trackers' ? 'absolute inset-0 z-10' : 'hidden'} lg:relative lg:block w-full lg:w-auto`}>
          <TrackerList
            trackers={trackers}
            selectedId={selectedTrackerId}
            onSelect={setSelectedTrackerId}
            onAddTracker={() => alert('Ajouter un traqueur')}
          />
        </div>

        {/* Center Map - Hidden on mobile based on active tab, always visible on desktop */}
        <div className={`${activeTab === 'map' ? 'absolute inset-0 z-10' : 'hidden'} lg:relative lg:block flex-1`}>
          <MapView
            center={mapCenter}
            zoom={13}
            trackerPosition={trackerPosition}
            geofenceCenter={geofenceCenter}
            geofenceRadius={500}
            historyPath={historyPath}
            speed={45}
            battery={80}
            lastUpdate="12:45 PM"
          />
        </div>

        {/* Right Sidebar - Hidden on mobile, visible on desktop */}
        <div className={`${activeTab === 'alerts' ? 'absolute inset-0 z-10' : 'hidden'} lg:relative lg:block w-full lg:w-auto`}>
          <AlertsPanel
            alerts={alerts}
            onViewAll={() => alert('Afficher toutes les alertes')}
          />
        </div>
      </main>
      <Footer />
      </div>
  );
}
export default function App() {
  return (
<BrowserRouter>
  <AuthProvider>
    <Routes>
    {/* PUBLIC */}
    {/* PUBLIC ROUTES: Login & Register */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/password-reset" element={<PasswordResetRequest />} />
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/" element={<ChooseLogin />} />

      {/* PROTECTED */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/alerts"
        element={
          <ProtectedRoute>
            <Alerts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/geofences"
        element={
          <ProtectedRoute>
            <Geofences />
          </ProtectedRoute>
        }
      />

      <Route
        path="/devices"
        element={
          <ProtectedRoute>
            <Devices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subscriptions"
        element={
          <ProtectedRoute>
            <Subscriptions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/security"
        element={
          <ProtectedRoute>
            <SecurityPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tracker/:id"
        element={
          <ProtectedRoute>
            <TrackerDetails />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </ProtectedRoute>
        }
      >
        {adminRoutes.map((r) => (
          r.path === '' ? (
            <Route key="admin-index" index element={<r.component />} />
          ) : (
            <Route key={r.path} path={r.path} element={<r.component />} />
          )
        ))}
      </Route>
    </Routes>
  </AuthProvider>
</BrowserRouter>
  );
}