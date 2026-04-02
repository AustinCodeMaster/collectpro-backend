import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/axiosConfig';
import { Search, Phone, Mail, Filter, Eye } from 'lucide-react';

interface Debtor {
  id: string;
  name: string;
  phones: string[];
  email: string | null;
  status: string;
  _count?: { debts: number };
}

export default function Debtors() {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDebtors();
  }, []);

  const fetchDebtors = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/debtors');
      setDebtors(res.data);
    } catch (error) {
      console.error('Failed to fetch debtors', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    let styles = 'bg-gray-100 text-gray-800';
    if (status === 'ACTIVE') styles = 'bg-red-100 text-red-800';
    if (status === 'PROMISE_TO_PAY') styles = 'bg-yellow-100 text-yellow-800';
    if (status === 'CONTACTED') styles = 'bg-blue-100 text-blue-800';
    if (status === 'CLOSED') styles = 'bg-green-100 text-green-800';
    if (status === 'UNREACHABLE') styles = 'bg-gray-200 text-gray-600';

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const filteredDebtors = debtors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.email && d.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    d.phones.some(p => p.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Debtors</h1>
          <p className="text-sm text-gray-500 mt-1">Manage assigned accounts, view contact details, and log calls.</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-4 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="mr-2 h-4 w-4 text-gray-500" />
            Filter Status
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Debtor Info</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Active Debts</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading assigned debtors...</td></tr>
              ) : filteredDebtors.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No debtors found in your queue.</td></tr>
              ) : (
                filteredDebtors.map((debtor) => (
                  <tr key={debtor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {debtor.name}
                    </td>
                    <td className="px-6 py-4 space-y-1 text-xs">
                      {debtor.phones.length > 0 && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="mr-1.5 h-3 w-3" /> {debtor.phones[0]}
                        </div>
                      )}
                      {debtor.email && (
                        <div className="flex items-center text-gray-500">
                          <Mail className="mr-1.5 h-3 w-3" /> {debtor.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(debtor.status)}
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      {debtor._count?.debts || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/debtors/${debtor.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                        <Eye className="mr-1 h-4 w-4" /> View Profile
                      </Link>
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
