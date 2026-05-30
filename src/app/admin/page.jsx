"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  CalendarCheck,
  Clock3,
  ImagePlus,
  LogOut,
  Plus,
  Stethoscope,
  Trash2,
  Upload,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { defaultDoctors, defaultVacancies } from "@/lib/careers";
import {
  availabilityOverrides,
  buildRosterMap,
  dutyDayOptions,
  formatShift,
  getAvailability,
  normalizeDutyDays,
} from "@/lib/availability";
import { supabase } from "@/lib/supabase";

const defaultRoster = {
  duty_days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  shift_start: "09:00",
  shift_end: "17:00",
};

const emptyDoctor = {
  name: "",
  photo_url: "",
  department: "",
  specialization: "",
  qualification: "",
  experience: "",
  consultation_fee: "",
  languages_known: "",
  room_number: "",
  status: "active",
  availability_override: "auto",
  roster: defaultRoster,
};

const emptyStaff = {
  name: "",
  department: "",
  role: "",
  phone: "",
  email: "",
  status: "active",
  availability_override: "auto",
  roster: defaultRoster,
};

const emptyVacancy = {
  title: "",
  department: "",
  type: "Full time",
  experience: "",
  openings: 1,
  location: "Abhayapuri, Bongaigaon",
  description: "",
  requirements: "",
  status: "open",
};

