import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Ban, Wallet, Users } from 'lucide-react';

// --- MOCK DATA & TYPES ---
const roomTypes = [
    { id: 'deluxe_king', name: 'Deluxe King' },
    { id: 'standard_twin', name: 'Standard Twin' },
    { id: 'ocean_suite', name: 'Ocean View Suite' },
    { id: 'garden_villa', name: 'NS 009 Nirwana Villa (Villa)' },
];

interface BlockedDate {
    date: Date;
    roomId: string;
}

interface PriceChange {
    date: Date;
    roomId: string;
    adultPrice: string;
    childPrice: string;
}

// --- Helper Functions ---
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

// --- Main Component ---
const RateManager = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); // October 2025
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(2025, 9, 13)]);
  const [selectedAccommodation, setSelectedAccommodation] = useState<string>(roomTypes[3].id);
  
  // State for form inputs
  const [adultPrice, setAdultPrice] = useState('20000');
  const [childPrice, setChildPrice] = useState('800');
  
  // State for blocked dates & price changes
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [priceChangeDates, setPriceChangeDates] = useState<PriceChange[]>([{ date: new Date(2025, 9, 2), roomId: roomTypes[3].id, adultPrice: '22000', childPrice: '900' }]);

  // Get today's date, stripping the time for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);


  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    return days;
  }, [currentDate, daysInMonth, firstDay]);

  const goToPreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDateClick = (date: Date) => {
    setSelectedDates(prevSelected => {
        const dateIndex = prevSelected.findIndex(d => d.toDateString() === date.toDateString());
        if (dateIndex > -1) {
            return prevSelected.filter((_, index) => index !== dateIndex);
        } else {
            return [...prevSelected, date];
        }
    });
  };
  
  const handleSavePrices = () => {
    const newPriceChanges: PriceChange[] = selectedDates.map(date => ({ date, roomId: selectedAccommodation, adultPrice, childPrice }));
    setPriceChangeDates(prev => {
        const otherRoomChanges = prev.filter(pc => pc.roomId !== selectedAccommodation);
        const currentRoomChanges = prev.filter(pc => pc.roomId === selectedAccommodation);
        const updatedChanges = [...currentRoomChanges];
        newPriceChanges.forEach(change => {
            const existingIndex = updatedChanges.findIndex(c => c.date.toDateString() === change.date.toDateString());
            if (existingIndex > -1) {
                updatedChanges[existingIndex] = change;
            } else {
                updatedChanges.push(change);
            }
        });
        return [...otherRoomChanges, ...updatedChanges];
    });
    setSelectedDates([]); 
  }

  const handleBlockDates = () => {
    if (selectedDates.length === 0) return;
    const newBlockedDates: BlockedDate[] = selectedDates
        .filter(sd => !blockedDates.some(bd => bd.date.toDateString() === sd.toDateString() && bd.roomId === selectedAccommodation))
        .map(date => ({ date, roomId: selectedAccommodation }));
    setBlockedDates(prev => [...prev, ...newBlockedDates]);
    setSelectedDates([]);
  };

  const handleUnblockDate = (dateToUnblock: Date) => {
    setBlockedDates(
        blockedDates.filter(
            d => !(d.date.toDateString() === dateToUnblock.toDateString() && d.roomId === selectedAccommodation)
        )
    );
  };
  
  const accommodationBlockedDates = blockedDates.filter(d => d.roomId === selectedAccommodation);
  const accommodationPriceChanges = priceChangeDates.filter(pc => pc.roomId === selectedAccommodation);
  const hasBlockedSelection = selectedDates.some(sd => accommodationBlockedDates.some(bd => bd.date.toDateString() === sd.toDateString()));

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-50 p-4 sm:p-6">
       {/* --- Header --- */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#1A202C' }}>Manage Calendar</h1>
        <p className="text-base text-gray-500 mt-1">Manage pricing and availability for your properties. Click to select multiple dates.</p>
      </header>

      {/* --- Main Content Area --- */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* --- Left Column: Calendar --- */}
        <div className="w-full lg:w-3/5 bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"><ChevronLeft className="h-6 w-6 text-gray-600" /></button>
                <h2 className="text-xl font-semibold text-gray-800">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"><ChevronRight className="h-6 w-6 text-gray-600" /></button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 font-medium mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => <div key={i}>{day}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`}></div>;
                    const isPastDate = day < today;
                    const isSelected = selectedDates.some(d => d.toDateString() === day.toDateString());
                    const isBlocked = accommodationBlockedDates.some(d => d.date.toDateString() === day.toDateString());
                    const hasPriceChange = accommodationPriceChanges.some(pc => pc.date.toDateString() === day.toDateString());
                    const isTodayDate = day.toDateString() === today.toDateString();
                    
                    return (
                        <button key={index} onClick={() => handleDateClick(day)}
                            disabled={isPastDate}
                            className={`p-2 h-14 rounded-xl text-base transition-all duration-200 ease-in-out relative flex items-center justify-center
                                ${isPastDate ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : ''}
                                ${isBlocked ? 'bg-red-100 text-red-400 line-through cursor-not-allowed' : ''}
                                ${!isPastDate && !isBlocked ? 'hover:bg-gray-100' : ''}
                                `}
                        >
                           <span className={`w-8 h-8 flex items-center justify-center rounded-full 
                                ${isSelected && !isPastDate ? 'bg-blue-600 text-white font-semibold ring-2 ring-offset-2 ring-blue-600' : ''}
                                ${isTodayDate && !isSelected ? 'text-blue-600 font-bold' : ''}
                           `}>
                               {day.getDate()}
                           </span>
                           {hasPriceChange && !isBlocked && !isPastDate && <div className="absolute inset-0 bg-orange-400 bg-opacity-10 rounded-xl border border-orange-200"></div>}
                        </button>
                    )
                })}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 border-t pt-4">
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 border border-red-300 rounded-md"></div>Blocked</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded-md"></div>Price Changes</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-600 rounded-md"></div>Selected</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white border border-gray-300 rounded-md"></div>Available</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded-md"></div>Past</div>
            </div>
        </div>

        {/* --- Right Column: Management Panel --- */}
        <div className="w-full lg:w-2/5">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                {selectedDates.length === 0 ? (
                     <div className="text-center text-gray-500 py-10 flex flex-col items-center">
                         <CalendarIcon className="h-12 w-12 mb-4 text-gray-300" />
                        <h3 className="font-semibold text-lg text-gray-700">Select Dates</h3>
                        <p className="text-sm">Please select one or more dates to manage pricing and availability.</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-5">
                            <label className="text-sm font-medium text-gray-500">Selected Dates</label>
                            <p className="font-semibold text-2xl text-navy-800" style={{color: '#1A202C'}}>{selectedDates.length} date(s) selected</p>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700 mb-1">Accommodation</label>
                            <select id="accommodation" value={selectedAccommodation} onChange={e => setSelectedAccommodation(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow">
                                {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                            </select>
                        </div>

                        {hasBlockedSelection ? (
                            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r-lg">
                                <h4 className="font-bold">Selection Contains Blocked Dates</h4>
                                <p className="text-sm mt-1">Your selection includes dates that are unavailable. Please deselect them to manage pricing.</p>
                            </div>
                        ) : (
                             <div>
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Manage Prices</h3>
                                <div className="space-y-4 mb-6">
                                    <div className="relative">
                                        <label htmlFor="adultPrice" className="block text-sm font-medium text-gray-700 mb-1">Adult Price (₹)</label>
                                        <Wallet className="absolute left-3 top-10 h-5 w-5 text-gray-400"/>
                                        <input type="text" id="adultPrice" value={adultPrice} onChange={e => setAdultPrice(e.target.value)} placeholder="Multiple" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow" />
                                    </div>
                                    <div className="relative">
                                        <label htmlFor="childPrice" className="block text-sm font-medium text-gray-700 mb-1">Child Price (₹)</label>
                                        <Users className="absolute left-3 top-10 h-5 w-5 text-gray-400"/>
                                        <input type="text" id="childPrice" placeholder="Multiple" value={childPrice} onChange={e => setChildPrice(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setSelectedDates([])} className="px-5 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors">Cancel</button>
                                    <button onClick={handleSavePrices} className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition-colors">Save Prices</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="mt-6 bg-white p-5 rounded-2xl shadow-lg">
                 <h3 className="font-semibold text-base text-gray-800">Blocked Dates for {roomTypes.find(rt => rt.id === selectedAccommodation)?.name} ({accommodationBlockedDates.length})</h3>
                 {accommodationBlockedDates.length > 0 ? (
                    <ul className="mt-3 space-y-2 max-h-36 overflow-y-auto pr-2">
                        {accommodationBlockedDates.map(({date}) => (
                            <li key={date.toISOString()} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg">
                               <span className="font-medium text-gray-700">{date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                               <button onClick={() => handleUnblockDate(date)} className="text-blue-600 hover:text-blue-800 font-semibold text-xs">UNBLOCK</button>
                            </li>
                        ))}
                    </ul>
                 ) : (
                    <div className="text-center py-5">
                        <p className="text-sm text-gray-500">No dates are currently blocked.</p>
                        {selectedDates.length > 0 && !hasBlockedSelection && (
                             <button onClick={handleBlockDates} className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded-lg font-semibold shadow-md hover:bg-red-700 flex items-center gap-2 mx-auto transition-all"><Ban size={16}/> Block Selected Dates</button>
                        )}
                    </div>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default RateManager;

