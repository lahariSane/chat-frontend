import React from 'react';
import { format } from 'date-fns';

const ChatMessage = ({ message, sender, timestamp, isCurrentUser }) => {
  return (
    <div
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${isCurrentUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
          }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{sender}</span>
          <span className="text-xs opacity-70">
            {format(new Date(timestamp), 'HH:mm')}
          </span>
        </div>
        <p className="mt-1">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
