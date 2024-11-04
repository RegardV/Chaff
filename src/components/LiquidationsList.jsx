import React from 'react';
import { useQuery } from 'react-query';

export default function LiquidationsList() {
  const { data: liquidations, isLoading, error } = useQuery(
    'liquidations',
    async () => {
      const response = await fetch('/api/liquidations');
      return response.json();
    }
  );

  if (isLoading) return <div>Loading liquidations...</div>;
  if (error) return <div>Error loading liquidations</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Recent Liquidations</h2>
      <div className="space-y-4">
        {liquidations?.map((liquidation) => (
          <div
            key={liquidation.id}
            className="border-b pb-4 last:border-b-0"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Agent: {liquidation.agentAddress}</p>
                <p className="text-sm text-gray-600">
                  Amount: {liquidation.amount} FAssets
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {new Date(liquidation.timestamp).toLocaleString()}
                </p>
                <p className={`text-sm ${
                  liquidation.status === 'completed' 
                    ? 'text-green-600' 
                    : 'text-yellow-600'
                }`}>
                  {liquidation.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}