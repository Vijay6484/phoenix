export type RoomStatus = 'available' | 'occupied' | 'dirty' | 'maintenance' | 'arriving' | 'departing';

export type ReservationStatus = 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';

export type BookingSource = 'direct' | 'booking.com' | 'agoda' | 'airbnb' | 'expedia' | 'website' | 'phone';


// Data shape for a single channel in the Channel Manager
export interface Channel {
  id: string;
  name: string;
  logo?: string;
  status: 'synced' | 'syncing' | 'error';
  lastSync: string;
}

// Data shape for a single promotion
export interface Promotion {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  discount: { type:'percentage' | 'fixed' | 'stay-x-pay-y' , value: number }
  
  stayNights?: number;
  payNights?: number;
  
  minStayLength?: number;
  isActive: boolean;
}




export interface Room {
  id: string;
  roomNumber: string;
  roomType: string;
  status: RoomStatus;
  guestName?: string;
  reservationId?: string;
  checkIn?: string;
  checkOut?: string;
  floor: number;
}

export interface Reservation {
  id: string;
  confirmationNumber: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomType: string;
  roomNumber?: string;
  checkIn: string;
  checkOut: string;
  numberOfGuests: number;
  source: BookingSource;
  status: ReservationStatus;
  totalAmount: number;
  paidAmount: number;
  notes?: string;
  groupId?: string;
}

export interface GroupBlock {
  id: string;
  name: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  checkIn: string;
  checkOut: string;
  totalRooms: number;
  assignedRooms: number;
  reservationIds: string[];
  totalAmount: number;
  paidAmount: number;
  notes?: string;
}

export interface LogEntry {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  status: 'open' | 'resolved';
  priority?: 'low' | 'medium' | 'high';
}

export type ViewType = 'dashboard' | 'arrivals' | 'departures' | 'reservations' | 'groups' | 'logbook';

export type DistributionViewType = 'rate-manager' | 'inventory-manager' | 'channel-manager' | 'promotions';

export interface RatePrice {
  roomType: string;
  date: string;
  price: number;
}

export interface InventoryAvailability {
  roomType: string;
  date: string;
  available: number;
  total: number;
}

export type ChannelStatus = 'synced' | 'syncing' | 'error';

export interface Channel {
  id: string;
  name: string;
  logo?: string;
  status: ChannelStatus;
  lastSync: string;
}

export type GuestTag = 'VIP' | 'Corporate' | 'Honeymoon' | 'Family' | 'Solo';

export interface GuestProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalVisits: number;
  totalSpend: number;
  tags: GuestTag[];
  lastVisit: string;
  preferences?: string[];
  notes?: string;
}

export type ReviewSentiment = 'positive' | 'neutral' | 'negative';
export type ReviewSource = 'Google' | 'MakeMyTrip' | 'Booking.com' | 'Direct';

export interface Review {
  id: string;
  source: ReviewSource;
  guestName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  sentiment: ReviewSentiment;
  replied: boolean;
}

export type CampaignStatus = 'Draft' | 'Sent' | 'Scheduled';

export interface EmailCampaign {
  id: string;
  name: string;
  // subject: string;
  // audience: string;
  status: CampaignStatus;
  sentDate?: string;
   recipients:number;
  openRate?: number;
}

export type GuestManagementViewType = 'profiles' | 'reputation' | 'communication';

export type BillingFinanceViewType = 'folios' ;

export interface FolioItem {
    id: string;
    date: string;
    description: string;
    amount: number;
    department: 'Room' | 'F&B' | 'Spa' | 'Laundry' | 'Other';
}

export interface Payment {
    id: string;
    date: string;
    method: 'Cash' | 'Credit Card' | 'UPI' | 'Bank Transfer';
    amount: number;
    transactionId?: string;
}

export interface GuestFolio {
    folioId: string;
    reservationId: string;
    guestName: string;
    roomNumber: string;
    checkIn: string;
    checkOut: string;
    totalCharges: number;
    totalPayments: number;
    balance: number;
    items: FolioItem[];
    payments: Payment[];
}

export interface CorporateAccount {
    id: string;
    companyName: string;
    contactPerson: string;
    outstandingBalance: number;
    creditLimit: number;
    lastPaymentDate?: string;
}

export interface Invoice {
    invoiceId: string;
    folioId: string;
    guestName: string;
    amount: number;
    issueDate: string;
    dueDate: string;
    status: 'Paid' | 'Unpaid' | 'Overdue';
}

export interface PropertyRoomType {
    id: number;
    name: string;
    propertyType: 'Hotel Room' | 'Villa' | 'Suite' | 'Cottage';
    description: string;
    totalInventory: number;
    basePrice: number;
    adultPrice: number;
    childPrice: number;
    amenities: string[];
    maxAdults: number;
    maxChildren: number;
    images: string[];
    starRating: number;
    currency: 'INR';
}
