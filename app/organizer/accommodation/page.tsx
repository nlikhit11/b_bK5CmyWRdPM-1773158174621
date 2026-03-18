'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit2, CheckCircle2, Clock, XCircle, Search, Calendar, MapPin, User, Building, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface AccommodationRequest {
  id: number;
  personName: string;
  personEmail: string;
  personType: 'speaker' | 'attendee';
  eventId: string;
  eventName: string;
  hotelName: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  specialRequests?: string;
  status: 'pending' | 'approved' | 'rejected' | 'assigned';
  assignedHotel?: string;
  assignedRoom?: string;
  rejectionReason?: string;
}

const mockEvents = [
  { id: '1', name: 'Tech Summit 2024', status: 'completed' },
  { id: '2', name: 'AI Workshop Series', status: 'ongoing' },
  { id: '3', name: 'Web Dev Conference', status: 'ongoing' },
];

const mockAccommodations: AccommodationRequest[] = [
  {
    id: 1,
    personName: 'Dr. Sarah Johnson',
    personEmail: 'sarah@example.com',
    personType: 'speaker',
    eventId: '1',
    eventName: 'Tech Summit 2024',
    hotelName: 'Grand Plaza Hotel',
    roomType: 'Deluxe Suite',
    checkInDate: '2024-06-14',
    checkOutDate: '2024-06-18',
    specialRequests: 'Non-smoking room, high floor preferred',
    status: 'assigned',
    assignedHotel: 'Grand Plaza Hotel',
    assignedRoom: 'Suite 1205',
  },
  {
    id: 2,
    personName: 'Prof. Michael Chen',
    personEmail: 'mchen@university.edu',
    personType: 'speaker',
    eventId: '2',
    eventName: 'AI Workshop Series',
    hotelName: 'Tech Park Inn',
    roomType: 'Standard',
    checkInDate: '2026-07-19',
    checkOutDate: '2026-07-23',
    status: 'pending',
  },
  {
    id: 3,
    personName: 'Alice Johnson',
    personEmail: 'alice@example.com',
    personType: 'attendee',
    eventId: '2',
    eventName: 'AI Workshop Series',
    hotelName: 'Business Inn',
    roomType: 'Standard',
    checkInDate: '2026-07-19',
    checkOutDate: '2026-07-23',
    specialRequests: 'Early check-in if possible',
    status: 'approved',
  },
  {
    id: 4,
    personName: 'Bob Smith',
    personEmail: 'bob@company.com',
    personType: 'attendee',
    eventId: '3',
    eventName: 'Web Dev Conference',
    hotelName: 'City Hotel',
    roomType: 'Standard',
    checkInDate: '2026-08-09',
    checkOutDate: '2026-08-13',
    status: 'pending',
  },
  {
    id: 5,
    personName: 'Dr. Emily White',
    personEmail: 'emily@research.org',
    personType: 'speaker',
    eventId: '3',
    eventName: 'Web Dev Conference',
    hotelName: 'Premium Suites',
    roomType: 'Executive',
    checkInDate: '2026-08-09',
    checkOutDate: '2026-08-13',
    status: 'rejected',
    rejectionReason: 'Requested dates not available at preferred hotel',
  },
];

const availableHotels = [
  { name: 'Grand Plaza Hotel', rooms: ['Suite 1201', 'Suite 1202', 'Suite 1205', 'Deluxe 501', 'Deluxe 502'] },
  { name: 'Tech Park Inn', rooms: ['Room 101', 'Room 102', 'Room 201', 'Room 202'] },
  { name: 'Business Inn', rooms: ['Standard 301', 'Standard 302', 'Standard 303'] },
  { name: 'City Hotel', rooms: ['Room A1', 'Room A2', 'Room B1', 'Room B2'] },
];

