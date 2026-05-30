import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getHospitalChatReply } from "@/lib/hospital-chat";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function includesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function isCareerQuestion(normalized) {
  return includesAny(normalized, [
    "career",
    "job",
    "jobs",
    "vacancy",
    "vacancies",
    "opening",
    "openings",
    "apply",
    "application",
    "recruit",
    "hiring",
    "hire",
    "interview",
    "salary",
    "resume",
    "cv",
    "joining",
    "internship",
    "fresher",
    "experienced",
    "gnm",
    "nurse",
    "doctor vacancy",
    "pharmacist",
    "reception",
    "technician",
    "department hiring",
    "naukri",
  ]);
}

function isApplicationStatusQuestion(normalized) {
  return includesAny(normalized, [
    "application status",
    "my status",
    "under review",
    "shortlisted",
    "application received",
    "hr reviewed",
    "my application",
    "am i selected",
    "was my application",
  ]);
}

function formatVacancies(vacancies) {
  if (!vacancies.length) {
    return "There are no open vacancies listed right now. Please check the Careers page later or contact HR at +91 8822141629.";
  }

  const totalOpenings = vacancies.reduce((sum, item) => sum + (Number(item.openings) || 0), 0);
  const lines = vacancies.map((job, index) => {
    const requirements = job.requirements ? ` Eligibility: ${job.requirements}` : "";
    return `${index + 1}. ${job.title} - ${job.department} (${job.openings || 1} opening${Number(job.openings) === 1 ? "" : "s"}).${requirements}`;
  });

  return `Current open vacancies (${totalOpenings} total openings):\n${lines.join("\n")}\n\nIf you want to apply, I can collect your details and resume now.`;
}

function filterVacanciesByQuestion(vacancies, normalized) {
  // comprehensive stopword list for generic vacancy queries
  const stopWords = new Set([
    "what",
    "are",
    "the",
    "now",
    "today",
    "current",
    "available",
    "show",
    "list",
    "opening",
    "openings",
    "vacancy",
    "vacancies",
    "job",
    "jobs",
    "apply",
    "career",
    "careers",
    "any",
  ]);

  // extract words, normalize simple plurals
  const words = normalized
    .split(/[^a-z0-9]+/)
    .map((w) => w.trim())
    .filter(Boolean)
    .map((w) => (w.endsWith("s") ? w.slice(0, -1) : w));

  // keep only meaningful tokens (length >=3) and not stopwords
  const targetWords = words.filter((word) => word.length >= 3 && !stopWords.has(word));

  // If there are no role/department-specific tokens, treat as a generic listing request
  if (!targetWords.length) return vacancies;

  // Only filter when user clearly specified role/department keywords
  const matches = vacancies.filter((job) => {
    const haystack = `${job.title} ${job.department} ${job.requirements} ${job.description}`.toLowerCase();
    return targetWords.some((word) => haystack.includes(word));
  });

  return matches.length ? matches : vacancies;
}

async function getLiveDoctors(supabase) {
  const { data: doctors, error } = await supabase
    .from("doctors")
    .select("id,name,department,specialization,qualification,experience,consultation_fee,languages_known,room_number,status,availability_override")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error || !doctors?.length) return [];

  const { data: rosters } = await supabase
    .from("duty_rosters")
    .select("doctor_id,duty_days,shift_start,shift_end")
    .eq("person_type", "doctor");

  const rosterByDoctorId = new Map((rosters || []).map((roster) => [roster.doctor_id, roster]));

  return doctors.map((doctor) => ({
    ...doctor,
    ...(rosterByDoctorId.get(doctor.id) || {}),
  }));
}

async function getLiveStaff(supabase) {
  const { data: staff, error } = await supabase
    .from("staff_members")
    .select("id,name,department,role,status,availability_override")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error || !staff?.length) return [];
  return staff;
}

async function getCareerReply(message, body) {
  const normalized = message.toLowerCase().trim();
  const supabase = getSupabaseClient();

  if (isApplicationStatusQuestion(normalized)) {
    const contact = String(body?.contact || body?.phone || body?.email || "").trim();

    if (!contact) {
      return {
        text: "I can check real application status from our records. Please enter the phone number or email used in the application.",
        applicationStatusForm: true,
        nextTopic: "careers",
      };
    }

    const query = supabase
      .from("career_applications")
      .select("name,email,phone,vacancy_title,status,created_at")
      .or(`phone.eq.${contact},email.eq.${contact}`)
      .order("created_at", { ascending: false })
      .limit(3);

    const { data, error } = await query;
    if (error) throw error;

    if (!data?.length) {
      return {
        text: "I could not find an application with that phone/email. Please check the details or submit a fresh application.",
        careerForm: true,
        nextTopic: "careers",
      };
    }

    const lines = data.map((application, index) => {
      const date = application.created_at ? new Date(application.created_at).toLocaleDateString("en-IN") : "recently";
      return `${index + 1}. ${application.vacancy_title || "Career Application"} - Status: ${application.status || "received"} (submitted ${date})`;
    });

    return {
      text: `I found your application record:\n${lines.join("\n")}`,
      nextTopic: "careers",
    };
  }

  const { data: vacancies, error } = await supabase
    .from("vacancies")
    .select("id,title,department,type,experience,openings,location,description,requirements,status")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const filteredVacancies = filterVacanciesByQuestion(vacancies || [], normalized);
  const wantsApply = includesAny(normalized, ["apply", "application", "submit", "resume", "cv", "i want job", "job chahiye"]);

  return {
    text: formatVacancies(filteredVacancies),
    actionLabel: "Open Careers",
    actionTarget: "careers",
    careerForm: wantsApply || normalized.includes("apply") || normalized.includes("resume"),
    vacancies: filteredVacancies,
    nextTopic: "careers",
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const message = body?.message || "";
    const lastTopic = body?.lastTopic || "contact";
    const normalized = String(message || "").toLowerCase();

    if (isCareerQuestion(normalized) || isApplicationStatusQuestion(normalized)) {
      const careerReply = await getCareerReply(message, body);
      return NextResponse.json(careerReply);
    }

    const supabase = getSupabaseClient();
    const [liveDoctors, liveStaff] = await Promise.all([
      getLiveDoctors(supabase),
      getLiveStaff(supabase),
    ]);
    const reply = getHospitalChatReply(message, lastTopic, liveDoctors, liveStaff);

    return NextResponse.json(reply);
  } catch {
    return NextResponse.json(
      {
        text: "The assistant is temporarily unavailable. Please try again in a moment.",
        actionLabel: "Book appointment",
        actionTarget: "contact",
        nextTopic: "contact",
      },
      { status: 500 }
    );
  }
}
