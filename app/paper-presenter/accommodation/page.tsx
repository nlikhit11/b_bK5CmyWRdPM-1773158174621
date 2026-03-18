'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar, MapPin, Phone, Mail, Building2, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface AccommodationBooking {
  id: string;
  conferenceId: string;
  hotelName: string;
  address: string;
  phone: string;
  email: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  confirmationNo: string;
  notes?: string;
}

const mockAccommodations: AccommodationBooking[] = [
  {
    id: '1',
    conferenceId: '1',
    hotelName: 'Tech Conference Hotel',
    address: '789 Convention Blvd, Tech City',
    phone: '+1-555-9999',
    email: 'reservations@techconf.com',
    checkInDate: '2024-06-14',
    checkOutDate: '2024-06-16',
    roomType: 'Deluxe Suite',
    confirmationNo: 'TCH456789',
    notes: 'Breakfast included. Wi-Fi available in all rooms.',
  },
];

export default function PaperPresenterAccommodationPage() {
  const [accommodations, setAccommodations] = useState<AccommodationBooking[]>(
    mockAccommodations
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AccommodationBooking>>({});

  const handleUpdateAccommodation = () => {
    if (!editingId) return;

    setAccommodations(
      accommodations.map((a) =>
        a.id === editingId
          ? {
              ...a,
              hotelName: formData.hotelName || a.hotelName,
              address: formData.address || a.address,
              checkInDate: formData.checkInDate || a.checkInDate,
              checkOutDate: formData.checkOutDate || a.checkOutDate,
              roomType: formData.roomType || a.roomType,
              notes: formData.notes || a.notes,
            }
          : a
      )
    );

    toast.success('Accommodation updated');
    setEditingId(null);
    setFormData({});
  };

  const handleDeleteAccommodation = (id: string) => {
    setAccommodations(accommodations.filter((a) => a.id !== id));
    toast.success('Accommodation deleted');
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const check = new Date(checkIn);
    const out = new Date(checkOut);
    const nights = Math.ceil((out.getTime() - check.getTime()) / (1000 * 60 * 60 * 24));
    return nights;
  };

  return (
    <DashboardLayout role="paper_presenter" userName="Dr. John Research" userEmail="presenter@example.com">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Accommodation</h1>
          <p className="text-slate-600 mt-1">View and manage your hotel bookings for conferences</p>
        </div>

        {/* Accommodations Cards */}
        <div className="grid gap-4">
          {accommodations.map((accommodation) => (
            <Card key={accommodation.id} className="p-6 border-slate-200">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-bold text-lg text-slate-900">
                        {accommodation.hotelName}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {accommodation.address}
                    </p>
                  </div>
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {accommodation.roomType}
                  </span>
                </div>

                {/* Check-in/Check-out */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Check-in</p>
                      <p className="font-semibold text-slate-900">
                        {new Date(accommodation.checkInDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Check-out</p>
                      <p className="font-semibold text-slate-900">
                        {new Date(accommodation.checkOutDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nights */}
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                  <p className="text-sm text-emerald-900">
                    <strong>
                      {calculateNights(accommodation.checkInDate, accommodation.checkOutDate)} nights
                    </strong>{' '}
                    accommodation booked
                  </p>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="font-medium text-slate-900 text-sm">{accommodation.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="font-medium text-slate-900 text-sm">{accommodation.email}</p>
                    </div>
                  </div>
                </div>

                {/* Confirmation */}
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Confirmation Number</p>
                  <p className="font-bold text-slate-900 text-lg">{accommodation.confirmationNo}</p>
                </div>

                {/* Notes */}
                {accommodation.notes && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <p className="text-xs text-blue-600 mb-1 font-medium">Special Notes:</p>
                    <p className="text-sm text-blue-900">{accommodation.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 justify-end border-t border-slate-200 pt-4">
                  <Dialog open={editingId === accommodation.id} onOpenChange={(open) => !open && setEditingId(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingId(accommodation.id);
                          setFormData(accommodation);
                        }}
                        className="gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Accommodation</DialogTitle>
                        <DialogDescription>Update your accommodation details</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-slate-700">Hotel Name</label>
                          <Input
                            value={formData.hotelName || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, hotelName: e.target.value })
                            }
                            className="mt-1 bg-white border-slate-200"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700">Address</label>
                          <Input
                            value={formData.address || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, address: e.target.value })
                            }
                            className="mt-1 bg-white border-slate-200"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-700">Check-in</label>
                            <Input
                              type="date"
                              value={formData.checkInDate || ''}
                              onChange={(e) =>
                                setFormData({ ...formData, checkInDate: e.target.value })
                              }
                              className="mt-1 bg-white border-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-700">Check-out</label>
                            <Input
                              type="date"
                              value={formData.checkOutDate || ''}
                              onChange={(e) =>
                                setFormData({ ...formData, checkOutDate: e.target.value })
                              }
                              className="mt-1 bg-white border-slate-200"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700">Room Type</label>
                          <Input
                            value={formData.roomType || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, roomType: e.target.value })
                            }
                            className="mt-1 bg-white border-slate-200"
                          />
                        </div>
                        <div className="flex gap-2 justify-end pt-4">
                          <Button variant="outline" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={handleUpdateAccommodation}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAccommodation(accommodation.id)}
                    className="gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {accommodations.length === 0 && (
          <Card className="p-12 border-slate-200 text-center">
            <p className="text-slate-600">No accommodations booked yet.</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
