'use client';

import { useState } from 'react';
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
import { Loader, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PendingConference {
  id: string;
  name: string;
  date: string;
}

interface TravelFormData {
  conferenceId: string;
  travel_plan: string;
  coming_from_which_state: string;
  return_to_which_state: string;
  arrival_date: string;
  arrival_time: string;
  departure_date: string;
  departure_time: string;
  train_no?: string;
  flight_no?: string;
}

// Mock: Registered conferences
const mockRegisteredConferences: PendingConference[] = [
  { id: '1', name: 'Tech Summit 2026', date: 'Mar 15-17, 2026' },
  { id: '2', name: 'AI Conference', date: 'May 10-12, 2026' },
];

export default function TravelPage() {
  const [selectedConference, setSelectedConference] = useState<string>('');
  const [form, setForm] = useState<TravelFormData>({
    conferenceId: '',
    travel_plan: 'train',
    coming_from_which_state: '',
    return_to_which_state: '',
    arrival_date: '',
    arrival_time: '',
    departure_date: '',
    departure_time: '',
    train_no: '',
    flight_no: '',
  });
  const [loading, setLoading] = useState(false);

  const handleConferenceSelect = (conferenceId: string) => {
    setSelectedConference(conferenceId);
    setForm((prev) => ({ ...prev, conferenceId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.conferenceId) {
      toast.error('Please select a conference');
      return;
    }

    if (!form.coming_from_which_state || !form.return_to_which_state || !form.arrival_date || !form.departure_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message || 'Failed to submit travel form');
        setLoading(false);
        return;
      }

      toast.success('Travel request submitted successfully!');
      setSelectedConference('');
      setForm({
        conferenceId: '',
        travel_plan: 'train',
        coming_from_which_state: '',
        return_to_which_state: '',
        arrival_date: '',
        arrival_time: '',
        departure_date: '',
        departure_time: '',
        train_no: '',
        flight_no: '',
      });
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const indianStates = [
    'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
    'Bihar', 'Chhattisgarh', 'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu',
    'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'International',
  ];

  return (
    <DashboardLayout role="speaker" userName="Emma Speaker" userEmail="speaker@example.com">
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
                <h3 className="font-semibold text-slate-900">Conferences</h3>
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
            <p className="text-slate-900">No conferences found.</p>
          </Card>
        )}

        {/* Form */}
        {selectedConference && (
          <Card className="p-8 border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Travel Mode */}
              <div className="border-b border-slate-200 pb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Travel Details</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-700 font-medium">Mode of Travel *</Label>
                    <Select
                      value={form.travel_plan}
                      onValueChange={(value) => setForm({ ...form, travel_plan: value })}
                    >
                      <SelectTrigger className="mt-2 bg-white border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="train">Train</SelectItem>
                        <SelectItem value="flight">Flight</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* From and To States */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-700 font-medium">Coming From (State) *</Label>
                      <Select value={form.coming_from_which_state} onValueChange={(value) => setForm({ ...form, coming_from_which_state: value })}>
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
                      <Label className="text-slate-700 font-medium">Return To (State) *</Label>
                      <Select value={form.return_to_which_state} onValueChange={(value) => setForm({ ...form, return_to_which_state: value })}>
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
                </div>
              </div>

              {/* Arrival Details */}
              <div className="border-b border-slate-200 pb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Arrival Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-700 font-medium">Arrival Date *</Label>
                      <Input
                        type="date"
                        value={form.arrival_date}
                        onChange={(e) => setForm({ ...form, arrival_date: e.target.value })}
                        className="mt-2 bg-white border-slate-200"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700 font-medium">Arrival Time</Label>
                      <Input
                        type="time"
                        value={form.arrival_time}
                        onChange={(e) => setForm({ ...form, arrival_time: e.target.value })}
                        className="mt-2 bg-white border-slate-200"
                      />
                    </div>
                  </div>

                  {/* Train Details */}
                  {form.travel_plan === 'train' && (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <Label className="text-slate-700 font-medium">Train Number</Label>
                      <Input
                        placeholder="e.g., 12345"
                        value={form.train_no || ''}
                        onChange={(e) => setForm({ ...form, train_no: e.target.value })}
                        className="mt-2 bg-white border-slate-200"
                      />
                    </div>
                  )}

                  {/* Flight Details */}
                  {form.travel_plan === 'flight' && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <Label className="text-slate-700 font-medium">Flight Number</Label>
                      <Input
                        placeholder="e.g., AI123"
                        value={form.flight_no || ''}
                        onChange={(e) => setForm({ ...form, flight_no: e.target.value })}
                        className="mt-2 bg-white border-slate-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Departure Details */}
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Departure Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700 font-medium">Departure Date *</Label>
                    <Input
                      type="date"
                      value={form.departure_date}
                      onChange={(e) => setForm({ ...form, departure_date: e.target.value })}
                      className="mt-2 bg-white border-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">Departure Time</Label>
                    <Input
                      type="time"
                      value={form.departure_time}
                      onChange={(e) => setForm({ ...form, departure_time: e.target.value })}
                      className="mt-2 bg-white border-slate-200"
                    />
                  </div>
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
