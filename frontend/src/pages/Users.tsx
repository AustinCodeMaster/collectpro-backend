import { useState, useEffect } from 'react';
import { api } from '../api/axiosConfig';
import { useAuth, Role, type RoleType } from '../contexts/AuthContext';
import { Plus, Search, Shield } from 'lucide-react';

interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  tenantId?: string;
  tenant?: {
    name: string;
  };
}

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [tenants, setTenants] = useState<{id: string; name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: RoleType;
    tenantId: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: Role.AGENT,
    tenantId: '',
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [usersRes, tenantsRes] = await Promise.all([
        api.get('/users'),
        user?.role === Role.SUPER_ADMIN ? api.get('/tenants') : Promise.resolve({ data: [] }),
      ]);
      setUsers(usersRes.data);
      if (tenantsRes.data) setTenants(tenantsRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      
      // If the current user is not a super admin, the backend should assign their tenant ID anyway, but we can be explicit
      if (user?.role !== Role.SUPER_ADMIN) {
         payload.tenantId = user?.tenantId || '';
      }

      await api.post('/users', payload);
      setFormData({ firstName: '', lastName: '', email: '', password: '', role: Role.AGENT, tenantId: '' });
      setIsCreating(false);
      fetchData();
    } catch (error: any) {
      console.error('Failed to create user', error);
      alert(error.response?.data?.error || 'Error creating user.');
    }
  };

  const getRoleBadge = (role: string) => {
    let styles = 'bg-gray-100 text-gray-800';
    if (role === Role.SUPER_ADMIN) styles = 'bg-purple-100 text-purple-800';
    if (role === Role.TENANT_ADMIN) styles = 'bg-indigo-100 text-indigo-800';
    if (role === Role.MANAGER) styles = 'bg-blue-100 text-blue-800';
    if (role === Role.AGENT) styles = 'bg-green-100 text-green-800';
    if (role === Role.FINANCE_OFFICER) styles = 'bg-yellow-100 text-yellow-800';

    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles}`}>{role.replace('_', ' ')}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users & Staff</h1>
          <p className="text-sm text-gray-500 mt-1">Manage admins, managers, and agents in the system.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="mt-4 sm:mt-0 flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </button>
      </div>

      {isCreating && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Shield className="h-5 w-5 mr-2 text-gray-500" /> Create New User</h2>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value as RoleType})} className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-500 bg-white">
                  {user?.role === Role.SUPER_ADMIN && <option value={Role.SUPER_ADMIN}>Super Admin</option>}
                  {user?.role === Role.SUPER_ADMIN && <option value={Role.TENANT_ADMIN}>Tenant Admin</option>}
                  <option value={Role.TENANT_ADMIN}>Tenant Admin</option>
                  <option value={Role.MANAGER}>Manager</option>
                  <option value={Role.FINANCE_OFFICER}>Finance Officer</option>
                  <option value={Role.AGENT}>Agent</option>
                </select>
              </div>
              
              {user?.role === Role.SUPER_ADMIN && formData.role !== Role.SUPER_ADMIN && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Tenant</label>
                  <select required value={formData.tenantId} onChange={(e) => setFormData({...formData, tenantId: e.target.value})} className="w-full rounded-lg border border-gray-300 py-2 px-3 bg-white">
                    <option value="">Select a company...</option>
                    {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setIsCreating(false)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700">Create Account</button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search users by name or email..." className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                {user?.role === Role.SUPER_ADMIN && <th className="px-6 py-3">Tenant</th>}
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-4 text-center">Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-4 text-center">No users found.</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold uppercase">
                        {u.firstName[0]}{u.lastName[0]}
                      </div>
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">{getRoleBadge(u.role)}</td>
                    {user?.role === Role.SUPER_ADMIN && (
                      <td className="px-6 py-4 text-gray-500">{u.tenant?.name || 'System Root'}</td>
                    )}
                    <td className="px-6 py-4">
                      {u.isActive ? <span className="text-green-600 font-medium">Active</span> : <span className="text-red-500 font-medium">Disabled</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
