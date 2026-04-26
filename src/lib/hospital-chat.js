export const quickPrompts = [
  "What services do you offer?",
  "How can I book an appointment?",
  "Who are your doctors?",
  "Where is the hospital located?",
];

const hospitalFacts = {
  name: "Abhayapuri Care Hospital",
  address: "Abhayapuri Ward No. 4, Bongaigaon, Assam - 783384",
  emergencyPhone: "+91 8822141629",
  email: "ashraful.abh@gmail.com",
  consultationFee: "Rs. 500",
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

const knowledgeBase = [
  {
    keywords: ["hello", "hi", "hey", "namaste", "assalamualaikum"],
    reply: {
      text: `Hello! I'm the ${hospitalFacts.name} AI assistant. I can help with doctors, services, appointments, emergency contact, OPD hours, facilities, fees, and location.`,
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
      text: "Our featured doctors include Dr. Ahmed (Cardiology), Dr. Fatima (Pediatrics), Dr. Robert (Neurology), Dr. Verma (Oncology), Dr. Khan (Dentistry), Dr. Ray (Dermatology), Dr. Parbin (Endocrinology), and Dr. Baruah (General Surgery).",
      actionLabel: "Meet doctors",
      actionTarget: "doctors",
    },
  },
  {
    keywords: ["opd", "outpatient", "timing", "timings", "hours", "open", "opening", "schedule"],
    reply: {
      text: `Emergency service is available ${hospitalFacts.emergencyHours}. For project presentation, the assistant can also share OPD timing as ${hospitalFacts.opdHours}.`,
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
      text: `Emergency service is available ${hospitalFacts.emergencyHours}. The emergency contact shown on the website is ${hospitalFacts.emergencyPhone}. For a real emergency, please call directly instead of waiting for chat replies.`,
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
    keywords: ["ai", "chatbot", "assistant", "help"],
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
        (total, keyword) => total + (normalized.includes(keyword) ? 1 : 0),
        0
      ),
    }))
    .sort((a, b) => b.score - a.score)[0];

  let reply;

  if (scoredMatch && scoredMatch.score > 0) {
    reply = scoredMatch.reply;
  } else {
    reply = {
      text: "I couldn't match that exactly, but I can help with services, doctors, appointments, emergency contact, location, and timings. Try asking one of those topics.",
      actionLabel: "Book appointment",
      actionTarget: "contact",
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
