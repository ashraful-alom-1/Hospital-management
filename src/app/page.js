"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import ContactForm from "@/components/ui/ContactForm";
import HospitalChatWidget from "@/components/ui/HospitalChatWidget";
import { Button } from "@/components/ui/button";
import { 
  FlaskConical, 
  Ambulance, 
  Stethoscope, 
  Award,
  Phone,
  Mail,
  MapPin,
  Heart,
  Baby,
  Bone,
  Pill,
  Microscope,
  ChevronRight,
  Calendar,
  User,
  ArrowRight,
  Newspaper,
  FileText,
  X,
  Clock,
  Menu,
  Star,
  Quote
} from "lucide-react";

// ✅ Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination, Navigation } from 'swiper/modules';

// ✅ Swiper Styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.6, 0.05, -0.01, 0.9] } 
  }
};

function Modal({ isOpen, onClose, title, content, image, date, author, category, readTime }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <button 
          onClick={onClose}
          className="sticky top-4 right-4 float-right z-10 bg-white rounded-full p-2 shadow-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {image && (
          <img src={image} alt={title} className="w-full h-64 object-cover rounded-t-3xl" />
        )}
        
        <div className="p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-100 text-blue-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {category}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {date}
            </span>
            {author && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <User className="w-3 h-3" />
                {author}
              </span>
            )}
            {readTime && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readTime}
              </span>
            )}
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 mb-6">{title}</h2>
          
          <div className="prose prose-lg max-w-none">
            {content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-slate-600 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h4 className="text-sm font-black text-slate-900 mb-3">Share this article:</h4>
            <div className="flex gap-3">
              <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-xs font-bold">
                FB
              </button>
              <button className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors text-xs font-bold">
                TW
              </button>
              <button className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors text-xs font-bold">
                IN
              </button>
              <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-xs font-bold">
                @
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [showAllNews, setShowAllNews] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Smooth scroll with better performance
  const scrollTo = useCallback((id, offset = 80) => {
    setIsScrolling(true);
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      setActiveSection(id);
      setMobileMenuOpen(false);
      
      setTimeout(() => setIsScrolling(false), 1000);
    }
  }, []);

  // Update active section on scroll with throttle for better performance
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking && !isScrolling) {
        requestAnimationFrame(() => {
          const sections = ["home", "why-choose-us", "services", "reviews", "blog", "news", "gallery", "doctors", "location", "contact"];
          const scrollPosition = window.scrollY + 200;
          
          for (const section of sections) {
            const element = document.getElementById(section);
            if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
              setActiveSection(section);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolling]);

  const galleryItems = [
    { title: "Main Lobby", category: "Hospital", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800" },
    { title: "Parking area", category: "facility", img: "multi-storey-car-park-1271919_1280.jpg" },
    { title: "Emergency Ward", category: "ICU", img: "emergency-ward-setup-service.jpg" },
    { title: "Advanced X-Ray", category: "Radiology", img: "Advanced-X-ray-Radiography-Machine-with-Internal-Digital-CCD-Detector.avif" },
    { title: "Dental Care Unit", category: "Dentistry", img: "rubenjob-dental-2450766_1920.jpg" },
    { title: "Operation Theatre", category: "Surgery", img: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800" },
    { title: "24/7 Pharmacy", category: "Pharmacy", img: "GettyImages-1993772667-645x645.jpg" },
    { title: "Premium Patient Suite", category: "Facility", img: "https://images.squarespace-cdn.com/content/v1/5608cdf2e4b07b88f3d98ec8/e4707b51-b089-45be-81b3-a49262e8dc4b/Kings-1.jpg" },
    { title: "Consultation Room", category: "Doctors", img: "istockphoto-2160662813-612x612.jpg" },
    { title: "Diagnostic Lab", category: "Facility", img: "https://mkbetul.com/wp-content/uploads/2025/12/freepik__35mm-film-photography-modern-pathology-laboratory-__88338-1024x585.png" },
  ];

  const doctorsList = [
    { name: "Dr. Ahmed", specialty: "Cardiology (Heart)", img: "lucid-origin_generate_an_image_of_male_doctor-0.jpg" },
    { name: "Dr. Fatima", specialty: "Pediatrics (Child)", img: "https://img.freepik.com/premium-photo/close-up-muslim-female-doctor-protective-mask-looking-front-working-hospital_249974-5147.jpg" },
    { name: "Dr. Robert", specialty: "Neurology (Brain)", img: "lucid-origin_generate_an_image_of_nurologist_specialist_doctor-0.jpg" },
    { name: "Dr. Verma", specialty: "Oncology (Cancer)", img: "lucid-origin_generate_an_image_of_cancer_specialist_doctor-0.jpg" },
    { name: "Dr. Khan", specialty: "Dentistry (Teeth)", img: "lucid-origin_generate_an_image_of_male_dentist_doctor-0.jpg" },
    { name: "Dr. Ray", specialty: "Dermatology (Hair & Skin)", img: "blank-profile-picture-973460_960_720.webp" },
    { name: "Dr. Parbin", specialty: "Endocrinology (Diabetes)", img: "lucid-origin_generate_an_image_of_female_doctor_who_is_wearing_hijab_also-0.jpg" },
    { name: "Dr. Baruah", specialty: "General Surgery", img: "blank-profile-picture-973460_960_720.webp" }
  ];

  // 20+ Reviews Data
  const allReviews = [
    { id: 1, name: "Rahul Sarma", text: "Best hospital in Abhayapuri. Staff is very cooperative and professional.", stars: 5, date: "March 15, 2026", location: "Bongaigaon", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 2, name: "Priya Das", text: "Clean environment and advanced facilities. Dr. Ahmed treated me very well. Highly recommended!", stars: 5, date: "March 12, 2026", location: "Abhayapuri", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 3, name: "Abdul Ali", text: "Emergency response bahut fast hai. I highly recommend this hospital for emergency services.", stars: 5, date: "March 10, 2026", location: "Bongaigaon", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 4, name: "Mousumi Bora", text: "The maternity care is excellent. Nurses are very caring and supportive.", stars: 5, date: "March 8, 2026", location: "Chapaguri", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 5, name: "Rakesh Sharma", text: "Advanced diagnostic lab with quick reports. Very affordable rates.", stars: 4, date: "March 5, 2026", location: "Goalpara", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 6, name: "Anjali Baruah", text: "Dr. Fatima is an amazing pediatrician. My child recovered quickly.", stars: 5, date: "March 3, 2026", location: "Bongaigaon", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 7, name: "Hussain Ahmed", text: "24/7 pharmacy service is a lifesaver. Got medicines at midnight.", stars: 5, date: "February 28, 2026", location: "Abhayapuri", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 8, name: "Rima Saikia", text: "Very cooperative staff and clean rooms. Felt like home.", stars: 5, date: "February 25, 2026", location: "Bijni", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 9, name: "Deepak Singh", text: "Best cardiology department in the region. Dr. Ahmed saved my father's life.", stars: 5, date: "February 20, 2026", location: "Bongaigaon", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 10, name: "Nayan Jyoti", text: "Affordable treatment with world-class facilities. Great experience.", stars: 4, date: "February 18, 2026", location: "Goalpara", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 11, name: "Monika Das", text: "The dental care unit is very advanced. Painless treatment.", stars: 5, date: "February 15, 2026", location: "Abhayapuri", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 12, name: "Pankaj Sarma", text: "Quick ambulance service. Reached hospital within 10 minutes.", stars: 5, date: "February 12, 2026", location: "Bongaigaon", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 13, name: "Karishma Begum", text: "Very professional doctors and modern equipment. Highly satisfied.", stars: 5, date: "February 10, 2026", location: "Chapaguri", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 14, name: "Bikash Roy", text: "Good experience with the surgery team. Post-operative care was excellent.", stars: 5, date: "February 8, 2026", location: "Bijni", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 15, name: "Smita Paul", text: "The physiotherapy department helped me recover from my back pain.", stars: 4, date: "February 5, 2026", location: "Bongaigaon", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 16, name: "Imran Hussain", text: "NABL accredited lab gives accurate reports. Trustworthy results.", stars: 5, date: "February 3, 2026", location: "Abhayapuri", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 17, name: "Gitika Boro", text: "Very clean and hygienic environment. COVID protocols followed strictly.", stars: 5, date: "January 30, 2026", location: "Bongaigaon", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 18, name: "Mohan Agarwal", text: "Best hospital in Bongaigaon district. Will recommend to everyone.", stars: 5, date: "January 28, 2026", location: "Goalpara", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 19, name: "Rupali Chetry", text: "The skin care treatment at dermatology department is excellent.", stars: 5, date: "January 25, 2026", location: "Abhayapuri", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 20, name: "Sanjib Barman", text: "Online appointment booking is very convenient. Saved my time.", stars: 4, date: "January 22, 2026", location: "Bongaigaon", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 21, name: "Farida Khatun", text: "Great experience with the maternity ward. Very supportive nurses.", stars: 5, date: "January 20, 2026", location: "Chapaguri", avatar: "blank-profile-picture-973460_960_720.webp" },
    { id: 22, name: "Dhruba Jyoti", text: "Advanced technology and expert doctors make this hospital the best.", stars: 5, date: "January 18, 2026", location: "Bijni", avatar: "blank-profile-picture-973460_960_720.webp" },
  ];

  // Expanded Blog Posts Data
  const allBlogPosts = [
    {
      id: 1,
      title: "10 Tips for a Healthy Heart",
      excerpt: "Learn about lifestyle changes that can significantly reduce your risk of heart disease including diet, exercise, and stress management...",
      content: "Heart disease remains one of the leading causes of death worldwide, but the good news is that many cases are preventable. Here are 10 comprehensive tips to keep your heart healthy:\n\n1. Eat a balanced diet rich in fruits, vegetables, whole grains, and lean proteins.\n2. Exercise regularly - aim for at least 30 minutes of moderate activity daily.\n3. Maintain a healthy weight to reduce strain on your heart.\n4. Quit smoking and avoid secondhand smoke.\n5. Limit alcohol consumption.\n6. Manage stress through meditation, yoga, or hobbies.\n7. Get regular health screenings for blood pressure and cholesterol.\n8. Control diabetes if you have it.\n9. Get enough sleep - 7-9 hours per night.\n10. Stay hydrated and limit sugary drinks.\n\nRemember, small changes can make a big difference. Start today for a healthier tomorrow!",
      author: "Dr. Ahmed",
      date: "March 15, 2026",
      category: "Cardiology",
      readTime: "5 min read",
      image: "https://www.drbhosalekartik.com/wp-content/uploads/2024/03/10-Tips-For-Healthy-Heart-in-Summer.jpg",
      slug: "healthy-heart-tips"
    },
    {
      id: 2,
      title: "Understanding COVID-19 Vaccines",
      excerpt: "Everything you need to know about the latest COVID-19 vaccines and booster shots for maximum protection...",
      content: "COVID-19 vaccines have proven to be safe and effective in preventing severe illness. Here's what you need to know:\n\nTypes of Vaccines Available:\n- mRNA vaccines (Pfizer, Moderna)\n- Viral vector vaccines\n- Protein subunit vaccines\n\nBooster Shots: Recommended every 6-12 months for continued protection, especially for high-risk individuals.\n\nCommon Side Effects:\n- Sore arm at injection site\n- Mild fever\n- Fatigue\n- Headache\n\nThese side effects typically resolve within 1-2 days. The benefits of vaccination far outweigh the risks. Consult your doctor if you have specific concerns about allergies or underlying conditions.",
      author: "Dr. Fatima",
      date: "March 10, 2026",
      category: "Infectious Diseases",
      readTime: "7 min read",
      image: "https://aarp.widen.net/content/ryh3t0x09q/jpeg/1140-GettyImages-1297565599.jpg?crop=true&anchor=0,0&q=80&color=ffffffff&u=k2e9ec&w=1140&h=655",
      slug: "covid-vaccine-guide"
    },
    {
      id: 3,
      title: "Mental Health Awareness in 2026",
      excerpt: "Breaking the stigma: Understanding mental health and when to seek professional help for anxiety and depression...",
      content: "Mental health is just as important as physical health. In 2026, we're seeing increased awareness but still need to break the stigma.\n\nSigns You May Need Help:\n- Persistent sadness or hopelessness\n- Excessive worry or anxiety\n- Changes in sleep or appetite\n- Withdrawal from social activities\n- Difficulty concentrating\n\nTreatment Options:\n1. Therapy/Counseling (CBT, DBT)\n2. Medication when necessary\n3. Support groups\n4. Lifestyle changes (exercise, nutrition)\n5. Mindfulness and meditation\n\nRemember: Seeking help is a sign of strength, not weakness. Our psychiatric department offers confidential consultations.",
      author: "Dr. Ray",
      date: "March 5, 2026",
      category: "Psychiatry",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800",
      slug: "mental-health-awareness"
    },
    {
      id: 4,
      title: "Nutrition Guide for Diabetic Patients",
      excerpt: "Essential dietary guidelines and meal planning tips for managing diabetes effectively...",
      content: "Managing diabetes through proper nutrition is crucial. Here's a comprehensive guide:\n\nFoods to Eat:\n- Non-starchy vegetables\n- Whole grains (brown rice, quinoa, oats)\n- Lean proteins (chicken, fish, tofu)\n- Healthy fats (avocado, nuts, olive oil)\n- Berries and citrus fruits in moderation\n\nFoods to Limit:\n- Refined carbohydrates\n- Sugary beverages\n- Processed snacks\n- Red meat\n- Fried foods\n\nMeal Planning Tips:\n- Eat regular meals at consistent times\n- Control portion sizes\n- Count carbohydrates\n- Stay hydrated with water\n- Monitor blood sugar levels regularly\n\nConsult our nutritionists for personalized meal plans tailored to your needs.",
      author: "Dr. Parbin",
      date: "February 28, 2026",
      category: "Endocrinology",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800",
      slug: "diabetes-nutrition-guide"
    },
    {
      id: 5,
      title: "Pediatric Care: Vaccination Schedule",
      excerpt: "Complete guide to childhood immunizations and why they're essential for your child's health...",
      content: "Vaccinations are crucial for protecting children from serious diseases. Here's the recommended schedule:\n\nBirth to 6 Months:\n- Hepatitis B (Birth)\n- DTaP (2,4,6 months)\n- Hib (2,4,6 months)\n- Polio (2,4,6 months)\n- PCV13 (2,4,6 months)\n- Rotavirus (2,4 months)\n\n6-18 Months:\n- Influenza (annual)\n- MMR (12-15 months)\n- Varicella (12-15 months)\n- Hepatitis A (12-23 months)\n\n4-6 Years:\n- DTaP\n- MMR\n- Polio\n- Varicella\n\n11-12 Years:\n- HPV\n- Tdap\n- Meningococcal\n\nVaccines save lives. Follow this schedule to ensure your child's optimal protection.",
      author: "Dr. Fatima",
      date: "February 20, 2026",
      category: "Pediatrics",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=800",
      slug: "pediatric-vaccination"
    },
    {
      id: 6,
      title: "Understanding Hypertension",
      excerpt: "Causes, symptoms, and management of high blood pressure - the silent killer...",
      content: "Hypertension affects millions worldwide. Understanding it is the first step to management.\n\nNormal blood pressure: Below 120/80 mmHg\nElevated: 120-129/80 mmHg\nHypertension Stage 1: 130-139/80-89 mmHg\nHypertension Stage 2: 140+/90+ mmHg\n\nRisk Factors:\n- Age\n- Family history\n- Obesity\n- Sedentary lifestyle\n- High sodium intake\n- Stress\n- Smoking\n- Excessive alcohol\n\nManagement Strategies:\n1. DASH Diet (rich in fruits, vegetables, low-fat dairy)\n2. Regular exercise (150 minutes/week)\n3. Reduce sodium (less than 2300mg/day)\n4. Limit alcohol\n5. Quit smoking\n6. Stress reduction techniques\n7. Medication as prescribed\n\nRegular monitoring is key. Visit our cardiology department for comprehensive care.",
      author: "Dr. Ahmed",
      date: "February 15, 2026",
      category: "Cardiology",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800",
      slug: "hypertension-guide"
    }
  ];

  // Expanded News Articles Data
  const allNewsArticles = [
    {
      id: 1,
      title: "Abhayapuri Care Hospital Launches Advanced Cardiac Care Unit",
      summary: "State-of-the-art facility with modern equipment to serve heart patients in Bongaigaon region...",
      content: "We are proud to announce the launch of our new Advanced Cardiac Care Unit (ACCU). This 50-bed facility is equipped with:\n\n- Latest ECG machines\n- 24/7 cardiac monitoring\n- Dedicated cath lab\n- Experienced cardiologists on call\n- Emergency response team\n\nThe unit will provide comprehensive cardiac care including emergency interventions, diagnostic services, and rehabilitation. This represents a significant investment in healthcare infrastructure for the Bongaigaon region.\n\nInauguration Ceremony: March 20, 2026, at 11 AM.\n\nAll are welcome to attend.",
      date: "March 12, 2026",
      category: "Hospital News",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800",
      link: "#"
    },
    {
      id: 2,
      title: "Free Health Camp Organized in Rural Areas",
      summary: "Our medical team visits remote villages to provide free checkups and medicines...",
      content: "As part of our community outreach program, we organized a free health camp in the remote village of Chapaguri. Our team of 15 doctors and 20 paramedics provided:\n\n- Free consultations (over 500 patients)\n- Free medicines worth ₹2 lakhs\n- Health awareness sessions\n- Blood pressure and diabetes screening\n- COVID-19 vaccination drive\n\nThe camp was a huge success with overwhelming response from the local community. We plan to organize similar camps in other villages every month.\n\nNext Camp: April 5, 2026 at Borobazar village.",
      date: "March 8, 2026",
      category: "Community Outreach",
      image: "https://img-cdn.publive.online/fit-in/640x480/filters:format(webp)/greater-kashmir/media/media_files/wp-content/uploads/2023/10/Medical_camp.jpg",
      link: "#"
    },
    {
      id: 3,
      title: "Recognition for Excellence in Patient Care",
      summary: "Abhayapuri Care Hospital receives award for outstanding patient safety standards...",
      content: "We are honored to announce that Abhayapuri Care Hospital has received the 'Excellence in Patient Safety' award from the Assam Health Department.\n\nThe award recognizes our commitment to:\n- Zero medical errors\n- Infection control protocols\n- Patient satisfaction scores (98%)\n- Staff training programs\n- Emergency response times\n\nThis recognition motivates us to continue improving our services. We thank our dedicated staff and supportive patients for making this possible.",
      date: "March 1, 2026",
      category: "Achievements",
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=800",
      link: "#"
    },
    {
      id: 4,
      title: "New MRI Machine Installation Completed",
      summary: "3-Tesla wide-bore MRI machine now operational for advanced diagnostic imaging...",
      content: "We have successfully installed a new 3-Tesla wide-bore MRI machine - the first in the region. This advanced technology offers:\n\n- Higher resolution images\n- Faster scan times (reduced by 40%)\n- More comfortable experience for claustrophobic patients\n- Advanced cardiac and neurological imaging\n- Lower radiation exposure\n\nThe machine is now operational and available for all patients. Special introductory rates apply for the first month.\n\nFor appointments, contact our radiology department.",
      date: "February 25, 2026",
      category: "Facility Update",
      image: "https://cdn.expresshealthcare.in/wp-content/uploads/2025/09/09154759/New-Project-2025-09-09T150934.100.jpg",
      link: "#"
    },
    {
      id: 5,
      title: "Telemedicine Services Expanded",
      summary: "Now offering virtual consultations with specialists from across India...",
      content: "We have expanded our telemedicine services to reach more patients. Now you can consult with our specialists from the comfort of your home.\n\nAvailable Services:\n- Video consultations\n- E-prescriptions\n- Home delivery of medicines\n- Remote patient monitoring\n- Follow-up appointments\n\nSpecialties Available:\n- Cardiology\n- Neurology\n- Pediatrics\n- Dermatology\n- Psychiatry\n\nTo book a telemedicine appointment, call our helpline or use our mobile app.",
      date: "February 20, 2026",
      category: "Technology",
      image: "https://static.toiimg.com/thumb/msid-121195349,imgsize-19952,width-400,height-225,resizemode-72/121195349.jpg",
      link: "#"
    },
    {
      id: 6,
      title: "International Doctors' Conference Hosted",
      summary: "Leading medical experts from 15 countries gather for healthcare innovation summit...",
      content: "Abhayapuri Care Hospital successfully hosted the International Healthcare Innovation Summit 2026. The event brought together:\n\n- 200+ doctors from 15 countries\n- 50 research presentations\n- Workshops on latest surgical techniques\n- Panel discussions on future of healthcare\n- Networking opportunities\n\nKey topics discussed:\n- AI in diagnostics\n- Robotic surgery advancements\n- Personalized medicine\n- Global health challenges\n\nThis positions our hospital as a center for medical excellence in Northeast India.",
      date: "February 15, 2026",
      category: "Events",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800",
      link: "#"
    }
  ];

  // Display limited posts based on view all state
  const displayedBlogs = showAllBlogs ? allBlogPosts : allBlogPosts.slice(0, 3);
  const displayedNews = showAllNews ? allNewsArticles : allNewsArticles.slice(0, 3);

  // Why Choose Us Data
  const whyChooseUsData = [
    {
      icon: FlaskConical,
      title: "NABL Accredited Lab",
      description: "State-of-the-art diagnostic laboratory with accurate and timely reports",
      color: "from-blue-600 to-blue-700"
    },
    {
      icon: Ambulance,
      title: "24/7 Emergency",
      description: "Round-the-clock emergency services with dedicated trauma care team",
      color: "from-red-600 to-red-700"
    },
    {
      icon: Stethoscope,
      title: "Expert Specialists",
      description: "Internationally trained doctors across all major medical departments",
      color: "from-green-600 to-green-700"
    },
    {
      icon: Award,
      title: "NABH Certified",
      description: "Quality healthcare services meeting international patient safety standards",
      color: "from-purple-600 to-purple-700"
    }
  ];

  const navItems = [
    { id: "home", label: "Home", action: () => scrollTo('home', 80) },
    { id: "why-choose-us", label: "Why Us", action: () => scrollTo('why-choose-us', 80) },
    { id: "services", label: "Services", action: () => scrollTo('services', 80) },
    { id: "reviews", label: "Reviews", action: () => scrollTo('reviews', 80) },
    { id: "blog", label: "Blog", action: () => scrollTo('blog', 80) },
    { id: "news", label: "News", action: () => scrollTo('news', 80) },
    { id: "gallery", label: "Gallery", action: () => scrollTo('gallery', 80) },
    { id: "doctors", label: "Doctors", action: () => scrollTo('doctors', 80) },
    { id: "location", label: "Location", action: () => scrollTo('location', 80) },
    { id: "contact", label: "Contact", action: () => scrollTo('contact', 80) }
  ];

  // Star Rating Component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
        ))}
      </div>
    );
  };

  return (
    <main className="bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      
      {/* Modals */}
      <Modal 
        isOpen={selectedBlog !== null}
        onClose={() => setSelectedBlog(null)}
        title={selectedBlog?.title}
        content={selectedBlog?.content}
        image={selectedBlog?.image}
        date={selectedBlog?.date}
        author={selectedBlog?.author}
        category={selectedBlog?.category}
        readTime={selectedBlog?.readTime}
      />
      
      <Modal 
        isOpen={selectedNews !== null}
        onClose={() => setSelectedNews(null)}
        title={selectedNews?.title}
        content={selectedNews?.content}
        image={selectedNews?.image}
        date={selectedNews?.date}
        category={selectedNews?.category}
      />

      {/* --- EMERGENCY STICKY BAR --- */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-red-600 to-red-700 text-white py-2 sm:py-2.5 shadow-lg"
      >
        <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 items-center justify-center gap-2 text-center">
            <div className="animate-pulse">
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wide sm:tracking-wider">🚨 24/7 Emergency Helpline</span>
          </div>
          <div className="flex min-w-0 w-full sm:w-auto items-center gap-2 sm:gap-4 flex-wrap justify-center text-center">
            <a 
              href="tel:+918822141629" 
              className="flex max-w-full items-center gap-2 bg-white/20 hover:bg-white/30 px-3 sm:px-4 py-1.5 rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              <Phone className="w-4 h-4" />
              <span className="font-bold text-xs sm:text-sm">+91 8822141629</span>
            </a>
            <span className="text-xs hidden sm:inline">|</span>
            <span className="text-[10px] sm:text-xs font-medium leading-tight">Ambulance Available Within 10 Minutes</span>
          </div>
        </div>
      </motion.div>


{/* --- FIXED NAVBAR - RESPONSIVE & NO WRAP --- */}
<nav className="fixed top-[86px] sm:top-10 w-full z-40 px-3 sm:px-4 md:px-8 py-3 sm:py-4">
  <div className="max-w-[1500px] mx-auto w-full">
    
    <div className="bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl px-3 sm:px-4 md:px-6 py-3 flex justify-between items-center gap-2 shadow-2xl">
      
      {/* Logo - NEVER WRAPS */}
      <motion.h1 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        onClick={() => scrollTo('home', 80)}
        className="min-w-0 truncate text-base sm:text-lg md:text-xl xl:text-2xl font-black tracking-tight cursor-pointer bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent"
      >
        ABHAYAPURI CARE
      </motion.h1>
      
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`px-2 xl:px-3 py-2 text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-xl whitespace-nowrap ${
              activeSection === item.id 
                ? 'text-blue-400 bg-blue-600/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right Side */}
      <div className="flex shrink-0 items-center gap-1.5 md:gap-3">
        
        {/* Book Button */}
        <Button 
          onClick={() => scrollTo('contact', 80)} 
          className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 rounded-full font-bold px-3 sm:px-4 md:px-5 h-8 sm:h-9 md:h-10 text-[11px] sm:text-xs md:text-sm transition-all active:scale-95 shadow-lg shadow-blue-600/20"
        >
          Book Now
        </Button>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden shrink-0 p-2 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

    </div>
    
    {/* Mobile Navigation Menu */}
    {mobileMenuOpen && (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="lg:hidden mt-3 bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className={`px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 rounded-xl text-left ${
                activeSection === item.id 
                  ? 'bg-blue-600/20 text-blue-400' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </motion.div>
    )}
    
  </div>
</nav>

      {/* --- HERO SECTION --- */}
      <section 
        id="home"
        className="relative min-h-screen flex items-center justify-center pt-44 sm:pt-32 overflow-hidden px-4 sm:px-6"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(15, 23, 42, 0.9)), url('/ot-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed',
        }}
      >
        <motion.div initial="hidden" animate="visible" className="text-center max-w-5xl w-full z-10">
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-block max-w-full bg-white text-blue-700 px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wide sm:tracking-widest border border-white/20">
              BONGAIGAON&apos;S PREMIER HEALTHCARE
            </span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl md:text-[100px] font-black leading-[0.95] md:leading-[0.9] tracking-tight text-white mb-6 sm:mb-8">
            Your Health, <br/> <span className="text-blue-400 font-extrabold italic">Our Priority.</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-base sm:text-xl text-slate-300 mb-8 sm:mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Experience world-class diagnostic facilities and expert medical consultations 
            with Abhayapuri Care Hospital&apos;s compassionate team.
          </motion.p>
          
          <motion.div variants={fadeInUp}>
            <Button 
              onClick={() => scrollTo('contact', 80)}
              className="w-full max-w-[320px] sm:w-auto sm:max-w-none bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-12 py-6 sm:py-9 rounded-2xl text-base sm:text-xl font-black shadow-2xl transition-transform active:scale-95"
            >
              Book An Appointment Now
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* --- WHY CHOOSE US SECTION --- */}
      <section id="why-choose-us" className="py-20 sm:py-32 px-4 sm:px-6 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="text-blue-600 font-black text-sm uppercase tracking-wider mb-4 inline-block">Our Excellence</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase underline decoration-blue-600 decoration-4 sm:decoration-8 underline-offset-8">
              Why Choose Us
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mt-6">
              Setting new standards in healthcare with advanced technology and compassionate care
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUsData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {item.description}
                </p>
                
                <div className={`w-12 h-1 bg-gradient-to-r ${item.color} rounded-full mt-6 group-hover:w-full transition-all duration-500`}></div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-20 bg-white rounded-3xl p-8 shadow-lg border border-slate-100"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-black text-blue-600 mb-2">50K+</div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Happy Patients</div>
              </div>
              <div>
                <div className="text-3xl font-black text-blue-600 mb-2">50+</div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Expert Doctors</div>
              </div>
              <div>
                <div className="text-3xl font-black text-blue-600 mb-2">24/7</div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Emergency Support</div>
              </div>
              <div>
                <div className="text-3xl font-black text-blue-600 mb-2">98%</div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Patient Satisfaction</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section id="services" className="py-20 sm:py-32 px-4 sm:px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase underline decoration-blue-600 decoration-4 sm:decoration-8 underline-offset-8">Our Services</h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: 'General Medicine', icon: '🩺' },
            { title: 'Maternity Care', icon: '🤰' },
            { title: 'Emergency Care', icon: '🚑' }
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -15 }} className="p-6 sm:p-12 rounded-3xl sm:rounded-[40px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="text-5xl mb-8">{s.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
              <p className="text-slate-500 font-medium">Expert treatment and care available 24/7 at Abhayapuri Care.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- REVIEWS SECTION with Swiper Carousel --- */}
      <section id="reviews" className="py-20 sm:py-32 px-4 sm:px-6 bg-gradient-to-br from-blue-50 to-indigo-50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Quote className="w-6 h-6 text-blue-600" />
              <span className="text-blue-600 font-black text-sm uppercase tracking-wider">Patient Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase underline decoration-blue-600 decoration-4 sm:decoration-8 underline-offset-8">
              What Our Patients Say
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mt-6">
              Real experiences from patients who trusted us with their health
            </p>
          </motion.div>

          <Swiper
            modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: false,
            }}
            className="reviews-swiper pb-12"
          >
            {allReviews.map((review) => (
              <SwiperSlide key={review.id}>
                <motion.div 
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                      <img 
                        src={review.avatar} 
                        alt={review.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900">{review.name}</h3>
                      <p className="text-xs text-slate-400">{review.location}</p>
                    </div>
                  </div>
                  
                  <StarRating rating={review.stars} />
                  
                  <p className="text-slate-600 mt-4 leading-relaxed italic">
                    &quot;{review.text}&quot;
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {review.date}
                    </p>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-slate-900">4.9/5</span>
              <span className="text-slate-500 text-sm">Average Rating from {allReviews.length}+ Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- BLOG SECTION --- */}
      <section id="blog" className="py-20 sm:py-32 px-4 sm:px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <span className="text-blue-600 font-black text-sm uppercase tracking-wider">Health Insights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase underline decoration-blue-600 decoration-4 sm:decoration-8 underline-offset-8">
              Latest Blog Posts
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mt-6">
              Expert health advice, medical updates, and wellness tips from our specialists
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedBlogs.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedBlog(post)}
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <button className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm group-hover:gap-3 transition-all">
                    Read More 
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button 
              onClick={() => setShowAllBlogs(!showAllBlogs)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-8"
            >
              {showAllBlogs ? "Show Less" : "View All Blog Posts"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* --- NEWS SECTION --- */}
      <section id="news" className="py-20 sm:py-32 px-4 sm:px-6 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Newspaper className="w-6 h-6 text-green-600" />
              <span className="text-green-600 font-black text-sm uppercase tracking-wider">Hospital Updates</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase underline decoration-green-600 decoration-4 sm:decoration-8 underline-offset-8">
              News & Announcements
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mt-6">
              Stay updated with the latest happenings, achievements, and community initiatives
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            {displayedNews.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer bg-white rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300"
                onClick={() => setSelectedNews(news)}
              >
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  <div className="md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        {news.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {news.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-green-600 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                      {news.summary}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-green-600 text-sm font-semibold group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button 
              onClick={() => setShowAllNews(!showAllNews)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-full px-8"
            >
              {showAllNews ? "Show Less" : "View All News"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* --- GALLERY SECTION --- */}
      <section
        id="gallery"
        className="py-20 sm:py-32 bg-white text-slate-900 px-4 sm:px-6 rounded-3xl sm:rounded-[60px] mx-2 sm:mx-4 md:mx-10 relative overflow-hidden z-10"
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
          <div className="text-center max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 leading-tight uppercase underline decoration-blue-600 decoration-4 sm:decoration-8 underline-offset-8">
              Hospital Gallery
            </h2>
            <p className="text-slate-600 text-lg">
              A glimpse into our world-class facilities and patient care environment.
            </p>
          </div>

          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 200,
              modifier: 1,
              slideShadows: false,
            }}
            modules={[EffectCoverflow, Autoplay]}
            className="w-full pb-10"
          >
            {galleryItems.map((item, index) => (
              <SwiperSlide
                key={index}
                style={{ width: '280px', height: '380px' }}
              >
                <div className="relative h-full rounded-3xl overflow-hidden border border-slate-200 group shadow-xl">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent">
                    <div className="absolute bottom-6 left-6 text-left">
                      <span className="bg-blue-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                        {item.category}
                      </span>
                      <p className="text-white font-black text-lg mt-2">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* --- DOCTORS SECTION --- */}
      <section id="doctors" className="py-20 sm:py-32 bg-slate-950 text-white px-4 sm:px-6 rounded-3xl sm:rounded-[60px] mx-2 sm:mx-4 md:mx-10 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
          <div className="text-center max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 leading-tight uppercase underline decoration-blue-500 decoration-4 sm:decoration-8 underline-offset-8">Expert Specialists</h2>
            <p className="text-slate-300 text-lg mb-10">Our team consists of internationally trained specialists across all major medical sectors.</p>
            <Button variant="outline" className="border-white text-white bg-blue-600 hover:bg-white hover:text-slate-900 font-bold h-14 px-10 rounded-xl" onClick={() => scrollTo('contact', 80)}>Meet Our Doctors</Button>
          </div>

          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 200,
              modifier: 1,
              slideShadows: false,
            }}
            modules={[EffectCoverflow, Autoplay]}
            className="w-full pb-10"
          >
            {doctorsList.map((doc, idx) => (
              <SwiperSlide key={idx} style={{ width: '280px', height: '380px' }}>
                <div className="relative h-full rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
                  <img src={doc.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={doc.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                    <div className="absolute bottom-6 left-6 text-left">
                      <p className="text-white font-black text-xl">{doc.name}</p>
                      <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-1">{doc.specialty}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* --- LOCATION SECTION --- */}
      <section id="location" className="py-20 sm:py-32 px-4 sm:px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-8 uppercase underline decoration-blue-600 decoration-4 sm:decoration-8 underline-offset-8">Find Us</h2>
                <div className="space-y-6 text-slate-600">
                    <div>
                        <p className="font-black text-blue-600 uppercase text-xs tracking-widest">📍 Main Location</p>
                        <p className="text-xl font-bold text-slate-800">Abhayapuri Ward No. 4, Bongaigaon, Assam - 783384</p>
                    </div>
                    <div>
                        <p className="font-black text-blue-600 uppercase text-xs tracking-widest">🕒 Emergency Hours</p>
                        <p className="text-xl font-bold text-slate-800">Available 24 Hours / 7 Days</p>
                    </div>
                </div>
            </div>
            <div className="md:w-1/2 w-full h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14299.16726189578!2d90.6558298!3d26.3312852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3758e579294f385f%3A0x67399882260655d8!2sAbhayapuri%2C%20Assam!5e0!3m2!1sen!2sin!4v1713333333333" 
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy">
                </iframe>
            </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-20 sm:py-32 px-4 sm:px-6 bg-slate-50 z-10 relative">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 uppercase underline decoration-blue-600 decoration-4 sm:decoration-8 underline-offset-8">Book Your Visit</h2>
        </div>
        <ContactForm />
      </section>

      {/* --- PROFESSIONAL FOOTER --- */}
      <footer className="bg-slate-950 text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-blue-400 mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: "About Us", href: "#" },
                  { name: "Our Doctors", href: "#doctors" },
                  { name: "Insurance Partners", href: "#" },
                  { name: "Careers", href: "#" },
                  { name: "Blog", href: "#blog" },
                  { name: "News", href: "#news" }
                ].map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      onClick={(e) => {
                        if (link.href.startsWith("#")) {
                          e.preventDefault();
                          scrollTo(link.href.substring(1), 80);
                        }
                      }}
                      className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-blue-400 mb-6">Medical Services</h3>
              <ul className="space-y-3">
                {[
                  { name: "Cardiology", icon: Heart },
                  { name: "Pediatrics", icon: Baby },
                  { name: "Surgery", icon: Bone },
                  { name: "Pharmacy", icon: Pill },
                  { name: "Diagnostic Lab", icon: Microscope }
                ].map((service, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center gap-2"
                    >
                      <service.icon className="w-3.5 h-3.5 opacity-70" />
                      <span>{service.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-blue-400 mb-6">Contact & Compliance</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-300 text-sm">
                  <Phone className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">
                    Emergency: <a href="tel:+918822141629" className="font-bold text-white hover:text-blue-400 transition-colors">+91 8822141629</a>
                  </span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm">
                  <Mail className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <a href="mailto:ashraful.abh@gmail.com" className="hover:text-blue-400 transition-colors">ashraful.abh@gmail.com</a>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-sm">
                  <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">Abhayapuri Ward No. 4, Bongaigaon, Assam - 783384</span>
                </li>
                <li className="pt-4 border-t border-slate-800">
                  <div className="flex flex-col gap-2">
                    <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors text-xs uppercase tracking-wider">Privacy Policy</a>
                    <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors text-xs uppercase tracking-wider">Terms of Service</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-800 text-center">
            <div className="flex flex-wrap justify-center gap-8 mb-6">
              <a href="https://www.facebook.com/profile.php?id=61578589231361" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
                <i className="fa-brands fa-facebook-f text-lg"></i>
              </a>
              <a href="https://www.instagram.com/ashrafulalom.03/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-400 transition-colors">
                <i className="fa-brands fa-instagram text-lg"></i>
              </a>
              <a href="https://www.linkedin.com/in/ashraful-alom-612a05268" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors">
                <i className="fa-brands fa-linkedin-in text-lg"></i>
              </a>
              <a href="https://github.com/ashraful-alom-1" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <i className="fa-brands fa-github text-lg"></i>
              </a>
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.3em] leading-relaxed">
              © 2026 Abhayapuri Care Hospital • Bongaigaon, Assam • All Rights Reserved
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .reviews-swiper .swiper-button-prev,
        .reviews-swiper .swiper-button-next {
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          color: #2563eb;
        }
        .reviews-swiper .swiper-button-prev:after,
        .reviews-swiper .swiper-button-next:after {
          font-size: 18px;
        }
        .reviews-swiper .swiper-pagination-bullet-active {
          background: #2563eb;
        }
        .reviews-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
        }
      `}</style>
      <HospitalChatWidget />
    </main>
  );
}
