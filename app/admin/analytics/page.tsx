'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', events: 4, attendees: 240, revenue: 12000 },
  { month: 'Feb', events: 3, attendees: 180, revenue: 9000 },
  { month: 'Mar', events: 6, attendees: 420, revenue: 21000 },
  { month: 'Apr', events: 5, attendees: 320, revenue: 16000 },
  { month: 'May', events: 8, attendees: 560, revenue: 28000 },
  { month: 'Jun', events: 7, attendees: 480, revenue: 24000 },
];

const eventTypeData = [
  { name: 'Conference', value: 32, fill: '#3b82f6' },
  { name: 'Workshop', value: 18, fill: '#6366f1' },
  { name: 'Seminar', value: 24, fill: '#a855f7' },
  { name: 'Meetup', value: 16, fill: '#ec4899' },
];

const speakerData = [
  { name: 'Accepted', value: 64, fill: '#10b981' },
  { name: 'Pending', value: 24, fill: '#f59e0b' },
  { name: 'Rejected', value: 12, fill: '#ef4444' },
];

const stats = [
  {
    label: 'Total Events',
    value: '90',
    change: '+12%',
    icon: Calendar,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    label: 'Total Attendees',
    value: '2,450',
    change: '+8%',
    icon: Users,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    label: 'Revenue',
    value: '$110K',
    change: '+15%',
    icon: DollarSign,
    color: 'bg-green-100 text-green-600',
  },
  {
    label: 'Growth',
    value: '24%',
    change: '+5%',
    icon: TrendingUp,
    color: 'bg-orange-100 text-orange-600',
  },
];

export default function AnalyticsPage() {
  return (
    <DashboardLayout role="admin" userName="Admin User" userEmail="admin@example.com">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-600 mt-2">Platform statistics and performance metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="p-6 border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                    <p className="text-xs text-green-600 font-medium mt-2">{stat.change} from last month</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Events by Month */}
          <Card className="p-6 border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Events by Month</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="events" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Attendance Growth */}
          <Card className="p-6 border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Attendance Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="attendees" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Event Types Distribution */}
          <Card className="p-6 border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Event Types</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Speaker Status */}
          <Card className="p-6 border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Speaker Responses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={speakerData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {speakerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Revenue Trend */}
          <Card className="p-6 border-slate-200 lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
