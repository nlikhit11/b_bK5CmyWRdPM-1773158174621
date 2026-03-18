'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

interface TravelFormData {
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

export default function TravelPage() {
  const [form, setForm] = useState<TravelFormData>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      setForm({
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

  return (
    <DashboardLayout role="speaker" userName="Emma Speaker" userEmail="speaker@example.com">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Travel Arrangements</h1>
          <p className="text-slate-600 mt-2">Submit your travel details for the conference</p>
        </div>

        {/* Form */}
        <Card className="p-8 border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Travel Plan */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mode of Travel *</label>
              <Select
                value={form.travel_plan}
                onValueChange={(value) => setForm({ ...form, travel_plan: value })}
              >
                <SelectTrigger className="bg-white border-slate-200">
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Coming From (State) *</label>
                <Input
                  placeholder="e.g., Maharashtra"
                  value={form.coming_from_which_state}
                  onChange={(e) => setForm({ ...form, coming_from_which_state: e.target.value })}
                  className="bg-white border-slate-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Return To (State) *</label>
                <Input
                  placeholder="e.g., Karnataka"
                  value={form.return_to_which_state}
                  onChange={(e) => setForm({ ...form, return_to_which_state: e.target.value })}
                  className="bg-white border-slate-200"
                  required
                />
              </div>
            </div>

            {/* Arrival Details */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Arrival Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Arrival Date *</label>
                  <Input
                    type="date"
                    value={form.arrival_date}
                    onChange={(e) => setForm({ ...form, arrival_date: e.target.value })}
                    className="bg-white border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Arrival Time</label>
                  <Input
                    type="time"
                    value={form.arrival_time}
                    onChange={(e) => setForm({ ...form, arrival_time: e.target.value })}
                    className="bg-white border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Departure Details */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Departure Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Departure Date *</label>
                  <Input
                    type="date"
                    value={form.departure_date}
                    onChange={(e) => setForm({ ...form, departure_date: e.target.value })}
                    className="bg-white border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Departure Time</label>
                  <Input
                    type="time"
                    value={form.departure_time}
                    onChange={(e) => setForm({ ...form, departure_time: e.target.value })}
                    className="bg-white border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Transport Numbers */}
            {form.travel_plan === 'train' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Train Number</label>
                <Input
                  placeholder="e.g., 12345"
                  value={form.train_no || ''}
                  onChange={(e) => setForm({ ...form, train_no: e.target.value })}
                  className="bg-white border-slate-200"
                />
              </div>
            )}

            {form.travel_plan === 'flight' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Flight Number</label>
                <Input
                  placeholder="e.g., AI123"
                  value={form.flight_no || ''}
                  onChange={(e) => setForm({ ...form, flight_no: e.target.value })}
                  className="bg-white border-slate-200"
                />
              </div>
            )}

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
      </div>
    </DashboardLayout>
  );
}
