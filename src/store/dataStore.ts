import { Room, Reservation, GroupBlock, LogEntry, RatePrice, InventoryAvailability, Channel, Promotion } from '../types';
import { mockRooms, mockReservations, mockGroups, mockLogs, mockRates, mockInventory, mockChannels, mockPromotions } from './mockData';

class DataStore {
  private rooms: Room[] = [...mockRooms];
  private reservations: Reservation[] = [...mockReservations];
  private groups: GroupBlock[] = [...mockGroups];
  private logs: LogEntry[] = [...mockLogs];
  private rates: RatePrice[] = [...mockRates];
  private inventory: InventoryAvailability[] = [...mockInventory];
  private channels: Channel[] = [...mockChannels];
  private promotions: Promotion[] = [...mockPromotions];

  getRooms(): Room[] {
    return [...this.rooms];
  }

  getRoom(id: string): Room | undefined {
    return this.rooms.find(room => room.id === id);
  }

  updateRoom(id: string, updates: Partial<Room>): void {
    const index = this.rooms.findIndex(room => room.id === id);
    if (index !== -1) {
      this.rooms[index] = { ...this.rooms[index], ...updates };
    }
  }

  getReservations(): Reservation[] {
    return [...this.reservations];
  }

  getReservation(id: string): Reservation | undefined {
    return this.reservations.find(res => res.id === id);
  }

  createReservation(reservation: Reservation): void {
    this.reservations.push(reservation);
  }

  updateReservation(id: string, updates: Partial<Reservation>): void {
    const index = this.reservations.findIndex(res => res.id === id);
    if (index !== -1) {
      this.reservations[index] = { ...this.reservations[index], ...updates };
    }
  }

  getArrivals(date: string): Reservation[] {
    return this.reservations.filter(res => res.checkIn === date && res.status === 'confirmed');
  }

  getDepartures(date: string): Reservation[] {
    return this.reservations.filter(res => res.checkOut === date && res.status === 'checked-in');
  }

  getGroups(): GroupBlock[] {
    return [...this.groups];
  }

  getGroup(id: string): GroupBlock | undefined {
    return this.groups.find(group => group.id === id);
  }

  createGroup(group: GroupBlock): void {
    this.groups.push(group);
  }

  updateGroup(id: string, updates: Partial<GroupBlock>): void {
    const index = this.groups.findIndex(group => group.id === id);
    if (index !== -1) {
      this.groups[index] = { ...this.groups[index], ...updates };
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  createLog(log: LogEntry): void {
    this.logs.push(log);
  }

  updateLog(id: string, updates: Partial<LogEntry>): void {
    const index = this.logs.findIndex(log => log.id === id);
    if (index !== -1) {
      this.logs[index] = { ...this.logs[index], ...updates };
    }
  }

  getRates(roomType?: string, startDate?: string, endDate?: string): RatePrice[] {
    let filtered = [...this.rates];
    if (roomType) {
      filtered = filtered.filter(r => r.roomType === roomType);
    }
    if (startDate && endDate) {
      filtered = filtered.filter(r => r.date >= startDate && r.date <= endDate);
    }
    return filtered;
  }

  updateRate(roomType: string, date: string, price: number): void {
    const index = this.rates.findIndex(r => r.roomType === roomType && r.date === date);
    if (index !== -1) {
      this.rates[index].price = price;
    } else {
      this.rates.push({ roomType, date, price });
    }
  }

  bulkUpdateRates(updates: Array<{ roomType: string; date: string; price: number }>): void {
    updates.forEach(update => {
      this.updateRate(update.roomType, update.date, update.price);
    });
  }

  getInventory(roomType?: string, startDate?: string, endDate?: string): InventoryAvailability[] {
    let filtered = [...this.inventory];
    if (roomType) {
      filtered = filtered.filter(i => i.roomType === roomType);
    }
    if (startDate && endDate) {
      filtered = filtered.filter(i => i.date >= startDate && i.date <= endDate);
    }
    return filtered;
  }

  updateInventory(roomType: string, date: string, available: number): void {
    const index = this.inventory.findIndex(i => i.roomType === roomType && i.date === date);
    if (index !== -1) {
      this.inventory[index].available = available;
    }
  }

  getChannels(): Channel[] {
    return [...this.channels];
  }

  updateChannel(id: string, updates: Partial<Channel>): void {
    const index = this.channels.findIndex(c => c.id === id);
    if (index !== -1) {
      this.channels[index] = { ...this.channels[index], ...updates };
    }
  }

  getPromotions(): Promotion[] {
    return [...this.promotions];
  }

  createPromotion(promotion: Promotion): void {
    this.promotions.push(promotion);
  }

  updatePromotion(id: string, updates: Partial<Promotion>): void {
    const index = this.promotions.findIndex(p => p.id === id);
    if (index !== -1) {
      this.promotions[index] = { ...this.promotions[index], ...updates };
    }
  }

  deletePromotion(id: string): void {
    this.promotions = this.promotions.filter(p => p.id !== id);
  }
}

export const dataStore = new DataStore();
