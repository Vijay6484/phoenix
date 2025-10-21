import { Room, Reservation, GroupBlock, LogEntry, RatePrice, InventoryAvailability, Channel, Promotion } from '../types';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const mockRooms: Room[] = [
  { id: '1', roomNumber: '101', roomType: 'Deluxe', status: 'occupied', guestName: 'Rajesh Kumar', reservationId: '1', checkIn: formatDate(yesterday), checkOut: formatDate(tomorrow), floor: 1 },
  { id: '2', roomNumber: '102', roomType: 'Deluxe', status: 'departing', guestName: 'Priya Sharma', reservationId: '2', checkIn: formatDate(yesterday), checkOut: formatDate(today), floor: 1 },
  { id: '3', roomNumber: '103', roomType: 'Standard', status: 'dirty', floor: 1 },
  { id: '4', roomNumber: '104', roomType: 'Standard', status: 'available', floor: 1 },
  { id: '5', roomNumber: '105', roomType: 'Suite', status: 'arriving', guestName: 'Amit Patel', reservationId: '3', checkIn: formatDate(today), checkOut: formatDate(nextWeek), floor: 1 },
  { id: '6', roomNumber: '201', roomType: 'Deluxe', status: 'maintenance', floor: 2 },
  { id: '7', roomNumber: '202', roomType: 'Deluxe', status: 'occupied', guestName: 'Sneha Reddy', reservationId: '4', checkIn: formatDate(yesterday), checkOut: formatDate(tomorrow), floor: 2 },
  { id: '8', roomNumber: '203', roomType: 'Standard', status: 'available', floor: 2 },
  { id: '9', roomNumber: '204', roomType: 'Standard', status: 'arriving', guestName: 'Vikram Singh', reservationId: '5', checkIn: formatDate(today), checkOut: formatDate(tomorrow), floor: 2 },
  { id: '10', roomNumber: '205', roomType: 'Suite', status: 'occupied', guestName: 'Anjali Verma', reservationId: '6', checkIn: formatDate(yesterday), checkOut: formatDate(nextWeek), floor: 2 },
  { id: '11', roomNumber: '301', roomType: 'Deluxe', status: 'available', floor: 3 },
  { id: '12', roomNumber: '302', roomType: 'Deluxe', status: 'dirty', floor: 3 },
];

export const mockReservations: Reservation[] = [
  { id: '1', confirmationNumber: 'RES001', guestName: 'Rajesh Kumar', guestEmail: 'rajesh@email.com', guestPhone: '+91 98765 43210', roomType: 'Deluxe', roomNumber: '101', checkIn: formatDate(yesterday), checkOut: formatDate(tomorrow), numberOfGuests: 2, source: 'booking.com', status: 'checked-in', totalAmount: 5000, paidAmount: 2500 },
  { id: '2', confirmationNumber: 'RES002', guestName: 'Priya Sharma', guestEmail: 'priya@email.com', guestPhone: '+91 98765 43211', roomType: 'Deluxe', roomNumber: '102', checkIn: formatDate(yesterday), checkOut: formatDate(today), numberOfGuests: 1, source: 'direct', status: 'checked-in', totalAmount: 3000, paidAmount: 3000 },
  { id: '3', confirmationNumber: 'RES003', guestName: 'Amit Patel', guestEmail: 'amit@email.com', guestPhone: '+91 98765 43212', roomType: 'Suite', checkIn: formatDate(today), checkOut: formatDate(nextWeek), numberOfGuests: 3, source: 'website', status: 'confirmed', totalAmount: 15000, paidAmount: 5000 },
  { id: '4', confirmationNumber: 'RES004', guestName: 'Sneha Reddy', guestEmail: 'sneha@email.com', guestPhone: '+91 98765 43213', roomType: 'Deluxe', roomNumber: '202', checkIn: formatDate(yesterday), checkOut: formatDate(tomorrow), numberOfGuests: 2, source: 'agoda', status: 'checked-in', totalAmount: 4500, paidAmount: 4500 },
  { id: '5', confirmationNumber: 'RES005', guestName: 'Vikram Singh', guestEmail: 'vikram@email.com', guestPhone: '+91 98765 43214', roomType: 'Standard', checkIn: formatDate(today), checkOut: formatDate(tomorrow), numberOfGuests: 2, source: 'booking.com', status: 'confirmed', totalAmount: 2500, paidAmount: 0 },
  { id: '6', confirmationNumber: 'RES006', guestName: 'Anjali Verma', guestEmail: 'anjali@email.com', guestPhone: '+91 98765 43215', roomType: 'Suite', roomNumber: '205', checkIn: formatDate(yesterday), checkOut: formatDate(nextWeek), numberOfGuests: 2, source: 'website', status: 'checked-in', totalAmount: 12000, paidAmount: 12000 },
  { id: '7', confirmationNumber: 'RES007', guestName: 'Kiran Desai', guestEmail: 'kiran@email.com', guestPhone: '+91 98765 43216', roomType: 'Standard', checkIn: formatDate(today), checkOut: formatDate(tomorrow), numberOfGuests: 1, source: 'phone', status: 'confirmed', totalAmount: 2000, paidAmount: 0 },
];

