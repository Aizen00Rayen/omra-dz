import { Card, CardBody } from '../components/ui';
import { useLang } from '../contexts/LanguageContext';

const team = [
  { name: 'ريان عبد الله هواري', nameFr: 'Rayen Abdellah Houari', role: 'المؤسس والرئيس التنفيذي', roleFr: 'Fondateur & CEO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rayen' },
  { name: 'سارة بن عيسى', nameFr: 'Sara Ben Issa', role: 'مديرة العمليات', roleFr: 'Directrice des Opérations', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara' },
  { name: 'كريم حمادي', nameFr: 'Karim Hammadi', role: 'مدير التقنية', roleFr: 'Directeur Technique', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=karim' },
];

export default function AboutPage() {
  const { t, lang } = useLang();

  const values = [
    { icon: '🔒', key: 'trust' },
    { icon: '⭐', key: 'quality' },
    { icon: '🤝', key: 'service' },
    { icon: '💡', key: 'innovation' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-3 font-arabic">{t.about.title}</h1>
          <p className="text-green-200 text-lg max-w-2xl mx-auto">{t.about.subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-16">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border border-green-100 bg-green-50">
            <CardBody className="p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-green-800 mb-4 font-arabic">{t.about.mission}</h2>
              <p className="text-green-700 leading-relaxed">{t.about.missionText}</p>
            </CardBody>
          </Card>
          <Card className="border border-amber-100 bg-amber-50">
            <CardBody className="p-8">
              <div className="text-4xl mb-4">🌟</div>
              <h2 className="text-2xl font-bold text-amber-800 mb-4 font-arabic">{t.about.vision}</h2>
              <p className="text-amber-700 leading-relaxed">{t.about.visionText}</p>
            </CardBody>
          </Card>
        </div>

        {/* Values */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10 font-arabic">{t.about.values}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <Card key={v.key} className="border border-gray-100 text-center" shadow="sm">
                <CardBody className="p-6">
                  <div className="text-4xl mb-4">{v.icon}</div>
                  <h3 className="font-bold text-gray-900 font-arabic">{t.about[v.key]}</h3>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-green-900 to-green-700 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '3+', label: lang === 'ar' ? 'وكالة معتمدة' : 'Agences certifiées' },
              { value: '6+', label: lang === 'ar' ? 'باقة متاحة' : 'Packages disponibles' },
              { value: '5600+', label: lang === 'ar' ? 'معتمر سعيد' : 'Pèlerins satisfaits' },
              { value: '15+', label: lang === 'ar' ? 'سنة خبرة' : 'Ans d\'expérience' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="text-4xl font-bold text-amber-400 mb-2">{item.value}</div>
                <div className="text-green-200 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10 font-arabic">
            {lang === 'ar' ? 'فريقنا' : 'Notre Équipe'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <Card key={idx} className="border border-gray-100 text-center" shadow="sm">
                <CardBody className="p-6">
                  <img src={member.avatar} alt="" className="w-20 h-20 rounded-full mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 font-arabic">
                    {lang === 'ar' ? member.name : member.nameFr}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {lang === 'ar' ? member.role : member.roleFr}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
