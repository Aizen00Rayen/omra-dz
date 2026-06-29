import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, Input, Button, Divider, Chip } from '../components/ui';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const demoAccounts = [
  { role: 'admin', email: 'admin@omra-dz.com', pass: 'Admin@123', color: 'danger', icon: '👑' },
  { role: 'agency', email: 'agence@omra-dz.com', pass: 'Agency@123', color: 'warning', icon: '🏢' },
  { role: 'user', email: 'user@omra-dz.com', pass: 'User@123', color: 'success', icon: '👤' },
];

export default function LoginPage() {
  const { t, lang } = useLang();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      if (result.user.role === 'admin') navigate('/admin');
      else if (result.user.role === 'agency') navigate('/agency');
      else navigate('/dashboard');
    } else {
      setError(t.auth.loginError);
    }
  };

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 star-pattern opacity-20" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
            🕌
          </div>
          <h1 className="text-3xl font-bold text-white font-arabic">
            {lang === 'ar' ? 'عمرة DZ' : 'Omra DZ'}
          </h1>
          <p className="text-green-300 text-sm mt-1">
            {lang === 'ar' ? 'المنصة الجزائرية الأولى' : 'Plateforme N°1 Algérienne'}
          </p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardBody className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-arabic text-center">{t.auth.login}</h2>
            <p className="text-gray-400 text-sm text-center mb-6">
              {lang === 'ar' ? 'مرحباً بك مجدداً!' : 'Bienvenue à nouveau!'}
            </p>

            {/* Demo Accounts */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                {t.auth.demoAccounts}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {demoAccounts.map(acc => (
                  <button
                    key={acc.role}
                    onClick={() => fillDemo(acc)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-colors text-center
                      ${email === acc.email
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                  >
                    <span className="text-xl">{acc.icon}</span>
                    <Chip size="sm" color={acc.color} variant="flat" className="text-xs">
                      {acc.role === 'admin' ? 'Admin' : acc.role === 'agency' ? 'Agence' : 'User'}
                    </Chip>
                  </button>
                ))}
              </div>
              {email && (
                <div className="mt-2 text-xs text-gray-400 text-center">
                  {email} / {password}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                label={t.auth.email}
                value={email}
                onChange={e => setEmail(e.target.value)}
                variant="bordered"
                isRequired
                startContent={<span className="text-gray-400 text-sm">✉️</span>}
              />
              <Input
                type={showPass ? 'text' : 'password'}
                label={t.auth.password}
                value={password}
                onChange={e => setPassword(e.target.value)}
                variant="bordered"
                isRequired
                startContent={<span className="text-gray-400 text-sm">🔒</span>}
                endContent={
                  <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 text-sm">
                    {showPass ? '🙈' : '👁️'}
                  </button>
                }
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <div className="flex justify-end">
                <button type="button" className="text-sm text-green-700 hover:underline">
                  {t.auth.forgotPassword}
                </button>
              </div>

              <Button
                type="submit"
                isLoading={loading}
                className="w-full bg-green-700 text-white font-semibold h-12 text-base"
              >
                {t.auth.login}
              </Button>
            </form>

            <Divider className="my-6" />

            <p className="text-center text-sm text-gray-500">
              {t.auth.noAccount}{' '}
              <Link to="/register" className="text-green-700 font-semibold hover:underline no-underline">
                {t.auth.register}
              </Link>
            </p>
          </CardBody>
        </Card>

        <p className="text-center text-green-300 text-sm mt-4">
          <Link to="/" className="hover:text-white transition-colors no-underline">
            ← {lang === 'ar' ? 'العودة للرئيسية' : 'Retour à l\'accueil'}
          </Link>
        </p>
      </div>
    </div>
  );
}
