'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { Upload, Loader, Calendar, MapPin, ArrowLeft } from 'lucide-react';
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
  const searchParams = useSearchParams();
  const [form, setForm] = useState<RegistrationFormData>({
    conferenceId: searchParams.get('conferenceId') || '',
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
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<RegistrationFormData | null>(null);
  const [registeredConferences, setRegisteredConferences] = useState<RegisteredConference[]>([
    { conferenceId: '1', conferenceName: 'Tech Summit 2026', registeredDate: '2026-03-01', status: 'approved' },
    { conferenceId: '2', conferenceName: 'AI Conference', registeredDate: '2026-04-15', status: 'approved' },
  ]);

  const conferenceId = searchParams.get('conferenceId');
  const conferenceName = searchParams.get('conferenceName');
  const conferenceDate = searchParams.get('conferenceDate');

  // Filter to show only registered conferences in the list
  const registeredConferencesOnly = registeredConferences;

  const handleFileChange = (field: 'student_id_file' | 'membership_file', file: File | null) => {
    setForm((prev) => ({ ...prev, [field]: file }));
  };

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
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
      setSubmittedData(form);
      toast.success('Registration submitted successfully!');
      
      // Reset form
      setForm({
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
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout role="attendee" userName="John Attendee" userEmail="attendee@example.com">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Conference Registration</h1>
          <p className="text-slate-600 mt-2">Complete the form to register for conferences</p>
        </div>

        {/* Your Registered Conferences - Only Show If Not Coming from Registration Flow */}
        {!conferenceId && registeredConferencesOnly.length > 0 && (
          <Card className="p-6 border-slate-200 bg-blue-50">
            <h3 className="font-semibold text-slate-900 mb-4">Your Registered Conferences</h3>
            <div className="space-y-2">
              {registeredConferencesOnly.map((conf) => (
                <div key={conf.conferenceId} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{conf.conferenceName}</p>
                    <p className="text-xs text-slate-600">Registered: {conf.registeredDate}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    conf.status === 'approved' ? 'bg-green-100 text-green-700' :
                    conf.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {conf.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* No Registered Conferences */}
        {!conferenceId && registeredConferencesOnly.length === 0 && (
          <Card className="p-6 border-slate-200 bg-yellow-50">
            <p className="text-slate-900">You haven't registered for any conferences yet. <a href="/attendee/conferences" className="font-semibold text-blue-600 hover:underline">Browse and register for conferences</a></p>
          </Card>
        )}

        {/* Conference Selection or Form */}
        {conferenceId && conferenceName ? (
          <Card className="p-6 border-blue-200 bg-blue-50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900">Registration For</h3>
                <p className="text-lg font-bold text-blue-600 mt-1">{conferenceName}</p>
                <p className="text-sm text-slate-600 mt-1">{conferenceDate}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Change Conference
              </Button>
            </div>
          </Card>
        ) : null}

        {/* Form */}
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
              ) : (
                'Submit Registration'
              )}
            </Button>
          </form>
        </Card>

        {/* Success Message */}
        {submittedData && (
          <Card className="p-6 border-emerald-200 bg-emerald-50">
            <p className="text-emerald-900 font-medium">
              Registration submitted successfully! We will review your submission and send you a confirmation email.
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
