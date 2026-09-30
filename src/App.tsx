import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import NetworkTestPage from './pages/NetworkTestPage';
import ReportIssuePage from './pages/ReportIssuePage';
import ReportSuccessPage from './pages/ReportSuccessPage';
import IssueHistoryPage from './pages/IssueHistoryPage';
import IssueDetailPage from './pages/IssueDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminIssueManagement from './pages/AdminIssueManagement';
import AdminIssueDetail from './pages/AdminIssueDetail';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminHistory from './pages/AdminHistory';
import AdminUsers from './pages/AdminUsers';
import AdminSettings from './pages/AdminSettings';
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, loading, logout } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [ticketId, setTicketId] = useState('NET-0001');

  const handleLogout = () => { logout(); setPage('dashboard'); };

  const nav = (p: string, id?: string) => {
    if (id) setTicketId(id);
    setPage(p);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-400">กำลังโหลด...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLoggedIn={(role) => setPage(role === 'admin' ? 'admin-dashboard' : 'dashboard')} />;
  }

  if (user.role === 'user') {
    const renderPage = () => {
      switch (page) {
        case 'dashboard': return <UserDashboard onNav={nav} />;
        case 'network-test': return <NetworkTestPage onNav={nav} />;
        case 'report-issue': return <ReportIssuePage onNav={nav} />;
        case 'report-success': return <ReportSuccessPage onNav={nav} />;
        case 'issue-history': return <IssueHistoryPage onNav={nav} />;
        case 'issue-detail': return <IssueDetailPage onNav={nav} ticketId={ticketId} />;
        case 'profile': return <ProfilePage />;
        default: return <UserDashboard onNav={nav} />;
      }
    };
    return (
      <UserLayout page={page} onNav={nav} onLogout={handleLogout}>
        {renderPage()}
      </UserLayout>
    );
  }

  // Admin
  const renderAdminPage = () => {
    switch (page) {
      case 'admin-dashboard': return <AdminDashboard onNav={nav} />;
      case 'admin-issues': return <AdminIssueManagement onNav={nav} />;
      case 'admin-issue-detail': return <AdminIssueDetail onNav={nav} ticketId={ticketId} />;
      case 'admin-analytics': return <AdminAnalytics />;
      case 'admin-history': return <AdminHistory onNav={nav} />;
      case 'admin-users': return <AdminUsers />;
      case 'admin-settings': return <AdminSettings />;
      default: return <AdminDashboard onNav={nav} />;
    }
  };

  return (
    <AdminLayout page={page} onNav={nav} onLogout={handleLogout}>
      {renderAdminPage()}
    </AdminLayout>
  );
}
