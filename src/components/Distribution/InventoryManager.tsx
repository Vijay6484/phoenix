import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Minus, Plus } from 'lucide-react';

// --- MOCK DATA & TYPES ---
const roomTypes = [
    { id: 'deluxe_king', name: 'Deluxe King', total: 15 },
    { id: 'standard_twin', name: 'Standard Twin', total: 20 },
    { id: 'ocean_suite', name: 'Ocean View Suite', total: 10 },
    { id: 'garden_villa', name: 'NS 009 Nirwana Villa (Villa)', total: 5 },
];

interface InventoryData {
    date: Date;
    roomId: string;
    available: number;
}

// --- Helper Functions ---
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

// --- Main Component ---
const InventoryManager = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); // October 2025
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(2025, 9, 22)]);
  const [selectedAccommodation, setSelectedAccommodation] = useState<string>(roomTypes[3].id);
  
  // State for form inputs
  const [availableRooms, setAvailableRooms] = useState(5);
  const [isFullyBlocked, setIsFullyBlocked] = useState(false);
  
  // State for inventory data
  const [inventoryData, setInventoryData] = useState<InventoryData[]>([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    // When selection changes, update the form
    if (selectedDates.length === 1) {
        const date = selectedDates[0];
        const roomInventory = inventoryData.find(inv => inv.date.toDateString() === date.toDateString() && inv.roomId === selectedAccommodation);
        const totalRooms = roomTypes.find(rt => rt.id === selectedAccommodation)?.total || 0;
        
        const currentAvailability = roomInventory ? roomInventory.available : totalRooms;
        setAvailableRooms(currentAvailability);
        setIsFullyBlocked(currentAvailability === 0);
    }
  }, [selectedDates, selectedAccommodation, inventoryData]);

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
    // For this UI, single selection is more intuitive
    setSelectedDates([date]);
  };

  const handleInventorySubmit = () => {
    if (selectedDates.length === 0) return;

    const newInventoryData: InventoryData[] = selectedDates.map(date => ({
        date,
        roomId: selectedAccommodation,
        available: isFullyBlocked ? 0 : availableRooms
    }));

    setInventoryData(prev => {
        const otherEntries = prev.filter(entry => 
            !(entry.roomId === selectedAccommodation && selectedDates.some(sd => sd.toDateString() === entry.date.toDateString()))
        );
        return [...otherEntries, ...newInventoryData];
    });
  };
  
  const handleBlockToggle = (checked: boolean) => {
    setIsFullyBlocked(checked);
    if(checked) {
        setAvailableRooms(0);
    } else {
        const totalRooms = roomTypes.find(rt => rt.id === selectedAccommodation)?.total || 0;
        setAvailableRooms(totalRooms);
    }
  }

  const accommodationInventory = inventoryData.filter(inv => inv.roomId === selectedAccommodation);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-50 p-4 sm:p-6">
       {/* --- Header --- */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#1A202C' }}>Manage Calendar</h1>
        <p className="text-base text-gray-500 mt-1">Manage room availability and block dates for your properties.</p>
      </header>

      {/* --- Main Content Area --- */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* --- Left Column: Calendar --- */}
        <div className="w-full lg:w-3/5 bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"><ChevronLeft className="h-6 w-6 text-gray-600" /></button>
                <h2 className="text-xl font-semibold text-gray-800">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
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
                    const inventoryInfo = accommodationInventory.find(inv => inv.date.toDateString() === day.toDateString());
                    const totalRooms = roomTypes.find(rt => rt.id === selectedAccommodation)?.total || 0;
                    const isFullyBlocked = inventoryInfo?.available === 0;
                    const isPartiallyBlocked = inventoryInfo && inventoryInfo.available > 0 && inventoryInfo.available < totalRooms;
                    
                    return (
                        <button key={index} onClick={() => handleDateClick(day)} disabled={isPastDate}
                            className={`p-2 h-14 rounded-xl text-base transition-all duration-200 ease-in-out relative flex items-center justify-center
                                ${isPastDate ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                                ${isFullyBlocked ? 'bg-red-100 text-red-400 line-through' : ''}
                                ${isPartiallyBlocked ? 'bg-yellow-100' : ''}
                                ${isSelected ? 'ring-2 ring-offset-2 ring-blue-600' : ''}
                            `}
                        >
                           <span>{day.getDate()}</span>
                           {isPartiallyBlocked && <div className="absolute inset-0 bg-yellow-400 bg-opacity-20 rounded-xl border border-yellow-300"></div>}
                        </button>
                    )
                })}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 border-t pt-4">
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 border border-red-300 rounded-md"></div>Fully Blocked</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded-md"></div>Partially Blocked</div>
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
                        <h3 className="font-semibold text-lg text-gray-700">Select a Date</h3>
                        <p className="text-sm">Please select a date to manage its inventory.</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-5 bg-gray-100 p-4 rounded-xl">
                            <label className="text-sm font-medium text-gray-500">Selected Date</label>
                            <p className="font-semibold text-lg text-navy-800" style={{color: '#1A202C'}}>{selectedDates[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700 mb-1">Accommodation</label>
                            <select id="accommodation" value={selectedAccommodation} onChange={e => setSelectedAccommodation(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow">
                                {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                            </select>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Manage Inventory</h3>
                            <div className="mb-4">
                               <div className="flex justify-between items-center">
                                 <label className="text-sm font-medium text-gray-700">Available Rooms: {roomTypes.find(rt => rt.id === selectedAccommodation)?.total || 0}</label>
                                 <div className="flex items-center gap-2">
                                     <input type="checkbox" id="blockAll" checked={isFullyBlocked} onChange={(e) => handleBlockToggle(e.target.checked)} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"/>
                                     <label htmlFor="blockAll" className="text-sm font-medium text-gray-700">Block All Rooms</label>
                                 </div>
                               </div>
                            </div>

                            <div className="flex items-center justify-center gap-4 my-6">
                                <button onClick={() => setAvailableRooms(v => Math.max(0, v - 1))} disabled={isFullyBlocked} className="p-3 bg-gray-200 rounded-full disabled:opacity-50"><Minus size={20}/></button>
                                <span className="text-4xl font-bold w-24 text-center">{availableRooms}</span>
                                <button onClick={() => setAvailableRooms(v => Math.min(roomTypes.find(rt => rt.id === selectedAccommodation)?.total || 0, v + 1))} disabled={isFullyBlocked} className="p-3 bg-gray-200 rounded-full disabled:opacity-50"><Plus size={20}/></button>
                            </div>
                            
                            <p className="text-center text-xs text-gray-500 mb-6">{isFullyBlocked ? '0 rooms will be available after this change.' : `${availableRooms} rooms will be available after this change.`}</p>

                            <div className="flex justify-end gap-3">
                                <button onClick={() => setSelectedDates([])} className="px-5 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors">Cancel</button>
                                <button onClick={handleInventorySubmit} className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition-colors">Submit</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;

