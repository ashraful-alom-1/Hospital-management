"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";

// ✅ Animations Variants (Puraane code se wapas laya gaya)
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.1 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export default function ContactForm() {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [showQR, setShowQR] = useState(false); 

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: null,
    message: ""
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInitiatePayment = (e) => {
    e.preventDefault();
    if (!form.date) {
      alert("Please select a date first");
      return;
    }
    setShowQR(true);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setShowQR(false);

    try {
      // Date formatting for Supabase
      const selectedDateISO = new Date(form.date.getTime() - (form.date.getTimezoneOffset() * 60000))
                                .toISOString()
                                .split('T')[0];

      // Insert into Supabase with 'Paid' status
      const { error: insertError } = await supabase.from("appointments").insert([
        { 
          name: form.name, 
          email: form.email, 
          phone: form.phone, 
          message: form.message, 
          date: selectedDateISO,
          status: 'Paid' 
        },
      ]);

      if (insertError) throw insertError;

      // Trigger Email Notification
      await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: form.name, 
          email: form.email, 
          phone: form.phone, 
          date: selectedDateISO 
        }),
      });

      // Show Success Overlay
      setStatus('success');
      
      // ✅ Auto-Reload logic after 4 seconds
      setTimeout(() => {
        window.location.reload();
      }, 4000);

    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-4 flex justify-center bg-slate-50 min-h-screen relative">
      
      {/* --- PAYMENT MODAL (Ashraful Alom QR) --- */}
      <AnimatePresence>
        {showQR && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-lg px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-8 max-w-sm w-full text-center shadow-2xl border border-white/20"
            >
              <h3 className="text-2xl font-black text-slate-900 mb-1">Confirm Payment</h3>
              <p className="text-slate-500 text-sm mb-6">Consultation Fee: ₹500</p>
              
              <div className="bg-slate-50 p-4 rounded-[2.5rem] mb-6 border-2 border-slate-100 shadow-inner inline-block">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=ashraful.abh-2@oksbi&pn=Ashraful%20Alom&am=500&cu=INR`} 
                  alt="UPI QR Code"
                  className="w-48 h-48 rounded-2xl"
                />
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 py-3 rounded-2xl border border-blue-100">
                    <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-1">UPI ID</p>
                    <p className="text-sm font-bold text-slate-700">ashraful.abh-2@oksbi</p>
                </div>
                
                <Button 
                  onClick={handleFinalSubmit}
                  className="w-full h-14 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-200"
                >
                  I Have Paid Successfully
                </Button>
                
                <button 
                  onClick={() => setShowQR(false)} 
                  className="text-slate-400 font-bold text-xs uppercase tracking-widest pt-2 hover:text-red-500 transition-colors"
                >
                  Cancel Payment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial="hidden" animate="visible" 
        variants={containerVariants} 
        className="w-full max-w-xl"
      >
        <Card className="shadow-2xl rounded-[2.5rem] border-0 overflow-hidden bg-white/80 backdrop-blur-md relative">
          <div className="h-2 bg-blue-600" />
          
          <CardHeader className="pt-8 text-center text-slate-900">
            <motion.div variants={itemVariants}>
               <CardTitle className="text-4xl font-black tracking-tight uppercase">ABHAYAPURI CARE</CardTitle>
               <p className="text-slate-500 font-medium mt-2">Book Your Appointment</p>
            </motion.div>
          </CardHeader>

          <CardContent className="p-8">
            {/* ✅ SUCCESS OVERLAY WITH PROGRESS BAR */}
            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute inset-0 z-[110] bg-white flex flex-col items-center justify-center p-10 text-center rounded-[2.5rem]"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6">✅</div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Booking Confirmed!</h2>
                  <p className="text-slate-500 font-medium mb-8">Mail sent to your inbox. <br/> Page will refresh in a moment.</p>
                  
                  {/* Visual Progress Bar for Reload */}
                  <div className="w-40 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 4, ease: "linear" }}
                        className="h-full bg-green-500" 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleInitiatePayment} className="space-y-5">
              <motion.div variants={itemVariants} className="space-y-4">
                <Input placeholder="Full Name" className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <Input type="email" placeholder="Email Address" className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <Input type="tel" placeholder="Phone Number" className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-3 text-center">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Appointment Date</label>
                <div className="p-2 bg-slate-50 rounded-[2rem] border border-slate-100 flex justify-center overflow-hidden">
                  {isClient && <Calendar mode="single" selected={form.date} onSelect={(date) => setForm({ ...form, date })} />}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Textarea placeholder="Reason for consultation (Optional)..." className="rounded-2xl min-h-[100px] bg-slate-50/50 border-slate-100" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button 
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Continue to Payment"}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}