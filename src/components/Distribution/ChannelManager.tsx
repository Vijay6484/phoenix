import { useState } from 'react';
import { Globe, Link, Briefcase, PlusCircle, Settings, ExternalLink } from 'lucide-react';

// --- MOCK DATA & TYPES ---
type ChannelManagerTab = 'booking-engine' | 'otas' | 'travel-agents';

const mockOtas = [
    { id: 'booking_com', name: 'Booking.com', logo: 'https://placehold.co/40x40/1A56DB/FFFFFF?text=B', status: 'synced', bookings: 124, revenue: 875000 },
    { id: 'agoda', name: 'Agoda', logo: 'https://placehold.co/40x40/F5A623/FFFFFF?text=A', status: 'synced', bookings: 98, revenue: 650000 },
    { id: 'makemytrip', name: 'MakeMyTrip', logo: 'https://placehold.co/40x40/00AEEF/FFFFFF?text=M', status: 'error', bookings: 75, revenue: 520000 },
];

const mockTravelAgents = [
    { id: 'ta_01', name: 'Skylink Travels', contact: 'Ravi Kumar', bookings: 45, commissionDue: 75000 },
    { id: 'ta_02', name: 'Corporate Journeys Inc.', contact: 'Priya Singh', bookings: 32, commissionDue: 58000 },
];


// --- Sub-components for each tab ---

const BookingEngineTab = () => (
    <div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-lg border">
                <p className="text-sm font-medium text-gray-500">Total Bookings (Direct)</p>
                <p className="text-4xl font-bold text-navy-800 mt-1" style={{ color: '#1A202C' }}>212</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-lg border">
                <p className="text-sm font-medium text-gray-500">Revenue (Direct)</p>
                <p className="text-4xl font-bold text-navy-800 mt-1" style={{ color: '#1A202C' }}>₹1,250,000</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-lg border">
                <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                <p className="text-4xl font-bold text-navy-800 mt-1" style={{ color: '#1A202C' }}>4.2%</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your Live Booking Engine</h3>
                <p className="text-sm text-gray-600 mb-4">This is the direct booking channel on your own website. Manage its settings and appearance here.</p>
                <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center border">
                    <p className="text-gray-500">[Booking Engine Preview Placeholder]</p>
                </div>
                <div className="mt-4 flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition-colors">
                        <Settings size={18}/> Customize Settings
                    </button>
                    <button className="flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors">
                        <ExternalLink size={18}/> View Live Page
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Direct Bookings</h3>
                <ul className="space-y-4">
                    <li className="text-sm text-gray-700"><strong>Anika Sharma</strong> booked Deluxe King for 2 nights.</li>
                    <li className="text-sm text-gray-700"><strong>Rohan Mehra</strong> booked Ocean View Suite for 4 nights.</li>
                    <li className="text-sm text-gray-700"><strong>Isha Patel</strong> booked Standard Twin for 1 night.</li>
                     <li className="text-sm text-gray-700"><strong>Sameer Khan</strong> booked Deluxe King for 3 nights.</li>
                </ul>
            </div>
        </div>
    </div>
);

const OtasTab = () => (
    <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Connected OTAs</h3>
        <div className="space-y-4">
            {mockOtas.map(ota => (
                <div key={ota.id} className="bg-white p-4 rounded-2xl shadow-lg border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src={ota.logo} alt={ota.name} className="h-10 w-10 rounded-full bg-gray-200"/>
                        <div>
                            <p className="font-bold text-lg text-gray-800">{ota.name}</p>
                            <div className={`flex items-center gap-1.5 text-xs font-medium ${ota.status === 'synced' ? 'text-green-600' : 'text-red-600'}`}>
                               <div className={`w-2 h-2 rounded-full ${ota.status === 'synced' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                               {ota.status === 'synced' ? 'Synced' : 'Sync Error'}
                            </div>
                        </div>
                    </div>
                     <div className="hidden sm:block text-right">
                        <p className="text-sm text-gray-500">Bookings (Last 30d)</p>
                        <p className="font-semibold text-gray-800">{ota.bookings}</p>
                    </div>
                     <div className="hidden md:block text-right">
                        <p className="text-sm text-gray-500">Revenue (Last 30d)</p>
                        <p className="font-semibold text-gray-800">₹{ota.revenue.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                        <button className="p-2 rounded-lg hover:bg-gray-100"><Settings size={20} className="text-gray-600"/></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const TravelAgentsTab = () => (
     <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Registered Travel Agents & Companies</h3>
        <div className="space-y-4">
            {mockTravelAgents.map(agent => (
                 <div key={agent.id} className="bg-white p-4 rounded-2xl shadow-lg border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                           {agent.name.charAt(0)}
                         </div>
                        <div>
                            <p className="font-bold text-lg text-gray-800">{agent.name}</p>
                            <p className="text-xs text-gray-500">Contact: {agent.contact}</p>
                        </div>
                    </div>
                     <div className="hidden sm:block text-right">
                        <p className="text-sm text-gray-500">Total Bookings</p>
                        <p className="font-semibold text-gray-800">{agent.bookings}</p>
                    </div>
                     <div className="hidden md:block text-right">
                        <p className="text-sm text-gray-500">Commission Due</p>
                        <p className="font-semibold text-red-600">₹{agent.commissionDue.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                        <button className="p-2 rounded-lg hover:bg-gray-100"><Settings size={20} className="text-gray-600"/></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


// --- Main Component ---
const ChannelManager = () => {
  const [activeTab, setActiveTab] = useState<ChannelManagerTab>('booking-engine');

  const tabs = [
      { id: 'booking-engine', name: 'Booking Engine', icon: Globe },
      { id: 'otas', name: 'OTAs', icon: Link },
      { id: 'travel-agents', name: 'Travel Agents', icon: Briefcase },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-50 p-4 sm:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#1A202C' }}>Channel Manager</h1>
        <p className="text-base text-gray-500 mt-1">Manage all your sales channels from one central place.</p>
      </header>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
         <div className="bg-white p-1.5 rounded-xl shadow-md border">
            <div className="flex space-x-1">
                {tabs.map(tab => (
                    <button 
                        key={tab.id} 
                        onClick={() => setActiveTab(tab.id as ChannelManagerTab)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors
                           ${activeTab === tab.id ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}
                        `}
                    >
                        <tab.icon size={16}/>
                        {tab.name}
                    </button>
                ))}
            </div>
         </div>
         {(activeTab === 'otas' || activeTab === 'travel-agents') && (
            <button className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-lg font-semibold shadow hover:bg-navy-900 transition-colors" style={{ backgroundColor: '#1A202C' }}>
                <PlusCircle size={18}/>
                {activeTab === 'otas' ? 'Add Platform' : 'Add Agent'}
            </button>
         )}
      </div>
      <div className="flex-1">
          {activeTab === 'booking-engine' && <BookingEngineTab />}
          {activeTab === 'otas' && <OtasTab />}
          {activeTab === 'travel-agents' && <TravelAgentsTab />}
      </div>
    </div>
  );
};

export default ChannelManager;

