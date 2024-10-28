// src/components/notification/NotificationHeader.tsx
"use client";

import { FC, useState, useEffect } from 'react';
import { Bell, BellOff, Check, X, Settings, User, Search, Menu } from 'lucide-react';
import { useWebSocket } from '../../hooks/useWebSocket';
import type { Notification, WebSocketMessage } from '../../types/notification';

export const NotificationHandler: FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleMessage = (data: WebSocketMessage) => {
    const newNotification: Notification = {
      id: Date.now(),
      title: data.title || 'New Notification',
      message: data.message,
      timestamp: new Date().toISOString(),
      read: false,
    //   type: data.type || 'info'
    };
    
    setNotifications(prev => {
      if (prev.some(n => n.message === newNotification.message)) {
        return prev;
      }
      return [newNotification, ...prev];
    });
  };

  const { isConnected, error: wsError, connect } = useWebSocket({
    url:  'ws://localhost:8080/ws?token=v2.local.1dTp0j1ZFtxC9eu9ZoDySCRDasa9BtFyc8vNdFhFXnossci6Q4NdHhNPYJ5pGl847YM2vmVWjj6uoHm5uq_ikQcE9yWQElISDshAisvGy1wSm2U2_chPo-Ge_VGJ_k1BhRRQjryjkc4ID15H52jujkII7ivaUqAJsHF1mVWVLkRLGXINu1neJMZNUYzgu8pxWNfXBW55vsugYc7RzoFgqgbTmXcTm9nw2zkhpf02lsszetuRNdJHhwd-bSU7lE6LVYeKO055GSs.bnVsbA',
    onMessage: handleMessage
  });

  useEffect(() => {
    const token = 'v2.local.1dTp0j1ZFtxC9eu9ZoDySCRDasa9BtFyc8vNdFhFXnossci6Q4NdHhNPYJ5pGl847YM2vmVWjj6uoHm5uq_ikQcE9yWQElISDshAisvGy1wSm2U2_chPo-Ge_VGJ_k1BhRRQjryjkc4ID15H52jujkII7ivaUqAJsHF1mVWVLkRLGXINu1neJMZNUYzgu8pxWNfXBW55vsugYc7RzoFgqgbTmXcTm9nw2zkhpf02lsszetuRNdJHhwd-bSU7lE6LVYeKO055GSs.bnVsbA';
    if (token) {
      connect(token);
    } else {
      setError('No authentication token found');
    }
  }, [connect]);

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' || (filter === 'unread' && !n.read)
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  if (typeof window === 'undefined') return null;

  return (
    <>
      {/* Full-width Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-[1920px] mx-auto">
          <div className="h-16 px-4 flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Menu className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700" />
              <h1 className="text-xl font-semibold text-gray-800">Your App Name</h1>
            </div>

            {/* Center Section - Search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {isConnected ? (
                    <Bell className="h-6 w-6 text-gray-700" />
                  ) : (
                    <BellOff className="h-6 w-6 text-gray-400" />
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-100">
                      <div className="flex items-center justify-between p-4">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center gap-2">
                          <Settings className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                          <X 
                            className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer"
                            onClick={() => setIsOpen(false)}
                          />
                        </div>
                      </div>

                      {/* Filters and Actions */}
                      <div className="flex items-center justify-between px-4 pb-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setFilter('all')}
                            className={`text-sm px-3 py-1 rounded-full ${
                              filter === 'all'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            All
                          </button>
                          <button
                            onClick={() => setFilter('unread')}
                            className={`text-sm px-3 py-1 rounded-full ${
                              filter === 'unread'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            Unread
                          </button>
                        </div>
                        {notifications.length > 0 && (
                          <div className="flex gap-2">
                            <button
                              onClick={markAllAsRead}
                              className="text-sm text-gray-600 hover:text-gray-800"
                            >
                              Mark all read
                            </button>
                            <button
                              onClick={clearAll}
                              className="text-sm text-gray-600 hover:text-gray-800"
                            >
                              Clear all
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Error Message */}
                    {(error || wsError) && (
                      <div className="bg-red-50 p-3 border-b border-red-100">
                        <p className="text-sm text-red-600">{error || wsError}</p>
                      </div>
                    )}

                    {/* Notifications List */}
                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                      {filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                          <Bell className="h-12 w-12 text-gray-300 mb-3" />
                          <p className="text-gray-500 text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {filteredNotifications.map(notification => (
                            <div
                              key={notification.id}
                              onClick={() => markAsRead(notification.id)}
                              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative ${
                                notification.read ? 'opacity-75' : ''
                              }`}
                            >
                              {!notification.read && (
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                              )}
                              <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0 pl-2">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notification.timestamp).toLocaleString()}
                                  </p>
                                </div>
                                {notification.read && (
                                  <Check className="h-4 w-4 text-blue-500 ml-2 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100">
                <User className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16" />
    </>
  );
};

export default NotificationHandler;