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
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden" style={{background:'#03090a'}}>

        {/* Background depth layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{background:'radial-gradient(ellipse 90% 80% at 15% 55%, rgba(26,122,74,0.28) 0%, transparent 60%)'}} />
          <div className="absolute inset-0" style={{background:'radial-gradient(ellipse 55% 65% at 78% 38%, rgba(10,58,34,0.45) 0%, transparent 55%)'}} />
          <div className="absolute top-0 end-1/3 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{background:'radial-gradient(circle, #c9a227 0%, transparent 70%)'}} />
          <div className="absolute inset-0 star-pattern opacity-20" />
          {/* Thin golden accent line */}
          <div className="absolute bottom-20 left-0 right-0 h-px" style={{background:'linear-gradient(90deg, transparent 0%, rgba(201,162,39,0.25) 50%, transparent 100%)'}} />
        </div>

        {/* Main two-column layout */}
        <div className="relative z-10 flex-1 max-w-7xl mx-auto px-4 md:px-8 w-full flex items-center py-8 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">

            {/* ── LEFT: TEXT ── */}
            <div className="order-2 lg:order-1 space-y-7">

              {/* Live status badge */}
              <div className="inline-flex items-center gap-3 border border-green-500/25 bg-green-500/10 rounded-full px-4 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <span className="text-green-300 text-sm font-arabic tracking-wide">{t.hero.badge}</span>
              </div>

              {/* Eyebrow + Heading */}
              <div>
                <p className="text-amber-400/70 text-xs font-semibold tracking-[0.35em] uppercase mb-3">
                  {lang === 'ar' ? '— المنصة الجزائرية الأولى —' : '— N°1 EN ALGÉRIE —'}
                </p>
                <h1 className="text-5xl md:text-6xl lg:text-[4.2rem] font-bold text-white leading-[1.1] font-arabic">
                  {t.hero.title}
                  <br />
                  <span className="text-gradient-gold">{t.hero.titleHighlight}</span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-green-300/70 text-base md:text-lg leading-relaxed max-w-md">
                {t.hero.subtitle}
              </p>

              {/* Category quick-links */}
              <div className="space-y-2">
                <p className="text-white/30 text-xs uppercase tracking-widest">
                  {lang === 'ar' ? 'نوع الباقة' : 'Type de package'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'economy',  ar: '💫 اقتصادية', fr: '💫 Économique' },
                    { key: 'family',   ar: '👨‍👩‍👧 عائلية',  fr: '👨‍👩‍👧 Familiale'  },
                    { key: 'premium',  ar: '⭐ مميزة',    fr: '⭐ Premium'    },
                    { key: 'luxury',   ar: '👑 فاخرة',    fr: '👑 Luxe'       },
                  ].map(cat => (
                    <Link key={cat.key} to={`/packages?category=${cat.key}`}
                      className="px-4 py-1.5 border border-white/10 hover:border-amber-400/50 hover:bg-amber-400/10 text-white/60 hover:text-amber-300 rounded-full text-sm transition-all no-underline font-arabic">
                      {lang === 'ar' ? cat.ar : cat.fr}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Search bar */}
              <div className="flex gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 max-w-lg">
                <div className="flex-1 flex items-center gap-3 px-3">
                  <span className="text-white/30">🔍</span>
                  <input
                    type="text"
                    placeholder={t.hero.searchPlaceholder}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shrink-0 font-arabic cursor-pointer"
                >
                  {t.hero.searchButton}
                </button>
              </div>

              {/* Trust row */}
              <div className="flex items-center gap-5 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {['bouzid','nadia','hamza','sara'].map((seed, i) => (
                      <img key={seed}
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                        className="w-8 h-8 rounded-full border-2 bg-green-900"
                        style={{borderColor:'#03090a', marginInlineStart: i > 0 ? '-10px' : '0', zIndex: 4-i}}
                        alt=""
                      />
                    ))}
                  </div>
                  <span className="text-white/50 text-sm">
                    <span className="text-white font-bold">5,600+</span>{' '}
                    {lang === 'ar' ? 'معتمر سعيد' : 'pèlerins satisfaits'}
                  </span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 text-sm tracking-tight">★★★★★</span>
                  <span className="text-white font-bold text-sm">4.9</span>
                  <span className="text-white/30 text-xs">/5</span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex items-center gap-1.5 text-green-400/80 text-sm">
                  <span className="text-green-400">✓</span>
                  <span>{lang === 'ar' ? '3 وكالات معتمدة' : '3 agences certifiées'}</span>
                </div>
              </div>
            </div>

            {/* ── RIGHT: VISUAL ── */}
            <div className="order-1 lg:order-2 flex items-center justify-center">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">

                {/* Outermost slow-spinning dashed ring */}
                <div className="absolute inset-0 rounded-full border border-amber-500/15 animate-spin-slow"
                  style={{borderStyle:'dashed', borderDasharray:'4 8'}} />

                {/* Second ring */}
                <div className="absolute inset-5 rounded-full border border-green-700/30" />

                {/* Glow blob behind */}
                <div className="absolute inset-10 rounded-full blur-3xl opacity-40"
                  style={{background:'radial-gradient(circle, #1a7a4a 0%, transparent 70%)'}} />

                {/* Central orb */}
                <div className="absolute inset-10 rounded-full flex items-center justify-center overflow-hidden border border-amber-500/25 shadow-2xl"
                  style={{background:'linear-gradient(145deg, #0b2e18 0%, #051409 100%)'}}>

                  {/* SVG arch decoration inside */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 200" fill="none">
                    <path d="M55 155 L55 85 Q55 38 100 38 Q145 38 145 85 L145 155" stroke="#c9a227" strokeWidth="1.5" />
                    <path d="M68 155 L68 90 Q68 55 100 55 Q132 55 132 90 L132 155" stroke="#c9a227" strokeWidth="0.8" />
                    <line x1="32" y1="95" x2="55" y2="95" stroke="#c9a227" strokeWidth="1" />
                    <line x1="145" y1="95" x2="168" y2="95" stroke="#c9a227" strokeWidth="1" />
                    <circle cx="100" cy="38" r="2.5" fill="#c9a227" />
                    <circle cx="100" cy="55" r="1.5" fill="#c9a227" opacity="0.6" />
                  </svg>

                  {/* Ka'aba */}
                  <div className="relative text-center z-10">
                    <div className="text-6xl sm:text-7xl">🕋</div>
                    <p className="text-amber-400/50 text-xs mt-1 font-arabic">مكة المكرمة</p>
                  </div>

                  {/* Subtle inner pulse rings */}
                  <div className="absolute inset-0 rounded-full border border-amber-400/10 scale-75" />
                </div>

                {/* Pulsing dot at top */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <span className="animate-ping-slow absolute w-3 h-3 rounded-full bg-amber-400/40" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>

                {/* ── FLOATING CARD 1: Package ── */}
                <div className="absolute -top-6 -start-10 animate-float z-20">
                  <div className="bg-white/8 backdrop-blur-2xl border border-white/15 rounded-2xl p-3 w-48 shadow-2xl"
                    style={{background:'rgba(255,255,255,0.07)'}}>
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-sm">✈️</div>
                      <span className="text-white/90 text-xs font-arabic font-medium leading-tight">
                        {lang === 'ar' ? 'باقة رمضان المميزة' : 'Pack Ramadan Premium'}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-amber-400 font-bold text-base">245,000</span>
                        <span className="text-white/30 text-xs ms-1">DZD</span>
                      </div>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-lg border border-green-500/20">
                        {lang === 'ar' ? 'متاح' : 'Dispo'}
                      </span>
                    </div>
                    <div className="mt-2 flex gap-0.5">
                      {[1,2,3,4,5].map(s=><span key={s} className="text-amber-400 text-xs">★</span>)}
                    </div>
                  </div>
                </div>

                {/* ── FLOATING CARD 2: Rating ── */}
                <div className="absolute top-1/3 -end-8 animate-float2 z-20">
                  <div className="backdrop-blur-2xl border border-white/15 rounded-2xl p-3.5 shadow-2xl"
                    style={{background:'rgba(255,255,255,0.07)'}}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-amber-400 text-xl font-bold">4.9</span>
                      <span className="text-amber-400 text-base">★</span>
                    </div>
                    <div className="text-white/40 text-xs whitespace-nowrap">
                      {lang === 'ar' ? '320+ تقييم' : '320+ avis'}
                    </div>
                    <div className="mt-2 w-full h-1 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-[98%] rounded-full bg-amber-400/60" />
                    </div>
                  </div>
                </div>

                {/* ── FLOATING CARD 3: Verified agency ── */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 animate-float3 z-20 w-52">
                  <div className="backdrop-blur-2xl border border-white/15 rounded-2xl px-3.5 py-3 shadow-2xl"
                    style={{background:'rgba(255,255,255,0.07)'}}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-green-800/50 border border-green-500/20 flex items-center justify-center text-lg shrink-0">🏢</div>
                      <div>
                        <p className="text-white/90 text-xs font-semibold font-arabic leading-tight">
                          {lang === 'ar' ? 'النور للسياحة' : 'Al Nour Tourisme'}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-green-400 text-xs">✓</span>
                          <span className="text-green-400/70 text-xs">
                            {lang === 'ar' ? 'وكالة معتمدة' : 'Agence certifiée'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ambient dots */}
                <span className="absolute top-10 end-6 w-1.5 h-1.5 rounded-full bg-amber-400/50 animate-pulse" />
                <span className="absolute bottom-20 start-2 w-1 h-1 rounded-full bg-green-400/60 animate-pulse" style={{animationDelay:'1s'}} />
                <span className="absolute top-1/2 start-1 w-1 h-1 rounded-full bg-amber-300/40 animate-pulse" style={{animationDelay:'2s'}} />
              </div>
            </div>

          </div>
        </div>

        {/* ── STATS BAR ── */}
        <div className="relative z-10 border-t border-white/5 mt-auto"
          style={{background:'rgba(0,0,0,0.25)', backdropFilter:'blur(12px)'}}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
              {stats.map((stat, i) => (
                <div key={stat.key}
                  className={`flex items-center gap-3 ${i < 3 ? 'md:border-e border-white/10' : ''} ${i > 0 ? 'md:px-8' : ''}`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border border-white/10"
                    style={{background:'rgba(255,255,255,0.05)'}}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-white font-bold text-xl leading-tight">{stat.value}</div>
                    <div className="text-white/40 text-xs leading-tight">{t.hero.stats[stat.key]}</div>
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
