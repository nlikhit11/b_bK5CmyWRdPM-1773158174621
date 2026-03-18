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
import { Textarea } from '@/components/ui/textarea';
import { Loader, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Conference {
  id: string;
  name: string;
  date: string;
}

interface AccommodationFormData {
  conferenceId: string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkOutTime: string;
  roomType: string;
  accompaniedByFamily: boolean;
  familyMemberCount: number;
  foodPreference: string;
  specialRequests: string;
}

const mockConferences: Conference[] = [
  { id: '1', name: 'Tech Summit 2026', date: 'Mar 15-17, 2026' },
  { id: '2', name: 'AI Conference', date: 'May 10-12, 2026' },
];

export default function AccommodationPage() {
  const [selectedConference, setSelectedConference] = useState<string>('');
  const [form, setForm] = useState<AccommodationFormData>({
    conferenceId: '',
    checkInDate: '',
    checkOutDate: '',
    checkInTime: '',
    checkOutTime: '',
    roomType: 'standard',
    accompaniedByFamily: false,
    familyMemberCount: 0,
    foodPreference: 'veg',
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);

  const handleConferenceSelect = (conferenceId: string) => {
    setSelectedConference(conferenceId);
    setForm((prev) => ({ ...prev, conferenceId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.conferenceId || !form.checkInDate || !form.checkOutDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (form.accompaniedByFamily && form.familyMemberCount <= 0) {
      toast.error('Please specify number of family members');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/accommodation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message || 'Failed to submit accommodation form');
        setLoading(false);
        return;
      }

      toast.success('Accommodation request submitted successfully!');
      setSelectedConference('');
      setForm({
        conferenceId: '',
        checkInDate: '',
        checkOutDate: '',
        checkInTime: '',
        checkOutTime: '',
        roomType: 'standard',
        accompaniedByFamily: false,
        familyMemberCount: 0,
        foodPreference: 'veg',
        specialRequests: '',
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
          <h1 className="text-3xl font-bold text-slate-900">Accommodation Request</h1>
          <p className="text-slate-600 mt-2">Submit your accommodation requirements for conferences</p>
        </div>

        {/* Conference Selection */}
        {mockConferences.length > 0 ? (
          <Card className="p-6 border-blue-200 bg-blue-50">
            <div className="flex items-start gap-4 mb-4">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Select Conference</h3>
                <p className="text-sm text-slate-600 mt-1">Choose a conference for accommodation</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockConferences.map((conf) => (
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="checkIn">Check-in Date *</Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={form.checkInDate}
                  onChange={(e) => setForm({ ...form, checkInDate: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="checkOut">Check-out Date *</Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={form.checkOutDate}
                  onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkInTime">Check-in Time</Label>
                  <Input
                    id="checkInTime"
                    type="time"
                    value={form.checkInTime}
                    onChange={(e) => setForm({ ...form, checkInTime: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="checkOutTime">Check-out Time</Label>
                  <Input
                    id="checkOutTime"
                    type="time"
                    value={form.checkOutTime}
                    onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="foodPref">Food Preference *</Label>
                <Select
                  value={form.foodPreference}
                  onValueChange={(value) => setForm({ ...form, foodPreference: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veg">Vegetarian</SelectItem>
                    <SelectItem value="nonveg">Non-Vegetarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.accompaniedByFamily}
                    onChange={(e) => setForm({ ...form, accompaniedByFamily: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                  <span>Accompanied by family members</span>
                </Label>
              </div>

              {form.accompaniedByFamily && (
                <div>
                  <Label htmlFor="familyCount">Number of Family Members *</Label>
                  <Input
                    id="familyCount"
                    type="number"
                    min="1"
                    max="10"
                    value={form.familyMemberCount}
                    onChange={(e) => setForm({ ...form, familyMemberCount: parseInt(e.target.value) || 0 })}
                    className="mt-2"
                    placeholder="0"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="roomType">Room Type</Label>
                <Select
                  value={form.roomType}
                  onValueChange={(value) => setForm({ ...form, roomType: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Room</SelectItem>
                    <SelectItem value="deluxe">Deluxe Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="special">Special Requests (Optional)</Label>
                <Textarea
                  id="special"
                  placeholder="Any specific requirements (e.g., ground floor, non-smoking, accessibility needs)..."
                  value={form.specialRequests}
                  onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                  className="mt-2"
                  rows={3}
                />
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
                  'Submit Accommodation Request'
                )}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
