'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, Users, Calendar, CheckCircle, Clock, ArrowRight, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface Conference {
  id: string;
  name: string;
  date: string;
  venue: string;
  speakers?: number;
  expectedAttendees?: number;
  description?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrationDeadline?: string;
  registrationOpen: boolean;
}

interface UserRegistration {
  conferenceId: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  travelFormPending: boolean;
}

const mockConferences: Conference[] = [
  {
    id: '1',
    name: 'Tech Summit 2026',
    date: 'Mar 15-17, 2026',
    venue: 'San Francisco, CA',
    speakers: 12,
    expectedAttendees: 500,
    status: 'upcoming',
    description: 'Join industry leaders for discussions on cutting-edge technology trends.',
    registrationDeadline: '2026-03-10',
    registrationOpen: true,
  },
  {
    id: '2',
    name: 'AI Conference',
    date: 'May 10-12, 2026',
    venue: 'Austin, TX',
    speakers: 8,
    expectedAttendees: 300,
    status: 'upcoming',
    description: 'Explore the latest in artificial intelligence and machine learning.',
    registrationDeadline: '2026-05-05',
    registrationOpen: true,
  },
  {
    id: '3',
    name: 'Digital Innovation Forum',
    date: 'Jun 5-7, 2026',
    venue: 'New York, NY',
    speakers: 6,
    expectedAttendees: 400,
    status: 'upcoming',
    description: 'Network with innovators and discover digital transformation strategies.',
    registrationDeadline: '2026-06-01',
    registrationOpen: true,
  },
  {
    id: '4',
    name: 'Cloud Computing Summit',
    date: 'Jul 15-17, 2026',
    venue: 'Seattle, WA',
    speakers: 10,
    expectedAttendees: 350,
    status: 'upcoming',
    description: 'Learn about cloud infrastructure and scalable architecture patterns.',
    registrationDeadline: '2026-07-10',
    registrationOpen: true,
  },
  {
    id: '5',
    name: 'Digital Forum 2025',
    date: 'Dec 10-12, 2025',
    venue: 'Chicago, IL',
    speakers: 8,
    expectedAttendees: 280,
    status: 'completed',
    description: 'A past conference on digital transformation.',
    registrationOpen: false,
  },
];

