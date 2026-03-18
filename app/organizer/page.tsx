'use client';

import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, Users, Clock, TrendingUp, ArrowRight, Settings, UserCheck } from 'lucide-react';

const alerts = [
  {
    id: 1,
    type: 'capacity',
    message: 'Registration for Tech Summit 2026 exceeds room capacity by 50 attendees',
    event: 'Tech Summit 2026',
    severity: 'warning',
  },
  {
    id: 2,
    type: 'accommodation',
    message: '3 speakers still need accommodation confirmation',
    event: 'AI Conference',
    severity: 'info',
  },
  {
    id: 3,
    type: 'inventory',
    message: 'Goodies inventory: T-shirts low in stock',
    event: 'Digital Forum',
    severity: 'warning',
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Tech Summit 2026',
    date: 'Mar 15-17, 2026',
    attendees: 550,
    speakers: 12,
    status: 'pending_approval',
    progress: 75,
    eventStatus: 'upcoming',
  },
  {
    id: 2,
    title: 'AI Conference',
    date: 'May 10-12, 2026',
    attendees: 320,
    speakers: 8,
    status: 'pending_approval',
    progress: 60,
    eventStatus: 'upcoming',
  },
  {
    id: 3,
    title: 'Digital Forum',
    date: 'Apr 5-7, 2026',
    attendees: 400,
    speakers: 6,
    status: 'approved',
    progress: 90,
    eventStatus: 'upcoming',
  },
];

const metrics = [
  { label: 'Upcoming Events', value: '3', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
  { label: 'Total Attendees', value: '1,270', icon: Users, color: 'bg-purple-100 text-purple-600' },
  { label: 'Confirmed Speakers', value: '18', icon: Users, color: 'bg-green-100 text-green-600' },
  { label: 'Pending Approvals', value: '2', icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
];

export default function OrganizerDashboard() {
  return (
    <DashboardLayout role="organizer" userName="Organizer User" userEmail="organizer@example.com">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Organizer Dashboard</h1>
            <p className="text-slate-600 mt-2">Manage your conferences and events</p>
          </div>
          <Link href="/organizer/create">
            <Button size="lg" className="gap-2">
              <Calendar className="w-5 h-5" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="p-6 border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{metric.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{metric.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${metric.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card className="border-slate-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Smart Alerts
              </h2>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      alert.severity === 'warning'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <p className={`text-sm font-medium ${alert.severity === 'warning' ? 'text-yellow-900' : 'text-blue-900'}`}>
                      {alert.message}
                    </p>
                    <p className={`text-xs mt-1 ${alert.severity === 'warning' ? 'text-yellow-700' : 'text-blue-700'}`}>
                      Event: {alert.event}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Upcoming Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Upcoming Events</h2>
            <Link href="/organizer/events">
              <Button variant="outline" size="sm">
                View All Events
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="p-6 border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{event.date}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status === 'approved' ? 'Approved' : 'Pending'}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {event.eventStatus.charAt(0).toUpperCase() + event.eventStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Users className="w-4 h-4" />
                      {event.attendees} attendees
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Users className="w-4 h-4" />
                      {event.speakers} speakers
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-600">Event Setup Progress</span>
                      <span className="text-xs font-semibold text-slate-900">{event.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                        style={{ width: `${event.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <Link href="/organizer/events" className="flex-1">
                    <Button variant="outline" className="w-full gap-2">
                      <Settings className="w-4 h-4" />
                      Manage
                    </Button>
                  </Link>
                  <Link href="/organizer/speakers" className="flex-1">
                    <Button variant="ghost" className="w-full gap-2">
                      <UserCheck className="w-4 h-4" />
                      Speakers
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/organizer/attendees">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Users className="w-5 h-5" />
                <span className="text-sm">Manage Attendees</span>
              </Button>
            </Link>
            <Link href="/organizer/speakers">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <UserCheck className="w-5 h-5" />
                <span className="text-sm">Manage Speakers</span>
              </Button>
            </Link>
            <Link href="/organizer/queries">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">View Queries</span>
              </Button>
            </Link>
            <Link href="/organizer/goodies">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">Request Goodies</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
