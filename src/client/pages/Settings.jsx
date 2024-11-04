import React from 'react';
import { Switch } from '../components/Switch';

function Settings() {
  const [secrets, setSecrets] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [mode, setMode] = React.useState('demo');
  
  const demoData = {
    network: 'coston',
    liquidator: {
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    },
    strategy: {
      minPremium: 10,
      collateralRatioThreshold: 150,
      maxGasPrice: 100
    }
  };

  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSecrets(data);
        // If all required fields are present, default to live mode
        if (data?.liquidator?.address && 
            data?.strategy?.minPremium && 
            data?.strategy?.collateralRatioThreshold) {
          setMode('live');
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const displayData = mode === 'live' ? secrets : demoData;
  const isConfigComplete = secrets?.liquidator?.address && 
                          secrets?.strategy?.minPremium && 
                          secrets?.strategy?.collateralRatioThreshold;

  if (loading) return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        
        <div className="flex items-center space-x-3">
          <span className={`text-sm ${mode === 'demo' ? 'text-gray-900' : 'text-gray-500'}`}>Demo</span>
          <Switch
            enabled={mode === 'live'}
            onChange={() => setMode(mode === 'live' ? 'demo' : 'live')}
            disabled={!isConfigComplete}
          />
          <span className={`text-sm ${mode === 'live' ? 'text-gray-900' : 'text-gray-500'}`}>Live</span>
        </div>
      </div>
      
      {!isConfigComplete && mode === 'demo' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Demo mode active. Complete configuration to enable live mode.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">
            Liquidator Configuration
            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              mode === 'live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {mode === 'live' ? 'Live' : 'Demo'}
            </span>
          </h3>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Network
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                  value={displayData?.network || ''}
                  readOnly
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Liquidator Address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                  value={displayData?.liquidator?.address || ''}
                  readOnly
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Strategy Settings
              </label>
              <div className="mt-1 grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500">Min Premium</label>
                  <input
                    type="text"
                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                    value={`${displayData?.strategy?.minPremium || 0}%`}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Collateral Ratio</label>
                  <input
                    type="text"
                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                    value={`${displayData?.strategy?.collateralRatioThreshold || 0}%`}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Max Gas</label>
                  <input
                    type="text"
                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                    value={`${displayData?.strategy?.maxGasPrice || 0} gwei`}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {mode === 'demo' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Required Configuration
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <svg className={`h-5 w-5 ${secrets?.liquidator?.address ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-sm text-gray-600">Liquidator Address</span>
            </div>
            <div className="flex items-center">
              <svg className={`h-5 w-5 ${secrets?.strategy?.minPremium ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-sm text-gray-600">Minimum Premium</span>
            </div>
            <div className="flex items-center">
              <svg className={`h-5 w-5 ${secrets?.strategy?.collateralRatioThreshold ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-sm text-gray-600">Collateral Ratio Threshold</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}