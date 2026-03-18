'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, CheckCircle2, Clock } from 'lucide-react';

const invitations = [
  {
    id: 1,
    eventTitle: 'Tech Summit 2026',
    date: 'Mar 15-17, 2026',
    venue: 'San Francisco Convention Center',
    topic: 'Future of AI in Enterprise',
    organizer: 'John Smith',
    bio: 'Join us for an exciting discussion on AI trends',
    status: 'accepted',
    speakers: 12,
    expectedAttendees: 500,
  },
  {
    id: 2,
    eventTitle: 'AI Conference',
    date: 'May 10-12, 2026',
    venue: 'Austin Convention Center',
    topic: 'Machine Learning Applications',
    organizer: 'Jane Doe',
    bio: 'Explore real-world ML implementations',
    status: 'pending',
    speakers: 8,
    expectedAttendees: 300,
  },
  {
    id: 3,
    eventTitle: 'Digital Innovation Forum',
    date: 'Jun 5-7, 2026',
    venue: 'New York Hilton',
    topic: 'Future Technologies',
    organizer: 'Bob Johnson',
    bio: 'Network with industry leaders',
    status: 'declined',
    speakers: 6,
    expectedAttendees: 400,
  },
];

export default function SpeakerInvitationsPage() {
  return (
    <DashboardLayout role="speaker" userName="Speaker User" userEmail="speaker@example.com">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Speaker Invitations</h1>
          <p className="text-slate-600 mt-2">Manage your speaking opportunities</p>
        </div>

        {/* Invitations */}
        <div className="space-y-6">
          {invitations.map((invitation) => (
            <Card key={invitation.id} className="p-6 border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{invitation.eventTitle}</h3>
                  <p className="text-sm text-slate-600 mt-1">Organized by {invitation.organizer}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  invitation.status === 'accepted'
                    ? 'bg-green-100 text-green-800'
                    : invitation.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-2">Event Details</p>
                  <p className="text-sm text-slate-600 flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    {invitation.date}
                  </p>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {invitation.venue}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-2">Speaking Topic</p>
                  <p className="text-sm font-semibold text-slate-900">{invitation.topic}</p>
                  <p className="text-xs text-slate-600 mt-2">{invitation.bio}</p>
                </div>
              </div>

              <div className="flex gap-4 mb-4 pb-4 border-b border-slate-200 text-sm text-slate-600">
                <p className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {invitation.speakers} speakers
                </p>
                <p className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {invitation.expectedAttendees} attendees
                </p>
              </div>

              {invitation.status === 'pending' && (
                <div className="flex gap-2">
                  <Button className="bg-green-600 hover:bg-green-700 gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Accept Invitation
                  </Button>
                  <Button variant="outline" className="text-red-600">
                    Decline
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
