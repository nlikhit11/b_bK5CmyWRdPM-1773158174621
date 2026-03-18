'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Search, Download, Mail, ExternalLink, Eye, Send, Users } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner';

interface Attendee {
  id: number;
  name: string;
  email: string;
  organization: string;
  registrationStatus: 'registered' | 'checked_in' | 'completed';
  accommodationRequired: boolean;
  registeredDate: string;
  profileUrl?: string;
  conference: string;
  conferenceStatus: 'upcoming' | 'ongoing' | 'completed';
  paperTitle?: string;
  travelFormStatus: 'pending' | 'submitted' | 'approved';
  accommodationStatus: 'pending' | 'approved' | 'not_required';
}

const mockAttendees: Attendee[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    organization: 'Tech Corp',
    registrationStatus: 'registered',
    accommodationRequired: true,
    registeredDate: '2026-03-01',
    profileUrl: 'https://example.com/attendees/alice-johnson',
    conference: 'Tech Summit 2026',
    conferenceStatus: 'upcoming',
    paperTitle: 'Advanced AI in Cloud Computing',
    travelFormStatus: 'pending',
    accommodationStatus: 'pending',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    organization: 'Innovation Inc',
    registrationStatus: 'checked_in',
    accommodationRequired: false,
    registeredDate: '2026-03-02',
    profileUrl: 'https://example.com/attendees/bob-smith',
    conference: 'AI Conference',
    conferenceStatus: 'upcoming',
    paperTitle: 'Machine Learning Best Practices',
    travelFormStatus: 'submitted',
    accommodationStatus: 'not_required',
  },
  {
    id: 3,
    name: 'Carol White',
    email: 'carol@example.com',
    organization: 'Future Labs',
    registrationStatus: 'completed',
    accommodationRequired: true,
    registeredDate: '2026-02-28',
    profileUrl: 'https://example.com/attendees/carol-white',
    conference: 'Digital Forum 2025',
    conferenceStatus: 'completed',
    paperTitle: undefined,
    travelFormStatus: 'approved',
    accommodationStatus: 'approved',
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david@example.com',
    organization: 'Tech Innovations',
    registrationStatus: 'registered',
    accommodationRequired: true,
    registeredDate: '2026-03-05',
    profileUrl: 'https://example.com/attendees/david-brown',
    conference: 'Tech Summit 2026',
    conferenceStatus: 'upcoming',
    travelFormStatus: 'pending',
    accommodationStatus: 'pending',
  },
];

