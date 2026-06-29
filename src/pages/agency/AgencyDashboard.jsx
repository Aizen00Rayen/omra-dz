import { useState } from 'react';
import {
  Card, CardBody, Button, Chip, Input, Textarea, Select, SelectItem,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Divider, Avatar
} from '../../components/ui';
import { useLang } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const statusColor = { pending: 'warning', confirmed: 'success', cancelled: 'danger', completed: 'default' };

const emptyPkg = {
  name: '', nameFr: '', description: '', descriptionFr: '',
  duration: 10, price: 0, category: 'economy',
  hotel: { mecca: '', meccaFr: '', meccaStars: 4, medina: '', medinaFr: '', medinaStars: 4 },
  includes: [], includesFr: [], excludes: [], excludesFr: [],
  departure: '', departureFr: '', departureDate: '', returnDate: '',
  availableSeats: 30, totalSeats: 30, images: [], featured: false,
};

export default function AgencyDashboard() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const { getPackages, getBookingsByAgency, getUserById, getPackageById, addPackage, updatePackage, deletePackage, updateBooking, getAgencyById } = useData();

  const agency = getAgencyById(user.agencyId);
  const packages = getPackages({ agencyId: user.agencyId });
  const bookings = getBookingsByAgency(user.agencyId);

  const [activeTab, setActiveTab] = useState('overview');
  const [pkgModalOpen, setPkgModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [pkgForm, setPkgForm] = useState(emptyPkg);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [includesText, setIncludesText] = useState('');
  const [includesFrText, setIncludesFrText] = useState('');

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalRevenue = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalPrice, 0);
  const totalTravelers = bookings.reduce((s, b) => s + b.travelers, 0);

  const openAddPkg = () => {
    setEditingPkg(null);
    setPkgForm({ ...emptyPkg, agencyId: user.agencyId });
    setIncludesText('');
    setIncludesFrText('');
    setPkgModalOpen(true);
  };

  const openEditPkg = (pkg) => {
    setEditingPkg(pkg);
    setPkgForm({ ...pkg });
    setIncludesText(pkg.includes.join('\n'));
    setIncludesFrText(pkg.includesFr.join('\n'));
    setPkgModalOpen(true);
  };

  const handleSavePkg = () => {
    const finalPkg = {
      ...pkgForm,
      includes: includesText.split('\n').filter(Boolean),
      includesFr: includesFrText.split('\n').filter(Boolean),
    };
    if (editingPkg) {
      updatePackage(editingPkg.id, finalPkg);
    } else {
      addPackage({ ...finalPkg, agencyId: user.agencyId });
    }
    setPkgModalOpen(false);
  };

  const handleDeletePkg = (id) => {
    deletePackage(id);
    setDeleteConfirm(null);
  };

  const handleBookingAction = (bookingId, status) => {
    updateBooking(bookingId, {
      status,
      paymentStatus: status === 'confirmed' ? 'paid' : 'refunded',
    });
  };

  const statsCards = [
    { label: t.agencyDashboard.totalBookings, value: bookings.length, icon: '📋', color: 'bg-blue-50 text-blue-700' },
    { label: t.agencyDashboard.pendingBookings, value: pendingBookings, icon: '⏳', color: 'bg-amber-50 text-amber-700' },
    { label: t.agencyDashboard.confirmedBookings, value: confirmedBookings, icon: '✅', color: 'bg-green-50 text-green-700' },
    { label: t.agencyDashboard.totalRevenue, value: `${totalRevenue.toLocaleString('fr-DZ')} ${t.common.dz}`, icon: '💰', color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4">
            {agency && <Avatar src={agency.logo} className="w-16 h-16 ring-4 ring-amber-400" />}
            <div>
              <h1 className="text-2xl font-bold text-white font-arabic">
                {lang === 'ar' ? (agency?.name || user.name) : (agency?.nameFr || user.nameFr || user.name)}
              </h1>
              <p className="text-green-200 text-sm">{user.email}</p>
            </div>
            <div className="md:ms-auto">
              <Button className="bg-amber-500 text-white font-semibold" onPress={openAddPkg}>
                + {t.agencyDashboard.addPackage}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statsCards.map(card => (
            <Card key={card.label} className="border border-gray-100" shadow="sm">
              <CardBody className={`p-4 ${card.color} rounded-2xl`}>
                <div className="text-2xl mb-2">{card.icon}</div>
                <div className="text-2xl font-bold mb-1">{card.value}</div>
                <div className="text-xs opacity-70">{card.label}</div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-6 w-fit">
          {[
            { key: 'overview', label: t.agencyDashboard.overview, icon: '📊' },
            { key: 'packages', label: t.agencyDashboard.myPackages, icon: '📦' },
            { key: 'bookings', label: t.agencyDashboard.bookings, icon: '📋' },
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

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-gray-100">
              <CardBody className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 font-arabic">
                  {lang === 'ar' ? 'آخر الحجوزات' : 'Dernières réservations'}
                </h3>
                <div className="space-y-3">
                  {bookings.slice(0, 4).map(b => {
                    const pkg = getPackageById(b.packageId);
                    const u = getUserById(b.userId);
                    return (
                      <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-sm text-gray-800 font-arabic">
                            {lang === 'ar' ? u?.name : (u?.nameFr || u?.name)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {lang === 'ar' ? pkg?.name : pkg?.nameFr}
                          </p>
                        </div>
                        <Chip size="sm" color={statusColor[b.status]} variant="flat">
                          {t.userDashboard.bookingStatus[b.status]}
                        </Chip>
                      </div>
                    );
                  })}
                  {bookings.length === 0 && (
                    <p className="text-gray-400 text-sm text-center py-4">
                      {lang === 'ar' ? 'لا توجد حجوزات بعد' : 'Aucune réservation encore'}
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>

            <Card className="border border-gray-100">
              <CardBody className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 font-arabic">
                  {lang === 'ar' ? 'باقاتي' : 'Mes packages'}
                </h3>
                <div className="space-y-3">
                  {packages.map(pkg => (
                    <div key={pkg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-sm text-gray-800 font-arabic">
                          {lang === 'ar' ? pkg.name : pkg.nameFr}
                        </p>
                        <p className="text-xs text-gray-400">
                          {pkg.availableSeats}/{pkg.totalSeats} {t.packages.availableSeats}
                        </p>
                      </div>
                      <span className="font-bold text-green-700 text-sm">
                        {pkg.price.toLocaleString('fr-DZ')} {t.common.dz}
                      </span>
                    </div>
                  ))}
                  {packages.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-400 text-sm mb-3">{t.agencyDashboard.noPackages}</p>
                      <Button size="sm" className="bg-green-700 text-white" onPress={openAddPkg}>
                        + {t.agencyDashboard.addPackage}
                      </Button>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Packages */}
        {activeTab === 'packages' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 font-arabic">{t.agencyDashboard.myPackages}</h3>
              <Button className="bg-green-700 text-white" size="sm" onPress={openAddPkg}>
                + {t.agencyDashboard.addPackage}
              </Button>
            </div>
            {packages.length === 0 ? (
              <Card className="border border-gray-100">
                <CardBody className="p-12 text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500 mb-4 font-arabic">{t.agencyDashboard.noPackages}</p>
                  <Button className="bg-green-700 text-white" onPress={openAddPkg}>
                    + {t.agencyDashboard.addPackage}
                  </Button>
                </CardBody>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map(pkg => (
                  <Card key={pkg.id} className="border border-gray-100">
                    <CardBody className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900 font-arabic">
                            {lang === 'ar' ? pkg.name : pkg.nameFr}
                          </h4>
                          <p className="text-sm text-gray-500">{pkg.duration} {t.packages.nights}</p>
                        </div>
                        <Chip size="sm" color={pkg.active ? 'success' : 'default'} variant="flat">
                          {pkg.active ? t.agencyDashboard.active : t.agencyDashboard.inactive}
                        </Chip>
                      </div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-500">{t.agencyDashboard.price}</span>
                        <span className="font-bold text-green-700">{pkg.price.toLocaleString('fr-DZ')} {t.common.dz}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-4">
                        <span className="text-gray-500">{t.agencyDashboard.seats}</span>
                        <span>{pkg.availableSeats}/{pkg.totalSeats}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="flat" className="text-green-700" onPress={() => openEditPkg(pkg)}>
                          ✏️ {t.common.edit}
                        </Button>
                        <Button size="sm" variant="flat" color={pkg.active ? 'warning' : 'success'}
                          onPress={() => updatePackage(pkg.id, { active: !pkg.active })}>
                          {pkg.active ? '⏸️' : '▶️'}
                        </Button>
                        <Button size="sm" variant="flat" color="danger" onPress={() => setDeleteConfirm(pkg.id)}>
                          🗑️
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <Card className="border border-gray-100">
                <CardBody className="p-12 text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-500 font-arabic">
                    {lang === 'ar' ? 'لا توجد حجوزات بعد' : 'Aucune réservation encore'}
                  </p>
                </CardBody>
              </Card>
            ) : (
              bookings.map(booking => {
                const pkg = getPackageById(booking.packageId);
                const u = getUserById(booking.userId);
                return (
                  <Card key={booking.id} className="border border-gray-100">
                    <CardBody className="p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar src={u?.avatar} size="sm" />
                            <div>
                              <p className="font-semibold text-gray-900 text-sm font-arabic">
                                {lang === 'ar' ? u?.name : (u?.nameFr || u?.name)}
                              </p>
                              <p className="text-xs text-gray-400">{u?.email}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 font-arabic">
                            📦 {lang === 'ar' ? pkg?.name : pkg?.nameFr}
                          </p>
                          <p className="text-xs text-gray-400">
                            👥 {booking.travelers} · 📅 {booking.bookingDate}
                          </p>
                        </div>
                        <div className="text-end">
                          <div className="font-bold text-green-700 text-lg mb-1">
                            {booking.totalPrice.toLocaleString('fr-DZ')} {t.common.dz}
                          </div>
                          <Chip size="sm" color={statusColor[booking.status]} variant="flat">
                            {t.userDashboard.bookingStatus[booking.status]}
                          </Chip>
                        </div>
                      </div>
                      {booking.status === 'pending' && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                          <Button size="sm" color="success" className="text-white"
                            onPress={() => handleBookingAction(booking.id, 'confirmed')}>
                            ✅ {t.agencyDashboard.confirmBooking}
                          </Button>
                          <Button size="sm" color="danger" variant="flat"
                            onPress={() => handleBookingAction(booking.id, 'cancelled')}>
                            ❌ {t.agencyDashboard.cancelBooking}
                          </Button>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Package Modal */}
      <Modal isOpen={pkgModalOpen} onClose={() => setPkgModalOpen(false)} size="3xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="font-arabic">
            {editingPkg ? t.agencyDashboard.editPackage : t.agencyDashboard.addPackage}
          </ModalHeader>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label={`${t.agencyDashboard.packageName} (عربي)`} value={pkgForm.name}
                onChange={e => setPkgForm(p => ({ ...p, name: e.target.value }))} variant="bordered" />
              <Input label={`${t.agencyDashboard.packageName} (FR)`} value={pkgForm.nameFr}
                onChange={e => setPkgForm(p => ({ ...p, nameFr: e.target.value }))} variant="bordered" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea label="الوصف (عربي)" value={pkgForm.description}
                onChange={e => setPkgForm(p => ({ ...p, description: e.target.value }))} variant="bordered" rows={3} />
              <Textarea label="Description (FR)" value={pkgForm.descriptionFr}
                onChange={e => setPkgForm(p => ({ ...p, descriptionFr: e.target.value }))} variant="bordered" rows={3} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input type="number" label={`${t.agencyDashboard.price} (DZD)`} value={pkgForm.price}
                onChange={e => setPkgForm(p => ({ ...p, price: parseInt(e.target.value) }))} variant="bordered" />
              <Input type="number" label={`${t.agencyDashboard.duration} (${t.packages.nights})`} value={pkgForm.duration}
                onChange={e => setPkgForm(p => ({ ...p, duration: parseInt(e.target.value) }))} variant="bordered" />
              <Input type="number" label={t.agencyDashboard.seats} value={pkgForm.availableSeats}
                onChange={e => setPkgForm(p => ({ ...p, availableSeats: parseInt(e.target.value), totalSeats: parseInt(e.target.value) }))} variant="bordered" />
              <Select label={lang === 'ar' ? 'الفئة' : 'Catégorie'} selectedKeys={[pkgForm.category]}
                onChange={e => setPkgForm(p => ({ ...p, category: e.target.value }))} variant="bordered">
                {['economy', 'family', 'premium', 'luxury'].map(c => <SelectItem key={c}>{c}</SelectItem>)}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label={`${lang === 'ar' ? 'مدينة المغادرة' : 'Ville départ'} (عربي)`} value={pkgForm.departure}
                onChange={e => setPkgForm(p => ({ ...p, departure: e.target.value }))} variant="bordered" />
              <Input label={`${lang === 'ar' ? 'مدينة المغادرة' : 'Ville départ'} (FR)`} value={pkgForm.departureFr}
                onChange={e => setPkgForm(p => ({ ...p, departureFr: e.target.value }))} variant="bordered" />
              <Input type="date" label={t.packages.departureDate} value={pkgForm.departureDate}
                onChange={e => setPkgForm(p => ({ ...p, departureDate: e.target.value }))} variant="bordered" />
              <Input type="date" label={lang === 'ar' ? 'تاريخ العودة' : 'Date retour'} value={pkgForm.returnDate}
                onChange={e => setPkgForm(p => ({ ...p, returnDate: e.target.value }))} variant="bordered" />
            </div>
            <Divider />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea label={`${t.packages.includes} (عربي) - سطر لكل عنصر`} value={includesText}
                onChange={e => setIncludesText(e.target.value)} variant="bordered" rows={4}
                placeholder="تأشيرة العمرة&#10;تذاكر الطيران&#10;الإقامة" />
              <Textarea label={`${t.packages.includes} (FR) - 1 par ligne`} value={includesFrText}
                onChange={e => setIncludesFrText(e.target.value)} variant="bordered" rows={4}
                placeholder="Visa Omra&#10;Billets avion&#10;Hébergement" />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setPkgModalOpen(false)}>{t.common.cancel}</Button>
            <Button className="bg-green-700 text-white" onPress={handleSavePkg}>{t.common.save}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} size="sm">
        <ModalContent>
          <ModalHeader>{lang === 'ar' ? 'تأكيد الحذف' : 'Confirmer la suppression'}</ModalHeader>
          <ModalBody>
            <p className="text-gray-600 text-sm">
              {lang === 'ar' ? 'هل أنت متأكد من حذف هذه الباقة؟' : 'Êtes-vous sûr de supprimer ce package?'}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setDeleteConfirm(null)}>{t.common.cancel}</Button>
            <Button color="danger" onPress={() => handleDeletePkg(deleteConfirm)}>{t.common.delete}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
