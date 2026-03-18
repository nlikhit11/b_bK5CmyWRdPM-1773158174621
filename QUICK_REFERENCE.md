# ConferenceHub - Quick Reference Guide

## Portal Access & Default Credentials

### Test Accounts
```
Guest Speaker:  speaker@example.com / password
Attendee:       attendee@example.com / password
Organizer:      organizer@example.com / password
Admin:          admin@example.com / password
Paper Presenter: presenter@example.com / password
```

---

## Quick Navigation

### Organizer Portal (`/organizer`)
| Feature | Path | What You Can Do |
|---------|------|-----------------|
| Dashboard | `/organizer` | View metrics, recent approvals |
| Create Event | `/organizer/create` | Multi-step event creation form |
| **Manage Events** | `/organizer/events` | Edit, update, resubmit, delete events ✨ |
| Speakers | `/organizer/speakers` | Send invitations, manage speakers |
| Attendees | `/organizer/attendees` | View registrations, export lists |
| **Queries** | `/organizer/queries` | Answer speaker & attendee questions ✨ |
| Goodies | `/organizer/goodies` | Track inventory requests |
| Accommodation | `/organizer/accommodation` | Assign hotels to speakers/attendees |

### Guest Speaker Portal (`/speaker`)
| Feature | Path | What You Can Do |
|---------|------|-----------------|
| Dashboard | `/speaker` | View upcoming events, metrics |
| Invitations | `/speaker/invitations` | Accept/reject speaking invitations |
| **Travel** | `//speaker/travel` | Create and manage travel requests ✨ |
| **Accommodation** | `/speaker/accommodation` | View and edit hotel bookings ✨ |
| **Queries** | `/speaker/queries` | Ask event-related questions ✨ |
| QR Pass | `/speaker/pass` | Download event entry pass |

### Attendee Portal (`/attendee`)
| Feature | Path | What You Can Do |
|---------|------|-----------------|
| Dashboard | `/attendee` | View upcoming conferences, alerts |
| Conferences | `/attendee/conferences` | Browse all available conferences |
| **My Registrations** | `/attendee/registrations` | Manage event registrations ✨ |
| **Accommodation** | `/attendee/accommodation` | View and confirm hotel bookings ✨ |
| **Queries** | `/attendee/queries` | Ask event questions ✨ |
| QR Pass | `/attendee/pass` | Download event entry pass |

### Admin Portal (`/admin`)
| Feature | Path | What You Can Do |
|---------|------|-----------------|
| Dashboard | `/admin` | Overview of approvals, metrics |
| Event Approvals | `/admin/approvals` | Review and approve/reject events |
| Speaker Approvals | `/admin/speakers` | Verify and approve speakers |
| Room Requests | `/admin/rooms` | Manage venue room allocations |
| Goodies | `/admin/goodies` | Track inventory approvals |
| Analytics | `/admin/analytics` | View charts and trends |
| **Conferences** | `/admin/conferences` | View all system conferences ✨ |

### Paper Presenter Portal (`/paper-presenter`) ✨ NEW
| Feature | Path | What You Can Do |
|---------|------|-----------------|
| Dashboard | `/paper-presenter` | View submissions, metrics |
| **Submit Paper** | `/paper-presenter/submit` | 4-step paper submission form |
| **My Submissions** | `/paper-presenter/submissions` | Track & manage submissions |
| **Accommodation** | `/paper-presenter/accommodation` | View hotel assignments |
| **Queries** | `/paper-presenter/queries` | Ask submission questions |
| QR Pass | `/paper-presenter/pass` | Download event pass |

---

## Feature Highlights

### 📊 New in This Update

#### ✨ Organizer - Manage Events
- **Edit Events**: Modify event details and resubmit for approval
- **Resubmit Events**: Resubmit rejected events after addressing feedback
- **Delete Events**: Remove events from your list
- **Status Tracking**: See real-time approval status

#### ✨ Organizer - Queries
- **Answer Questions**: Reply to speaker and attendee inquiries
- **Status Management**: Track which queries are answered
- **Smart Filtering**: Filter by status (Open/Answered)
- **Search**: Find specific questions quickly

#### ✨ Guest Speaker - Travel
- **Travel Requests**: Create cab, flight, train, or bus requests
- **Edit & Delete**: Manage your travel arrangements
- **Status Tracking**: See approval status
- **Contact Info**: Store phone number for driver coordination

#### ✨ Guest Speaker - Accommodation
- **View Hotels**: See assigned accommodations
- **Edit Details**: Update room type, dates
- **Confirmation Numbers**: Keep track of bookings
- **Night Calculator**: Automatic calculation of stay duration

#### ✨ Guest Speaker - Queries
- **Ask Questions**: Submit technical, general, accommodation, and logistics questions
- **Get Answers**: See organizer replies in real-time
- **Categorize**: Organize questions by type

#### ✨ Attendee - My Registrations
- **Track Registrations**: View all your event registrations
- **Manage Status**: See registration, check-in, and completion status
- **Cancel Bookings**: Cancel pending registrations
- **View Details**: See accommodation and speaker information

#### ✨ Attendee - Accommodation
- **Confirmed Bookings**: See your approved accommodations
- **Available Options**: View and confirm additional hotels
- **Manage Dates**: Track check-in and check-out dates
- **Contact Hotels**: Get hotel contact information

#### ✨ Attendee - Queries
- **Ask Questions**: Submit registration, accommodation, logistics questions
- **Track Answers**: See organizer responses
- **Categorize Questions**: Organize by question type

#### ✨ Admin - Conferences
- **View All**: See all conferences across the system
- **Filter Status**: View by Pending, Approved, Completed, Rejected
- **Analytics**: View approval rates, completion rates, rejection rates
- **Archive**: Mark events as completed
- **Details Modal**: View full conference information

