import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import LiquidationsList from './components/LiquidationsList';
import Docs from './pages/Docs';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/liquidations" element={<LiquidationsList />} />
              <Route path="/docs" element={<Docs />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </SocketProvider>
    </QueryClientProvider>
  );
}

export default App;