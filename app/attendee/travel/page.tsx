'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader, Info, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PendingConference {
  id: string;
  name: string;
  date: string;
}

interface TravelFormData {
  conferenceId: string;
  name: string;
  email: string;
  phone: string;
  origin_state: string;
  destination_state: string;
  travel_mode: string;
  arrival_date: string;
  arrival_time: string;
  departure_date: string;
  departure_time: string;
  train_number: string;
  train_arrival: string;
  train_departure: string;
  flight_number: string;
  flight_arrival: string;
  flight_departure: string;
  remarks: string;
}

// Mock: Registered conferences with pending travel forms
const mockRegisteredConferences: PendingConference[] = [
  { id: '1', name: 'Tech Summit 2026', date: 'Mar 15-17, 2026' },
  { id: '2', name: 'AI Conference', date: 'May 10-12, 2026' },
];

export default function AttendeesTravelForm() {
  const [selectedConference, setSelectedConference] = useState<string>('');
  const [form, setForm] = useState<TravelFormData>({
    conferenceId: '',
    name: '',
    email: '',
    phone: '',
    origin_state: '',
    destination_state: '',
    travel_mode: 'train',
    arrival_date: '',
    arrival_time: '',
    departure_date: '',
    departure_time: '',
    train_number: '',
    train_arrival: '',
    train_departure: '',
    flight_number: '',
    flight_arrival: '',
    flight_departure: '',
    remarks: '',
  });
  const [loading, setLoading] = useState(false);

  const handleConferenceSelect = (conferenceId: string) => {
    setSelectedConference(conferenceId);
    setForm((prev) => ({ ...prev, conferenceId }));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.conferenceId) {
      toast.error('Please select a conference');
      return;
    }

    if (!form.name || !form.email || !form.phone || !form.origin_state || !form.destination_state) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      toast.success('Travel form submitted successfully!');
      setSelectedConference('');
      setForm({
        conferenceId: '',
        name: '',
        email: '',
        phone: '',
        origin_state: '',
        destination_state: '',
        travel_mode: 'train',
        arrival_date: '',
        arrival_time: '',
        departure_date: '',
        departure_time: '',
        train_number: '',
        train_arrival: '',
        train_departure: '',
        flight_number: '',
        flight_arrival: '',
        flight_departure: '',
        remarks: '',
      });
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const indianStates = [
    'Andaman and Nicobar Islands',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Chandigarh',
    'Dadra and Nagar Haveli',
    'Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'International',
  ];

  return (
    <DashboardLayout role="attendee" userName="John Attendee" userEmail="attendee@example.com">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Travel Request Form</h1>
          <p className="text-slate-600 mt-2">Submit your travel details for registered conferences</p>
        </div>

        {/* Pending Conferences */}
        {mockRegisteredConferences.length > 0 ? (
          <Card className="p-6 border-blue-200 bg-blue-50">
            <div className="flex items-start gap-4 mb-4">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Pending Travel Forms</h3>
                <p className="text-sm text-slate-600 mt-1">Select a conference to fill the travel form</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockRegisteredConferences.map((conf) => (
                <Button
                  key={conf.id}
                  variant={selectedConference === conf.id ? 'default' : 'outline'}
                  className="justify-start h-auto p-3"
                  onClick={() => handleConferenceSelect(conf.id)}
                >
                  <div className="text-left">
                    <p className="font-medium text-sm">{conf.name}</p>
                    <p className="text-xs text-slate-600">{conf.date}</p>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="p-6 border-slate-200 bg-yellow-50">
            <p className="text-slate-900">No pending travel forms. Register for a conference first.</p>
          </Card>
        )}

        {/* Form */}
        {selectedConference && (
          <Card className="p-8 border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Personal Information */}
            <div className="border-b border-slate-200 pb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-700 font-medium">Full Name *</Label>
                  <Input
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-2 bg-white border-slate-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700 font-medium">Email Address *</Label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-2 bg-white border-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">Phone Number *</Label>
                    <Input
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-2 bg-white border-slate-200"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Travel Locations */}
            <div className="border-b border-slate-200 pb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Travel Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700 font-medium">Coming From (State) *</Label>
                    <Select value={form.origin_state} onValueChange={(value) => handleInputChange('origin_state', value)}>
                      <SelectTrigger className="mt-2 bg-white border-slate-200">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">Destination State *</Label>
                    <Select value={form.destination_state} onValueChange={(value) => handleInputChange('destination_state', value)}>
                      <SelectTrigger className="mt-2 bg-white border-slate-200">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-slate-700 font-medium">Travel Mode *</Label>
                  <Select value={form.travel_mode} onValueChange={(value) => handleInputChange('travel_mode', value)}>
                    <SelectTrigger className="mt-2 bg-white border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="train">Train</SelectItem>
                      <SelectItem value="flight">Flight</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 3: Arrival Details */}
            <div className="border-b border-slate-200 pb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Arrival Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700 font-medium">Arrival Date</Label>
                    <Input
                      type="date"
                      value={form.arrival_date}
                      onChange={(e) => handleInputChange('arrival_date', e.target.value)}
                      className="mt-2 bg-white border-slate-200"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">Arrival Time</Label>
                    <Input
                      type="time"
                      value={form.arrival_time}
                      onChange={(e) => handleInputChange('arrival_time', e.target.value)}
                      className="mt-2 bg-white border-slate-200"
                    />
                  </div>
                </div>

                {/* Train Details */}
                {form.travel_mode === 'train' && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-4">
                    <div>
                      <Label className="text-slate-700 font-medium">Train Number</Label>
                      <Input
                        placeholder="e.g., 12345"
                        value={form.train_number}
                        onChange={(e) => handleInputChange('train_number', e.target.value)}
                        className="mt-2 bg-white border-slate-200"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-700 font-medium">Train Arrival Time</Label>
                        <Input
                          type="time"
                          value={form.train_arrival}
                          onChange={(e) => handleInputChange('train_arrival', e.target.value)}
                          className="mt-2 bg-white border-slate-200"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 font-medium">Train Departure Time</Label>
                        <Input
                          type="time"
                          value={form.train_departure}
                          onChange={(e) => handleInputChange('train_departure', e.target.value)}
                          className="mt-2 bg-white border-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Flight Details */}
                {form.travel_mode === 'flight' && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-4">
                    <div>
                      <Label className="text-slate-700 font-medium">Flight Number</Label>
                      <Input
                        placeholder="e.g., AI101"
                        value={form.flight_number}
                        onChange={(e) => handleInputChange('flight_number', e.target.value)}
                        className="mt-2 bg-white border-slate-200"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-700 font-medium">Flight Arrival Time</Label>
                        <Input
                          type="time"
                          value={form.flight_arrival}
                          onChange={(e) => handleInputChange('flight_arrival', e.target.value)}
                          className="mt-2 bg-white border-slate-200"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 font-medium">Flight Departure Time</Label>
                        <Input
                          type="time"
                          value={form.flight_departure}
                          onChange={(e) => handleInputChange('flight_departure', e.target.value)}
                          className="mt-2 bg-white border-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Departure Details */}
            <div className="border-b border-slate-200 pb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Departure Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700 font-medium">Departure Date</Label>
                    <Input
                      type="date"
                      value={form.departure_date}
                      onChange={(e) => handleInputChange('departure_date', e.target.value)}
                      className="mt-2 bg-white border-slate-200"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">Departure Time</Label>
                    <Input
                      type="time"
                      value={form.departure_time}
                      onChange={(e) => handleInputChange('departure_time', e.target.value)}
                      className="mt-2 bg-white border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Additional Information */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Additional Information</h2>
              <div>
                <Label className="text-slate-700 font-medium">Remarks / Special Notes</Label>
                <textarea
                  placeholder="Any additional information or special requests..."
                  value={form.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  className="mt-2 w-full p-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Travel Request'
              )}
            </Button>
          </form>
        </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
