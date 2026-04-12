"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";

export default function ContactForm() {
  const [isClient, setIsClient] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.date) {
      alert("Please select a date");
      return;
    }

    // ✅ Get existing bookings for that date
    const { data: existing } = await supabase
      .from("appointments")
      .select("*")
      .eq("date", form.date);

    if (existing && existing.length >= 30) {
      alert("Today is fully booked ❌");
      return;
    }

    // ✅ TIME SLOT LOGIC (First Come First Serve)
    const baseHour = 10; // 10 AM start
    const slotNumber = existing ? existing.length : 0;

    const appointmentTime = new Date(form.date);
    appointmentTime.setHours(baseHour + slotNumber);
    appointmentTime.setMinutes(0);

    const formattedTime = appointmentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // ✅ Insert booking
    const { error } = await supabase.from("appointments").insert([
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        date: form.date,
      },
    ]);

    if (error) {
      alert("Error booking appointment");
      return;
    }

    // ✅ Send email to USER (IMPORTANT)
    await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email, // ✅ user email
        phone: form.phone,
        date: formattedTime,
      }),
    });

    alert(`Appointment booked at ${formattedTime}`);

    setForm({
      name: "",
      email: "",
      phone: "",
      date: null,
      message: ""
    });
  };

  return (
    <div className="py-16 px-6 flex justify-center">
      <Card className="w-full max-w-xl shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Book Appointment (10 AM – 4 PM, First Come First Serve)
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <Input
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <Input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <Input
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />

            <div>
              <p className="mb-2 text-sm font-medium">Select Date</p>

              {isClient && (
                <Calendar
                  mode="single"
                  selected={form.date}
                  onSelect={(date) => setForm({ ...form, date })}
                  className="rounded-md border"
                />
              )}
            </div>

            <Textarea
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            <Button className="w-full">
              Book Appointment
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}