#### ✨ Paper Presenter Portal (Completely New)
- **Multi-Step Submission**: Complete 4-step paper submission process
  - Step 1: Paper Details (title, abstract, keywords, file)
  - Step 2: Authors (add co-authors, mark presenters)
  - Step 3: Presentation (choose oral/poster, add notes)
  - Step 4: Conference (select event, review, submit)
- **Submission Tracking**: Monitor all your submissions
- **Feedback Review**: See organizer feedback on rejected papers
- **Edit Pending**: Make changes to submissions awaiting review
- **Accommodation**: View assigned hotels for presentations
- **Queries**: Ask submission and presentation questions

---

## Common Workflows

### As an Organizer
```
1. Create Event → /organizer/create
2. Monitor Approvals → /admin/approvals (as admin)
3. Once Approved:
   - Add Speakers → /organizer/speakers
   - Add Attendees → /organizer/attendees
   - Manage Goodies → /organizer/goodies
4. Answer Questions → /organizer/queries
5. Manage Accommodations → /organizer/accommodation
6. Edit Events as Needed → /organizer/events
```

### As a Guest Speaker
```
1. Receive Invitation → /speaker/invitations
2. Accept Invitation
3. Set Up Travel → /speaker/travel
4. Check Accommodation → /speaker/accommodation
5. Ask Questions → /speaker/queries
6. Download Pass → /speaker/pass
```

### As an Attendee
```
1. Browse Events → /attendee/conferences
2. Register for Event
3. View Registration → /attendee/registrations
4. Confirm Hotel → /attendee/accommodation
5. Ask Questions → /attendee/queries
6. Download Pass → /attendee/pass
```

### As a Paper Presenter
```
1. Submit Paper → /paper-presenter/submit
2. Track Submission → /paper-presenter/submissions
3. View Accommodation → /paper-presenter/accommodation
4. Ask Questions → /paper-presenter/queries
5. Get QR Pass → /paper-presenter/pass
```

### As an Admin
```
1. View All Conferences → /admin/conferences
2. Review Event Approvals → /admin/approvals
3. Verify Speakers → /admin/speakers
4. Manage Rooms → /admin/rooms
5. Track Goodies → /admin/goodies
6. View Analytics → /admin/analytics
```

---

## Important Notes

### Status Indicators
- **Pending (Yellow)**: Awaiting approval
- **Approved (Green)**: Approved and active
- **Completed (Blue)**: Event has finished
- **Rejected (Red)**: Rejected by admin, with feedback provided
- **Answered (Green)**: Query answered by organizer

### Common Actions

#### Edit Event (Organizer)
1. Go to `/organizer/events`
2. Click "Edit" on any event
3. Update details
4. Click "Save & Resubmit" (this changes status to pending for re-review)

#### Answer Query
1. Go to `/organizer/queries`
2. Click "Reply" on any open query
3. Type your response
4. Click "Send Reply"

#### Create Travel Request
1. Go to `/speaker/travel`
2. Click "New Request"
3. Fill in pickup, destination, date, time, transport type
4. Click "Submit"

#### Submit Paper
1. Go to `/paper-presenter/submit`
2. Complete all 4 steps:
   - Enter paper details
   - Add authors
   - Choose presentation type
   - Select conference
3. Check confirmation box
4. Click "Submit Paper"

---

## Tips & Best Practices

1. **Always Check Status**: Monitor approval status of your submissions/requests
2. **Use Search**: Quickly find events, queries, papers with search bars
3. **Review Feedback**: Read admin feedback on rejected items before resubmitting
4. **Answer Queries Promptly**: Keep attendees and speakers informed
5. **Plan Ahead**: Submit papers and requests early to avoid last-minute issues
6. **Download Passes**: Save your QR pass before the event
7. **Confirm Details**: Double-check all details before final submission

---

## File Locations

### New/Updated Files
```
components/dashboard-layout.tsx          ← Updated with new roles and navigation
lib/types.ts                              ← Added paper_presenter role and types

/app/organizer/events/page.tsx            ← NEW: Manage Events
/app/organizer/queries/page.tsx           ← NEW: Answer Queries

/app/speaker/travel/page.tsx              ← NEW: Travel Management
/app/speaker/accommodation/page.tsx       ← NEW: View Accommodations
/app/speaker/queries/page.tsx             ← NEW: Ask Questions
/app/speaker/pass/page.tsx                ← UPDATED: Removed Regenerate button

/app/attendee/accommodation/page.tsx      ← NEW: Accommodation Management
/app/attendee/registrations/page.tsx      ← NEW: My Registrations
/app/attendee/queries/page.tsx            ← NEW: Ask Questions

/app/admin/conferences/page.tsx           ← NEW: View All Conferences

/app/paper-presenter/page.tsx             ← NEW: Paper Presenter Dashboard
/app/paper-presenter/submit/page.tsx      ← NEW: Submit Paper Form
/app/paper-presenter/submissions/page.tsx ← NEW: Track Submissions
/app/paper-presenter/accommodation/page.tsx ← NEW: View Accommodations
/app/paper-presenter/queries/page.tsx     ← NEW: Ask Questions
/app/paper-presenter/pass/page.tsx        ← NEW: QR Pass

ENHANCEMENTS_SUMMARY.md                   ← Complete enhancement documentation
QUICK_REFERENCE.md                        ← This file
```

---

## Support

For issues or questions:
1. Check the ENHANCEMENTS_SUMMARY.md for detailed feature documentation
2. Review the relevant page's mock data in the component
3. Test with the provided credentials
4. Inspect browser console for error messages

---

**Last Updated**: January 2024
**Version**: 2.0 - Enhanced Portal Edition
