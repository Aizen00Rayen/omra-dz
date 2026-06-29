import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, Button, Chip, Avatar, Divider } from '../components/ui';
import { useState } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import PackageCard from '../components/PackageCard';
import BookingModal from '../components/BookingModal';

export default function AgencyDetailPage() {
  const { id } = useParams();
  const { t, lang } = useLang();
  const { getAgencyById, getPackages, getReviewsByAgency } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const agency = getAgencyById(id);
  if (!agency) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <Button as={Link} to="/agencies" className="bg-green-700 text-white">
          {lang === 'ar' ? 'العودة للوكالات' : 'Retour aux agences'}
        </Button>
      </div>
    </div>
  );

  const packages = getPackages({ agencyId: id, active: true });
  const reviews = getReviewsByAgency(id);
  const name = lang === 'ar' ? agency.name : agency.nameFr;
  const description = lang === 'ar' ? agency.description : agency.descriptionFr;

  const handleBook = (pkg) => {
    if (!user) { navigate('/login'); return; }
    setSelectedPackage(pkg);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Button as={Link} to="/agencies" variant="flat" size="sm" className="text-white/80 bg-white/10 mb-6">
            ← {t.agencies.title}
          </Button>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar src={agency.logo} className="w-20 h-20 ring-4 ring-amber-400" />
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-3xl font-bold text-white font-arabic">{name}</h1>
                {agency.verified && (
                  <Chip size="sm" className="bg-amber-500 text-white">✓ {t.agencies.verified}</Chip>
                )}
              </div>
              <div className="flex items-center gap-4 text-green-200 text-sm">
                <span>📍 {lang === 'ar' ? agency.wilaya : agency.wilayaFr}</span>
                <span>📋 {agency.license}</span>
                <span>🏢 {lang === 'ar' ? 'منذ' : 'Depuis'} {agency.founded}</span>
              </div>
            </div>
            <div className="md:ms-auto flex gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-amber-400">{agency.rating}</div>
                <div className="text-green-200 text-xs">{t.common.rating}/5</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{agency.reviewCount}</div>
                <div className="text-green-200 text-xs">{t.common.reviews}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{agency.totalPilgrims}+</div>
                <div className="text-green-200 text-xs">{t.agencies.pilgrims}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Packages + Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="border border-gray-100">
              <CardBody className="p-6">
                <h2 className="font-bold text-gray-900 mb-3 font-arabic">
                  {lang === 'ar' ? 'عن الوكالة' : 'À propos de l\'agence'}
                </h2>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </CardBody>
            </Card>

            {/* Packages */}
            <div>
              <h2 className="font-bold text-gray-900 text-xl mb-4 font-arabic">
                {t.agencyDashboard.myPackages} ({packages.length})
              </h2>
              {packages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packages.map(pkg => (
                    <PackageCard key={pkg.id} pkg={pkg} onBook={handleBook} />
                  ))}
                </div>
              ) : (
                <Card className="border border-gray-100">
                  <CardBody className="p-8 text-center text-gray-400">
                    {t.agencyDashboard.noPackages}
                  </CardBody>
                </Card>
              )}
            </div>

            {/* Reviews */}
            <div>
              <h2 className="font-bold text-gray-900 text-xl mb-4 font-arabic">
                {t.common.testimonials} ({reviews.length})
              </h2>
              <div className="space-y-3">
                {reviews.map(review => (
                  <Card key={review.id} className="border border-gray-100">
                    <CardBody className="p-4">
                      <div className="flex gap-1 mb-2">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={s <= review.rating ? 'text-amber-400' : 'text-gray-200'}>★</span>
                        ))}
                        <span className="text-gray-400 text-xs ms-2">{review.date}</span>
                      </div>
                      <p className="text-gray-600 text-sm">"{lang === 'ar' ? review.comment : review.commentFr}"</p>
                    </CardBody>
                  </Card>
                ))}
                {reviews.length === 0 && (
                  <Card className="border border-gray-100">
                    <CardBody className="p-6 text-center text-gray-400">
                      {lang === 'ar' ? 'لا توجد تقييمات بعد' : 'Pas encore d\'avis'}
                    </CardBody>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="border border-gray-100 sticky top-20">
              <CardBody className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 font-arabic">{t.agencies.contact}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>📞</span>
                    <span dir="ltr">{agency.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>✉️</span>
                    <span>{agency.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>🌐</span>
                    <span>{agency.website}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <span>📍</span>
                    <span>{lang === 'ar' ? agency.address : agency.addressFr}</span>
                  </div>
                </div>
                <Divider className="my-4" />
                <Button
                  className="w-full bg-green-700 text-white"
                  as="a"
                  href={`mailto:${agency.email}`}
                >
                  {t.agencies.contact}
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <BookingModal
        pkg={selectedPackage}
        isOpen={bookingOpen}
        onClose={() => { setBookingOpen(false); setSelectedPackage(null); }}
      />
    </div>
  );
}
