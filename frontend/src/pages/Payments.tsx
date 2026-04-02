import { useState, useEffect } from 'react';
import { api } from '../api/axiosConfig';
import { CreditCard, Search, DownloadCloud, DollarSign } from 'lucide-react';

interface Payment {
  id: string;
  amount: string;
  paymentDate: string;
  notes: string | null;
  debt: {
    id: string;
    originalAmount: string;
    debtor: {
      name: string;
    };
  };
  agent: {
    firstName: string;
    lastName: string;
  } | null;
  financeOfficer: {
    firstName: string;
    lastName: string;
  } | null;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/payments');
      setPayments(res.data);
    } catch (error) {
      console.error('Failed to fetch payments', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPayments = payments.filter(p =>
    p.debt.debtor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.agent && (p.agent.firstName + ' ' + p.agent.lastName).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Ledger</h1>
          <p className="text-sm text-gray-500 mt-1">Track financial inflows and settled accounts.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <button className="inline-flex items-center rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
            <DownloadCloud className="mr-2 h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <div className="flex items-center text-green-600 mb-2">
            <DollarSign className="h-5 w-5 mr-1" />
            <h3 className="text-sm font-medium">Total Collected</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${payments.reduce((acc, curr) => acc + Number(curr.amount), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <div className="flex items-center text-blue-600 mb-2">
            <CreditCard className="h-5 w-5 mr-1" />
            <h3 className="text-sm font-medium">Transactions</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {payments.length}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-4 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by debtor or agent name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Debtor</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Recorded By</th>
                <th className="px-6 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading ledger...</td></tr>
              ) : filteredPayments.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No payment records found.</td></tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                      {new Date(payment.paymentDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {payment.debt.debtor.name}
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600">
                      +${Number(payment.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-700">
                      {payment.agent ? `${payment.agent.firstName} ${payment.agent.lastName}` : (
                        payment.financeOfficer ? `${payment.financeOfficer.firstName} ${payment.financeOfficer.lastName}` : 'System'
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate" title={payment.notes || ''}>
                      {payment.notes || 'â€”'}
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
