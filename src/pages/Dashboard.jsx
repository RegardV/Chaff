import React from 'react';
import { useQuery } from 'react-query';
import StatsCard from '../components/StatsCard';
import LiquidationsList from '../components/LiquidationsList';
import { useSocket } from '../context/SocketContext';

export default function Dashboard() {
  const socket = useSocket();
  const [isLive, setIsLive] = React.useState(false);
  const [requirements, setRequirements] = React.useState({
    hasKeys: false,
    hasFunds: false,
    isConfigured: false
  });

  // Fetch stats
  const { data: stats = { today: '0', total: '0', activeAgents: 0 } } = useQuery(
    'stats',
    async () => {
      const res = await fetch('/api/stats');
      return res.json();
    },
    { refetchInterval: 60000 }
  );

  // Check requirements
  React.useEffect(() => {
    const checkRequirements = async () => {
      const res = await fetch('/api/requirements');
      const data = await res.json();
      setRequirements(data);
      setIsLive(data.hasKeys && data.hasFunds && data.isConfigured);
    };
    checkRequirements();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isLive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isLive ? 'Live' : 'Demo Mode'}
          </span>
        </div>
      </div>

      {!isLive && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              ⚠️
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Setup Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  {!requirements.hasKeys && (
                    <li>Generate liquidator keys using <code>node setup.js</code></li>
                  )}
                  {!requirements.hasFunds && (
                    <li>Fund your liquidator wallet with CFLR tokens</li>
                  )}
                  {!requirements.isConfigured && (
                    <li>Configure environment variables in Settings</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Today's Earnings"
          value={`${stats.today} CFLR`}
          icon="💰"
        />
        <StatsCard
          title="Total Earnings"
          value={`${stats.total} CFLR`}
          icon="📈"
        />
        <StatsCard
          title="Active Agents"
          value={stats.activeAgents}
          icon="🤖"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Requirements Status</h2>
          <div className="space-y-4">
            <RequirementItem
              title="Liquidator Keys"
              status={requirements.hasKeys}
              description="Generated via setup.js"
            />
            <RequirementItem
              title="CFLR Funds"
              status={requirements.hasFunds}
              description="Required for gas fees"
            />
            <RequirementItem
              title="Configuration"
              status={requirements.isConfigured}
              description="Environment variables set"
            />
          </div>
        </div>

        <LiquidationsList />
      </div>
    </div>
  );
}

function RequirementItem({ title, status, description }) {
  return (
    <div className="flex items-center">
      <div className={`flex-shrink-0 h-5 w-5 ${
        status ? 'text-green-500' : 'text-gray-300'
      }`}>
        {status ? (
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}