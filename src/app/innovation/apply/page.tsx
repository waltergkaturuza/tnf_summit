"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, ArrowRight, ArrowLeft, User, Rocket, CreditCard,
  Calendar, Info, ChevronDown, MapPin,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import WallpaperSurface from "@/components/WallpaperSurface";
import { getCountryNames } from "@/lib/countries";
import {
  INNOVATION_BASE_FEE_USD,
  INNOVATION_EXCURSION_FEE_USD,
  INNOVATION_EXCURSION_OPTIONS,
  calculateInnovationFeeUsd,
} from "@/lib/innovationFee";

const STEPS = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Your Venture", icon: Rocket },
  { id: 3, label: "Summit", icon: Calendar },
  { id: 4, label: "Payment", icon: CreditCard },
  { id: 5, label: "Confirm", icon: CheckCircle },
];

const salutations = ["Mr", "Mrs", "Ms", "Dr", "Prof", "Other"];
const genders = ["Male", "Female", "Non-binary", "Prefer not to say", "Other"];
const startupStages = ["Idea Stage", "Prototype / MVP", "Early Traction", "Growth Stage", "Scaling"];
const dietaryOptions = ["No special requirements", "Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-free", "Other"];
const paymentMethods = ["Bank Transfer", "Credit / Debit Card", "Mobile Money (EcoCash / InnBucks)"];
const countries = getCountryNames();

type FormData = {
  salutation: string; firstName: string; lastName: string; gender: string;
  dateOfBirth: string; nationality: string; email: string; confirmEmail: string;
  phone: string; whatsapp: string; country: string; city: string;
  organisation: string; startupName: string; startupStage: string;
  startupDescription: string; projectUrl: string;
  excursions: string[]; dietaryRequirements: string;
  requiresAccommodation: string; arrivalDate: string; departureDate: string; specialNeeds: string;
  paymentMethod: string; invoiceRequired: string; billingOrganisation: string;
  privacyConsent: boolean; photoConsent: boolean; newsletterOptIn: boolean; termsAccepted: boolean;
};

const initialForm: FormData = {
  salutation: "", firstName: "", lastName: "", gender: "", dateOfBirth: "", nationality: "",
  email: "", confirmEmail: "", phone: "", whatsapp: "", country: "", city: "",
  organisation: "", startupName: "", startupStage: "", startupDescription: "", projectUrl: "",
  excursions: [], dietaryRequirements: "", requiresAccommodation: "no",
  arrivalDate: "2026-09-21", departureDate: "2026-09-25", specialNeeds: "",
  paymentMethod: "", invoiceRequired: "yes", billingOrganisation: "",
  privacyConsent: false, photoConsent: false, newsletterOptIn: false, termsAccepted: false,
};

const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-theme-primary/70 focus:outline-none focus:border-[#C9921A]/60 transition-colors";
const selectClass = "w-full bg-[var(--bg-surface)] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9921A]/60 transition-colors appearance-none";
const labelClass = "block text-xs font-semibold uppercase tracking-wide mb-1.5 text-theme-primary";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}{required && <span className="text-[#C9921A] ml-1">*</span>}</label>
      {children}
    </div>
  );
}

function ToggleButton({ value, current, onChange, children }: { value: string; current: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={() => onChange(value)}
      className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border ${current === value ? "bg-[#C9921A] text-[#0A1628] border-[#C9921A] font-bold" : "glass border-white/10 hover:text-white hover:border-white/20 text-theme-primary"}`}>
      {children}
    </button>
  );
}

function CheckboxGroup({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => onChange(selected.includes(opt) ? selected.filter((x) => x !== opt) : [...selected, opt]);
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} onClick={() => toggle(opt)} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border transition-all hover:border-white/20 glass border-white/10">
          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selected.includes(opt) ? "bg-[#C9921A] border-[#C9921A]" : "border-white/20"}`}>
            {selected.includes(opt) && <CheckCircle className="w-3 h-3 text-[#0A1628]" />}
          </div>
          <div className="flex-1">
            <span className={`text-sm ${selected.includes(opt) ? "text-white font-medium" : "text-theme-primary"}`}>{opt}</span>
            <span className="block text-xs text-[#F5B730] mt-0.5">+ USD {INNOVATION_EXCURSION_FEE_USD}</span>
          </div>
        </label>
      ))}
    </div>
  );
}

