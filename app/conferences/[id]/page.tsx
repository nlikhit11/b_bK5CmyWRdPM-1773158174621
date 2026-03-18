'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft, 
  ExternalLink,
  CheckCircle,
  User
} from 'lucide-react';

interface Speaker {
  id: string;
  name: string;
  organization: string;
  topic: string;
  bio: string;
  profileUrl?: string;
}

interface Conference {
  id: string;
  name: string;
  date: string;
  venue: string;
  description: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrationDeadline?: string;
  expectedAttendees: number;
  speakers: Speaker[];
  schedule?: {
    day: string;
    events: { time: string; title: string; speaker?: string }[];
  }[];
}

// Mock conference data - in production this would come from the database
const mockConferences: Record<string, Conference> = {
  '1': {
    id: '1',
    name: 'Tech Summit 2026',
    date: 'March 15-17, 2026',
    venue: 'San Francisco Convention Center, CA',
    description: 'Join industry leaders for cutting-edge technology discussions on AI, Cloud, and Web3. This three-day summit brings together the brightest minds in technology to share insights, innovations, and visions for the future. Expect deep-dive sessions, hands-on workshops, and unparalleled networking opportunities.',
    status: 'upcoming',
    registrationDeadline: '2026-03-10',
    expectedAttendees: 500,
    speakers: [
      { id: '1', name: 'Dr. Sarah Johnson', organization: 'TechCorp AI Labs', topic: 'Future of AI in Enterprise', bio: 'Leading AI researcher with 15 years of experience', profileUrl: 'https://example.com/speakers/sarah-johnson' },
      { id: '2', name: 'Prof. Michael Chen', organization: 'University of Technology', topic: 'Machine Learning Applications', bio: 'Professor and ML specialist', profileUrl: 'https://example.com/speakers/michael-chen' },
      { id: '3', name: 'Emily Rodriguez', organization: 'Innovation Ventures', topic: 'Startup Ecosystem', bio: 'Entrepreneur and venture capital advisor', profileUrl: 'https://example.com/speakers/emily-rodriguez' },
    ],
    schedule: [
      {
        day: 'Day 1 - March 15',
        events: [
          { time: '09:00 AM', title: 'Registration & Welcome Coffee' },
          { time: '10:00 AM', title: 'Opening Keynote: Future of AI in Enterprise', speaker: 'Dr. Sarah Johnson' },
          { time: '12:00 PM', title: 'Networking Lunch' },
          { time: '02:00 PM', title: 'Workshop: Machine Learning Applications', speaker: 'Prof. Michael Chen' },
          { time: '05:00 PM', title: 'Day 1 Wrap-up' },
        ],
      },
      {
        day: 'Day 2 - March 16',
        events: [
          { time: '09:00 AM', title: 'Morning Coffee & Networking' },
          { time: '10:00 AM', title: 'Panel: Startup Ecosystem Insights', speaker: 'Emily Rodriguez' },
          { time: '12:00 PM', title: 'Lunch Break' },
          { time: '02:00 PM', title: 'Breakout Sessions' },
          { time: '06:00 PM', title: 'Evening Gala Dinner' },
        ],
      },
      {
        day: 'Day 3 - March 17',
        events: [
          { time: '09:00 AM', title: 'Final Day Sessions' },
          { time: '12:00 PM', title: 'Closing Keynote' },
          { time: '02:00 PM', title: 'Certificate Distribution & Farewell' },
        ],
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Digital Innovation Forum',
    date: 'April 5-7, 2026',
    venue: 'New York Hilton, NY',
    description: 'Network with innovators and discover digital transformation strategies. This forum focuses on how businesses can leverage digital technologies to drive growth, improve efficiency, and create new value propositions.',
    status: 'upcoming',
    registrationDeadline: '2026-04-01',
    expectedAttendees: 400,
    speakers: [
      { id: '4', name: 'James Wilson', organization: 'Digital Futures Inc', topic: 'Digital Transformation Roadmap', bio: 'Digital transformation consultant', profileUrl: 'https://example.com/speakers/james-wilson' },
      { id: '5', name: 'Lisa Park', organization: 'CloudScale Solutions', topic: 'Cloud-First Architecture', bio: 'Cloud architect and strategist', profileUrl: 'https://example.com/speakers/lisa-park' },
    ],
    schedule: [
      {
        day: 'Day 1 - April 5',
        events: [
          { time: '09:00 AM', title: 'Registration' },
          { time: '10:00 AM', title: 'Opening Session', speaker: 'James Wilson' },
          { time: '02:00 PM', title: 'Cloud Architecture Workshop', speaker: 'Lisa Park' },
        ],
      },
    ],
  },
  '3': {
    id: '3',
    name: 'AI & Machine Learning Conference',
    date: 'May 10-12, 2026',
    venue: 'Austin Convention Center, TX',
    description: 'Explore the latest in artificial intelligence and machine learning applications. From neural networks to natural language processing, this conference covers the full spectrum of AI technologies.',
    status: 'upcoming',
    registrationDeadline: '2026-05-05',
    expectedAttendees: 350,
    speakers: [
      { id: '6', name: 'Dr. Alex Kim', organization: 'AI Research Lab', topic: 'Deep Learning Advances', bio: 'AI researcher specializing in deep learning', profileUrl: 'https://example.com/speakers/alex-kim' },
      { id: '7', name: 'Dr. Rachel Green', organization: 'Neural Systems', topic: 'NLP in Production', bio: 'NLP expert with industry experience', profileUrl: 'https://example.com/speakers/rachel-green' },
    ],
    schedule: [
      {
        day: 'Day 1 - May 10',
        events: [
          { time: '09:00 AM', title: 'Welcome & Registration' },
          { time: '10:00 AM', title: 'Deep Learning Advances', speaker: 'Dr. Alex Kim' },
          { time: '02:00 PM', title: 'NLP Workshop', speaker: 'Dr. Rachel Green' },
        ],
      },
    ],
  },
};

export default function ConferenceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    // Simulate loading from database
    setTimeout(() => {
      const conf = mockConferences[id];
      setConference(conf || null);
      setLoading(false);
    }, 100);
  }, [params.id]);

  const handleRegister = () => {
    router.push(`/login?redirect=/attendee/conferences&action=register&conferenceId=${conference?.id}`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-600">Loading conference details...</div>
      </div>
    );
  }

  if (!conference) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Conference Not Found</h1>
        <p className="text-slate-600">The conference you are looking for does not exist.</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

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
        <Link href="/conferences" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Conferences
        </Link>
      </div>

      {/* Conference Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {getStatusBadge(conference.status)}
              </div>
              <h1 className="text-4xl font-bold">{conference.name}</h1>
              <div className="flex flex-wrap gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {conference.date}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {conference.venue}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {conference.expectedAttendees} expected attendees
                </div>
              </div>
            </div>
            {conference.status !== 'completed' && (
              <div className="flex flex-col gap-3">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  onClick={handleRegister}
                >
                  Register Now
                </Button>
                {conference.registrationDeadline && (
                  <p className="text-sm text-blue-100 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Registration deadline: {new Date(conference.registrationDeadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card className="p-8 border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Conference</h2>
              <p className="text-slate-600 leading-relaxed">{conference.description}</p>
            </Card>

            {/* Schedule */}
            {conference.schedule && conference.schedule.length > 0 && (
              <Card className="p-8 border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Schedule</h2>
                <div className="space-y-8">
                  {conference.schedule.map((day, dayIndex) => (
                    <div key={dayIndex}>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                        {day.day}
                      </h3>
                      <div className="space-y-4">
                        {day.events.map((event, eventIndex) => (
                          <div key={eventIndex} className="flex gap-4">
                            <div className="w-24 flex-shrink-0 text-sm font-medium text-slate-600">
                              {event.time}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{event.title}</p>
                              {event.speaker && (
                                <p className="text-sm text-slate-600 mt-1">Speaker: {event.speaker}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Speakers */}
            <Card className="p-8 border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Featured Speakers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {conference.speakers.map((speaker) => (
                  <div key={speaker.id} className="bg-slate-50 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{speaker.name}</h3>
                          {speaker.profileUrl && (
                            <a 
                              href={speaker.profileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">{speaker.organization}</p>
                        <p className="text-sm font-medium text-blue-600 mt-2">{speaker.topic}</p>
                        <p className="text-sm text-slate-500 mt-1">{speaker.bio}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            {conference.status !== 'completed' && (
              <Card className="p-6 border-slate-200 sticky top-24">
                <h3 className="font-semibold text-slate-900 mb-4">Register for this event</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Access to all sessions
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Networking opportunities
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Certificate of participation
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Conference materials
                  </div>
                  <Button className="w-full mt-4" onClick={handleRegister}>
                    Register Now
                  </Button>
                </div>
              </Card>
            )}

            {/* Venue Info */}
            <Card className="p-6 border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Venue Details</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">{conference.venue.split(',')[0]}</p>
                    <p className="text-sm text-slate-600">{conference.venue.split(',').slice(1).join(',').trim()}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{conference.speakers.length}</p>
                  <p className="text-sm text-slate-600">Speakers</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{conference.expectedAttendees}</p>
                  <p className="text-sm text-slate-600">Attendees</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{conference.schedule?.length || 1}</p>
                  <p className="text-sm text-slate-600">Days</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {conference.schedule?.reduce((sum, day) => sum + day.events.length, 0) || 5}
                  </p>
                  <p className="text-sm text-slate-600">Sessions</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
