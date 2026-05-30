import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const HOSPITAL_CONTACT = "+91 8822141629";
const HOSPITAL_EMAIL = "ashraful.abh@gmail.com";
const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(url, key);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeFileName(value) {
  return String(value || "resume")
    .replace(/[^a-z0-9.\-_]/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function matchesEligibility(qualification, requirements) {
  const normalizedQualification = String(qualification || "").toLowerCase();
  const normalizedRequirements = String(requirements || "").toLowerCase();

  if (!normalizedRequirements || !normalizedQualification) return false;

  return normalizedQualification
    .split(/[\s,./()-]+/)
    .filter((part) => part.length >= 2)
    .some((part) => normalizedRequirements.includes(part));
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const resume = formData.get("resume");
    const selectedPost = String(formData.get("selectedPost") || "").trim();
    const vacancyTitle = String(formData.get("vacancyTitle") || "").trim();
    const department = String(formData.get("department") || "").trim();

    const application = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      qualification: String(formData.get("qualification") || "").trim(),
      experience: String(formData.get("experience") || "").trim(),
      current_city: String(formData.get("currentCity") || "").trim(),
      expected_salary: String(formData.get("expectedSalary") || "").trim(),
      vacancy_id: selectedPost,
      vacancy_title: vacancyTitle,
      department,
      cover_note: String(formData.get("coverNote") || "").trim(),
      resume_name: resume?.name || "",
      resume_url: "",
      status: "received",
    };

    if (!application.name || !application.email || !application.phone || !application.qualification || !application.experience || !application.vacancy_id) {
      return NextResponse.json({ success: false, error: "Please complete all required application fields." }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    let vacancyRequirements = String(formData.get("requirements") || "").trim();
    if (application.vacancy_id !== "chat-career-inquiry") {
      const { data: vacancy } = await supabase
        .from("vacancies")
        .select("requirements,title,department,status")
        .eq("id", application.vacancy_id)
        .maybeSingle();

      if (vacancy) {
        vacancyRequirements = vacancy.requirements || vacancyRequirements;
        application.vacancy_title = application.vacancy_title || vacancy.title;
        application.department = application.department || vacancy.department;
      }
    }

    if (!(resume instanceof File) || resume.size === 0) {
      return NextResponse.json({ success: false, error: "Please upload a resume PDF, DOC, or DOCX file." }, { status: 400 });
    }

    if (!ALLOWED_RESUME_TYPES.includes(resume.type)) {
      return NextResponse.json({ success: false, error: "Resume must be a PDF, DOC, or DOCX file." }, { status: 400 });
    }

    if (resume.size > MAX_RESUME_SIZE) {
      return NextResponse.json({ success: false, error: "Resume must be 5 MB or smaller." }, { status: 400 });
    }

    const resumePath = `${Date.now()}-${safeFileName(application.name)}-${safeFileName(resume.name)}`;
    const { error: uploadError } = await supabase.storage
      .from("career-resumes")
      .upload(resumePath, resume, {
        contentType: resume.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Resume upload failed: ${uploadError.message}`);
    }

    const { data: signedResume } = await supabase.storage
      .from("career-resumes")
      .createSignedUrl(resumePath, 60 * 60 * 24 * 7);

    // store the storage path (for admin operations) and a signed URL for immediate access
    application.resume_path = resumePath;
    application.resume_url = signedResume?.signedUrl || resumePath;

    const { error: saveError } = await supabase.from("career_applications").insert(application);

    if (saveError) {
      throw new Error(saveError.message);
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "");
    let emailSent = false;

    if (emailUser && emailPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      const attachment = {
        filename: resume.name,
        content: Buffer.from(await resume.arrayBuffer()),
      };

      const eligibilityText = matchesEligibility(application.qualification, vacancyRequirements)
        ? "You appear eligible for this position based on the qualification shared. Final eligibility will still be reviewed by HR."
        : "You may still apply, but final eligibility will be reviewed by HR.";

      await transporter.sendMail({
        from: `"Abhayapuri Care Hospital HR" <${emailUser}>`,
        to: application.email,
        subject: "Application Received - Abhayapuri Care Hospital",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 620px; margin: auto; border: 1px solid #dbe5e1; border-radius: 18px; overflow: hidden;">
            <div style="background: #047857; padding: 30px; color: #ffffff;">
              <h1 style="margin: 0; font-size: 24px;">Abhayapuri Care Hospital</h1>
              <p style="margin: 8px 0 0;">Career Application Confirmation</p>
            </div>
            <div style="padding: 30px; color: #334155; line-height: 1.7;">
              <h2 style="color: #064e3b;">Hello ${escapeHtml(application.name)},</h2>
              <p>Thank you for applying to Abhayapuri Care Hospital. We have received your application for <strong>${escapeHtml(application.vacancy_title)}</strong>.</p>
              <div style="background: #ecfdf5; border-left: 5px solid #047857; border-radius: 12px; padding: 18px; margin: 22px 0;">
                <p style="margin: 0;"><strong>Department:</strong> ${escapeHtml(application.department)}</p>
                <p style="margin: 8px 0 0;"><strong>Status:</strong> Application received</p>
                <p style="margin: 8px 0 0;"><strong>Eligibility:</strong> ${escapeHtml(eligibilityText)}</p>
              </div>
              <p>If your profile matches the requirement, our HR team will contact you for the next round or interview schedule.</p>
              <p>For urgent career-related questions, contact ${HOSPITAL_CONTACT} or ${HOSPITAL_EMAIL}.</p>
              <p style="font-size: 12px; color: #64748b; margin-top: 28px;">This is an automated confirmation email. Please keep it for your records.</p>
            </div>
          </div>
        `,
      });

      await transporter.sendMail({
        from: `"Career Portal" <${emailUser}>`,
        to: emailUser,
        subject: `New Career Application - ${application.vacancy_title}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #0f172a;">
            <h2>New application received</h2>
            <p><strong>Name:</strong> ${escapeHtml(application.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(application.email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(application.phone)}</p>
            <p><strong>Post:</strong> ${escapeHtml(application.vacancy_title)}</p>
            <p><strong>Department:</strong> ${escapeHtml(application.department)}</p>
            <p><strong>Qualification:</strong> ${escapeHtml(application.qualification)}</p>
            <p><strong>Experience:</strong> ${escapeHtml(application.experience)}</p>
            <p><strong>Resume:</strong> ${application.resume_url ? `<a href="${escapeHtml(application.resume_url)}">Open resume</a>` : "Attached"}</p>
            <p><strong>Cover note:</strong> ${escapeHtml(application.cover_note)}</p>
          </div>
        `,
        attachments: [attachment],
      });

      emailSent = true;
    }

    return NextResponse.json({
      success: true,
      emailSent,
      resumeUrl: application.resume_url,
      eligibility: matchesEligibility(application.qualification, vacancyRequirements) ? "match" : "review",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
