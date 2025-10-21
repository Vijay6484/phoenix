import { useState, useEffect, FormEvent } from 'react';
import { Search, UserCheck, Users, Building, X, CalendarDays } from 'lucide-react';
import { Reservation, Room, RoomStatus } from '../../types'; // Ensure RoomStatus is imported
import { dataStore } from '../../store/dataStore';

// Define the type for the active tab
type ArrivalTab = 'today' | 'tomorrow' | 'week';

// --- Mock Data for Different Tabs ---
// NOTE: In a real app, you'd fetch this dynamically based on date ranges
const mockArrivalsToday: Reservation[] = dataStore.getArrivals(new Date().toISOString().split('T')[0]);
const mockArrivalsTomorrow: Reservation[] = [
    { id: 'res_tmrw1', confirmationNumber: 'CONF-TMRW01', guestName: 'Vikas Singh', guestEmail: 'vikas.s@example.com', guestPhone: '+91 91111 22222', roomType: 'Standard Twin', checkIn: '2025-10-22', checkOut: '2025-10-24', numberOfGuests: 2, source: 'agoda', status: 'confirmed', totalAmount: 12000, paidAmount: 12000 },
    { id: 'res_tmrw2', confirmationNumber: 'CONF-TMRW02', guestName: 'Meera Desai', guestEmail: 'meera.d@example.com', guestPhone: '+91 93333 44444', roomType: 'Deluxe King', checkIn: '2025-10-22', checkOut: '2025-10-25', numberOfGuests: 1, source: 'website', status: 'confirmed', totalAmount: 24000, paidAmount: 5000 },
];
const mockArrivalsWeek: Reservation[] = [
    ...mockArrivalsToday,
    ...mockArrivalsTomorrow,
    { id: 'res_week1', confirmationNumber: 'CONF-WEEK01', guestName: 'Arjun Reddy', guestEmail: 'arjun.r@example.com', guestPhone: '+91 95555 66666', roomType: 'Ocean View Suite', checkIn: '2025-10-24', checkOut: '2025-10-27', numberOfGuests: 2, source: 'agoda', status: 'confirmed', totalAmount: 45000, paidAmount: 45000 },
    { id: 'res_week2', confirmationNumber: 'CONF-WEEK02', guestName: 'Sunita Nair', guestEmail: 'sunita.n@example.com', guestPhone: '+91 97777 88888', roomType: 'Deluxe King', checkIn: '2025-10-26', checkOut: '2025-10-28', numberOfGuests: 2, source: 'website', status: 'confirmed', totalAmount: 16000, paidAmount: 0 },
];

