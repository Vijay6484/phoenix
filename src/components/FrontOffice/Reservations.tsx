import { useState, useEffect, FormEvent } from 'react';
import { Search, Filter, Plus, Calendar, Users, Building, X, Phone, Mail, Hash, UserCheck } from 'lucide-react';
import { Reservation, ReservationStatus } from '../../types';
import { dataStore } from '../../store/dataStore';

const statusColors: Record<ReservationStatus, string> = {
  confirmed: 'bg-blue-100 text-blue-700',
  'checked-in': 'bg-green-100 text-green-700',
  'checked-out': 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
  'no-show': 'bg-orange-100 text-orange-700',
};

// --- New Reservation Modal Component ---
const NewReservationModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (newRes: Reservation) => void }) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newReservation: Reservation = {
            id: `res_${Date.now()}`,
            confirmationNumber: `CONF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            guestName: formData.get('guestName') as string,
            guestEmail: formData.get('guestEmail') as string,
            guestPhone: formData.get('guestNumber') as string,
            checkIn: formData.get('checkInDate') as string,
            checkOut: formData.get('checkOutDate') as string,
            roomType: formData.get('roomType') as string,
            roomNumber: formData.get('roomNumber') as string || undefined,
            numberOfGuests: 2, // Default value
            source: 'direct', // Default value
            status: formData.get('status') as ReservationStatus,
            totalAmount: 15000, // Default value
            paidAmount: 0, // Default value
            // Aadhaar number is PII and should be handled securely, not stored directly on the main object in a real app
        };
        onSave(newReservation);
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
            <div 
                className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={e => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">New Reservation</h2>
                        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={24}/></button>
                    </div>

                    <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-700">Guest Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" id="guestName" name="guestName" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                             <div>
                                <label htmlFor="guestNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input type="tel" id="guestNumber" name="guestNumber" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" id="guestEmail" name="guestEmail" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="adhaarNumber" className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                            <input type="text" id="adhaarNumber" name="adhaarNumber" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-700 pt-4 border-t mt-6">Booking Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                                <input type="date" id="checkInDate" name="checkInDate" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                            <div>
                                <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                                <input type="date" id="checkOutDate" name="checkOutDate" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                             <div>
                                <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                                <select id="roomType" name="roomType" required className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                                    <option>Deluxe King</option>
                                    <option>Standard Twin</option>
                                    <option>Ocean View Suite</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">Room Number (Optional)</label>
                                <input type="text" id="roomNumber" name="roomNumber" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select id="status" name="status" required className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                                <option value="confirmed">Confirmed</option>
                                <option value="checked-in">Checked-in</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700">Save Reservation</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Reservations Component ---
export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setReservations(dataStore.getReservations());
  }, []);

  const handleSave = (newRes: Reservation) => {
    setReservations(prev => [newRes, ...prev]);
    setIsModalOpen(false);
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      res.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.confirmationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.guestEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="flex-1 overflow-auto bg-white">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
              <p className="text-gray-600 mt-1">Manage all bookings</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Reservation
            </button>
          </div>

          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by guest name, email, or confirmation number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
              <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                <span className="text-gray-900 font-semibold">{filteredReservations.length} Reservations</span>
              </div>
            </div>

            {showFilters && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as ReservationStatus | 'all')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="checked-in">Checked In</option>
                      <option value="checked-out">Checked Out</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Confirmation</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Guest</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Guests</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No reservations found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((reservation) => (
                      <tr key={reservation.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm text-gray-900">{reservation.confirmationNumber}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{reservation.guestName}</div>
                            <div className="text-sm text-gray-500">{reservation.guestEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-gray-900">{reservation.roomType}</div>
                              {reservation.roomNumber && (
                                <div className="text-sm text-gray-500">Room {reservation.roomNumber}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div className="text-sm">
                              <div className="text-gray-900">{new Date(reservation.checkIn).toLocaleDateString()}</div>
                              <div className="text-gray-500">to {new Date(reservation.checkOut).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{reservation.numberOfGuests}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 capitalize">{reservation.source}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[reservation.status]}`}>
                            {reservation.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900 font-medium">₹{reservation.totalAmount.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">Paid: ₹{reservation.paidAmount.toLocaleString()}</div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <NewReservationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
    </>
  );
}
