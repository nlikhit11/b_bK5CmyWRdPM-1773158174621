'use client';

import { useState } from 'react';
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
import { Search, Mail, Trash2, Send, ExternalLink, Filter, X } from 'lucide-react';
import { toast } from 'sonner';

interface Speaker {
  id: number;
  name: string;
  email: string;
  event: string;
  eventStatus: 'upcoming' | 'ongoing' | 'completed';
  topic: string;
  invitationStatus: 'pending' | 'accepted' | 'rejected';
  accommodationRequired: boolean;
  profileUrl?: string;
}

const mockSpeakers: Speaker[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    email: 'sarah@example.com',
    event: 'Tech Summit 2026',
    eventStatus: 'upcoming',
    topic: 'Future of AI',
    invitationStatus: 'accepted',
    accommodationRequired: true,
    profileUrl: 'https://example.com/speakers/sarah-johnson',
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    email: 'michael@example.com',
    event: 'AI Conference',
    eventStatus: 'upcoming',
    topic: 'Machine Learning',
    invitationStatus: 'pending',
    accommodationRequired: true,
    profileUrl: 'https://example.com/speakers/michael-chen',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    event: 'Tech Summit 2026',
    eventStatus: 'upcoming',
    topic: 'Startup Ecosystem',
    invitationStatus: 'rejected',
    accommodationRequired: false,
    profileUrl: 'https://example.com/speakers/emily-rodriguez',
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    email: 'james@example.com',
    event: 'Digital Forum 2025',
    eventStatus: 'completed',
    topic: 'Digital Transformation',
    invitationStatus: 'accepted',
    accommodationRequired: true,
    profileUrl: 'https://example.com/speakers/james-wilson',
  },
  {
    id: 5,
    name: 'Lisa Park',
    email: 'lisa@example.com',
    event: 'Cloud Summit 2025',
    eventStatus: 'completed',
    topic: 'Cloud Architecture',
    invitationStatus: 'accepted',
    accommodationRequired: false,
    profileUrl: 'https://example.com/speakers/lisa-park',
  },
];

