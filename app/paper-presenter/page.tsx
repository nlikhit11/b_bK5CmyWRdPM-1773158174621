'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'lucide-react';
import { useState } from 'react';

interface SubmissionStats {
  totalSubmissions: number;
  approved: number;
  pending: number;
  rejected: number;
}

export default function PaperPresenterDashboard() {
  const [stats] = useState<SubmissionStats>({
    totalSubmissions: 3,
    approved: 1,
    pending: 2,
    rejected: 0,
  });

  const recentSubmissions = [
    {
      id: '1',
      title: 'AI-Powered Data Analytics Platform',
      conference: 'Tech Summit 2024',
      submissionDate: '2024-01-15',
      status: 'approved',
      presentationType: 'oral',
    },
    {
      id: '2',
      title: 'Quantum Computing Applications',
      conference: 'AI Conference 2024',
      submissionDate: '2024-01-18',
      status: 'pending',
      presentationType: 'oral',
    },
    {
      id: '3',
      title: 'Blockchain in Supply Chain',
      conference: 'Digital Forum 2024',
      submissionDate: '2024-01-20',
      status: 'pending',
      presentationType: 'poster',
    },
  ];

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

  return (
    <DashboardLayout role="paper_presenter" userName="Dr. John Research" userEmail="presenter@example.com">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome, Paper Presenter</h1>
          <p className="text-slate-600 mt-2">Submit and manage your research papers for conferences</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 border-slate-200 hover:shadow-md transition-shadow">
            <p className="text-slate-600 text-sm font-medium">Total Submissions</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalSubmissions}</p>
          </Card>
          <Card className="p-6 border-slate-200 hover:shadow-md transition-shadow">
            <p className="text-slate-600 text-sm font-medium">Approved</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.approved}</p>
          </Card>
          <Card className="p-6 border-slate-200 hover:shadow-md transition-shadow">
            <p className="text-slate-600 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
          </Card>
          <Card className="p-6 border-slate-200 hover:shadow-md transition-shadow">
            <p className="text-slate-600 text-sm font-medium">Rejected</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-8 border-slate-200 border-dashed flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Link className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Submit a Paper</h3>
            <p className="text-slate-600 text-sm mb-6">Ready to present your research? Start a new submission.</p>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              New Submission
            </Button>
          </Card>

          <Card className="p-8 border-slate-200 border-dashed flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Link className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">View All Submissions</h3>
            <p className="text-slate-600 text-sm mb-6">Track the status of all your paper submissions.</p>
            <Button variant="outline">
              Go to Submissions
            </Button>
          </Card>
        </div>

        {/* Recent Submissions */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Recent Submissions</h2>
          <Card className="border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Paper Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Conference</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 text-sm">{submission.title}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{submission.conference}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 capitalize">{submission.presentationType}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                            submission.status
                          )}`}
                        >
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(submission.submissionDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Tips */}
        <Card className="p-6 border-slate-200 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-slate-900 mb-3">Tips for a Successful Submission</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>✓ Ensure your paper follows the conference format guidelines</li>
            <li>✓ Include all authors and their affiliations</li>
            <li>✓ Provide a clear abstract summarizing your research</li>
            <li>✓ Double-check for spelling and grammar errors</li>
            <li>✓ Meet the submission deadline</li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
}
