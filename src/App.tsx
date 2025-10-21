import { useState } from 'react';
import Sidebar from './components/Sidebar';
import UnderConstruction from './components/UnderConstruction';

// ===== FRONT OFFICE =====
import Dashboard from './components/FrontOffice/Dashboard';
import Arrivals from './components/FrontOffice/Arrivals';
import Departures from './components/FrontOffice/Departures';
import Reservations from './components/FrontOffice/Reservations';
import Groups from './components/FrontOffice/Groups';
import Logbook from './components/FrontOffice/Logbook';

// ===== DISTRIBUTION =====
import RateManager from './components/Distribution/RateManager';
import InventoryManager from './components/Distribution/InventoryManager';
import ChannelManager from './components/Distribution/ChannelManager';
import PromotionsManager from './components/Distribution/PromotionsManager';

// ===== GUEST MANAGEMENT =====
import GuestProfiles from './components/GuestManagement/GuestProfiles';
import ReputationManagement from './components/GuestManagement/ReputationManager';
import CommunicationAndMarketing from './components/GuestManagement/CommunicationAndMarketing';

// ===== BILLING & FINANCE =====
import Folios from './components/BillingFinance/folios';


import {
  ViewType,
  DistributionViewType,
  GuestManagementViewType,
  BillingFinanceViewType,
} from './types';


function App() {
  const [currentModule, setCurrentModule] = useState('front-office');
  const [currentView, setCurrentView] = useState<
    ViewType | DistributionViewType | GuestManagementViewType | BillingFinanceViewType
  >('dashboard');

  const renderContent = () => {
    switch (currentModule) {
      case 'front-office':
        switch (currentView) {
          case 'dashboard': return <Dashboard />;
          case 'arrivals': return <Arrivals />;
          case 'departures': return <Departures />;
          case 'reservations': return <Reservations />;
          case 'groups': return <Groups />;
          case 'logbook': return <Logbook />;
          default: return <Dashboard />;
        }

      case 'distribution':
        switch (currentView) {
          case 'rate-manager': return <RateManager />;
          case 'inventory-manager': return <InventoryManager />;
          case 'channel-manager': return <ChannelManager />;
          case 'promotions': return <PromotionsManager />;
          default: return <RateManager />;
        }

      case 'guest-management':
        switch (currentView) {
          case 'profiles': return <GuestProfiles />;
          case 'reputation': return <ReputationManagement />;
          case 'communication': return <CommunicationAndMarketing />;
          default: return <GuestProfiles />;
        }

      case 'billing-finance':
        switch (currentView) {
          case 'folios': return <Folios />;
          default: return <Folios />;
        }

      default:
        const moduleNames: Record<string, string> = {
          'housekeeping': 'Housekeeping & Maintenance',
          'reports': 'Reports & Analytics',
          'settings': 'Settings',
        };
        return <UnderConstruction moduleName={moduleNames[currentModule] || 'Module'} />;
    }
  };


  const handleModuleChange = (module: string) => {
    // normalize possible module ids coming from Sidebar
    const normalizeModule = (m: string) => {
      const map: Record<string, string> = {
        'front': 'front-office',
        'front-office': 'front-office',
        'distribution': 'distribution',
        'dist': 'distribution',
        'guest-management': 'guest-management',
        'guest': 'guest-management',
        'billing': 'billing-finance',
        'billing-finance': 'billing-finance',
      };
      return map[m] ?? m;
    };

    const normalized = normalizeModule(module);
    setCurrentModule(normalized);

    type AllView =
      | ViewType
      | DistributionViewType
      | GuestManagementViewType
      | BillingFinanceViewType;

    const defaultViews: Record<string, AllView> = {
      'front-office': 'dashboard',
      'distribution': 'rate-manager',
      'guest-management': 'profiles',
      'billing-finance': 'folios',
    };

    setCurrentView(defaultViews[normalized] ?? 'dashboard');
  };


  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar
        currentModule={currentModule}
        onModuleChange={handleModuleChange}
        currentView={currentView}
        onViewChange={(view) =>
          setCurrentView(
            view as ViewType | DistributionViewType | GuestManagementViewType | BillingFinanceViewType
          )
        }
      />
      <main className="flex-1 overflow-x-hidden">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
