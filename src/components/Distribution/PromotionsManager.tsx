import { PlusCircle, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { Promotion } from '../../types';

// Mock Data
const mockPromotions: Promotion[] = [
  { id: 'promo_diwali', name: 'Diwali Special', startDate: '2025-11-01', endDate: '2025-11-10', isActive: true, discount: { type: 'percentage', value: 20 }},
  { id: 'promo_monsoon', name: 'Monsoon Getaway', startDate: '2025-07-15', endDate: '2025-08-31', isActive: true, discount: { type: 'fixed', value: 1500 }},
  { id: 'promo_last_min', name: 'Last Minute Deal', startDate: '2025-01-01', endDate: '2025-12-31', isActive: false, discount: { type: 'percentage', value: 15 }},
];

const PromotionsManager = () => {
  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
       <header className="bg-white shadow-sm p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Promotions & Packages</h1>
            <p className="text-sm text-gray-500">Create and manage special offers to attract more direct bookings.</p>
          </div>
          <button className="flex items-center bg-navy-800 text-white px-4 py-2 rounded-lg shadow hover:bg-navy-900 transition-colors" style={{backgroundColor: '#1A202C'}}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Promotion
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promotion Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Dates</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {mockPromotions.map(promo => (
                        <tr key={promo.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{promo.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(promo.startDate).toLocaleDateString('en-IN')} - {new Date(promo.endDate).toLocaleDateString('en-IN')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {promo.discount.type === 'percentage' ? `${promo.discount.value}% Off` : `₹${promo.discount.value.toLocaleString('en-IN')} Off`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <button className="focus:outline-none">
                                    {promo.isActive 
                                        ? <ToggleRight className="h-6 w-6 text-green-500" /> 
                                        : <ToggleLeft className="h-6 w-6 text-gray-400" />}
                                </button>
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                <button className="text-gray-400 hover:text-red-600">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default PromotionsManager;
