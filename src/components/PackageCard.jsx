import { Card, CardBody, CardFooter, Button, Chip, Avatar } from './ui';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';

const StarIcon = ({ filled }) => (
  <span className={filled ? 'text-amber-400' : 'text-gray-300'}>★</span>
);

const categoryColors = {
  economy: 'success',
  family: 'primary',
  premium: 'secondary',
  luxury: 'warning',
};

const categoryLabels = {
  economy: { ar: 'اقتصادية', fr: 'Économique' },
  family: { ar: 'عائلية', fr: 'Familiale' },
  premium: { ar: 'مميزة', fr: 'Premium' },
  luxury: { ar: 'فاخرة', fr: 'Luxe' },
};

export default function PackageCard({ pkg, onBook }) {
  const { t, lang } = useLang();
  const { getAgencyById } = useData();
  const agency = getAgencyById(pkg.agencyId);

  const name = lang === 'ar' ? pkg.name : pkg.nameFr;
  const departure = lang === 'ar' ? pkg.departure : pkg.departureFr;
  const catLabel = categoryLabels[pkg.category]?.[lang] || pkg.category;

  const formattedPrice = pkg.price.toLocaleString('fr-DZ');
  const seatsPercent = Math.round(((pkg.totalSeats - pkg.availableSeats) / pkg.totalSeats) * 100);
  const isSoldOut = pkg.availableSeats === 0;

  return (
    <Card
      className="card-hover border border-gray-100 overflow-hidden group"
      shadow="sm"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-800 to-green-900">
        {pkg.images?.[0] ? (
          <img
            src={pkg.images[0]}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-30">🕌</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 start-3 flex gap-2">
          <Chip size="sm" color={categoryColors[pkg.category]} variant="solid" className="text-xs font-medium">
            {catLabel}
          </Chip>
          {pkg.featured && (
            <Chip size="sm" className="bg-amber-500 text-white text-xs font-medium">
              ⭐ {lang === 'ar' ? 'مميزة' : 'Vedette'}
            </Chip>
          )}
        </div>

        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded-full">
              {t.packages.soldOut}
            </span>
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute bottom-3 end-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-semibold text-green-800">
          {pkg.duration} {t.packages.nights}
        </div>
      </div>

      <CardBody className="p-4">
        {/* Agency */}
        {agency && (
          <div className="flex items-center gap-2 mb-2">
            <Avatar src={agency.logo} size="sm" className="w-5 h-5" />
            <span className="text-xs text-gray-500 truncate">
              {lang === 'ar' ? agency.name : agency.nameFr}
            </span>
          </div>
        )}

        {/* Name */}
        <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1 font-arabic">
          {name}
        </h3>

        {/* Hotels */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span>🕋 {lang === 'ar' ? pkg.hotel.mecca : pkg.hotel.meccaFr}</span>
          <span>•</span>
          <span>🕌 {lang === 'ar' ? pkg.hotel.medina : pkg.hotel.medinaFr}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map(s => <StarIcon key={s} filled={s <= Math.round(pkg.rating)} />)}
          <span className="text-xs text-gray-500 ms-1">({pkg.reviewCount})</span>
        </div>

        {/* Seats progress */}
        <div className="mb-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{pkg.availableSeats} {t.packages.availableSeats}</span>
            <span>{seatsPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${seatsPercent > 80 ? 'bg-red-500' : seatsPercent > 50 ? 'bg-amber-500' : 'bg-green-500'}`}
              style={{ width: `${seatsPercent}%` }}
            />
          </div>
        </div>

        {/* Departure info */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <span>✈️ {departure}</span>
          <span>•</span>
          <span>📅 {pkg.departureDate}</span>
        </div>
      </CardBody>

      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-gray-50">
        {/* Price */}
        <div>
          <div className="text-xs text-gray-400">{t.packages.from}</div>
          <div className="font-bold text-green-700 text-lg">
            {formattedPrice} <span className="text-xs font-normal">{t.common.dz}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            as={Link}
            to={`/packages/${pkg.id}`}
            size="sm"
            variant="flat"
            className="text-green-700 hover:bg-green-50"
          >
            {t.packages.viewDetails}
          </Button>
          {!isSoldOut && (
            <Button
              size="sm"
              className="bg-green-700 text-white hover:bg-green-800"
              onPress={() => onBook && onBook(pkg)}
            >
              {t.packages.bookNow}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
