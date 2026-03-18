'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, CheckCircle2, X, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface EventApproval {
  id: number;
  eventName: string;
  organizer: string;
  date: string;
  venue: string;
  expectedAttendees: number;
  roomsRequested: number;
  speakers: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  feedback?: string;
}

const mockApprovals: EventApproval[] = [
  {
    id: 1,
    eventName: 'Tech Summit 2026',
    organizer: 'John Smith',
    date: 'Mar 15-17, 2026',
    venue: 'San Francisco Convention Center',
    expectedAttendees: 500,
    roomsRequested: 5,
    speakers: 12,
    status: 'pending',
    submittedDate: '2026-03-01',
  },
  {
    id: 2,
    eventName: 'AI Conference',
    organizer: 'Jane Doe',
    date: 'May 10-12, 2026',
    venue: 'Austin Convention Center',
    expectedAttendees: 300,
    roomsRequested: 4,
    speakers: 8,
    status: 'pending',
    submittedDate: '2026-03-02',
  },
  {
    id: 3,
    eventName: 'Digital Forum',
    organizer: 'Bob Johnson',
    date: 'Apr 5-7, 2026',
    venue: 'New York Hilton',
    expectedAttendees: 400,
    roomsRequested: 3,
    speakers: 6,
    status: 'approved',
    submittedDate: '2026-02-20',
    feedback: 'Approved with additional meeting room allocated.',
  },
];

export default function EventApprovalsPage() {
  const [approvals, setApprovals] = useState(mockApprovals);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApproval, setSelectedApproval] = useState<EventApproval | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'modify'>('approve');
  const [feedbackText, setFeedbackText] = useState('');

  const filtered = approvals.filter((approval) => {
    const matchesSearch =
      approval.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || approval.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (approval: EventApproval, type: 'approve' | 'reject' | 'modify') => {
    setSelectedApproval(approval);
    setActionType(type);
    setFeedbackText('');
    setDialogOpen(true);
  };

  const submitAction = async () => {
    if (!selectedApproval) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedApprovals = approvals.map((a) => {
        if (a.id === selectedApproval.id) {
          return {
            ...a,
            status: actionType === 'approve' ? 'approved' : actionType === 'reject' ? 'rejected' : a.status,
            feedback: feedbackText || a.feedback,
          };
        }
        return a;
      });

      setApprovals(updatedApprovals);
      setDialogOpen(false);

      const actionMessages = {
        approve: 'Event approved successfully!',
        reject: 'Event rejected.',
        modify: 'Modification request sent to organizer.',
      };

      toast.success(actionMessages[actionType]);
    } catch (error) {
      toast.error('Failed to update approval status');
    }
  };

  return (
    <DashboardLayout role="admin" userName="Admin User" userEmail="admin@example.com">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Event Approvals</h1>
          <p className="text-slate-600 mt-2">Review and approve conference requests</p>
        </div>

        {/* Filters and Search */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by event name or organizer..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
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

        {/* Approvals Table */}
        <Card className="border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600">Event Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600">Organizer</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600">Venue</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600">Expected Attendees</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600">Rooms / Speakers</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((approval) => (
                  <tr key={approval.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-slate-900">{approval.eventName}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{approval.organizer}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{approval.date}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{approval.venue}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{approval.expectedAttendees}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{approval.roomsRequested} / {approval.speakers}</td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        approval.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : approval.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {approval.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(approval, 'approve')}
                            className="text-green-600 hover:text-green-700"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(approval, 'reject')}
                            className="text-red-600 hover:text-red-700"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {approval.feedback && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAction(approval, 'modify')}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Empty state */}
        {filtered.length === 0 && (
          <Card className="p-12 border-slate-200 text-center">
            <p className="text-slate-500">No approvals found matching your filters</p>
          </Card>
        )}
      </div>

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve'
                ? 'Approve Event'
                : actionType === 'reject'
                ? 'Reject Event'
                : 'Request Modifications'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-900 mb-2">Event: {selectedApproval?.eventName}</p>
              <p className="text-sm text-slate-600">Organizer: {selectedApproval?.organizer}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">
                {actionType === 'approve'
                  ? 'Approval Notes (Optional)'
                  : actionType === 'reject'
                  ? 'Rejection Reason'
                  : 'Modifications Required'}
              </Label>
              <Textarea
                id="feedback"
                placeholder="Enter your feedback or notes..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitAction}
              className={
                actionType === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : actionType === 'reject'
                  ? 'bg-red-600 hover:bg-red-700'
                  : ''
              }
            >
              {actionType === 'approve'
                ? 'Approve Event'
                : actionType === 'reject'
                ? 'Reject Event'
                : 'Send Feedback'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
