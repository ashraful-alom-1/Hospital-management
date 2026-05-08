import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { doctors } from "@/lib/hospital-chat";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const HOSPITAL_CONTACT = "+91 8822141629";
const SLOT_MINUTES = 20;

function getDoctorSlotStart(doctorName) {
  const selectedDoctor = doctors.find((item) => item.name === doctorName);
  const [hours = "10", minutes = "00"] = (selectedDoctor?.slotStart || "10:00").split(":");

  return {
    hours: Number(hours),
    minutes: Number(minutes),
  };
}

export async function POST(req) {
  const userEmail = process.env.EMAIL_USER;
  const userPass = process.env.EMAIL_PASS;

  try {
    const { email, name, date, doctor, appointmentId } = await req.json();

    if (!userEmail || !userPass) {
      throw new Error("Email credentials missing in .env.local");
    }

    let appointmentQuery = supabase
      .from("appointments")
      .select("id")
      .eq("date", date)
      .eq("doctor", doctor);

    if (appointmentId) {
      appointmentQuery = appointmentQuery.neq("id", appointmentId);
    }

    const { data: records } = await appointmentQuery;
    const patientIndex = records ? records.length : 0;
    const slotStart = getDoctorSlotStart(doctor);
    const startTime = new Date();
    startTime.setHours(slotStart.hours, slotStart.minutes, 0, 0);
    startTime.setMinutes(startTime.getMinutes() + patientIndex * SLOT_MINUTES);

    const allottedTime = startTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: userEmail,
        pass: userPass.replace(/\s+/g, ""),
      },
    });

    const mailOptions = {
      from: `"Abhayapuri Care Hospital" <${userEmail}>`,
      to: email,
      subject: "Appointment Confirmed - Abhayapuri Care Hospital",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          <div style="background: #2563eb; padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; letter-spacing: 3px; font-size: 28px; font-weight: 900;">ABHAYAPURI CARE</h1>
            <p style="color: #bfdbfe; margin: 10px 0 0 0; font-weight: 500;">Your Health, Our Priority</p>
          </div>
          <div style="padding: 40px; color: #334155; line-height: 1.8;">
            <h2 style="color: #1e40af; font-size: 22px;">Hello ${name},</h2>
            <p>We are pleased to confirm your appointment. Our system has allotted you a specific time slot based on the selected doctor's schedule.</p>

            <div style="background-color: #f8fafc; padding: 30px; border-radius: 20px; margin: 30px 0; border-left: 6px solid #2563eb;">
              <p style="margin: 10px 0; font-size: 16px;"><strong>Appointment Date:</strong> ${date}</p>
              <p style="margin: 10px 0; font-size: 18px; color: #2563eb;"><strong>Allotted Time:</strong> ${allottedTime}</p>
              <p style="margin: 10px 0; font-size: 16px;"><strong>Booked Doctor:</strong> ${doctor || "To be assigned by the hospital"}</p>
              <p style="margin: 10px 0; font-size: 16px;"><strong>Hospital Contact Number:</strong> ${HOSPITAL_CONTACT}</p>
              <p style="margin: 10px 0; font-size: 16px;"><strong>Location:</strong> Ward No. 4, Abhayapuri</p>
            </div>

            <p style="background: #fff1f2; color: #be123c; padding: 15px; border-radius: 12px; font-size: 13px; font-weight: 600;">
              Note: Please arrive at the hospital at least 15 minutes before your allotted time (${allottedTime}).
            </p>

            <p style="background: #eff6ff; color: #1d4ed8; padding: 15px; border-radius: 12px; font-size: 13px; font-weight: 600;">
              Emergency contact: ${HOSPITAL_CONTACT}. If you need any information, you can contact this number.
            </p>

            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 35px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center; font-weight: 500;">
              (c) 2026 Abhayapuri Care Hospital | Bongaigaon, Assam<br>
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
