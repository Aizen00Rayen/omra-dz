import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import PackagesPage from './pages/PackagesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import AgenciesPage from './pages/AgenciesPage';
import AgencyDetailPage from './pages/AgencyDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/user/UserDashboard';
import AgencyDashboard from './pages/agency/AgencyDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

const PUBLIC_PAGES = ['/', '/packages', '/agencies', '/about', '/contact', '/login', '/register'];

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AuthLayout({ children }) {
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <DataProvider>
              <Routes>
                {/* Auth pages (no navbar/footer) */}
                <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
                <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

                {/* Public pages */}
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/packages" element={<Layout><PackagesPage /></Layout>} />
                <Route path="/packages/:id" element={<Layout><PackageDetailPage /></Layout>} />
                <Route path="/agencies" element={<Layout><AgenciesPage /></Layout>} />
                <Route path="/agencies/:id" element={<Layout><AgencyDetailPage /></Layout>} />
                <Route path="/about" element={<Layout><AboutPage /></Layout>} />
                <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

                {/* Protected: User */}
                <Route path="/dashboard" element={
                  <ProtectedRoute roles={['user']}>
                    <Layout><UserDashboard /></Layout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/bookings" element={
                  <ProtectedRoute roles={['user']}>
                    <Layout><UserDashboard /></Layout>
                  </ProtectedRoute>
                } />

                {/* Protected: Agency */}
                <Route path="/agency" element={
                  <ProtectedRoute roles={['agency']}>
                    <Layout><AgencyDashboard /></Layout>
                  </ProtectedRoute>
                } />

                {/* Protected: Admin */}
                <Route path="/admin" element={
                  <ProtectedRoute roles={['admin']}>
                    <Layout><AdminDashboard /></Layout>
                  </ProtectedRoute>
                } />
              </Routes>
            </DataProvider>
          </AuthProvider>
        </LanguageProvider>
    </BrowserRouter>
  );
}
