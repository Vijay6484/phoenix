import { useState } from 'react';
import { Mail, Send, BarChart2, PlusCircle, Users, FileText } from 'lucide-react';
import { EmailCampaign } from '../../types';

// --- MOCK DATA ---
const mockCampaigns: EmailCampaign[] = [
    { id: 'camp_01', name: 'Diwali Festive Offer', status: 'Sent', sentDate: '2025-10-05', recipients: 1250, openRate: 28.5 },
    { id: 'camp_02', name: 'Monsoon Weekend Getaway', status: 'Sent', sentDate: '2025-07-15', recipients: 980, openRate: 35.2 },
    { id: 'camp_03', name: 'Post-Stay Feedback Request', status: 'Draft', sentDate: '', recipients: 0, openRate: 0 },
    { id: 'camp_04', name: 'New Year Early Bird Discount', status: 'Scheduled', sentDate: '2025-11-01', recipients: 1500, openRate: 0 },
];

const getStatusColor = (status: 'Sent' | 'Draft' | 'Scheduled') => {
    switch (status) {
        case 'Sent': return 'bg-green-100 text-green-800';
        case 'Draft': return 'bg-gray-100 text-gray-800';
        case 'Scheduled': return 'bg-blue-100 text-blue-800';
    }
};

// --- Main Component ---
const CommunicationAndMarketing = () => {
    return (
        <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-50 p-4 sm:p-6">
            {/* --- Header --- */}
            <header className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#1A202C' }}>Communication</h1>
                <p className="text-base text-gray-500 mt-1">Engage your guests and drive loyalty with targeted email campaigns.</p>
            </header>

            {/* --- Analytics Overview --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-5 rounded-2xl shadow-lg border">
                    <p className="text-sm font-medium text-gray-500">Total Subscribers</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-4xl font-bold text-gray-800">1,842</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-lg border">
                    <p className="text-sm font-medium text-gray-500">Campaigns Sent (Last 30d)</p>
                    <p className="text-4xl font-bold text-gray-800 mt-1">3</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-lg border">
                     <p className="text-sm font-medium text-gray-500">Avg. Open Rate</p>
                     <p className="text-4xl font-bold text-gray-800 mt-1">31.8%</p>
                </div>
            </div>

            {/* --- Main Section --- */}
            <div className="flex flex-col xl:flex-row gap-6">
                {/* --- Left Column: Campaigns List --- */}
                <div className="w-full xl:w-2/3">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Campaigns</h3>
                        <button className="flex items-center gap-2 px-4 py-3 bg-navy-800 text-white rounded-xl font-semibold shadow hover:bg-navy-900 transition-colors" style={{ backgroundColor: '#1A202C' }}>
                            <PlusCircle size={18}/>
                            Create Campaign
                        </button>
                    </div>

                    <div className="space-y-4">
                        {mockCampaigns.map(campaign => (
                            <div key={campaign.id} className="bg-white p-4 rounded-2xl shadow-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                     <div className={`h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center ${getStatusColor(campaign.status)}`}>
                                        {campaign.status === 'Sent' && <Send size={20} />}
                                        {campaign.status === 'Draft' && <FileText size={20} />}
                                        {campaign.status === 'Scheduled' && <Mail size={20} />}
                                     </div>
                                     <div>
                                         <p className="font-bold text-lg text-gray-800">{campaign.name}</p>
                                         <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>{campaign.status}</span>
                                     </div>
                                </div>
                                
                                {campaign.status === 'Sent' ? (
                                    <div className="flex items-center gap-6 text-center w-full sm:w-auto">
                                        <div>
                                            <p className="text-sm text-gray-500">Recipients</p>
                                            <p className="font-semibold text-gray-800">{campaign.recipients}</p>
                                        </div>
                                         <div>
                                            <p className="text-sm text-gray-500">Open Rate</p>
                                            <p className="font-semibold text-gray-800">{campaign.openRate}%</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500">
                                       {campaign.status === 'Scheduled' ? `Scheduled for ${campaign.sentDate}` : 'Not sent yet'}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Right Column: Tools & Templates --- */}
                <div className="w-full xl:w-1/3">
                     <div className="bg-white p-6 rounded-2xl shadow-lg border">
                         <h3 className="text-xl font-bold text-gray-800 mb-4">Tools</h3>
                         <div className="space-y-3">
                             <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                <Users className="text-blue-600"/>
                                <span className="font-semibold text-gray-700">Manage Audiences</span>
                             </button>
                             <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                <FileText className="text-blue-600"/>
                                <span className="font-semibold text-gray-700">Edit Templates</span>
                             </button>
                             <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                <BarChart2 className="text-blue-600"/>
                                <span className="font-semibold text-gray-700">View Analytics</span>
                             </button>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default CommunicationAndMarketing;

