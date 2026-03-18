# ConferenceHub - Setup & Deployment Guide

## Quick Start

### 1. Environment Setup

Create `.env.local` in the project root:

```env
# Database Connection
DATABASE_URL=postgresql://user:password@localhost:5432/conferenceHub

# JWT Secret for Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long!

# Node Environment
NODE_ENV=development
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Database

The database schema has already been created and initialized. The application is ready to use with the existing schema which includes:

- Users table with role-based access (admin, organizer, speaker, attendee)
- Conferences table for events
- Speakers, Attendees, and Approvals tables
- Room bookings and goodies inventory management
- QR passes for event check-in
- Accommodation management
- And more (20+ tables total)

### 4. Run Development Server

```bash
pnpm run dev
```

Visit `http://localhost:3000` to see the application running.

## Demo Credentials

Test the application with these pre-configured demo accounts:

### Admin Account
- Email: `admin@example.com`
- Password: `password`
- Role: Location Owner/Admin
- Access: Event approvals, speaker verification, room management, goodies inventory, analytics

### Organizer Account
- Email: `organizer@example.com`
- Password: `password`
- Role: Event Organizer
- Access: Create events, manage speakers/attendees, request goodies/accommodation

### Speaker Account
- Email: `speaker@example.com`
- Password: `password`
- Role: Speaker
- Access: View invitations, manage accommodation, download QR pass

### Attendee Account
- Email: `attendee@example.com`
- Password: `password`
- Role: Attendee
- Access: Browse events, register, manage accommodations, QR pass

## Project Overview

### Pages & Routes

#### Public Pages
- `/` - Landing page with features and upcoming events
- `/login` - User login
- `/signup` - User registration

#### Admin Dashboard
- `/admin` - Admin dashboard with metrics and charts
- `/admin/approvals` - Event approval workflow
- `/admin/speakers` - Speaker verification
- `/admin/rooms` - Room booking requests
- `/admin/goodies` - Goodies inventory management
- `/admin/analytics` - Analytics and reports

#### Organizer Dashboard
- `/organizer` - Organizer dashboard with alerts
- `/organizer/create` - Multi-step event creation form
- `/organizer/events` - Event management
- `/organizer/speakers` - Speaker management
- `/organizer/attendees` - Attendee management (with CSV export)
- `/organizer/goodies` - Goodies inventory tracking
- `/organizer/accommodation` - Accommodation management
- `/organizer/queries` - Event-related queries

#### Speaker Dashboard
- `/speaker` - Speaker dashboard
- `/speaker/invitations` - Manage invitations
- `/speaker/travel` - Request travel/cab
- `/speaker/accommodation` - View accommodation details
- `/speaker/pass` - Download QR code pass

#### Attendee Dashboard
- `/attendee` - Attendee dashboard
- `/attendee/conferences` - Browse and register for conferences
- `/attendee/registrations` - View registrations
- `/attendee/accommodation` - View accommodation
- `/attendee/pass` - Download QR code pass

#### Other
- `/profile` - User profile settings
- `/api/*` - Various API endpoints for auth, QR generation, and CSV export

## Key Features

### Multi-Role Authentication
- JWT-based authentication with HTTP-only cookies
- Role-based access control (Admin, Organizer, Speaker, Attendee)
- Secure password hashing with bcryptjs

### Event Management
- Multi-step event creation form with validation
- Event approval workflow with feedback system
- Room booking requests with capacity management
- Speaker invitations and tracking
- Attendee registration and management

### QR Code System
- Server-side QR code generation
- Unique pass codes for speakers and attendees
- QR codes encoded with event details

### CSV Export
- Export attendee lists with registration status
- Export speaker lists with invitation status
- Download event summary reports
- Powered by papaparse for streaming support

### Smart Alerts
- Room capacity overflow warnings
- Missing speaker accommodation alerts
- Inventory shortage notifications
- Event approval reminders
- Registration deadline alerts

### Analytics & Reporting
- Dashboard charts showing events per month
- Attendance trends visualization
- Event type distribution
- Speaker response status tracking
- Revenue tracking (demo data)

## Customization

