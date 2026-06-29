import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Avatar, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from './ui';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const KaabaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M12 2L4 6v5c0 5.25 3.4 10.2 8 11.45C16.6 21.2 20 16.25 20 11V6L12 2zm0 2.18l6 3.14V11c0 4.07-2.6 7.95-6 9.18C8.6 18.95 6 15.07 6 11V7.32l6-3.14z"/>
  </svg>
);

const roleColors = { admin: 'danger', agency: 'warning', user: 'success' };
const roleLabels = { admin: 'Admin', agency: 'وكالة', user: 'مستخدم' };

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { t, lang, toggleLang, isRTL } = useLang();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.packages, href: '/packages' },
    { label: t.nav.agencies, href: '/agencies' },
    { label: t.nav.about, href: '/about' },
    { label: t.nav.contact, href: '/contact' },
  ];

  const handleLogout = () => { logout(); navigate('/'); setUserMenuOpen(false); };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'agency') return '/agency';
    return '/dashboard';
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-green-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="text-green-700"><KaabaIcon /></div>
            <div>
              <div className="font-bold text-lg text-green-800 leading-tight font-arabic">
                {lang === 'ar' ? 'عمرة DZ' : 'Omra DZ'}
              </div>
              <div className="text-xs text-amber-600 leading-tight hidden sm:block">
                {lang === 'ar' ? 'المنصة الجزائرية الأولى' : 'Plateforme N°1 Algérienne'}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors no-underline
                  ${location.pathname === item.href
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="text-green-700 font-semibold text-sm px-2 py-1 rounded hover:bg-green-50 transition-colors"
            >
              {lang === 'ar' ? 'FR' : 'عر'}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 cursor-pointer rounded-xl hover:bg-gray-50 px-2 py-1 transition-colors"
                >
                  <Avatar src={user.avatar} name={user.name} size="sm" className="ring-2 ring-green-200" />
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-xs font-semibold text-gray-800 max-w-24 truncate">
                      {lang === 'ar' ? user.name : (user.nameFr || user.name)}
                    </span>
                    <Chip size="sm" color={roleColors[user.role]}>
                      {roleLabels[user.role]}
                    </Chip>
                  </div>
                  <span className="text-gray-400 text-xs">▾</span>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className={`absolute ${isRTL ? 'start-0' : 'end-0'} mt-2 z-20 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-44`}>
                      <button onClick={() => { navigate(getDashboardPath()); setUserMenuOpen(false); }}
                        className="w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        {t.nav.dashboard}
                      </button>
                      {user.role === 'user' && (
                        <button onClick={() => { navigate('/dashboard/bookings'); setUserMenuOpen(false); }}
                          className="w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          {t.nav.myBookings}
                        </button>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout}
                        className="w-full text-start px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        {t.nav.logout}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:block text-sm font-medium text-green-700 hover:underline no-underline px-3 py-2">
                  {t.nav.login}
                </Link>
                <Link to="/register" className="bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-green-800 transition-colors no-underline">
                  {t.nav.register}
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                to={item.href}
                className={`block py-2 px-3 rounded-lg text-sm font-medium no-underline transition-colors
                  ${location.pathname === item.href
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                  }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {!user && (
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <Link to="/login" className="block text-center py-2 text-sm text-green-700 font-medium no-underline"
                  onClick={() => setMenuOpen(false)}>{t.nav.login}</Link>
                <Link to="/register" className="block text-center py-2 bg-green-700 text-white text-sm rounded-xl no-underline"
                  onClick={() => setMenuOpen(false)}>{t.nav.register}</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
