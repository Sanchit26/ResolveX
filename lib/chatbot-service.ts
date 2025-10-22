import OpenAI from 'openai';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export enum ComplaintFilingState {
  IDLE = 'IDLE',
  ASK_NAME = 'ASK_NAME',
  ASK_EMAIL = 'ASK_EMAIL',
  ASK_DEPARTMENT = 'ASK_DEPARTMENT',
  ASK_CATEGORY = 'ASK_CATEGORY',
  ASK_DESCRIPTION = 'ASK_DESCRIPTION',
  CONFIRM = 'CONFIRM',
  SUBMITTING = 'SUBMITTING'
}

export interface ComplaintData {
  name?: string;
  email?: string;
  department?: string;
  category?: string;
  description?: string;
}

export interface ChatSession {
  id: string;
  userId?: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  complaintState?: ComplaintFilingState;
  complaintData?: ComplaintData;
  // Troubleshooting state
  troubleshootCount?: number;
  isInTroubleshooting?: boolean;
  troubleshootTopic?: string;
  lastTroubleshootAttempt?: Date;
}

export class ChatbotService {
  private static instance: ChatbotService;
  private openai: OpenAI;
  private sessions: Map<string, ChatSession> = new Map();

  private constructor() {
    // Check for OpenRouter API key first (preferred), then fall back to OpenAI
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    
    console.log('🔑 Checking API keys...');
    console.log('   OpenRouter key exists:', !!openrouterKey);
    console.log('   OpenAI key exists:', !!openaiKey);
    
    if (openrouterKey && openrouterKey.startsWith('sk-or-')) {
      console.log('✅ Using OpenRouter API');
      console.log('   Key starts with:', openrouterKey.substring(0, 15));
      console.log('   Key length:', openrouterKey.length);
      
      // Initialize OpenAI client with OpenRouter base URL
      this.openai = new OpenAI({
        apiKey: openrouterKey,
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': 'http://localhost:3000', // Your site URL
          'X-Title': 'Grievance Redressal Portal', // Your site name
        }
      });
    } else if (openaiKey && openaiKey !== 'your-openai-api-key' && openaiKey.startsWith('sk-')) {
      console.log('✅ Using OpenAI API');
      console.log('   Key starts with:', openaiKey.substring(0, 15));
      this.openai = new OpenAI({ apiKey: openaiKey });
    } else {
      console.log('⚠️ No valid API key configured - using fallback responses');
      this.openai = null as any; // Will use fallback responses
    }
  }

  public static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService();
    }
    return ChatbotService.instance;
  }

  public async processMessage(sessionId: string, userMessage: string, userId?: string): Promise<string> {
    let session = this.sessions.get(sessionId);
    
    if (!session) {
      session = this.createSession(sessionId, userId);
    }

    // Add user message to session
    session.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    });

    // Priority 1: Check if explicitly requesting to file complaint
    const explicitComplaintIntent = this.detectComplaintIntent(userMessage);
    
    // Priority 2: Check if we're already in complaint filing mode
    if (session.complaintState !== ComplaintFilingState.IDLE || explicitComplaintIntent) {
      // If explicit intent, reset troubleshooting state
      if (explicitComplaintIntent) {
        session.isInTroubleshooting = false;
        session.troubleshootCount = 0;
      }
      
      const complaintResponse = await this.handleComplaintFiling(session, userMessage);
      
      // Special marker for API route to handle submission
      if (complaintResponse === 'SUBMIT_COMPLAINT') {
        session.updatedAt = new Date();
        this.sessions.set(sessionId, session);
        return complaintResponse;
      }
      
      // Regular complaint filing response
      if (complaintResponse) {
        session.messages.push({
          role: 'assistant',
          content: complaintResponse,
          timestamp: new Date(),
        });
        session.updatedAt = new Date();
        this.sessions.set(sessionId, session);
        return complaintResponse;
      }
    }

    // Priority 3: Check if this is a tech issue that needs troubleshooting
    if (this.isTechRelated(userMessage) && !explicitComplaintIntent) {
      const troubleshootResponse = await this.handleTechTroubleshooting(session, userMessage);
      
      // If troubleshooting triggered complaint filing
      if (troubleshootResponse && (troubleshootResponse.includes('what is your full name') || 
                                    troubleshootResponse.includes('What is your full name'))) {
        // Auto-start complaint filing with detected department
        session.complaintState = ComplaintFilingState.ASK_NAME;
        const detectedDepartment = this.detectDepartmentByKeyword(session.troubleshootTopic || userMessage);
        session.complaintData = {
          department: detectedDepartment || 'IT Support',
          description: `Auto-escalated tech issue: ${session.troubleshootTopic || userMessage}`
        };
      }
      
      if (troubleshootResponse) {
        session.messages.push({
          role: 'assistant',
          content: troubleshootResponse,
          timestamp: new Date(),
        });
        session.updatedAt = new Date();
        this.sessions.set(sessionId, session);
        return troubleshootResponse;
      }
    }

    // If no OpenAI key configured, use fallback immediately
    if (!this.openai) {
      const fallbackResponse = this.getFallbackResponse(userMessage);
      session.messages.push({
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date(),
      });
      session.updatedAt = new Date();
      this.sessions.set(sessionId, session);
      return fallbackResponse;
    }

    // Generate system prompt based on context
    const systemPrompt = this.generateSystemPrompt(userMessage);
    
    // Prepare messages for OpenAI
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...session.messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    try {
      // Use different models based on provider
      const model = process.env.OPENROUTER_API_KEY 
        ? 'openai/gpt-3.5-turbo'  // OpenRouter format
        : 'gpt-3.5-turbo';         // Direct OpenAI format
      
      const response = await this.openai.chat.completions.create({
        model,
        messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      const assistantMessage = response.choices[0]?.message?.content || 'I apologize, but I am unable to process your request at the moment.';
      
      // Add assistant response to session
      session.messages.push({
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date(),
      });

      session.updatedAt = new Date();
      this.sessions.set(sessionId, session);

      return assistantMessage;
    } catch (error) {
      console.error('Chatbot OpenAI error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private createSession(sessionId: string, userId?: string): ChatSession {
    const session: ChatSession = {
      id: sessionId,
      userId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      complaintState: ComplaintFilingState.IDLE,
      complaintData: {},
      troubleshootCount: 0,
      isInTroubleshooting: false,
      troubleshootTopic: undefined,
    };
    
    this.sessions.set(sessionId, session);
    return session;
  }

  // ========== COMPLAINT FILING HELPERS ==========
  
  private readonly DEPARTMENTS = [
    // Public/Government Departments
    'Education',
    'Healthcare',
    'Transportation',
    'Municipal Services',
    'Police',
    'Revenue',
    'Agriculture',
    'Environment',
    // Internal/Corporate Departments
    'IT Support',
    'Human Resources',
    'Finance',
    'Admin & Facilities',
    'Technical Maintenance'
  ];

  private readonly CATEGORIES = [
    // General Categories
    'Infrastructure',
    'Service Delay',
    'Quality Issue',
    'Staff Behavior',
    'Corruption',
    'Safety Concern',
    'Documentation',
    'Other',
    // Technical Categories
    'System Error',
    'Login / Access Issue',
    'Password Reset',
    'Hardware / Device Problem',
    'Network Connectivity',
    'Software Installation',
    'Email / Account Issue'
  ];

  private validateName(name: string): boolean {
    return name.trim().length >= 2 && name.trim().length <= 100;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  private detectDepartmentByKeyword(message: string): string | null {
    const lowerMessage = message.toLowerCase();
    
    // IT Support keywords
    if (lowerMessage.match(/\b(computer|laptop|pc|software|hardware|system|network|wifi|internet|connection|login|password|email|account|access|error|crash|freeze|slow|bug|install|update|printer|mouse|keyboard)\b/)) {
      return 'IT Support';
    }
    
    // Human Resources keywords
    if (lowerMessage.match(/\b(hr|human resources|payroll|salary|leave|vacation|holiday|employee|staff|recruitment|hiring|resignation|benefits|insurance|policy)\b/)) {
      return 'Human Resources';
    }
    
    // Finance keywords
    if (lowerMessage.match(/\b(finance|accounting|payment|invoice|bill|budget|expense|reimbursement|tax|financial|money|cost|purchase|vendor)\b/)) {
      return 'Finance';
    }
    
    // Admin & Facilities keywords
    if (lowerMessage.match(/\b(office|facility|facilities|building|maintenance|cleaning|security|parking|cafeteria|reception|supplies|furniture|room|space)\b/)) {
      return 'Admin & Facilities';
    }
    
    // Technical Maintenance keywords
    if (lowerMessage.match(/\b(repair|fix|broken|damaged|electrical|plumbing|hvac|air conditioning|heating|ventilation|equipment|machinery|technical)\b/)) {
      return 'Technical Maintenance';
    }
    
    // Healthcare keywords
    if (lowerMessage.match(/\b(health|medical|hospital|doctor|nurse|medicine|treatment|patient|clinic|pharmacy)\b/)) {
      return 'Healthcare';
    }
    
    // Education keywords
    if (lowerMessage.match(/\b(school|education|teacher|student|class|exam|course|college|university|study)\b/)) {
      return 'Education';
    }
    
    // Transportation keywords
    if (lowerMessage.match(/\b(transport|bus|train|road|traffic|vehicle|driving|parking|metro|railway)\b/)) {
      return 'Transportation';
    }
    
    // Police keywords
    if (lowerMessage.match(/\b(police|crime|theft|safety|security|law|legal|court|justice)\b/)) {
      return 'Police';
    }
    
    // Municipal Services keywords
    if (lowerMessage.match(/\b(water|sanitation|waste|garbage|sewage|drainage|street|light|municipal)\b/)) {
      return 'Municipal Services';
    }
    
    return null; // No department detected
  }

  private isTechRelated(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    const techKeywords = [
      'computer', 'laptop', 'pc', 'software', 'hardware', 'system', 'network',
      'wifi', 'internet', 'connection', 'login', 'password', 'email', 'account',
      'access', 'error', 'crash', 'freeze', 'slow', 'bug', 'install', 'update',
      'printer', 'mouse', 'keyboard', 'screen', 'monitor', 'browser', 'app',
      'application', 'server', 'database', 'not working', 'broken', 'issue',
      'problem', 'help', 'cant access', "can't access", 'unable to', 'failed'
    ];
    
    return techKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  private detectComplaintIntent(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    const intents = [
      'file complaint',
      'submit complaint',
      'register complaint',
      'make complaint',
      'lodge complaint',
      'want to complain',
      'need to complain',
      'i have a complaint',
      'file a grievance',
      'report an issue',
      'raise a complaint'
    ];
    return intents.some(intent => lowerMessage.includes(intent));
  }

  private async handleComplaintFiling(session: ChatSession, userMessage: string): Promise<string> {
    const state = session.complaintState || ComplaintFilingState.IDLE;
    const data = session.complaintData || {};

    // Start complaint filing if user expresses intent
    if (state === ComplaintFilingState.IDLE && this.detectComplaintIntent(userMessage)) {
      session.complaintState = ComplaintFilingState.ASK_NAME;
      session.complaintData = {};
      return "I'll help you file a complaint. Let's start by collecting some information.\n\nFirst, what is your full name?";
    }

    // Collect name
    if (state === ComplaintFilingState.ASK_NAME) {
      const name = userMessage.trim();
      if (!this.validateName(name)) {
        return "Please provide a valid name (2-100 characters).";
      }
      data.name = name;
      session.complaintState = ComplaintFilingState.ASK_EMAIL;
      session.complaintData = data;
      return `Thank you, ${name}! What is your email address?`;
    }

    // Collect email
    if (state === ComplaintFilingState.ASK_EMAIL) {
      const email = userMessage.trim();
      if (!this.validateEmail(email)) {
        return "Please provide a valid email address (e.g., yourname@example.com).";
      }
      data.email = email;
      session.complaintState = ComplaintFilingState.ASK_DEPARTMENT;
      session.complaintData = data;
      return `Great! Now, which department does your complaint relate to?\n\nAvailable departments:\n${this.DEPARTMENTS.map((d, i) => `${i + 1}. ${d}`).join('\n')}\n\nYou can type the number or the department name.`;
    }

    // Collect department
    if (state === ComplaintFilingState.ASK_DEPARTMENT) {
      let department: string | undefined;
      const input = userMessage.trim();
      
      // Check if input is a number
      const num = parseInt(input);
      if (!isNaN(num) && num >= 1 && num <= this.DEPARTMENTS.length) {
        department = this.DEPARTMENTS[num - 1];
      } else {
        // Check if input matches a department name
        department = this.DEPARTMENTS.find(d => 
          d.toLowerCase() === input.toLowerCase()
        );
      }
      
      if (!department) {
        return `Please select a valid department by typing the number (1-${this.DEPARTMENTS.length}) or the department name.`;
      }
      
      data.department = department;
      session.complaintState = ComplaintFilingState.ASK_CATEGORY;
      session.complaintData = data;
      return `Department selected: ${department}\n\nNow, what category best describes your complaint?\n\nAvailable categories:\n${this.CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nYou can type the number or the category name.`;
    }

    // Collect category
    if (state === ComplaintFilingState.ASK_CATEGORY) {
      let category: string | undefined;
      const input = userMessage.trim();
      
      // Check if input is a number
      const num = parseInt(input);
      if (!isNaN(num) && num >= 1 && num <= this.CATEGORIES.length) {
        category = this.CATEGORIES[num - 1];
      } else {
        // Check if input matches a category name
        category = this.CATEGORIES.find(c => 
          c.toLowerCase() === input.toLowerCase()
        );
      }
      
      if (!category) {
        return `Please select a valid category by typing the number (1-${this.CATEGORIES.length}) or the category name.`;
      }
      
      data.category = category;
      session.complaintState = ComplaintFilingState.ASK_DESCRIPTION;
      session.complaintData = data;
      return `Category selected: ${category}\n\nFinally, please provide a detailed description of your complaint. Be as specific as possible to help us address your issue effectively.`;
    }

    // Collect description
    if (state === ComplaintFilingState.ASK_DESCRIPTION) {
      const description = userMessage.trim();
      if (description.length < 10) {
        return "Please provide a more detailed description (at least 10 characters).";
      }
      if (description.length > 2000) {
        return "Your description is too long. Please keep it under 2000 characters.";
      }
      
      data.description = description;
      session.complaintState = ComplaintFilingState.CONFIRM;
      session.complaintData = data;
      
      return `Please review your complaint details:\n\n` +
        `📋 Name: ${data.name}\n` +
        `📧 Email: ${data.email}\n` +
        `🏢 Department: ${data.department}\n` +
        `📂 Category: ${data.category}\n` +
        `📝 Description: ${data.description}\n\n` +
        `Type "CONFIRM" to submit your complaint, or "CANCEL" to start over.`;
    }

    // Confirmation
    if (state === ComplaintFilingState.CONFIRM) {
      const response = userMessage.trim().toLowerCase();
      
      if (response === 'cancel') {
        session.complaintState = ComplaintFilingState.IDLE;
        session.complaintData = {};
        return "Complaint filing cancelled. If you need any other assistance, feel free to ask!";
      }
      
      if (response === 'confirm') {
        session.complaintState = ComplaintFilingState.SUBMITTING;
        // Return a special marker that the API route will detect
        return 'SUBMIT_COMPLAINT';
      }
      
      return 'Please type "CONFIRM" to submit your complaint or "CANCEL" to start over.';
    }

    return ''; // No complaint filing in progress
  }

  // ========== TECH TROUBLESHOOTING HELPERS ==========

  private async handleTechTroubleshooting(session: ChatSession, userMessage: string): Promise<string> {
    // Initialize troubleshooting state if not present
    if (session.troubleshootCount === undefined) {
      session.troubleshootCount = 0;
      session.isInTroubleshooting = true;
      session.troubleshootTopic = userMessage;
      session.lastTroubleshootAttempt = new Date();
    }

    const lowerMessage = userMessage.toLowerCase();
    
    // Check if user explicitly wants to skip troubleshooting
    if (lowerMessage.includes('file a complaint') || 
        lowerMessage.includes('log a complaint') || 
        lowerMessage.includes('submit a complaint')) {
      session.troubleshootCount = 0;
      session.isInTroubleshooting = false;
      return ''; // Let complaint filing flow take over
    }

    // Check if issue is still not resolved
    const stillNotWorking = lowerMessage.includes('still not working') ||
                           lowerMessage.includes('still broken') ||
                           lowerMessage.includes('still having') ||
                           lowerMessage.includes('not fixed') ||
                           lowerMessage.includes('didnt work') ||
                           lowerMessage.includes("didn't work") ||
                           lowerMessage.includes('no luck') ||
                           lowerMessage.includes('same issue');

    if (stillNotWorking) {
      session.troubleshootCount = (session.troubleshootCount || 0) + 1;
    }

    // Auto-escalate after 3 attempts
    if (session.troubleshootCount >= 3) {
      session.isInTroubleshooting = false;
      
      // Detect department and pre-fill data
      const detectedDepartment = this.detectDepartmentByKeyword(session.troubleshootTopic || userMessage);
      
      return `I've tried to help resolve this issue ${session.troubleshootCount} times, but it seems the problem persists. Let me escalate this to our technical team.\n\n` +
             `🔄 **Auto-Escalating to Complaint System**\n\n` +
             `I'll help you file a formal complaint so our ${detectedDepartment || 'IT Support'} team can investigate further.\n\n` +
             `Let's start by collecting some information.\n\n` +
             `First, what is your full name?`;
    }

    // Attempt troubleshooting with AI
    if (!this.openai) {
      // Fallback: No AI available, auto-escalate
      return `⚠️ I'm unable to troubleshoot right now due to system limitations, but I can log this as a complaint for you.\n\n` +
             `Let me file this with our technical team. What is your full name?`;
    }

    try {
      // Build troubleshooting prompt
      const troubleshootPrompt = `You are an expert IT support assistant helping to troubleshoot technical issues. 

Current Issue: ${session.troubleshootTopic || userMessage}
Attempt: ${(session.troubleshootCount || 0) + 1} of 3

Provide a helpful, step-by-step troubleshooting response. Focus on:
1. Quick fixes and common solutions
2. Clear, actionable steps
3. Asking diagnostic questions if needed
4. Being encouraging and supportive

Keep your response concise (under 300 words) and avoid technical jargon.`;

      const messages = [
        { role: 'system' as const, content: troubleshootPrompt },
        { role: 'user' as const, content: userMessage }
      ];

      const model = process.env.OPENROUTER_API_KEY 
        ? 'openai/gpt-3.5-turbo'
        : 'gpt-3.5-turbo';
      
      const response = await this.openai.chat.completions.create({
        model,
        messages,
        max_tokens: 400,
        temperature: 0.7,
      });

      const troubleshootResponse = response.choices[0]?.message?.content || 
        'I apologize, but I am unable to provide troubleshooting assistance at the moment.';
      
      session.troubleshootCount = (session.troubleshootCount || 0) + 1;
      session.lastTroubleshootAttempt = new Date();

      return `🔧 **Troubleshooting Attempt ${session.troubleshootCount} of 3**\n\n${troubleshootResponse}\n\n` +
             `---\n` +
             `If this doesn't resolve your issue, please let me know and I'll ${session.troubleshootCount >= 2 ? 'escalate this to our technical team' : 'try another solution'}.`;

    } catch (error) {
      console.error('Troubleshooting AI error:', error);
      
      // Check if it's a quota error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('rate limit')) {
        // Auto-escalate on quota errors
        session.isInTroubleshooting = false;
        session.troubleshootCount = 3; // Force escalation
        
        return `⚠️ I'm currently experiencing high demand and unable to troubleshoot right now. Let me escalate this to our technical team instead.\n\n` +
               `I'll help you file a complaint so our team can investigate and resolve your issue.\n\n` +
               `What is your full name?`;
      }
      
      // Generic error fallback
      return this.getFallbackTroubleshootResponse(userMessage);
    }
  }

  private getFallbackTroubleshootResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('login') || lowerMessage.includes('password') || lowerMessage.includes('access')) {
      return `🔑 **Login/Access Issue Troubleshooting:**\n\n` +
             `1. Try clearing your browser cache and cookies\n` +
             `2. Make sure Caps Lock is off\n` +
             `3. Try resetting your password using the "Forgot Password" link\n` +
             `4. Try a different browser (Chrome, Firefox, Edge)\n\n` +
             `If the issue persists, let me know and I can escalate this.`;
    }
    
    if (lowerMessage.includes('network') || lowerMessage.includes('internet') || lowerMessage.includes('wifi')) {
      return `📡 **Network Connectivity Troubleshooting:**\n\n` +
             `1. Check if your WiFi is connected\n` +
             `2. Try turning WiFi off and on again\n` +
             `3. Restart your router/modem\n` +
             `4. Check if other devices can connect\n` +
             `5. Try using an ethernet cable\n\n` +
             `If the issue persists, let me know and I can escalate this.`;
    }
    
    if (lowerMessage.includes('email') || lowerMessage.includes('outlook') || lowerMessage.includes('mail')) {
      return `📧 **Email Issue Troubleshooting:**\n\n` +
             `1. Check your internet connection\n` +
             `2. Verify your email address and password\n` +
             `3. Check your spam/junk folder\n` +
             `4. Try logging out and back in\n` +
             `5. Clear browser cache\n\n` +
             `If the issue persists, let me know and I can escalate this.`;
    }
    
    return `I understand you're experiencing a technical issue. Let me try to help:\n\n` +
           `1. Have you tried restarting the application/device?\n` +
           `2. Is this the first time this issue has occurred?\n` +
           `3. Are you getting any specific error messages?\n\n` +
           `Please provide more details, and if the issue continues, I can escalate it to our technical team.`;
  }

  // ========== END TECH TROUBLESHOOTING HELPERS ==========

  private generateSystemPrompt(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    // Tech support context
    if (this.isTechRelated(userMessage)) {
      return `You are an expert IT support assistant for a complaint management system. Help users troubleshoot technical issues with computers, networks, software, accounts, and devices. Provide clear, step-by-step solutions. Be patient, encouraging, and professional. If an issue cannot be resolved, guide users to file a formal complaint for escalation to the technical team.`;
    }
    
    if (lowerMessage.includes('complaint') || lowerMessage.includes('grievance')) {
      return `You are a helpful AI assistant for a complaint management system. Help users understand how to file complaints for both government services and internal/corporate issues (IT, HR, Finance, Facilities). Be polite, professional, and informative. Keep responses concise and helpful.`;
    }
    
    if (lowerMessage.includes('track') || lowerMessage.includes('status')) {
      return `You are helping users track their complaint status. Explain how to use tracking IDs and what different statuses mean. Be helpful and guide them to the tracking page.`;
    }
    
    if (lowerMessage.includes('department') || lowerMessage.includes('category')) {
      return `You are helping users understand which department their complaint belongs to. We have both public departments (Education, Healthcare, etc.) and internal departments (IT Support, HR, Finance, etc.). Explain the different departments and categories available.`;
    }
    
    if (lowerMessage.includes('urgent') || lowerMessage.includes('emergency')) {
      return `You are dealing with an urgent complaint. Provide immediate guidance and emphasize the importance of filing the complaint properly. Be reassuring but professional.`;
    }
    
    return `You are a helpful AI assistant for a comprehensive complaint management system handling both government grievances and internal corporate issues. Provide friendly, professional assistance. Help users with technical troubleshooting, complaint filing, tracking, and general guidance. Keep responses concise and actionable.`;
  }

  private getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! I\'m here to help you with the grievance redressal portal. How can I assist you today?';
    }
    
    if (lowerMessage.includes('complaint') || lowerMessage.includes('file')) {
      return 'To file a complaint, please visit our complaint form page. You can find it by clicking "File Complaint" on the homepage. The form will guide you through the process step by step.';
    }
    
    if (lowerMessage.includes('track') || lowerMessage.includes('status')) {
      return 'To track your complaint status, you can use the tracking form on our homepage. Just enter your tracking ID and you\'ll see the current status and any updates.';
    }
    
    if (lowerMessage.includes('department')) {
      return 'We have several departments including Education, Healthcare, Transportation, Municipal Services, Police, Revenue, Agriculture, and Environment. The system will automatically suggest the appropriate department based on your complaint.';
    }
    
    if (lowerMessage.includes('time') || lowerMessage.includes('duration')) {
      return 'Response times vary by department and complexity. Generally, simple complaints are resolved within 3-5 working days, while complex issues may take 10-15 working days. You can track the progress using your tracking ID.';
    }
    
    return 'I\'m here to help you with the grievance redressal portal. You can file complaints, track their status, and get updates. What specific assistance do you need?';
  }

  public getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  public getComplaintData(sessionId: string): ComplaintData | undefined {
    const session = this.sessions.get(sessionId);
    return session?.complaintData;
  }

  public resetComplaintState(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.complaintState = ComplaintFilingState.IDLE;
      session.complaintData = {};
      this.sessions.set(sessionId, session);
    }
  }

  public clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  public getSessionHistory(sessionId: string): ChatMessage[] {
    const session = this.sessions.get(sessionId);
    return session ? session.messages : [];
  }
}
