'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Trash2, RotateCcw, Search, Calendar, MapPin, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Conference } from '@/lib/types';

// Mock data with more details
const mockEvents: (Conference & { end_date?: string })[] = [
  {
    id: '1',
    organizer_id: 'org1',
    title: 'Tech Summit 2024',
    description: 'Annual technology conference featuring the latest innovations',
    date: '2024-06-15',
    end_date: '2024-06-17',
    venue: 'Convention Center',
    expected_attendees: 500,
    status: 'approved',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '2',
    organizer_id: 'org1',
    title: 'AI Workshop Series',
    description: 'Deep dive into AI technologies and machine learning',
    date: '2026-07-20',
    end_date: '2026-07-22',
    venue: 'Tech Park Auditorium',
    expected_attendees: 150,
    status: 'approved',
    created_at: '2024-01-05',
    updated_at: '2024-01-05',
  },
  {
    id: '3',
    organizer_id: 'org1',
    title: 'Web Dev Conference',
    description: 'Modern web development practices and frameworks',
    date: '2026-08-10',
    end_date: '2026-08-12',
    venue: 'Digital Hub',
    expected_attendees: 300,
    status: 'pending',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
  },
  {
    id: '4',
    organizer_id: 'org1',
    title: 'Cloud Computing Summit',
    description: 'Enterprise cloud solutions and architecture',
    date: '2023-11-15',
    end_date: '2023-11-17',
    venue: 'Business Center',
    expected_attendees: 400,
    status: 'approved',
    created_at: '2023-08-01',
    updated_at: '2023-08-01',
  },
  {
    id: '5',
    organizer_id: 'org1',
    title: 'Security Conference',
    description: 'Cybersecurity best practices',
    date: '2026-09-05',
    end_date: '2026-09-07',
    venue: 'Security Center',
    expected_attendees: 200,
    status: 'rejected',
    created_at: '2024-03-01',
    updated_at: '2024-03-01',
    feedback: 'Please provide more details about the security measures for the event.',
  },
];

interface EditingEvent extends Conference {
  changes?: Partial<Conference>;
  end_date?: string;
  feedback?: string;
}

export default function ManageEventsPage() {
  const [events, setEvents] = useState<EditingEvent[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Conference & { end_date?: string }>>({});
  const [resubmitId, setResubmitId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('ongoing');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Separate events into completed and ongoing
  const { completedEvents, ongoingEvents } = useMemo(() => {
    const completed: EditingEvent[] = [];
    const ongoing: EditingEvent[] = [];

    events.forEach(event => {
      const eventEndDate = new Date(event.end_date || event.date);
      eventEndDate.setHours(23, 59, 59, 999);
      
      if (eventEndDate < today && event.status === 'approved') {
        completed.push(event);
      } else {
        ongoing.push(event);
      }
    });

    return { completedEvents: completed, ongoingEvents: ongoing };
  }, [events]);

  // Filter events based on search and status
  const filterEvents = (eventList: EditingEvent[]) => {
    return eventList.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const filteredOngoing = filterEvents(ongoingEvents);
  const filteredCompleted = filterEvents(completedEvents);

  const handleEdit = (event: EditingEvent) => {
    setEditingId(event.id);
    setEditForm({ ...event });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    
    setEvents(
      events.map((e) =>
        e.id === editingId
          ? { ...e, ...editForm, status: 'pending', updated_at: new Date().toISOString() }
          : e
      )
    );
    
    toast.success('Event updated and resubmitted for approval');
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId));
    toast.success('Event deleted successfully');
  };

  const handleResubmit = (eventId: string) => {
    setEvents(
      events.map((e) =>
        e.id === eventId
          ? { ...e, status: 'pending', updated_at: new Date().toISOString() }
          : e
      )
    );
    
    toast.success('Event resubmitted for admin approval');
    setResubmitId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const renderEventCard = (event: EditingEvent, isCompleted: boolean = false) => (
    <Card key={event.id} className={`p-6 border-slate-200 ${isCompleted ? 'opacity-75' : ''}`}>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{event.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {isCompleted && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Completed
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                  event.status
                )}`}
              >
                {getStatusIcon(event.status)}
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {event.end_date && ` - ${new Date(event.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{event.expected_attendees} expected</span>
            </div>
          </div>
        </div>

        {!isCompleted && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Edit Dialog */}
            <Dialog open={editingId === event.id} onOpenChange={(open) => !open && setEditingId(null)}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(event)}
                  className="gap-1.5"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Edit Event</DialogTitle>
                  <DialogDescription>Update event details and resubmit for approval</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Event Title</label>
                    <Input
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="mt-1.5 bg-white border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Description</label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full mt-1.5 p-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Start Date</label>
                      <Input
                        type="date"
                        value={editForm.date || ''}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="mt-1.5 bg-white border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">End Date</label>
                      <Input
                        type="date"
                        value={editForm.end_date || ''}
                        onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
                        className="mt-1.5 bg-white border-slate-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Venue</label>
                    <Input
                      value={editForm.venue || ''}
                      onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
                      className="mt-1.5 bg-white border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Expected Attendees</label>
                    <Input
                      type="number"
                      value={editForm.expected_attendees || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          expected_attendees: parseInt(e.target.value),
                        })
                      }
                      className="mt-1.5 bg-white border-slate-200"
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-4 border-t border-slate-200">
                    <Button variant="outline" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Save & Resubmit
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Resubmit Dialog for rejected events */}
            {event.status === 'rejected' && (
              <Dialog open={resubmitId === event.id} onOpenChange={(open) => !open && setResubmitId(null)}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setResubmitId(event.id)}
                    className="gap-1.5 text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Resubmit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Resubmit Event</DialogTitle>
                    <DialogDescription>
                      This event was previously rejected. Resubmitting will send it for review again.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    {event.feedback && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700">Admin Feedback:</p>
                        <p className="p-3 bg-red-50 rounded-lg text-sm text-red-700 border border-red-200">
                          {event.feedback}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2 justify-end pt-4 mt-4 border-t border-slate-200">
                      <Button variant="outline" onClick={() => setResubmitId(null)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleResubmit(event.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        Resubmit for Approval
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Delete Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(event.id)}
              className="gap-1.5 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <DashboardLayout role="organizer" userName="John Organizer" userEmail="organizer@example.com">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Events</h1>
          <p className="text-slate-600 mt-1">Edit, update, or resubmit your events for approval</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by event name, venue, or description..."
              className="pl-10 bg-white border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white border-slate-200">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs for Ongoing vs Completed */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="ongoing" className="gap-2">
              <Clock className="w-4 h-4" />
              Ongoing ({filteredOngoing.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Completed ({filteredCompleted.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ongoing" className="mt-6">
            <div className="space-y-4">
              {filteredOngoing.length > 0 ? (
                filteredOngoing.map(event => renderEventCard(event, false))
              ) : (
                <Card className="p-12 border-slate-200 text-center">
                  <p className="text-slate-600">No ongoing events found matching your criteria.</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="space-y-4">
              {filteredCompleted.length > 0 ? (
                filteredCompleted.map(event => renderEventCard(event, true))
              ) : (
                <Card className="p-12 border-slate-200 text-center">
                  <p className="text-slate-600">No completed events found matching your criteria.</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
