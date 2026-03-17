import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '@/auth/auth.context';
import Header from '@/components/layout/Header';

export default function AdminLayout() {
	const { user, logout } = useAuth();

	return (
		<div className="min-h-screen flex bg-gray-50">
			{/* Sidebar */}
			<aside className="w-64 bg-white border-r hidden md:block">
				<div className="p-4 border-b">
					<h2 className="text-lg font-semibold">AfriSense Admin</h2>
				</div>
				<nav className="p-4 space-y-2">
					<Link to="/admin" className="block px-3 py-2 rounded hover:bg-gray-100">Dashboard</Link>
					<Link to="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-100">Users</Link>
					<Link to="/admin/devices" className="block px-3 py-2 rounded hover:bg-gray-100">Devices</Link>
					<Link to="/admin/alerts" className="block px-3 py-2 rounded hover:bg-gray-100">Alerts</Link>
					<Link to="/admin/geofences" className="block px-3 py-2 rounded hover:bg-gray-100">Geofences</Link>
					<Link to="/admin/subscriptions" className="block px-3 py-2 rounded hover:bg-gray-100">Subscriptions</Link>
					<Link to="/admin/logs" className="block px-3 py-2 rounded hover:bg-gray-100">Logs</Link>
					<Link to="/admin/settings" className="block px-3 py-2 rounded hover:bg-gray-100">Settings</Link>
				</nav>
			</aside>

			<div className="flex-1 min-h-screen flex flex-col">
				<Header />

				<main className="flex-1 p-4">
					<div className="max-w-7xl mx-auto">
						<div className="mb-4 flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-semibold">Admin</h1>
								<p className="text-sm text-gray-500">Manage users, devices, billing and more.</p>
							</div>
							<div className="flex items-center gap-3">
								<div className="text-right">
									<div className="text-sm font-medium">{user?.name}</div>
									<div className="text-xs text-gray-500">{user?.email}</div>
								</div>
								<button onClick={() => logout()} className="px-3 py-2 bg-red-50 text-red-600 rounded">Logout</button>
							</div>
						</div>

						{/* outlet for nested admin pages */}
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}
