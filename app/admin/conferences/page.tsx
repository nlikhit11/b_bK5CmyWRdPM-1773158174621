'use client';

import { useState } from 'react';
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
import { Calendar, MapPin, Users, Search, Eye, Archive, Grid, LayoutList } from 'lucide-react';
import { toast } from 'sonner';
import type { Conference } from '@/lib/types';

// Mock data
const mockConferences: Conference[] = [
  {
    id: '1',
    organizer_id: 'org1',
    title: 'Tech Summit 2024',
    description: 'Annual technology conference featuring AI, Cloud, and Web3',
    date: '2024-06-15',
    venue: 'Convention Center',
    expected_attendees: 500,
    status: 'approved',
    created_at: '2024-01-01',
    updated_at: '2024-01-15',
  },
  {
    id: '2',
    organizer_id: 'org2',
    title: 'AI Workshop Series',
    description: 'Deep dive into AI technologies and applications',
    date: '2024-07-20',
    venue: 'Tech Park',
    expected_attendees: 150,
    status: 'pending',
    created_at: '2024-01-05',
    updated_at: '2024-01-05',
  },
  {
    id: '3',
    organizer_id: 'org1',
    title: 'Digital Forum 2024',
    description: 'Exploring digital transformation in business',
    date: '2024-05-10',
    venue: 'Business Center',
    expected_attendees: 300,
    status: 'completed',
    created_at: '2023-12-15',
    updated_at: '2024-05-10',
  },
  {
    id: '4',
    organizer_id: 'org3',
    title: 'Web Development Conference',
    description: 'Latest trends in web development',
    date: '2024-08-05',
    venue: 'Tech Hub',
    expected_attendees: 250,
    status: 'rejected',
    feedback: 'Requested room capacity exceeds venue limits',
    created_at: '2024-01-08',
    updated_at: '2024-01-12',
  },
];

