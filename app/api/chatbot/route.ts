import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import { ChatbotService } from '@/lib/chatbot-service';
import { generateTrackingId } from '@/lib/utils';
import { NLPService } from '@/lib/nlp-service';

// Enhanced chatbot service that works with MongoDB
export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Message and sessionId are required' },
        { status: 400 }
      );
    }

    console.log('📨 Chatbot received message:', message);

    // Connect to MongoDB
    await connectDB();

    // Use the chatbot service to process the message
    const chatbotService = ChatbotService.getInstance();
    const response = await chatbotService.processMessage(sessionId, message);

    // Check if the response is a special marker for complaint submission
    if (response === 'SUBMIT_COMPLAINT') {
      const complaintData = chatbotService.getComplaintData(sessionId);
      
      if (!complaintData || !complaintData.name || !complaintData.email || 
          !complaintData.department || !complaintData.category || !complaintData.description) {
        return NextResponse.json({
          success: false,
          error: 'Incomplete complaint data',
        }, { status: 400 });
      }

      try {
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

        // NLP Analysis
        let nlpAnalysis: any = {
          sentiment: 'neutral',
          priority: 'Medium',
          urgency: 5,
          complexity: 5,
          suggestedDepartment: complaintData.department,
          keywords: [],
          tags: [],
        };
        
        try {
          const nlpService = NLPService.getInstance();
          nlpAnalysis = nlpService.analyzeComplaint(complaintData.description);
          console.log('✓ NLP analysis completed');
        } catch (nlpError) {
          console.log('⚠ NLP analysis failed, using defaults:', nlpError);
        }

        // Determine complaint type based on department
        const internalDepartments = ['IT Support', 'Human Resources', 'Finance', 'Admin & Facilities', 'Technical Maintenance'];
        const complaintType = internalDepartments.includes(complaintData.department || '') ? 'Internal' : 'Public';

        // Create complaint
        const complaint = new Complaint({
          trackingId,
          name: complaintData.name,
          email: complaintData.email,
          department: nlpAnalysis.suggestedDepartment || complaintData.department,
          category: complaintData.category,
          description: complaintData.description,
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
        console.log('✅ Complaint saved to database');

        // Reset complaint state
        chatbotService.resetComplaintState(sessionId);

        const successMessage = `✅ **Complaint Filed Successfully!**\n\n` +
          `Your tracking ID is: **${trackingId}**\n\n` +
          `📋 **Summary:**\n` +
          `• Name: ${complaintData.name}\n` +
          `• Email: ${complaintData.email}\n` +
          `• Department: ${complaint.department}\n` +
          `• Category: ${complaintData.category}\n` +
          `• Priority: ${complaint.priority}\n` +
          `• Sentiment: ${complaint.sentiment}\n\n` +
          `📧 A confirmation email will be sent to ${complaintData.email}\n\n` +
          `You can track your complaint status anytime using your tracking ID. ` +
          `The ${complaint.department} department will review your complaint and respond soon.\n\n` +
          `Is there anything else I can help you with?`;

        return NextResponse.json({
          success: true,
          response: successMessage,
          trackingId,
        });

      } catch (submitError) {
        console.error('❌ Error submitting complaint:', submitError);
        chatbotService.resetComplaintState(sessionId);
        return NextResponse.json({
          success: false,
          error: 'Failed to submit complaint. Please try again.',
        }, { status: 500 });
      }
    }

    // Analyze user intent for non-complaint-filing queries
    const lowerMessage = message.toLowerCase();
    const isTrackingQuery = lowerMessage.includes('track') || 
                           lowerMessage.includes('status') || 
                           lowerMessage.includes('gr') ||
                           /gr\d+/.test(lowerMessage);
    
    const isComplaintStats = lowerMessage.includes('how many') || 
                            lowerMessage.includes('total') ||
                            lowerMessage.includes('statistics');

    // Handle tracking ID queries
    if (isTrackingQuery) {
      const trackingIdMatch = message.match(/GR[A-Z0-9]+/i) || message.match(/\b[A-Z0-9]{10,}\b/);
      
      if (trackingIdMatch) {
        const trackingId = trackingIdMatch[0].toUpperCase();
        console.log('🔍 Looking for tracking ID:', trackingId);
        
        const complaint = await Complaint.findOne({ trackingId });
        
        if (complaint) {
          return NextResponse.json({
            success: true,
            response: `📋 **Complaint Status**\n\n` +
                     `**Tracking ID:** ${complaint.trackingId}\n` +
                     `**Status:** ${complaint.status}\n` +
                     `**Department:** ${complaint.department}\n` +
                     `**Category:** ${complaint.category}\n` +
                     `**Filed on:** ${new Date(complaint.dateFiled).toLocaleDateString()}\n` +
                     `**Priority:** ${complaint.priority}\n\n` +
                     (complaint.adminReply ? `**Admin Note:** ${complaint.adminReply}\n\n` : '') +
                     `Your complaint is being processed by the ${complaint.department} department.`
          });
        } else {
          return NextResponse.json({
            success: true,
            response: `❌ Sorry, I couldn't find any complaint with tracking ID "${trackingId}". Please make sure you've entered the correct tracking ID. You can find it in the email confirmation sent when you filed the complaint.`
          });
        }
      }
    }

    // Handle complaint statistics queries
    if (isComplaintStats) {
      const totalComplaints = await Complaint.countDocuments();
      const pendingCount = await Complaint.countDocuments({ status: 'Pending' });
      const inProgressCount = await Complaint.countDocuments({ status: 'In Progress' });
      const resolvedCount = await Complaint.countDocuments({ status: 'Resolved' });
      const rejectedCount = await Complaint.countDocuments({ status: 'Rejected' });

      return NextResponse.json({
        success: true,
        response: `📊 **Complaint Statistics**\n\n` +
                 `**Total Complaints:** ${totalComplaints}\n` +
                 `**Pending:** ${pendingCount}\n` +
                 `**In Progress:** ${inProgressCount}\n` +
                 `**Resolved:** ${resolvedCount}\n` +
                 `**Rejected:** ${rejectedCount}\n\n` +
                 `All complaints are being actively monitored by our team.`
      });
    }

    // Return the regular chatbot response
    console.log('✅ Chatbot response generated');

    return NextResponse.json({
      success: true,
      response,
    });

  } catch (error: any) {
    console.error('❌ Chatbot error:', error);
    
    // Return intelligent fallback response
    return NextResponse.json({
      success: true,
      response: getFallbackResponse(await request.json().then(data => data.message)),
    });
  }
}

