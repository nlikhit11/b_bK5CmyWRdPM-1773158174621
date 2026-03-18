import Papa from 'papaparse';

export interface CSVExportOptions {
  filename?: string;
  headers?: string[];
  includeHeader?: boolean;
}

/**
 * Export data to CSV and trigger download
 */
export function exportToCSV(
  data: any[],
  options: CSVExportOptions = {}
): void {
  const {
    filename = `export-${new Date().toISOString().split('T')[0]}.csv`,
    headers,
    includeHeader = true,
  } = options;

  // Convert data using Papa Parse
  const csv = Papa.unparse(data, {
    headers: headers || true,
    header: includeHeader,
  });

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate attendee report CSV
 */
export function generateAttendeeReport(
  attendees: any[],
  eventTitle: string
): string {
  const data = attendees.map((attendee) => ({
    'Full Name': attendee.name || attendee.first_name + ' ' + attendee.last_name,
    'Email': attendee.email,
    'Organization': attendee.organization || '-',
    'Phone': attendee.phone || '-',
    'Registration Status': attendee.registration_status || 'Registered',
    'Accommodation Required': attendee.accommodation_required ? 'Yes' : 'No',
    'Registered Date': attendee.created_at
      ? new Date(attendee.created_at).toISOString().split('T')[0]
      : '-',
  }));

  return Papa.unparse(data);
}

/**
 * Generate speaker report CSV
 */
export function generateSpeakerReport(
  speakers: any[],
  eventTitle: string
): string {
  const data = speakers.map((speaker) => ({
    'Speaker Name': speaker.name,
    'Email': speaker.email,
    'Organization': speaker.organization || '-',
    'Topic': speaker.topic || '-',
    'Invitation Status': speaker.invitation_status || 'Pending',
    'Acceptance Status': speaker.acceptance_status || 'Invited',
    'Accommodation Required': speaker.accommodation_required ? 'Yes' : 'No',
    'Invited Date': speaker.created_at
      ? new Date(speaker.created_at).toISOString().split('T')[0]
      : '-',
  }));

  return Papa.unparse(data);
}

/**
 * Generate event summary report CSV
 */
export function generateEventSummaryReport(
  events: any[]
): string {
  const data = events.map((event) => ({
    'Event Name': event.title || event.name,
    'Date': event.date,
    'Venue': event.venue || event.location || '-',
    'Status': event.status || '-',
    'Expected Attendees': event.expected_attendees || '-',
    'Registered Attendees': event.registered_count || '-',
    'Speakers': event.speaker_count || '-',
    'Created Date': event.created_at
      ? new Date(event.created_at).toISOString().split('T')[0]
      : '-',
  }));

  return Papa.unparse(data);
}

/**
 * Download CSV string as file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Parse CSV string to JSON array
 */
export function parseCSV(
  csv: string
): Promise<{ data: any[]; errors: any[] }> {
  return new Promise((resolve) => {
    Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve({
          data: results.data,
          errors: results.errors,
        });
      },
      error: (error) => {
        resolve({
          data: [],
          errors: [error],
        });
      },
    });
  });
}

/**
 * Validate CSV data structure
 */
export function validateCSVStructure(
  data: any[],
  requiredFields: string[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(data) || data.length === 0) {
    errors.push('Data must be a non-empty array');
    return { valid: false, errors };
  }

  const firstRow = data[0];
  for (const field of requiredFields) {
    if (!(field in firstRow)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
