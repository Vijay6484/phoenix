import { useState, useMemo } from 'react';
import { Search, PlusCircle, X, Calendar } from 'lucide-react';
import { GuestProfile, GuestTag } from '../../types';

// --- MOCK DATA ---
const mockGuests: GuestProfile[] = [
    { id: 'gst_01', name: 'Rohan Verma', email: 'rohan.v@example.com', phone: '+91 98765 43210', totalVisits: 5, totalSpend: 150000, tags: ['VIP', 'Corporate'], lastVisit: '2025-09-15', preferences: ['High-floor room', 'Foam pillows'] },
    { id: 'gst_02', name: 'Anika Sharma', email: 'anika.s@example.com', phone: '+91 91234 56789', totalVisits: 2, totalSpend: 45000, tags: ['Honeymoon'], lastVisit: '2025-08-20' },
    { id: 'gst_03', name: 'Priya Patel', email: 'priya.p@example.com', phone: '+91 99887 76655', totalVisits: 1, totalSpend: 12000, tags: ['Family'], lastVisit: '2025-10-01', preferences: ['Requires a quiet room'] },
    { id: 'gst_04', name: 'Sameer Khan', email: 'sameer.k@example.com', phone: '+91 97654 32109', totalVisits: 3, totalSpend: 82000, tags: ['Corporate'], lastVisit: '2025-07-11' },
];

const mockStayHistory = [
    { bookingId: 'bk_1', checkIn: '2025-09-12', checkOut: '2025-09-15', room: 'Ocean View Suite', spend: 45000 },
    { bookingId: 'bk_2', checkIn: '2025-05-20', checkOut: '2025-05-22', room: 'Deluxe King', spend: 30000 },
    { bookingId: 'bk_3', checkIn: '2024-11-10', checkOut: '2024-11-15', room: 'Deluxe King', spend: 75000 },
];

const getTagColor = (tag: GuestTag) => {
    switch (tag) {
        case 'VIP': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        case 'Corporate': return 'bg-blue-100 text-blue-800 border border-blue-200';
        case 'Honeymoon': return 'bg-pink-100 text-pink-800 border border-pink-200';
        case 'Family': return 'bg-green-100 text-green-800 border border-green-200';
        default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
};

// --- Sub-component for the Detail Modal ---
const GuestDetailModal = ({ guest, onClose }: { guest: GuestProfile, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center font-bold text-2xl text-gray-600">
                           {guest.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{guest.name}</h2>
                            <p className="text-sm text-gray-500">{guest.email}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={24}/></button>
                </div>
                <div className="mt-4 flex gap-2 flex-wrap">
                    {guest.tags.map(tag => <span key={tag} className={`px-3 py-1 text-xs font-semibold rounded-full ${getTagColor(tag)}`}>{tag}</span>)}
                </div>
            </div>
            <div className="p-6 bg-gray-50/50">
                 <h3 className="font-semibold text-gray-700 mb-3">Stay History</h3>
                 <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
                     {mockStayHistory.map(stay => (
                         <li key={stay.bookingId} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                             <div className="flex items-center gap-3">
                                <Calendar size={18} className="text-blue-500"/>
                                <div>
                                    <p className="font-semibold text-sm text-gray-800">{new Date(stay.checkIn).toLocaleDateString('en-GB')} - {new Date(stay.checkOut).toLocaleDateString('en-GB')}</p>
                                    <p className="text-xs text-gray-500">{stay.room}</p>
                                </div>
                             </div>
                             <p className="font-semibold text-sm text-gray-800">₹{stay.spend.toLocaleString('en-IN')}</p>
                         </li>
                     ))}
                 </ul>
                 <h3 className="font-semibold text-gray-700 mt-6 mb-3">Preferences & Notes</h3>
                 <div className="p-4 bg-white border rounded-lg text-sm text-gray-700 min-h-[80px]">
                     {guest.preferences?.join(', ') || <span className="text-gray-400">No preferences noted.</span>}
                 </div>
            </div>
        </div>
    </div>
);


const GuestProfiles = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGuest, setSelectedGuest] = useState<GuestProfile | null>(null);

    const filteredGuests = useMemo(() => {
        return mockGuests.filter(guest => 
            guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guest.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-50 p-4 sm:p-6">
             {/* --- Header --- */}
            <header className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#1A202C' }}>Guest Profiles</h1>
                <p className="text-base text-gray-500 mt-1">Search, view, and manage all your guest information in one place.</p>
            </header>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                    <input type="text" placeholder="Search guests..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
                </div>
                <button className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-3 bg-navy-800 text-white rounded-xl font-semibold shadow hover:bg-navy-900 transition-colors" style={{ backgroundColor: '#1A202C' }}>
                    <PlusCircle size={18}/>
                    Add New Guest
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b bg-gray-50">
                        <tr className="text-sm text-gray-600">
                            <th className="p-4 font-semibold">Guest Name</th>
                            <th className="p-4 font-semibold hidden md:table-cell">Total Visits</th>
                            <th className="p-4 font-semibold hidden sm:table-cell">Total Spend</th>
                            <th className="p-4 font-semibold">Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGuests.map(guest => (
                            <tr key={guest.id} onClick={() => setSelectedGuest(guest)} className="border-b last:border-0 hover:bg-blue-50 transition-colors cursor-pointer">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                            {guest.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{guest.name}</p>
                                            <p className="text-xs text-gray-500">{guest.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 hidden md:table-cell text-gray-700 font-medium">{guest.totalVisits}</td>
                                <td className="p-4 hidden sm:table-cell text-gray-700 font-medium">₹{guest.totalSpend.toLocaleString('en-IN')}</td>
                                <td className="p-4">
                                    <div className="flex gap-2 flex-wrap">
                                        {guest.tags.map(tag => (
                                            <span key={tag} className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getTagColor(tag)}`}>{tag}</span>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedGuest && <GuestDetailModal guest={selectedGuest} onClose={() => setSelectedGuest(null)} />}
        </div>
    );
};

export default GuestProfiles;

