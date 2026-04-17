import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        const { email, name, date, phone } = await req.json();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Abhayapuri Care Hospital" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Booking Confirmed - Abhayapuri Care Hospital',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden;">
                    <div style="background: #2563eb; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; letter-spacing: 2px;">ABHAYAPURI CARE</h1> 
                    </div>
                    <div style="padding: 40px; color: #333333;">
                        <h2 style="color: #2563eb;">Hello ${name},</h2>
                        <p>Your appointment has been successfully confirmed at <strong>Abhayapuri Care Hospital</strong>.</p>
                        <div style="background-color: #f8fafc; padding: 25px; border-radius: 15px; margin: 25px 0; border-left: 5px solid #2563eb;">
                            <p><strong>🕒 Date:</strong> ${date}</p>
                            <p><strong>📞 Phone:</strong> ${phone}</p>
                            <p><strong>📍 Location:</strong> Ward No. 4, Abhayapuri</p>
                        </div>
                        <p style="font-size: 11px; color: #94a3b8; text-align: center;">© 2026 Abhayapuri Care Hospital | Bongaigaon, Assam</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}