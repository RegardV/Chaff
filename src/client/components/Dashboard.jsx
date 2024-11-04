import React from 'react';
import { useQuery } from 'react-query';
import { useSocket } from '../context/SocketContext';
import StatsCard from './StatsCard';
import LiquidationsList from './LiquidationsList';

function Dashboard() {
  const socket = useSocket();
  const [recentLiquidations, setRecentLiquidations] = React.useState([]);
  
  const { data: stats = { today: '0', total: '0' } } = useQuery('stats', 
    () => fetch('/api/stats').then(res => res.json()),
    { refetchInterval: 60000 }
  );

  React.useEffect(() => {
    if (!socket) return;

    socket.on('liquidation', (liquidation) => {
      setRecentLiquidations(prev => [liquidation, ...prev].slice(0, 10));
    });

    return () => socket.off('liquidation');
  }, [socket]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
      <LiquidationsList liquidations={recentLiquidations} />
    </div>
  );
}