'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Info } from 'lucide-react';

const attendeePasses = [
  {
    id: 'ATT-2026-00001',
    eventTitle: 'Tech Summit 2026',
    date: 'Mar 15-17, 2026',
    attendeeName: 'Alice Johnson',
  },
  {
    id: 'ATT-2026-00002',
    eventTitle: 'AI Conference',
    date: 'May 10-12, 2026',
    attendeeName: 'Alice Johnson',
  },
];

export default function AttendeeQRPassPage() {
  return (
    <DashboardLayout role="attendee" userName="Attendee User" userEmail="attendee@example.com">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Event Passes</h1>
          <p className="text-slate-600 mt-2">Use these QR codes for entry and check-in at events</p>
        </div>

        {/* Passes */}
        {attendeePasses.map((pass) => (
          <Card key={pass.id} className="p-8 border-slate-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-1">{pass.eventTitle}</h2>
              <p className="text-slate-600">{pass.date}</p>
              <p className="text-sm text-slate-500 mt-1">Attendee: {pass.attendeeName}</p>
            </div>

            {/* QR Code Container */}
            <div className="flex justify-center mb-8 bg-slate-50 p-8 rounded-lg border border-slate-200">
              <div className="w-64 h-64 bg-white rounded-lg border-2 border-slate-300 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="240"
                  height="240"
                  viewBox="0 0 240 240"
                  fill="none"
                >
                  <rect width="240" height="240" fill="white" />
                  <g fill="currentColor" className="text-slate-900">
                    {/* Top-left finder pattern */}
                    <rect x="10" y="10" width="50" height="50" />
                    <rect x="20" y="20" width="30" height="30" fill="white" />
                    <rect x="30" y="30" width="10" height="10" />

                    {/* Top-right finder pattern */}
                    <rect x="180" y="10" width="50" height="50" />
                    <rect x="190" y="20" width="30" height="30" fill="white" />
                    <rect x="200" y="30" width="10" height="10" />

                    {/* Bottom-left finder pattern */}
                    <rect x="10" y="180" width="50" height="50" />
                    <rect x="20" y="190" width="30" height="30" fill="white" />
                    <rect x="30" y="200" width="10" height="10" />

                    {/* Data area - random pattern for mock */}
                    <circle cx="120" cy="120" r="40" fillOpacity="0.1" />
                    <rect x="70" y="100" width="10" height="10" />
                    <rect x="100" y="80" width="10" height="10" />
                    <rect x="140" y="110" width="10" height="10" />
                    <rect x="110" y="140" width="10" height="10" />
                    <rect x="80" y="150" width="10" height="10" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Pass Information */}
            <div className="space-y-4 mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-slate-900">Pass Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600">Pass ID</p>
                  <p className="font-mono font-semibold text-slate-900">{pass.id}</p>
                </div>
                <div>
                  <p className="text-slate-600">Pass Type</p>
                  <p className="font-semibold text-slate-900">Attendee</p>
                </div>
                <div>
                  <p className="text-slate-600">Valid For</p>
                  <p className="font-semibold text-slate-900">{pass.eventTitle}</p>
                </div>
                <div>
                  <p className="text-slate-600">Validity</p>
                  <p className="font-semibold text-slate-900">{pass.date}</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-8 flex gap-3">
              <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-600">
                <p className="font-medium text-slate-900 mb-1">How to use your pass:</p>
                <p>Show this QR code at the event entrance. Staff will scan it for quick check-in.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button className="flex-1 gap-2">
                <Download className="w-4 h-4" />
                Download Pass
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
