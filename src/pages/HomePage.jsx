import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Chip, Card, CardBody, Avatar } from '../components/ui';
import { useLang } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import PackageCard from '../components/PackageCard';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../contexts/AuthContext';

const stats = [
  { key: 'agencies', value: '3+', icon: '🏢' },
  { key: 'packages', value: '6+', icon: '📦' },
  { key: 'pilgrims', value: '5600+', icon: '🕌' },
  { key: 'years', value: '15+', icon: '⭐' },
];

const features = [
  { icon: '🔒', key: 'secure', color: 'bg-blue-50 text-blue-600' },
  { icon: '💰', key: 'compare', color: 'bg-amber-50 text-amber-600' },
  { icon: '📞', key: 'support', color: 'bg-green-50 text-green-600' },
  { icon: '✅', key: 'verified', color: 'bg-purple-50 text-purple-600' },
];

const howItWorks = [
  { step: '01', icon: '🔍', key: 'step1' },
  { step: '02', icon: '👤', key: 'step2' },
  { step: '03', icon: '✅', key: 'step3' },
  { step: '04', icon: '🕌', key: 'step4' },
];

const testimonials = [
  {
    name: 'محمد الطاهر بوزيد',
    nameFr: 'Mohamed Taher Bouzid',
    city: 'الجزائر',
    cityFr: 'Alger',
    text: 'خدمة ممتازة وتنظيم رائع! سهّلت عليّ كثيراً في اختيار الباقة المناسبة لعائلتي.',
    textFr: "Service excellent et organisation remarquable! Ça m'a beaucoup facilité le choix du package pour ma famille.",
    rating: 5,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bouzid',
  },
  {
    name: 'نجوى بلحاج',
    nameFr: 'Nadia Belhaj',
    city: 'وهران',
    cityFr: 'Oran',
    text: 'رحلة العمرة في رمضان كانت تجربة روحانية لا تنسى. شكراً عمرة DZ!',
    textFr: 'Le voyage Omra pendant Ramadan était une expérience spirituelle inoubliable. Merci Omra DZ!',
    rating: 5,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nadia',
  },
  {
    name: 'عبد الرزاق حمزة',
    nameFr: 'Abderrazak Hamza',
    city: 'قسنطينة',
    cityFr: 'Constantine',
    text: 'من السهل جداً المقارنة بين الباقات والوكالات. سأستخدمها مرة أخرى.',
    textFr: "Très facile de comparer les packages et les agences. Je l'utiliserai encore.",
    rating: 4,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hamza',
  },
];

