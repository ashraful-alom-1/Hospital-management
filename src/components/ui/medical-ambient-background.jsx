"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function MedicalAmbientBackground({ variant = "subtle" }) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Base subtle movement configs
  const slowFloat = shouldReduceMotion ? {} : {
    y: ["0%", "5%", "0%"],
    x: ["0%", "2%", "0%"],
    transition: { duration: 20, repeat: Infinity, ease: "linear" }
  };
  
  const slowFloatReverse = shouldReduceMotion ? {} : {
    y: ["0%", "-5%", "0%"],
    x: ["0%", "-2%", "0%"],
    transition: { duration: 25, repeat: Infinity, ease: "linear" }
  };
  
  const slowPulse = shouldReduceMotion ? {} : {
    opacity: [0.3, 0.5, 0.3],
    scale: [1, 1.05, 1],
    transition: { duration: 15, repeat: Infinity, ease: "easeInOut" }
  };

  const getVariantContent = () => {
    switch (variant) {
      case "services":
      case "service":
        return (
          <>
            {/* Extremely faint grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(13,148,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(13,148,136,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <motion.div 
              animate={slowFloat}
              className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-[100px]"
            />
            <motion.div 
              animate={slowFloatReverse}
              className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-teal-500/10 rounded-full blur-[100px]"
            />
          </>
        );
      case "doctors":
      case "careers":
        return (
          <>
            <motion.div 
              animate={slowPulse}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]"
            />
            <motion.div 
              animate={slowFloatReverse}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"
            />
          </>
        );
      case "minimal":
      case "gallery":
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50" />
        );
      case "location":
      case "insurance":
        return (
          <>
            {/* Coordinate-like lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
            <motion.div 
              animate={slowPulse}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/5 rounded-full blur-[150px]"
            />
          </>
        );
      case "reviews":
      case "contact":
        return (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.08),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(13,148,136,0.05),transparent_50%)]" />
          </>
        );
      case "blog":
      case "news":
      case "story":
      case "legal":
        return (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.02)_1px,transparent_1px)] bg-[size:100px_100%] opacity-50" />
            <motion.div 
              animate={slowFloat}
              className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"
            />
          </>
        );
      case "auth":
        return (
          <>
            <motion.div 
              animate={slowPulse}
              className="absolute -top-10 -left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px]"
            />
            <motion.div 
              animate={slowFloat}
              className="absolute bottom-10 -right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px]"
            />
          </>
        );
      case "subtle":
      default:
        return (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.05),transparent_70%)]" />
            <motion.div 
              animate={slowFloatReverse}
              className="absolute top-0 right-1/4 w-1/3 h-1/3 bg-blue-500/5 rounded-full blur-[120px]"
            />
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-slate-50">
      {getVariantContent()}
    </div>
  );
}
