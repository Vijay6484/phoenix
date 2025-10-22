import { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Users, Mail, Phone, Building } from 'lucide-react';
import { GroupBlock } from '../../types';
import { dataStore } from '../../store/dataStore';

export default function Groups() {
  const [groups, setGroups] = useState<GroupBlock[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<GroupBlock | null>(null);

  useEffect(() => {
    setGroups(dataStore.getGroups());
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-50 p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <header>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#1A202C' }}>Group Bookings</h1>
          <p className="text-base text-gray-500 mt-1">Manage block bookings for events</p>
        </header>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Group
        </button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by group name or contact person..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="bg-white px-4 py-3 rounded-xl border border-gray-200">
          <span className="text-gray-900 font-semibold">{filteredGroups.length} Groups</span>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGroups.length === 0 ? (
            <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No group bookings found</p>
            </div>
          ) : (
            filteredGroups.map((group) => {
              const progressPercentage = (group.assignedRooms / group.totalRooms) * 100;
              const balance = group.totalAmount - group.paidAmount;

              return (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{group.name}</h3>
                      <p className="text-gray-600">{group.contactPerson}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{group.assignedRooms}/{group.totalRooms}</div>
                      <div className="text-sm text-gray-500">rooms</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(group.checkIn).toLocaleDateString()} - {new Date(group.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{group.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{group.contactPhone}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Room Assignment Progress</span>
                      <span className="text-gray-900 font-medium">{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div>
                      <div className="text-sm text-gray-600">Total Amount</div>
                      <div className="text-lg font-bold text-gray-900">₹{group.totalAmount.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Balance Due</div>
                      <div className={`text-lg font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{balance.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {group.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-600 italic">{group.notes}</div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      {selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedGroup.name}</h2>
                <p className="text-gray-600 mt-1">Group Details</p>
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{selectedGroup.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{selectedGroup.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{selectedGroup.contactPhone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Check-In</div>
                    <div className="font-medium text-gray-900">{new Date(selectedGroup.checkIn).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Check-Out</div>
                    <div className="font-medium text-gray-900">{new Date(selectedGroup.checkOut).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Rooms</div>
                    <div className="font-medium text-gray-900">{selectedGroup.totalRooms}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Assigned Rooms</div>
                    <div className="font-medium text-gray-900">{selectedGroup.assignedRooms}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Financial Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-medium text-gray-900">₹{selectedGroup.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid Amount</span>
                    <span className="font-medium text-gray-900">₹{selectedGroup.paidAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-900 font-semibold">Balance Due</span>
                    <span className={`font-bold ${selectedGroup.totalAmount - selectedGroup.paidAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{(selectedGroup.totalAmount - selectedGroup.paidAmount).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {selectedGroup.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-gray-700">{selectedGroup.notes}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Linked Reservations</h3>
                <p className="text-sm text-gray-600">{selectedGroup.reservationIds.length} reservations linked to this group</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Edit Group
              </button>
              <button
                onClick={() => setSelectedGroup(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