export default function OrganizerSpeakersPage() {
  const [speakers, setSpeakers] = useState(mockSpeakers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [filterEvent, setFilterEvent] = useState<string>('all');
  const [filterEventStatus, setFilterEventStatus] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique events for filter dropdown
  const uniqueEvents = Array.from(new Set(speakers.map((s) => s.event)));

  const filtered = speakers.filter((speaker) => {
    const matchesSearch =
      speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      speaker.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      speaker.event.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || speaker.invitationStatus === filterStatus;
    const matchesEvent = filterEvent === 'all' || speaker.event === filterEvent;
    const matchesEventStatus = filterEventStatus === 'all' || speaker.eventStatus === filterEventStatus;
    return matchesSearch && matchesStatus && matchesEvent && matchesEventStatus;
  });

  const handleSendInvitation = (speaker: Speaker) => {
    toast.success(`Invitation sent to ${speaker.name}`);
  };

  const handleRemoveSpeaker = (id: number) => {
    setSpeakers(speakers.filter((s) => s.id !== id));
    toast.success('Speaker removed');
  };

  const clearFilters = () => {
    setFilterStatus('all');
    setFilterEvent('all');
    setFilterEventStatus('all');
    setSearchQuery('');
  };

  const hasActiveFilters = filterStatus !== 'all' || filterEvent !== 'all' || filterEventStatus !== 'all';

  const getEventStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  // Summary counts
  const upcomingCount = speakers.filter(s => s.eventStatus === 'upcoming').length;
  const completedCount = speakers.filter(s => s.eventStatus === 'completed').length;

  return (
    <DashboardLayout role="organizer" userName="Organizer User" userEmail="organizer@example.com">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manage Speakers</h1>
            <p className="text-slate-600 mt-2">Track speaker invitations and confirmations</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            )}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-slate-200">
            <p className="text-sm text-slate-600">Total Speakers</p>
            <p className="text-2xl font-bold text-slate-900">{speakers.length}</p>
          </Card>
          <Card className="p-4 border-slate-200">
            <p className="text-sm text-slate-600">Upcoming Events</p>
            <p className="text-2xl font-bold text-blue-600">{upcomingCount}</p>
          </Card>
          <Card className="p-4 border-slate-200">
            <p className="text-sm text-slate-600">Completed Events</p>
            <p className="text-2xl font-bold text-gray-600">{completedCount}</p>
          </Card>
          <Card className="p-4 border-slate-200">
            <p className="text-sm text-slate-600">Pending Invitations</p>
            <p className="text-2xl font-bold text-yellow-600">
              {speakers.filter(s => s.invitationStatus === 'pending').length}
            </p>
          </Card>
        </div>

        {/* Search and Quick Filters */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name, email, or event..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'pending', 'accepted', 'rejected'] as const).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="p-6 border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Advanced Filters</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-600">
                  <X className="w-4 h-4 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Event Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Event</label>
                <Select value={filterEvent} onValueChange={setFilterEvent}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="All Events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    {uniqueEvents.map((event) => (
                      <SelectItem key={event} value={event}>
                        {event}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Event Status Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Event Status</label>
                <Select value={filterEventStatus} onValueChange={(val: any) => setFilterEventStatus(val)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming Events</SelectItem>
                    <SelectItem value="ongoing">Ongoing Events</SelectItem>
                    <SelectItem value="completed">Completed Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Filters */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Quick Filters</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilterEventStatus('upcoming')}
                    className={filterEventStatus === 'upcoming' ? 'bg-blue-50 border-blue-200' : ''}
                  >
                    Upcoming Only
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilterEventStatus('completed')}
                    className={filterEventStatus === 'completed' ? 'bg-gray-50 border-gray-200' : ''}
                  >
                    Completed Only
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {filtered.length} of {speakers.length} speakers
          </p>
          {filterEventStatus !== 'all' && (
            <Badge className={getEventStatusBadge(filterEventStatus)}>
              {filterEventStatus.charAt(0).toUpperCase() + filterEventStatus.slice(1)} Events
            </Badge>
          )}
        </div>

        {/* Speakers List */}
        <div className="space-y-4">
          {filtered.map((speaker) => (
            <Card key={speaker.id} className={`p-6 border-slate-200 hover:shadow-md transition-shadow duration-200 group ${
              speaker.eventStatus === 'completed' ? 'opacity-75' : ''
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-slate-900">{speaker.name}</h3>
                    {speaker.profileUrl && (
                      <a
                        href={speaker.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 px-2 py-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                        title="Visit profile"
                      >
                        Visit Profile
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{speaker.email}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm text-slate-600">Event: {speaker.event}</p>
                    <Badge className={getEventStatusBadge(speaker.eventStatus)}>
                      {speaker.eventStatus}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">Topic: {speaker.topic}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    speaker.invitationStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : speaker.invitationStatus === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {speaker.invitationStatus.charAt(0).toUpperCase() + speaker.invitationStatus.slice(1)}
                  </span>
                  {speaker.accommodationRequired && (
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      Accommodation needed
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {speaker.profileUrl && (
                    <a
                      href={speaker.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" variant="outline" className="gap-1">
                        <ExternalLink className="w-3 h-3" />
                        Profile
                      </Button>
                    </a>
                  )}
                  {speaker.invitationStatus === 'pending' && speaker.eventStatus !== 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendInvitation(speaker)}
                      className="text-blue-600"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Resend
                    </Button>
                  )}
                  {speaker.eventStatus !== 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveSpeaker(speaker.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <Card className="p-12 text-center border-slate-200">
            <p className="text-slate-500">No speakers found matching your filters</p>
            {hasActiveFilters && (
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Clear all filters
              </Button>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
