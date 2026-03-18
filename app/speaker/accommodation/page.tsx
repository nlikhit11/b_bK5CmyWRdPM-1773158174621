'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

interface AccommodationFormData {
  hostel_needed: boolean;
  hotel_info?: {
    hotel_name?: string;
    check_in_date?: string;
    check_out_date?: string;
  };
  food_pref?: string;
}

export default function AccommodationPage() {
  const [form, setForm] = useState<AccommodationFormData>({
    hostel_needed: false,
    hotel_info: {
      hotel_name: '',
      check_in_date: '',
      check_out_date: '',
    },
    food_pref: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.hostel_needed && (!form.hotel_info?.hotel_name || !form.hotel_info?.check_in_date || !form.hotel_info?.check_out_date)) {
      toast.error('Please fill in all hotel details');
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
      setForm({
        hostel_needed: false,
        hotel_info: {
          hotel_name: '',
          check_in_date: '',
          check_out_date: '',
        },
        food_pref: '',
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
          <p className="text-slate-600 mt-2">Let us know your accommodation requirements for the conference</p>
        </div>

        {/* Form */}
        <Card className="p-8 border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hostel Needed */}
            <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <Checkbox
                id="hostel_needed"
                checked={form.hostel_needed}
                onCheckedChange={(checked) =>
                  setForm({ ...form, hostel_needed: checked as boolean })
                }
                className="w-5 h-5"
              />
              <Label htmlFor="hostel_needed" className="font-medium text-slate-700 cursor-pointer flex-1">
                I need hostel/hotel accommodation
              </Label>
            </div>

            {/* Hotel Information (show only if hostel_needed is true) */}
            {form.hostel_needed && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-slate-900">Hotel Details</h3>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Hotel/Hostel Name *</label>
                  <Input
                    placeholder="e.g., Grand Hotel Mumbai"
                    value={form.hotel_info?.hotel_name || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hotel_info: {
                          ...form.hotel_info,
                          hotel_name: e.target.value,
                        },
                      })
                    }
                    className="bg-white border-slate-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Check-in Date *</label>
                    <Input
                      type="date"
                      value={form.hotel_info?.check_in_date || ''}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          hotel_info: {
                            ...form.hotel_info,
                            check_in_date: e.target.value,
                          },
                        })
                      }
                      className="bg-white border-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Check-out Date *</label>
                    <Input
                      type="date"
                      value={form.hotel_info?.check_out_date || ''}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          hotel_info: {
                            ...form.hotel_info,
                            check_out_date: e.target.value,
                          },
                        })
                      }
                      className="bg-white border-slate-200"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Food Preferences */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Food Preferences</label>
              <textarea
                placeholder="e.g., Vegetarian, Vegan, Non-vegetarian, Allergies, Dietary restrictions, etc."
                value={form.food_pref || ''}
                onChange={(e) => setForm({ ...form, food_pref: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
              />
              <p className="text-xs text-slate-600 mt-2">Please mention any dietary restrictions or preferences</p>
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
      </div>
    </DashboardLayout>
  );
}
