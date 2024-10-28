// src/components/notification/NotificationWrapper.tsx
"use client";

import dynamic from 'next/dynamic';

const NotificationHandler = dynamic(
  () => import('./NotificationHandler').then(mod => mod.NotificationHandler),
  { ssr: false }
);

export function NotificationWrapper() {
  return <NotificationHandler />;
}