import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, Chip, Avatar, Divider, Card, CardBody } from '../components/ui';
import { useLang } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import BookingModal from '../components/BookingModal';

const StarIcon = ({ filled }) => <span className={filled ? 'text-amber-400' : 'text-gray-300'}>★</span>;

export default function PackageDetailPage() {
  const { id } = useParams();
  const { t, lang } = useLang();
  const { getPackageById, getAgencyById, getReviewsByAgency } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const pkg = getPackageById(id);
  if (!pkg) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-gray-600 mb-4 font-arabic">
          {lang === 'ar' ? 'الباقة غير موجودة' : 'Package introuvable'}
        </h2>
        <Button as={Link} to="/packages" className="bg-green-700 text-white">
          {lang === 'ar' ? 'العودة للباقات' : 'Retour aux packages'}
        </Button>
      </div>
    </div>
  );

  const agency = getAgencyById(pkg.agencyId);
  const reviews = getReviewsByAgency(pkg.agencyId);
  const name = lang === 'ar' ? pkg.name : pkg.nameFr;
  const description = lang === 'ar' ? pkg.description : pkg.descriptionFr;
  const includes = lang === 'ar' ? pkg.includes : pkg.includesFr;
  const excludes = lang === 'ar' ? pkg.excludes : pkg.excludesFr;
  const departure = lang === 'ar' ? pkg.departure : pkg.departureFr;
  const seatsPercent = Math.round(((pkg.totalSeats - pkg.availableSeats) / pkg.totalSeats) * 100);

  const tabs = [
    { key: 'overview', label: lang === 'ar' ? 'نظرة عامة' : 'Aperçu' },
    { key: 'includes', label: lang === 'ar' ? 'ما يشمل' : 'Inclusions' },
    { key: 'hotel', label: lang === 'ar' ? 'الفنادق' : 'Hôtels' },
    { key: 'reviews', label: lang === 'ar' ? 'التقييمات' : 'Avis' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-72 md:h-96 overflow-hidden bg-green-900">
        {pkg.images?.[0] && (
          <img src={pkg.images[0]} alt={name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pb-8 w-full">
            <Button
              as={Link}
              to="/packages"
              variant="flat"
              size="sm"
              className="bg-white/20 text-white mb-4"
            >
              ← {t.common.back}
            </Button>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex gap-2 mb-2">
                  <Chip size="sm" className="bg-amber-500 text-white">{lang === 'ar' ? pkg.category : pkg.category}</Chip>
                  {pkg.featured && <Chip size="sm" className="bg-white/20 text-white">⭐ {t.packages.featured}</Chip>}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-arabic">{name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  {[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= Math.round(pkg.rating)} />)}
                  <span className="text-white/80 text-sm">({pkg.reviewCount} {t.common.reviews})</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center min-w-36">
                <div className="text-xs text-gray-400">{t.packages.from}</div>
                <div className="text-2xl font-bold text-green-700">{pkg.price.toLocaleString('fr-DZ')}</div>
                <div className="text-xs text-gray-500">{t.common.dz}/{t.common.person}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-6 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                    ${activeTab === tab.key
                      ? 'bg-green-700 text-white'
                      : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 font-arabic">
                      {lang === 'ar' ? 'وصف الباقة' : 'Description du package'}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{description}</p>
                  </div>
                  <Divider />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: '📅', label: lang === 'ar' ? 'المدة' : 'Durée', value: `${pkg.duration} ${t.packages.nights}` },
                      { icon: '✈️', label: t.packages.departure, value: departure },
                      { icon: '🗓️', label: t.packages.departureDate, value: pkg.departureDate },
                      { icon: '💺', label: t.packages.availableSeats, value: `${pkg.availableSeats}/${pkg.totalSeats}` },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                        <div className="font-semibold text-gray-800 text-sm">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'includes' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2 font-arabic">
                      <span>✅</span> {t.packages.includes}
                    </h3>
                    <ul className="space-y-2">
                      {includes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                          <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Divider />
                  <div>
                    <h3 className="font-bold text-red-600 mb-3 flex items-center gap-2 font-arabic">
                      <span>❌</span> {t.packages.excludes}
                    </h3>
                    <ul className="space-y-2">
                      {excludes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                          <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'hotel' && (
                <div className="space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2 font-arabic">
                      🕋 {t.packages.mecca}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{lang === 'ar' ? pkg.hotel.mecca : pkg.hotel.meccaFr}</p>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: pkg.hotel.meccaStars }).map((_, i) => (
                            <span key={i} className="text-amber-400 text-sm">★</span>
                          ))}
                        </div>
                      </div>
                      <Chip size="sm" className="bg-amber-100 text-amber-700">
                        {pkg.hotel.meccaStars} {t.packages.stars}
                      </Chip>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2 font-arabic">
                      🕌 {t.packages.medina}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{lang === 'ar' ? pkg.hotel.medina : pkg.hotel.medinaFr}</p>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: pkg.hotel.medinaStars }).map((_, i) => (
                            <span key={i} className="text-amber-400 text-sm">★</span>
                          ))}
                        </div>
                      </div>
                      <Chip size="sm" className="bg-green-100 text-green-700">
                        {pkg.hotel.medinaStars} {t.packages.stars}
                      </Chip>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {reviews.length > 0 ? reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        {[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= review.rating} />)}
                        <span className="text-gray-400 text-xs">{review.date}</span>
                      </div>
                      <p className="text-gray-700 text-sm">"{lang === 'ar' ? review.comment : review.commentFr}"</p>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-400">
                      {lang === 'ar' ? 'لا توجد تقييمات بعد' : 'Pas encore d\'avis'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Booking Card */}
            <Card className="border border-green-100 sticky top-20">
              <CardBody className="p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-700 mb-1">
                    {pkg.price.toLocaleString('fr-DZ')} <span className="text-base font-normal">{t.common.dz}</span>
                  </div>
                  <div className="text-gray-400 text-sm">{t.packages.from} / {t.common.person}</div>
                </div>

                {/* Seats */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{pkg.availableSeats} {t.packages.availableSeats}</span>
                    <span>{seatsPercent}% {lang === 'ar' ? 'محجوزة' : 'réservé'}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${seatsPercent > 80 ? 'bg-red-500' : 'bg-amber-500'}`}
                      style={{ width: `${seatsPercent}%` }}
                    />
                  </div>
                </div>

                <Button
                  className="w-full bg-green-700 text-white font-semibold mb-3"
                  size="lg"
                  onPress={() => {
                    if (!user) navigate('/login');
                    else setBookingOpen(true);
                  }}
                  isDisabled={pkg.availableSeats === 0}
                >
                  {pkg.availableSeats === 0 ? t.packages.soldOut : t.packages.bookNow}
                </Button>

                <div className="text-center text-xs text-gray-400">
                  {lang === 'ar' ? 'لا رسوم حجز إضافية' : 'Aucun frais de réservation supplémentaires'}
                </div>

                <Divider className="my-4" />

                {/* Quick Info */}
                <div className="space-y-3">
                  {[
                    { icon: '📅', label: lang === 'ar' ? 'تاريخ المغادرة' : 'Départ', value: pkg.departureDate },
                    { icon: '🔙', label: lang === 'ar' ? 'تاريخ العودة' : 'Retour', value: pkg.returnDate },
                    { icon: '⏱️', label: lang === 'ar' ? 'المدة' : 'Durée', value: `${pkg.duration} ${t.packages.nights}` },
                    { icon: '✈️', label: lang === 'ar' ? 'المغادرة من' : 'Départ de', value: departure },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1">
                        <span>{item.icon}</span> {item.label}
                      </span>
                      <span className="font-medium text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Agency Card */}
            {agency && (
              <Card className="border border-gray-100">
                <CardBody className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar src={agency.logo} size="md" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm font-arabic">
                        {lang === 'ar' ? agency.name : agency.nameFr}
                      </p>
                      <Chip size="sm" color="success" variant="flat" className="text-xs">
                        ✓ {t.agencies.verified}
                      </Chip>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-3">
                    <span>⭐ {agency.rating}/5 ({agency.reviewCount})</span>
                    <span>📍 {lang === 'ar' ? agency.wilaya : agency.wilayaFr}</span>
                  </div>
                  <Button
                    as={Link}
                    to={`/agencies/${agency.id}`}
                    size="sm"
                    variant="flat"
                    className="w-full text-green-700"
                  >
                    {t.agencies.viewPackages}
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>

      <BookingModal pkg={pkg} isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
