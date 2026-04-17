"use client";

import { motion } from "framer-motion";
import ContactForm from "@/components/ui/ContactForm";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] } 
  }
};

export default function Home() {
  
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const galleryItems = [
    { title: "Main Lobby", category: "Hospital", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800" },
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

  // ✅ Testimonials Data
  const reviews = [
    { name: "Rahul Sarma", text: "Best hospital in Abhayapuri. Staff is very cooperative.", stars: "⭐⭐⭐⭐⭐" },
    { name: "Priya Das", text: "Clean environment and advanced facilities. Dr. Ahmed treated me very well.", stars: "⭐⭐⭐⭐⭐" },
    { name: "Abdul Ali", text: "The emergency response is very fast. I highly recommend this hospital.", stars: "⭐⭐⭐⭐⭐" }
  ];

  return (
    <main className="bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      
      {/* --- FIXED NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 px-6 md:px-12 py-5 flex justify-between items-center text-white">
        <motion.h1 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-2xl font-black tracking-tighter cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ABHAYAPURI CARE HOSPITAL
        </motion.h1>
        
        <div className="hidden md:flex gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">
          <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="hover:text-blue-400 transition-all">Home</button>
          <button onClick={() => scrollTo('services')} className="hover:text-blue-400 transition-all">Services</button>
          <button onClick={() => scrollTo('gallery')} className="hover:text-blue-400 transition-all">Gallery</button>
          <button onClick={() => scrollTo('doctors')} className="hover:text-blue-400 transition-all">Doctors</button>
          <button onClick={() => scrollTo('location')} className="hover:text-blue-400 transition-all">Location</button>
          <button onClick={() => scrollTo('contact')} className="hover:text-blue-400 transition-all">Contact</button>
        </div>

        <Button onClick={() => scrollTo('contact')} className="bg-blue-600 hover:bg-blue-700 rounded-full font-bold px-6 h-11 transition-all active:scale-95">
          Book Now
        </Button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section 
        className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden px-6"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(15, 23, 42, 0.9)), url('/ot-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed',
        }}
      >
        <motion.div initial="hidden" animate="visible" className="text-center max-w-5xl z-10">
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="bg-white text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
              BONGAIGAON'S PREMIER HEALTHCARE
            </span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-6xl md:text-[100px] font-black leading-[0.9] tracking-tight text-white mb-8">
            Your Health, <br/> <span className="text-blue-400 font-extrabold italic">Our Priority.</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Experience world-class diagnostic facilities and expert medical consultations 
            with Abhayapuri Care Hospital's compassionate team.
          </motion.p>
          
          <motion.div variants={fadeInUp}>
            <Button 
              onClick={() => scrollTo('contact')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-9 rounded-2xl text-xl font-black shadow-2xl transition-transform active:scale-95"
            >
              Book An Appointment Now
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section id="services" className="py-32 px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase underline decoration-blue-600 decoration-8 underline-offset-8">Our Services</h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: 'General Medicine', icon: '🩺' },
            { title: 'Maternity Care', icon: '🤰' },
            { title: 'Emergency Care', icon: '🚑' }
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -15 }} className="p-12 rounded-[40px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="text-5xl mb-8">{s.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
              <p className="text-slate-500 font-medium">Expert treatment and care available 24/7 at Abhayapuri Care.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- GALLERY SECTION --- */}
      <section id="gallery" className="py-32 px-6 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase underline decoration-blue-600 decoration-8 underline-offset-8">Hospital Gallery</h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <motion.div key={index} whileHover={{ scale: 1.02 }} className="relative group h-80 overflow-hidden rounded-[32px] shadow-lg">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
              <div className="absolute bottom-8 left-8 text-white">
                <span className="bg-blue-600 text-[10px] font-black uppercase px-3 py-1 rounded-full">{item.category}</span>
                <h3 className="text-xl font-bold mt-2">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- DOCTORS SECTION --- */}
      <section id="doctors" className="py-32 bg-slate-950 text-white px-6 rounded-[60px] mx-4 md:mx-10 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
          <div className="text-center max-w-2xl">
            <h2 className="text-5xl font-black mb-8 leading-tight uppercase underline decoration-blue-500 decoration-8 underline-offset-8">Expert Specialists</h2>
            <p className="text-slate-300 text-lg mb-10">Our team consists of internationally trained specialists across all major medical sectors.</p>
            <Button variant="outline" className="border-white text-white bg-blue-600 hover:bg-white hover:text-slate-900 font-bold h-14 px-10 rounded-xl" onClick={() => scrollTo('contact')}>Meet Our Doctors</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {doctorsList.map((doc, idx) => (
              <motion.div key={idx} whileHover={{ y: -10 }} className="relative h-80 rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
                <img src={doc.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={doc.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                  <div className="absolute bottom-6 left-6 text-left">
                    <p className="text-white font-black text-xl">{doc.name}</p>
                    <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-1">{doc.specialty}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION (NEW) --- */}
      <section className="py-32 px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase underline decoration-blue-600 decoration-8 underline-offset-8">Patient Reviews</h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <motion.div key={i} whileHover={{ y: -10 }} className="p-10 rounded-[3rem] bg-blue-50/50 border border-blue-100 flex flex-col items-center text-center shadow-sm">
              <div className="text-2xl mb-4">{rev.stars}</div>
              <p className="text-slate-700 font-medium italic mb-6">"{rev.text}"</p>
              <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">— {rev.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- LOCATION SECTION --- */}
      <section id="location" className="py-32 px-6 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
                <h2 className="text-5xl font-black text-slate-900 mb-8 uppercase underline decoration-blue-600 decoration-8 underline-offset-8">Find Us</h2>
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
      <section id="contact" className="py-32 px-6 bg-white z-10 relative">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-black text-slate-900 mb-4 uppercase underline decoration-blue-600 decoration-8 underline-offset-8">Book Your Visit</h2>
          
          <div className="mt-8 p-6 bg-red-50 border-2 border-dashed border-red-200 rounded-[2rem] inline-block animate-bounce shadow-xl shadow-red-100">
            <p className="text-red-600 font-black text-xs uppercase tracking-widest mb-1">🚑 Emergency Helpline</p>
            <a href="tel:+918822141629" className="text-3xl font-black text-slate-900 hover:text-red-600 transition-colors">+91 8822141629</a>
          </div>
        </div>
        <ContactForm />
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-slate-100 text-center z-10 bg-white relative">
        <h2 className="text-2xl font-black text-blue-600 mb-6 tracking-tighter italic uppercase">Abhayapuri Care Hospital</h2>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">
          © 2026 Abhayapuri Care • Bongaigaon, Assam • All Rights Reserved
        </p>
      </footer>
    </main>
  );
}