const defaults = {
  ctaTitle: "Need help choosing the right department?",
  ctaText: "Book a visit or call the emergency desk for urgent care.",
};

export const footerPages = {
  about: {
    ...defaults,
    template: "story",
    eyebrow: "About Abhayapuri Care",
    title: "A real care hub for families in Bongaigaon",
    description:
      "Abhayapuri Care Hospital is planned as a full-service local hospital with emergency support, specialist doctors, diagnostic facilities, pharmacy help, and simple appointment booking.",
    image: "/emergency-ward-setup-service.jpg",
    accentText: "text-blue-600",
    band: "bg-slate-950",
    subhead: "Our Hospital Story",
    featureTitle: "Built around fast access, clear guidance, and trusted local care.",
    highlights: ["24/7 emergency response", "12 specialist doctors", "Diagnostics, pharmacy, and OT"],
    stats: [
      { value: "24/7", label: "Emergency care availability" },
      { value: "12+", label: "Specialist doctors listed" },
      { value: "8", label: "Major departments supported" },
      { value: "1", label: "Local hospital for nearby families" },
    ],
    gallery: [
      { title: "Emergency Ward", image: "/emergency-ward-setup-service.jpg" },
      { title: "Operation Theatre", image: "/ot-bg.jpg" },
      { title: "Hospital Access", image: "/multi-storey-car-park-1271919_1280.jpg" },
    ],
    sections: [
      {
        title: "Emergency First",
        text: "The website presents emergency contact, location, doctors, and booking support clearly so patients can take action quickly during urgent moments.",
      },
      {
        title: "Specialist Network",
        text: "Cardiology, pediatrics, neurology, dentistry, surgery, gynecology, ENT, ophthalmology, dermatology, oncology, and diabetes care are represented.",
      },
      {
        title: "Connected Services",
        text: "The hospital experience feels complete with diagnostic support, pharmacy access, appointment booking, chat guidance, and real contact channels.",
      },
      {
        title: "Local Trust",
        text: "The content is shaped for Abhayapuri, Bongaigaon, and nearby areas where people need dependable healthcare close to home.",
      },
    ],
  },
  insurance: {
    ...defaults,
    template: "insurance",
    eyebrow: "Insurance Partners",
    title: "Cashless and planned admission support",
    description:
      "Patients can understand the insurance process before admission, prepare documents, and speak with the billing desk for claim guidance.",
    image: "/istockphoto-2160662813-612x612.jpg",
    accentText: "text-cyan-600",
    badge: "bg-cyan-100 text-cyan-700",
    band: "bg-cyan-700",
    highlights: ["Cashless request support", "Admission document help", "Emergency processing guidance"],
    gallery: [
      { title: "Help Desk", image: "/Gemini_Generated_Image_b6s90b6s90b6s90b.png" },
      { title: "Pharmacy Billing", image: "/GettyImages-1993772667-645x645.jpg" },
      { title: "Hospital Location", image: "/Abhayapuri.png" },
    ],
    steps: [
      {
        title: "Check policy eligibility",
        text: "Share your policy card and patient ID details with the desk so staff can check basic insurance eligibility.",
      },
      {
        title: "Submit hospital documents",
        text: "For planned admission, bring doctor advice, reports, estimate documents, and required ID proof for pre-authorization.",
      },
      {
        title: "Track approval",
        text: "The team can guide the patient party while the insurer or TPA reviews approval and final claim documents.",
      },
      {
        title: "Complete discharge formalities",
        text: "At discharge, final bills, reports, and claim documents are checked before settlement or payment confirmation.",
      },
    ],
    checklist: ["Policy card or e-card", "Government ID proof", "Doctor prescription", "Previous reports", "Admission advice", "Insurer or TPA details"],
  },
  careers: {
    ...defaults,
    template: "careers",
    eyebrow: "Careers",
    title: "Work with a hospital team that serves the community",
    description:
      "A realistic careers page for doctors, nurses, technicians, pharmacists, front desk, billing, and patient support staff.",
    image: "/Advanced-X-ray-Radiography-Machine-with-Internal-Digital-CCD-Detector.avif",
    accentText: "text-emerald-600",
    band: "bg-emerald-700",
    ctaTitle: "Want to apply?",
    ctaText: "Send your resume by email or contact the hospital desk for available openings.",
    highlights: ["Clinical openings", "Admin and billing roles", "Supportive training culture"],
    gallery: [
      { title: "Diagnostic Lab", image: "/Gemini_Generated_Image_nelwx9nelwx9nelw.png" },
      { title: "Consultation Room", image: "/istockphoto-2160662813-612x612.jpg" },
      { title: "Diagnostic Team", image: "/Gemini_Generated_Image_2cl8ep2cl8ep2cl8.png" },
    ],
    roles: [
      { type: "Clinical", title: "Resident Doctors", text: "Support OPD, emergency response, patient review, and department coordination." },
      { type: "Nursing", title: "Staff Nurses", text: "Handle ward care, medicine timing, patient monitoring, and family communication." },
      { type: "Diagnostics", title: "Lab and X-ray Technicians", text: "Operate diagnostic workflows, sample handling, report coordination, and equipment care." },
      { type: "Pharmacy", title: "Pharmacy Assistants", text: "Help patients collect medicines, understand prescriptions, and maintain stock records." },
      { type: "Front Desk", title: "Reception Executives", text: "Manage appointments, calls, doctor schedules, billing direction, and patient routing." },
      { type: "Operations", title: "Patient Coordinators", text: "Guide families during admission, insurance processing, follow-up, and emergency movement." },
    ],
  },
  privacy: {
    ...defaults,
    template: "legal",
    eyebrow: "Privacy Policy",
    title: "Patient data should be handled with care",
    description:
      "This page explains how appointment details, contact information, messages, and patient support requests are used on the website.",
    image: "/Abhayapuri.png",
    accentText: "text-indigo-600",
    band: "bg-indigo-700",
    ctaTitle: "Have a privacy question?",
    ctaText: "Contact the hospital desk if you want help with submitted appointment or contact details.",
    highlights: ["Appointment details protected", "Used for patient follow-up", "Shared only for hospital support"],
    gallery: [
      { title: "Hospital Identity", image: "/Abhayapuri.png" },
      { title: "Patient Desk", image: "/istockphoto-2160662813-612x612.jpg" },
      { title: "Emergency Support", image: "/emergency-ward-setup-service.jpg" },
    ],
    sections: [
      {
        title: "Information Collected",
        text: "The website may collect your name, phone number, email, selected doctor, appointment date, symptoms, and message when you submit a form or contact request.",
      },
      {
        title: "How It Is Used",
        text: "Submitted details are used for appointment confirmation, doctor coordination, patient support, emergency communication, and improving hospital service workflows.",
      },
      {
        title: "Access Control",
        text: "Patient details should be accessed only by authorized hospital staff who need the information for booking, treatment support, or communication.",
      },
      {
        title: "Patient Responsibility",
        text: "Please avoid submitting highly sensitive records through public forms unless hospital staff specifically request them through an approved channel.",
      },
    ],
  },
  terms: {
    ...defaults,
    template: "legal",
    eyebrow: "Terms of Service",
    title: "Website terms for hospital visitors",
    description:
      "These terms clarify how visitors should use appointment forms, medical information, emergency contact details, and hospital pages.",
    image: "/ot-bg.jpg",
    accentText: "text-rose-600",
    band: "bg-rose-700",
    ctaTitle: "Need confirmed medical advice?",
    ctaText: "Use the website for guidance, then confirm care decisions directly with hospital staff or a doctor.",
    highlights: ["Website info is general", "Appointments need confirmation", "Emergency calls are urgent"],
    gallery: [
      { title: "Operation Theatre", image: "/ot-bg.jpg" },
      { title: "Emergency Ward", image: "/emergency-ward-setup-service.jpg" },
      { title: "Diagnostics", image: "/Advanced-X-ray-Radiography-Machine-with-Internal-Digital-CCD-Detector.avif" },
    ],
    sections: [
      {
        title: "Medical Disclaimer",
        text: "Website information is for general awareness and cannot replace diagnosis, prescription, or treatment advice from a qualified doctor.",
      },
      {
        title: "Appointment Requests",
        text: "Submitting a form creates a request only. The appointment becomes final after hospital staff confirm doctor availability and timing.",
      },
      {
        title: "Emergency Use",
        text: "For urgent symptoms, call the emergency number or visit the hospital directly instead of waiting for an online response.",
      },
      {
        title: "Content Accuracy",
        text: "Hospital services, timings, and department availability may change. Visitors should confirm important details before travel or admission.",
      },
    ],
  },
};

