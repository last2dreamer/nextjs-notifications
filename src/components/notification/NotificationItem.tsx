// src/components/notification/NotificationItem.tsx
"use client";

import { FC } from 'react';
import type { Notification } from '../../types/notification';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: number) => void;
}

export const NotificationItem: FC<NotificationItemProps> = ({ notification, onRead }) => {
  return (
    <div
      onClick={() => onRead(notification.id)}
      className={`bg-white rounded-lg shadow-md p-4 cursor-pointer 
                 transition-all duration-300 hover:shadow-lg hover:bg-gray-50
                 ${notification.read ? 'opacity-60' : 'opacity-100'}`}
    >
      <div className="flex justify-between items-center mb-2">
        <h5 className="font-semibold text-gray-800">{notification.title}</h5>
        <span className="text-xs text-gray-500 font-medium">
          {new Date(notification.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
    </div>
  );
};