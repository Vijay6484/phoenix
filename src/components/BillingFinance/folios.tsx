import { useState, useMemo } from 'react';
import { Search, Printer, Mail, X, DollarSign, BaggageClaim, Utensils, Droplets, ShoppingCart, BedDouble } from 'lucide-react';
import { GuestFolio, FolioItem, Payment } from '../../types';

// --- MOCK DATA ---
const initialFolios: GuestFolio[] = [
    { 
        folioId: 'F251018A', reservationId: 'R001', guestName: 'Rohan Verma', roomNumber: '101', 
        checkIn: '2025-10-16', checkOut: '2025-10-19', 
        items: [
            { id: 'i01', date: '2025-10-16', description: 'Room Charge - Night 1', amount: 8000, department: 'Room' },
            { id: 'i02', date: '2025-10-17', description: 'Room Charge - Night 2', amount: 8000, department: 'Room' },
            { id: 'i03', date: '2025-10-17', description: 'Dinner at Rooftop Grill', amount: 3500, department: 'F&B' },
            { id: 'i04', date: '2025-10-18', description: 'Laundry Service', amount: 1000, department: 'Laundry' },
        ],
        payments: [
            { id: 'p01', date: '2025-10-16', method: 'Credit Card', amount: 10000, transactionId: 'txn_12345' }
        ],
        totalCharges: 20500, totalPayments: 10000, balance: 10500 
    },
    { 
        folioId: 'F251018B', reservationId: 'R002', guestName: 'Anika Sharma', roomNumber: '202', 
        checkIn: '2025-10-17', checkOut: '2025-10-20', 
        items: [
            { id: 'i05', date: '2025-10-17', description: 'Room Charge - Night 1', amount: 12000, department: 'Room' },
        ],
        payments: [
             { id: 'p02', date: '2025-10-17', method: 'UPI', amount: 12000, transactionId: 'upi_67890' }
        ],
        totalCharges: 12000, totalPayments: 12000, balance: 0
    },
];

const departmentIcons: Record<FolioItem['department'], JSX.Element> = {
    Room: <BedDouble size={18} className="text-blue-500" />,
    'F&B': <Utensils size={18} className="text-orange-500" />,
    Spa: <Droplets size={18} className="text-pink-500" />,
    Laundry: <BaggageClaim size={18} className="text-purple-500" />,
    Other: <ShoppingCart size={18} className="text-gray-500" />,
};

// --- Add/Edit Modal (Placeholder) ---
const AddTransactionModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Add Transaction</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={24}/></button>
            </div>
            <div className="p-6">
                <p>Forms for adding a new charge or recording a payment would appear here.</p>
            </div>
        </div>
    </div>
);

