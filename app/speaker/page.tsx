'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Users, CheckCircle2, AlertCircle } from 'lucide-react';

const invitations = [
  {
    id: 1,
    eventTitle: 'Tech Summit 2026',
    date: 'Mar 15-17, 2026',
    venue: 'San Francisco Convention Center',
    topic: 'Future of AI',
    status: 'accepted',
  },
  {
    id: 2,
    eventTitle: 'AI Conference',
    date: 'May 10-12, 2026',
    venue: 'Austin Convention Center',
    topic: 'Machine Learning Applications',
    status: 'pending',
  },
];

const accommodations = [
  {
    id: 1,
    eventTitle: 'Tech Summit 2026',
    hotelName: 'Grand Plaza Hotel',
    address: '123 Main St, San Francisco, CA',
    checkIn: '2026-03-14',
    checkOut: '2026-03-18',
  },
];

export default function SpeakerDashboard() {
  return (
    <DashboardLayout role="speaker" userName="Speaker User" userEmail="speaker@example.com">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Speaker Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage your speaking engagements</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Speaking Events</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">2</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Invitations</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">1 Pending</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Hotels Booked</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">1</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
            </div>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Speaking Events</h2>
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <Card key={invitation.id} className="p-6 border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{invitation.eventTitle}</h3>
                    <p className="text-sm text-slate-600 mt-1">Topic: {invitation.topic}</p>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {invitation.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {invitation.venue}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    invitation.status === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {invitation.status === 'accepted' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Confirmed
                      </>
                    ) : (
                      'Pending Response'
                    )}
                  </span>
                  {invitation.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-green-600">
                        Accept
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Accommodation */}
        {accommodations.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Accommodations</h2>
            <div className="space-y-4">
              {accommodations.map((acc) => (
                <Card key={acc.id} className="p-6 border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Event</p>
                      <p className="text-lg font-semibold text-slate-900">{acc.eventTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Hotel</p>
                      <p className="text-lg font-semibold text-slate-900">{acc.hotelName}</p>
                      <p className="text-sm text-slate-500">{acc.address}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-8 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Check-in: {acc.checkIn}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Check-out: {acc.checkOut}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/speaker/invitations">
            <Button variant="outline" className="w-full">
              View All Invitations
            </Button>
          </Link>
          <Link href="/speaker/travel">
            <Button variant="outline" className="w-full">
              Request Travel
            </Button>
          </Link>
          <Link href="/speaker/pass">
            <Button variant="outline" className="w-full">
              View QR Pass
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
