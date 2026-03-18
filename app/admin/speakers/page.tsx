'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, CheckCircle2, ExternalLink, X, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface SpeakerApproval {
  id: number;
  name: string;
  organization: string;
  event: string;
  eventStatus: 'upcoming' | 'ongoing' | 'completed';
  topic: string;
  bio: string;
  invitationStatus: 'pending' | 'accepted' | 'rejected';
  acceptanceStatus: 'invited' | 'accepted' | 'declined';
  accommodationRequired: boolean;
  profileUrl?: string;
}

const mockSpeakers: SpeakerApproval[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    organization: 'TechCorp AI Labs',
    event: 'Tech Summit 2026',
    eventStatus: 'upcoming',
    topic: 'Future of AI in Enterprise',
    bio: 'Leading AI researcher with 15 years of experience',
    invitationStatus: 'pending',
    acceptanceStatus: 'invited',
    accommodationRequired: true,
    profileUrl: 'https://example.com/speakers/sarah-johnson',
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    organization: 'University of Technology',
    event: 'AI Conference',
    eventStatus: 'upcoming',
    topic: 'Machine Learning Applications',
    bio: 'Professor and ML specialist',
    invitationStatus: 'accepted',
    acceptanceStatus: 'accepted',
    accommodationRequired: true,
    profileUrl: 'https://example.com/speakers/michael-chen',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    organization: 'Innovation Ventures',
    event: 'Tech Summit 2026',
    eventStatus: 'upcoming',
    topic: 'Startup Ecosystem',
    bio: 'Entrepreneur and venture capital advisor',
    invitationStatus: 'pending',
    acceptanceStatus: 'invited',
    accommodationRequired: false,
    profileUrl: 'https://example.com/speakers/emily-rodriguez',
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    organization: 'Digital Futures Inc',
    event: 'Digital Forum 2025',
    eventStatus: 'completed',
    topic: 'Digital Transformation',
    bio: 'Digital transformation consultant',
    invitationStatus: 'accepted',
    acceptanceStatus: 'accepted',
    accommodationRequired: true,
    profileUrl: 'https://example.com/speakers/james-wilson',
  },
  {
    id: 5,
    name: 'Lisa Park',
    organization: 'CloudScale Solutions',
    event: 'Cloud Summit 2025',
    eventStatus: 'completed',
    topic: 'Cloud Architecture',
    bio: 'Cloud architect and strategist',
    invitationStatus: 'accepted',
    acceptanceStatus: 'accepted',
    accommodationRequired: false,
    profileUrl: 'https://example.com/speakers/lisa-park',
  },
];

export default function SpeakerApprovalsPage() {
  const [speakers, setSpeakers] = useState(mockSpeakers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [filterEvent, setFilterEvent] = useState<string>('all');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [filterEventStatus, setFilterEventStatus] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique events and topics for filter dropdowns
  const uniqueEvents = Array.from(new Set(speakers.map((s) => s.event)));
  const uniqueTopics = Array.from(new Set(speakers.map((s) => s.topic)));

  const filtered = speakers.filter((speaker) => {
    const matchesSearch =
      speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      speaker.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      speaker.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      speaker.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || speaker.invitationStatus === filterStatus;
    const matchesEvent = filterEvent === 'all' || speaker.event === filterEvent;
    const matchesTopic = filterTopic === 'all' || speaker.topic === filterTopic;
    const matchesEventStatus = filterEventStatus === 'all' || speaker.eventStatus === filterEventStatus;
    return matchesSearch && matchesStatus && matchesEvent && matchesTopic && matchesEventStatus;
  });

  const handleApprove = (speaker: SpeakerApproval) => {
    const updated = speakers.map((s) =>
      s.id === speaker.id ? { ...s, invitationStatus: 'accepted' as const } : s
    );
    setSpeakers(updated);
    toast.success(`${speaker.name} approved as speaker`);
  };

  const handleReject = (speaker: SpeakerApproval) => {
    const updated = speakers.map((s) =>
      s.id === speaker.id ? { ...s, invitationStatus: 'rejected' as const } : s
    );
    setSpeakers(updated);
    toast.success(`${speaker.name} rejected`);
  };

  const clearFilters = () => {
    setFilterStatus('all');
    setFilterEvent('all');
    setFilterTopic('all');
    setFilterEventStatus('all');
    setSearchQuery('');
  };

  const hasActiveFilters = filterStatus !== 'all' || filterEvent !== 'all' || filterTopic !== 'all' || filterEventStatus !== 'all';

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

  return (
    <DashboardLayout role="admin" userName="Admin User" userEmail="admin@example.com">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Speaker Approvals</h1>
            <p className="text-slate-600 mt-2">Verify and approve invited speakers for events</p>
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

        {/* Search */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name, organization, event, or topic..."
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

              {/* Topic Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Topic</label>
                <Select value={filterTopic} onValueChange={setFilterTopic}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="All Topics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    {uniqueTopics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
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

              {/* Accommodation Filter could be added here */}
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
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getEventStatusBadge(filterEventStatus)}`}>
              {filterEventStatus.charAt(0).toUpperCase() + filterEventStatus.slice(1)} Events
            </span>
          )}
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((speaker) => (
            <Card key={speaker.id} className="p-6 border-slate-200 hover:shadow-md transition-shadow group">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
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
                    <p className="text-sm text-slate-600">{speaker.organization}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      speaker.invitationStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : speaker.invitationStatus === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {speaker.invitationStatus.charAt(0).toUpperCase() + speaker.invitationStatus.slice(1)}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventStatusBadge(speaker.eventStatus)}`}>
                      {speaker.eventStatus.charAt(0).toUpperCase() + speaker.eventStatus.slice(1)} Event
                    </span>
                  </div>
                </div>

                <div className="space-y-1 mt-3">
                  <p className="text-sm font-medium text-slate-900">Event: {speaker.event}</p>
                  <p className="text-sm font-medium text-slate-900">Topic: {speaker.topic}</p>
                  <p className="text-xs text-slate-600 mt-2">{speaker.bio}</p>
                </div>

                {speaker.accommodationRequired && (
                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-medium text-blue-900">Accommodation required</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-200">
                {speaker.invitationStatus === 'pending' && (
                  <>
                    <Button
                      className="flex-1 text-green-600"
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(speaker)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      className="flex-1 text-red-600"
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(speaker)}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {speaker.invitationStatus !== 'pending' && (
                  <Button disabled className="flex-1" variant="outline" size="sm">
                    {speaker.invitationStatus === 'accepted' ? 'Approved' : 'Rejected'}
                  </Button>
                )}
                {speaker.profileUrl && (
                  <a
                    href={speaker.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <ExternalLink className="w-3 h-3" />
                      Profile
                    </Button>
                  </a>
                )}
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