export default function AccommodationPage() {
  const [accommodations, setAccommodations] = useState<AccommodationRequest[]>(mockAccommodations);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('speakers');

  // Assignment dialog state
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [assignForm, setAssignForm] = useState({ hotel: '', room: '' });

  // Rejection dialog state
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const speakers = accommodations.filter((a) => a.personType === 'speaker');
  const attendees = accommodations.filter((a) => a.personType === 'attendee');

  const filterRequests = (requests: AccommodationRequest[]) => {
    return requests.filter(req => {
      const matchesSearch = 
        req.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.personEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.eventName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesEvent = eventFilter === 'all' || req.eventId === eventFilter;
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
      
      return matchesSearch && matchesEvent && matchesStatus;
    });
  };

  const filteredSpeakers = filterRequests(speakers);
  const filteredAttendees = filterRequests(attendees);

  const handleApprove = (id: number) => {
    setAccommodations(
      accommodations.map((a) =>
        a.id === id ? { ...a, status: 'approved' as const } : a
      )
    );
    toast.success('Accommodation request approved');
  };

  const handleStartAssign = (request: AccommodationRequest) => {
    setAssigningId(request.id);
    setAssignForm({ hotel: request.hotelName || '', room: '' });
  };

  const handleSaveAssignment = () => {
    if (!assigningId || !assignForm.hotel || !assignForm.room) {
      toast.error('Please select both hotel and room');
      return;
    }

    setAccommodations(
      accommodations.map((a) =>
        a.id === assigningId
          ? { ...a, status: 'assigned' as const, assignedHotel: assignForm.hotel, assignedRoom: assignForm.room }
          : a
      )
    );

    setAssigningId(null);
    setAssignForm({ hotel: '', room: '' });
    toast.success('Accommodation assigned successfully');
  };

  const handleStartReject = (id: number) => {
    setRejectingId(id);
    setRejectionReason('');
  };

  const handleConfirmReject = () => {
    if (!rejectingId) return;

    setAccommodations(
      accommodations.map((a) =>
        a.id === rejectingId
          ? { ...a, status: 'rejected' as const, rejectionReason: rejectionReason || 'Request could not be accommodated' }
          : a
      )
    );

    setRejectingId(null);
    setRejectionReason('');
    toast.success('Accommodation request rejected');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Assigned
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const selectedHotelRooms = useMemo(() => {
    const hotel = availableHotels.find(h => h.name === assignForm.hotel);
    return hotel?.rooms || [];
  }, [assignForm.hotel]);

  const renderRequestCard = (request: AccommodationRequest) => (
    <Card key={request.id} className="p-5 border-slate-200">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-slate-900">{request.personName}</h3>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">{request.personEmail}</p>
            </div>
            {getStatusBadge(request.status)}
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2 py-1 rounded">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{request.eventName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{request.hotelName} ({request.roomType})</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{request.checkInDate} to {request.checkOutDate}</span>
            </div>
          </div>

          {request.specialRequests && (
            <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
              <span className="font-medium">Special Requests:</span> {request.specialRequests}
            </p>
          )}

          {request.status === 'assigned' && request.assignedHotel && (
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <p className="text-sm font-medium text-emerald-800">
                Assigned: {request.assignedHotel} - {request.assignedRoom}
              </p>
            </div>
          )}

          {request.status === 'rejected' && request.rejectionReason && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <p className="text-sm text-red-700">
                <span className="font-medium">Rejection Reason:</span> {request.rejectionReason}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {request.status === 'pending' && (
            <>
              <Button
                size="sm"
                onClick={() => handleApprove(request.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStartReject(request.id)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Reject
              </Button>
            </>
          )}

          {(request.status === 'approved' || request.status === 'pending') && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStartAssign(request)}
              className="gap-1.5"
            >
              <Edit2 className="w-4 h-4" />
              Assign Room
            </Button>
          )}

          {request.status === 'assigned' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStartAssign(request)}
              className="gap-1.5"
            >
              <Edit2 className="w-4 h-4" />
              Reassign
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <DashboardLayout role="organizer" userName="Organizer User" userEmail="organizer@example.com">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Accommodation Management</h1>
          <p className="text-slate-600 mt-2">Review, approve, and assign accommodations for speakers and attendees</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name, email, or event..."
              className="pl-10 bg-white border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-full sm:w-56 bg-white border-slate-200">
              <Filter className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Filter by event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {mockEvents.map(event => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name} {event.status === 'completed' ? '(Completed)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-44 bg-white border-slate-200">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-slate-200">
            <p className="text-sm text-slate-600">Total Requests</p>
            <p className="text-2xl font-bold text-slate-900">{accommodations.length}</p>
          </Card>
          <Card className="p-4 border-slate-200">
            <p className="text-sm text-slate-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {accommodations.filter(a => a.status === 'pending').length}
            </p>
          </Card>
          <Card className="p-4 border-slate-200">
            <p className="text-sm text-slate-600">Assigned</p>
            <p className="text-2xl font-bold text-emerald-600">
              {accommodations.filter(a => a.status === 'assigned').length}
            </p>
          </Card>
          <Card className="p-4 border-slate-200">
            <p className="text-sm text-slate-600">Rejected</p>
            <p className="text-2xl font-bold text-red-600">
              {accommodations.filter(a => a.status === 'rejected').length}
            </p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="speakers">Speakers ({filteredSpeakers.length})</TabsTrigger>
            <TabsTrigger value="attendees">Attendees ({filteredAttendees.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="speakers" className="mt-6">
            <div className="space-y-4">
              {filteredSpeakers.length > 0 ? (
                filteredSpeakers.map(renderRequestCard)
              ) : (
                <Card className="p-12 border-slate-200 text-center">
                  <p className="text-slate-600">No speaker accommodation requests found.</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="attendees" className="mt-6">
            <div className="space-y-4">
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map(renderRequestCard)
              ) : (
                <Card className="p-12 border-slate-200 text-center">
                  <p className="text-slate-600">No attendee accommodation requests found.</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Assignment Dialog */}
      <Dialog open={assigningId !== null} onOpenChange={(open) => !open && setAssigningId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Accommodation</DialogTitle>
            <DialogDescription>Select a hotel and room to assign to this request</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Hotel</Label>
              <Select value={assignForm.hotel} onValueChange={(value) => setAssignForm({ hotel: value, room: '' })}>
                <SelectTrigger className="mt-1.5 bg-white border-slate-200">
                  <SelectValue placeholder="Select hotel" />
                </SelectTrigger>
                <SelectContent>
                  {availableHotels.map(hotel => (
                    <SelectItem key={hotel.name} value={hotel.name}>{hotel.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Room</Label>
              <Select 
                value={assignForm.room} 
                onValueChange={(value) => setAssignForm({ ...assignForm, room: value })}
                disabled={!assignForm.hotel}
              >
                <SelectTrigger className="mt-1.5 bg-white border-slate-200">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {selectedHotelRooms.map(room => (
                    <SelectItem key={room} value={room}>{room}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end pt-4 border-t border-slate-200">
              <Button variant="outline" onClick={() => setAssigningId(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveAssignment}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectingId !== null} onOpenChange={(open) => !open && setRejectingId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Accommodation Request</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting this request</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Rejection Reason</Label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full mt-1.5 p-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="Enter the reason for rejection..."
              />
            </div>
            <div className="flex gap-2 justify-end pt-4 border-t border-slate-200">
              <Button variant="outline" onClick={() => setRejectingId(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmReject}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
