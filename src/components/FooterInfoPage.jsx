import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, CheckCircle2, FileText, Phone } from "lucide-react";
import CareerApplication from "@/components/CareerApplication";

function Hero({ page }) {
  return (
    <section className="bg-white">
      <div className="mx-auto grid min-h-[520px] max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-14">
        <div className="flex flex-col justify-center">
          <Link
            href="/"
            className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <p className={`mb-4 text-xs font-black uppercase tracking-[0.25em] ${page.accentText}`}>
            {page.eyebrow}
          </p>
          <h1 className="max-w-3xl text-4xl font-black uppercase leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {page.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            {page.description}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {page.highlights.map((item) => (
              <div key={item} className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
                <CheckCircle2 className={`mb-3 h-5 w-5 ${page.accentText}`} />
                <p className="text-sm font-black text-slate-900">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid min-h-[420px] grid-cols-5 grid-rows-5 gap-3">
          <div className="relative col-span-5 row-span-3 overflow-hidden rounded-lg shadow-xl sm:col-span-3 sm:row-span-5">
            <Image src={page.image} alt={page.title} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
          {page.gallery.slice(0, 2).map((item, index) => (
            <div
              key={item.title}
              className={`relative col-span-5 overflow-hidden rounded-lg shadow-sm sm:col-span-2 ${index === 0 ? "row-span-2" : "row-span-3"}`}
            >
              <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 18vw, 100vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-slate-950/70 px-4 py-3 text-white">
                <p className="text-xs font-black uppercase tracking-wider">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats({ page }) {
  return (
    <section className={`${page.band} text-white`}>
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {page.stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-white/10 p-5 ring-1 ring-white/15">
            <p className="text-3xl font-black">{stat.value}</p>
            <p className="mt-2 text-sm font-bold text-white/80">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StoryLayout({ page }) {
  return (
    <>
      <Stats page={page} />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className={`text-xs font-black uppercase tracking-[0.25em] ${page.accentText}`}>{page.subhead}</p>
          <h2 className="mt-4 text-3xl font-black uppercase text-slate-950 sm:text-4xl">{page.featureTitle}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {page.sections.map((section) => (
            <article key={section.title} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-xl font-black text-slate-950">{section.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{section.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function InsuranceLayout({ page }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
      <div className="space-y-4">
        {page.steps.map((step, index) => (
          <div key={step.title} className="flex gap-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg ${page.badge} text-sm font-black`}>
              {index + 1}
            </div>
            <div>
              <h2 className="font-black text-slate-950">{step.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
      <aside className="rounded-lg bg-slate-950 p-6 text-white">
        <FileText className="h-9 w-9 text-cyan-300" />
        <h2 className="mt-5 text-2xl font-black">Document Checklist</h2>
        <div className="mt-6 grid gap-3">
          {page.checklist.map((item) => (
            <p key={item} className="rounded-lg bg-white/10 px-4 py-3 text-sm font-bold text-white/85">{item}</p>
          ))}
        </div>
      </aside>
    </section>
  );
}

function CareersLayout({ page }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {page.roles.map((role) => (
          <article key={role.title} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className={`text-xs font-black uppercase tracking-wider ${page.accentText}`}>{role.type}</p>
            <h2 className="mt-3 text-xl font-black text-slate-950">{role.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{role.text}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {page.gallery.map((item) => (
          <div key={item.title} className="relative h-64 overflow-hidden rounded-lg">
            <Image src={item.image} alt={item.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-slate-950/75 p-4 text-white">
              <p className="text-sm font-black">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LegalLayout({ page }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
      <aside className="h-fit rounded-lg bg-white p-5 ring-1 ring-slate-200">
        <p className="text-xs font-black uppercase tracking-wider text-slate-400">Page Sections</p>
        <div className="mt-4 space-y-2">
          {page.sections.map((section) => (
            <a key={section.title} href={`#${section.title.toLowerCase().replaceAll(" ", "-")}`} className="block rounded-md px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600">
              {section.title}
            </a>
          ))}
        </div>
      </aside>
      <div className="space-y-4">
        {page.sections.map((section) => (
          <article id={section.title.toLowerCase().replaceAll(" ", "-")} key={section.title} className="rounded-lg bg-white p-6 ring-1 ring-slate-200">
            <h2 className="text-2xl font-black text-slate-950">{section.title}</h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">{section.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServiceLayout({ page }) {
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
        <div className={`rounded-lg p-6 text-white ${page.band}`}>
          <h2 className="text-2xl font-black">When should you visit?</h2>
          <div className="mt-6 space-y-3">
            {page.symptoms.map((symptom) => (
              <p key={symptom} className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3 text-sm font-bold">
                <CheckCircle2 className="h-4 w-4" />
                {symptom}
              </p>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {page.sections.map((section) => (
            <article key={section.title} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-black text-slate-950">{section.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{section.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {page.gallery.map((item) => (
            <div key={item.title} className="relative h-72 overflow-hidden rounded-lg bg-slate-200">
              <Image src={item.image} alt={item.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-slate-950/75 p-4 text-white">
                <p className="text-sm font-black">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function CTA({ page }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className={`flex flex-col gap-4 rounded-lg p-6 text-white sm:flex-row sm:items-center sm:justify-between ${page.band}`}>
        <div>
          <h2 className="text-2xl font-black">{page.ctaTitle}</h2>
          <p className="mt-2 text-sm text-white/80">{page.ctaText}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/#contact" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-slate-100">
            <Calendar className="h-4 w-4" />
            Book Visit
          </Link>
          <a href="tel:+918822141629" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-white/10">
            <Phone className="h-4 w-4" />
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}

export default function FooterInfoPage({ page }) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Hero page={page} />
      {page.template === "story" && <StoryLayout page={page} />}
      {page.template === "insurance" && <InsuranceLayout page={page} />}
      {page.template === "careers" && <CareersLayout page={page} />}
      {page.template === "careers" && <CareerApplication page={page} />}
      {page.template === "legal" && <LegalLayout page={page} />}
      {page.template === "service" && <ServiceLayout page={page} />}
      {page.template !== "careers" && <CTA page={page} />}
    </main>
  );
}