export default function HomePage() {
  const { t, lang } = useLang();
  const { getPackages } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const featuredPackages = getPackages({ active: true, featured: true }).slice(0, 3);

  const handleSearch = () => {
    navigate(`/packages?search=${encodeURIComponent(search)}`);
  };

  const handleBook = (pkg) => {
    if (!user) { navigate('/login'); return; }
    setSelectedPackage(pkg);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 star-pattern opacity-30" />

        {/* Decorative circles */}
        <div className="absolute top-20 start-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 end-10 w-80 h-80 bg-green-300/10 rounded-full blur-3xl" />

        {/* Islamic geometric decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 end-0 w-1/3 h-full opacity-5">
            <svg viewBox="0 0 400 600" fill="white" className="w-full h-full">
              <path d="M200 0 L400 100 L400 500 L200 600 L0 500 L0 100 Z" fillOpacity="0.3" />
              <path d="M200 50 L350 125 L350 475 L200 550 L50 475 L50 125 Z" fillOpacity="0.2" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded-full px-4 py-2 text-sm mb-6 font-arabic">
              <span>✨</span>
              <span>{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-arabic leading-tight">
              {t.hero.title}{' '}
              <span className="text-gradient-gold">{t.hero.titleHighlight}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-green-200 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl">
              {t.hero.subtitle}
            </p>

            {/* Search Bar */}
            <div className="flex gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 mb-10 max-w-2xl">
              <Input
                placeholder={t.hero.searchPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="flex-1"
                classNames={{
                  input: 'text-white placeholder:text-white/60',
                  inputWrapper: 'bg-transparent border-none shadow-none',
                }}
                startContent={<span className="text-white/60">🔍</span>}
              />
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 shrink-0"
                onPress={handleSearch}
              >
                {t.hero.searchButton}
              </Button>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button
                as={Link}
                to="/packages"
                size="lg"
                className="bg-amber-500 text-white font-semibold hover:bg-amber-600 px-8"
              >
                {t.hero.cta}
              </Button>
              <Button
                as={Link}
                to="/agencies"
                size="lg"
                variant="bordered"
                className="border-white/40 text-white hover:bg-white/10"
              >
                {t.hero.ctaSecondary}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map(stat => (
                <div key={stat.key} className="flex items-center gap-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <div>
                    <div className="text-white font-bold text-xl">{stat.value}</div>
                    <div className="text-green-200 text-xs">{t.hero.stats[stat.key]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <Chip className="bg-green-100 text-green-700 mb-3" size="sm">
              {lang === 'ar' ? 'الباقات المميزة' : 'Packages en vedette'}
            </Chip>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-arabic">
              {t.packages.title}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t.packages.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredPackages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} onBook={handleBook} />
            ))}
          </div>

          <div className="text-center">
            <Button
              as={Link}
              to="/packages"
              size="lg"
              className="bg-green-700 text-white hover:bg-green-800 px-10"
            >
              {t.common.viewAll} →
            </Button>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-arabic">
              {t.features.title}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t.features.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <Card key={f.key} className="border border-gray-100 text-center" shadow="sm">
                <CardBody className="p-6">
                  <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4`}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 font-arabic">{t.features[f.key]}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{t.features[`${f.key}Desc`]}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-green-900 to-green-800 relative overflow-hidden">
        <div className="absolute inset-0 star-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-arabic">
              {t.howItWorks.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, idx) => (
              <div key={item.key} className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-white/10 border-2 border-amber-400/50 rounded-2xl flex items-center justify-center text-4xl mx-auto group-hover:border-amber-400 transition-colors">
                    {item.icon}
                  </div>
                  <span className="absolute -top-3 -end-3 bg-amber-500 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg mb-2 font-arabic">{t.howItWorks[item.key]}</h3>
                <p className="text-green-200 text-sm leading-relaxed">{t.howItWorks[`${item.key}Desc`]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-arabic">{t.common.testimonials}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t_item, idx) => (
              <Card key={idx} className="border border-gray-100" shadow="sm">
                <CardBody className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={s <= t_item.rating ? 'text-amber-400' : 'text-gray-200'}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                    "{lang === 'ar' ? t_item.text : t_item.textFr}"
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <Avatar src={t_item.avatar} size="sm" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm font-arabic">
                        {lang === 'ar' ? t_item.name : t_item.nameFr}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {lang === 'ar' ? t_item.city : t_item.cityFr}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-50 border-t border-amber-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-arabic">
            {lang === 'ar' ? 'جاهز لرحلة العمرة؟' : 'Prêt pour votre voyage Omra?'}
          </h2>
          <p className="text-gray-500 mb-8 text-lg">
            {lang === 'ar'
              ? 'انضم إلى آلاف الجزائريين الذين يثقون في منصة عمرة DZ لتنظيم رحلة العمرة'
              : 'Rejoignez des milliers d\'Algériens qui font confiance à la plateforme Omra DZ'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              as={Link}
              to="/register"
              size="lg"
              className="bg-green-700 text-white hover:bg-green-800 px-10 font-semibold"
            >
              {lang === 'ar' ? 'إنشاء حساب مجاناً' : 'Créer un compte gratuit'}
            </Button>
            <Button
              as={Link}
              to="/packages"
              size="lg"
              variant="bordered"
              className="border-green-700 text-green-700"
            >
              {t.hero.cta}
            </Button>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        pkg={selectedPackage}
        isOpen={bookingOpen}
        onClose={() => { setBookingOpen(false); setSelectedPackage(null); }}
      />
    </div>
  );
}
