import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ContactModel } from "../model/contact";
import nodemailer from "nodemailer";

// GET - Fetch all contacts (for admin)
export async function GET() {
  try {
    await connectDB();
    const contacts = await ContactModel.find().sort({ createdAt: -1 });
    console.log("Fetched Contacts:", contacts);
    return NextResponse.json({ data: contacts, count: contacts.length });
  } catch (error) {
    console.error("GET Contact Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

// POST - Create new contact
export async function POST(req: Request) {
  try {
    await connectDB();
    type ContactBody = {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
      recaptchaToken?: string;
    };

    let body: ContactBody = {};
    try {
      body = await req.json();
    } catch (jsonError) {
      return NextResponse.json(
        { error: "Invalid or missing JSON body" },
        { status: 400 }
      );
    }
    const {
      name,
      email,
      phone,
      message,
      recaptchaToken,
    } = body;

    const fullName = name?.trim() || '';

    // Validate required fields early
    if (!fullName || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Enhanced SMTP HTML Email Template - Professional and Responsive
    const smtpTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Submission</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #0d6efd 0%, #6610f2 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .details table { width: 100%; border-collapse: collapse; }
          .details td { padding: 12px 8px; border-bottom: 1px solid #dee2e6; }
          .details td:first-child { font-weight: 600; color: #495057; width: 120px; }
          .message-section { background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
          .message-section h3 { margin-top: 0; color: #0d6efd; }
          .message-section p { white-space: pre-line; color: #495057; line-height: 1.6; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
          .footer hr { border: none; border-top: 1px solid #dee2e6; margin: 20px 0; }
          @media (max-width: 600px) { .container { margin: 10px; } .content { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📩 New Contact Form Submission</h1>
          </div>
          <div class="content">
            <p style="font-size: 16px; color: #495057; line-height: 1.6; margin-bottom: 25px;">
              Hello! A new contact has been submitted via your website's contact form. Below are the complete details for your review.
            </p>
            <div class="details">
              <table>
                <tr>
                  <td>👤 Name</td>
                  <td>${fullName}</td>
                </tr>
                <tr>
                  <td>📧 Email</td>
                  <td><a href="mailto:${email}" style="color: #0d6efd; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td>📞 Phone</td>
                  <td><a href="tel:${phone}" style="color: #0d6efd; text-decoration: none;">${phone}</a></td>
                </tr>
              </table>
            </div>
            <div class="message-section">
              <h3>💬 Message</h3>
              <p>${message}</p>
            </div>
          </div>
          <div class="footer">
            <hr>
            <p>📅 Submitted on: ${new Date().toLocaleString()}</p>
            <p>This is an automated notification from your <strong>Contact Form</strong>. No reply needed.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Enhanced Plain Text Template - Clean and Readable
    const whatsappTemplate = `New Contact Form Submission

👤 Name: ${fullName}
📧 Email: ${email}
📞 Phone: ${phone}

💬 Message:
${message}

---
Submitted on: ${new Date().toLocaleString()}
This is an automated message from your Contact Form.`;

    console.log("reCAPTCHA Token:", recaptchaToken);

    // Optional: verify Google reCAPTCHA if configured (support both RECAPTCHA_SECRET_KEY and RECAPTCHA_SECRET env names)
    const secret = process.env.RECAPTCHA_SECRET_KEY || process.env.RECAPTCHA_SECRET;
    if (secret) {
      try {
        const params = new URLSearchParams();
        params.append('secret', secret);
        params.append('response', recaptchaToken || '');
        const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        });
        const verifyJson = await verifyRes.json();
        // verifyJson can be the v2 response or v3 response (which includes a `score`)
        if (!verifyJson.success) {
          return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
        }
        // For reCAPTCHA v3, also enforce a minimum score to reduce spam
        if (typeof verifyJson.score !== 'undefined') {
          const minScore = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5);
          if (verifyJson.score < minScore) {
            console.warn('Low reCAPTCHA score', verifyJson.score);
            return NextResponse.json({ error: 'reCAPTCHA score too low' }, { status: 400 });
          }
        }
      } catch (e) {
        console.error('reCAPTCHA verify error', e);
        return NextResponse.json({ error: 'reCAPTCHA verification error' }, { status: 400 });
      }
    }

    // Send notification email to admin about new contact (best-effort)
    try {
      // Support both SMTP_* and MAIL_* env var names and provide safe defaults
      const user = process.env.SMTP_USER || process.env.MAIL_USER;
      const pass = process.env.SMTP_PASS || process.env.MAIL_PASS;
      const host = process.env.SMTP_HOST || process.env.MAIL_HOST || "smtp.gmail.com";
      const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : (process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 465);
      const secure = typeof process.env.SMTP_SECURE !== "undefined"
        ? (process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === "1")
        : (typeof process.env.MAIL_SECURE !== "undefined"
          ? (process.env.MAIL_SECURE === "true" || process.env.MAIL_SECURE === "1")
          : port === 465);

      if (user && pass) {
        const transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: { user, pass },
          // timeouts help diagnose flaky/closed sockets faster
          connectionTimeout: 10000,
          greetingTimeout: 5000,
          socketTimeout: 10000,
        });

        // Better logging for transporter errors
        try {
          const info = await transporter.sendMail({
            from: `"Contact Form" <${user}>`,
            to: process.env.CONTACT_NOTIFY_EMAIL || user,
            subject: "New Contact Form Submission",
            html: smtpTemplate,
            text: whatsappTemplate,
          });
          console.log("Contact notification email sent:", info?.messageId || info);
        } catch (sendErr) {
          // Safely get message/stack without using `any` to satisfy lint rules
          let seMsg: string | undefined;
          try {
            if (typeof sendErr === 'string') seMsg = sendErr;
            else if (sendErr && typeof (sendErr as Record<string, unknown>)['message'] === 'string') {
              seMsg = (sendErr as Record<string, unknown>)['message'] as string;
            } else {
              seMsg = JSON.stringify(sendErr);
            }
          } catch {
            seMsg = String(sendErr);
          }
          console.error("Failed to send contact notification email:", seMsg);
        }
      } else {
        console.log("SMTP credentials not configured; skipping email send");
      }

    } catch (mailError) {
      // Catch any unexpected error in the mail block
      let meMsg: string | undefined;
      try {
        if (typeof mailError === 'string') meMsg = mailError;
        else if (mailError && typeof (mailError as Record<string, unknown>)['message'] === 'string') {
          meMsg = (mailError as Record<string, unknown>)['message'] as string;
        } else {
          meMsg = JSON.stringify(mailError);
        }
      } catch {
        meMsg = String(mailError);
      }
      console.error("Unexpected error in mail send block:", meMsg);
    }

  // Create new contact (split fullName into first/last for the schema)
  const nameParts = fullName.split(' ').filter(Boolean);
  const computedFirstName = (nameParts[0] || '').trim();
  const computedLastName = (nameParts.slice(1).join(' ') || '').trim();

    const newContact = await ContactModel.create({
      firstName: computedFirstName,
      lastName: computedLastName,
      email,
      phone,
  companyName: "",
  companyWebsite: "",
      message,
      status: "new",
    });

    return NextResponse.json(
      {
        message: "Contact form submitted successfully",
        data: newContact,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Contact Error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}

// PATCH - Update contact status (for admin)
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and status are required" },
        { status: 400 }
      );
    }

    const updatedContact = await ContactModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedContact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Contact status updated",
      data: updatedContact,
    });
  } catch (error) {
    console.error("PATCH Contact Error:", error);
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}

// DELETE - Delete contact (for admin)
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedContact = await ContactModel.findByIdAndDelete(id);

    if (!deletedContact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Contact Error:", error);
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}