export const servicePages = {
  cardiology: {
    ...defaults,
    template: "service",
    eyebrow: "Cardiology",
    title: "Heart care with quick diagnosis and follow-up",
    description:
      "Cardiology services support patients with chest pain, high blood pressure, irregular heartbeat, and preventive heart screening.",
    image: "/lucid-origin_generate_an_image_of_male_doctor-0.jpg",
    accentText: "text-red-600",
    band: "bg-red-700",
    highlights: ["Chest pain assessment", "BP and ECG guidance", "Preventive heart care"],
    symptoms: ["Chest discomfort or heaviness", "High blood pressure", "Shortness of breath", "Irregular heartbeat", "Family history of heart disease"],
    gallery: [
      { title: "Cardiology Doctor", image: "/lucid-origin_generate_an_image_of_male_doctor-0.jpg" },
      { title: "Emergency Ward", image: "/emergency-ward-setup-service.jpg" },
      { title: "Diagnostic Support", image: "/Gemini_Generated_Image_nelwx9nelwx9nelw.png" },
    ],
    sections: [
      { title: "First Evaluation", text: "The doctor reviews symptoms, vitals, medicine history, and risk factors before suggesting tests." },
      { title: "Tests and Monitoring", text: "Patients may be advised ECG, BP tracking, blood tests, X-ray, or further specialist investigation." },
      { title: "Follow-up Plan", text: "Treatment can include medicine review, diet advice, activity planning, and repeat monitoring." },
    ],
  },
  pediatrics: {
    ...defaults,
    template: "service",
    eyebrow: "Pediatrics",
    title: "Child care for fever, growth, and vaccination",
    description:
      "Pediatrics focuses on newborns, children, and teenagers with illness care, vaccination guidance, and family-friendly treatment plans.",
    image: "/Screenshot 2026-05-30 170703.png",
    accentText: "text-fuchsia-600",
    band: "bg-fuchsia-700",
    highlights: ["Child fever care", "Vaccination guidance", "Growth monitoring"],
    symptoms: ["Fever or cough", "Feeding difficulty", "Vomiting or diarrhea", "Skin rash or allergy", "Vaccination schedule questions"],
    gallery: [
      { title: "Pediatric Doctor", image: "/Screenshot 2026-05-30 170703.png" },
      { title: "Family Consultation", image: "/istockphoto-2160662813-612x612.jpg" },
      { title: "Emergency Support", image: "/emergency-ward-setup-service.jpg" },
    ],
    sections: [
      { title: "Child-Friendly Review", text: "The doctor checks symptoms, hydration, temperature, growth history, and previous illness patterns." },
      { title: "Parent Guidance", text: "Parents receive clear medicine timing, warning signs, diet, fluid intake, and follow-up advice." },
      { title: "Vaccination Support", text: "Families can bring the vaccination card to review pending doses and safe timing." },
    ],
  },
  surgery: {
    ...defaults,
    template: "service",
    eyebrow: "Surgery",
    title: "General surgery consultation and recovery planning",
    description:
      "The surgery department supports evaluation, operation planning, pre-op preparation, and post-op recovery guidance.",
    image: "/ot-bg.jpg",
    accentText: "text-amber-600",
    band: "bg-amber-700",
    highlights: ["Surgical consultation", "Operation planning", "Post-op care"],
    symptoms: ["Persistent abdominal pain", "Wounds or swelling", "Hernia concern", "Gallbladder symptoms", "Post-surgery dressing needs"],
    gallery: [
      { title: "Operation Theatre", image: "/ot-bg.jpg" },
      { title: "Surgery Consultation", image: "/istockphoto-2160662813-612x612.jpg" },
      { title: "Emergency Support", image: "/emergency-ward-setup-service.jpg" },
    ],
    sections: [
      { title: "Consultation", text: "The surgeon reviews the problem, reports, medicine history, allergies, and current fitness." },
      { title: "Before Surgery", text: "Patients receive instructions about tests, fasting, admission, anesthesia review, and consent." },
      { title: "After Surgery", text: "Follow-up covers wound care, medicine timing, diet, activity limits, and recovery milestones." },
    ],
  },
  pharmacy: {
    ...defaults,
    template: "service",
    eyebrow: "Pharmacy",
    title: "Medicine support close to patient care",
    description:
      "The pharmacy supports prescription medicines, emergency medicine availability, dosage guidance, and refill coordination.",
    image: "/GettyImages-1993772667-645x645.jpg",
    accentText: "text-green-600",
    band: "bg-green-700",
    highlights: ["Prescription medicines", "Emergency supply", "Dosage guidance"],
    symptoms: ["Need prescribed medicines", "Medicine refill support", "Dose timing confusion", "Allergy clarification", "Emergency medicine request"],
    gallery: [
      { title: "Pharmacy Counter", image: "/GettyImages-1993772667-645x645.jpg" },
      { title: "Patient Desk", image: "/Gemini_Generated_Image_b6s90b6s90b6s90b.png" },
      { title: "Emergency Link", image: "/emergency-ward-setup-service.jpg" },
    ],
    sections: [
      { title: "Availability", text: "Commonly prescribed medicines and emergency support items can be coordinated through the pharmacy." },
      { title: "Safe Use", text: "Patients can ask about dosage timing, storage, and doctor-approved medicine substitutions." },
      { title: "Patient Reminder", text: "Always bring the latest prescription and mention allergy history before collecting medicines." },
    ],
  },
  "diagnostic-lab": {
    ...defaults,
    template: "service",
    eyebrow: "Diagnostic Lab",
    title: "Reports that support faster treatment decisions",
    description:
      "Diagnostic services help doctors evaluate health concerns through lab tests, X-ray support, and report-based follow-up.",
    image: "/Advanced-X-ray-Radiography-Machine-with-Internal-Digital-CCD-Detector.avif",
    accentText: "text-violet-600",
    band: "bg-violet-700",
    highlights: ["Lab test support", "X-ray facility", "Report follow-up"],
    symptoms: ["Doctor advised blood test", "Health screening needed", "X-ray required", "Follow-up report review", "Fasting test questions"],
    gallery: [
      { title: "X-Ray Facility", image: "/Advanced-X-ray-Radiography-Machine-with-Internal-Digital-CCD-Detector.avif" },
      { title: "Diagnostic Lab", image: "/Gemini_Generated_Image_nelwx9nelwx9nelw.png" },
      { title: "Doctor Review", image: "/lucid-origin_generate_an_image_of_nurologist_specialist_doctor-0.jpg" },
    ],
    sections: [
      { title: "Testing Support", text: "Patients can bring doctor-advised tests for routine screening and department-specific investigations." },
      { title: "Report Value", text: "Reports help doctors confirm diagnosis, monitor recovery, and change treatment when needed." },
      { title: "Before Testing", text: "Ask whether fasting is required and carry the doctor's test advice slip for accurate processing." },
    ],
  },
};
