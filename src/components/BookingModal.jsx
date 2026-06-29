import { useState } from 'react';
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Input, Select, SelectItem, Textarea, Divider, Chip
} from './ui';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export default function BookingModal({ pkg, isOpen, onClose }) {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const { addBooking } = useData();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [travelers, setTravelers] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('virement');
  const [notes, setNotes] = useState('');
  const [travelerDetails, setTravelerDetails] = useState([
    { name: user?.name || '', passport: '', dob: '', gender: 'male' }
  ]);
  const [submitted, setSubmitted] = useState(false);

  if (!pkg) return null;

  const name = lang === 'ar' ? pkg.name : pkg.nameFr;
  const totalPrice = pkg.price * travelers;

  const updateTraveler = (idx, field, value) => {
    setTravelerDetails(prev => prev.map((t, i) => i === idx ? { ...t, [field]: value } : t));
  };

  const handleTravelersChange = (count) => {
    const n = parseInt(count);
    setTravelers(n);
    setTravelerDetails(Array.from({ length: n }, (_, i) => ({
      name: i === 0 ? (user?.name || '') : '',
      passport: '',
      dob: '',
      gender: 'male',
    })));
  };

  const handleConfirm = () => {
    if (!user) { navigate('/login'); onClose(); return; }

    addBooking({
      userId: user.id,
      packageId: pkg.id,
      agencyId: pkg.agencyId,
      status: 'pending',
      travelers,
      totalPrice,
      paymentStatus: 'pending',
      paymentMethod,
      notes,
      travelerDetails,
    });
    setSubmitted(true);
  };

  const handleClose = () => {
    setStep(1);
    setSubmitted(false);
    setNotes('');
    onClose();
  };

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="md">
        <ModalContent>
          <ModalBody className="py-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-700 mb-2 font-arabic">
              {t.booking.success}
            </h3>
            <p className="text-gray-500 text-sm mb-6">{t.booking.pending}</p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-start">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 text-sm">{t.packages.title}</span>
                <span className="font-semibold text-sm">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">{t.booking.totalPrice}</span>
                <span className="font-bold text-green-700">{totalPrice.toLocaleString('fr-DZ')} {t.common.dz}</span>
              </div>
            </div>
            <Button
              className="bg-green-700 text-white w-full"
              onPress={() => { navigate('/dashboard/bookings'); handleClose(); }}
            >
              {t.nav.myBookings}
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900 font-arabic">{t.booking.title}</h3>
            <p className="text-sm text-gray-500 font-normal">{name}</p>
          </div>
        </ModalHeader>

        <ModalBody className="py-4">
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                  ${step >= s ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {s}
                </div>
                {s < 2 && <div className={`w-12 h-0.5 ${step > s ? 'bg-green-700' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              {/* Travelers */}
              <Select
                label={t.booking.travelers}
                selectedKeys={[String(travelers)]}
                onChange={e => handleTravelersChange(e.target.value)}
                variant="bordered"
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <SelectItem key={String(n)}>{n} {n === 1 ? t.common.person : t.common.person}</SelectItem>
                ))}
              </Select>

              {/* Traveler details */}
              {travelerDetails.map((traveler, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">
                    {lang === 'ar' ? `المسافر ${idx + 1}` : `Voyageur ${idx + 1}`}
                  </p>
                  <Input
                    label={t.booking.fullName}
                    value={traveler.name}
                    onChange={e => updateTraveler(idx, 'name', e.target.value)}
                    variant="bordered"
                    size="sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label={t.booking.passport}
                      value={traveler.passport}
                      onChange={e => updateTraveler(idx, 'passport', e.target.value)}
                      variant="bordered"
                      size="sm"
                    />
                    <Input
                      label={t.booking.dob}
                      type="date"
                      value={traveler.dob}
                      onChange={e => updateTraveler(idx, 'dob', e.target.value)}
                      variant="bordered"
                      size="sm"
                    />
                  </div>
                  <Select
                    label={t.booking.gender}
                    selectedKeys={[traveler.gender]}
                    onChange={e => updateTraveler(idx, 'gender', e.target.value)}
                    variant="bordered"
                    size="sm"
                  >
                    <SelectItem key="male">{t.booking.male}</SelectItem>
                    <SelectItem key="female">{t.booking.female}</SelectItem>
                  </Select>
                </div>
              ))}

              <Textarea
                label={t.booking.notes}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                variant="bordered"
                placeholder={lang === 'ar' ? 'أي ملاحظات أو طلبات خاصة...' : 'Notes ou demandes spéciales...'}
                rows={2}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
                <h4 className="font-semibold text-green-800 mb-3 font-arabic">{name}</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t.booking.travelers}</span>
                  <span>{travelers} {t.common.person}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{lang === 'ar' ? 'سعر الباقة' : 'Prix du package'}</span>
                  <span>{pkg.price.toLocaleString('fr-DZ')} {t.common.dz}</span>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between font-bold">
                  <span className="text-gray-800">{t.booking.totalPrice}</span>
                  <span className="text-green-700 text-lg">{totalPrice.toLocaleString('fr-DZ')} {t.common.dz}</span>
                </div>
              </div>

              {/* Payment */}
              <Select
                label={t.booking.paymentMethod}
                selectedKeys={[paymentMethod]}
                onChange={e => setPaymentMethod(e.target.value)}
                variant="bordered"
              >
                <SelectItem key="virement">{t.booking.virement}</SelectItem>
                <SelectItem key="carte">{t.booking.carte}</SelectItem>
                <SelectItem key="cash">{t.booking.cash}</SelectItem>
              </Select>

              {paymentMethod === 'virement' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
                  <p className="font-semibold text-blue-800 mb-2">
                    {lang === 'ar' ? 'معلومات التحويل البنكي' : 'Informations de virement'}
                  </p>
                  <p className="text-blue-600">
                    {lang === 'ar'
                      ? 'الرقم البنكي: 007 00123456789 DZ البنك: CPA الجزائر'
                      : 'RIB: 007 00123456789 DZ | Banque: CPA Algérie'}
                  </p>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                {lang === 'ar'
                  ? '⚠️ سيتم مراجعة حجزك من قبل الوكالة وتأكيده خلال 24-48 ساعة'
                  : '⚠️ Votre réservation sera examinée et confirmée par l\'agence dans 24-48h'}
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter className="border-t border-gray-100">
          {step === 1 ? (
            <>
              <Button variant="light" onPress={handleClose}>{t.common.cancel}</Button>
              <Button className="bg-green-700 text-white" onPress={() => setStep(2)}>
                {t.common.next} →
              </Button>
            </>
          ) : (
            <>
              <Button variant="light" onPress={() => setStep(1)}>← {t.common.previous}</Button>
              <Button className="bg-green-700 text-white" onPress={handleConfirm}>
                {t.booking.confirm}
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
