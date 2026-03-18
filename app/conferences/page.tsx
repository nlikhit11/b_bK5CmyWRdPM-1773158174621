'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, ArrowLeft, Search, Filter, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Conference {
  id: string;
  name: string;
  date: string;
  venue: string;
  speakers: number;
  description: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrationDeadline?: string;
  expectedAttendees: number;
  category?: string;
}

// Mock conferences - in production these would come from the database
const mockConferences: Conference[] = [
  {
    id: '1',
    name: 'Tech Summit 2026',
    date: 'March 15-17, 2026',
    venue: 'San Francisco, CA',
    speakers: 12,
    description: 'Join industry leaders for cutting-edge technology discussions on AI, Cloud, and Web3.',
    status: 'upcoming',
    registrationDeadline: '2026-03-10',
    expectedAttendees: 500,
    category: 'Technology',
  },
  {
    id: '2',
    name: 'Digital Innovation Forum',
    date: 'April 5-7, 2026',
    venue: 'New York, NY',
    speakers: 18,
    description: 'Network with innovators and discover digital transformation strategies.',
    status: 'upcoming',
    registrationDeadline: '2026-04-01',
    expectedAttendees: 400,
    category: 'Business',
  },
  {
    id: '3',
    name: 'AI & Machine Learning Conference',
    date: 'May 10-12, 2026',
    venue: 'Austin, TX',
    speakers: 15,
    description: 'Explore the latest in artificial intelligence and machine learning applications.',
    status: 'upcoming',
    registrationDeadline: '2026-05-05',
    expectedAttendees: 350,
    category: 'Technology',
  },
  {
    id: '4',
    name: 'Web Development Summit 2025',
    date: 'December 10-12, 2025',
    venue: 'Seattle, WA',
    speakers: 10,
    description: 'Learn about the latest web development frameworks and best practices.',
    status: 'completed',
    expectedAttendees: 300,
    category: 'Technology',
  },
  {
    id: '5',
    name: 'Data Science Conference',
    date: 'January 20-22, 2026',
    venue: 'Boston, MA',
    speakers: 14,
    description: 'Deep dive into data analytics, visualization, and statistical methods.',
    status: 'ongoing',
    expectedAttendees: 280,
    category: 'Data Science',
  },
  {
    id: '6',
    name: 'Cybersecurity Forum 2026',
    date: 'June 5-7, 2026',
    venue: 'Washington, DC',
    speakers: 20,
    description: 'Stay ahead of threats with insights from top security experts.',
    status: 'upcoming',
    registrationDeadline: '2026-06-01',
    expectedAttendees: 450,
    category: 'Security',
  },
];

export default function ConferencesPage() {
  const router = useRouter();
  const [conferences, setConferences] = useState<Conference[]>(mockConferences);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = ['Technology', 'Business', 'Data Science', 'Security'];

  const filteredConferences = conferences.filter((conf) => {
    const matchesSearch = conf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conf.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conf.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || conf.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || conf.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleRegister = (conferenceId: string) => {
    router.push(`/login?redirect=/attendee/conferences&action=register&conferenceId=${conferenceId}`);
  };

  const handleViewDetails = (conferenceId: string) => {
    router.push(`/conferences/${conferenceId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Upcoming</Badge>;
      case 'ongoing':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ongoing</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Completed</Badge>;
      default:
        return null;
    }
  };

  const upcomingCount = conferences.filter(c => c.status === 'upcoming').length;
  const ongoingCount = conferences.filter(c => c.status === 'ongoing').length;
  const completedCount = conferences.filter(c => c.status === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              CE
            </div>
            <span className="font-semibold text-slate-900">ConferenceHub</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">All Conferences</h1>
          <p className="text-xl text-slate-600">Discover and register for upcoming events</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 border-slate-200 bg-blue-50">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{upcomingCount}</p>
              <p className="text-sm text-slate-600">Upcoming Events</p>
            </div>
          </Card>
          <Card className="p-4 border-slate-200 bg-green-50">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{ongoingCount}</p>
              <p className="text-sm text-slate-600">Ongoing Events</p>
            </div>
          </Card>
          <Card className="p-4 border-slate-200 bg-slate-100">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-600">{completedCount}</p>
              <p className="text-sm text-slate-600">Completed Events</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search conferences by name, venue, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Conference Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {filteredConferences.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600">No conferences found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            filteredConferences.map((conference) => (
              <Card key={conference.id} className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200 flex flex-col">
                <div className={`h-32 ${
                  conference.status === 'completed' 
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500' 
                    : conference.status === 'ongoing'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                }`}></div>
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    {getStatusBadge(conference.status)}
                    {conference.category && (
                      <Badge variant="outline" className="text-xs">{conference.category}</Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{conference.name}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2 flex-1">{conference.description}</p>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {conference.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {conference.venue}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {conference.speakers} speakers | {conference.expectedAttendees} attendees
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 mt-auto">
                    {conference.status !== 'completed' ? (
                      <>
                        <Button 
                          className="flex-1" 
                          size="sm"
                          onClick={() => handleRegister(conference.id)}
                        >
                          Register
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(conference.id)}
                        >
                          Details
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => handleViewDetails(conference.id)}
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
