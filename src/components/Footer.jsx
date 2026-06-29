import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';

export default function Footer() {
  const { t, lang } = useLang();

  return (
    <footer className="bg-green-900 text-white">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                ع
              </div>
              <div>
                <h3 className="font-bold text-xl text-amber-400 font-arabic">
                  {lang === 'ar' ? 'عمرة DZ' : 'Omra DZ'}
                </h3>
                <p className="text-xs text-green-300">
                  {lang === 'ar' ? 'المنصة الجزائرية الأولى' : 'Plateforme N°1 Algérienne'}
                </p>
              </div>
            </div>
            <p className="text-green-200 text-sm leading-relaxed max-w-sm">
              {t.footer.description}
            </p>
            <div className="flex gap-4 mt-6">
              {['facebook', 'instagram', 'twitter', 'youtube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors text-xs"
                  aria-label={social}
                >
                  {social[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-amber-400 mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {[
                { label: t.nav.home, href: '/' },
                { label: t.nav.packages, href: '/packages' },
                { label: t.nav.agencies, href: '/agencies' },
                { label: t.nav.about, href: '/about' },
                { label: t.nav.contact, href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-green-200 hover:text-amber-400 transition-colors text-sm no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-amber-400 mb-4">{t.footer.contact}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-green-200">
                <span className="text-amber-400 mt-0.5">📍</span>
                {t.footer.address}
              </li>
              <li className="flex items-center gap-2 text-green-200">
                <span className="text-amber-400">📞</span>
                <span dir="ltr">{t.footer.phone}</span>
              </li>
              <li className="flex items-center gap-2 text-green-200">
                <span className="text-amber-400">✉️</span>
                {t.footer.email}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-green-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-green-300 text-sm">
            © 2025 {lang === 'ar' ? 'عمرة DZ' : 'Omra DZ'} — {t.footer.rights}
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-green-300 hover:text-amber-400 text-sm no-underline transition-colors">
              {t.footer.privacy}
            </a>
            <a href="#" className="text-green-300 hover:text-amber-400 text-sm no-underline transition-colors">
              {t.footer.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