### Color Scheme
The application uses a professional SaaS-style color palette:
- Primary: Indigo/Blue (`from-blue-600 to-indigo-600`)
- Secondary: Light Gray (`slate-*`)
- Accent: Purple (`purple-*`)

Customize colors in TailwindCSS classes throughout the components.

### Database
To modify the database schema, create a new SQL migration file in `scripts/` and execute it using the database connection.

### Dependencies
All required dependencies are already configured in `package.json`:
- Next.js 15 - React framework
- TailwindCSS - Utility-first CSS
- shadcn/ui - Pre-built UI components
- Recharts - Charting library
- qrcode - QR code generation
- papaparse - CSV parsing
- sonner - Toast notifications
- And more...

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### QR Code Generation
- `POST /api/qr/generate` - Generate QR code for event pass

### CSV Export
- `POST /api/export/attendees` - Export attendee list
- `POST /api/export/speakers` - Export speaker list

## Development Tips

### Adding a New Page
1. Create a new directory under `app/` with the role/feature name
2. Add `page.tsx` with your component
3. Wrap with `DashboardLayout` for dashboard pages
4. Update sidebar navigation in `components/dashboard-layout.tsx` if needed

### Database Operations
```typescript
import { query } from '@/lib/db';

// Execute a query
const result = await query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// Access rows
const users = result.rows;
```

### Authentication
```typescript
import { getCurrentUser, createToken } from '@/lib/auth';

// Get current user
const user = await getCurrentUser();

// Create JWT token
const token = await createToken(user);
```

### QR Code Generation
```typescript
import { generateQRCodeDataURL, generatePassCode } from '@/lib/qr';

// Generate QR code
const qrDataUrl = await generateQRCodeDataURL(data);

// Generate unique pass code
const passCode = generatePassCode('speaker', eventId, userId);
```

### CSV Export (Client-Side)
```typescript
import { exportToCSV } from '@/lib/csv';

// Export data
exportToCSV(attendees, {
  filename: 'attendees.csv',
  includeHeader: true,
});
```

## Deployment to Vercel

### Prerequisites
- Vercel account
- GitHub repository with the code

### Steps
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Secret key for JWT
4. Deploy

### Post-Deployment
- Database schema should be created on Vercel's PostgreSQL (Neon)
- Set appropriate environment variables
- Test all authentication flows
- Verify QR code generation works
- Test CSV exports

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database credentials
- Ensure database server is running
- For Neon: Check connection pooler settings

### Authentication Not Working
- Ensure `JWT_SECRET` is set
- Check cookies are enabled in browser
- Verify auth endpoints are working (`/api/auth/login`)

### QR Code Not Generating
- Check `qrcode` package is installed
- Verify server-side generation is enabled
- Check API endpoint `/api/qr/generate` responds correctly

### CSV Export Issues
- Ensure `papaparse` is installed
- Check browser allows downloads
- Verify data format in export function

## Performance Optimization

### Already Implemented
- NextJS automatic code splitting
- Image optimization
- CSS-in-JS with TailwindCSS
- Database query optimization
- Efficient component rendering

### Recommendations
- Implement caching for frequently accessed data
- Use database indexes for common queries
- Consider Redis for session management
- Implement pagination for large datasets

## Security Best Practices

### Implemented
- JWT authentication with HTTP-only cookies
- Password hashing with bcryptjs
- SQL injection prevention with parameterized queries
- CORS headers on API routes
- Environment variable protection

### Additional Measures
- Implement rate limiting on API endpoints
- Add CSRF protection
- Set up HTTPS enforcement
- Regular security audits
- Keep dependencies updated

## Support & Resources

- **Documentation**: See `README.md` for comprehensive documentation
- **Issues**: Check GitHub issues for common problems
- **Database**: Review `scripts/01-init-schema.sql` for schema reference
- **Types**: Check `lib/types.ts` for TypeScript interfaces

## Next Steps

1. **Customize branding** - Update logo, colors, and text
2. **Configure email** - Set up email notifications
3. **Add payment** - Integrate Stripe for ticketing (optional)
4. **Analytics** - Set up Google Analytics or similar
5. **Monitoring** - Configure error tracking with Sentry
6. **Testing** - Add automated tests

---

**Happy building! For questions, refer to the README.md or check the codebase.**
