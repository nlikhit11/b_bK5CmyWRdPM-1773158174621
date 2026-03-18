'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [registeredConferences, setRegisteredConferences] = useState<RegisteredConference[]>([
    { conferenceId: '1', conferenceName: 'Tech Summit 2026', registeredDate: '2026-03-01', status: 'approved' },
    { conferenceId: '2', conferenceName: 'AI Conference', registeredDate: '2026-04-15', status: 'pending' },
  ]);

  const pendingConferences = registeredConferences.filter(c => c.status === 'pending');
  const approvedConferences = registeredConferences.filter(c => c.status === 'approved');

  const handleEditRegistration = (conferenceId: string) => {
    setEditingId(conferenceId);
    toast.success('Registration moved to pending for re-review');
  };

  return (
    <DashboardLayout role="attendee" userName="John Attendee" userEmail="attendee@example.com">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Registrations</h1>
          <p className="text-slate-600 mt-2">View and manage your conference registrations</p>
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
