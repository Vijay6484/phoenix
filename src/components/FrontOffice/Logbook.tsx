import { useState, useEffect } from 'react';
import { Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { LogEntry } from '../../types';
import { dataStore } from '../../store/dataStore';

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-red-100 text-red-700',
};

export default function Logbook() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    setLogs(dataStore.getLogs());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newLog: LogEntry = {
      id: Date.now().toString(),
      message: newMessage,
      author: 'Current User',
      timestamp: new Date().toISOString(),
      status: 'open',
      priority,
    };

    dataStore.createLog(newLog);
    setLogs(dataStore.getLogs());
    setNewMessage('');
    setPriority('medium');
  };

  const toggleStatus = (logId: string, currentStatus: 'open' | 'resolved') => {
    const newStatus = currentStatus === 'open' ? 'resolved' : 'open';
    dataStore.updateLog(logId, { status: newStatus });
    setLogs(dataStore.getLogs());
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Staff Logbook</h1>
          <p className="text-gray-600 mt-1">Internal communication and task tracking</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="mb-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Add a note or task for the team..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Priority:</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Add Entry
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No log entries yet</p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={`bg-white rounded-lg border p-4 transition-all ${
                  log.status === 'resolved' ? 'border-gray-200 bg-gray-50' : 'border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">
                      {log.author.split(' ').map((n) => n[0]).join('').toUpperCase()}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">{log.author}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{formatTimestamp(log.timestamp)}</span>
                      {log.priority && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[log.priority]}`}>
                            {log.priority.toUpperCase()}
                          </span>
                        </>
                      )}
                    </div>

                    <p className={`text-gray-900 mb-3 ${log.status === 'resolved' ? 'line-through text-gray-500' : ''}`}>
                      {log.message}
                    </p>

                    <button
                      onClick={() => toggleStatus(log.id, log.status)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        log.status === 'open'
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {log.status === 'open' ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Mark as Resolved
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4" />
                          Reopen
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex-shrink-0">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        log.status === 'open' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {log.status === 'open' ? 'Open' : 'Resolved'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
