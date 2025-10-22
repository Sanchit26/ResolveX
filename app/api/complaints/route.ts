import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import { generateTrackingId } from '@/lib/utils';
import { NLPService } from '@/lib/nlp-service';
import { EmailService } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Starting complaint submission ===');
    
    // Connect to database
    await connectDB();
    console.log('✓ Connected to MongoDB');
    
    const body = await request.json();
    const { name, email, department, category, description, images, documents } = body;
    console.log('✓ Request body parsed:', { name, email, department, category });

    // Validation
    if (!name || !email || !department || !category || !description) {
      console.log('✗ Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Generate unique tracking ID
    let trackingId;
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      trackingId = generateTrackingId();
      const existing = await Complaint.findOne({ trackingId });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }
    console.log('✓ Generated tracking ID:', trackingId);

    // NLP Analysis (with error handling)
    let nlpAnalysis: any = {
      sentiment: 'neutral',
      priority: 'Medium',
      urgency: 5,
      complexity: 5,
      suggestedDepartment: department,
      keywords: [],
      tags: [],
    };
    
    try {
      const nlpService = NLPService.getInstance();
      nlpAnalysis = nlpService.analyzeComplaint(description);
      console.log('✓ NLP analysis completed');
    } catch (nlpError) {
      console.log('⚠ NLP analysis failed, using defaults:', nlpError);
      // Continue with default values
    }

    // Determine complaint type based on department
    const internalDepartments = ['IT Support', 'Human Resources', 'Finance', 'Admin & Facilities', 'Technical Maintenance'];
    const complaintType = internalDepartments.includes(department) ? 'Internal' : 'Public';

    // Create complaint with NLP insights
    const complaint = new Complaint({
      trackingId,
      name,
      email,
      department: nlpAnalysis.suggestedDepartment || department,
      category,
      description,
      status: 'Pending',
      priority: nlpAnalysis.priority || 'Medium',
      type: complaintType,
      dateFiled: new Date(),
      updatedAt: new Date(),
      
      // NLP Analysis
      sentiment: nlpAnalysis.sentiment || 'neutral',
      keywords: nlpAnalysis.keywords || [],
      urgency: nlpAnalysis.urgency || 5,
      complexity: nlpAnalysis.complexity || 5,
      tags: nlpAnalysis.tags || [],
      
      // Media
      images: images || [],
      documents: documents || [],
      
      // Analytics
      viewCount: 0,
      responseTime: null,
      satisfaction: null,
      
      // Routing
      assignedTo: null,
      estimatedResolution: null,
      
      // Escalation
      escalationLevel: 0,
      escalationReason: null,
      escalatedAt: null,
    });

    await complaint.save();
    console.log('✓ Complaint saved to database');

    // Send email notification (optional, don't fail if it errors)
    try {
      const emailService = EmailService.getInstance();
      await emailService.sendComplaintConfirmation({
        trackingId: trackingId!,
        status: complaint.status,
        department: complaint.department,
        category: complaint.category,
        complainantName: complaint.name,
        complainantEmail: complaint.email,
        description: complaint.description,
      });
      console.log('✓ Email notification sent');
    } catch (emailError) {
      console.log('⚠ Email notification failed (non-critical):', emailError);
      // Don't fail the request if email fails
    }

    console.log('=== Complaint submission successful ===');
    return NextResponse.json({
      success: true,
      trackingId,
      message: 'Complaint submitted successfully',
      complaint: {
        trackingId: complaint.trackingId,
        name: complaint.name,
        email: complaint.email,
        department: complaint.department,
        category: complaint.category,
        status: complaint.status,
        priority: complaint.priority,
        dateFiled: complaint.dateFiled,
      },
      nlpAnalysis: {
        sentiment: nlpAnalysis.sentiment,
        priority: nlpAnalysis.priority,
        urgency: nlpAnalysis.urgency,
        complexity: nlpAnalysis.complexity,
        suggestedDepartment: nlpAnalysis.suggestedDepartment,
        keywords: nlpAnalysis.keywords,
        tags: nlpAnalysis.tags,
      },
    });
  } catch (error: any) {
    console.error('✗ Error creating complaint:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    return NextResponse.json(
      { 
        error: 'Failed to create complaint',
        details: error.message,
        hint: 'Please check MongoDB connection and try again'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('=== Fetching complaints ===');
    await connectDB();
    console.log('✓ Connected to MongoDB');
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const department = searchParams.get('department');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};
    if (status && status !== 'All') filter.status = status;
    if (department) filter.department = department;
    if (category) filter.category = category;

    console.log('✓ Filter:', filter);

    const complaints = await Complaint.find(filter)
      .sort({ dateFiled: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Complaint.countDocuments(filter);

    console.log(`✓ Found ${complaints.length} complaints (total: ${total})`);

    return NextResponse.json({
      complaints,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('✗ Error fetching complaints:', error);
    console.error('Error details:', error.message);
    return NextResponse.json(
      { 
        error: 'Failed to fetch complaints',
        details: error.message,
        complaints: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 }
      },
      { status: 500 }
    );
  }
}



