'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, Loader, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface RegistrationFormData {
  conferenceId?: string;
  email: string;
  paper_id: string;
  name: string;
  email_confirm: string;
  phone_whatsapp: string;
  gender: string;
  affiliation: string;
  country: string;
  registration_category: string;
  paper_title: string;
  paper_pages: string;
  student_id_file: File | null;
  remarks: string;
  membership_file: File | null;
}

interface RegisteredConference {
  conferenceId: string;
  conferenceName: string;
  registeredDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function RegistrationFormPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<RegistrationFormData>({
    conferenceId: '',
    email: '',
    paper_id: '',
    name: '',
    email_confirm: '',
    phone_whatsapp: '',
    gender: '',
    affiliation: '',
    country: '',
    registration_category: 'attendee',
    paper_title: '',
    paper_pages: '',
    student_id_file: null,
    remarks: '',
    membership_file: null,
  });
  const [registeredConferences, setRegisteredConferences] = useState<RegisteredConference[]>([
    { conferenceId: '1', conferenceName: 'Tech Summit 2026', registeredDate: '2026-03-01', status: 'approved' },
    { conferenceId: '2', conferenceName: 'AI Conference', registeredDate: '2026-04-15', status: 'pending' },
  ]);

  const pendingConferences = registeredConferences.filter(c => c.status === 'pending');
  const approvedConferences = registeredConferences.filter(c => c.status === 'approved');

  const handleNewRegistration = () => {
    setEditingId(null);
    setForm({
      conferenceId: '',
      email: '',
      paper_id: '',
      name: '',
      email_confirm: '',
      phone_whatsapp: '',
      gender: '',
      affiliation: '',
      country: '',
      registration_category: 'attendee',
      paper_title: '',
      paper_pages: '',
      student_id_file: null,
      remarks: '',
      membership_file: null,
    });
    setShowForm(true);
  };

  const handleEditRegistration = (conferenceId: string) => {
    setEditingId(conferenceId);
    // Populate form with existing data (in a real app, fetch this data)
    const conf = registeredConferences.find(c => c.conferenceId === conferenceId);
    if (conf) {
      setForm(prev => ({
        ...prev,
        conferenceId: conf.conferenceId,
      }));
    }
    setShowForm(true);
  };

