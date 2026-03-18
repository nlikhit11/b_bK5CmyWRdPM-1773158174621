'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import { Calendar, MapPin, Phone, Mail, Building2, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AccommodationRequest {
  id: string;
  conferenceId: string;
  conferenceName: string;
  conferenceDate: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedDate: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  specialRequests?: string;
  // Filled by organizer/admin after approval
  hotelName?: string;
  address?: string;
  phone?: string;
  email?: string;
  confirmationNo?: string;
  notes?: string;
}

const mockRequests: AccommodationRequest[] = [
  {
    id: '1',
    conferenceId: '1',
    conferenceName: 'Tech Summit 2026',
    conferenceDate: 'Mar 15-17, 2026',
    status: 'approved',
    requestedDate: '2026-02-15',
    checkInDate: '2026-03-14',
    checkOutDate: '2026-03-18',
    roomType: 'Standard Room',
    specialRequests: 'Ground floor preferred',
    hotelName: 'Grand Convention Hotel',
    address: '123 Main Street, San Francisco, CA',
    phone: '+1-555-1234',
    email: 'reservations@grandhotel.com',
    confirmationNo: 'GCH123456',
    notes: 'Free breakfast included. Check-in after 3 PM.',
  },
  {
    id: '2',
    conferenceId: '2',
    conferenceName: 'AI Conference',
    conferenceDate: 'May 10-12, 2026',
    status: 'pending',
    requestedDate: '2026-03-01',
    checkInDate: '2026-05-09',
    checkOutDate: '2026-05-13',
    roomType: 'Standard Room',
    specialRequests: 'Non-smoking room',
  },
];

// Events user is registered for
const registeredConferences = [
  { id: '1', name: 'Tech Summit 2026', date: 'Mar 15-17, 2026', hasRequest: true },
  { id: '2', name: 'AI Conference', date: 'May 10-12, 2026', hasRequest: true },
  { id: '3', name: 'Digital Forum', date: 'Apr 5-7, 2026', hasRequest: false },
];

