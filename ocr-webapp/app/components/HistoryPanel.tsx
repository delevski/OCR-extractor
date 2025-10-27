'use client';

import { motion } from 'framer-motion';

interface HistoryItem {
  id: number;
  fileName: string;
  timestamp: string;
  text: string;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export default function HistoryPanel({ history, onSelect }: HistoryPanelProps) {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Scan History
        </h2>
      </div>

      <div className="p-6">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500">No history yet</p>
            <p className="text-sm text-gray-400 mt-2">Upload your first file to get started</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelect(item)}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="font-medium text-gray-800 truncate">{item.fileName}</p>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
