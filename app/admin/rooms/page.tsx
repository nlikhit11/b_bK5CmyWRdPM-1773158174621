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
import { Search, Filter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface RoomRequest {
  id: number;
  event: string;
  organizer: string;
  roomSize: string;
  expectedAttendees: number;
  date: string;
  timeSlot: string;
  equipment: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockRoomRequests: RoomRequest[] = [
  {
    id: 1,
    event: 'Tech Summit 2026',
    organizer: 'John Smith',
    roomSize: 'Grand Ballroom',
    expectedAttendees: 500,
    date: '2026-03-15',
    timeSlot: '09:00 - 17:00',
    equipment: 'Projectors, Microphones, Lighting',
    status: 'pending',
  },
  {
    id: 2,
    event: 'Tech Summit 2026',
    organizer: 'John Smith',
    roomSize: 'Conference Room A',
    expectedAttendees: 100,
    date: '2026-03-15',
    timeSlot: '10:00 - 12:00',
    equipment: 'Whiteboard, Projector',
    status: 'pending',
  },
  {
    id: 3,
    event: 'AI Conference',
    organizer: 'Jane Doe',
    roomSize: 'Meeting Room B',
    expectedAttendees: 50,
    date: '2026-05-10',
    timeSlot: '14:00 - 16:00',
    equipment: 'Video Conference Setup',
    status: 'approved',
  },
];

export default function RoomRequestsPage() {
  const [requests, setRequests] = useState(mockRoomRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<RoomRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [suggestedRoom, setSuggestedRoom] = useState('');
  const [conferenceFilter, setConferenceFilter] = useState<string>('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Get unique conferences and rooms for filter dropdowns
  const uniqueConferences = Array.from(new Set(requests.map((r) => r.event)));
  const uniqueRoomTypes = Array.from(new Set(requests.map((r) => r.roomSize)));

  const filtered = requests.filter((request) => {
    const matchesSearch =
      request.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesConference = conferenceFilter === 'all' || request.event === conferenceFilter;
    const matchesRoomType = roomTypeFilter === 'all' || request.roomSize === roomTypeFilter;
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

    return matchesSearch && matchesConference && matchesRoomType && matchesStatus;
  });

  const handleApprove = (request: RoomRequest) => {
    setSelectedRequest(request);
    setSuggestedRoom('');
    setDialogOpen(true);
  };

  const submitApproval = async () => {
    if (!selectedRequest) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updated = requests.map((r) =>
        r.id === selectedRequest.id ? { ...r, status: 'approved' as const } : r
      );

      setRequests(updated);
      setDialogOpen(false);
      toast.success(`Room approved${suggestedRoom ? ' with suggestion sent to organizer' : ''}`);
    } catch (error) {
      toast.error('Failed to approve room request');
    }
  };

  const handleReject = (request: RoomRequest) => {
    const updated = requests.map((r) =>
      r.id === request.id ? { ...r, status: 'rejected' as const } : r
    );
    setRequests(updated);
    toast.success('Room request rejected');
  };

  return (
    <DashboardLayout role="admin" userName="Admin User" userEmail="admin@example.com">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Room Booking Requests</h1>
          <p className="text-slate-600 mt-2">Manage and approve room bookings for events</p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by event or organizer..."
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
              <label className="text-sm text-slate-600 block mb-1">Room Type</label>
              <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Room Types</SelectItem>
                  {uniqueRoomTypes.map((room) => (
                    <SelectItem key={room} value={room}>
                      {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-48">
              <label className="text-sm text-slate-600 block mb-1">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filtered.map((request) => (
            <Card key={request.id} className="p-6 border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-600">Event</p>
                  <p className="text-lg font-semibold text-slate-900">{request.event}</p>
                  <p className="text-sm text-slate-500">{request.organizer}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Room Details</p>
                  <p className="text-lg font-semibold text-slate-900">{request.roomSize}</p>
                  <p className="text-sm text-slate-500">{request.date} • {request.timeSlot}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Expected Attendees</p>
                  <p className="text-lg font-semibold text-slate-900">{request.expectedAttendees}</p>
                  <p className="text-sm text-slate-500">Equipment: {request.equipment}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  request.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : request.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>

                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(request)}
                      className="text-green-600"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(request)}
                      className="text-red-600"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <Card className="p-12 text-center border-slate-200">
            <p className="text-slate-500">No room requests found</p>
          </Card>
        )}
      </div>

      {/* Approval Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Room Request</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-900">{selectedRequest?.event}</p>
              <p className="text-sm text-slate-600">{selectedRequest?.roomSize}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Suggest Alternative Room (Optional)</label>
              <Input
                placeholder="e.g., Grand Ballroom instead"
                value={suggestedRoom}
                onChange={(e) => setSuggestedRoom(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitApproval} className="bg-green-600 hover:bg-green-700">
              Approve Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
