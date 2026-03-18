'use client';

import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Users, CheckCircle2, AlertCircle, BookOpen, Clock, ExternalLink } from 'lucide-react';

const chartData = [
  { month: 'Jan', events: 4, attendees: 240 },
  { month: 'Feb', events: 3, attendees: 180 },
  { month: 'Mar', events: 6, attendees: 420 },
  { month: 'Apr', events: 5, attendees: 320 },
  { month: 'May', events: 8, attendees: 560 },
  { month: 'Jun', events: 7, attendees: 480 },
];

const metrics = [
  { label: 'Total Events', value: '32', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
  { label: 'Pending Approvals', value: '5', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-600' },
  { label: 'Active Conferences', value: '12', icon: CheckCircle2, color: 'bg-green-100 text-green-600' },
  { label: 'Total Attendees', value: '2,450', icon: Users, color: 'bg-purple-100 text-purple-600' },
];

const recentApprovals = [
  { id: 1, eventName: 'Tech Summit 2026', organizer: 'John Smith', date: 'Mar 15-17', status: 'pending', rooms: 5, speakers: 12 },
  { id: 2, eventName: 'AI Conference', organizer: 'Jane Doe', date: 'May 10-12', status: 'pending', rooms: 4, speakers: 8 },
  { id: 3, eventName: 'Digital Forum', organizer: 'Bob Johnson', date: 'Apr 5-7', status: 'approved', rooms: 3, speakers: 6 },
];

export default function AdminDashboard() {
  const router = useRouter();

  const handleReview = (approvalId: number) => {
    router.push('/admin/approvals');
  };

  return (
    <DashboardLayout role="admin" userName="Admin User" userEmail="admin@example.com">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">Welcome back! Here's your conference management overview.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="p-6 border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{metric.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{metric.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${metric.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Events per Month */}
          <Card className="p-6 border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Events per Month</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="events" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Attendance Trends */}
          <Card className="p-6 border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Attendance Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="attendees" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Approvals */}
        <Card className="p-6 border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Approval Requests</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/admin/approvals')}
            >
              View All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">Event Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">Organizer</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">Rooms</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">Speakers</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentApprovals.map((approval) => (
                  <tr key={approval.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 text-sm text-slate-900 font-medium">{approval.eventName}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{approval.organizer}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{approval.date}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{approval.rooms}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{approval.speakers}</td>
                    <td className="py-4 px-4 text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        approval.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {approval.status === 'pending' ? <Clock className="w-3 h-3 mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReview(approval.id)}
                        className="gap-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
