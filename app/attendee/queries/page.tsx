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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageSquare, Send, CheckCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AttendeeQuery {
  id: string;
  conferenceId: string;
  question: string;
  category: 'general' | 'registration' | 'accommodation' | 'logistics' | 'technical';
  reply?: string;
  status: 'open' | 'answered';
  createdAt: string;
}

const mockQueries: AttendeeQuery[] = [
  {
    id: '1',
    conferenceId: '1',
    question: 'Is there parking available at the venue?',
    category: 'logistics',
    reply: 'Yes, complimentary parking is available for all registered attendees in the parking lot behind the convention center.',
    status: 'answered',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    conferenceId: '1',
    question: 'Will there be a networking session?',
    category: 'general',
    reply: undefined,
    status: 'open',
    createdAt: '2024-01-12',
  },
];

export default function AttendeeQueriesPage() {
  const [queries, setQueries] = useState<AttendeeQuery[]>(mockQueries);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState<'general' | 'registration' | 'accommodation' | 'logistics' | 'technical'>('general');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQueries = queries.filter((q) =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddQuery = () => {
    if (!newQuestion.trim()) {
      toast.error('Please enter your question');
      return;
    }

    const query: AttendeeQuery = {
      id: Math.random().toString(36).substr(2, 9),
      conferenceId: '1',
      question: newQuestion,
      category: newCategory,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    setQueries([...queries, query]);
    toast.success('Question submitted to organizer');
    setNewQuestion('');
    setNewCategory('general');
    setIsAddingNew(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'registration':
        return 'bg-green-50 text-green-700';
      case 'accommodation':
        return 'bg-purple-50 text-purple-700';
      case 'logistics':
        return 'bg-orange-50 text-orange-700';
      case 'technical':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <DashboardLayout role="attendee" userName="John Attendee" userEmail="attendee@example.com">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Queries</h1>
            <p className="text-slate-600 mt-1">Ask questions about the event</p>
          </div>
          <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="w-4 h-4" />
                Ask Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Ask a Question</DialogTitle>
                <DialogDescription>Submit your question to the organizer</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <Select value={newCategory} onValueChange={(value: any) => setNewCategory(value)}>
                    <SelectTrigger className="mt-1 bg-white border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="registration">Registration</SelectItem>
                      <SelectItem value="accommodation">Accommodation</SelectItem>
                      <SelectItem value="logistics">Logistics</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Your Question</label>
                  <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Ask your question here..."
                    className="w-full mt-1 p-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={5}
                  />
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddQuery}
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Send className="w-4 h-4" />
                    Submit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Input
          placeholder="Search your questions..."
          className="bg-white border-slate-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Queries */}
        <div className="space-y-4">
          {filteredQueries.map((query) => (
            <Card key={query.id} className="p-6 border-slate-200">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-indigo-600" />
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getCategoryColor(query.category)}`}>
                        {query.category.charAt(0).toUpperCase() + query.category.slice(1).replace('_', ' ')}
                      </span>
                      <span
                        className={`ml-auto text-xs font-medium px-2 py-1 rounded-full border ${
                          query.status === 'answered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        {query.status === 'answered' ? 'Answered' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{new Date(query.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Question */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-slate-700 mb-2">Your Question:</p>
                  <p className="text-slate-900">{query.question}</p>
                </div>

                {/* Reply */}
                {query.reply && (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <p className="text-sm font-medium text-emerald-700">Organizer's Reply:</p>
                    </div>
                    <p className="text-emerald-900">{query.reply}</p>
                  </div>
                )}

                {query.status === 'open' && (
                  <div className="text-center py-2 text-sm text-slate-600">
                    Waiting for organizer's response...
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredQueries.length === 0 && (
          <Card className="p-12 border-slate-200 text-center">
            <p className="text-slate-600">No questions yet. Ask one to get started!</p>
          </Card>
        )}

        {/* Summary */}
        <Card className="p-6 border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-900 mb-3">Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-slate-900">{queries.length}</p>
              <p className="text-sm text-slate-600">Total Questions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">
                {queries.filter((q) => q.status === 'answered').length}
              </p>
              <p className="text-sm text-slate-600">Answered</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