// --- Main Folios Component ---
const Folios = () => {
    const [folios, setFolios] = useState<GuestFolio[]>(initialFolios);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFolio, setSelectedFolio] = useState<GuestFolio | null>(folios[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredFolios = useMemo(() => 
        folios.filter(f => 
            f.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.roomNumber.includes(searchQuery)
        ), 
    [folios, searchQuery]);

    const handleSettleAndCheckout = () => {
        if (!selectedFolio || selectedFolio.balance > 0) return;
        setFolios(folios.filter(f => f.folioId !== selectedFolio.folioId));
        setSelectedFolio(null);
    }

    return (
        <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-50 p-4 sm:p-6">
            {/* --- Header --- */}
            <header className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#1A202C' }}>Guest Folios</h1>
                <p className="text-base text-gray-500 mt-1">Manage in-house guest billing, post charges, and settle payments.</p>
            </header>

            {/* --- Main Content Area --- */}
            <div className="flex-1 flex gap-6">
                {/* --- Left Column: Folio List --- */}
                <div className="w-1/3 bg-white rounded-2xl shadow-lg border p-4 flex flex-col">
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        <input type="text" placeholder="Search by guest or room..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl" />
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2">
                        {filteredFolios.map(folio => (
                            <button key={folio.folioId} onClick={() => setSelectedFolio(folio)} 
                            className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${selectedFolio?.folioId === folio.folioId ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                                <div className="flex justify-between items-center">
                                    <p className="font-bold">{folio.guestName}</p>
                                    <p className={`text-sm font-semibold ${folio.balance > 0 ? (selectedFolio?.folioId === folio.folioId ? 'text-white' : 'text-red-600') : (selectedFolio?.folioId === folio.folioId ? 'text-green-300' : 'text-green-600')}`}>
                                        {folio.balance > 0 ? `₹${folio.balance.toLocaleString('en-IN')}` : 'Settled'}
                                    </p>
                                </div>
                                <p className={`text-xs ${selectedFolio?.folioId === folio.folioId ? 'text-blue-200' : 'text-gray-500'}`}>Room {folio.roomNumber}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- Right Column: Selected Folio Details --- */}
                <div className="w-2/3 bg-white rounded-2xl shadow-lg border p-6 flex flex-col">
                     {selectedFolio ? (
                         <>
                            <div className="border-b pb-4 mb-4">
                                 <div className="flex justify-between items-start">
                                     <div>
                                        <h3 className="text-2xl font-bold text-gray-800">{selectedFolio.guestName}</h3>
                                        <p className="text-sm text-gray-500">Folio #{selectedFolio.folioId} | Room {selectedFolio.roomNumber}</p>
                                     </div>
                                     <div className="text-right">
                                         <p className="text-sm text-gray-500">Balance Due</p>
                                         <p className={`text-3xl font-bold ${selectedFolio.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            ₹{selectedFolio.balance.toLocaleString('en-IN')}
                                         </p>
                                     </div>
                                 </div>
                            </div>
                            <div className="flex-1 overflow-y-auto pr-2">
                               <h4 className="font-semibold text-gray-600 mb-2">Charges</h4>
                               <table className="w-full text-sm">
                                   <tbody>
                                       {selectedFolio.items.map(item => (
                                           <tr key={item.id} className="border-b">
                                               <td className="py-2 flex items-center gap-3">{departmentIcons[item.department]} {item.description}</td>
                                               <td className="py-2 text-right font-medium text-gray-800">₹{item.amount.toLocaleString('en-IN')}</td>
                                           </tr>
                                       ))}
                                   </tbody>
                               </table>
                               <h4 className="font-semibold text-gray-600 mt-4 mb-2">Payments</h4>
                                <table className="w-full text-sm">
                                   <tbody>
                                       {selectedFolio.payments.map(payment => (
                                           <tr key={payment.id} className="border-b">
                                               <td className="py-2 flex items-center gap-3 text-green-600"><DollarSign size={18} /> Payment via {payment.method}</td>
                                               <td className="py-2 text-right font-medium text-green-600">- ₹{payment.amount.toLocaleString('en-IN')}</td>
                                           </tr>
                                       ))}
                                   </tbody>
                               </table>
                            </div>
                            <div className="pt-4 border-t mt-4 flex justify-between items-center">
                                <div className="flex gap-2">
                                    <button onClick={() => alert('Printing invoice...')} className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-300"><Printer size={16}/> Print</button>
                                    <button onClick={() => alert('Emailing invoice...')} className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-300"><Mail size={16}/> Email Invoice</button>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-3 bg-blue-100 text-blue-700 rounded-xl font-semibold hover:bg-blue-200">Add Transaction</button>
                                    <button onClick={handleSettleAndCheckout} className="px-5 py-3 bg-green-600 text-white rounded-xl font-semibold shadow hover:bg-green-700 disabled:bg-gray-400" disabled={selectedFolio.balance > 0}>
                                        Settle & Checkout
                                    </button>
                                </div>
                            </div>
                         </>
                     ) : (
                         <div className="text-center text-gray-500 m-auto">Select a folio to view details.</div>
                     )}
                </div>
            </div>
            {isModalOpen && <AddTransactionModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default Folios;

