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
import { Search, Eye, Edit, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';

interface PaperSubmission {
  id: string;
  title: string;
  conference: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  presentationType: 'oral' | 'poster';
  authors: number;
  feedback?: string;
}

const mockSubmissions: PaperSubmission[] = [
  {
    id: '1',
    title: 'AI-Powered Data Analytics Platform',
    conference: 'Tech Summit 2024',
    submissionDate: '2024-01-15',
    status: 'approved',
    presentationType: 'oral',
    authors: 3,
  },
  {
    id: '2',
    title: 'Quantum Computing Applications',
    conference: 'AI Conference 2024',
    submissionDate: '2024-01-18',
    status: 'pending',
    presentationType: 'oral',
    authors: 2,
  },
  {
    id: '3',
    title: 'Blockchain in Supply Chain',
    conference: 'Digital Forum 2024',
    submissionDate: '2024-01-20',
    status: 'pending',
    presentationType: 'poster',
    authors: 4,
    feedback: 'Requires revision - please address concerns in feedback document',
  },
  {
    id: '4',
    title: 'Machine Learning for Healthcare',
    conference: 'Tech Summit 2024',
    submissionDate: '2024-01-10',
    status: 'rejected',
    presentationType: 'oral',
    authors: 2,
    feedback: 'Does not align with conference focus areas',
  },
];

export default function PaperSubmissionsPage() {
  const [submissions, setSubmissions] = useState<PaperSubmission[]>(mockSubmissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [viewingId, setViewingId] = useState<string | null>(null);

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.conference.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteSubmission = (id: string) => {
    setSubmissions(submissions.filter((s) => s.id !== id));
    toast.success('Submission deleted');
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending Review';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <DashboardLayout role="paper_presenter" userName="Dr. John Research" userEmail="presenter@example.com">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Submissions</h1>
          <p className="text-slate-600 mt-1">Track and manage your paper submissions</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search papers or conferences..."
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
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submissions Table */}
        <Card className="border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Paper Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Conference</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Authors</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 text-sm line-clamp-2">{submission.title}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{submission.conference}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{submission.authors}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                      {submission.presentationType === 'oral' ? 'Oral' : 'Poster'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          submission.status
                        )}`}
                      >
                        {getStatusLabel(submission.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Dialog open={viewingId === submission.id} onOpenChange={(open) => !open && setViewingId(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewingId(submission.id)}
                              className="gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>{submission.title}</DialogTitle>
                              <DialogDescription>{submission.conference}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 text-sm">
                              <div>
                                <p className="text-slate-600 font-medium">Submission Date</p>
                                <p className="text-slate-900 mt-1">
                                  {new Date(submission.submissionDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-600 font-medium">Authors</p>
                                <p className="text-slate-900 mt-1">{submission.authors}</p>
                              </div>
                              <div>
                                <p className="text-slate-600 font-medium">Presentation Type</p>
                                <p className="text-slate-900 mt-1 capitalize">
                                  {submission.presentationType === 'oral'
                                    ? 'Oral Presentation'
                                    : 'Poster Presentation'}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-600 font-medium">Status</p>
                                <span
                                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full border mt-1 ${getStatusColor(
                                    submission.status
                                  )}`}
                                >
                                  {getStatusLabel(submission.status)}
                                </span>
                              </div>

                              {submission.feedback && (
                                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                                  <p className="text-xs text-yellow-600 mb-2 font-medium">Organizer Feedback</p>
                                  <p className="text-sm text-yellow-900">{submission.feedback}</p>
                                </div>
                              )}

                              <div className="flex gap-2 pt-4 border-t border-slate-200">
                                {submission.status === 'pending' && (
                                  <Button variant="outline" size="sm" className="flex-1">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </Button>
                                )}
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {submission.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-blue-600 hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSubmission(submission.id)}
                              className="gap-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredSubmissions.length === 0 && (
          <Card className="p-12 border-slate-200 text-center">
            <p className="text-slate-600 mb-4">No submissions found.</p>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Submit Your First Paper
            </Button>
          </Card>
        )}

        {/* Summary Stats */}
        <Card className="p-6 border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-900 mb-4">Summary</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold text-slate-900">{submissions.length}</p>
              <p className="text-sm text-slate-600">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {submissions.filter((s) => s.status === 'pending').length}
              </p>
              <p className="text-sm text-slate-600">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">
                {submissions.filter((s) => s.status === 'approved').length}
              </p>
              <p className="text-sm text-slate-600">Approved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {submissions.filter((s) => s.status === 'rejected').length}
              </p>
              <p className="text-sm text-slate-600">Rejected</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