const emptyGallery = { title: "", category: "Hospital", image_url: "", storage_path: "" };
const galleryCategories = ["Hospital", "Doctors", "Staff", "Events", "Facilities", "Emergency", "Community Service"];
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function StatCard({ icon: Icon, label, value, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
    rose: "bg-rose-50 text-rose-700",
  };

  return (
    <Card className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</p>
          <h3 className="mt-2 text-3xl font-black text-slate-950">{value}</h3>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", required = false }) {
  return (
    <input
      type={type}
      value={value}
      required={required}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-500"
    />
  );
}

function TextArea({ value, onChange, placeholder, required = false }) {
  return (
    <textarea
      value={value}
      required={required}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="min-h-24 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold outline-none focus:border-blue-500"
    />
  );
}

function StatusBadge({ availability }) {
  const tones = {
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${tones[availability.tone] || tones.slate}`}>
      {availability.label}
    </span>
  );
}

function RosterFields({ roster, onChange }) {
  const normalizedDays = normalizeDutyDays(roster.duty_days);

  const toggleDay = (day) => {
    const duty_days = normalizedDays.includes(day)
      ? normalizedDays.filter((item) => item !== day)
      : [...normalizedDays, day];
    onChange({ ...roster, duty_days });
  };

  return (
    <div className="space-y-3 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">Duty Roster</p>
      <div className="grid grid-cols-4 gap-2">
        {dutyDayOptions.map((day) => (
          <button
            key={day.value}
            type="button"
            onClick={() => toggleDay(day.value)}
            className={`h-9 rounded-lg text-xs font-black transition ${normalizedDays.includes(day.value) ? "bg-blue-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
          >
            {day.short}
          </button>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <TextInput value={roster.shift_start} onChange={(value) => onChange({ ...roster, shift_start: value })} type="time" placeholder="Shift start" required />
        <TextInput value={roster.shift_end} onChange={(value) => onChange({ ...roster, shift_end: value })} type="time" placeholder="Shift end" required />
      </div>
    </div>
  );
}

async function uploadPublicFile(bucket, file, folder = "") {
  if (!file) return { publicUrl: "", path: "" };
  const extension = file.name.split(".").pop();
  const path = `${folder}${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { publicUrl: data.publicUrl, path };
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [doctors, setDoctors] = useState(defaultDoctors);
  const [staff, setStaff] = useState([]);
  const [rosters, setRosters] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [vacancies, setVacancies] = useState(defaultVacancies);
  const [editId, setEditId] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctorForm, setDoctorForm] = useState(emptyDoctor);
  const [staffForm, setStaffForm] = useState(emptyStaff);
  const [vacancyForm, setVacancyForm] = useState(emptyVacancy);
  const [galleryForm, setGalleryForm] = useState(emptyGallery);
  const [notice, setNotice] = useState("");
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const statusOptions = ["received", "under_review", "shortlisted", "interview_scheduled", "selected", "rejected"];
  const [stats, setStats] = useState({ total: 0, withResume: 0, withoutResume: 0, storageBytes: null });

  const rosterMap = useMemo(() => buildRosterMap(rosters), [rosters]);

  const doctorOptions = useMemo(
    () => doctors.map((doctor) => doctor.name).filter(Boolean),
    [doctors]
  );

  const loadAppointments = useCallback(async () => {
    const { data } = await supabase.from("appointments").select("*").order("created_at", { ascending: false });
    if (data) setAppointments(data);
  }, []);

  const loadAdminData = useCallback(async () => {
    const [applicationResult, doctorResult, staffResult, rosterResult, vacancyResult, galleryResult] = await Promise.all([
      supabase.from("career_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("doctors").select("*").order("created_at", { ascending: false }),
      supabase.from("staff_members").select("*").order("created_at", { ascending: false }),
      supabase.from("duty_rosters").select("*").order("created_at", { ascending: false }),
      supabase.from("vacancies").select("*").order("created_at", { ascending: false }),
      supabase.from("gallery_photos").select("*").order("created_at", { ascending: false }),
    ]);

    if (applicationResult.data) setApplications(applicationResult.data);
    if (doctorResult.data?.length) setDoctors(doctorResult.data);
    if (!staffResult.error) setStaff((staffResult.data || []).filter((item) => (item.member_type || "staff") !== "doctor"));
    if (rosterResult.data) setRosters(rosterResult.data);
    if (vacancyResult.data?.length) setVacancies(vacancyResult.data);
    if (galleryResult.data) setGalleryPhotos(galleryResult.data);
  }, []);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      await Promise.all([loadAppointments(), loadAdminData()]);
      setLoading(false);
    }

    checkUser();
  }, [router, loadAppointments, loadAdminData]);

  const refreshAll = async () => {
    await Promise.all([loadAppointments(), loadAdminData()]);
  };

  const handleDoctor = async (id) => {
    if (!selectedDoctor) return alert("Select a doctor first");
    await supabase.from("appointments").update({ doctor: selectedDoctor }).eq("id", id);
    setEditId(null);
    refreshAll();
  };

  const handleComplete = async (id) => {
    await supabase.from("appointments").update({ status: "completed" }).eq("id", id);
    refreshAll();
  };

  const handleDeleteAppointment = async (id) => {
    if (!confirm("Delete this appointment?")) return;
    await supabase.from("appointments").delete().eq("id", id);
    refreshAll();
  };

  const upsertRoster = async ({ personType, doctorId = null, staffId = null, roster }) => {
    const existing = rosters.find((item) =>
      personType === "doctor" ? item.doctor_id === doctorId : item.staff_id === staffId
    );
    const payload = {
      person_type: personType,
      doctor_id: doctorId,
      staff_id: staffId,
      duty_days: normalizeDutyDays(roster.duty_days),
      shift_start: roster.shift_start,
      shift_end: roster.shift_end,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      return supabase.from("duty_rosters").update(payload).eq("id", existing.id);
    }

    return supabase.from("duty_rosters").insert(payload);
  };

  const saveDoctor = async (event) => {
    event.preventDefault();
    try {
      const languages = doctorForm.languages_known
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        name: doctorForm.name,
        photo_url: doctorForm.photo_url,
        department: doctorForm.department,
        specialization: doctorForm.specialization,
        qualification: doctorForm.qualification,
        experience: doctorForm.experience,
        consultation_fee: Number(doctorForm.consultation_fee) || null,
        languages_known: languages,
        room_number: doctorForm.room_number,
        status: doctorForm.status,
        availability_override: doctorForm.availability_override,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from("doctors").insert(payload).select("id").single();
      if (error) throw error;
      const rosterResult = await upsertRoster({ personType: "doctor", doctorId: data.id, roster: doctorForm.roster });
      if (rosterResult.error) throw rosterResult.error;

      setDoctorForm(emptyDoctor);
      setNotice("Doctor profile and duty roster saved.");
      loadAdminData();
    } catch (error) {
      setNotice(error.message);
    }
  };

  const saveStaff = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        name: staffForm.name,
        department: staffForm.department,
        role: staffForm.role,
        phone: staffForm.phone,
        email: staffForm.email,
        status: staffForm.status,
        availability_override: staffForm.availability_override,
        member_type: "staff",
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from("staff_members").insert(payload).select("id").single();
      if (error) throw error;
      const rosterResult = await upsertRoster({ personType: "staff", staffId: data.id, roster: staffForm.roster });
      if (rosterResult.error) throw rosterResult.error;

      setStaffForm(emptyStaff);
      setNotice("Staff profile and duty roster saved.");
      loadAdminData();
    } catch (error) {
      setNotice(error.message);
    }
  };

  const uploadDoctorPhoto = async (file) => {
    try {
      const { publicUrl } = await uploadPublicFile("doctor-photos", file, "doctors/");
      setDoctorForm((current) => ({ ...current, photo_url: publicUrl }));
    } catch (error) {
      setNotice(error.message);
    }
  };

  const saveVacancy = async (event) => {
    event.preventDefault();
    const { error } = await supabase.from("vacancies").insert({ ...vacancyForm, openings: Number(vacancyForm.openings) || 1 });
    if (error) return setNotice(error.message);
    setNotice("Vacancy posted.");
    setVacancyForm(emptyVacancy);
    loadAdminData();
  };

  const updateVacancyStatus = async (id, status) => {
    const { error } = await supabase.from("vacancies").update({ status }).eq("id", id);
    if (error) return setNotice(error.message);
    loadAdminData();
  };

  const updateApplicationStatus = async (id, status) => {
    const token = await getAccessToken();
    try {
      const res = await fetch(`/api/admin/application/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ application_id: id, status }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        return setNotice(j?.error || "Failed to update status");
      }
      loadAdminData();
    } catch (err) {
      setNotice(String(err));
    }
  };

  const saveGalleryPhoto = async (event) => {
    event.preventDefault();
    if (!galleryForm.title || !galleryForm.image_url) return setNotice("Add a gallery title and photo first.");
    const { error } = await supabase.from("gallery_photos").insert(galleryForm);
    if (error) return setNotice(error.message);
    setNotice("Gallery photo uploaded.");
    setGalleryForm(emptyGallery);
    loadAdminData();
  };

  const uploadGalleryPhoto = async (file) => {
    try {
      const { publicUrl, path } = await uploadPublicFile("gallery-photos", file, "gallery/");
      setGalleryForm((current) => ({ ...current, image_url: publicUrl, storage_path: path }));
    } catch (error) {
      setNotice(error.message);
    }
  };

  const deleteGalleryPhoto = async (photo) => {
    if (!confirm("Remove this gallery photo?")) return;
    if (photo.storage_path) await supabase.storage.from("gallery-photos").remove([photo.storage_path]);
    const { error } = await supabase.from("gallery_photos").delete().eq("id", photo.id);
    if (error) return setNotice(error.message);
    loadAdminData();
  };

  const deleteDoctor = async (id) => {
    if (!confirm("Remove this doctor?")) return;
    const { error } = await supabase.from("doctors").delete().eq("id", id);
    if (error) return setNotice(error.message);
    loadAdminData();
  };

  const deleteStaff = async (id) => {
    if (!confirm("Remove this staff member?")) return;
    if (!uuidPattern.test(String(id || ""))) {
      setStaff((current) => current.filter((member) => member.id !== id));
      setNotice("Removed fallback staff entry from the dashboard. No database row was deleted.");
      return;
    }
    const { error } = await supabase.from("staff_members").delete().eq("id", id);
    if (error) return setNotice(error.message);
    loadAdminData();
  };

  // ----- Application resume and record management -----
  const getAccessToken = async () => {
    try {
      const res = await supabase.auth.getSession();
      return res?.data?.session?.access_token || null;
    } catch (e) {
      return null;
    }
  };

  const viewResume = async (application) => {
    if (!application) return;
    const token = await getAccessToken();
    try {
      const res = await fetch(`/api/admin/resume/view?application_id=${encodeURIComponent(application.id)}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const json = await res.json();
      if (!res.ok) return alert(json?.error || "Unable to open resume.");
      if (json.url) window.open(json.url, "_blank");
      else alert("No resume available for this application.");
    } catch (err) {
      console.error(err);
      alert("Unable to open resume.");
    }
  };

  const downloadResume = async (application) => {
    if (!application) return;
    const token = await getAccessToken();
    try {
      const res = await fetch(`/api/admin/resume/download?application_id=${encodeURIComponent(application.id)}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        return alert(json?.error || "Failed to download resume.");
      }
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = application.resume_name || "resume";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to download resume.");
    }
  };

  const deleteResume = async (application) => {
    if (!confirm("Delete resume for this application?")) return;
    const token = await getAccessToken();
    try {
      const res = await fetch(`/api/admin/resume/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ application_id: application.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to delete resume");
      setNotice("Resume removed.");
      loadAdminData();
    } catch (err) {
      setNotice(err.message || String(err));
    }
  };

  const deleteApplication = async (application) => {
    if (!confirm("Delete this application and its resume (if any)?")) return;
    const token = await getAccessToken();
    try {
      const res = await fetch(`/api/admin/application/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ application_id: application.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to delete application");
      setNotice("Application deleted.");
      loadAdminData();
    } catch (err) {
      setNotice(err.message || String(err));
    }
  };

  const rejectAndDeleteResume = async (application) => {
    if (!confirm("Reject application and delete resume?")) return;
    const token = await getAccessToken();
    try {
      // delete resume
      const res = await fetch(`/api/admin/resume/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ application_id: application.id }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to delete resume");
      }
      // update status to rejected
      const r2 = await fetch(`/api/admin/application/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ application_id: application.id, status: "rejected" }),
      });
      if (!r2.ok) {
        const j = await r2.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to update status");
      }
      setNotice("Application rejected and resume deleted.");
      loadAdminData();
    } catch (err) {
      setNotice(err.message || String(err));
    }
  };

  const markSelected = async (application) => {
    if (!confirm("Mark this application as Selected?")) return;
    const token = await getAccessToken();
    try {
      const res = await fetch(`/api/admin/application/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ application_id: application.id, status: "selected" }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to update status");
      }
      setNotice("Application marked as selected.");
      loadAdminData();
    } catch (err) {
      setNotice(err.message || String(err));
    }
  };

  const computeStats = async (apps) => {
    const total = apps.length;
    const withResume = apps.filter((a) => a.resume_path || (a.resume_url && a.resume_url.startsWith("http"))).length;
    const withoutResume = total - withResume;
    let storageBytes = null;
    try {
      const { data: items, error } = await supabase.storage.from("career-resumes").list("", { limit: 1000 });
      if (!error && Array.isArray(items)) {
        // some storage implementations include 'size' or metadata.size
        storageBytes = items.reduce((sum, it) => sum + (it.size || (it.metadata?.size ? Number(it.metadata.size) : 0)), 0);
      }
    } catch (e) {
      console.warn("Could not compute storage usage", e);
    }
    setStats({ total, withResume, withoutResume, storageBytes });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    router.push("/login");
  };

  const filteredApplications = applications.filter((app) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (app.name || "").toLowerCase().includes(q) ||
      (app.email || "").toLowerCase().includes(q) ||
      (app.phone || "").toLowerCase().includes(q) ||
      (app.vacancy_title || "").toLowerCase().includes(q);
    const matchesStatus = !filterStatus || (app.status || "").toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    computeStats(applications);
  }, [applications]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 font-bold text-blue-600">
        Abhayapuri Care Admin Panel Loading...
      </div>
    );
  }

  const doctorsOnDuty = doctors.filter((doctor) => getAvailability(doctor, rosterMap[doctor.id]).status === "on_duty");
  const staffOnDuty = staff.filter((member) => getAvailability(member, rosterMap[member.id]).status === "on_duty");
  const tabs = [
    { id: "appointments", label: "Appointments", icon: CalendarCheck },
    { id: "doctors", label: "Doctors", icon: Stethoscope },
    { id: "staff", label: "Staff", icon: UsersRound },
    { id: "roster", label: "Duty Roster", icon: Clock3 },
    { id: "vacancies", label: "Vacancies", icon: BriefcaseBusiness },
    { id: "applications", label: "Applications", icon: UserRound },
    { id: "gallery", label: "Gallery", icon: ImagePlus },
  ];
  return (
    <main className="min-h-screen bg-slate-50 p-4 font-sans md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">Hospital Management</p>
            <h1 className="mt-2 text-3xl font-black uppercase text-slate-950 md:text-4xl">Admin Dashboard</h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">Manage bookings, doctor profiles, staff, duty rosters, vacancies, applications, and gallery photos.</p>
          </div>
          <Button onClick={handleLogout} variant="destructive" className="h-10 rounded-lg px-5 font-bold">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard icon={Stethoscope} label="Total Doctors" value={doctors.length} />
          <StatCard icon={Clock3} label="Doctors On Duty Now" value={doctorsOnDuty.length} tone="green" />
          <StatCard icon={UsersRound} label="Total Staff" value={staff.length} tone="slate" />
          <StatCard icon={Clock3} label="Staff On Duty Now" value={staffOnDuty.length} tone="green" />
          <StatCard icon={BriefcaseBusiness} label="Total Vacancies" value={vacancies.filter((item) => item.status === "open").length} tone="amber" />
          <StatCard icon={UserRound} label="Total Applications" value={applications.length} tone="rose" />
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto rounded-lg bg-white p-2 ring-1 ring-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-black transition ${activeTab === tab.id ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {notice && <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm font-bold text-blue-700">{notice}</div>}

        {activeTab === "appointments" && (
          <Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  <tr>
                    <th className="p-5">Patient</th>
                    <th className="p-5">Date</th>
                    <th className="p-5">Doctor</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/40">
                      <td className="p-5">
                        <p className="font-black text-slate-900">{item.name}</p>
                        <p className="text-xs font-semibold text-slate-500">{item.phone}</p>
                      </td>
                      <td className="p-5 text-sm font-semibold text-slate-600">{item.date ? new Date(item.date).toDateString() : "Not set"}</td>
                      <td className="p-5">
                        {editId === item.id ? (
                          <select value={selectedDoctor} onChange={(event) => setSelectedDoctor(event.target.value)} className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-bold">
                            <option value="">Assign Doctor</option>
                            {doctorOptions.map((doctor) => <option key={doctor} value={doctor}>{doctor}</option>)}
                          </select>
                        ) : (
                          <span className="rounded-md bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">{item.doctor || "Unassigned"}</span>
                        )}
                      </td>
                      <td className="p-5">
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${item.status === "completed" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                          {item.status === "completed" ? "Completed" : "Awaiting"}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex justify-end gap-2">
                          {editId === item.id ? (
                            <Button size="sm" onClick={() => handleDoctor(item.id)} className="bg-blue-600 text-white">Save</Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => { setEditId(item.id); setSelectedDoctor(item.doctor || ""); }}>Edit</Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => handleComplete(item.id)} className="text-green-700">Done</Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteAppointment(item.id)} className="text-red-500">Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {appointments.length === 0 && <div className="p-12 text-center text-sm font-bold text-slate-400">No appointments found.</div>}
          </Card>
        )}

        {activeTab === "doctors" && (
          <div className="grid gap-6 lg:grid-cols-[390px_1fr]">
            <Card className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Add Doctor</h2>
              <form onSubmit={saveDoctor} className="mt-5 space-y-3">
                <TextInput required value={doctorForm.name} onChange={(value) => setDoctorForm({ ...doctorForm, name: value })} placeholder="Doctor name" />
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
                  {doctorForm.photo_url && <img src={doctorForm.photo_url} alt="Doctor preview" className="mx-auto mb-3 h-24 w-24 rounded-lg object-cover" />}
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-black text-blue-700 ring-1 ring-blue-100">
                    <Upload className="h-4 w-4" />
                    Upload Doctor Photo
                    <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadDoctorPhoto(event.target.files?.[0])} />
                  </label>
                </div>
                <TextInput required value={doctorForm.department} onChange={(value) => setDoctorForm({ ...doctorForm, department: value })} placeholder="Department" />
                <TextInput required value={doctorForm.specialization} onChange={(value) => setDoctorForm({ ...doctorForm, specialization: value })} placeholder="Specialization" />
                <TextInput value={doctorForm.qualification} onChange={(value) => setDoctorForm({ ...doctorForm, qualification: value })} placeholder="Qualification" />
                <TextInput value={doctorForm.experience} onChange={(value) => setDoctorForm({ ...doctorForm, experience: value })} placeholder="Experience" />
                <TextInput value={doctorForm.consultation_fee} onChange={(value) => setDoctorForm({ ...doctorForm, consultation_fee: value })} placeholder="Consultation Fee" type="number" />
                <TextInput value={doctorForm.languages_known} onChange={(value) => setDoctorForm({ ...doctorForm, languages_known: value })} placeholder="Languages Known, comma separated" />
                <TextInput value={doctorForm.room_number} onChange={(value) => setDoctorForm({ ...doctorForm, room_number: value })} placeholder="Room Number" />
                <div className="grid gap-2 sm:grid-cols-2">
                  <select value={doctorForm.status} onChange={(event) => setDoctorForm({ ...doctorForm, status: event.target.value })} className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="retired">Retired</option>
                  </select>
                  <select value={doctorForm.availability_override} onChange={(event) => setDoctorForm({ ...doctorForm, availability_override: event.target.value })} className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold">
                    {availabilityOverrides.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </div>
                <RosterFields roster={doctorForm.roster} onChange={(roster) => setDoctorForm({ ...doctorForm, roster })} />
                <Button className="h-10 w-full bg-blue-600 text-white">
                  <Plus className="h-4 w-4" />
                  Save Doctor
                </Button>
              </form>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              {doctors.map((doctor) => {
                const roster = rosterMap[doctor.id] || doctor.roster;
                const availability = getAvailability(doctor, roster);
                return (
                  <Card key={doctor.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <img src={doctor.photo_url || "/blank-profile-picture-973460_960_720.webp"} alt={doctor.name} className="h-16 w-16 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-blue-600">{doctor.department}</p>
                          <h3 className="mt-1 text-lg font-black text-slate-950">{doctor.name}</h3>
                          <p className="text-sm font-semibold text-slate-500">{doctor.specialization}</p>
                        </div>
                      </div>
                      <StatusBadge availability={availability} />
                    </div>
                    <div className="mt-4 grid gap-2 text-xs font-bold text-slate-500">
                      <p>Qualification: {doctor.qualification || "Not set"}</p>
                      <p>Experience: {doctor.experience || "Not set"}</p>
                      <p>Fee: {doctor.consultation_fee ? `Rs. ${doctor.consultation_fee}` : "Not set"} | Room: {doctor.room_number || "Not set"}</p>
                      <p>Shift: {formatShift(roster)}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => deleteDoctor(doctor.id)} className="mt-4 text-red-500">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "staff" && (
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <Card className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Add Staff</h2>
              <form onSubmit={saveStaff} className="mt-5 space-y-3">
                <TextInput required value={staffForm.name} onChange={(value) => setStaffForm({ ...staffForm, name: value })} placeholder="Staff name" />
                <TextInput required value={staffForm.department} onChange={(value) => setStaffForm({ ...staffForm, department: value })} placeholder="Department" />
                <TextInput required value={staffForm.role} onChange={(value) => setStaffForm({ ...staffForm, role: value })} placeholder="Role" />
                <TextInput value={staffForm.phone} onChange={(value) => setStaffForm({ ...staffForm, phone: value })} placeholder="Phone" />
                <TextInput value={staffForm.email} onChange={(value) => setStaffForm({ ...staffForm, email: value })} placeholder="Email" type="email" />
                <div className="grid gap-2 sm:grid-cols-2">
                  <select value={staffForm.status} onChange={(event) => setStaffForm({ ...staffForm, status: event.target.value })} className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="retired">Retired</option>
                  </select>
                  <select value={staffForm.availability_override} onChange={(event) => setStaffForm({ ...staffForm, availability_override: event.target.value })} className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold">
                    {availabilityOverrides.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </div>
                <RosterFields roster={staffForm.roster} onChange={(roster) => setStaffForm({ ...staffForm, roster })} />
                <Button className="h-10 w-full bg-blue-600 text-white">
                  <Plus className="h-4 w-4" />
                  Save Staff
                </Button>
              </form>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              {staff.map((member) => {
                const roster = rosterMap[member.id];
                const availability = getAvailability(member, roster);
                return (
                  <Card key={member.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-blue-600">{member.department}</p>
                        <h3 className="mt-1 text-lg font-black text-slate-950">{member.name}</h3>
                        <p className="text-sm font-semibold text-slate-500">{member.role}</p>
                      </div>
                      <StatusBadge availability={availability} />
                    </div>
                    <div className="mt-4 grid gap-2 text-xs font-bold text-slate-500">
                      <p>{member.phone || "No phone"} | {member.email || "No email"}</p>
                      <p>Shift: {formatShift(roster)}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => deleteStaff(member.id)} className="mt-4 text-red-500">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "roster" && (
          <div className="grid gap-4 lg:grid-cols-2">
            {[...doctors.map((item) => ({ ...item, type: "Doctor", roster: rosterMap[item.id] })), ...staff.map((item) => ({ ...item, type: "Staff", roster: rosterMap[item.id] }))].map((person) => {
              const availability = getAvailability(person, person.roster);
              return (
                <Card key={`${person.type}-${person.id}`} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-slate-400">{person.type}</p>
                      <h3 className="mt-1 text-lg font-black text-slate-950">{person.name}</h3>
                      <p className="text-sm font-semibold text-slate-500">{person.specialization || person.role}</p>
                    </div>
                    <StatusBadge availability={availability} />
                  </div>
                  <p className="mt-4 text-sm font-bold text-slate-600">Duty: {normalizeDutyDays(person.roster?.duty_days).join(", ") || "Not scheduled"}</p>
                  <p className="mt-1 text-sm font-bold text-slate-600">Shift: {formatShift(person.roster)}</p>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === "vacancies" && (
          <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
            <Card className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Post Vacancy</h2>
              <form onSubmit={saveVacancy} className="mt-5 space-y-3">
                <TextInput required value={vacancyForm.title} onChange={(value) => setVacancyForm({ ...vacancyForm, title: value })} placeholder="Post title" />
                <TextInput required value={vacancyForm.department} onChange={(value) => setVacancyForm({ ...vacancyForm, department: value })} placeholder="Department" />
                <TextInput value={vacancyForm.experience} onChange={(value) => setVacancyForm({ ...vacancyForm, experience: value })} placeholder="Experience required" />
                <TextInput value={vacancyForm.openings} onChange={(value) => setVacancyForm({ ...vacancyForm, openings: value })} placeholder="Openings" type="number" />
                <TextArea required value={vacancyForm.description} onChange={(value) => setVacancyForm({ ...vacancyForm, description: value })} placeholder="Job description" />
                <TextArea value={vacancyForm.requirements} onChange={(value) => setVacancyForm({ ...vacancyForm, requirements: value })} placeholder="Eligibility / Requirements" />
                <Button className="h-10 w-full bg-blue-600 text-white">
                  <Plus className="h-4 w-4" />
                  Publish Vacancy
                </Button>
              </form>
            </Card>
            <div className="grid gap-4">
              {vacancies.map((job) => (
                <Card key={job.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-emerald-600">{job.department}</p>
                      <h3 className="mt-2 text-xl font-black text-slate-950">{job.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{job.description}</p>
                      <p className="mt-3 text-xs font-bold text-slate-500">{job.openings} openings | {job.experience}</p>
                      <p className="mt-2 text-xs font-bold text-slate-500">{job.requirements}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => updateVacancyStatus(job.id, job.status === "open" ? "closed" : "open")}>
                      {job.status === "open" ? "Close" : "Reopen"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "applications" && (
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={UserRound} label="Total Applications" value={stats.total} tone="rose" />
              <StatCard icon={Upload} label="With Resume" value={stats.withResume} tone="green" />
              <StatCard icon={Trash2} label="Without Resume" value={stats.withoutResume} tone="slate" />
              <StatCard icon={BriefcaseBusiness} label="Resume Storage (bytes)" value={stats.storageBytes !== null ? stats.storageBytes : "N/A"} tone="blue" />
            </div>

            <div className="flex flex-col gap-3 rounded-lg bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name, email, phone, or vacancy" className="h-10 w-72 rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500" />
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold">
                    <option value="">All statuses</option>
                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <Button size="sm" variant="ghost" onClick={() => { setSearchTerm(""); setFilterStatus(""); }}>Reset</Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={refreshAll}>Refresh</Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Vacancy</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Resume</th>
                      <th className="p-3">Uploaded</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-blue-50/30">
                        <td className="p-3 align-top">
                          <div className="font-black text-slate-900">{app.name}</div>
                          <div className="text-xs font-semibold text-slate-500">{app.department}</div>
                        </td>
                        <td className="p-3 align-top text-sm font-semibold text-slate-600">{app.vacancy_title}</td>
                        <td className="p-3 align-top">
                          <div className="text-xs font-black">{app.phone}</div>
                          <div className="text-xs font-semibold text-slate-500">{app.email}</div>
                        </td>
                        <td className="p-3 align-top text-sm font-semibold text-slate-600">
                          <div>{app.resume_name || "-"}</div>
                          <div className="text-xs text-slate-400">{app.resume_path ? "Stored" : (app.resume_url ? "External" : "No")}</div>
                        </td>
                        <td className="p-3 align-top text-sm text-slate-500">{app.created_at ? new Date(app.created_at).toLocaleString() : "-"}</td>
                        <td className="p-3 align-top">
                          <select value={app.status || "received"} onChange={async (e) => { await updateApplicationStatus(app.id, e.target.value); }} className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-bold">
                            <option value="received">Received</option>
                            <option value="under_review">Under Review</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="interview_scheduled">Interview Scheduled</option>
                            <option value="selected">Selected</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="p-3 align-top text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => viewResume(app)}>View Resume</Button>
                            <Button size="sm" variant="outline" onClick={() => downloadResume(app)}>Download</Button>
                            <Button size="sm" variant="ghost" onClick={() => deleteResume(app)} className="text-red-600">Delete Resume</Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteApplication(app)}>Delete Application</Button>
                            <Button size="sm" variant="outline" onClick={() => rejectAndDeleteResume(app)} className="text-amber-700">Reject & Delete Resume</Button>
                            <Button size="sm" variant="outline" onClick={() => markSelected(app)} className="text-green-700">Mark as Selected</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredApplications.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-sm font-bold text-slate-400">No applications match your search or filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <Card className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Upload Gallery Photo</h2>
              <form onSubmit={saveGalleryPhoto} className="mt-5 space-y-3">
                <TextInput required value={galleryForm.title} onChange={(value) => setGalleryForm({ ...galleryForm, title: value })} placeholder="Photo title" />
                <select value={galleryForm.category} onChange={(event) => setGalleryForm({ ...galleryForm, category: event.target.value })} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold">
                  {galleryCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
                  {galleryForm.image_url && <img src={galleryForm.image_url} alt="Gallery preview" className="mb-3 h-40 w-full rounded-lg object-cover" />}
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-black text-blue-700 ring-1 ring-blue-100">
                    <ImagePlus className="h-4 w-4" />
                    Choose Photo
                    <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadGalleryPhoto(event.target.files?.[0])} />
                  </label>
                </div>
                <Button className="h-10 w-full bg-blue-600 text-white">
                  <Plus className="h-4 w-4" />
                  Upload Photo
                </Button>
              </form>
            </Card>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {galleryPhotos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <img src={photo.image_url} alt={photo.title} className="h-52 w-full object-cover" />
                  <div className="p-4">
                    <p className="text-xs font-black uppercase tracking-wider text-blue-600">{photo.category || "Gallery"}</p>
                    <h3 className="mt-2 font-black text-slate-950">{photo.title}</h3>
                    <Button size="sm" variant="ghost" onClick={() => deleteGalleryPhoto(photo)} className="mt-3 text-red-500">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
              {galleryPhotos.length === 0 && <Card className="rounded-lg border border-slate-200 bg-white p-12 text-center text-sm font-bold text-slate-400 md:col-span-2">No uploaded gallery photos yet.</Card>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
