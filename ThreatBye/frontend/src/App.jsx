import EmailDetail from './pages/email/EmailDetail';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Saare pages import kar rahe hain
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EmailAnalysis from './pages/EmailAnalysis';
import Filelocker from './pages/Filelocker';
import History from './pages/History';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import EviLocker from './pages/EviLocker';
import ReportDetail from './pages/ReportDetail';

import AccountInfo from './pages/profile/AccountInfo';
import SecuritySettings from './pages/profile/SecuritySettings';
import ChangePassword from './pages/profile/ChangePassword';
import Notifications from './pages/profile/Notifications';
import PrivacyPolicy from './pages/profile/PrivacyPolicy';
import HelpSupport from './pages/profile/HelpSupport';
import About from './pages/profile/About';
import UploadMail from './pages/UploadMail';
import RiskDashboard from './pages/RiskDashboard';
import ThreatCategories from './pages/ThreatCategories';
import AccessEmail from './pages/email/AccessEmail';
import SelectProvider from './pages/email/SelectProvider';
import ConnectProvider from './pages/email/ConnectProvider';
import Inbox from './pages/email/Inbox';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route ko Login par bhejenge */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main Application Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/analysis" element={<EmailAnalysis />} />
        <Route path="/filelocker" element={<Filelocker />} />
        <Route path="/history" element={<History />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/evi-locker" element={<EviLocker />} />
        <Route path="/evi-locker/report/:caseId" element={<ReportDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/account" element={<AccountInfo />} />
        <Route path="/profile/security" element={<SecuritySettings />} />
        <Route path="/profile/security/change-password" element={<ChangePassword />} />
        <Route path="/profile/notifications" element={<Notifications />} />
        <Route path="/profile/privacy" element={<PrivacyPolicy />} />
        <Route path="/profile/help" element={<HelpSupport />} />
        <Route path="/profile/about" element={<About />} />
        <Route path="/upload" element={<UploadMail />} />
        <Route path="/risk-dashboard" element={<RiskDashboard />} />
        <Route path="/risk-dashboard/categories" element={<ThreatCategories />} />
        <Route path="/access-email" element={<AccessEmail />} />
        <Route path="/access-email/provider" element={<SelectProvider />} />
        <Route path="/access-email/connect" element={<ConnectProvider />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/inbox/:messageId" element={<EmailDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;