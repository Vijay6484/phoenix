import { useState, useEffect } from 'react';
import { Search, LogOut, DollarSign, Building } from 'lucide-react';
import { Reservation } from '../../types';
import { dataStore } from '../../store/dataStore';

export default function Departures() {
  const [departures, setDepartures] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDepartures(dataStore.getDepartures(today));
  }, []);

  const filteredDepartures = departures.filter(
    (departure) =>
      departure.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      departure.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckout = (reservation: Reservation) => {
    const balance = reservation.totalAmount - reservation.paidAmount;
    if (balance > 0) {
      alert(`Payment pending: ₹${balance}. Please collect payment before checkout.`);
      return;
    }

    dataStore.updateReservation(reservation.id, { status: 'checked-out' });

    if (reservation.roomNumber) {
      const room = dataStore.getRooms().find((r) => r.roomNumber === reservation.roomNumber);
      if (room) {
        dataStore.updateRoom(room.id, {
          status: 'dirty',
          guestName: undefined,
          reservationId: undefined,
          checkIn: undefined,
          checkOut: undefined,
        });
      }
    }

    const today = new Date().toISOString().split('T')[0];
    setDepartures(dataStore.getDepartures(today));
  };

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Departures Today</h1>
          <p className="text-gray-600 mt-1">Guests expected to check out today</p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by guest name or room number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
            <span className="text-orange-900 font-semibold">{filteredDepartures.length} Departures</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Guest Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDepartures.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <LogOut className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No departures found</p>
                  </td>
                </tr>
              ) : (
                filteredDepartures.map((departure) => {
                  const balance = departure.totalAmount - departure.paidAmount;
                  const isFullyPaid = balance === 0;

                  return (
                    <tr key={departure.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{departure.guestName}</div>
                          <div className="text-sm text-gray-500">{departure.guestEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{departure.roomNumber || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">₹{departure.totalAmount.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">₹{departure.paidAmount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ₹{balance.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleCheckout(departure)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                            isFullyPaid
                              ? 'bg-orange-600 text-white hover:bg-orange-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!isFullyPaid}
                        >
                          <LogOut className="w-4 h-4" />
                          {isFullyPaid ? 'Check Out' : 'Pending Payment'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
