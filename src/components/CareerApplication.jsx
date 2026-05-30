"use client";

import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, CheckCircle2, FileUp, Loader2, Mail, MapPin, Send, ShieldCheck, UserRound } from "lucide-react";
import { defaultVacancies } from "@/lib/careers";
import { supabase } from "@/lib/supabase";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  qualification: "",
  experience: "",
  currentCity: "",
  expectedSalary: "",
  selectedPost: "",
  coverNote: "",
  resume: null,
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export default function CareerApplication({ page }) {
  const [vacancies, setVacancies] = useState(defaultVacancies);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadVacancies() {
      const { data } = await supabase
        .from("vacancies")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (mounted && data?.length) {
        setVacancies(data);
      }
    }

    loadVacancies();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedVacancy = useMemo(
    () => vacancies.find((item) => String(item.id) === String(form.selectedPost)),
    [form.selectedPost, vacancies]
  );

  const eligibilityMessage = useMemo(() => {
    if (!selectedVacancy || !form.qualification) return "";
    const qualificationParts = form.qualification
      .toLowerCase()
      .split(/[\s,./()-]+/)
      .filter((part) => part.length >= 2);
    const requirements = String(selectedVacancy.requirements || "").toLowerCase();
    return qualificationParts.some((part) => requirements.includes(part))
      ? "You appear eligible for this position."
      : "You may still apply, but final eligibility will be reviewed by HR.";
  }, [form.qualification, selectedVacancy]);

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.selectedPost) {
      setError("Please select the post you want to apply for.");
      return;
    }

    if (!form.resume) {
      setError("Please upload your resume.");
      return;
    }

    if (form.resume.size > 5 * 1024 * 1024) {
      setError("Resume must be 5 MB or smaller.");
      return;
    }

    setSubmitting(true);
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });
    payload.append("vacancyTitle", selectedVacancy?.title || "");
    payload.append("department", selectedVacancy?.department || "");
    payload.append("requirements", selectedVacancy?.requirements || "");

    try {
      const response = await fetch("/api/career-application", {
        method: "POST",
        body: payload,
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Application could not be submitted.");
      }

      setForm(initialForm);
      setMessage(
        result.emailSent
          ? "Application submitted. Confirmation mail has been sent to your email."
          : "Application submitted. Email credentials are not configured, so confirmation mail was skipped."
      );
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="career-application" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-black uppercase tracking-[0.25em] ${page.accentText}`}>Current Vacancies</p>
            <h2 className="mt-3 text-3xl font-black uppercase text-slate-950">Apply for an open hospital role</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Select a vacancy, share candidate details, upload a resume, and the applicant receives a confirmation email after submission.
            </p>
          </div>

          <div className="grid gap-4">
            {vacancies.map((job) => (
              <article
                key={job.id}
                className={`rounded-lg bg-white p-5 shadow-sm ring-1 transition ${String(form.selectedPost) === String(job.id) ? "ring-emerald-500" : "ring-slate-200"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-600">{job.department}</p>
                    <h3 className="mt-2 text-xl font-black text-slate-950">{job.title}</h3>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                    {job.openings} open
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{job.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                  <span className="rounded-md bg-slate-100 px-3 py-2">{job.type}</span>
                  <span className="rounded-md bg-slate-100 px-3 py-2">{job.experience}</span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-3 py-2">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-xl ring-1 ring-slate-200">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-950">Candidate Application</h2>
              <p className="text-sm font-semibold text-slate-500">HR will review and contact shortlisted candidates.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full Name">
              <input required value={form.name} onChange={(e) => updateForm("name", e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-emerald-500" placeholder="Candidate name" />
            </Field>
            <Field label="Email">
              <input required type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-emerald-500" placeholder="candidate@email.com" />
            </Field>
            <Field label="Phone">
              <input required value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-emerald-500" placeholder="+91 ..." />
            </Field>
            <Field label="Qualification">
              <input required value={form.qualification} onChange={(e) => updateForm("qualification", e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-emerald-500" placeholder="MBBS, GNM, B.Sc, Diploma" />
            </Field>
            <Field label="Experience">
              <input required value={form.experience} onChange={(e) => updateForm("experience", e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-emerald-500" placeholder="Example: 2 years" />
            </Field>
            <Field label="Current City">
              <input required value={form.currentCity} onChange={(e) => updateForm("currentCity", e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-emerald-500" placeholder="Bongaigaon" />
            </Field>
            <Field label="Expected Salary">
              <input value={form.expectedSalary} onChange={(e) => updateForm("expectedSalary", e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-emerald-500" placeholder="Optional" />
            </Field>
            <Field label="Available Post">
              <select required value={form.selectedPost} onChange={(e) => updateForm("selectedPost", e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-emerald-500">
                <option value="">Select vacancy</option>
                {vacancies.map((job) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Short Cover Note (optional)">
            <textarea value={form.coverNote} onChange={(e) => updateForm("coverNote", e.target.value)} className="min-h-28 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm font-semibold outline-none focus:border-emerald-500" placeholder="Why should the hospital consider this candidate?" />
          </Field>

          <Field label="Resume">
            <div className="flex min-h-24 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
              <label className="cursor-pointer">
                <FileUp className="mx-auto h-6 w-6 text-emerald-600" />
                <span className="mt-2 block text-sm font-black text-slate-900">
                  {form.resume?.name || "Upload resume PDF/DOC"}
                </span>
                <span className="text-xs font-semibold text-slate-500">Max 5 MB recommended</span>
                <input required type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(e) => updateForm("resume", e.target.files?.[0] || null)} />
              </label>
            </div>
          </Field>

          {selectedVacancy && (
            <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900">
              <ShieldCheck className="mb-2 h-5 w-5" />
              <p className="font-black">Selected: {selectedVacancy.title}</p>
              <p className="mt-1 font-semibold">{selectedVacancy.requirements}</p>
              {eligibilityMessage ? <p className="mt-2 font-black">{eligibilityMessage}</p> : null}
            </div>
          )}

          {message && (
            <div className="mt-4 flex items-start gap-3 rounded-lg bg-green-50 p-4 text-sm font-bold text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              {message}
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Submit Application
          </button>

          <div className="mt-5 grid gap-3 text-xs font-semibold text-slate-500 sm:grid-cols-2">
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-600" /> Confirmation goes to candidate email.</p>
            <p className="flex items-center gap-2"><UserRound className="h-4 w-4 text-emerald-600" /> HR can review from admin.</p>
          </div>
        </form>
      </div>
    </section>
  );
}
