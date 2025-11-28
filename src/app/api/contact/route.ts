import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  location: string;
  purpose: string;
  budget: string;
  message: string;
  consent: boolean;
}

export async function GET() {
  return NextResponse.json({ message: 'Contact API endpoint - POST method required' });
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    const { fullName, phone, city, location, purpose, consent } = body;

    if (!fullName || !phone || !city || !location || !purpose || !consent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.OWNER_EMAIL || 'sahay@aapkizameen.org',
      subject: `New Property Inquiry from ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6D1F;">New Property Inquiry</h2>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Contact Information:</h3>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${body.email || 'Not provided'}</p>
            <p><strong>City/State:</strong> ${city}</p>
          </div>

          <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Property Requirements:</h3>
            <p><strong>Interested Location:</strong> ${location}</p>
            <p><strong>Purpose:</strong> ${purpose}</p>
            <p><strong>Budget Range:</strong> ${body.budget || 'Not specified'}</p>
            <p><strong>Message:</strong> ${body.message || 'No additional message'}</p>
          </div>

          <p style="color: #666; font-size: 14px;">
            This inquiry was submitted through the AapkiZameen website contact form.
          </p>
        </div>
      `,
    };

    // Send email to owner
    await transporter.sendMail(mailOptions);

    // Send confirmation email to user (if email provided)
    if (body.email) {
      const userConfirmationMail = {
        from: process.env.SMTP_USER,
        to: body.email,
        subject: 'Thank you for your inquiry - AapkiZameen',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 20px;">
              <h1 style="color: #FF6D1F; margin-bottom: 10px;">AapkiZameen</h1>
              <p style="color: #666; margin-bottom: 30px;">Your Trusted Partner for Land Across India</p>
            </div>

            <div style="background: linear-gradient(135deg, #FF6D1F, #FF8C4F); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
              <h2 style="margin: 0; font-size: 24px;">Thank You for Your Interest!</h2>
            </div>

            <div style="background-color: #f9f9f9; padding: 25px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #FF6D1F; margin-bottom: 15px;">Dear ${fullName},</h3>

              <p style="line-height: 1.6; margin-bottom: 20px;">
                Thank you for reaching out to AapkiZameen! We have received your property inquiry and appreciate your interest in our land services.
              </p>

              <div style="background-color: #fff; padding: 15px; border-radius: 6px; border-left: 4px solid #FF6D1F; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Location of Interest:</strong> ${location}</p>
                <p style="margin: 5px 0;"><strong>Purpose:</strong> ${purpose}</p>
                ${body.budget ? `<p style="margin: 5px 0;"><strong>Budget Range:</strong> ${body.budget}</p>` : ''}
              </div>

              <p style="line-height: 1.6; margin-bottom: 20px;">
                Our team of experts will review your requirements and connect with you within 24 hours to discuss the best property options that match your needs.
              </p>

              <p style="line-height: 1.6; margin-bottom: 20px;">
                We look forward to helping you find the perfect land investment opportunity!
              </p>
            </div>

            <div style="text-align: center; padding: 20px; color: #666;">
              <p style="margin-bottom: 10px;"><strong>Contact Us:</strong></p>
              <p style="margin: 5px 0;">📞 +91 8319872570</p>
              <p style="margin: 5px 0;">✉️ sahay@aapkizameen.org</p>
              <p style="margin: 5px 0;">📍 123 Business District, Mumbai 400001</p>
            </div>

            <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; margin-top: 20px;">
              <p style="color: #666; font-size: 14px;">
                © 2024 AapkiZameen. All rights reserved. | Trusted land services across India
              </p>
            </div>
          </div>
        `,
      };

      // Send confirmation email to user (log error but don't fail the request)
      try {
        await transporter.sendMail(userConfirmationMail);
        console.log('User confirmation email sent successfully to:', body.email);
      } catch (userEmailError) {
        console.error('Failed to send confirmation email to user:', body.email, userEmailError);
        // Don't fail the request - owner email was already sent successfully
      }
    }

    return NextResponse.json({
      message: 'Inquiry sent successfully. We will connect with you soon.'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send inquiry. Please try again.' },
      { status: 500 }
    );
  }
}
