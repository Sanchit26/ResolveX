import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, userInfo, useDefault = false } = body;

    let targetPhoneNumber = phoneNumber;

    // If useDefault is true or no phone number provided, use the default number
    if (useDefault || !phoneNumber) {
      targetPhoneNumber = process.env.DEFAULT_CALL_NUMBER;
      
      if (!targetPhoneNumber) {
        return NextResponse.json(
          { success: false, error: 'No default phone number configured' },
          { status: 400 }
        );
      }
    }

    if (!targetPhoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(targetPhoneNumber)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Call the Twilio calling agent
    const callingAgentUrl = process.env.CALLING_AGENT_URL || 'http://localhost:3000';
    
    console.log(`📞 Triggering call to ${targetPhoneNumber} via ${callingAgentUrl}/call-user`);
    
    const response = await fetch(`${callingAgentUrl}/call-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: targetPhoneNumber,
        userInfo: userInfo || {}
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Calling agent error:', errorData);
      
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.error || 'Failed to initiate call',
          details: errorData.details
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('✅ Call initiated successfully:', result);

    return NextResponse.json({
      success: true,
      message: 'Call initiated successfully',
      callSid: result.callSid,
      phoneNumber: targetPhoneNumber,
      details: result
    });

  } catch (error) {
    console.error('Error in call-me API:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check calling agent status
export async function GET() {
  try {
    const callingAgentUrl = process.env.CALLING_AGENT_URL || 'http://localhost:3000';
    
    const response = await fetch(`${callingAgentUrl}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Calling agent is not available',
          callingAgentUrl 
        },
        { status: 503 }
      );
    }

    const healthData = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Calling agent is healthy',
      callingAgentUrl,
      health: healthData
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Cannot connect to calling agent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}