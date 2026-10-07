"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export default function HorizonHeroSection({ onBookClick }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textsRef = useRef([]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Responsive setup
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 1200 : 2240;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0f1c, 0.004); // Slightly denser fog to smoothly fade distant grid/particles

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    camera.position.y = 10;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Post-processing for cinematic glow
    const renderScene = new RenderPass(scene, camera);
    renderScene.clearColor = new THREE.Color(0x000000);
    renderScene.clearAlpha = 0;

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      isMobile ? 0.3 : 0.4, // strength - subtle glow
      0.2, // radius - tighter glow
      0.4  // threshold - only glow bright elements
    );

    // Create a render target that preserves alpha channel
    const renderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType
      }
    );

    const composer = new EffectComposer(renderer, renderTarget);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Particles (Cosmic Medical Data)
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      let x = (Math.random() - 0.5) * 200;
      let y = (Math.random() - 0.5) * 200;
      let z = (Math.random() - 0.5) * 200;

      // Quiet zone for hero text readability: push particles away from center foreground
      if (Math.abs(x) < 40 && Math.abs(y) < 30 && z > -30) {
        if (Math.random() > 0.5) {
          x += Math.sign(x || 1) * (30 + Math.random() * 20); // push left/right
        } else {
          z -= 50 + Math.random() * 50; // push deeper into background
        }
      }

      vertices.push(x, y, z);

      // Healthcare colors: whites, teals, soft blues
      const rand = Math.random();
      if (rand > 0.8) color.setHex(0x38bdf8); // Sky blue
      else if (rand > 0.6) color.setHex(0x2dd4bf); // Teal
      else color.setHex(0xffffff); // White

      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.1 : 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Horizon Grid / Mountains (Healthcare grid)
    const gridGeometry = new THREE.PlaneGeometry(200, 200, 60, 60);

    // Add displacement to grid to look like a subtle terrain
    const pos = gridGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const z = Math.random() * 2; // subtle bumps
      pos.setZ(i, z);
    }
    gridGeometry.computeVertexNormals();

    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x1e3a8a, // Deep blue
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -20;
    scene.add(grid);

    // Animation variables
    let animationFrameId;
    let time = 0;

    const animate = () => {
      time += 0.001;

      // Gentle rotation
      particles.rotation.y = time * 0.5;
      particles.rotation.x = time * 0.2;

      // Animate grid to look like moving forward
      grid.position.z = (time * 10) % 2;

      composer.render();
      // renderer.render(scene, camera); // TEMPORARY DEBUGGING
      animationFrameId = requestAnimationFrame(animate);
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches) {
      animate();
    } else {
      composer.render(); // Just render once if reduced motion
      // renderer.render(scene, camera); // TEMPORARY DEBUGGING
    }

    // GSAP Scroll Animations
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%",
          scrub: 1,
          pin: true,
          onUpdate: () => {
            if (mediaQuery.matches) {
              composer.render();
              // renderer.render(scene, camera); // TEMPORARY DEBUGGING
            }
          }
        },
      });

      // Camera movement on scroll
      tl.to(camera.position, { z: -30, y: 0, ease: "power1.inOut" }, 0);
      tl.to(camera.rotation, { x: 0.1, ease: "power1.inOut" }, 0);
      tl.to(particles.rotation, { y: Math.PI / 4, ease: "power1.inOut" }, 0);
      tl.to(gridMaterial, { opacity: 0.3, ease: "power1.inOut" }, 0);

      // Section 1 out
      if (textsRef.current[0]) {
        tl.to(textsRef.current[0], { autoAlpha: 0, y: -50, duration: 1 }, 0);
      }

      // Section 2 in & out
      if (textsRef.current[1]) {
        tl.fromTo(textsRef.current[1], { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1 }, 0.5);
        tl.to(textsRef.current[1], { autoAlpha: 0, y: -50, duration: 1 }, 1.5);
      }

      // Section 3 in
      if (textsRef.current[2]) {
        tl.fromTo(textsRef.current[2], { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1 }, 2);
      }
    }, containerRef); // scope to container

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      ctx.revert();

      geometry.dispose();
      material.dispose();
      gridGeometry.dispose();
      gridMaterial.dispose();
      renderer.dispose();
      composer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#0a0f1c] overflow-hidden" style={{ zIndex: 10 }}>

      {/* Cinematic Healthcare Image Background */}
      <div className="absolute inset-0 z-0 bg-[#0a0f1c]">
        <img
          src="/ot-bg.jpg"
          alt="Advanced Healthcare Facility"
          className="absolute inset-0 w-full h-full object-cover opacity-80 object-center scale-105"
        />
        {/* Subtle dark gradient for text readability, but NOT covering the whole image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-transparent to-[#0a0f1c]/40 z-10" />
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10 pointer-events-none mix-blend-screen"
      />

      {/* Overlay gradient for text readability and depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1c]/50 via-transparent to-transparent z-10 pointer-events-none" />

      {/* Sections Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8 z-20">

        {/* Section 1: HORIZON -> Abhayapuri Care */}
        <div
          ref={(el) => (textsRef.current[0] = el)}
          className="absolute max-w-5xl w-full flex flex-col items-center"
        >
          <span className="inline-block bg-white/5 text-blue-300 px-4 py-1.5 rounded-full text-[10px] sm:text-[12px] font-black uppercase tracking-widest border border-blue-400/20 mb-6 backdrop-blur-md shadow-lg shadow-blue-500/10">
            BONGAIGAON'S PREMIER HEALTHCARE
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-[90px] font-black leading-[1.1] tracking-tight text-white mb-6">
            Your Health, <br /> <span className="text-blue-400 italic font-extrabold">Our Priority.</span>
          </h1>
          <p className="text-base sm:text-xl text-blue-100/80 max-w-2xl mx-auto font-medium mb-8">
            Experience world-class diagnostic facilities and expert medical consultations
            with our compassionate team.
          </p>
          <div className="mt-4">
            <Button
              onClick={onBookClick}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 rounded-2xl text-base sm:text-lg font-black shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] active:scale-95 border border-blue-500/30"
            >
              Book An Appointment Now
            </Button>
          </div>
        </div>

        {/* Section 2: COSMOS -> Connected Healthcare */}
        <div
          ref={(el) => (textsRef.current[1] = el)}
          className="absolute max-w-4xl w-full flex flex-col items-center invisible"
        >
          <span className="inline-block text-teal-400 font-bold uppercase tracking-widest mb-4">
            Healthcare, Connected
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
            Advanced Technology.<br />Human Touch.
          </h2>
          <p className="text-base sm:text-xl text-blue-100/80 max-w-2xl mx-auto font-medium">
            From 24/7 emergency care to NABL accredited labs, we bring the future of medicine to you today.
          </p>
        </div>

        {/* Section 3: INFINITY -> Smarter Healthcare */}
        <div
          ref={(el) => (textsRef.current[2] = el)}
          className="absolute max-w-4xl w-full flex flex-col items-center invisible"
        >
          <span className="inline-block text-blue-400 font-bold uppercase tracking-widest mb-4">
            Smarter Healthcare
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
            Better Care For<br />Everyone.
          </h2>
          <p className="text-base sm:text-xl text-blue-100/80 max-w-2xl mx-auto font-medium mb-8">
            Join thousands of satisfied patients who trust Abhayapuri Care for their wellness journey.
          </p>
          <div className="pointer-events-auto">
            <Button
              onClick={onBookClick}
              className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-6 rounded-2xl text-base sm:text-lg font-black shadow-[0_0_20px_rgba(13,148,136,0.4)] transition-all hover:shadow-[0_0_30px_rgba(13,148,136,0.6)] active:scale-95 border border-teal-500/30"
            >
              Start Your Journey
            </Button>
          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-70 animate-bounce pointer-events-none z-20">
        <span className="text-[10px] text-white/70 uppercase tracking-widest mb-2 font-bold">Scroll</span>
        <div className="w-[1.5px] h-10 bg-gradient-to-b from-white/80 to-transparent rounded-full" />
      </div>
    </div>
  );
}
