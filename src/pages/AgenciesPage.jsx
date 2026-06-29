import { Link } from 'react-router-dom';
import { Card, CardBody, Button, Chip, Avatar, Input } from '../components/ui';
import { useState } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';

export default function AgenciesPage() {
  const { t, lang } = useLang();
  const { db } = useData();
  const [search, setSearch] = useState('');

  const agencies = db.agencies.filter(a => a.active && (
    !search || a.name.includes(search) || a.nameFr.toLowerCase().includes(search.toLowerCase()) ||
    a.wilaya.includes(search) || a.wilayaFr.toLowerCase().includes(search.toLowerCase())
  ));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-3 font-arabic">{t.agencies.title}</h1>
          <p className="text-green-200 text-lg">{t.agencies.subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-8">
          <Input
            placeholder={lang === 'ar' ? 'البحث عن وكالة أو ولاية...' : 'Rechercher une agence ou wilaya...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            variant="bordered"
            startContent={<span className="text-gray-400">🔍</span>}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agencies.map(agency => (
            <Card key={agency.id} className="card-hover border border-gray-100" shadow="sm">
              <CardBody className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar
                    src={agency.logo}
                    size="lg"
                    className="shrink-0 ring-2 ring-green-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-base font-arabic line-clamp-1">
                        {lang === 'ar' ? agency.name : agency.nameFr}
                      </h3>
                    </div>
                    {agency.verified && (
                      <Chip size="sm" color="success" variant="flat" className="text-xs mb-1">
                        ✓ {t.agencies.verified}
                      </Chip>
                    )}
                    <p className="text-gray-400 text-xs">📍 {lang === 'ar' ? agency.wilaya : agency.wilayaFr}</p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                  {lang === 'ar' ? agency.description : agency.descriptionFr}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-amber-50 rounded-lg p-2 text-center">
                    <div className="text-amber-600 font-bold text-base">{agency.rating}</div>
                    <div className="text-gray-400 text-xs">{t.common.rating}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <div className="text-green-700 font-bold text-base">{agency.packageCount}</div>
                    <div className="text-gray-400 text-xs">{t.agencies.packages}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <div className="text-blue-700 font-bold text-base">{agency.founded}</div>
                    <div className="text-gray-400 text-xs">{lang === 'ar' ? 'تأسست' : 'Fondée'}</div>
                  </div>
                </div>

                {/* License */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <span>📋 {t.agencies.license}:</span>
                  <span className="font-mono">{agency.license}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    as={Link}
                    to={`/agencies/${agency.id}`}
                    size="sm"
                    className="flex-1 bg-green-700 text-white hover:bg-green-800"
                  >
                    {t.agencies.viewPackages}
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    className="text-green-700"
                    as="a"
                    href={`mailto:${agency.email}`}
                  >
                    ✉️
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {agencies.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏢</div>
            <p className="text-gray-500 font-arabic">
              {lang === 'ar' ? 'لا توجد وكالات متاحة' : 'Aucune agence disponible'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
