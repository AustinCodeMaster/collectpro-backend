import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth, Role } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  PhoneCall, 
  CreditCard, 
  BookOpen, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null;

  // Define navigation based on Role
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: Object.values(Role) },
    { name: 'Tenants', path: '/tenants', icon: Building, roles: [Role.SUPER_ADMIN] },
    { name: 'Users', path: '/users', icon: Users, roles: [Role.SUPER_ADMIN, Role.TENANT_ADMIN] },
    { name: 'Agents', path: '/agents', icon: PhoneCall, roles: [Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER] },
    { name: 'Campaigns', path: '/campaigns', icon: BookOpen, roles: [Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER] },
    { name: 'Debtors', path: '/debtors', icon: Users, roles: [Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER, Role.AGENT] },
    { name: 'Payments & Ledger', path: '/payments', icon: CreditCard, roles: Object.values(Role) },
  ];

  // Only show navigation items the user has access to
  const filteredNav = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
      
      {/* Mobile sidebar backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between space-x-2 border-b px-6">
          <span className="text-xl font-extrabold text-blue-600">CollectPro</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100vh-4rem)] justify-between p-4">
          <nav className="space-y-1">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t pt-4">
            <div className="mb-4 px-4">
              <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <p className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                {user.role.replace('_', ' ')}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header (Visible on Mobile to toggle menu) */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-lg font-bold text-blue-600">CollectPro</span>
          <div className="w-6" /> {/* Spacer for centering */}
        </header>

        {/* Dynamic Page Content goes here */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
