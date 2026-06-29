import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, CardBody, Button, Chip, Avatar, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
} from '../../components/ui';
import { useLang } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const statusColor = { pending: 'warning', confirmed: 'success', cancelled: 'danger', completed: 'default' };
const payStatusColor = { pending: 'warning', paid: 'success', refunded: 'danger' };

export default function UserDashboard() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const { getBookingsByUser, getPackageById, getAgencyById, updateBooking } = useData();
  const [activeTab, setActiveTab] = useState('bookings');
  const [cancelId, setCancelId] = useState(null);

  const bookings = getBookingsByUser(user.id);
  const name = lang === 'ar' ? user.name : (user.nameFr || user.name);

  const totalSpent = bookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const handleCancel = (id) => {
    updateBooking(id, { status: 'cancelled', paymentStatus: 'refunded' });
    setCancelId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4">
            <Avatar src={user.avatar} className="w-16 h-16 ring-4 ring-amber-400" />
            <div>
              <h1 className="text-2xl font-bold text-white font-arabic">
                {lang === 'ar' ? `أهلاً، ${name}` : `Bienvenue, ${name}`}
              </h1>
              <p className="text-green-200 text-sm">{user.email}</p>
            </div>
            <div className="md:ms-auto flex gap-6 text-center hidden md:flex">
              <div>
                <div className="text-2xl font-bold text-amber-400">{bookings.length}</div>
                <div className="text-green-200 text-xs">{t.userDashboard.myBookings}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{totalSpent.toLocaleString('fr-DZ')}</div>
                <div className="text-green-200 text-xs">{t.userDashboard.totalSpent} ({t.common.dz})</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-6 w-fit">
          {[
            { key: 'bookings', label: t.userDashboard.myBookings, icon: '📋' },
            { key: 'profile', label: t.userDashboard.profile, icon: '👤' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
                ${activeTab === tab.key ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <Card className="border border-gray-100">
                <CardBody className="p-12 text-center">
                  <div className="text-6xl mb-4">🕌</div>
                  <p className="text-gray-500 font-arabic text-lg mb-4">{t.userDashboard.noBookings}</p>
                  <Button as={Link} to="/packages" className="bg-green-700 text-white">
                    {lang === 'ar' ? 'اكتشف الباقات' : 'Découvrir les packages'}
                  </Button>
                </CardBody>
              </Card>
            ) : (
              bookings.map(booking => {
                const pkg = getPackageById(booking.packageId);
                const agency = getAgencyById(booking.agencyId);
                if (!pkg) return null;
                return (
                  <Card key={booking.id} className="border border-gray-100">
                    <CardBody className="p-0 overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="w-full md:w-40 h-32 md:h-auto shrink-0 bg-green-900 overflow-hidden">
                          {pkg.images?.[0] ? (
                            <img src={pkg.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🕋</div>
                          )}
                        </div>
                        {/* Content */}
                        <div className="flex-1 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900 font-arabic">
                                {lang === 'ar' ? pkg.name : pkg.nameFr}
                              </h3>
                              {agency && (
                                <p className="text-gray-400 text-xs">
                                  {lang === 'ar' ? agency.name : agency.nameFr}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Chip size="sm" color={statusColor[booking.status]} variant="flat">
                                {t.userDashboard.bookingStatus[booking.status]}
                              </Chip>
                              <Chip size="sm" color={payStatusColor[booking.paymentStatus]} variant="flat">
                                {t.userDashboard.paymentStatus[booking.paymentStatus]}
                              </Chip>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-3 text-sm">
                            <div>
                              <div className="text-gray-400 text-xs">{lang === 'ar' ? 'تاريخ الحجز' : 'Date réservation'}</div>
                              <div className="font-medium text-gray-800">{booking.bookingDate}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 text-xs">{lang === 'ar' ? 'عدد المسافرين' : 'Voyageurs'}</div>
                              <div className="font-medium text-gray-800">{booking.travelers}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 text-xs">{lang === 'ar' ? 'المغادرة' : 'Départ'}</div>
                              <div className="font-medium text-gray-800">{pkg.departureDate}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 text-xs">{t.booking.totalPrice}</div>
                              <div className="font-bold text-green-700">{booking.totalPrice.toLocaleString('fr-DZ')} {t.common.dz}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Button as={Link} to={`/packages/${pkg.id}`} size="sm" variant="flat" className="text-green-700">
                              {t.userDashboard.viewDetails}
                            </Button>
                            {booking.status === 'pending' && (
                              <Button
                                size="sm"
                                color="danger"
                                variant="flat"
                                onPress={() => setCancelId(booking.id)}
                              >
                                {t.userDashboard.cancelBooking}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card className="border border-gray-100 max-w-xl">
            <CardBody className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar src={user.avatar} className="w-16 h-16" />
                <div>
                  <h3 className="font-bold text-gray-900 font-arabic">{name}</h3>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>
              <Divider className="mb-6" />
              <div className="space-y-4 text-sm">
                {[
                  { label: lang === 'ar' ? 'الاسم' : 'Nom', value: name, icon: '👤' },
                  { label: lang === 'ar' ? 'البريد الإلكتروني' : 'Email', value: user.email, icon: '✉️' },
                  { label: lang === 'ar' ? 'الهاتف' : 'Téléphone', value: user.phone || '—', icon: '📞' },
                  { label: lang === 'ar' ? 'الولاية' : 'Wilaya', value: user.wilaya || '—', icon: '📍' },
                  { label: lang === 'ar' ? 'تاريخ الانضمام' : 'Membre depuis', value: user.createdAt, icon: '📅' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <div className="text-gray-400 text-xs">{item.label}</div>
                      <div className="font-medium text-gray-800">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Cancel confirm modal */}
      <Modal isOpen={!!cancelId} onClose={() => setCancelId(null)} size="sm">
        <ModalContent>
          <ModalHeader className="font-arabic">
            {lang === 'ar' ? 'تأكيد الإلغاء' : 'Confirmer l\'annulation'}
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-600 text-sm">
              {lang === 'ar'
                ? 'هل أنت متأكد من إلغاء هذا الحجز؟ سيتم استرداد المبلغ خلال 5-7 أيام عمل.'
                : 'Êtes-vous sûr d\'annuler cette réservation? Le remboursement sera effectué sous 5-7 jours ouvrables.'}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setCancelId(null)}>{t.common.cancel}</Button>
            <Button color="danger" onPress={() => handleCancel(cancelId)}>
              {lang === 'ar' ? 'نعم، إلغاء الحجز' : 'Oui, annuler'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
