import { Home, Users, Wrench, DollarSign, BarChart3, Settings as SettingsIcon, ChevronLeft, LogOut } from 'lucide-react';
import { useState } from 'react';

// --- PROPS & DATA ---
interface SidebarProps {
  currentModule: string;
  onModuleChange: (module: string) => void;
  currentView?: string;
  onViewChange?: (view: string) => void;
}

const modules = [
  { id: 'front-office', name: 'Front Office', icon: Home, hasSubMenu: true },
  { id: 'distribution', name: 'Distribution', icon: BarChart3, hasSubMenu: true },
  { id: 'guest-management', name: 'Guest Management', icon: Users, hasSubMenu: true },
  { id: 'housekeeping', name: 'Housekeeping', icon: Wrench, hasSubMenu: false },
  { id: 'billing', name: 'Billing & Finance', icon: DollarSign, hasSubMenu: false },
  { id: 'reports', name: 'Reports', icon: BarChart3, hasSubMenu: false },
  { id: 'settings', name: 'Settings', icon: SettingsIcon, hasSubMenu: false },
];

const frontOfficeViews = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'arrivals', name: 'Arrivals' },
  { id: 'departures', name: 'Departures' },
  { id: 'reservations', name: 'Reservations' },
  { id: 'groups', name: 'Groups' },
  { id: 'logbook', name: 'Logbook' },
];

const distributionViews = [
  { id: 'rate-manager', name: 'Rate Manager' },
  { id: 'inventory-manager', name: 'Inventory Manager' },
  { id: 'channel-manager', name: 'Channel Manager' },
  { id: 'promotions', name: 'Promotions' },
];

const guestManagementViews = [
  { id: 'profiles', name: 'Guest Profiles' },
  { id: 'reputation', name: 'Reputation' },
  { id: 'communication', name: 'Communication' },
];

const getSubmenuViews = (moduleId: string) => {
    switch (moduleId) {
        case 'front-office':
            return frontOfficeViews;
        case 'distribution':
            return distributionViews;
        case 'guest-management':
            return guestManagementViews;
        default:
            return [];
    }
};


// --- MAIN COMPONENT ---
export default function Sidebar({ currentModule, onModuleChange, currentView, onViewChange }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`relative flex flex-col h-screen text-white transition-width duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'}`} style={{ backgroundColor: '#111827' }}>
      
      {/* --- Header / Logo --- */}
      <div className={`flex items-center h-20 px-6 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
        <h1 className={`font-bold text-2xl whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          Phoenix
        </h1>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* --- Main Navigation --- */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = currentModule === module.id;

          return (
            <div key={module.id}>
              <button
                onClick={() => onModuleChange(module.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group
                  ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                  ${!isExpanded ? 'justify-center' : ''}
                `}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                <span className={`ml-4 text-base font-medium whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                  {module.name}
                </span>
                {module.hasSubMenu && isExpanded && <ChevronLeft className={`w-5 h-5 ml-auto transition-transform duration-300 ${isActive ? '-rotate-90' : 'rotate-0'}`} />}
              </button>

              {/* Submenu */}
              {isExpanded && module.hasSubMenu && (
                 <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isActive ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="pt-2 pl-6 space-y-1">
                        {getSubmenuViews(module.id).map((view) => (
                           <button
                             key={view.id}
                             onClick={() => onViewChange?.(view.id)}
                             className={`relative w-full text-left flex items-center px-4 py-2 rounded-md transition-colors duration-200 text-sm
                                ${currentView === view.id ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'}
                             `}
                           >
                            {currentView === view.id && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-blue-400 rounded-r-full"></span>
                            )}
                            {view.name}
                           </button>
                        ))}
                    </div>
                 </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* --- Footer / User Profile --- */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
            <img 
                src="https://placehold.co/40x40/E2E8F0/4A5568?text=VT"
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
            />
            <div className={`ml-3 overflow-hidden transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                <p className="font-semibold text-sm">Vijay T.</p>
                <p className="text-xs text-gray-400">Front Desk</p>
            </div>
            <button className={`ml-auto p-2 rounded-lg hover:bg-gray-800 transition-colors ${!isExpanded && 'hidden'}`}>
                <LogOut className="w-5 h-5 text-gray-400"/>
            </button>
        </div>
      </div>
    </div>
  );
}