export default function InnovationApplyPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [trackId, setTrackId] = useState("");
  const [iveriRedirecting, setIveriRedirecting] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState("");

  const set = <K extends keyof FormData>(field: K, value: FormData[K]) => setForm((prev) => ({ ...prev, [field]: value }));
  const fees = calculateInnovationFeeUsd(form.excursions);

  const canProceed = () => {
    if (step === 1) return form.salutation && form.firstName && form.lastName && form.email && form.email === form.confirmEmail && form.phone && form.country;
    if (step === 2) return form.startupName && form.startupStage && form.startupDescription.trim().length >= 50;
    if (step === 4) return !!form.paymentMethod;
    if (step === 5) return form.privacyConsent && form.termsAccepted;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length) { setStep(step + 1); return; }

    setSubmitting(true);
    setSubmitError("");
    setPaymentNotice("");
    try {
      const res = await fetch("/api/innovation/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          requiresAccommodation: form.requiresAccommodation === "yes",
          invoiceRequired: form.invoiceRequired === "yes",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; trackId?: string; feeAmount?: number };
      if (!res.ok) throw new Error(data.error || "Application failed");

      const ref = data.trackId;
      if (!ref) throw new Error("No application reference returned");
      setTrackId(ref);

      if (form.newsletterOptIn) {
        void fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, source: "innovation" }),
        }).catch(() => {});
      }

      const onlinePaymentMethods = ["Credit / Debit Card", "Bank Transfer", "Mobile Money (EcoCash / InnBucks)"];
      const feeAmount = data.feeAmount ?? fees.totalUsd;
      if (onlinePaymentMethods.includes(form.paymentMethod) && feeAmount > 0) {
        setIveriRedirecting(true);
        try {
          const payRes = await fetch("/api/payments/iveri/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ trackId: ref, email: form.email, category: "Youth Innovation Challenge" }),
          });
          const payData = (await payRes.json().catch(() => ({}))) as {
            redirectUrl?: string; action?: string; fields?: Record<string, string>; error?: string;
          };
          if (payRes.ok && payData.redirectUrl) {
            window.location.href = payData.redirectUrl;
            return;
          }
          if (payRes.ok && payData.action && payData.fields) {
            const formEl = document.createElement("form");
            formEl.method = "POST";
            formEl.action = payData.action;
            formEl.style.display = "none";
            for (const [name, value] of Object.entries(payData.fields)) {
              const input = document.createElement("input");
              input.type = "hidden";
              input.name = name;
              input.value = value;
              formEl.appendChild(input);
            }
            document.body.appendChild(formEl);
            formEl.submit();
            return;
          }
          setPaymentNotice(payData.error ? `Secure checkout could not start (${payData.error}). We will follow up by email.` : "Secure checkout is unavailable. We will follow up by email.");
        } catch {
          setPaymentNotice("Secure checkout could not be reached. We will follow up by email.");
        } finally {
          setIveriRedirecting(false);
        }
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed. Please try again or email info@tnfzim.com.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="Innovation Challenge Application" subtitle="Application received" />
        <WallpaperSurface fillViewport contentClassName="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 text-center flex-1 justify-center">
          {iveriRedirecting && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-primary)]/95 backdrop-blur-sm">
              <div className="w-12 h-12 border-2 border-[#C9921A] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-white font-semibold">Redirecting to secure payment…</p>
            </div>
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-3">Application Submitted!</h1>
            {paymentNotice && (
              <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90 text-left max-w-xl mx-auto">{paymentNotice}</div>
            )}
            <p className="text-theme-primary mb-6">Thank you, <strong className="text-white">{form.firstName}</strong>. Your Innovation Challenge application has been received.</p>
            <div className="glass-gold rounded-2xl p-6 mb-6 text-left">
              <p className="text-theme-primary text-sm mb-2">Your application reference</p>
              <p className="text-[#F5B730] font-mono font-bold text-2xl tracking-wide">{trackId}</p>
              <p className="text-white/80 text-xs mt-2">Total fee: USD {fees.totalUsd} · In-person attendance at Victoria Falls</p>
            </div>
            <Link href={`/track-status?ref=${encodeURIComponent(trackId)}`} className="text-[#C9921A] text-sm font-semibold hover:underline">Track application status</Link>
          </motion.div>
        </WallpaperSurface>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader
        title="TNF Innovation Challenge 2026"
        subtitle="Separate application for youth innovators — USD 200 application fee + USD 20 per excursion. In-person attendance only."
      />
      <WallpaperSurface fillViewport contentClassName="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 flex-1">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto gap-2 pb-2">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const active = step === s.id;
            const done = step > s.id;
            return (
              <div key={s.id} className={`flex items-center gap-2 flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${active ? "bg-[#C9921A]/15 text-[#F5B730] border border-[#C9921A]/30" : done ? "text-emerald-400" : "text-theme-primary"}`}>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl border border-white/10 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

              {step === 1 && (
                <div className="space-y-5">
                  <div className="mb-2">
                    <h2 className="text-xl font-black text-white">Personal Details</h2>
                    <p className="text-sm mt-1 text-theme-primary">Open to African youth entrepreneurs under 35. All applicants attend in person at Victoria Falls.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Salutation" required>
                      <div className="relative">
                        <select value={form.salutation} onChange={(e) => set("salutation", e.target.value)} className={selectClass} required>
                          <option value="">Select</option>
                          {salutations.map((s) => <option key={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary pointer-events-none" />
                      </div>
                    </Field>
                    <Field label="Gender">
                      <div className="relative">
                        <select value={form.gender} onChange={(e) => set("gender", e.target.value)} className={selectClass}>
                          <option value="">Prefer not to say</option>
                          {genders.map((g) => <option key={g}>{g}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary pointer-events-none" />
                      </div>
                    </Field>
                    <Field label="First Name" required><input type="text" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className={inputClass} required /></Field>
                    <Field label="Last Name" required><input type="text" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} className={inputClass} required /></Field>
                    <Field label="Date of Birth"><input type="date" value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} className={inputClass} /></Field>
                    <Field label="Nationality"><input type="text" value={form.nationality} onChange={(e) => set("nationality", e.target.value)} className={inputClass} placeholder="e.g. Zimbabwean" /></Field>
                    <Field label="Email" required><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} required /></Field>
                    <Field label="Confirm Email" required><input type="email" value={form.confirmEmail} onChange={(e) => set("confirmEmail", e.target.value)} className={inputClass} required /></Field>
                    <Field label="Phone / WhatsApp" required><input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} required /></Field>
                    <Field label="WhatsApp (if different)"><input type="tel" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={inputClass} /></Field>
                    <Field label="Country" required>
                      <div className="relative">
                        <select value={form.country} onChange={(e) => set("country", e.target.value)} className={selectClass} required>
                          <option value="">Select country</option>
                          {countries.map((c) => <option key={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary pointer-events-none" />
                      </div>
                    </Field>
                    <Field label="City"><input type="text" value={form.city} onChange={(e) => set("city", e.target.value)} className={inputClass} /></Field>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="mb-2">
                    <h2 className="text-xl font-black text-white">Your Venture</h2>
                    <p className="text-sm mt-1 text-theme-primary">Tell us about the digital or green economy solution you will pitch to the investor panel.</p>
                  </div>
                  <Field label="Organisation / Hub (optional)"><input type="text" value={form.organisation} onChange={(e) => set("organisation", e.target.value)} className={inputClass} placeholder="Incubator, university, or company if applicable" /></Field>
                  <Field label="Start-up / Project Name" required><input type="text" value={form.startupName} onChange={(e) => set("startupName", e.target.value)} className={inputClass} required /></Field>
                  <Field label="Stage of Development" required>
                    <div className="relative">
                      <select value={form.startupStage} onChange={(e) => set("startupStage", e.target.value)} className={selectClass} required>
                        <option value="">Select stage</option>
                        {startupStages.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary pointer-events-none" />
                    </div>
                  </Field>
                  <Field label="Solution Description" required>
                    <textarea rows={6} value={form.startupDescription} onChange={(e) => set("startupDescription", e.target.value)} className={inputClass + " resize-y"} placeholder="Describe the problem, your solution, target market, and impact (min. 50 characters)..." required />
                    <p className="text-xs mt-1 text-theme-primary">{form.startupDescription.trim().length} characters (minimum 50)</p>
                  </Field>
                  <Field label="Project website / demo link (optional)"><input type="url" value={form.projectUrl} onChange={(e) => set("projectUrl", e.target.value)} className={inputClass} placeholder="https://..." /></Field>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div className="mb-2">
                    <h2 className="text-xl font-black text-white">Summit Preferences</h2>
                    <p className="text-sm mt-1 text-theme-primary">Innovation Challenge applicants attend in person. Select optional excursions — each adds USD {INNOVATION_EXCURSION_FEE_USD} to your total.</p>
                  </div>
                  <div className="glass rounded-xl p-4 flex items-start gap-3 border border-[#10B981]/30">
                    <MapPin className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-theme-primary"><strong className="text-white">In-person only</strong> — Victoria Falls, 21–25 September 2026. Hybrid / virtual attendance is not available for Innovation Challenge applicants.</p>
                  </div>
                  <Field label={`Excursions (USD ${INNOVATION_EXCURSION_FEE_USD} each — Fri 25 Sep)`}>
                    <CheckboxGroup options={[...INNOVATION_EXCURSION_OPTIONS]} selected={form.excursions} onChange={(v) => set("excursions", v)} />
                  </Field>
                  <div className="glass-gold rounded-xl p-4">
                    <div className="flex justify-between text-sm text-theme-primary"><span>Application fee</span><span>USD {INNOVATION_BASE_FEE_USD}</span></div>
                    <div className="flex justify-between text-sm text-theme-primary mt-1"><span>Excursions ({fees.excursionCount} × USD {INNOVATION_EXCURSION_FEE_USD})</span><span>USD {fees.excursionFeeUsd}</span></div>
                    <div className="flex justify-between text-lg font-black text-[#F5B730] mt-2 pt-2 border-t border-[#C9921A]/20"><span>Total</span><span>USD {fees.totalUsd}</span></div>
                  </div>
                  <Field label="Dietary Requirements">
                    <div className="relative">
                      <select value={form.dietaryRequirements} onChange={(e) => set("dietaryRequirements", e.target.value)} className={selectClass}>
                        <option value="">No special requirements</option>
                        {dietaryOptions.map((d) => <option key={d}>{d}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary pointer-events-none" />
                    </div>
                  </Field>
                  <Field label="Need accommodation assistance at Elephant Hills?">
                    <div className="flex gap-3">
                      <ToggleButton value="yes" current={form.requiresAccommodation} onChange={(v) => set("requiresAccommodation", v)}>Yes</ToggleButton>
                      <ToggleButton value="no" current={form.requiresAccommodation} onChange={(v) => set("requiresAccommodation", v)}>No, self-arranged</ToggleButton>
                    </div>
                  </Field>
                  {form.requiresAccommodation === "yes" && (
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Arrival"><input type="date" value={form.arrivalDate} onChange={(e) => set("arrivalDate", e.target.value)} className={inputClass} /></Field>
                      <Field label="Departure"><input type="date" value={form.departureDate} onChange={(e) => set("departureDate", e.target.value)} className={inputClass} /></Field>
                    </div>
                  )}
                  <Field label="Special access / mobility needs"><textarea rows={2} value={form.specialNeeds} onChange={(e) => set("specialNeeds", e.target.value)} className={inputClass + " resize-none"} /></Field>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <div className="mb-2">
                    <h2 className="text-xl font-black text-white">Payment</h2>
                    <p className="text-sm mt-1 text-theme-primary">All payment methods are completed on our secure iVeri hosted page after you submit.</p>
                  </div>
                  <div className="glass-gold rounded-2xl p-5">
                    <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-3">Fee Summary</h3>
                    <div className="space-y-1 text-sm text-theme-primary">
                      <div className="flex justify-between"><span>Application fee</span><span>USD {fees.baseFeeUsd}</span></div>
                      {fees.excursionCount > 0 && <div className="flex justify-between"><span>Excursions ({fees.excursionCount})</span><span>USD {fees.excursionFeeUsd}</span></div>}
                    </div>
                    <div className="text-[#F5B730] text-3xl font-black mt-3">USD {fees.totalUsd}</div>
                  </div>
                  <Field label="Payment Method" required>
                    <div className="space-y-2">
                      {paymentMethods.map((pm) => (
                        <label key={pm} className={`flex items-center gap-3 cursor-pointer p-3.5 rounded-xl border transition-all ${form.paymentMethod === pm ? "border-[#C9921A] bg-[#C9921A]/10" : "glass border-white/10 hover:border-white/20"}`}>
                          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${form.paymentMethod === pm ? "border-[#C9921A] bg-[#C9921A]" : "border-slate-500"}`} />
                          <input type="radio" name="payment" value={pm} checked={form.paymentMethod === pm} onChange={(e) => set("paymentMethod", e.target.value)} className="hidden" />
                          <span className={`text-sm font-medium ${form.paymentMethod === pm ? "text-white" : "text-theme-primary"}`}>{pm}</span>
                        </label>
                      ))}
                    </div>
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Invoice Required?">
                      <div className="flex gap-2">
                        <ToggleButton value="yes" current={form.invoiceRequired} onChange={(v) => set("invoiceRequired", v)}>Yes</ToggleButton>
                        <ToggleButton value="no" current={form.invoiceRequired} onChange={(v) => set("invoiceRequired", v)}>No</ToggleButton>
                      </div>
                    </Field>
                    <Field label="Billing Organisation"><input type="text" value={form.billingOrganisation} onChange={(e) => set("billingOrganisation", e.target.value)} className={inputClass} placeholder="If different from your org" /></Field>
                  </div>
                  <div className="glass rounded-xl p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#C9921A] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-theme-primary">After submitting you will be redirected to iVeri where you can pay by card, bank transfer, or mobile money (EcoCash / InnBucks).</p>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-5">
                  <div className="mb-2">
                    <h2 className="text-xl font-black text-white">Review & Submit</h2>
                    <p className="text-sm mt-1 text-theme-primary">Confirm your details before submitting your Innovation Challenge application.</p>
                  </div>
                  <div className="glass rounded-xl p-5 space-y-2 text-sm">
                    {[
                      ["Name", `${form.salutation} ${form.firstName} ${form.lastName}`.trim()],
                      ["Email", form.email],
                      ["Country", form.country],
                      ["Start-up", form.startupName],
                      ["Stage", form.startupStage],
                      ["Excursions", form.excursions.length ? form.excursions.join("; ") : "None"],
                      ["Total fee", `USD ${fees.totalUsd}`],
                      ["Payment", form.paymentMethod],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 py-1 border-b border-white/5 last:border-0">
                        <span className="text-theme-primary">{k}</span>
                        <span className="text-white text-right font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {[
                      { key: "privacyConsent" as const, required: true, label: "I consent to the processing of my personal data in accordance with the Privacy Policy." },
                      { key: "photoConsent" as const, required: false, label: "I consent to photography and media coverage during the Summit." },
                      { key: "newsletterOptIn" as const, required: false, label: "Keep me updated on Summit news and Innovation Challenge announcements." },
                      { key: "termsAccepted" as const, required: true, label: <>I agree to the <a href="/terms" target="_blank" className="text-[#C9921A] underline">Terms of Use</a> and understand payment is required to confirm my application.</> },
                    ].map(({ key, required, label }) => (
                      <label key={key} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-white/5">
                        <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} className="mt-1 accent-[#C9921A]" required={required} />
                        <span className="text-sm text-theme-primary">{label}{required && <span className="text-[#C9921A]"> *</span>}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {submitError && <p className="text-red-400 text-sm mt-4">{submitError}</p>}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-theme-primary hover:text-white text-sm font-semibold">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}
            <button type="submit" disabled={!canProceed() || submitting}
              className="btn-gold px-8 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? "Submitting…" : step === STEPS.length ? "Submit Application" : "Continue"}
              {step < STEPS.length && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-theme-primary mt-6">
          Registering as a full delegate instead? <Link href="/registration" className="text-[#C9921A] font-semibold hover:underline">Go to delegate registration</Link>
        </p>
      </WallpaperSurface>
    </div>
  );
}
