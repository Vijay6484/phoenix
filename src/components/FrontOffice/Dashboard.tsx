import { useState, useEffect } from 'react';
import { MoreVertical, Calendar } from 'lucide-react';
import { Room, RoomStatus } from '../../types';
import { dataStore } from '../../store/dataStore';

const statusConfig: Record<RoomStatus, { label: string; color: string; bgColor: string }> = {
  occupied: { label: 'In-House', color: 'text-green-700', bgColor: 'bg-green-100' },
  arriving: { label: 'Arriving', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  departing: { label: 'Departing', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  dirty: { label: 'Dirty', color: 'text-red-700', bgColor: 'bg-red-100' },
  available: { label: 'Clean', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  maintenance: { label: 'Maintenance', color: 'text-purple-700', bgColor: 'bg-purple-100' },
};

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  useEffect(() => {
    setRooms(dataStore.getRooms());
  }, []);

  const groupedRooms = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<number, Room[]>);

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Room Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time overview of all rooms</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = rooms.filter(r => r.status === status).length;
            return (
              <div key={status} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className={`text-2xl font-bold ${config.color}`}>{count}</div>
                <div className="text-sm text-gray-600 mt-1">{config.label}</div>
              </div>
            );
          })}
        </div>

        {Object.entries(groupedRooms).sort(([a], [b]) => Number(a) - Number(b)).map(([floor, floorRooms]) => (
          <div key={floor} className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Floor {floor}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {floorRooms.map((room) => {
                const config = statusConfig[room.status];
                const isHovered = hoveredRoom === room.id;

                return (
                  <div
                    key={room.id}
                    className={`bg-white rounded-lg border-2 p-4 transition-all duration-200 cursor-pointer ${
                      isHovered ? 'shadow-lg -translate-y-1 border-blue-500' : 'shadow border-gray-200'
                    }`}
                    onMouseEnter={() => setHoveredRoom(room.id)}
                    onMouseLeave={() => setHoveredRoom(null)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{room.roomNumber}</div>
                        <div className="text-sm text-gray-600">{room.roomType}</div>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color}`}>
                      {config.label}
                    </div>

                    {room.guestName && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-sm font-medium text-gray-900">{room.guestName}</div>
                        {isHovered && room.checkIn && room.checkOut && (
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(room.checkIn).toLocaleDateString()} - {new Date(room.checkOut).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
