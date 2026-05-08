export const quickPrompts = [
  "Which doctor treats heart problems?",
  "Which doctor should I consult?",
  "What are the hospital timings?",
  "How can I book an appointment?",
];

const hospitalFacts = {
  name: "Abhayapuri Care Hospital",
  address: "Abhayapuri Ward No. 4, Bongaigaon, Assam - 783384",
  emergencyPhone: "+91 8822141629",
  email: "ashraful.abh@gmail.com",
  consultationFee: "Rs. 10",
  emergencyHours: "24 Hours / 7 Days",
  opdHours: "9:00 AM to 6:00 PM, Monday to Saturday",
  diagnostics:
    "Advanced X-Ray, Diagnostic Lab, MRI-related imaging references, and modern radiology support highlighted on the website.",
  facilities:
    "Emergency Ward, Parking Area, Main Lobby, Operation Theatre, Dental Care Unit, Premium Patient Suite, Consultation Room, Pharmacy, and Diagnostic Lab.",
  payment:
    "The booking flow currently shows UPI payment before appointment confirmation for project-demo purposes.",
  insurance:
    "Insurance partner details are not listed yet on the website, but the footer already has a placeholder link for future expansion.",
};

export const doctors = [
  {
    name: "Dr. Ahmed",
    specialty: "Cardiology",
    careFor: "heart, chest pain, BP, ECG, hypertension, and cardiac care",
    duty: "Monday, Wednesday, Friday - 10:00 AM to 2:00 PM",
    slotStart: "10:00",
    keywords: [
      "heart",
      "cardio",
      "cardiology",
      "chest pain",
      "chest ache",
      "pain in chest",
      "chest",
      "bp",
      "blood pressure",
      "hypertension",
      "ecg",
      "heartbeat",
      "palpitation",
      "heart problem",
      "heart pain",
      "pain in heart",
      "saans",
      "breath",
      "breathing",
      "dil",
    ],
  },
  {
    name: "Dr. Fatima",
    specialty: "Pediatrics",
    careFor: "child fever, vaccination, cough, growth, and child health",
    duty: "Monday to Saturday - 9:30 AM to 1:30 PM",
    slotStart: "09:30",
    keywords: [
      "child",
      "children",
      "baby",
      "pediatric",
      "pediatrics",
      "kid",
      "vaccination",
      "vaccine",
      "bachcha",
      "bacha",
      "fever in child",
      "child fever",
    ],
  },
  {
    name: "Dr. Robert",
    specialty: "Neurology",
    careFor: "brain, headache, migraine, seizure, stroke symptoms, and nerve problems",
    duty: "Tuesday, Thursday, Saturday - 11:00 AM to 3:00 PM",
    slotStart: "11:00",
    keywords: [
      "brain",
      "neuro",
      "neurology",
      "headache",
      "migraine",
      "seizure",
      "stroke",
      "nerve",
      "numbness",
      "chakkar",
      "dizziness",
      "sir dard",
      "head pain",
      "pain in head",
    ],
  },
  {
    name: "Dr. Verma",
    specialty: "Oncology",
    careFor: "cancer-related consultation, lump evaluation, biopsy guidance, and chemotherapy advice",
    duty: "Monday, Thursday - 2:00 PM to 5:00 PM",
    slotStart: "14:00",
    keywords: ["cancer", "oncology", "tumor", "tumour", "lump", "chemotherapy", "biopsy", "gaanth"],
  },
  {
    name: "Dr. Khan",
    specialty: "Dentistry",
    careFor: "tooth pain, gum problems, dental cleaning, cavity, and oral care",
    duty: "Monday to Saturday - 10:00 AM to 4:00 PM",
    slotStart: "10:00",
    keywords: ["tooth", "teeth", "tooth pain", "teeth pain", "dental", "dentist", "gum", "cavity", "mouth", "daant", "dant"],
  },
  {
    name: "Dr. Ray",
    specialty: "Dermatology",
    careFor: "skin allergy, rashes, acne, hair fall, itching, and infection",
    duty: "Tuesday, Thursday, Saturday - 10:00 AM to 1:00 PM",
    slotStart: "10:00",
    keywords: ["skin", "skin pain", "derma", "dermatology", "rash", "rashes", "acne", "hair", "itching", "allergy", "khujli"],
  },
  {
    name: "Dr. Parbin",
    specialty: "Endocrinology",
    careFor: "diabetes, thyroid, hormone, weight changes, and sugar control",
    duty: "Monday, Wednesday, Friday - 3:00 PM to 6:00 PM",
    slotStart: "15:00",
    keywords: ["diabetes", "sugar", "thyroid", "hormone", "endocrine", "endocrinology", "weight"],
  },
  {
    name: "Dr. Baruah",
    specialty: "General Surgery",
    careFor: "stomach pain, abdominal pain, appendix, hernia, gallbladder, wounds, piles, knee pain, injury, and surgery consultation",
    duty: "Tuesday, Friday - 2:00 PM to 6:00 PM",
    slotStart: "14:00",
    keywords: [
      "surgery",
      "surgeon",
      "appendix",
      "hernia",
      "gallbladder",
      "wound",
      "piles",
      "operation",
      "stomach",
      "stomach pain",
      "abdominal",
      "abdomen",
      "belly",
      "belly pain",
      "pet dard",
      "knee",
      "knee pain",
      "joint pain",
      "leg pain",
      "bone pain",
      "injury",
      "swelling",
    ],
  },
];

