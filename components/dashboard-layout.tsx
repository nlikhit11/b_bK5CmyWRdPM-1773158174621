'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Search,
  Settings,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserRole } from '@/lib/types';

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
  userName: string;
  userEmail: string;
}

const navigationItems: Record<UserRole, Array<{ label: string; href: string; icon: ReactNode }>> = {
  admin: [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Event Approvals', href: '/admin/approvals', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Speaker Approvals', href: '/admin/speakers', icon: <User className="w-5 h-5" /> },
    { label: 'Room Requests', href: '/admin/rooms', icon: <Settings className="w-5 h-5" /> },
    { label: 'Goodies', href: '/admin/goodies', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Conferences', href: '/admin/conferences', icon: <Calendar className="w-5 h-5" /> },
  ],
  organizer: [
    { label: 'Dashboard', href: '/organizer', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Create Event', href: '/organizer/create', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Manage Events', href: '/organizer/events', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Speakers', href: '/organizer/speakers', icon: <User className="w-5 h-5" /> },
    { label: 'Attendees', href: '/organizer/attendees', icon: <User className="w-5 h-5" /> },
    { label: 'Queries', href: '/organizer/queries', icon: <Bell className="w-5 h-5" /> },
    { label: 'Goodies', href: '/organizer/goodies', icon: <Settings className="w-5 h-5" /> },
    { label: 'Accommodation', href: '/organizer/accommodation', icon: <Settings className="w-5 h-5" /> },
  ],
  speaker: [
    { label: 'Dashboard', href: '/speaker', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Invitations', href: '/speaker/invitations', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Travel', href: '/speaker/travel', icon: <Settings className="w-5 h-5" /> },
    { label: 'Accommodation', href: '/speaker/accommodation', icon: <Settings className="w-5 h-5" /> },
    { label: 'Queries', href: '/speaker/queries', icon: <Bell className="w-5 h-5" /> },
    { label: 'QR Pass', href: '/speaker/pass', icon: <BarChart3 className="w-5 h-5" /> },
  ], // Guest Speaker navigation
  paper_presenter: [
    { label: 'Dashboard', href: '/paper-presenter', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Submit Paper', href: '/paper-presenter/submit', icon: <Calendar className="w-5 h-5" /> },
    { label: 'My Submissions', href: '/paper-presenter/submissions', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Accommodation', href: '/paper-presenter/accommodation', icon: <Settings className="w-5 h-5" /> },
    { label: 'Queries', href: '/paper-presenter/queries', icon: <Bell className="w-5 h-5" /> },
    { label: 'QR Pass', href: '/paper-presenter/pass', icon: <BarChart3 className="w-5 h-5" /> },
  ],
  attendee: [
    { label: 'Dashboard', href: '/attendee', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Conferences', href: '/attendee/conferences', icon: <Calendar className="w-5 h-5" /> },
    { label: 'My Registrations', href: '/attendee/registrations', icon: <User className="w-5 h-5" /> },
    { label: 'Travel Request', href: '/attendee/travel', icon: <Settings className="w-5 h-5" /> },
    { label: 'Accommodation', href: '/attendee/accommodation', icon: <Settings className="w-5 h-5" /> },
    { label: 'Queries', href: '/attendee/queries', icon: <Bell className="w-5 h-5" /> },
    { label: 'QR Pass', href: '/attendee/pass', icon: <BarChart3 className="w-5 h-5" /> },
  ],
};

export function DashboardLayout({
  children,
  role,
  userName,
  userEmail,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const items = navigationItems[role];

  const handleLogout = async () => {
    // Call logout API
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 transition-all duration-300 flex flex-col fixed h-screen left-0 top-0 z-40`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                CE
              </div>
              <span className="font-semibold text-slate-900 text-sm">ConferenceHub</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-slate-600" />
            ) : (
              <Menu className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors group">
                <span className="text-slate-500 group-hover:text-indigo-600 transition-colors">
                  {item.icon}
                </span>
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-slate-700 hover:text-red-600 transition-colors group"
          >
            <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-600 transition-colors" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 flex flex-col`}>
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search conferences, events..."
                  className="pl-10 bg-slate-50 border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4 ml-8">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors group">
                <Bell className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors group">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-sm font-medium text-slate-900">{userName}</div>
                      <div className="text-xs text-slate-500">{role}</div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
