import QRCode from 'qrcode';

export interface QRCodeOptions {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  type?: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/svg+xml';
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

/**
 * Generate QR code as data URL string
 * Used for rendering in the browser or sending to frontend
 */
export async function generateQRCodeDataURL(
  data: string,
  options: QRCodeOptions = {}
): Promise<string> {
  try {
    const defaultOptions: any = {
      errorCorrectionLevel: options.errorCorrectionLevel || 'M',
      type: options.type || 'image/png',
      width: options.width || 300,
      margin: options.margin || 1,
      color: options.color || {
        dark: '#000000',
        light: '#FFFFFF',
      },
    };

    const qrCodeDataURL = await QRCode.toDataURL(data, defaultOptions);
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate QR code as SVG string
 * Useful for embedding in documents or PDFs
 */
export async function generateQRCodeSVG(
  data: string,
  options: QRCodeOptions = {}
): Promise<string> {
  try {
    const defaultOptions: any = {
      errorCorrectionLevel: options.errorCorrectionLevel || 'M',
      type: 'image/svg+xml',
      width: options.width || 300,
      margin: options.margin || 1,
      color: options.color || {
        dark: '#000000',
        light: '#FFFFFF',
      },
    };

    const svgString = await QRCode.toString(data, defaultOptions);
    return svgString;
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    throw new Error('Failed to generate QR code SVG');
  }
}

/**
 * Generate a unique pass code for QR code
 */
export function generatePassCode(
  type: 'speaker' | 'attendee',
  eventId: string,
  userId: string
): string {
  const prefix = type === 'speaker' ? 'SPK' : 'ATT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const hash = btoa(`${eventId}-${userId}`).substring(0, 8);
  return `${prefix}-${timestamp}-${hash}`;
}

/**
 * Create QR code payload object
 */
export function createQRPayload(
  passCode: string,
  type: 'speaker' | 'attendee',
  eventTitle: string,
  eventDate: string,
  userName: string
): string {
  const payload = {
    code: passCode,
    type,
    event: eventTitle,
    date: eventDate,
    name: userName,
    timestamp: new Date().toISOString(),
  };

  return JSON.stringify(payload);
}

/**
 * Validate QR code payload
 */
export function validateQRPayload(qrData: string): boolean {
  try {
    const payload = JSON.parse(qrData);
    return !!(payload.code && payload.type && payload.event);
  } catch {
    return false;
  }
}
