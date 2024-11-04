import React from 'react';
import StatsCard from '../components/StatsCard';
import { useQuery } from 'react-query';
import { useSocket } from '../context/SocketContext';

function Dashboard() {
  const socket = useSocket();
  const { data: stats = { today: '0', total: '0' } } = useQuery('stats', 
    () => fetch('/api/stats').then(res => res.json()),
    { refetchInterval: 60000 }
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
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
          value="Loading..."
          icon="🤖"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          {/* Activity list will go here */}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Performance</h2>
          {/* Performance chart will go here */}
        </div>
      </div>
    </div>
  );
}