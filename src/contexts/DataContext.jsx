import { createContext, useContext, useState, useCallback } from 'react';
import initialData from '../data/db.json';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [db, setDb] = useState(initialData);

  const getPackages = useCallback((filters = {}) => {
    let packages = db.packages;
    if (filters.agencyId) packages = packages.filter(p => p.agencyId === filters.agencyId);
    if (filters.category) packages = packages.filter(p => p.category === filters.category);
    if (filters.active !== undefined) packages = packages.filter(p => p.active === filters.active);
    if (filters.featured) packages = packages.filter(p => p.featured);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      packages = packages.filter(p =>
        p.name.includes(filters.search) ||
        p.nameFr.toLowerCase().includes(q) ||
        p.departure.includes(filters.search) ||
        p.departureFr.toLowerCase().includes(q)
      );
    }
    return packages;
  }, [db.packages]);

  const getPackageById = useCallback((id) => db.packages.find(p => p.id === id), [db.packages]);
  const getAgencyById = useCallback((id) => db.agencies.find(a => a.id === id), [db.agencies]);
  const getUserById = useCallback((id) => db.users.find(u => u.id === id), [db.users]);

  const getBookingsByUser = useCallback((userId) =>
    db.bookings.filter(b => b.userId === userId), [db.bookings]);

  const getBookingsByAgency = useCallback((agencyId) =>
    db.bookings.filter(b => b.agencyId === agencyId), [db.bookings]);

  const getReviewsByAgency = useCallback((agencyId) =>
    db.reviews.filter(r => r.agencyId === agencyId && r.approved), [db.reviews]);

  const addBooking = useCallback((booking) => {
    const newBooking = { ...booking, id: `b${Date.now()}`, bookingDate: new Date().toISOString().split('T')[0] };
    setDb(prev => ({
      ...prev,
      bookings: [...prev.bookings, newBooking],
      packages: prev.packages.map(p =>
        p.id === booking.packageId
          ? { ...p, availableSeats: p.availableSeats - booking.travelers }
          : p
      ),
    }));
    return newBooking;
  }, []);

  const updateBooking = useCallback((id, updates) => {
    setDb(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => b.id === id ? { ...b, ...updates } : b),
    }));
  }, []);

  const addPackage = useCallback((pkg) => {
    const newPkg = { ...pkg, id: `p${Date.now()}`, rating: 0, reviewCount: 0, active: true };
    setDb(prev => ({ ...prev, packages: [...prev.packages, newPkg] }));
    return newPkg;
  }, []);

  const updatePackage = useCallback((id, updates) => {
    setDb(prev => ({
      ...prev,
      packages: prev.packages.map(p => p.id === id ? { ...p, ...updates } : p),
    }));
  }, []);

  const deletePackage = useCallback((id) => {
    setDb(prev => ({ ...prev, packages: prev.packages.filter(p => p.id !== id) }));
  }, []);

  const updateUser = useCallback((id, updates) => {
    setDb(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, ...updates } : u),
    }));
  }, []);

  const updateAgency = useCallback((id, updates) => {
    setDb(prev => ({
      ...prev,
      agencies: prev.agencies.map(a => a.id === id ? { ...a, ...updates } : a),
    }));
  }, []);

  const addReview = useCallback((review) => {
    const newReview = { ...review, id: `r${Date.now()}`, date: new Date().toISOString().split('T')[0], approved: true };
    setDb(prev => ({ ...prev, reviews: [...prev.reviews, newReview] }));
  }, []);

  return (
    <DataContext.Provider value={{
      db,
      getPackages,
      getPackageById,
      getAgencyById,
      getUserById,
      getBookingsByUser,
      getBookingsByAgency,
      getReviewsByAgency,
      addBooking,
      updateBooking,
      addPackage,
      updatePackage,
      deletePackage,
      updateUser,
      updateAgency,
      addReview,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
