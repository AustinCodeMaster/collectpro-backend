import { useState, useEffect } from 'react';
import { api } from '../api/axiosConfig';
import { Search, MoreVertical } from 'lucide-react';

interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  extension: string | null;
  status: string;
  _count?: {
    campaigns: number;
    payments: number;
  };
}

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/agents');
      setAgents(res.data);
    } catch (error) {
      console.error('Failed to fetch agents', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    let styles = 'bg-gray-100 text-gray-800';
    if (status === 'AVAILABLE') styles = 'bg-green-100 text-green-800';
    if (status === 'BUSY') styles = 'bg-red-100 text-red-800';
    if (status === 'OFFLINE') styles = 'bg-gray-200 text-gray-500';
    if (status === 'LUNCH' || status === 'BREAK') styles = 'bg-yellow-100 text-yellow-800';

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${status === 'AVAILABLE' ? 'bg-green-500' : status === 'BUSY' ? 'bg-red-500' : 'bg-gray-500'}`}></span>
        {status}
      </span>
    );
  };

  const filteredAgents = agents.filter(a =>
    (a.firstName + ' ' + a.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.extension && a.extension.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor agent statuses and performance.</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-4 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by agent name or ext..."
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
                <th className="px-6 py-3">Agent Details</th>
                <th className="px-6 py-3">Extension</th>
                <th className="px-6 py-3">State</th>
                <th className="px-6 py-3 text-center">Campaigns</th>
                <th className="px-6 py-3 text-center">Collections</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading agents...</td></tr>
              ) : filteredAgents.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No agents found.</td></tr>
              ) : (
                filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
                          {agent.firstName.charAt(0)}{agent.lastName.charAt(0)}
                        </div>
                        {agent.firstName} {agent.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {agent.extension ? <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">EXT: {agent.extension}</span> : 'â€”'}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(agent.status)}
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      {agent._count?.campaigns || 0}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-green-600">
                      {agent._count?.payments || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
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
