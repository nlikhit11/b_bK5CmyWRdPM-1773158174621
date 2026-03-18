'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Package, Plus, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface GoodiesRequest {
  id: number;
  itemName: string;
  quantity: number;
  event: string;
  eventDate: string;
  purpose: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  requestedDate: string;
  adminNotes?: string;
}

const mockRequests: GoodiesRequest[] = [
  {
    id: 1,
    itemName: 'T-shirts',
    quantity: 500,
    event: 'Tech Summit 2026',
    eventDate: 'Mar 15-17, 2026',
    purpose: 'Speaker gifts and attendee giveaways',
    urgency: 'high',
    status: 'approved',
    requestedDate: '2026-02-15',
    adminNotes: 'Approved for distribution at registration',
  },
  {
    id: 2,
    itemName: 'Conference Bags',
    quantity: 500,
    event: 'Tech Summit 2026',
    eventDate: 'Mar 15-17, 2026',
    purpose: 'Welcome kit for all attendees',
    urgency: 'high',
    status: 'pending',
    requestedDate: '2026-02-20',
  },
  {
    id: 3,
    itemName: 'Notepads',
    quantity: 1000,
    event: 'AI Conference',
    eventDate: 'May 10-12, 2026',
    purpose: 'Note-taking materials for workshops',
    urgency: 'medium',
    status: 'pending',
    requestedDate: '2026-03-01',
  },
];

const availableEvents = [
  { id: '1', name: 'Tech Summit 2026', date: 'Mar 15-17, 2026' },
  { id: '2', name: 'AI Conference', date: 'May 10-12, 2026' },
  { id: '3', name: 'Digital Forum', date: 'Apr 5-7, 2026' },
];

export default function GoodiesPage() {
  const [requests, setRequests] = useState(mockRequests);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    itemName: '',
    quantity: '',
    eventId: '',
    purpose: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
  });

  const handleSubmitRequest = () => {
    if (!newRequest.itemName || !newRequest.quantity || !newRequest.eventId || !newRequest.purpose) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedEvent = availableEvents.find(e => e.id === newRequest.eventId);
    if (!selectedEvent) {
      toast.error('Please select an event');
      return;
    }

    const newId = Math.max(...requests.map(r => r.id), 0) + 1;
    const newRequestItem: GoodiesRequest = {
      id: newId,
      itemName: newRequest.itemName,
      quantity: parseInt(newRequest.quantity),
      event: selectedEvent.name,
      eventDate: selectedEvent.date,
      purpose: newRequest.purpose,
      urgency: newRequest.urgency,
      status: 'pending',
      requestedDate: new Date().toISOString().split('T')[0],
    };

    setRequests([newRequestItem, ...requests]);
    setNewRequest({
      itemName: '',
      quantity: '',
      eventId: '',
      purpose: '',
      urgency: 'medium',
    });
    setDialogOpen(false);
    toast.success('Goodies request submitted for admin approval');
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

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <DashboardLayout role="organizer" userName="Organizer User" userEmail="organizer@example.com">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Goodies Requests</h1>
            <p className="text-slate-600 mt-2">Request event merchandise - all requests require admin approval</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Request
          </Button>
        </div>

        {/* Info Banner */}
        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Approval Required</p>
              <p className="text-sm text-blue-700 mt-1">
                All goodies requests must be approved by an administrator before items are allocated. 
                Please provide detailed information including the event, quantity needed, and purpose.
              </p>
            </div>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
                <p className="text-sm text-slate-600">Pending Approval</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {requests.filter(r => r.status === 'approved').length}
                </p>
                <p className="text-sm text-slate-600">Approved</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{requests.length}</p>
                <p className="text-sm text-slate-600">Total Requests</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Your Requests</h2>
          
          {requests.length === 0 ? (
            <Card className="p-12 text-center border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No goodies requests yet</p>
              <Button onClick={() => setDialogOpen(true)} className="mt-4">
                Create Your First Request
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="p-6 border-slate-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-slate-400" />
                        <h3 className="text-lg font-semibold text-slate-900">{request.itemName}</h3>
                        <span className="text-sm font-medium text-slate-600">
                          x{request.quantity}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-slate-600">Event:</span>
                          <span className="font-medium text-slate-900">{request.event}</span>
                          <span className="text-slate-500">({request.eventDate})</span>
                        </div>
                        <div className="flex items-start gap-4">
                          <span className="text-slate-600">Purpose:</span>
                          <span className="text-slate-900">{request.purpose}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-slate-600">Requested:</span>
                          <span className="text-slate-900">{request.requestedDate}</span>
                        </div>
                      </div>

                      {request.adminNotes && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs font-medium text-slate-600 mb-1">Admin Notes:</p>
                          <p className="text-sm text-slate-700">{request.adminNotes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getUrgencyBadge(request.urgency)}`}>
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Priority
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Request Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Goodies</DialogTitle>
            <DialogDescription>
              Fill in the details below. Your request will be sent to the admin for approval.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="event">Event *</Label>
              <Select
                value={newRequest.eventId}
                onValueChange={(value) => setNewRequest({ ...newRequest, eventId: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  {availableEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name} ({event.date})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="item">Item Name *</Label>
              <Input
                id="item"
                placeholder="e.g., T-shirts, Bags, Notepads"
                value={newRequest.itemName}
                onChange={(e) => setNewRequest({ ...newRequest, itemName: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity needed"
                value={newRequest.quantity}
                onChange={(e) => setNewRequest({ ...newRequest, quantity: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="purpose">Purpose / Justification *</Label>
              <Textarea
                id="purpose"
                placeholder="Explain why you need these items and how they will be used..."
                value={newRequest.purpose}
                onChange={(e) => setNewRequest({ ...newRequest, purpose: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select
                value={newRequest.urgency}
                onValueChange={(value: 'low' | 'medium' | 'high') => setNewRequest({ ...newRequest, urgency: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - No rush</SelectItem>
                  <SelectItem value="medium">Medium - Needed within 2 weeks</SelectItem>
                  <SelectItem value="high">High - Urgent request</SelectItem>
                </SelectContent>
              </Select>
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
