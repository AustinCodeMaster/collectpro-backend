import { useState, useEffect } from 'react';
import { api } from '../api/axiosConfig';
import { BookOpen, Search, Plus, Play, Pause, CheckCircle } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  _count?: {
    debtors: number;
    agents: number;
  };
  createdAt: string;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/campaigns');
      setCampaigns(res.data);
    } catch (error) {
      console.error('Failed to fetch campaigns', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    let styles = 'bg-gray-100 text-gray-800';
    if (status === 'ACTIVE') styles = 'bg-green-100 text-green-800';
    if (status === 'PAUSED') styles = 'bg-yellow-100 text-yellow-800';
    if (status === 'COMPLETED') styles = 'bg-blue-100 text-blue-800';

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
        {status}
      </span>
    );
  };

  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">Manage outbound/inbound dialer and collection strategies.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-4 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
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
                <th className="px-6 py-3">Campaign Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Debtors Assigned</th>
                <th className="px-6 py-3 text-center">Agents Active</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading campaigns...</td></tr>
              ) : filteredCampaigns.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No campaigns found.</td></tr>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 border-l-4 border-transparent hover:border-blue-500">
                      <div className="flex items-center">
                        <BookOpen className="mr-3 h-5 w-5 text-gray-400" />
                        {campaign.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {campaign.type.replace(/_/g, ' ')}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      {campaign._count?.debtors || 0}
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      {campaign._count?.agents || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {campaign.status === 'ACTIVE' ? (
                          <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title="Pause">
                            <Pause className="h-4 w-4" />
                          </button>
                        ) : (
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Activate">
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Complete this task">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      </div>
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