// Fallback responses when AI is unavailable
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return '👋 Hello! I\'m your AI assistant for the Grievance Redressal Portal. I can help you:\n\n' +
           '• File a complaint directly through this chat\n' +
           '• Track your complaint status\n' +
           '• Get information about complaint statistics\n' +
           '• Learn about the complaint process\n\n' +
           'How can I assist you today?';
  }
  
  if (lowerMessage.includes('track') || lowerMessage.includes('status')) {
    return '🔍 To track your complaint, please provide your tracking ID (it looks like GR518582ZTBEMB). ' +
           'You can find this ID in the confirmation email sent when you filed your complaint.\n\n' +
           'Just type or paste your tracking ID, and I\'ll fetch the current status for you!';
  }
  
  if (lowerMessage.includes('file') || lowerMessage.includes('complaint') || lowerMessage.includes('submit')) {
    return '📝 I can help you file a complaint right here in the chat! Just say:\n\n' +
           '"I want to file a complaint"\n\n' +
           'I\'ll guide you through the process step by step, collecting:\n' +
           '• Your name and email\n' +
           '• Department and category\n' +
           '• Detailed description\n\n' +
           'Once submitted, you\'ll receive a tracking ID immediately!\n\n' +
           'Alternatively, you can use the "File Complaint" form on the homepage.';
  }
  
  if (lowerMessage.includes('department')) {
    return '🏢 Available departments:\n\n' +
           '• Education - School and education issues\n' +
           '• Healthcare - Medical and health services\n' +
           '• Transportation - Road and transport issues\n' +
           '• Municipal Services - Water, sanitation, waste\n' +
           '• Police - Law enforcement matters\n' +
           '• Revenue - Tax and revenue concerns\n' +
           '• Agriculture - Farming and agricultural issues\n' +
           '• Environment - Environmental concerns\n\n' +
           'The system will automatically route your complaint to the appropriate department.';
  }
  
  if (lowerMessage.includes('time') || lowerMessage.includes('long') || lowerMessage.includes('duration')) {
    return '⏱️ **Response Times:**\n\n' +
           '• Simple issues: 3-5 working days\n' +
           '• Complex issues: 10-15 working days\n' +
           '• Urgent complaints: Prioritized within 24-48 hours\n\n' +
           'You can track your complaint\'s progress anytime using your tracking ID. ' +
           'The system will also send email updates on status changes.';
  }
  
  return 'I\'m here to help with the Grievance Redressal Portal! You can:\n\n' +
         '• File a complaint directly in this chat\n' +
         '• Track complaints by providing your tracking ID\n' +
         '• Get complaint statistics\n' +
         '• Learn about the complaint process\n\n' +
         'What would you like to do?';
}
