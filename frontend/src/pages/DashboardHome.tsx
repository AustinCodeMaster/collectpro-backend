
import { useAuth } from '../contexts/AuthContext';
import { Users, DollarSign, Building, PhoneCall, ArrowUpRight } from 'lucide-react';

export default function DashboardHome() {
  const { user } = useAuth();

  if (!user) return null;

  // Render dummy stats based on role
  const getStats = () => {
    switch (user.role) {
      case 'SUPER_ADMIN':
        return [
          { label: 'Active Tenants', value: '45', icon: Building, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Total MRR', value: '$12,400', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        ];
      case 'TENANT_ADMIN':
        return [
          { label: 'Total Agents', value: '12', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
          { label: 'Active Campaigns', value: '3', icon: PhoneCall, color: 'text-blue-600', bg: 'bg-blue-100' },
        ];
      case 'MANAGER':
        return [
          { label: 'Team Agents', value: '8', icon: Users, color: 'text-teal-600', bg: 'bg-teal-100' },
          { label: 'PTPs Today', value: '24', icon: ArrowUpRight, color: 'text-orange-600', bg: 'bg-orange-100' },
        ];
      case 'AGENT':
        return [
          { label: 'Calls Made', value: '64', icon: PhoneCall, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Collected Today', value: '$1,240', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        ];
      case 'FINANCE_OFFICER':
        return [
          { label: 'Payments Clear', value: '$14,050', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        ];
      default:
        return [];
    }
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.firstName}!</h1>
        <p className="text-gray-500 mt-1">Here is what's happening with your account today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="flex items-center rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <div className={`mr-4 flex h-12 w-12 items-center justify-center rounded-full ${stat.bg}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="h-48 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-400">Activity graph will go here in Phase 3</p>
        </div>
      </div>
    </div>
  );
}
