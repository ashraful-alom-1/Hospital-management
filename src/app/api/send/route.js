import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// Supabase Connection for Backend Counting
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
    const userEmail = process.env.EMAIL_USER;
    const userPass = process.env.EMAIL_PASS;

    try {
        const { email, name, date, phone } = await req.json();

        if (!userEmail || !userPass) {
            throw new Error("Email credentials missing in .env.local");
        }

        // --- AUTOMATIC TIME CALCULATION LOGIC ---
        // 1. Check existing bookings for that date
        const { data: records } = await supabase
            .from("appointments")
            .select("id")
            .eq("date", date);

        const patientIndex = records ? records.length : 0;

        // 2. Generate Time: Start 10:00 AM + (Patient Number * 20 minutes)
        let startTime = new Date();
        startTime.setHours(10, 0, 0, 0); 
        startTime.setMinutes(startTime.getMinutes() + (patientIndex * 20));

        // Format to readable time (e.g., 10:40 AM)
        const allottedTime = startTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        });

        // 3. Nodemailer Configuration
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: userEmail,
                pass: userPass.replace(/\s+/g, ''),
            },
        });

        const mailOptions = {
            from: `"Abhayapuri Care Hospital" <${userEmail}>`,
            to: email,
            subject: 'Appointment Confirmed - Abhayapuri Care Hospital',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                    <div style="background: #2563eb; padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; letter-spacing: 3px; font-size: 28px; font-weight: 900;">ABHAYAPURI CARE</h1>
                        <p style="color: #bfdbfe; margin: 10px 0 0 0; font-weight: 500;">Your Health, Our Priority</p>
                    </div>
                    <div style="padding: 40px; color: #334155; line-height: 1.8;">
                        <h2 style="color: #1e40af; font-size: 22px;">Hello ${name},</h2>
                        <p>We are pleased to confirm your appointment. Our system has allotted you a specific time slot based on today's schedule.</p>
                        
                        <div style="background-color: #f8fafc; padding: 30px; border-radius: 20px; margin: 30px 0; border-left: 6px solid #2563eb;">
                            <p style="margin: 10px 0; font-size: 16px;"><strong>📅 Appointment Date:</strong> ${date}</p>
                            <p style="margin: 10px 0; font-size: 18px; color: #2563eb;"><strong>⏰ Allotted Time:</strong> ${allottedTime}</p>
                            <p style="margin: 10px 0; font-size: 16px;"><strong>📞 Contact Number:</strong> ${phone}</p>
                            <p style="margin: 10px 0; font-size: 16px;"><strong>📍 Location:</strong> Ward No. 4, Abhayapuri</p>
                        </div>

                        <p style="background: #fff1f2; color: #be123c; padding: 15px; border-radius: 12px; font-size: 13px; font-weight: 600;">
                            ⚠️ Note: Please arrive at the hospital at least 15 minutes before your allotted time (${allottedTime}).
                        </p>
                        
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 35px 0;" />
                        <p style="font-size: 12px; color: #94a3b8; text-align: center; font-weight: 500;">
                            © 2026 Abhayapuri Care Hospital | Bongaigaon, Assam<br>
                            This is an automated message. Please do not reply.
                        </p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("Mail Error:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}