import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api as axios } from '../api/axiosConfig';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  AlertCircle,
  CreditCard,
  History
} from 'lucide-react';

interface DebtorDetail {
  id: string;
  name: string;
  email: string | null;
  phones: string[];
  address: string | null;
  status: string;
  customFields: any;
  debts: Array<{
    id: string;
    originalAmount: number;
    currentBalance: number;
    interestRate: number;
    status: string;
    dueDate: string;
    payments: Array<{
      id: string;
      amount: number;
      paymentDate: string;
      notes: string | null;
    }>;
  }>;
}

export default function DebtorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [debtor, setDebtor] = useState<DebtorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentNotes, setPaymentNotes] = useState<string>('');

  useEffect(() => {
    fetchDebtorDetails();
  }, [id]);

  const fetchDebtorDetails = async () => {
    try {
      const response = await axios.get(`/debtors/${id}`);
      setDebtor(response.data);
    } catch (err: any) {
      setError('Failed to load debtor profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebtId || !paymentAmount) return;

    try {
      // Assuming a generic payment endpoint exists or we'll make one
      await axios.post('/payments', {
        debtId: selectedDebtId,
        amount: parseFloat(paymentAmount),
        notes: paymentNotes
      });
      setShowPaymentModal(false);
      setPaymentAmount('');
      setPaymentNotes('');
      fetchDebtorDetails(); // Refresh data to show new payment & balance
    } catch (err) {
      alert('Failed to process payment');
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading profile...</div>;
  if (error || !debtor) return <div className="p-8 text-red-500">{error || 'Debtor not found'}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/debtors')}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{debtor.name}</h1>
            <p className="text-gray-500 text-sm">Debtor ID: {debtor.id}</p>
          </div>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
          debtor.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' :
          debtor.status === 'PROMISE_TO_PAY' ? 'bg-blue-50 text-blue-700 border-blue-200' :
          'bg-gray-50 text-gray-700 border-gray-200'
        }`}>
          {debtor.status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Contact & Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} className="text-blue-600" /> Contact Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phones</p>
                  {debtor.phones.map((p, i) => (
                    <p key={i} className="text-sm text-gray-600">{p}</p>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{debtor.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600">{debtor.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Fields (Employer, etc) */}
          {debtor.customFields && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-blue-600" /> Additional Info
              </h3>
              <div className="space-y-3">
                {Object.entries(debtor.customFields).map(([key, val]) => (
                  <div key={key}>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{key.replace(/_/g, ' ')}</p>
                    <p className="text-sm font-medium text-gray-900">{String(val)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Debts & Payments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Debts List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={18} className="text-red-600" /> Active Debts
            </h3>
            <div className="space-y-4">
              {debtor.debts.length === 0 ? (
                <p className="text-gray-500 text-sm">No debts recorded.</p>
              ) : (
                debtor.debts.map(debt => (
                  <div key={debt.id} className="border border-gray-200 rounded-lg p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          ${Number(debt.currentBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-gray-500">
                          Original Amount: ${Number(debt.originalAmount).toLocaleString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-100">
                        {debt.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} /> Due: {new Date(debt.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <AlertCircle size={14} /> Interest: {Number(debt.interestRate)}%
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedDebtId(debt.id);
                          setShowPaymentModal(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <CreditCard size={16} /> Process Payment
                      </button>
                    </div>

                    {/* mini payment history per debt */}
                    {debt.payments.length > 0 && (
                      <div className="mt-4 bg-gray-50 rounded p-3">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1"><History size={12}/> Recent Payments</h4>
                        <div className="space-y-2">
                          {debt.payments.map(p => (
                            <div key={p.id} className="flex justify-between text-sm">
                              <span className="text-gray-600">{new Date(p.paymentDate).toLocaleDateString()}</span>
                              <span className="font-medium text-green-600">+${Number(p.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Processing Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Process Payment</h2>
            
            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                    className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Reference</label>
                <textarea
                  value={paymentNotes}
                  onChange={e => setPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Transaction #, payment method, etc."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