  const handleFileChange = (field: 'student_id_file' | 'membership_file', file: File | null) => {
    setForm((prev) => ({ ...prev, [field]: file }));
  };

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.name || !form.email_confirm || !form.phone_whatsapp) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (form.email !== form.email_confirm) {
      toast.error('Email addresses do not match');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      if (editingId) {
        toast.success('Registration updated and moved to pending review!');
      } else {
        toast.success('Registration submitted successfully!');
      }
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showForm) {
    return (
      <DashboardLayout role="attendee" userName="John Attendee" userEmail="attendee@example.com">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {editingId ? 'Edit Registration' : 'New Registration'}
              </h1>
              <p className="text-slate-600 mt-2">Complete the form to register for a conference</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(false)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>

          {/* Registration Form */}
          <Card className="p-8 border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Personal Information */}
              <div className="border-b border-slate-200 pb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Personal Information</h2>
                <div className="space-y-4">
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
                    <Label className="text-slate-700 font-medium">Confirm Email Address *</Label>
                    <Input
                      type="email"
                      placeholder="confirm@email.com"
                      value={form.email_confirm}
                      onChange={(e) => handleInputChange('email_confirm', e.target.value)}
                      className="mt-2 bg-white border-slate-200"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-slate-700 font-medium">Your Name *</Label>
                    <Input
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-2 bg-white border-slate-200"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-slate-700 font-medium">Mobile / WhatsApp Number *</Label>
                    <Input
                      placeholder="+91 98765 43210"
                      value={form.phone_whatsapp}
                      onChange={(e) => handleInputChange('phone_whatsapp', e.target.value)}
                      className="mt-2 bg-white border-slate-200"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-700 font-medium">Gender</Label>
                      <Select value={form.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger className="mt-2 bg-white border-slate-200">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-700 font-medium">Country</Label>
                      <Input
                        placeholder="India"
                        value={form.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="mt-2 bg-white border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Organization & Category */}
              <div className="border-b border-slate-200 pb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Organization & Registration</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-700 font-medium">Affiliation / Organization</Label>
                    <Input
                      placeholder="Your organization name"
                      value={form.affiliation}
                      onChange={(e) => handleInputChange('affiliation', e.target.value)}
                      className="mt-2 bg-white border-slate-200"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-700 font-medium">Registration Category</Label>
                    <Select value={form.registration_category} onValueChange={(value) => handleInputChange('registration_category', value)}>
                      <SelectTrigger className="mt-2 bg-white border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="attendee">Attendee</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="researcher">Researcher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Section 3: Paper Information */}
              <div className="border-b border-slate-200 pb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Paper Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-700 font-medium">Paper ID</Label>
                    <Input
                      placeholder="e.g., PAPER-2024-001"
                      value={form.paper_id}
                      onChange={(e) => handleInputChange('paper_id', e.target.value)}
                      className="mt-2 bg-white border-slate-200"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-700 font-medium">Title of the Paper</Label>
                    <Input
                      placeholder="Your paper title"
                      value={form.paper_title}
                      onChange={(e) => handleInputChange('paper_title', e.target.value)}
                      className="mt-2 bg-white border-slate-200"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-700 font-medium">Number of Pages</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 10"
                      value={form.paper_pages}
                      onChange={(e) => handleInputChange('paper_pages', e.target.value)}
                      className="mt-2 bg-white border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: File Uploads */}
              <div className="border-b border-slate-200 pb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Document Uploads</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-700 font-medium">Upload Student ID (if applicable)</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                        <Upload className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-600 font-medium">Choose File</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileChange('student_id_file', e.target.files?.[0] || null)}
                        />
                      </label>
                      {form.student_id_file && (
                        <span className="text-sm text-slate-600">{form.student_id_file.name}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-700 font-medium">Upload IAPR or IUPRAI Membership Proof</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <label className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                        <Upload className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Choose File</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileChange('membership_file', e.target.files?.[0] || null)}
                        />
                      </label>
                      {form.membership_file && (
                        <span className="text-sm text-slate-600">{form.membership_file.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Additional Information */}
              <div className="pb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Additional Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-700 font-medium">Any Other Info / Remarks</Label>
                    <textarea
                      placeholder="Any additional information you'd like to share..."
                      value={form.remarks}
                      onChange={(e) => handleInputChange('remarks', e.target.value)}
                      className="mt-2 w-full p-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={4}
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
                ) : editingId ? (
                  'Update & Resubmit Registration'
                ) : (
                  'Submit Registration'
                )}
              </Button>
            </form>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="attendee" userName="John Attendee" userEmail="attendee@example.com">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Registrations</h1>
            <p className="text-slate-600 mt-2">View and manage your conference registrations</p>
          </div>
          <Button onClick={handleNewRegistration}>
            New Registration
          </Button>
        </div>

        {/* Pending Registrations */}
        {pendingConferences.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Pending Approval</h2>
            <div className="space-y-3">
              {pendingConferences.map((conf) => (
                <Card key={conf.conferenceId} className="p-4 border-yellow-200 border-l-4 border-l-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{conf.conferenceName}</p>
                      <p className="text-sm text-slate-600">Registered: {conf.registeredDate}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium px-3 py-1 rounded bg-yellow-100 text-yellow-800">
                        Pending Review
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditRegistration(conf.conferenceId)}
                      >
                        Edit & Resubmit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Approved Registrations */}
        {approvedConferences.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Approved</h2>
            <div className="space-y-3">
              {approvedConferences.map((conf) => (
                <Card key={conf.conferenceId} className="p-4 border-green-200 border-l-4 border-l-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{conf.conferenceName}</p>
                      <p className="text-sm text-slate-600">Registered: {conf.registeredDate}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium px-3 py-1 rounded bg-green-100 text-green-800">
                        Approved
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditRegistration(conf.conferenceId)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Registrations */}
        {registeredConferences.length === 0 && (
          <Card className="p-12 border-slate-200 text-center">
            <p className="text-slate-600 mb-4">You haven't registered for any conferences yet.</p>
            <Button onClick={() => window.location.href = '/attendee/conferences'}>
              Browse Conferences
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
