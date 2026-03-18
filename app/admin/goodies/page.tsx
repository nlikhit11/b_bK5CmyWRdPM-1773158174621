'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Package } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface GoodiesRequest {
  id: number;
  event: string;
  organizer: string;
  items: Array<{ name: string; quantityRequested: number }>;
  status: 'pending' | 'approved' | 'rejected';
  requestedDate: string;
}

const mockGoodiesRequests: GoodiesRequest[] = [
  {
    id: 1,
    event: 'Tech Summit 2026',
    organizer: 'John Smith',
    items: [
      { name: 'T-shirts', quantityRequested: 500 },
      { name: 'Conference Bags', quantityRequested: 500 },
      { name: 'Notepads', quantityRequested: 1000 },
    ],
    status: 'pending',
    requestedDate: '2026-03-01',
  },
  {
    id: 2,
    event: 'AI Conference',
    organizer: 'Jane Doe',
    items: [
      { name: 'T-shirts', quantityRequested: 300 },
      { name: 'USB Drives', quantityRequested: 300 },
    ],
    status: 'pending',
    requestedDate: '2026-03-02',
  },
  {
    id: 3,
    event: 'Digital Forum',
    organizer: 'Bob Johnson',
    items: [
      { name: 'Certificates', quantityRequested: 400 },
      { name: 'Badges', quantityRequested: 400 },
    ],
    status: 'approved',
    requestedDate: '2026-02-28',
  },
];

const inventory = {
  'T-shirts': { available: 2000, allocated: 500 },
  'Conference Bags': { available: 1500, allocated: 0 },
  'Notepads': { available: 3000, allocated: 0 },
  'USB Drives': { available: 500, allocated: 0 },
  Certificates: { available: 5000, allocated: 400 },
  Badges: { available: 5000, allocated: 400 },
};

export default function GoodiesPage() {
  const [requests, setRequests] = useState(mockGoodiesRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<GoodiesRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  const filtered = requests.filter(
    (request) =>
      request.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.organizer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canApprove = (request: GoodiesRequest) => {
    return request.items.every((item) => {
      const stock = inventory[item.name as keyof typeof inventory];
      return stock && stock.available - stock.allocated >= item.quantityRequested;
    });
  };

  const handleAction = (request: GoodiesRequest, type: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(type);
    setDialogOpen(true);
  };

  const submitAction = async () => {
    if (!selectedRequest) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updated = requests.map((r) =>
        r.id === selectedRequest.id
          ? { ...r, status: actionType === 'approve' ? 'approved' : 'rejected' }
          : r
      );

      setRequests(updated);
      setDialogOpen(false);
      toast.success(
        actionType === 'approve'
          ? 'Goodies request approved!'
          : 'Goodies request rejected.'
      );
    } catch (error) {
      toast.error('Failed to update request');
    }
  };

  return (
    <DashboardLayout role="admin" userName="Admin User" userEmail="admin@example.com">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Goodies & Inventory</h1>
          <p className="text-slate-600 mt-2">Manage goodies allocation and inventory for events</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by event or organizer..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Current Inventory */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Current Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(inventory).map(([item, stock]) => (
              <Card key={item} className="p-4 border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{item}</h3>
                  <Package className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600 mb-1">
                  Available: <span className="font-semibold text-slate-900">{stock.available}</span>
                </p>
                <p className="text-sm text-slate-600">
                  Allocated: <span className="font-semibold text-slate-900">{stock.allocated}</span>
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Requests */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Goodies Requests</h2>
          <div className="space-y-4">
            {filtered.map((request) => (
              <Card key={request.id} className="p-6 border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-600">Event</p>
                    <p className="text-lg font-semibold text-slate-900">{request.event}</p>
                    <p className="text-sm text-slate-500">{request.organizer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Requested Items</p>
                    {request.items.map((item, idx) => (
                      <p key={idx} className="text-sm text-slate-900">
                        {item.name} × {item.quantityRequested}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    {!canApprove(request) && request.status === 'pending' && (
                      <span className="text-xs text-red-600 font-medium">Insufficient inventory</span>
                    )}
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction(request, 'approve')}
                        disabled={!canApprove(request)}
                        className="text-green-600"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction(request, 'reject')}
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
              <p className="text-slate-500">No goodies requests found</p>
            </Card>
          )}
        </div>
      </div>

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Goodies Request' : 'Reject Goodies Request'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-900">{selectedRequest?.event}</p>
              <div className="mt-2 space-y-1">
                {selectedRequest?.items.map((item, idx) => (
                  <p key={idx} className="text-sm text-slate-600">
                    {item.name} × {item.quantityRequested}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitAction}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
