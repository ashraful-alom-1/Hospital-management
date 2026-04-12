import { resend } from "@/lib/resend";
import PatientEmail from "@/emails/PatientEmail";
import AdminEmail from "@/emails/AdminEmail";

export async function POST(req) {
  try {
    const body = await req.json();

    const name = body.name;
    const email = body.email;
    const phone = body.phone;
    const date = body.date;

    // ✅ Send email to USER (confirmation)
    await resend.emails.send({
      from: "Hospital <onboarding@resend.dev>",
      to: email, // ✅ user email
      subject: "Appointment Confirmed",
      react: PatientEmail({
        name: name,
        date: date,
      }),
    });

    // ✅ Send email to ADMIN (you)
    await resend.emails.send({
      from: "Hospital <onboarding@resend.dev>",
      to: "ashraful.abh@gmail.com", // ✅ your email
      subject: "New Appointment Booked",
      react: AdminEmail({
        name: name,
        email: email,
        phone: phone,
        date: date,
      }),
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return Response.json({ error: "Email failed" }, { status: 500 });
  }
}