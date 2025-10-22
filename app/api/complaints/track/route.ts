import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('trackingId');

    if (!trackingId) {
      return NextResponse.json(
        { error: 'Tracking ID is required' },
        { status: 400 }
      );
    }

    const complaint = await Complaint.findOne({ trackingId });

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found with this tracking ID' },
        { status: 404 }
      );
    }

    return NextResponse.json({ complaint });
  } catch (error: any) {
    console.error('Error tracking complaint:', error);
    return NextResponse.json(
      { error: 'Failed to track complaint' },
      { status: 500 }
    );
  }
}



