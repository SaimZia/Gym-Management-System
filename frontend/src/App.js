import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/common/Login';
import Signup from './components/common/Signup';
import Dashboard from './pages/customer/Dashboard';
import DietChecklist from './components/trainer/DietChecklist';
import DietPlanManagement from './components/trainer/DietPlanManagement';
import Subscription from './components/trainer/Subscription';
import AccountsPage from './pages/admin/AccountsPage';
import ReportsPage from './pages/admin/ReportsPage';
import ProfilePage from './pages/customer/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/diet-checklist" element={<DietChecklist />} />
        <Route path="/diet-plan-management" element={<DietPlanManagement />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/" element={<Navigate to="/signup" />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;