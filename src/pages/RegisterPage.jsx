import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, Input, Button, Select, SelectItem, Divider } from '../components/ui';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import db from '../data/db.json';

export default function RegisterPage() {
  const { t, lang } = useLang();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', wilaya: '', role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError(lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const { confirmPassword, ...data } = form;
    const result = register(data);
    setLoading(false);
    if (result.success) {
      if (result.user.role === 'agency') navigate('/agency');
      else navigate('/dashboard');
    } else {
      setError(lang === 'ar' ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email déjà utilisé');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 star-pattern opacity-20" />

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
            🕌
          </div>
          <h1 className="text-3xl font-bold text-white font-arabic">
            {lang === 'ar' ? 'عمرة DZ' : 'Omra DZ'}
          </h1>
        </div>

        <Card className="shadow-2xl border-0">
          <CardBody className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-arabic text-center">{t.auth.register}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={t.auth.name}
                value={form.name}
                onChange={e => update('name', e.target.value)}
                variant="bordered"
                isRequired
                startContent={<span className="text-gray-400">👤</span>}
              />

              <Input
                type="email"
                label={t.auth.email}
                value={form.email}
                onChange={e => update('email', e.target.value)}
                variant="bordered"
                isRequired
                startContent={<span className="text-gray-400">✉️</span>}
              />

              <Input
                label={t.auth.phone}
                value={form.phone}
                onChange={e => update('phone', e.target.value)}
                variant="bordered"
                placeholder="+213 ..."
                startContent={<span className="text-gray-400">📞</span>}
              />

              <Select
                label={t.auth.wilaya}
                selectedKeys={form.wilaya ? [form.wilaya] : []}
                onChange={e => update('wilaya', e.target.value)}
                variant="bordered"
              >
                {db.wilayas.map(w => <SelectItem key={w}>{w}</SelectItem>)}
              </Select>

              <Select
                label={t.auth.role}
                selectedKeys={[form.role]}
                onChange={e => update('role', e.target.value)}
                variant="bordered"
              >
                <SelectItem key="user">{t.auth.userRole}</SelectItem>
                <SelectItem key="agency">{t.auth.agencyRole}</SelectItem>
              </Select>

              <Input
                type="password"
                label={t.auth.password}
                value={form.password}
                onChange={e => update('password', e.target.value)}
                variant="bordered"
                isRequired
                startContent={<span className="text-gray-400">🔒</span>}
              />

              <Input
                type="password"
                label={t.auth.confirmPassword}
                value={form.confirmPassword}
                onChange={e => update('confirmPassword', e.target.value)}
                variant="bordered"
                isRequired
                startContent={<span className="text-gray-400">🔒</span>}
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  ⚠️ {error}
                </div>
              )}

              <Button
                type="submit"
                isLoading={loading}
                className="w-full bg-green-700 text-white font-semibold h-12 text-base"
              >
                {t.auth.register}
              </Button>
            </form>

            <Divider className="my-6" />

            <p className="text-center text-sm text-gray-500">
              {t.auth.haveAccount}{' '}
              <Link to="/login" className="text-green-700 font-semibold hover:underline no-underline">
                {t.auth.login}
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
