import { NextRequest, NextResponse } from 'next/server';
import { generateQRCodeDataURL, createQRPayload } from '@/lib/qr';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { passCode, type, eventTitle, eventDate, userName } = body;

    if (!passCode || !type || !eventTitle || !eventDate || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the QR payload
    const payload = createQRPayload(
      passCode,
      type,
      eventTitle,
      eventDate,
      userName
    );

    // Generate QR code
    const qrCodeDataURL = await generateQRCodeDataURL(payload, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300,
      margin: 2,
    });

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataURL,
      passCode,
      payload,
    });
  } catch (error) {
    console.error('QR generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
