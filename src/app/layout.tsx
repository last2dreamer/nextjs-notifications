// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NotificationHandler } from "@/components/notification/NotificationHandler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Your App Name",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200">
            <div className="p-4">
              <h1 className="text-xl font-bold text-gray-800">Your App Name</h1>
            </div>
            <nav className="mt-4">
              <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                Dashboard
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                Projects
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                Settings
              </a>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Navigation */}
            <header className="bg-white border-b border-gray-200">
              <div className="flex items-center justify-between px-6 h-16">
                {/* Search */}
                <div className="flex-1 max-w-lg">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Notification Component */}
                <div className="ml-4">
                  <NotificationHandler />
                </div>
              </div>
            </header>

            {/* Page Content */}
            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}