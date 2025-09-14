import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import LogCommute from './pages/LogCommute';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import About from './pages/About';
import Auth from './pages/Auth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="log-commute" element={<LogCommute />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="about" element={<About />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
