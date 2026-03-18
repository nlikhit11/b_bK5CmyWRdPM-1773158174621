'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Calendar, MapPin, Users, Ticket, CheckCircle2, Clock, AlertCircle, Home } from 'lucide-react';

interface Registration {
  id: number;
  eventTitle: string;
  date: string;
  venue: string;
  speakers: number;
  status: 'registered' | 'checked_in' | 'completed';
  eventStatus: 'upcoming' | 'ongoing' | 'completed';
  registeredDate: string;
  travelFormStatus: 'pending' | 'submitted' | 'approved';
  accommodationStatus: 'pending' | 'approved' | 'not_required' | 'not_requested';
}

const registrations: Registration[] = [
  {
    id: 1,
    eventTitle: 'Tech Summit 2026',
    date: 'Mar 15-17, 2026',
    venue: 'San Francisco Convention Center',
    speakers: 12,
    status: 'registered',
    eventStatus: 'upcoming',
    registeredDate: '2026-03-01',
    travelFormStatus: 'pending',
    accommodationStatus: 'pending',
  },
  {
    id: 2,
    eventTitle: 'AI Conference',
    date: 'May 10-12, 2026',
    venue: 'Austin Convention Center',
    speakers: 8,
    status: 'registered',
    eventStatus: 'upcoming',
    registeredDate: '2026-03-02',
    travelFormStatus: 'submitted',
    accommodationStatus: 'not_requested',
  },
];

export default function AttendeeDashboard() {
  const pendingActions = registrations.filter(
    (r) => r.eventStatus === 'upcoming' && (r.travelFormStatus === 'pending' || r.accommodationStatus === 'pending')
  );

  return (
    <DashboardLayout role="attendee" userName="Attendee User" userEmail="attendee@example.com">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Attendee Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage your conference registrations</p>
        </div>

        {/* Pending Actions Alert */}
        {pendingActions.length > 0 && (
          <Card className="p-4 border-yellow-200 bg-yellow-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">Action Required</p>
                <p className="text-sm text-yellow-700 mt-1">
                  You have pending forms to complete for {pendingActions.length} event(s). 
                  Please complete your travel and accommodation forms before the event.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Registered Events</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{registrations.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Upcoming Events</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {registrations.filter(r => r.eventStatus === 'upcoming').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending Forms</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{pendingActions.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </Card>
        </div>

        {/* My Registrations */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">My Registrations</h2>
          <div className="space-y-4">
            {registrations.map((registration) => (
              <Card key={registration.id} className="p-6 border-slate-200">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{registration.eventTitle}</h3>
                      <Badge className={
                        registration.eventStatus === 'upcoming' 
                          ? 'bg-blue-100 text-blue-800' 
                          : registration.eventStatus === 'ongoing'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }>
                        {registration.eventStatus.charAt(0).toUpperCase() + registration.eventStatus.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">Registered on {registration.registeredDate}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {registration.date}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {registration.venue}
                      </p>
                      <p className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {registration.speakers} speakers
                      </p>
                    </div>
                  </div>

                  {/* Status Cards */}
                  <div className="flex flex-wrap gap-3 lg:flex-col lg:items-end">
                    {/* Registration Status */}
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Registered
                      </span>
                    </div>

                    {/* Travel Form Status */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        registration.travelFormStatus === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : registration.travelFormStatus === 'submitted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {registration.travelFormStatus === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {registration.travelFormStatus === 'submitted' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {registration.travelFormStatus === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        Travel: {registration.travelFormStatus}
                      </span>
                    </div>

                    {/* Accommodation Status */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        registration.accommodationStatus === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : registration.accommodationStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <Home className="w-3 h-3 mr-1" />
                        Accommodation: {registration.accommodationStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-slate-200">
                  {registration.eventStatus !== 'completed' && (
                    <>
                      {registration.travelFormStatus === 'pending' && (
                        <Link href="/attendee/travel">
                          <Button size="sm" className="gap-1">
                            <Clock className="w-3 h-3" />
                            Complete Travel Form
                          </Button>
                        </Link>
                      )}
                      {registration.accommodationStatus === 'pending' || registration.accommodationStatus === 'not_requested' ? (
                        <Link href="/attendee/accommodation">
                          <Button size="sm" variant={registration.accommodationStatus === 'pending' ? 'default' : 'outline'} className="gap-1">
                            <Home className="w-3 h-3" />
                            {registration.accommodationStatus === 'pending' ? 'View Accommodation' : 'Request Accommodation'}
                          </Button>
                        </Link>
                      ) : null}
                    </>
                  )}
                  <Link href="/attendee/pass">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Ticket className="w-4 h-4" />
                      View Pass
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/attendee/conferences">
            <Button variant="outline" className="w-full">
              Browse All Events
            </Button>
          </Link>
          <Link href="/attendee/accommodation">
            <Button variant="outline" className="w-full">
              My Accommodation
            </Button>
          </Link>
          <Link href="/attendee/pass">
            <Button variant="outline" className="w-full">
              View QR Pass
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