export const mockGroups: GroupBlock[] = [
  { id: '1', name: 'Infosys Corporate Event', contactPerson: 'Ramesh Gupta', contactEmail: 'ramesh@infosys.com', contactPhone: '+91 98765 11111', checkIn: formatDate(today), checkOut: formatDate(nextWeek), totalRooms: 20, assignedRooms: 15, reservationIds: ['1', '2'], totalAmount: 80000, paidAmount: 40000, notes: 'Conference hall booking required' },
  { id: '2', name: 'Sharma Wedding', contactPerson: 'Sunita Sharma', contactEmail: 'sunita@email.com', contactPhone: '+91 98765 22222', checkIn: formatDate(tomorrow), checkOut: formatDate(nextWeek), totalRooms: 30, assignedRooms: 25, reservationIds: ['3', '4'], totalAmount: 150000, paidAmount: 50000, notes: 'Banquet hall + catering' },
];

export const mockLogs: LogEntry[] = [
  { id: '1', message: 'Room 201 AC not working. Maintenance team notified.', author: 'Ravi Kumar', timestamp: new Date().toISOString(), status: 'open', priority: 'high' },
  { id: '2', message: 'Guest in 102 requested early checkout tomorrow at 8 AM', author: 'Priya Singh', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'open', priority: 'medium' },
  { id: '3', message: 'Infosys group arrival confirmed for 3 PM today', author: 'Amit Sharma', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'resolved', priority: 'medium' },
  { id: '4', message: 'Stock update: Toiletries low, order placed', author: 'Neha Patel', timestamp: new Date(Date.now() - 10800000).toISOString(), status: 'resolved', priority: 'low' },
];

const roomTypes = ['Deluxe', 'Standard', 'Suite'];

const generateRatesForMonth = (): RatePrice[] => {
  const rates: RatePrice[] = [];
  const baseRates = { Deluxe: 5000, Standard: 3000, Suite: 8000 };

  for (let day = 0; day < 31; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    const dateStr = formatDate(date);

    roomTypes.forEach(roomType => {
      rates.push({
        roomType,
        date: dateStr,
        price: baseRates[roomType as keyof typeof baseRates]
      });
    });
  }

  return rates;
};

const generateInventoryForMonth = (): InventoryAvailability[] => {
  const inventory: InventoryAvailability[] = [];
  const totalRooms = { Deluxe: 4, Standard: 4, Suite: 2 };

  for (let day = 0; day < 31; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    const dateStr = formatDate(date);

    roomTypes.forEach(roomType => {
      const total = totalRooms[roomType as keyof typeof totalRooms];
      const available = Math.max(0, total - Math.floor(Math.random() * 3));

      inventory.push({
        roomType,
        date: dateStr,
        available,
        total
      });
    });
  }

  return inventory;
};

export const mockRates = generateRatesForMonth();
export const mockInventory = generateInventoryForMonth();

export const mockChannels: Channel[] = [
  { id: '1', name: 'Booking.com', status: 'synced', lastSync: new Date().toISOString() },
  { id: '2', name: 'MakeMyTrip', status: 'synced', lastSync: new Date(Date.now() - 300000).toISOString() },
  { id: '3', name: 'Agoda', status: 'syncing', lastSync: new Date(Date.now() - 600000).toISOString() },
  { id: '4', name: 'Goibibo', status: 'synced', lastSync: new Date(Date.now() - 180000).toISOString() },
  { id: '5', name: 'Expedia', status: 'error', lastSync: new Date(Date.now() - 7200000).toISOString() },
  { id: '6', name: 'Airbnb', status: 'synced', lastSync: new Date(Date.now() - 120000).toISOString() },
];

export const mockPromotions: Promotion[] = [
  {
    id: '1',
    name: 'Diwali Special',
    startDate: formatDate(today),
    endDate: formatDate(new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000)),
    discountType: 'percentage',
    discountValue: 20,
    roomTypes: ['Deluxe', 'Suite'],
    minStayLength: 2,
    isActive: true
  },
  {
    id: '2',
    name: 'Weekend Getaway',
    startDate: formatDate(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)),
    endDate: formatDate(new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000)),
    discountType: 'fixed',
    discountValue: 1000,
    roomTypes: ['Standard', 'Deluxe'],
    minStayLength: 1,
    isActive: true
  },
  {
    id: '3',
    name: 'Stay 3 Pay 2',
    startDate: formatDate(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)),
    endDate: formatDate(new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000)),
    discountType: 'stay-x-pay-y',
    discountValue: 0,
    stayNights: 3,
    payNights: 2,
    roomTypes: ['Deluxe', 'Standard', 'Suite'],
    minStayLength: 3,
    isActive: false
  }
];