export default function AttendeeManagementPage() {
  const [attendees] = useState(mockAttendees);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'registered' | 'checked_in' | 'completed'>('all');
  const [conferenceFilter, setConferenceFilter] = useState<string>('all');
  const [speakerFilter, setSpeakerFilter] = useState<'all' | 'speakers' | 'attendees'>('all');
  const [eventStatusFilter, setEventStatusFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);
  const [selectedAttendees, setSelectedAttendees] = useState<number[]>([]);
  const [bulkEmailOpen, setBulkEmailOpen] = useState(false);
  const [customEmailOpen, setCustomEmailOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Get unique conferences for filter dropdown
  const uniqueConferences = Array.from(new Set(attendees.map((a) => a.conference)));

  const filtered = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || attendee.registrationStatus === filterStatus;
    const matchesConference = conferenceFilter === 'all' || attendee.conference === conferenceFilter;
    const matchesSpeaker = speakerFilter === 'all' || 
      (speakerFilter === 'speakers' && attendee.paperTitle) ||
      (speakerFilter === 'attendees' && !attendee.paperTitle);
    const matchesEventStatus = eventStatusFilter === 'all' || attendee.conferenceStatus === eventStatusFilter;
    
    return matchesSearch && matchesStatus && matchesConference && matchesSpeaker && matchesEventStatus;
  });

  const handleExportCSV = () => {
    const data = filtered.map((a) => ({
      Name: a.name,
      Email: a.email,
      Organization: a.organization,
      Conference: a.conference,
      'Event Status': a.conferenceStatus,
      Status: a.registrationStatus,
      'Travel Form': a.travelFormStatus,
      'Accommodation': a.accommodationStatus,
      'Registered Date': a.registeredDate,
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendees-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('CSV exported successfully');
  };

  const handleSendReminder = (type: 'travel' | 'custom' | 'timeline') => {
    if (!selectedAttendee) return;
    
    let message = '';
    if (type === 'travel') {
      message = `Travel form reminder sent to ${selectedAttendee.name}`;
    } else if (type === 'custom') {
      setCustomEmailOpen(true);
      return;
    } else {
      message = `Timeline/Schedule reminder sent to ${selectedAttendee.name}`;
    }
    
    toast.success(message);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAttendees(filtered.map((a) => a.id));
    } else {
      setSelectedAttendees([]);
    }
  };

  const handleSelectAttendee = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedAttendees([...selectedAttendees, id]);
    } else {
      setSelectedAttendees(selectedAttendees.filter((aid) => aid !== id));
    }
  };

  const handleBulkEmail = (type: 'travel' | 'schedule' | 'custom') => {
    if (selectedAttendees.length === 0) {
      toast.error('Please select at least one attendee');
      return;
    }

    if (type === 'custom') {
      setBulkEmailOpen(true);
      return;
    }

    const count = selectedAttendees.length;
    if (type === 'travel') {
      toast.success(`Travel form reminders sent to ${count} attendees`);
    } else {
      toast.success(`Schedule reminders sent to ${count} attendees`);
    }
    setSelectedAttendees([]);
  };

  const handleSendBulkCustomEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }

    toast.success(`Custom email sent to ${selectedAttendees.length} attendees`);
    setBulkEmailOpen(false);
    setEmailSubject('');
    setEmailBody('');
    setSelectedAttendees([]);
  };

  const handleSendCustomEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }

    toast.success(`Custom email sent to ${selectedAttendee?.name}`);
    setCustomEmailOpen(false);
    setEmailSubject('');
    setEmailBody('');
    setSelectedAttendee(null);
  };

  const getEventStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-50 text-blue-700';
      case 'ongoing':
        return 'bg-green-50 text-green-700';
      case 'completed':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <DashboardLayout role="organizer" userName="Organizer User" userEmail="organizer@example.com">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Attendee Management</h1>
            <p className="text-slate-600 mt-2">Track and manage event attendees</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportCSV} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAttendees.length > 0 && (
          <Card className="p-4 border-blue-200 bg-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {selectedAttendees.length} attendee{selectedAttendees.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkEmail('travel')}
                  className="gap-1"
                >
                  <Mail className="w-4 h-4" />
                  Send Travel Reminder
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkEmail('schedule')}
                  className="gap-1"
                >
                  <Mail className="w-4 h-4" />
                  Send Schedule
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBulkEmail('custom')}
                  className="gap-1"
                >
                  <Mail className="w-4 h-4" />
                  Custom Email
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedAttendees([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name, email, or organization..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="w-full sm:w-48">
              <label className="text-sm text-slate-600 block mb-1">Conference</label>
              <Select value={conferenceFilter} onValueChange={setConferenceFilter}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conferences</SelectItem>
                  {uniqueConferences.map((conf) => (
                    <SelectItem key={conf} value={conf}>
                      {conf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-48">
              <label className="text-sm text-slate-600 block mb-1">Event Status</label>
              <Select value={eventStatusFilter} onValueChange={(val: any) => setEventStatusFilter(val)}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="upcoming">Upcoming Events</SelectItem>
                  <SelectItem value="ongoing">Ongoing Events</SelectItem>
                  <SelectItem value="completed">Completed Events</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-48">
              <label className="text-sm text-slate-600 block mb-1">Type</label>
              <Select value={speakerFilter} onValueChange={(val: any) => setSpeakerFilter(val)}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="speakers">Speakers Only</SelectItem>
                  <SelectItem value="attendees">Attendees Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-48">
              <label className="text-sm text-slate-600 block mb-1">Registration Status</label>
              <Select value={filterStatus} onValueChange={(val: any) => setFilterStatus(val)}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="checked_in">Checked In</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Attendees Table */}
        <Card className="border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-4 px-4">
                    <Checkbox
                      checked={selectedAttendees.length === filtered.length && filtered.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600">Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600">Email</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600">Conference</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600">Event Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600">Accommodation</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((attendee) => (
                  <tr key={attendee.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-4">
                      <Checkbox
                        checked={selectedAttendees.includes(attendee.id)}
                        onCheckedChange={(checked) => handleSelectAttendee(attendee.id, checked as boolean)}
                      />
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{attendee.name}</span>
                        {attendee.profileUrl && (
                          <a
                            href={attendee.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                            title="Visit profile"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">{attendee.email}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{attendee.conference}</td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getEventStatusBadge(attendee.conferenceStatus)}`}>
                        {attendee.conferenceStatus.charAt(0).toUpperCase() + attendee.conferenceStatus.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        attendee.registrationStatus === 'registered'
                          ? 'bg-yellow-100 text-yellow-800'
                          : attendee.registrationStatus === 'checked_in'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {attendee.registrationStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        attendee.accommodationStatus === 'approved'
                          ? 'bg-green-50 text-green-700'
                          : attendee.accommodationStatus === 'pending'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-gray-50 text-gray-700'
                      }`}>
                        {attendee.accommodationStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedAttendee(attendee)}
                        className="gap-2"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filtered.length === 0 && (
          <Card className="p-12 text-center border-slate-200">
            <p className="text-slate-500">No attendees found</p>
          </Card>
        )}
      </div>

      {/* Attendee Details Modal */}
      {selectedAttendee && !customEmailOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-8 border-b border-slate-200 pb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">{selectedAttendee.name}</h2>
                  <p className="text-slate-600 mt-1">{selectedAttendee.email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAttendee(null)}
                >
                  Close
                </Button>
              </div>

              {/* Content Grid */}
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Conference</p>
                    <p className="text-slate-900 mt-1">{selectedAttendee.conference}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Event Status</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${getEventStatusBadge(selectedAttendee.conferenceStatus)}`}>
                      {selectedAttendee.conferenceStatus.charAt(0).toUpperCase() + selectedAttendee.conferenceStatus.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Organization</p>
                    <p className="text-slate-900 mt-1">{selectedAttendee.organization}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Registration Status</p>
                    <p className="text-slate-900 mt-1">{selectedAttendee.registrationStatus.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Registered Date</p>
                    <p className="text-slate-900 mt-1">{selectedAttendee.registeredDate}</p>
                  </div>
                  {selectedAttendee.profileUrl && (
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Profile</p>
                      <a
                        href={selectedAttendee.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 mt-1"
                      >
                        Visit Profile <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Paper Details */}
                {selectedAttendee.paperTitle && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 font-medium mb-2">Paper Title</p>
                    <p className="text-slate-900">{selectedAttendee.paperTitle}</p>
                  </div>
                )}

                {/* Form Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 font-medium">Travel Form Status</p>
                    <p className={`text-sm font-medium mt-2 ${
                      selectedAttendee.travelFormStatus === 'approved' ? 'text-green-700' :
                      selectedAttendee.travelFormStatus === 'submitted' ? 'text-blue-700' :
                      'text-orange-700'
                    }`}>
                      {selectedAttendee.travelFormStatus}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 font-medium">Accommodation Status</p>
                    <p className={`text-sm font-medium mt-2 ${
                      selectedAttendee.accommodationStatus === 'approved' ? 'text-green-700' :
                      selectedAttendee.accommodationStatus === 'pending' ? 'text-orange-700' :
                      'text-gray-700'
                    }`}>
                      {selectedAttendee.accommodationStatus.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>

                {/* Reminder Options */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Send Reminder</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => handleSendReminder('travel')}
                    >
                      <Send className="w-4 h-4" />
                      Travel Form Reminder
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => handleSendReminder('timeline')}
                    >
                      <Send className="w-4 h-4" />
                      Timeline & Schedule Reminder
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => handleSendReminder('custom')}
                    >
                      <Mail className="w-4 h-4" />
                      Send Custom Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Custom Email Modal for Individual */}
      <Dialog open={customEmailOpen} onOpenChange={setCustomEmailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Custom Email</DialogTitle>
            <DialogDescription>
              Send a custom email to {selectedAttendee?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Enter your message..."
                className="mt-1 min-h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomEmailOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendCustomEmail}>
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Email Modal */}
      <Dialog open={bulkEmailOpen} onOpenChange={setBulkEmailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Bulk Custom Email</DialogTitle>
            <DialogDescription>
              Send a custom email to {selectedAttendees.length} selected attendees
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bulk-subject">Subject</Label>
              <Input
                id="bulk-subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="bulk-body">Message</Label>
              <Textarea
                id="bulk-body"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Enter your message..."
                className="mt-1 min-h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkEmailOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendBulkCustomEmail}>
              Send to {selectedAttendees.length} Attendees
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
