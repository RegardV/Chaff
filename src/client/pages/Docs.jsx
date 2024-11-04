import React from 'react';

function Docs() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Documentation</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Getting Started
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Learn how to set up and run your FAssets liquidator.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Prerequisites
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Node.js v18 or higher</li>
                  <li>Management wallet with CFLR tokens</li>
                  <li>FAssets for liquidation</li>
                </ul>
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Configuration
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <p>Run the setup script to configure your liquidator:</p>
                <pre className="mt-2 bg-gray-50 p-4 rounded-md">
                  npm run setup
                </pre>
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Running the Liquidator
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <p>Start the liquidator in development mode:</p>
                <pre className="mt-2 bg-gray-50 p-4 rounded-md">
                  npm run dev
                </pre>
                <p className="mt-4">Or in production:</p>
                <pre className="mt-2 bg-gray-50 p-4 rounded-md">
                  npm start
                </pre>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}