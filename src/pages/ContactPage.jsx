import { useState } from 'react';
import { Card, CardBody, Input, Textarea, Button } from '../components/ui';
import { useLang } from '../contexts/LanguageContext';

export default function ContactPage() {
  const { t, lang } = useLang();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: '📍', label: lang === 'ar' ? 'العنوان' : 'Adresse', value: t.footer.address },
    { icon: '📞', label: lang === 'ar' ? 'الهاتف' : 'Téléphone', value: t.footer.phone },
    { icon: '✉️', label: lang === 'ar' ? 'البريد الإلكتروني' : 'Email', value: t.footer.email },
    { icon: '🕐', label: lang === 'ar' ? 'ساعات العمل' : 'Horaires', value: lang === 'ar' ? 'الأحد - الخميس: 8ص - 5م' : 'Dim - Jeu: 8h - 17h' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-900 to-green-700 py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-3 font-arabic">{t.contact.title}</h1>
          <p className="text-green-200 text-lg">{t.contact.subtitle}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-bold text-gray-900 text-xl mb-6 font-arabic">
              {lang === 'ar' ? 'معلومات التواصل' : 'Informations de contact'}
            </h2>
            {contactInfo.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">{item.label}</p>
                  <p className="text-gray-800 text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <p className="text-gray-400 text-sm mb-3">
                {lang === 'ar' ? 'تابعنا على وسائل التواصل الاجتماعي' : 'Suivez-nous sur les réseaux sociaux'}
              </p>
              <div className="flex gap-3">
                {['Facebook', 'Instagram', 'Twitter'].map(s => (
                  <a key={s} href="#" className="w-9 h-9 bg-green-700 text-white rounded-xl flex items-center justify-center text-sm hover:bg-amber-500 transition-colors no-underline">
                    {s[0]}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <Card className="border border-gray-100">
              <CardBody className="p-8">
                {sent ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-green-700 mb-2 font-arabic">
                      {t.contact.successMessage}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                      {lang === 'ar' ? 'سنرد عليك في أقرب وقت ممكن' : 'Nous vous répondrons dans les plus brefs délais'}
                    </p>
                    <Button className="bg-green-700 text-white" onPress={() => setSent(false)}>
                      {lang === 'ar' ? 'إرسال رسالة أخرى' : 'Envoyer un autre message'}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label={t.contact.name} value={form.name} onChange={e => update('name', e.target.value)}
                        variant="bordered" isRequired />
                      <Input type="email" label={t.contact.email} value={form.email} onChange={e => update('email', e.target.value)}
                        variant="bordered" isRequired />
                    </div>
                    <Input label={t.contact.subject} value={form.subject} onChange={e => update('subject', e.target.value)}
                      variant="bordered" isRequired />
                    <Textarea label={t.contact.message} value={form.message} onChange={e => update('message', e.target.value)}
                      variant="bordered" rows={5} isRequired />
                    <Button type="submit" className="w-full bg-green-700 text-white font-semibold h-12">
                      {t.contact.send}
                    </Button>
                  </form>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
