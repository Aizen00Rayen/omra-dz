import { useState } from 'react';
import {
  Card, CardBody, Button, Chip, Avatar, Divider,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
} from '../../components/ui';
import { useLang } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';

const roleColor = { admin: 'danger', agency: 'warning', user: 'success' };
const statusColor = { pending: 'warning', confirmed: 'success', cancelled: 'danger', completed: 'default' };

export default function AdminDashboard() {
  const { t, lang } = useLang();
  const { db, updateUser, updateAgency, updateBooking } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [confirmAction, setConfirmAction] = useState(null);

  const stats = [
    { label: t.adminDashboard.totalUsers, value: db.users.filter(u => u.role === 'user').length, icon: '👥', color: 'bg-blue-50 text-blue-700' },
    { label: t.adminDashboard.totalAgencies, value: db.agencies.length, icon: '🏢', color: 'bg-amber-50 text-amber-700' },
    { label: t.adminDashboard.totalPackages, value: db.packages.length, icon: '📦', color: 'bg-green-50 text-green-700' },
    { label: t.adminDashboard.totalBookings, value: db.bookings.length, icon: '📋', color: 'bg-purple-50 text-purple-700' },
    {
      label: t.adminDashboard.totalRevenue,
      value: `${db.bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalPrice, 0).toLocaleString('fr-DZ')} ${t.common.dz}`,
      icon: '💰', color: 'bg-emerald-50 text-emerald-700'
    },
    { label: t.adminDashboard.monthlyGrowth, value: `${db.stats.monthlyGrowth}%`, icon: '📈', color: 'bg-rose-50 text-rose-700' },
  ];

  const handleUserAction = (userId, action) => {
    if (action === 'verify') updateUser(userId, { verified: true });
    if (action === 'suspend') updateUser(userId, { verified: false });
    if (action === 'delete') {
      // In a real app, we'd delete - here we just unverify
      updateUser(userId, { verified: false });
    }
    setConfirmAction(null);
  };

  const handleAgencyAction = (agencyId, action) => {
    if (action === 'approve') updateAgency(agencyId, { verified: true, active: true });
    if (action === 'suspend') updateAgency(agencyId, { verified: false, active: false });
    setConfirmAction(null);
  };

  const tabs = [
    { key: 'overview', label: t.adminDashboard.overview, icon: '📊' },
    { key: 'users', label: t.adminDashboard.users, icon: '👥' },
    { key: 'agencies', label: t.adminDashboard.agencies, icon: '🏢' },
    { key: 'packages', label: t.adminDashboard.packages, icon: '📦' },
    { key: 'bookings', label: t.adminDashboard.bookings, icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-amber-500 rounded-xl flex items-center justify-center text-3xl">
              👑
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-arabic">
                {lang === 'ar' ? 'لوحة تحكم المدير' : 'Tableau de bord Admin'}
              </h1>
              <p className="text-gray-400 text-sm">
                {lang === 'ar' ? 'إدارة شاملة للمنصة' : 'Gestion complète de la plateforme'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map(card => (
            <Card key={card.label} className="border border-gray-100" shadow="sm">
              <CardBody className={`p-4 ${card.color} rounded-2xl`}>
                <div className="text-2xl mb-1">{card.icon}</div>
                <div className="text-xl font-bold mb-0.5">{card.value}</div>
                <div className="text-xs opacity-70 leading-tight">{card.label}</div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 whitespace-nowrap shrink-0
                ${activeTab === tab.key ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
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
                <div className="space-y-2">
                  {db.bookings.slice(0, 5).map(b => {
                    const user = db.users.find(u => u.id === b.userId);
                    const pkg = db.packages.find(p => p.id === b.packageId);
                    return (
                      <div key={b.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Avatar src={user?.avatar} size="sm" />
                          <div>
                            <p className="text-xs font-medium text-gray-800">{lang === 'ar' ? user?.name : (user?.nameFr || user?.name)}</p>
                            <p className="text-xs text-gray-400">{lang === 'ar' ? pkg?.name : pkg?.nameFr}</p>
                          </div>
                        </div>
                        <Chip size="sm" color={statusColor[b.status]} variant="flat">
                          {t.userDashboard.bookingStatus[b.status]}
                        </Chip>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>

            <Card className="border border-gray-100">
              <CardBody className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 font-arabic">
                  {lang === 'ar' ? 'الوكالات' : 'Agences'}
                </h3>
                <div className="space-y-2">
                  {db.agencies.map(a => (
                    <div key={a.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Avatar src={a.logo} size="sm" />
                        <div>
                          <p className="text-xs font-medium text-gray-800">{lang === 'ar' ? a.name : a.nameFr}</p>
                          <p className="text-xs text-gray-400">{lang === 'ar' ? a.wilaya : a.wilayaFr}</p>
                        </div>
                      </div>
                      <Chip size="sm" color={a.verified ? 'success' : 'warning'} variant="flat">
                        {a.verified ? t.adminDashboard.verified : t.adminDashboard.unverified}
                      </Chip>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            {db.users.map(u => (
              <Card key={u.id} className="border border-gray-100">
                <CardBody className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={u.avatar} size="md" />
                      <div>
                        <p className="font-semibold text-gray-900 font-arabic">
                          {lang === 'ar' ? u.name : (u.nameFr || u.name)}
                        </p>
                        <p className="text-gray-400 text-sm">{u.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Chip size="sm" color={roleColor[u.role]} variant="flat">{u.role}</Chip>
                          <Chip size="sm" color={u.verified ? 'success' : 'warning'} variant="flat">
                            {u.verified ? t.adminDashboard.verified : t.adminDashboard.unverified}
                          </Chip>
                        </div>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="text-xs text-gray-400 mb-2">{u.createdAt}</p>
                      <div className="flex gap-2">
                        {!u.verified ? (
                          <Button size="sm" color="success" variant="flat"
                            onPress={() => setConfirmAction({ type: 'verifyUser', id: u.id, action: 'verify' })}>
                            ✅ {t.adminDashboard.approveAgency}
                          </Button>
                        ) : (
                          <Button size="sm" color="warning" variant="flat"
                            onPress={() => setConfirmAction({ type: 'suspendUser', id: u.id, action: 'suspend' })}>
                            ⏸ {t.adminDashboard.suspendUser}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Agencies */}
        {activeTab === 'agencies' && (
          <div className="space-y-3">
            {db.agencies.map(a => (
              <Card key={a.id} className="border border-gray-100">
                <CardBody className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={a.logo} size="lg" />
                      <div>
                        <p className="font-semibold text-gray-900 font-arabic">
                          {lang === 'ar' ? a.name : a.nameFr}
                        </p>
                        <p className="text-gray-400 text-sm">{a.email}</p>
                        <p className="text-gray-400 text-xs">📍 {lang === 'ar' ? a.wilaya : a.wilayaFr} · 📋 {a.license}</p>
                        <div className="flex gap-2 mt-1">
                          <Chip size="sm" color={a.verified ? 'success' : 'warning'} variant="flat">
                            {a.verified ? t.adminDashboard.verified : t.adminDashboard.unverified}
                          </Chip>
                          <Chip size="sm" color={a.active ? 'success' : 'default'} variant="flat">
                            {a.active ? t.adminDashboard.active : t.adminDashboard.suspended}
                          </Chip>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>⭐ {a.rating}</span>
                        <span>·</span>
                        <span>📦 {a.packageCount}</span>
                        <span>·</span>
                        <span>👥 {a.totalPilgrims}</span>
                      </div>
                      <div className="flex gap-2">
                        {!a.verified ? (
                          <Button size="sm" color="success" className="text-white"
                            onPress={() => setConfirmAction({ type: 'approveAgency', id: a.id, action: 'approve' })}>
                            ✅ {t.adminDashboard.approveAgency}
                          </Button>
                        ) : (
                          <Button size="sm" color="warning" variant="flat"
                            onPress={() => setConfirmAction({ type: 'suspendAgency', id: a.id, action: 'suspend' })}>
                            ⏸ {t.adminDashboard.suspendUser}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Packages */}
        {activeTab === 'packages' && (
          <div className="space-y-3">
            {db.packages.map(pkg => {
              const agency = db.agencies.find(a => a.id === pkg.agencyId);
              return (
                <Card key={pkg.id} className="border border-gray-100">
                  <CardBody className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 font-arabic">
                          {lang === 'ar' ? pkg.name : pkg.nameFr}
                        </h4>
                        <p className="text-sm text-gray-400">
                          🏢 {lang === 'ar' ? agency?.name : agency?.nameFr} · {pkg.duration} {t.packages.nights}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Chip size="sm" color="default" variant="flat">{pkg.category}</Chip>
                          <Chip size="sm" color={pkg.active ? 'success' : 'default'} variant="flat">
                            {pkg.active ? t.agencyDashboard.active : t.agencyDashboard.inactive}
                          </Chip>
                          {pkg.featured && <Chip size="sm" color="warning" variant="flat">⭐ Featured</Chip>}
                        </div>
                      </div>
                      <div className="text-end">
                        <p className="font-bold text-green-700 text-lg">{pkg.price.toLocaleString('fr-DZ')} {t.common.dz}</p>
                        <p className="text-xs text-gray-400">💺 {pkg.availableSeats}/{pkg.totalSeats}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {db.bookings.map(b => {
              const u = db.users.find(u => u.id === b.userId);
              const pkg = db.packages.find(p => p.id === b.packageId);
              const agency = db.agencies.find(a => a.id === b.agencyId);
              return (
                <Card key={b.id} className="border border-gray-100">
                  <CardBody className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={u?.avatar} size="md" />
                        <div>
                          <p className="font-semibold text-gray-900 font-arabic">
                            {lang === 'ar' ? u?.name : (u?.nameFr || u?.name)}
                          </p>
                          <p className="text-xs text-gray-400">{lang === 'ar' ? pkg?.name : pkg?.nameFr}</p>
                          <p className="text-xs text-gray-400">
                            🏢 {lang === 'ar' ? agency?.name : agency?.nameFr} · 👥 {b.travelers}
                          </p>
                        </div>
                      </div>
                      <div className="text-end">
                        <p className="font-bold text-green-700">{b.totalPrice.toLocaleString('fr-DZ')} {t.common.dz}</p>
                        <p className="text-xs text-gray-400 mb-1">{b.bookingDate}</p>
                        <div className="flex gap-1">
                          <Chip size="sm" color={statusColor[b.status]} variant="flat">
                            {t.userDashboard.bookingStatus[b.status]}
                          </Chip>
                          <Chip size="sm" color={b.paymentStatus === 'paid' ? 'success' : 'warning'} variant="flat">
                            {t.userDashboard.paymentStatus[b.paymentStatus]}
                          </Chip>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <Modal isOpen={!!confirmAction} onClose={() => setConfirmAction(null)} size="sm">
        <ModalContent>
          <ModalHeader>{lang === 'ar' ? 'تأكيد الإجراء' : 'Confirmer l\'action'}</ModalHeader>
          <ModalBody>
            <p className="text-gray-600 text-sm">
              {lang === 'ar' ? 'هل أنت متأكد من تنفيذ هذا الإجراء؟' : 'Êtes-vous sûr d\'effectuer cette action?'}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setConfirmAction(null)}>{t.common.cancel}</Button>
            <Button
              className="bg-gray-900 text-white"
              onPress={() => {
                if (confirmAction.type.includes('User')) handleUserAction(confirmAction.id, confirmAction.action);
                else handleAgencyAction(confirmAction.id, confirmAction.action);
              }}
            >
              {t.common.confirm}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
