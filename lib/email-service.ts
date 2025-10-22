import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface ComplaintNotification {
  trackingId: string;
  status: string;
  department: string;
  category: string;
  complainantName: string;
  complainantEmail: string;
  description: string;
  adminReply?: string;
  estimatedResolution?: Date;
}

export class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password',
      },
    });
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'Grievance Portal <noreply@grievance-portal.com>',
        ...options,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  public async sendComplaintConfirmation(notification: ComplaintNotification): Promise<void> {
    const subject = `Complaint Filed Successfully - ${notification.trackingId}`;
    const html = this.generateComplaintConfirmationEmail(notification);
    const text = this.generateComplaintConfirmationText(notification);

    await this.sendEmail({
      to: notification.complainantEmail,
      subject,
      html,
      text,
    });
  }

  public async sendStatusUpdate(notification: ComplaintNotification): Promise<void> {
    const subject = `Complaint Status Updated - ${notification.trackingId}`;
    const html = this.generateStatusUpdateEmail(notification);
    const text = this.generateStatusUpdateText(notification);

    await this.sendEmail({
      to: notification.complainantEmail,
      subject,
      html,
      text,
    });
  }

  public async sendResolutionNotification(notification: ComplaintNotification): Promise<void> {
    const subject = `Complaint Resolved - ${notification.trackingId}`;
    const html = this.generateResolutionEmail(notification);
    const text = this.generateResolutionText(notification);

    await this.sendEmail({
      to: notification.complainantEmail,
      subject,
      html,
      text,
    });
  }

  public async sendEscalationNotification(notification: ComplaintNotification): Promise<void> {
    const subject = `Complaint Escalated - ${notification.trackingId}`;
    const html = this.generateEscalationEmail(notification);
    const text = this.generateEscalationText(notification);

    await this.sendEmail({
      to: notification.complainantEmail,
      subject,
      html,
      text,
    });
  }

  private generateComplaintConfirmationEmail(notification: ComplaintNotification): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Complaint Filed Successfully</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .tracking-id { background: #e5e7eb; padding: 15px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold; }
          .details { margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Complaint Filed Successfully</h1>
          </div>
          <div class="content">
            <p>Dear ${notification.complainantName},</p>
            <p>Your complaint has been successfully filed and is under review. Please save your tracking ID for future reference.</p>
            
            <div class="tracking-id">
              Tracking ID: ${notification.trackingId}
            </div>
            
            <div class="details">
              <div class="detail-row">
                <strong>Department:</strong> ${notification.department}
              </div>
              <div class="detail-row">
                <strong>Category:</strong> ${notification.category}
              </div>
              <div class="detail-row">
                <strong>Status:</strong> ${notification.status}
              </div>
              <div class="detail-row">
                <strong>Date Filed:</strong> ${new Date().toLocaleDateString()}
              </div>
            </div>
            
            <p>You can track the progress of your complaint using the tracking ID above. We will notify you of any updates.</p>
            
            <p>Thank you for using our grievance redressal portal.</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateComplaintConfirmationText(notification: ComplaintNotification): string {
    return `
Complaint Filed Successfully

Dear ${notification.complainantName},

Your complaint has been successfully filed and is under review.

Tracking ID: ${notification.trackingId}
Department: ${notification.department}
Category: ${notification.category}
Status: ${notification.status}
Date Filed: ${new Date().toLocaleDateString()}

You can track the progress of your complaint using the tracking ID above. We will notify you of any updates.

Thank you for using our grievance redressal portal.

This is an automated message. Please do not reply to this email.
    `;
  }

  private generateStatusUpdateEmail(notification: ComplaintNotification): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Complaint Status Updated</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .status { background: #d1fae5; padding: 15px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold; }
          .reply { background: #fef3c7; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Complaint Status Updated</h1>
          </div>
          <div class="content">
            <p>Dear ${notification.complainantName},</p>
            <p>Your complaint status has been updated.</p>
            
            <div class="status">
              Tracking ID: ${notification.trackingId}<br>
              New Status: ${notification.status}
            </div>
            
            ${notification.adminReply ? `
            <div class="reply">
              <strong>Official Reply:</strong><br>
              ${notification.adminReply}
            </div>
            ` : ''}
            
            ${notification.estimatedResolution ? `
            <p><strong>Estimated Resolution Date:</strong> ${notification.estimatedResolution.toLocaleDateString()}</p>
            ` : ''}
            
            <p>You can continue to track your complaint using your tracking ID.</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateStatusUpdateText(notification: ComplaintNotification): string {
    return `
Complaint Status Updated

Dear ${notification.complainantName},

Your complaint status has been updated.

Tracking ID: ${notification.trackingId}
New Status: ${notification.status}

${notification.adminReply ? `Official Reply: ${notification.adminReply}` : ''}

${notification.estimatedResolution ? `Estimated Resolution Date: ${notification.estimatedResolution.toLocaleDateString()}` : ''}

You can continue to track your complaint using your tracking ID.

This is an automated message. Please do not reply to this email.
    `;
  }

  private generateResolutionEmail(notification: ComplaintNotification): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Complaint Resolved</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .resolution { background: #d1fae5; padding: 15px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Complaint Resolved</h1>
          </div>
          <div class="content">
            <p>Dear ${notification.complainantName},</p>
            <p>Great news! Your complaint has been resolved.</p>
            
            <div class="resolution">
              Tracking ID: ${notification.trackingId}<br>
              Status: RESOLVED
            </div>
            
            ${notification.adminReply ? `
            <p><strong>Resolution Details:</strong></p>
            <p>${notification.adminReply}</p>
            ` : ''}
            
            <p>Thank you for using our grievance redressal portal. We hope this resolution meets your satisfaction.</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateResolutionText(notification: ComplaintNotification): string {
    return `
Complaint Resolved

Dear ${notification.complainantName},

Great news! Your complaint has been resolved.

Tracking ID: ${notification.trackingId}
Status: RESOLVED

${notification.adminReply ? `Resolution Details: ${notification.adminReply}` : ''}

Thank you for using our grievance redressal portal. We hope this resolution meets your satisfaction.

This is an automated message. Please do not reply to this email.
    `;
  }

  private generateEscalationEmail(notification: ComplaintNotification): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Complaint Escalated</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .escalation { background: #fee2e2; padding: 15px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Complaint Escalated</h1>
          </div>
          <div class="content">
            <p>Dear ${notification.complainantName},</p>
            <p>Your complaint has been escalated to a higher authority for further review.</p>
            
            <div class="escalation">
              Tracking ID: ${notification.trackingId}<br>
              Status: ESCALATED
            </div>
            
            <p>This escalation ensures that your complaint receives the attention it deserves. You will be notified of any further updates.</p>
            
            <p>Thank you for your patience.</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateEscalationText(notification: ComplaintNotification): string {
    return `
Complaint Escalated

Dear ${notification.complainantName},

Your complaint has been escalated to a higher authority for further review.

Tracking ID: ${notification.trackingId}
Status: ESCALATED

This escalation ensures that your complaint receives the attention it deserves. You will be notified of any further updates.

Thank you for your patience.

This is an automated message. Please do not reply to this email.
    `;
  }
}
