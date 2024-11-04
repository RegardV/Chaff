import React from 'react';

function LiquidationsList({ liquidations }) {
  if (liquidations.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Liquidations</h2>
        <p className="text-gray-500">No liquidations yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold">Recent Liquidations</h2>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {liquidations.map((liquidation, index) => (
            <li key={liquidation.txHash || index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Agent: {liquidation.agentAddress.slice(0, 6)}...
                    {liquidation.agentAddress.slice(-4)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Amount: {liquidation.amount} FAssets
                  </p>
                </div>
                <div className="text-sm text-green-600">
                  +{liquidation.premium}% Premium
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}