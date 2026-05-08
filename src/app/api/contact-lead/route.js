import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const HOSPITAL_CONTACT_EMAIL = "ashraful.abh@gmail.com";

export async function POST(req) {
  const userEmail = process.env.EMAIL_USER;
  const userPass = process.env.EMAIL_PASS;

  try {
    const { name, email, phone, question } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Name, email, and phone are required." },
        { status: 400 }
      );
    }

    if (!userEmail || !userPass) {
      throw new Error("Email credentials missing in .env.local");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: userEmail,
        pass: userPass.replace(/\s+/g, ""),
      },
    });

    await transporter.sendMail({
      from: `"Abhayapuri Care Chat" <${userEmail}>`,
      to: HOSPITAL_CONTACT_EMAIL,
      replyTo: email,
      subject: "New AI Chat Contact Request - Abhayapuri Care",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; color: #1e293b;">
          <h2 style="color: #2563eb;">New AI Chat Contact Request</h2>
          <p>A visitor could not get an exact answer from the AI assistant and left their details for follow-up.</p>
          <div style="background: #f8fafc; border-left: 5px solid #2563eb; padding: 18px; border-radius: 12px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Visitor Question:</strong> ${question || "Not provided"}</p>
          </div>
          <p style="font-size: 12px; color: #64748b;">Please contact the visitor as soon as possible.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact Lead Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
