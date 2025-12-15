// Email service for sending OTP codes
// In production, integrate with services like SendGrid, AWS SES, or Nodemailer

export interface EmailConfig {
  from: string
  to: string
  subject: string
  html: string
}

// Generate 6-digit OTP code
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Mock email service - replace with real email service in production
export async function sendEmail(config: EmailConfig): Promise<boolean> {
  try {
    // In development, just log the email content
    console.log('📧 Email Service - Sending OTP:')
    console.log('   From:', config.from)
    console.log('   To:', config.to)
    console.log('   Subject:', config.subject)
    console.log('   Content:', config.html)
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In production, replace this with actual email service
    // Example with Nodemailer:
    /*
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })
    
    await transporter.sendMail({
      from: config.from,
      to: config.to,
      subject: config.subject,
      html: config.html
    })
    */
    
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

// Send OTP email to admin
export async function sendAdminOTP(email: string, otpCode: string): Promise<boolean> {
  const emailConfig: EmailConfig = {
    from: 'noreply@ethiopiahomebroker.com',
    to: email,
    subject: 'Ethiopia Home Broker - Admin Login Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #009639; margin-bottom: 10px;">Ethiopia Home Broker</h1>
          <h2 style="color: #333; margin-bottom: 20px;">Admin Login Verification</h2>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #333; font-size: 16px; margin-bottom: 15px;">
            Hello Admin,
          </p>
          <p style="color: #333; font-size: 16px; margin-bottom: 15px;">
            You are attempting to log in to the Ethiopia Home Broker admin dashboard. 
            Please use the verification code below to complete your login:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #009639; color: white; font-size: 32px; font-weight: bold; 
                        padding: 15px 30px; border-radius: 8px; display: inline-block; letter-spacing: 5px;">
              ${otpCode}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
            This code will expire in 10 minutes for security reasons.
          </p>
          <p style="color: #666; font-size: 14px;">
            If you did not attempt to log in, please ignore this email.
          </p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px;">
            Ethiopia Home Broker Admin System<br>
            This is an automated message, please do not reply.
          </p>
        </div>
      </div>
    `
  }
  
  return await sendEmail(emailConfig)
}