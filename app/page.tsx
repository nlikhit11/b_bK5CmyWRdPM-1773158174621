'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Calendar, Users, QrCode, BarChart3, MapPin, Zap, Mail, Phone, Twitter, Linkedin, Github, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface Conference {
  id: string;
  name: string;
  date: string;
  venue: string;
  speakers: number;
  description: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrationDeadline?: string;
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
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [conferences, setConferences] = useState<Conference[]>(mockConferences);

  const handleRegister = (conferenceId: string) => {
    router.push(`/login?redirect=/attendee/conferences&action=register&conferenceId=${conferenceId}`);
  };

  const handleViewDetails = (conferenceId: string) => {
    router.push(`/conferences/${conferenceId}`);
  };

  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Event Creation',
      description: 'Create and manage multiple conferences with detailed information, venues, and schedules.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Speaker Management',
      description: 'Invite speakers, track invitations, manage bios, and accommodation requests.',
    },
    {
      icon: <QrCode className="w-6 h-6" />,
      title: 'QR Code Check-in',
      description: 'Generate unique QR codes for speakers and attendees for seamless event entry.',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Accommodation',
      description: 'Track and manage accommodation for speakers and attendees.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Inventory Management',
      description: 'Request and manage goodies, merchandise, and supplies for your events.',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Analytics & Reports',
      description: 'Get insights with analytics and export attendee data to CSV.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              CE
            </div>
            <span className="font-semibold text-slate-900">ConferenceHub</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Features
            </Link>
            <Link href="#conferences" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Conferences
            </Link>
            <Link href="#contact" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Contact
            </Link>
          </div>
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-slate-900 leading-tight text-balance">
              Manage Conferences and Events <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Seamlessly</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed text-pretty">
              All-in-one platform for event planning, speaker management, attendee registration, and real-time check-in. Streamline your conference workflow with powerful tools designed for organizers, speakers, and attendees.
            </p>
            <div className="flex gap-4">
              <Link href="/conferences">
                <Button size="lg" className="gap-2">
                  View Conferences <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Illustration */}
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-12 flex items-center justify-center min-h-96">
            <div className="text-center">
              <Calendar className="w-24 h-24 text-indigo-600 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Conference Management Platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-slate-600">Everything you need to manage successful conferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Conferences Section */}
      <section id="conferences" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Upcoming Conferences</h2>
          <p className="text-xl text-slate-600">Join these amazing events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {conferences.filter(c => c.status === 'upcoming').map((conference) => (
            <Card key={conference.id} className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32"></div>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">{conference.name}</h3>
                <p className="text-sm text-slate-600 line-clamp-2">{conference.description}</p>
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
                    {conference.speakers} speakers
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
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
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/conferences">
            <Button variant="outline" size="lg" className="gap-2">
              View All Conferences <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-slate-600">Have questions? We are here to help.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-center border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Email Us</h3>
              <a href="mailto:support@conferencehub.com" className="text-blue-600 hover:text-blue-700 transition-colors">
                support@conferencehub.com
              </a>
            </Card>
            <Card className="p-6 text-center border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Call Us</h3>
              <a href="tel:+1-555-123-4567" className="text-green-600 hover:text-green-700 transition-colors">
                +1 (555) 123-4567
              </a>
            </Card>
            <Card className="p-6 text-center border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Visit Us</h3>
              <p className="text-slate-600">
                123 Tech Avenue<br />
                San Francisco, CA 94102
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  CE
                </div>
                <span className="font-semibold text-white">ConferenceHub</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your all-in-one platform for managing conferences and events seamlessly.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="https://twitter.com/conferencehub" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a href="https://linkedin.com/company/conferencehub" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a href="https://github.com/conferencehub" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                  <span className="sr-only">GitHub</span>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#features" className="text-slate-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/conferences" className="text-slate-400 hover:text-white transition-colors">
                    Browse Conferences
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-slate-400 hover:text-white transition-colors">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-slate-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-slate-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="text-slate-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-slate-400 hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@conferencehub.com" className="text-slate-400 hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} ConferenceHub. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