export default function AdminConferencesPage() {
  const [conferences, setConferences] = useState<Conference[]>(mockConferences);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all');
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const filteredConferences = conferences.filter((conf) => {
    const matchesSearch =
      conf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conf.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || conf.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleArchiveConference = (id: string) => {
    setConferences(
      conferences.map((c) =>
        c.id === id ? { ...c, status: 'completed' } : c
      )
    );
    toast.success('Conference archived');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const getMetrics = () => {
    return {
      total: conferences.length,
      approved: conferences.filter((c) => c.status === 'approved').length,
      pending: conferences.filter((c) => c.status === 'pending').length,
      completed: conferences.filter((c) => c.status === 'completed').length,
      rejected: conferences.filter((c) => c.status === 'rejected').length,
      totalAttendees: conferences.reduce((sum, c) => sum + c.expected_attendees, 0),
    };
  };

  const metrics = getMetrics();

  return (
    <DashboardLayout role="admin" userName="Admin User" userEmail="admin@example.com">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">All Conferences</h1>
          <p className="text-slate-600 mt-1">View and manage all conferences in the system</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="p-4 border-slate-200">
            <p className="text-slate-600 text-xs font-medium">Total</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{metrics.total}</p>
          </Card>
          <Card className="p-4 border-slate-200">
            <p className="text-slate-600 text-xs font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">{metrics.pending}</p>
          </Card>
          <Card className="p-4 border-slate-200">
            <p className="text-slate-600 text-xs font-medium">Approved</p>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{metrics.approved}</p>
          </Card>
          <Card className="p-4 border-slate-200">
            <p className="text-slate-600 text-xs font-medium">Completed</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{metrics.completed}</p>
          </Card>
          <Card className="p-4 border-slate-200">
            <p className="text-slate-600 text-xs font-medium">Rejected</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{metrics.rejected}</p>
          </Card>
          <Card className="p-4 border-slate-200">
            <p className="text-slate-600 text-xs font-medium">Total Attendees</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">{metrics.totalAttendees}</p>
          </Card>
          <Card className="p-4 border-slate-200">
            <p className="text-slate-600 text-xs font-medium">Attendees</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">{metrics.totalAttendees.toLocaleString()}</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by title or venue..."
              className="pl-10 bg-white border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value: any) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-48 bg-white border-slate-200">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 items-center">
          <span className="text-sm text-slate-600 font-medium">View:</span>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="gap-2"
          >
            <LayoutList className="w-4 h-4" />
            List
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="gap-2"
          >
            <Grid className="w-4 h-4" />
            Calendar
          </Button>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConferences.map((conference) => (
              <Card key={conference.id} className={`p-4 border-slate-200 hover:shadow-lg transition-shadow cursor-pointer ${
                conference.status === 'approved' ? 'border-green-200 bg-green-50' :
                conference.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
                conference.status === 'rejected' ? 'border-red-200 bg-red-50' :
                'border-blue-200 bg-blue-50'
              }`}>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{conference.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{conference.description}</p>
                  </div>
                  
                  <div className="space-y-2 border-t border-slate-200 pt-3">
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-700">{new Date(conference.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-700">{conference.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Users className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-700">{conference.expected_attendees} expected</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      conference.status === 'approved' ? 'bg-green-200 text-green-800' :
                      conference.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                      conference.status === 'rejected' ? 'bg-red-200 text-red-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {getStatusLabel(conference.status)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewingId(conference.id)}
                      className="h-6 px-2"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Conferences Table */}
        {viewMode === 'list' && (
        <Card className="border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Conference</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Venue</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Expected</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredConferences.map((conference) => (
                  <tr key={conference.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{conference.title}</p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">{conference.description}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(conference.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{conference.venue}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {conference.expected_attendees}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          conference.status
                        )}`}
                      >
                        {getStatusLabel(conference.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Dialog open={viewingId === conference.id} onOpenChange={(open) => !open && setViewingId(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewingId(conference.id)}
                              className="gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">Details</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{conference.title}</DialogTitle>
                              <DialogDescription>{conference.description}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-slate-600 font-medium">Date</p>
                                  <p className="text-sm text-slate-900 mt-1 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(conference.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-600 font-medium">Venue</p>
                                  <p className="text-sm text-slate-900 mt-1 flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {conference.venue}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-600 font-medium">Expected Attendees</p>
                                  <p className="text-sm text-slate-900 mt-1 flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {conference.expected_attendees}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-600 font-medium">Status</p>
                                  <span
                                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full border mt-1 ${getStatusColor(
                                      conference.status
                                    )}`}
                                  >
                                    {getStatusLabel(conference.status)}
                                  </span>
                                </div>
                              </div>

                              {conference.feedback && (
                                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                  <p className="text-xs text-red-600 font-medium mb-2">Feedback</p>
                                  <p className="text-sm text-red-900">{conference.feedback}</p>
                                </div>
                              )}

                              <div className="bg-slate-50 p-4 rounded-lg">
                                <p className="text-xs text-slate-600 font-medium mb-2">Created</p>
                                <p className="text-sm text-slate-900">
                                  {new Date(conference.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {conference.status !== 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleArchiveConference(conference.id)}
                            className="gap-1 text-slate-600 hover:text-slate-700"
                          >
                            <Archive className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        )}

        {filteredConferences.length === 0 && (
          <Card className="p-12 border-slate-200 text-center">
            <p className="text-slate-600">No conferences found matching your filters.</p>
          </Card>
        )}

        {/* Summary Stats */}
        <Card className="p-6 border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-900 mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-600">Avg Attendees</p>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {Math.round(metrics.totalAttendees / metrics.total) || 0}
              </p>
            </div>
            <div>
              <p className="text-slate-600">Approval Rate</p>
              <p className="text-xl font-bold text-emerald-600 mt-1">
                {metrics.total ? Math.round((metrics.approved / metrics.total) * 100) : 0}%
              </p>
            </div>
            <div>
              <p className="text-slate-600">Completion Rate</p>
              <p className="text-xl font-bold text-blue-600 mt-1">
                {metrics.total ? Math.round((metrics.completed / metrics.total) * 100) : 0}%
              </p>
            </div>
            <div>
              <p className="text-slate-600">Rejection Rate</p>
              <p className="text-xl font-bold text-red-600 mt-1">
                {metrics.total ? Math.round((metrics.rejected / metrics.total) * 100) : 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