// --- CheckIn Modal Component ---
const CheckInModal = ({ reservation, isOpen, onClose, onConfirm }: { reservation: Reservation, isOpen: boolean, onClose: () => void, onConfirm: (resId: string, roomNumber: string, updatedDetails: Partial<Reservation>) => void }) => {
    // Use static list of rooms as requested
    const dummyAvailableRooms: Room[] = [
        { id: 'r101', roomNumber: '101', roomType: reservation.roomType.toString(), status: available, floor: 1},
        { id: 'r105', roomNumber: '105', roomType: reservation.roomType.toString(), status: dirty, floor: 1 }, // Needs Cleaning
        { id: 'r106', roomNumber: '106', roomType: reservation.roomType.toString(), status: available, floor: 1 },
        { id: 'r104', roomNumber: '104', roomType: reservation.roomType.toString(), status: available, floor: 1 },
        { id: 'r108', roomNumber: '108', roomType: reservation.roomType.toString(), status: dirty, floor: 1 }, // Needs Cleaning
        { id: 'r203', roomNumber: '203', roomType: reservation.roomType.toString(), status: 'available', floor: 2 },
        { id: 'r205', roomNumber: '205', roomType: reservation.roomType.toString(), status: 'available', floor: 2 },
         // Add occupied/maintenance rooms to show disabled state (assuming Deluxe King for demo)
        { id: 'r102', roomNumber: '102', roomType: 'Deluxe King', status: 'occupied', floor: 1 },
        { id: 'r103', roomNumber: '103', roomType: 'Deluxe King', status: 'maintenance', floor: 1 },
    ].filter(room => room.roomType === reservation.roomType); // Filter just in case type differs

    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [formData, setFormData] = useState(reservation);

    useEffect(() => {
        if (isOpen) {
            setFormData(reservation); // Pre-fill form
            setSelectedRoom(null); // Reset selection
        }
    }, [isOpen, reservation]);

    const handleConfirm = () => {
        if (selectedRoom) {
            const updatedDetails: Partial<Reservation> = {
                guestName: formData.guestName,
                guestEmail: formData.guestEmail,
                guestPhone: formData.guestPhone,
            };
            onConfirm(reservation.id, selectedRoom, updatedDetails);
        } else {
            alert('Please select a room to assign.');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
            <div 
                className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Confirm Check-In</h2>
                        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={24}/></button>
                    </div>

                    <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-700">Guest Details</h3>
                         {/* Guest Detail Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" id="guestName" name="guestName" value={formData.guestName} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
                            </div>
                             <div>
                                <label htmlFor="guestPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input type="tel" id="guestPhone" name="guestPhone" value={formData.guestPhone} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" id="guestEmail" name="guestEmail" value={formData.guestEmail} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
                        </div>
                        <div>
                            <label htmlFor="adhaarNumber" className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number / ID</label>
                            <input type="text" id="adhaarNumber" name="adhaarNumber" className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t mt-6">
                            <div className="bg-gray-50 p-3 rounded-xl border">
                                <label className="text-xs text-gray-500">Room Type</label>
                                <p className="font-semibold text-gray-800">{reservation.roomType}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border">
                                <label className="text-xs text-gray-500">Guests</label>
                                <p className="font-semibold text-gray-800">{reservation.numberOfGuests}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Assign Room</label>
                            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
                                {dummyAvailableRooms.length > 0 ? dummyAvailableRooms.map(room => {
                                    const isSelected = selectedRoom === room.roomNumber;
                                    const isAvailable = room.status === 'available';
                                    const isDirty = room.status === 'dirty';
                                    const isDisabled = !isAvailable && !isDirty; // Occupied or Maintenance

                                    return (
                                        <button 
                                            key={room.id} 
                                            type="button"
                                            onClick={() => !isDisabled ? setSelectedRoom(room.roomNumber) : null}
                                            disabled={isDisabled}
                                            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors
                                                ${isSelected ? 'bg-blue-600 text-white ring-2 ring-offset-1 ring-blue-600' : ''}
                                                ${isAvailable && !isSelected ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : ''}
                                                ${isDirty && !isSelected ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' : ''}
                                                ${isDisabled ? 'bg-red-100 text-red-500 line-through cursor-not-allowed opacity-60' : ''}
                                            `}
                                        >
                                            {room.roomNumber}
                                        </button>
                                    );
                                }) : <p className="text-sm text-gray-500">No rooms of this type found (Check mock data).</p>}
                            </div>
                             <div className="flex text-xs text-gray-500 mt-2 gap-4">
                                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-gray-200 border"></div>Clean</span>
                                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-orange-100 border"></div>Needs Cleaning</span>
                                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-100 border"></div>Occupied/Maintenance</span>
                             </div>
                        </div>
                    </div>
                    
                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300">Cancel</button>
                        <button type="button" onClick={handleConfirm} className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700">Confirm Check-In</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Arrivals Component ---
export default function Arrivals() {
  const [activeTab, setActiveTab] = useState<ArrivalTab>('today');
  const [arrivalsList, setArrivalsList] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    // Load the correct mock data based on the active tab
    switch(activeTab) {
        case 'today':
            setArrivalsList(mockArrivalsToday);
            break;
        case 'tomorrow':
            setArrivalsList(mockArrivalsTomorrow);
            break;
        case 'week':
            setArrivalsList(mockArrivalsWeek);
            break;
        default:
            setArrivalsList(mockArrivalsToday);
    }
  }, [activeTab]); // Rerun when the active tab changes

  const filteredArrivals = arrivalsList.filter(
    (arrival) =>
      arrival.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      arrival.confirmationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCheckInModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowCheckInModal(true);
  };

  const confirmCheckIn = (reservationId: string, roomNumber: string, updatedDetails: Partial<Reservation>) => {
    const reservationToCheckIn = arrivalsList.find(res => res.id === reservationId);
    if (reservationToCheckIn) {
      dataStore.updateReservation(reservationId, { 
          ...updatedDetails,
          status: 'checked-in', 
          roomNumber: roomNumber 
      });

      const roomToUpdate = dataStore.getRooms().find(room => room.roomNumber === roomNumber);
      if (roomToUpdate) {
        dataStore.updateRoom(roomToUpdate.id, {
          status: 'occupied',
          guestName: updatedDetails.guestName || reservationToCheckIn.guestName,
          reservationId: reservationToCheckIn.id,
          checkIn: reservationToCheckIn.checkIn,
          checkOut: reservationToCheckIn.checkOut,
        });
      }

      // Refresh the list based on the current tab
       switch(activeTab) {
            case 'today': setArrivalsList(mockArrivalsToday.filter(a => a.id !== reservationId)); break; // Assume check-in removes from "Today" list
            case 'tomorrow': setArrivalsList(mockArrivalsTomorrow); break; // No change needed for tomorrow/week yet
            case 'week': setArrivalsList(mockArrivalsWeek); break;
        }
      
      setShowCheckInModal(false);
      setSelectedReservation(null);
    }
  };

  const tabs: {id: ArrivalTab, name: string}[] = [
      {id: 'today', name: 'Today'},
      {id: 'tomorrow', name: 'Tomorrow'},
      {id: 'week', name: 'This Week'},
  ]

  return (
    <>
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-50 p-4 sm:p-6">
        <header className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#1A202C' }}>Arrivals</h1>
            <p className="text-base text-gray-500 mt-1">Manage guest check-ins for upcoming dates.</p>
        </header>

        {/* --- Tab Navigation --- */}
        <div className="mb-6">
             <div className="bg-white p-1.5 rounded-xl shadow-md border inline-block">
                <div className="flex space-x-1">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id} 
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors
                            ${activeTab === tab.id ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}
                            `}
                        >
                            <CalendarDays size={16}/>
                            {tab.name}
                        </button>
                    ))}
                </div>
             </div>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by guest name or confirmation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-white px-4 py-3 rounded-xl border border-gray-200">
            <span className="text-gray-900 font-semibold">{filteredArrivals.length} Arrivals</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guest Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guests</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredArrivals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                      <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No arrivals found for this period.</p>
                    </td>
                  </tr>
                ) : (
                  filteredArrivals.map((arrival) => (
                    <tr key={arrival.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{arrival.guestName}</div>
                        <div className="text-sm text-gray-500">{arrival.confirmationNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                          <div className="text-gray-900">{arrival.roomType}</div>
                      </td>
                      <td className="px-6 py-4">
                          <div className="text-gray-900">{arrival.numberOfGuests}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 capitalize">{arrival.source}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleOpenCheckInModal(arrival)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                          // Disable check-in if it's not for today's tab
                          disabled={activeTab !== 'today'} 
                        >
                          <UserCheck className="w-4 h-4" />
                          Check In
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectedReservation && (
          <CheckInModal 
            isOpen={showCheckInModal} 
            onClose={() => setShowCheckInModal(false)}
            reservation={selectedReservation}
            onConfirm={confirmCheckIn}
          />
      )}
    </>
  );
}