export default function AttendeeConferencesPage() {
  const router = useRouter();
  const [conferences] = useState<Conference[]>(mockConferences);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const [registrations, setRegistrations] = useState<Record<string, UserRegistration>>({
    '1': { conferenceId: '1', status: 'approved', registeredAt: '2026-02-01', travelFormPending: true },
  });
  const [selectedConference, setSelectedConference] = useState<string | null>(null);

  const filtered = conferences.filter((conference) => {
    const matchesSearch =
      conference.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conference.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || conference.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRegister = (conferenceId: string) => {
    const isAlreadyRegistered = !!registrations[conferenceId];
    if (isAlreadyRegistered) {
      toast.error('You have already registered for this conference');
      return;
    }

    const conference = conferences.find((c) => c.id === conferenceId);
    if (!conference) return;

    // Check if registration is open
    if (!conference.registrationOpen || conference.status === 'completed') {
      toast.error('Registration is closed for this conference');
      return;
    }
    
    const params = new URLSearchParams({
      conferenceId: conference.id,
      conferenceName: conference.name,
      conferenceDate: conference.date,
    });
    router.push(`/attendee/registrations?${params.toString()}`);
  };

  const isRegistered = (conferenceId: string) => !!registrations[conferenceId];
  const isTravelFormPending = (conferenceId: string) =>
    registrations[conferenceId]?.travelFormPending ?? false;

  const getStatusBadge = (conference: Conference) => {
    switch (conference.status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Upcoming</Badge>;
      case 'ongoing':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ongoing</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Completed</Badge>;
      default:
        return null;
    }
  };

  const canRegister = (conference: Conference) => {
    return conference.registrationOpen && conference.status !== 'completed';
  };

  return (
    <DashboardLayout role="attendee" userName="Attendee User" userEmail="attendee@example.com">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Conferences</h1>
          <p className="text-slate-600 mt-2">Browse and register for conferences. After registration, complete your travel form.</p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search conferences..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="w-full sm:w-48">
              <label className="text-sm text-slate-600 block mb-1">Conference Status</label>
              <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conferences</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Conferences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((conference) => {
            const isReg = isRegistered(conference.id);
            const travelPending = isTravelFormPending(conference.id);
            const registrationAllowed = canRegister(conference);

            return (
              <Card
                key={conference.id}
                className={`p-6 border-slate-200 hover:shadow-lg transition-shadow flex flex-col ${
                  isReg ? 'border-blue-200 bg-blue-50/50' : ''
                } ${conference.status === 'completed' ? 'opacity-75' : ''}`}
              >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">{conference.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{conference.description}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    {getStatusBadge(conference)}
                    {!registrationAllowed && conference.status !== 'completed' && (
                      <Badge variant="outline" className="text-xs text-red-600 border-red-200">
                        <Lock className="w-3 h-3 mr-1" />
                        Closed
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-6 flex-1 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {conference.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {conference.venue}
                  </p>
                  {conference.speakers && (
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {conference.speakers} speakers • {conference.expectedAttendees} attendees
                    </p>
                  )}
                  {conference.registrationDeadline && conference.status !== 'completed' && (
                    <p className="text-xs text-slate-500 mt-2">
                      Registration deadline: {new Date(conference.registrationDeadline).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Registration Status */}
                {isReg && (
                  <div className="mb-4 p-3 bg-blue-100 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <p className="text-sm font-medium text-blue-900">Registered</p>
                    </div>
                    {travelPending && conference.status !== 'completed' && (
                      <div className="flex items-center gap-2 text-xs text-orange-700 bg-orange-50 p-2 rounded">
                        <Clock className="w-3 h-3" />
                        <span>Travel form pending</span>
                      </div>
                    )}
                  </div>
                )}

                {/* CTA */}
                <div className="pt-4 border-t border-slate-200">
                  {isReg ? (
                    <>
                      {travelPending && conference.status !== 'completed' ? (
                        <Button
                          onClick={() => {
                            router.push('/attendee/travel');
                          }}
                          className="w-full gap-2 bg-orange-600 hover:bg-orange-700"
                        >
                          Fill Travel Form
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      ) : conference.status === 'completed' ? (
                        <Button disabled className="w-full" variant="outline">
                          Event Completed
                        </Button>
                      ) : (
                        <Button disabled className="w-full" variant="outline">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          All Forms Complete
                        </Button>
                      )}
                    </>
                  ) : conference.status === 'completed' ? (
                    <Button disabled className="w-full" variant="outline">
                      <Lock className="w-4 h-4 mr-2" />
                      Registration Closed
                    </Button>
                  ) : registrationAllowed ? (
                    <Button
                      onClick={() => setSelectedConference(conference.id)}
                      className="w-full"
                    >
                      Register Now
                    </Button>
                  ) : (
                    <Button disabled className="w-full" variant="outline">
                      <Lock className="w-4 h-4 mr-2" />
                      Registration Closed
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <Card className="p-12 text-center border-slate-200">
            <p className="text-slate-500">No conferences found matching your search</p>
          </Card>
        )}
      </div>

      {/* Registration Modal */}
      {selectedConference && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6 border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              {conferences.find((c) => c.id === selectedConference)?.name}
            </h2>

            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Click the button below to proceed to the registration form for this conference.
              </p>
              
              <div className="flex gap-2 pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedConference(null)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 gap-2"
                  onClick={() => {
                    if (selectedConference) {
                      handleRegister(selectedConference);
                    }
                  }}
                >
                  <ArrowRight className="w-4 h-4" />
                  Proceed to Registration
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