export default function AttendeeAccommodationPage() {
  const [requests, setRequests] = useState<AccommodationRequest[]>(mockRequests);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    conferenceId: '',
    checkInDate: '',
    checkOutDate: '',
    checkInTime: '',
    checkOutTime: '',
    roomType: 'standard',
    accompaniedByFamily: false,
    familyMemberCount: 0,
    foodPreference: 'veg',
    specialRequests: '',
  });

  const availableConferences = registeredConferences.filter(c => !c.hasRequest);

  const calculateNights = (checkIn: string, checkOut: string) => {
    const check = new Date(checkIn);
    const out = new Date(checkOut);
    const nights = Math.ceil((out.getTime() - check.getTime()) / (1000 * 60 * 60 * 24));
    return nights;
  };

  const handleSubmitRequest = () => {
    if (!newRequest.conferenceId || !newRequest.checkInDate || !newRequest.checkOutDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedConference = registeredConferences.find(c => c.id === newRequest.conferenceId);
    if (!selectedConference) {
      toast.error('Please select a conference');
      return;
    }

    const newRequestItem: AccommodationRequest = {
      id: `${Date.now()}`,
      conferenceId: newRequest.conferenceId,
      conferenceName: selectedConference.name,
      conferenceDate: selectedConference.date,
      status: 'pending',
      requestedDate: new Date().toISOString().split('T')[0],
      checkInDate: newRequest.checkInDate,
      checkOutDate: newRequest.checkOutDate,
      roomType: newRequest.roomType === 'standard' ? 'Standard Room' : 'Deluxe Room',
      specialRequests: newRequest.specialRequests || undefined,
    };

    setRequests([newRequestItem, ...requests]);
    setNewRequest({
      conferenceId: '',
      checkInDate: '',
      checkOutDate: '',
      checkInTime: '',
      checkOutTime: '',
      roomType: 'standard',
      accompaniedByFamily: false,
      familyMemberCount: 0,
      foodPreference: 'veg',
      specialRequests: '',
    });
    setDialogOpen(false);
    toast.success('Accommodation request submitted! You will be notified once it is processed.');
  };

  const handleCancelRequest = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
    toast.success('Accommodation request cancelled');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const approvedRequests = requests.filter(r => r.status === 'approved');
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');

  return (
    <DashboardLayout role="attendee" userName="John Attendee" userEmail="attendee@example.com">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Accommodation</h1>
            <p className="text-slate-600 mt-1">Request and manage your hotel bookings for conferences</p>
          </div>
          {availableConferences.length > 0 && (
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Request Accommodation
            </Button>
          )}
        </div>

        {/* Info Banner */}
        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">How Accommodation Works</p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Submit your accommodation request for each conference you are registered for</li>
                <li>The organizer will review and assign you to a hotel based on availability</li>
                <li>Once approved, you will see the hotel details and confirmation number here</li>
                <li>You can cancel pending requests if your plans change</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{approvedRequests.length}</p>
                <p className="text-sm text-slate-600">Confirmed</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{pendingRequests.length}</p>
                <p className="text-sm text-slate-600">Pending</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{requests.length}</p>
                <p className="text-sm text-slate-600">Total Requests</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Confirmed Bookings */}
        {approvedRequests.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Confirmed Bookings</h2>
            <div className="grid gap-4">
              {approvedRequests.map((request) => (
                <Card key={request.id} className="p-6 border-slate-200 border-l-4 border-l-green-500">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-5 h-5 text-indigo-600" />
                          <h3 className="font-bold text-lg text-slate-900">
                            {request.hotelName}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-600 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {request.address}
                        </p>
                        <p className="text-sm text-blue-600 font-medium mt-1">
                          For: {request.conferenceName} ({request.conferenceDate})
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Confirmed
                      </Badge>
                    </div>

                    {/* Check-in/Check-out */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Check-in</p>
                          <p className="font-semibold text-slate-900">
                            {new Date(request.checkInDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Check-out</p>
                          <p className="font-semibold text-slate-900">
                            {new Date(request.checkOutDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Room Info */}
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>{request.roomType}</strong> for{' '}
                        <strong>
                          {calculateNights(request.checkInDate, request.checkOutDate)} night
                          {calculateNights(request.checkInDate, request.checkOutDate) !== 1 ? 's' : ''}
                        </strong>
                      </p>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Phone</p>
                          <p className="font-medium text-slate-900">{request.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Email</p>
                          <p className="font-medium text-slate-900 text-sm">{request.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Confirmation */}
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Confirmation Number</p>
                      <p className="font-bold text-slate-900 text-lg">{request.confirmationNo}</p>
                    </div>

                    {/* Notes */}
                    {request.notes && (
                      <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                        <p className="text-xs text-green-600 mb-1 font-medium">Hotel Notes:</p>
                        <p className="text-sm text-green-900">{request.notes}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Pending Requests</h2>
            <div className="grid gap-4">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="p-6 border-slate-200 border-l-4 border-l-yellow-500">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">{request.conferenceName}</h3>
                        <p className="text-sm text-slate-600">{request.conferenceDate}</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Review
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Check-in</p>
                        <p className="font-medium text-slate-900">
                          {new Date(request.checkInDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">Check-out</p>
                        <p className="font-medium text-slate-900">
                          {new Date(request.checkOutDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">Room Type</p>
                        <p className="font-medium text-slate-900">{request.roomType}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Requested On</p>
                        <p className="font-medium text-slate-900">{request.requestedDate}</p>
                      </div>
                    </div>

                    {request.specialRequests && (
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Special Requests</p>
                        <p className="text-sm text-slate-700">{request.specialRequests}</p>
                      </div>
                    )}

                    <div className="flex justify-end pt-2 border-t border-slate-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelRequest(request.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Cancel Request
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Requests */}
        {requests.length === 0 && (
          <Card className="p-12 border-slate-200 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No accommodation requests yet.</p>
            {availableConferences.length > 0 && (
              <Button onClick={() => setDialogOpen(true)}>
                Request Accommodation
              </Button>
            )}
          </Card>
        )}
      </div>

      {/* New Request Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Accommodation</DialogTitle>
            <DialogDescription>
              Submit your accommodation requirements. The organizer will assign you to a suitable hotel.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="conference">Conference *</Label>
              <Select
                value={newRequest.conferenceId}
                onValueChange={(value) => setNewRequest({ ...newRequest, conferenceId: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select conference" />
                </SelectTrigger>
                <SelectContent>
                  {availableConferences.map((conf) => (
                    <SelectItem key={conf.id} value={conf.id}>
                      {conf.name} ({conf.date})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkIn">Check-in Date *</Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={newRequest.checkInDate}
                  onChange={(e) => setNewRequest({ ...newRequest, checkInDate: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="checkOut">Check-out Date *</Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={newRequest.checkOutDate}
                  onChange={(e) => setNewRequest({ ...newRequest, checkOutDate: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkInTime">Check-in Time</Label>
                <Input
                  id="checkInTime"
                  type="time"
                  value={newRequest.checkInTime}
                  onChange={(e) => setNewRequest({ ...newRequest, checkInTime: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="checkOutTime">Check-out Time</Label>
                <Input
                  id="checkOutTime"
                  type="time"
                  value={newRequest.checkOutTime}
                  onChange={(e) => setNewRequest({ ...newRequest, checkOutTime: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="foodPref">Food Preference *</Label>
              <Select
                value={newRequest.foodPreference}
                onValueChange={(value) => setNewRequest({ ...newRequest, foodPreference: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="veg">Vegetarian</SelectItem>
                  <SelectItem value="nonveg">Non-Vegetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newRequest.accompaniedByFamily}
                  onChange={(e) => setNewRequest({ ...newRequest, accompaniedByFamily: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span>Accompanied by family members</span>
              </Label>
            </div>

            {newRequest.accompaniedByFamily && (
              <div>
                <Label htmlFor="familyCount">Number of Family Members *</Label>
                <Input
                  id="familyCount"
                  type="number"
                  min="1"
                  max="10"
                  value={newRequest.familyMemberCount}
                  onChange={(e) => setNewRequest({ ...newRequest, familyMemberCount: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                  placeholder="0"
                />
              </div>
            )}

            <div>
              <Label htmlFor="roomType">Room Type</Label>
              <Select
                value={newRequest.roomType}
                onValueChange={(value) => setNewRequest({ ...newRequest, roomType: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Room</SelectItem>
                  <SelectItem value="deluxe">Deluxe Room</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="special">Special Requests (Optional)</Label>
              <Textarea
                id="special"
                placeholder="Any specific requirements (e.g., ground floor, non-smoking, accessibility needs)..."
                value={newRequest.specialRequests}
                onChange={(e) => setNewRequest({ ...newRequest, specialRequests: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRequest}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