const symptomHelpKeywords = [
  "which doctor",
  "kaunsa doctor",
  "konsa doctor",
  "kis doctor",
  "doctor dikhana",
  "doctor dikhaun",
  "not sure",
  "pata nahi",
  "samajh nahi",
  "problem hai",
  "bimari",
  "disease",
  "symptom",
  "symptoms",
  "pain",
  "ache",
  "hurt",
  "hurting",
  "dard",
];

const emergencyKeywords = [
  "emergency",
  "urgent",
  "ambulance",
  "severe chest pain",
  "bahut chest pain",
  "heart attack",
  "unconscious",
  "behosh",
  "stroke",
  "heavy bleeding",
  "saans nahi",
];

const whyChooseKeywords = [
  "why should i book",
  "why book",
  "why choose",
  "why your hospital",
  "why this hospital",
  "why should i choose",
  "why should we choose",
  "benefit",
  "benefits",
  "advantage",
  "advantages",
  "special about",
  "good hospital",
  "best hospital",
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function includesAny(text, keywords) {
  return keywords.some((keyword) => {
    if (/^[a-z0-9]+$/i.test(keyword) && keyword.length <= 3) {
      return new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i").test(text);
    }

    return text.includes(keyword);
  });
}

function getAllDoctorsText() {
  return doctors
    .map((doctor) => `${doctor.name} (${doctor.specialty}) - Duty: ${doctor.duty}`)
    .join("\n");
}

function getDoctorReply(doctor) {
  return {
    text: `For ${doctor.careFor}, you should consult ${doctor.name} (${doctor.specialty}). Duty time: ${doctor.duty}. Would you like to book an appointment? If the patient has emergency symptoms such as severe pain, breathing difficulty, unconsciousness, or heavy bleeding, please call ${hospitalFacts.emergencyPhone} immediately.`,
    actionLabel: "Book appointment",
    actionTarget: "contact",
    recommendedDoctor: doctor.name,
    nextTopic: "contact",
  };
}

function getDoctorDutyReply(doctor) {
  return {
    text: `${doctor.name} (${doctor.specialty}) duty time: ${doctor.duty}. This doctor handles ${doctor.careFor}. Would you like to book an appointment with ${doctor.name}?`,
    actionLabel: "Book appointment",
    actionTarget: "contact",
    recommendedDoctor: doctor.name,
    nextTopic: "contact",
  };
}

function findDoctorBySymptoms(normalized) {
  return doctors.find((doctor) => includesAny(normalized, doctor.keywords));
}

function findDoctorByNameOrSpecialty(normalized) {
  return doctors.find((doctor) => {
    const doctorName = doctor.name.toLowerCase();
    const shortName = doctorName.replace("dr. ", "").replace("dr ", "");
    const specialty = doctor.specialty.toLowerCase();

    return (
      normalized.includes(doctorName) ||
      normalized.includes(shortName) ||
      normalized.includes(specialty)
    );
  });
}

function wantsDoctorDuty(normalized) {
  return includesAny(normalized, [
    "duty",
    "timing",
    "timings",
    "time",
    "schedule",
    "available",
    "availability",
    "when",
    "kab",
  ]);
}

function isOnlyVaguePain(normalized) {
  return [
    "pain",
    "i have pain",
    "i am in pain",
    "body pain",
    "ache",
    "dard",
    "pain hai",
  ].includes(normalized);
}

function wantsAllDoctors(normalized) {
  return (
    includesAny(normalized, [
      "all doctor",
      "all doctors",
      "sabhi doctor",
      "sare doctor",
      "list doctor",
      "doctor list",
      "list of doctors",
      "show doctors",
      "show all doctors",
      "your doctors",
      "available doctors",
    ]) ||
    normalized === "doctors" ||
    normalized === "doctor" ||
    normalized === "who are your doctors"
  );
}

function wantsDoctorCount(normalized) {
  return includesAny(normalized, [
    "how many doctor",
    "how many doctors",
    "number of doctor",
    "number of doctors",
    "total doctor",
    "total doctors",
    "doctor count",
  ]);
}

const knowledgeBase = [
  {
    keywords: ["hello", "hi", "hey", "namaste", "assalamualaikum"],
    reply: {
      text: `Hello! I am the ${hospitalFacts.name} AI assistant. You can describe symptoms such as heart or chest pain, child fever, headache, tooth pain, skin problems, diabetes, or a surgery concern. I will suggest the suitable doctor and duty time.`,
    },
  },
  {
    keywords: ["service", "services", "department", "treatment", "facility", "facilities"],
    reply: {
      text: "We currently highlight Cardiology, Pediatrics, Neurology, Oncology, Dentistry, Dermatology, Endocrinology, General Surgery, Diagnostic Lab, Emergency Ward, X-Ray, Pharmacy, and Dental Care on this website.",
      actionLabel: "View services",
      actionTarget: "services",
    },
  },
  {
    keywords: ["doctor", "doctors", "specialist", "specialists"],
    reply: {
      text: `Please tell me the patient problem first, then I can suggest the correct doctor. Example: heart/chest pain, child fever, headache, teeth pain, skin allergy, diabetes/thyroid, cancer concern, or surgery problem.\n\nIf you want the full doctor list, ask "all doctors".`,
      actionLabel: "Meet doctors",
      actionTarget: "doctors",
    },
  },
  {
    keywords: ["opd", "outpatient", "timing", "timings", "hours", "open", "opening", "schedule", "working time", "work time", "duty time"],
    reply: {
      text: `Hospital OPD timing: ${hospitalFacts.opdHours}. Emergency service: ${hospitalFacts.emergencyHours}. Doctor duty times are different for each department. Please share the symptom or department name, and I will provide the exact doctor duty time.`,
      actionLabel: "Go to contact",
      actionTarget: "contact",
    },
  },
  {
    keywords: ["appointment", "book", "booking", "visit", "consultation"],
    reply: {
      text: `You can book from the Book Your Visit section on this page. The flow asks for your name, email, phone number, preferred date, and consultation reason. The form currently shows a consultation fee of ${hospitalFacts.consultationFee} before confirmation.`,
      actionLabel: "Open booking form",
      actionTarget: "contact",
    },
  },
  {
    keywords: ["fee", "fees", "price", "cost", "charge", "consultation fee"],
    reply: {
      text: `The current consultation fee shown in the booking flow is ${hospitalFacts.consultationFee}. This is presented in the payment modal before final appointment confirmation.`,
      actionLabel: "Open booking form",
      actionTarget: "contact",
    },
  },
  {
    keywords: ["location", "address", "where", "hospital address", "find you"],
    reply: {
      text: `${hospitalFacts.name} is shown at ${hospitalFacts.address}. You can also check the embedded map in the Find Us section.`,
      actionLabel: "Open map section",
      actionTarget: "location",
    },
  },
  {
    keywords: ["emergency", "urgent", "ambulance", "24/7", "24 hours"],
    reply: {
      text: `Emergency service is available ${hospitalFacts.emergencyHours}. Emergency contact: ${hospitalFacts.emergencyPhone}. If the patient has severe chest pain, breathlessness, stroke symptoms, unconsciousness, heavy bleeding, or a major injury, please do not wait for chat replies. Call directly or visit the emergency ward.`,
    },
  },
  {
    keywords: ["contact", "email", "phone", "call"],
    reply: {
      text: `You can contact the hospital using ${hospitalFacts.emergencyPhone} or email ${hospitalFacts.email}. The contact and booking area is available near the bottom of the homepage.`,
      actionLabel: "Go to contact",
      actionTarget: "contact",
    },
  },
  {
    keywords: ["diagnostic", "diagnostics", "lab", "x-ray", "mri", "radiology", "scan"],
    reply: {
      text: `Our diagnostics-related highlights include ${hospitalFacts.diagnostics}`,
      actionLabel: "View services",
      actionTarget: "services",
    },
  },
  {
    keywords: ["facility", "facilities", "room", "ward", "parking", "pharmacy", "operation theatre"],
    reply: {
      text: `Hospital facility highlights on the website include ${hospitalFacts.facilities}`,
      actionLabel: "Open gallery",
      actionTarget: "gallery",
    },
  },
  {
    keywords: ["payment", "upi", "paid", "qr", "pay"],
    reply: {
      text: `${hospitalFacts.payment} The current demo uses a QR-based UPI step before confirming the appointment.`,
      actionLabel: "Open booking form",
      actionTarget: "contact",
    },
  },
  {
    keywords: ["insurance", "cashless", "partner", "partners"],
    reply: {
      text: hospitalFacts.insurance,
    },
  },
  {
    keywords: ["reviews", "rating", "patients", "feedback", "testimonials"],
    reply: {
      text: "The homepage includes many patient reviews and testimonials that make the hospital portal feel more realistic for a final-year project demo.",
      actionLabel: "See reviews",
      actionTarget: "reviews",
    },
  },
  {
    keywords: ["news", "blog", "article", "health tips"],
    reply: {
      text: "This website already includes blog and news sections with topics like heart care, diabetes nutrition, pediatric vaccination, hypertension, new facilities, and community outreach updates.",
      actionLabel: "Read blog",
      actionTarget: "blog",
    },
  },
  {
    keywords: ["chatbot", "assistant", "help"],
    reply: {
      text: "This assistant is designed for your final-year project to give fast hospital information in a free and simple way. It is not a medical diagnosis tool, but it helps visitors navigate the website and basic services.",
    },
  },
];

export function getFollowUpReply(topic) {
  const followUpReplies = {
    services: {
      text: "Our hospital highlights emergency care, diagnostics, surgery, pharmacy, cardiology, pediatrics, neurology, oncology, dentistry, dermatology, and diabetes-related care. You can use the services section to present the main departments during your project demo.",
      actionLabel: "View services",
      actionTarget: "services",
    },
    doctors: {
      text: "The doctor section showcases specialists from major departments so visitors can quickly understand the range of care available. For your project demo, this works well as a digital hospital profile with specialist visibility.",
      actionLabel: "Meet doctors",
      actionTarget: "doctors",
    },
    contact: {
      text: "The booking area lets visitors enter their details, pick a date, and continue through your appointment flow. This is one of the best demo features to show during your final-year presentation.",
      actionLabel: "Open booking form",
      actionTarget: "contact",
    },
    location: {
      text: "The location section includes the full hospital address and an embedded map, which is useful for showing accessibility and local presence in your project presentation.",
      actionLabel: "Open map section",
      actionTarget: "location",
    },
    blog: {
      text: "The blog and news sections make the website feel more complete by showing health education, hospital announcements, and community activity. That gives your project a more realistic hospital portal experience.",
      actionLabel: "Read blog",
      actionTarget: "blog",
    },
    gallery: {
      text: "The gallery section helps you present the hospital visually with facility images like emergency ward, parking, operation theatre, dental unit, and diagnostic areas.",
      actionLabel: "Open gallery",
      actionTarget: "gallery",
    },
    reviews: {
      text: "The reviews section adds social proof to the project by showing patient feedback, ratings, and realistic testimonials from different locations.",
      actionLabel: "See reviews",
      actionTarget: "reviews",
    },
  };

  return (
    followUpReplies[topic] || {
      text: "I can help you explore doctors, services, booking, contact, emergency support, and location details. Ask me a topic and I'll guide you there.",
      actionLabel: "Book appointment",
      actionTarget: "contact",
    }
  );
}

export function getHospitalChatReply(input, lastTopic = "contact") {
  const normalized = String(input || "").toLowerCase().trim();

  if (!normalized) {
    return {
      text: "Please type a question. For example: booking, doctors, services, emergency, or location.",
      nextTopic: lastTopic,
    };
  }

  if (includesAny(normalized, emergencyKeywords)) {
    return {
      text: `This may be an emergency. ${hospitalFacts.name} provides emergency service ${hospitalFacts.emergencyHours}. Please call ${hospitalFacts.emergencyPhone} immediately or visit the nearest emergency ward. If the patient is stable, describe the symptoms and I can suggest a suitable doctor.`,
      nextTopic: "contact",
    };
  }

  if (includesAny(normalized, whyChooseKeywords)) {
    return {
      text: `${hospitalFacts.name} is designed to make care easier for patients: 24/7 emergency support, specialist doctors, diagnostic facilities, pharmacy support, appointment booking, clear doctor duty timings, and a local contact number for help. You can also use this AI assistant to choose the right doctor before booking.`,
      actionLabel: "Book appointment",
      actionTarget: "contact",
      nextTopic: "contact",
    };
  }

  const namedDoctor = findDoctorByNameOrSpecialty(normalized);

  if (namedDoctor) {
    if (wantsDoctorDuty(normalized)) {
      return getDoctorDutyReply(namedDoctor);
    }

    return {
      text: `${namedDoctor.name} is our ${namedDoctor.specialty} specialist. This doctor handles ${namedDoctor.careFor}. Duty time: ${namedDoctor.duty}.`,
      actionLabel: "Book appointment",
      actionTarget: "contact",
      recommendedDoctor: namedDoctor.name,
      nextTopic: "contact",
    };
  }

  const matchedDoctor = findDoctorBySymptoms(normalized);

  if (matchedDoctor) {
    return getDoctorReply(matchedDoctor);
  }

  if (isOnlyVaguePain(normalized)) {
    return {
      text: "Please tell me where the pain is located, such as chest pain, stomach pain, knee pain, head pain, tooth pain, skin pain, or wound/injury pain. After that I can suggest the most suitable doctor and duty time.",
      nextTopic: "doctors",
    };
  }

  if (wantsDoctorCount(normalized)) {
    return {
      text: `We currently have ${doctors.length} specialist doctors listed on this website:\n${getAllDoctorsText()}`,
      actionLabel: "Meet doctors",
      actionTarget: "doctors",
      nextTopic: "doctors",
    };
  }

  if (wantsAllDoctors(normalized)) {
    return {
      text: `Our doctors:\n${getAllDoctorsText()}\n\nIf the patient has a specific problem, type the symptom. I will suggest only the relevant doctor.`,
      actionLabel: "Meet doctors",
      actionTarget: "doctors",
      nextTopic: "doctors",
    };
  }

  if (includesAny(normalized, symptomHelpKeywords)) {
    return {
      text: "What problem is the patient facing? Please describe the symptoms briefly, such as chest pain or heart problem, child fever, headache, tooth pain, skin rash, diabetes or thyroid issue, cancer-related lump, surgery concern, or wound. I will suggest the correct doctor name and duty time based on the symptoms.",
      nextTopic: "doctors",
    };
  }

  const isFollowUpQuestion =
    normalized.includes("more") ||
    normalized.includes("details") ||
    normalized.includes("tell me more") ||
    normalized.includes("what about") ||
    normalized.includes("and") ||
    normalized.includes("also");

  const scoredMatch = knowledgeBase
    .map((item) => ({
      ...item,
      score: item.keywords.reduce(
        (total, keyword) => total + (includesAny(normalized, [keyword]) ? 1 : 0),
        0
      ),
    }))
    .sort((a, b) => b.score - a.score)[0];

  let reply;

  if (scoredMatch && scoredMatch.score > 0) {
    reply = scoredMatch.reply;
  } else {
    reply = {
      text: "I could not identify the exact answer from that message. You can call the hospital at +91 8822141629, or leave your details below so our team can contact you even if you are no longer on the site.",
      leadForm: true,
      nextTopic: "doctors",
    };
  }

  if (isFollowUpQuestion && reply.actionTarget === "contact") {
    reply = getFollowUpReply(lastTopic);
  }

  return {
    ...reply,
    nextTopic: reply.actionTarget || lastTopic,
  };
}
