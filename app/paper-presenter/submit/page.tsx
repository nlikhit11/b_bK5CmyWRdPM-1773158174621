'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

interface PaperForm {
  paper_title: string;
  paper_pages: string;
}

export default function PaperSubmissionPage() {
  const [form, setForm] = useState<PaperForm>({
    paper_title: '',
    paper_pages: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.paper_title.trim()) {
      toast.error('Please enter a paper title');
      return;
    }

    if (!form.paper_pages || isNaN(Number(form.paper_pages))) {
      toast.error('Please enter the number of pages');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paper_title: form.paper_title,
          paper_pages: parseInt(form.paper_pages),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message || 'Failed to submit paper');
        setLoading(false);
        return;
      }

      toast.success('Paper submitted successfully!');
      setForm({ paper_title: '', paper_pages: '' });
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Remove the multi-step UI since we have a simple form

  return (
    <DashboardLayout role="paper_presenter" userName="Dr. John Research" userEmail="presenter@example.com">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Submit Your Paper</h1>
          <p className="text-slate-600 mt-2">Submit your research paper with basic details</p>
        </div>

        {/* Form */}
        <Card className="p-8 border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Paper Title *</label>
              <Input
                placeholder="Enter your paper title"
                value={form.paper_title}
                onChange={(e) => setForm({ ...form, paper_title: e.target.value })}
                className="bg-white border-slate-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Number of Pages *</label>
              <Input
                type="number"
                placeholder="Enter number of pages"
                value={form.paper_pages}
                onChange={(e) => setForm({ ...form, paper_pages: e.target.value })}
                className="bg-white border-slate-200"
                min="1"
                required
              />
            </div>

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
                'Submit Paper'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
