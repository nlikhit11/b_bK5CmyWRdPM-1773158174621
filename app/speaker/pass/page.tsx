'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Info } from 'lucide-react';
import Image from 'next/image';

export default function SpeakerQRPassPage() {
  // Mock QR code - in production, this would be generated server-side
  const qrCodeUrl =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ffffff" width="200" height="200"/%3E%3Cg fill="%23000000"%3E%3Crect x="20" y="20" width="40" height="40"/%3E%3Crect x="30" y="30" width="20" height="20" fill="%23ffffff"/%3E%3Crect x="140" y="20" width="40" height="40"/%3E%3Crect x="150" y="30" width="20" height="20" fill="%23ffffff"/%3E%3Crect x="20" y="140" width="40" height="40"/%3E%3Crect x="30" y="150" width="20" height="20" fill="%23ffffff"/%3E%3C/g%3E%3C/svg%3E';

  return (
    <DashboardLayout role="speaker" userName="Speaker User" userEmail="speaker@example.com">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your QR Pass</h1>
          <p className="text-slate-600 mt-2">Use this QR code for event entry and check-in</p>
        </div>

        {/* Pass Card */}
        <Card className="p-8 border-slate-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Speaker Pass</h2>
            <p className="text-slate-600">Dr. Sarah Johnson • TechCorp AI Labs</p>
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
                <p className="font-mono font-semibold text-slate-900">SPK-2026-00001</p>
              </div>
              <div>
                <p className="text-slate-600">Pass Type</p>
                <p className="font-semibold text-slate-900">Speaker</p>
              </div>
              <div>
                <p className="text-slate-600">Valid For</p>
                <p className="font-semibold text-slate-900">Tech Summit 2026</p>
              </div>
              <div>
                <p className="text-slate-600">Validity</p>
                <p className="font-semibold text-slate-900">Mar 15-17, 2026</p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-8 flex gap-3">
            <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-600">
              <p className="font-medium text-slate-900 mb-1">How to use your pass:</p>
              <p>Show this QR code at the event entrance. It will be scanned for check-in verification.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1 gap-2">
              <Download className="w-4 h-4" />
              Download Pass
            </Button>
          </div>
        </Card>

        {/* Multiple Passes */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Other Passes</h2>
          <Card className="p-6 border-slate-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">AI Conference 2026</p>
                  <p className="text-sm text-slate-600">May 10-12, 2026</p>
                </div>
                <Button variant="outline" size="sm">
                  View Pass
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
