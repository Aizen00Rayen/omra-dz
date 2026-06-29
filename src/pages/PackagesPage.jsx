import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Input, Button, Select, SelectItem, Chip, Slider } from '../components/ui';
import { useLang } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import PackageCard from '../components/PackageCard';
import BookingModal from '../components/BookingModal';

const categories = ['all', 'economy', 'family', 'premium', 'luxury'];

export default function PackagesPage() {
  const { t, lang } = useLang();
  const { getPackages } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  let packages = getPackages({ active: true, search: search || undefined });

  if (category !== 'all') packages = packages.filter(p => p.category === category);

  packages = [...packages].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'duration') return a.duration - b.duration;
    return b.featured - a.featured;
  });

  const handleBook = (pkg) => {
    if (!user) { navigate('/login'); return; }
    setSelectedPackage(pkg);
    setBookingOpen(true);
  };

  const catLabels = {
    all: t.packages.all,
    economy: t.packages.economy,
    family: t.packages.family,
    premium: t.packages.premium,
    luxury: t.packages.luxury,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-3 font-arabic">{t.packages.title}</h1>
          <p className="text-green-200 text-lg">{t.packages.subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Input
              placeholder={t.packages.search}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1"
              variant="bordered"
              startContent={<span className="text-gray-400">🔍</span>}
              size="sm"
            />
            <Select
              label={t.packages.sort}
              selectedKeys={[sortBy]}
              onChange={e => setSortBy(e.target.value)}
              className="w-48"
              variant="bordered"
              size="sm"
            >
              <SelectItem key="featured">{lang === 'ar' ? 'المميزة' : 'En vedette'}</SelectItem>
              <SelectItem key="price_asc">{lang === 'ar' ? 'السعر: الأقل' : 'Prix: croissant'}</SelectItem>
              <SelectItem key="price_desc">{lang === 'ar' ? 'السعر: الأعلى' : 'Prix: décroissant'}</SelectItem>
              <SelectItem key="rating">{lang === 'ar' ? 'التقييم' : 'Note'}</SelectItem>
              <SelectItem key="duration">{lang === 'ar' ? 'المدة' : 'Durée'}</SelectItem>
            </Select>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map(cat => (
              <Chip
                key={cat}
                variant={category === cat ? 'solid' : 'flat'}
                color={category === cat ? 'success' : 'default'}
                className={`cursor-pointer ${category === cat ? 'bg-green-700 text-white' : 'hover:bg-green-50'}`}
                onClick={() => setCategory(cat)}
              >
                {catLabels[cat]}
              </Chip>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            {lang === 'ar'
              ? `${packages.length} باقة متاحة`
              : `${packages.length} package(s) disponible(s)`}
          </p>
        </div>

        {/* Packages Grid */}
        {packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} onBook={handleBook} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2 font-arabic">{t.packages.noPackages}</h3>
            <Button
              variant="flat"
              className="text-green-700 mt-4"
              onPress={() => { setSearch(''); setCategory('all'); }}
            >
              {lang === 'ar' ? 'إعادة ضبط الفلاتر' : 'Réinitialiser les filtres'}
            </Button>
          </div>
        )}
      </div>

      <BookingModal
        pkg={selectedPackage}
        isOpen={bookingOpen}
        onClose={() => { setBookingOpen(false); setSelectedPackage(null); }}
      />
    </div>
  );
}
