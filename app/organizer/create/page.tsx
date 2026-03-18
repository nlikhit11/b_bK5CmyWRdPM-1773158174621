'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

type FormStep = 'details' | 'speakers' | 'rooms' | 'goodies' | 'accommodation' | 'review';

interface Speaker {
  id: string;
  name: string;
  email: string;
  organization: string;
  topic: string;
  bio: string;
  accommodationRequired: boolean;
}

interface Room {
  id: string;
  name: string;
  capacity: number;
  date: string;
  timeFrom: string;
  timeTo: string;
  equipment: string;
}

interface GoodiesItem {
  id: string;
  name: string;
  quantity: number;
  notes: string;
}

export default function CreateEventPage() {
  const [currentStep, setCurrentStep] = useState<FormStep>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Form state
  const [eventDetails, setEventDetails] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    expectedAttendees: '',
  });

  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [newSpeaker, setNewSpeaker] = useState<Partial<Speaker>>({});

  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({});

  const [goodies, setGoodies] = useState<GoodiesItem[]>([]);
  const [newGoodie, setNewGoodie] = useState<Partial<GoodiesItem>>({});

  const [accommodation, setAccommodation] = useState({
    speakerAccommodationRequired: false,
    attendeeAccommodationRequired: false,
    checkInDate: '',
    checkOutDate: '',
  });

  const steps: { id: FormStep; label: string; number: number }[] = [
    { id: 'details', label: 'Event Details', number: 1 },
    { id: 'speakers', label: 'Speakers', number: 2 },
    { id: 'rooms', label: 'Rooms', number: 3 },
    { id: 'goodies', label: 'Goodies', number: 4 },
    { id: 'accommodation', label: 'Accommodation', number: 5 },
    { id: 'review', label: 'Review', number: 6 },
  ];

  const handleAddSpeaker = () => {
    if (!newSpeaker.name || !newSpeaker.email) {
      toast.error('Please fill in all speaker fields');
      return;
    }
    setSpeakers([...speakers, { ...newSpeaker, id: Math.random().toString() } as Speaker]);
    setNewSpeaker({});
  };

  const handleRemoveSpeaker = (id: string) => {
    setSpeakers(speakers.filter((s) => s.id !== id));
  };

  const handleAddRoom = () => {
    if (!newRoom.name || !newRoom.capacity) {
      toast.error('Please fill in all room fields');
      return;
    }
    setRooms([...rooms, { ...newRoom, id: Math.random().toString() } as Room]);
    setNewRoom({});
  };

  const handleRemoveRoom = (id: string) => {
    setRooms(rooms.filter((r) => r.id !== id));
  };

  const handleAddGoodie = () => {
    if (!newGoodie.name || !newGoodie.quantity) {
      toast.error('Please fill in goodie details');
      return;
    }
    setGoodies([...goodies, { ...newGoodie, id: Math.random().toString() } as GoodiesItem]);
    setNewGoodie({});
  };

  const handleRemoveGoodie = (id: string) => {
    setGoodies(goodies.filter((g) => g.id !== id));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Event created successfully! Awaiting admin approval.');
      setTimeout(() => router.push('/organizer'), 1000);
    } catch (error) {
      toast.error('Failed to create event');
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'details':
        return eventDetails.title && eventDetails.date && eventDetails.venue && eventDetails.expectedAttendees;
      case 'speakers':
        return speakers.length > 0;
      case 'rooms':
        return rooms.length > 0;
      case 'goodies':
        return goodies.length > 0;
      case 'accommodation':
        return true;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  return (
    <DashboardLayout role="organizer" userName="Organizer User" userEmail="organizer@example.com">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Create New Event</h1>
            <p className="text-slate-600 mt-2">Step {steps.find((s) => s.id === currentStep)?.number} of {steps.length}</p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  currentStep === step.id
                    ? 'bg-indigo-600 text-white'
                    : steps.findIndex((s) => s.id === currentStep) > index
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {steps.findIndex((s) => s.id === currentStep) > index ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    steps.findIndex((s) => s.id === currentStep) > index ? 'bg-green-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <Card className="p-8 border-slate-200">
          {/* Step 1: Event Details */}
          {currentStep === 'details' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Event Details</h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Tech Summit 2026"
                  value={eventDetails.title}
                  onChange={(e) => setEventDetails({ ...eventDetails, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event..."
                  rows={4}
                  value={eventDetails.description}
                  onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={eventDetails.date}
                    onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    placeholder="e.g., Convention Center"
                    value={eventDetails.venue}
                    onChange={(e) => setEventDetails({ ...eventDetails, venue: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attendees">Expected Number of Attendees</Label>
                <Input
                  id="attendees"
                  type="number"
                  placeholder="500"
                  value={eventDetails.expectedAttendees}
                  onChange={(e) => setEventDetails({ ...eventDetails, expectedAttendees: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 2: Speakers */}
          {currentStep === 'speakers' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900">Add Speakers</h2>

              <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="space-y-2">
                  <Label>Speaker Name</Label>
                  <Input
                    placeholder="Full name"
                    value={newSpeaker.name || ''}
                    onChange={(e) => setNewSpeaker({ ...newSpeaker, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={newSpeaker.email || ''}
                      onChange={(e) => setNewSpeaker({ ...newSpeaker, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Organization</Label>
                    <Input
                      placeholder="Company name"
                      value={newSpeaker.organization || ''}
                      onChange={(e) => setNewSpeaker({ ...newSpeaker, organization: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Input
                    placeholder="Speaking topic"
                    value={newSpeaker.topic || ''}
                    onChange={(e) => setNewSpeaker({ ...newSpeaker, topic: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    placeholder="Speaker biography"
                    rows={3}
                    value={newSpeaker.bio || ''}
                    onChange={(e) => setNewSpeaker({ ...newSpeaker, bio: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="accommodation"
                    checked={newSpeaker.accommodationRequired || false}
                    onCheckedChange={(checked) =>
                      setNewSpeaker({ ...newSpeaker, accommodationRequired: checked as boolean })
                    }
                  />
                  <Label htmlFor="accommodation">Accommodation required</Label>
                </div>
                <Button onClick={handleAddSpeaker} className="w-full">
                  Add Speaker
                </Button>
              </div>

              {speakers.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900">Added Speakers ({speakers.length})</h3>
                  {speakers.map((speaker) => (
                    <div key={speaker.id} className="p-3 bg-slate-50 rounded-lg flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{speaker.name}</p>
                        <p className="text-sm text-slate-600">{speaker.topic}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSpeaker(speaker.id)}
                        className="text-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Rooms */}
          {currentStep === 'rooms' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900">Request Rooms</h2>

              <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="space-y-2">
                  <Label>Room Name</Label>
                  <Input
                    placeholder="e.g., Grand Ballroom"
                    value={newRoom.name || ''}
                    onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Capacity</Label>
                    <Input
                      type="number"
                      placeholder="500"
                      value={newRoom.capacity || ''}
                      onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newRoom.date || ''}
                      onChange={(e) => setNewRoom({ ...newRoom, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Time From</Label>
                    <Input
                      type="time"
                      value={newRoom.timeFrom || ''}
                      onChange={(e) => setNewRoom({ ...newRoom, timeFrom: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time To</Label>
                    <Input
                      type="time"
                      value={newRoom.timeTo || ''}
                      onChange={(e) => setNewRoom({ ...newRoom, timeTo: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Equipment Required</Label>
                  <Input
                    placeholder="e.g., Projectors, Microphones"
                    value={newRoom.equipment || ''}
                    onChange={(e) => setNewRoom({ ...newRoom, equipment: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddRoom} className="w-full">
                  Add Room
                </Button>
              </div>

              {rooms.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900">Requested Rooms ({rooms.length})</h3>
                  {rooms.map((room) => (
                    <div key={room.id} className="p-3 bg-slate-50 rounded-lg flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{room.name}</p>
                        <p className="text-sm text-slate-600">Capacity: {room.capacity}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRoom(room.id)}
                        className="text-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Goodies */}
          {currentStep === 'goodies' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900">Request Goodies</h2>

              <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="space-y-2">
                  <Label>Item Name</Label>
                  <Input
                    placeholder="e.g., T-shirts, Bags"
                    value={newGoodie.name || ''}
                    onChange={(e) => setNewGoodie({ ...newGoodie, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={newGoodie.quantity || ''}
                    onChange={(e) => setNewGoodie({ ...newGoodie, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    placeholder="Any special requirements..."
                    rows={3}
                    value={newGoodie.notes || ''}
                    onChange={(e) => setNewGoodie({ ...newGoodie, notes: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddGoodie} className="w-full">
                  Add Item
                </Button>
              </div>

              {goodies.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900">Requested Items ({goodies.length})</h3>
                  {goodies.map((goodie) => (
                    <div key={goodie.id} className="p-3 bg-slate-50 rounded-lg flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{goodie.name}</p>
                        <p className="text-sm text-slate-600">Quantity: {goodie.quantity}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveGoodie(goodie.id)}
                        className="text-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Accommodation */}
          {currentStep === 'accommodation' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900">Accommodation</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg">
                  <Checkbox
                    id="speaker-acc"
                    checked={accommodation.speakerAccommodationRequired}
                    onCheckedChange={(checked) =>
                      setAccommodation({ ...accommodation, speakerAccommodationRequired: checked as boolean })
                    }
                  />
                  <Label htmlFor="speaker-acc" className="cursor-pointer">
                    Accommodation required for speakers
                  </Label>
                </div>

                <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg">
                  <Checkbox
                    id="attendee-acc"
                    checked={accommodation.attendeeAccommodationRequired}
                    onCheckedChange={(checked) =>
                      setAccommodation({ ...accommodation, attendeeAccommodationRequired: checked as boolean })
                    }
                  />
                  <Label htmlFor="attendee-acc" className="cursor-pointer">
                    Accommodation required for attendees
                  </Label>
                </div>

                {(accommodation.speakerAccommodationRequired ||
                  accommodation.attendeeAccommodationRequired) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Check-in Date</Label>
                      <Input
                        type="date"
                        value={accommodation.checkInDate}
                        onChange={(e) => setAccommodation({ ...accommodation, checkInDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Check-out Date</Label>
                      <Input
                        type="date"
                        value={accommodation.checkOutDate}
                        onChange={(e) => setAccommodation({ ...accommodation, checkOutDate: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900">Review Event</h2>

              <div className="space-y-4">
                <Card className="p-4 bg-slate-50 border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">Event Details</h3>
                  <p className="text-sm text-slate-600">
                    <strong>Title:</strong> {eventDetails.title}
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>Date:</strong> {eventDetails.date}
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>Venue:</strong> {eventDetails.venue}
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>Expected Attendees:</strong> {eventDetails.expectedAttendees}
                  </p>
                </Card>

                <Card className="p-4 bg-slate-50 border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">Speakers: {speakers.length}</h3>
                  {speakers.map((s) => (
                    <p key={s.id} className="text-sm text-slate-600">
                      • {s.name} ({s.organization})
                    </p>
                  ))}
                </Card>

                <Card className="p-4 bg-slate-50 border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">Rooms: {rooms.length}</h3>
                  {rooms.map((r) => (
                    <p key={r.id} className="text-sm text-slate-600">
                      • {r.name} (Capacity: {r.capacity})
                    </p>
                  ))}
                </Card>

                <Card className="p-4 bg-blue-50 border-blue-200">
                  <p className="text-sm text-blue-900">
                    ✓ Your event details are ready for submission. Once submitted, the admin will review and approve your event.
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => {
                const stepIndex = steps.findIndex((s) => s.id === currentStep);
                if (stepIndex > 0) {
                  setCurrentStep(steps[stepIndex - 1].id);
                }
              }}
              disabled={currentStep === 'details'}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep !== 'review' && (
              <Button
                onClick={() => {
                  const stepIndex = steps.findIndex((s) => s.id === currentStep);
                  if (stepIndex < steps.length - 1) {
                    setCurrentStep(steps[stepIndex + 1].id);
                  }
                }}
                disabled={!canProceed()}
                className="flex-1"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            {currentStep === 'review' && (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
