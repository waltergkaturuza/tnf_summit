"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, ArrowRight, ArrowLeft, User, Mail, Phone,
  Building, Globe, Users, CreditCard, Calendar, Info,
  Mic, Heart, Camera, Bell, Rocket, Handshake, Briefcase,
  FileText, ChevronDown, MapPin,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { registrationFees } from "@/lib/data";
import { getRegistrationFeeUsd, REGISTRATION_FEES_USD } from "@/lib/registrationFee";
import { subscribeEmail } from "@/lib/db";
import { getCountryNames } from "@/lib/countries";

const STEPS = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Professional", icon: Briefcase },
  { id: 3, label: "Attendance", icon: Calendar },
  { id: 4, label: "Preferences", icon: Heart },
  { id: 5, label: "Extras", icon: Rocket },
  { id: 6, label: "Payment", icon: CreditCard },
  { id: 7, label: "Confirm", icon: CheckCircle },
];

const salutations = ["Mr", "Mrs", "Ms", "Dr", "Prof", "Hon", "H.E.", "Ambassador", "Rev", "Eng"];
const genders = ["Male", "Female", "Non-binary", "Prefer not to say"];
const sectors = ["Government / Public Sector", "Private Sector / Corporate", "International Organisation / DFI", "Civil Society / NGO", "Academic / Research", "Media / Press", "Youth-Led Enterprise / MSME", "Other"];
const dietaryOptions = ["No special requirements", "Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-free", "Dairy-free", "Other (specify in notes)"];
const roomTypes = ["Single Room", "Double Room (single occupancy)", "Twin Room (sharing)", "Suite"];
const paymentMethods = ["Bank Transfer (Invoice)", "Credit / Debit Card", "Mobile Money (EcoCash / InnBucks)", "PayPal", "Institutional Purchase Order"];
const sessionOptions = [
  "Day 1 — Inclusive Growth, Smart Investment & Policy Coherence (Mon 21 Sep)",
  "Day 2 — Digitalisation, Platform Economy & Financial Innovation (Tue 22 Sep)",
  "Day 3 — Official Opening + Climate Change & Green Jobs (Wed 23 Sep)",
  "Day 4 — Youth, Women, Skills & Future of Work (Thu 24 Sep)",
  "Excursions Day — Victoria Falls Experience (Fri 25 Sep)",
];
const excursions = ["Victoria Falls Rainforest Walk (UNESCO)", "Zambezi River Morning Boat Cruise", "Morning Game Drive — Zambezi National Park", "No excursion"];
const investmentAreas = ["Agriculture / Agro-processing", "Renewable Energy / Clean Tech", "Mining & Mineral Processing", "Manufacturing & Industrialisation", "FinTech / Digital Finance", "Infrastructure", "Tourism / Eco-tourism", "Healthcare", "Education / TVET", "Other"];
const countries = getCountryNames();

type FormData = {
  salutation: string; firstName: string; lastName: string; gender: string;
  dateOfBirth: string; nationality: string; passportNumber: string;
  organisation: string; department: string; jobTitle: string; sector: string; orgWebsite: string;
  email: string; confirmEmail: string; phone: string; whatsapp: string; country: string; city: string;
  category: string; attendanceMode: string; daysAttending: string[];
  requiresAccommodation: string; arrivalDate: string; departureDate: string;
  roomType: string; airportTransfer: string; specialNeeds: string;
  dietaryRequirements: string; sessionInterests: string[]; excursionPreference: string;
  applyInnovation: string; startupName: string; startupStage: string; startupDescription: string;
  bilateralMeetings: string; investmentInterests: string[];
  isMedia: string; mediaOrganisation: string; mediaType: string;
  paymentMethod: string; invoiceRequired: string; billingOrganisation: string;
  privacyConsent: boolean; photoConsent: boolean; newsletterOptIn: boolean; termsAccepted: boolean;
};

const initialForm: FormData = {
  salutation: "", firstName: "", lastName: "", gender: "", dateOfBirth: "", nationality: "", passportNumber: "",
  organisation: "", department: "", jobTitle: "", sector: "", orgWebsite: "",
  email: "", confirmEmail: "", phone: "", whatsapp: "", country: "", city: "",
  category: "", attendanceMode: "in-person", daysAttending: [],
  requiresAccommodation: "yes", arrivalDate: "2026-09-21", departureDate: "2026-09-25",
  roomType: "", airportTransfer: "yes", specialNeeds: "",
  dietaryRequirements: "", sessionInterests: [], excursionPreference: "",
  applyInnovation: "no", startupName: "", startupStage: "", startupDescription: "",
  bilateralMeetings: "yes", investmentInterests: [],
  isMedia: "no", mediaOrganisation: "", mediaType: "",
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
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border ${current === value ? "bg-[#C9921A] text-[#0A1628] border-[#C9921A] font-bold" : "glass border-white/10 hover:text-white hover:border-white/20 text-theme-primary"}`}
    >
      {children}
    </button>
  );
}

function CheckboxGroup({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => onChange(selected.includes(opt) ? selected.filter(x => x !== opt) : [...selected, opt]);
  return (
    <div className="space-y-2">
      {options.map(opt => (
        <label
          key={opt}
          onClick={() => toggle(opt)}
          className="flex items-start gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
        >
          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${selected.includes(opt) ? "bg-[#C9921A] border-[#C9921A]" : "border-white/20 group-hover:border-[#C9921A]/50"}`}>
            {selected.includes(opt) && <CheckCircle className="w-3 h-3 text-[#0A1628]" />}
          </div>
          <span className={`text-sm leading-snug ${selected.includes(opt) ? "text-white" : "text-theme-primary"}`}>{opt}</span>
        </label>
      ))}
    </div>
  );
}

export default function RegistrationPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [regId, setRegId] = useState(`REG-${String(Math.floor(1000 + Math.random() * 9000))}`);
  const [iveriRedirecting, setIveriRedirecting] = useState(false);
  const [cardPaymentNotice, setCardPaymentNotice] = useState("");

  const set = (field: keyof FormData, value: FormData[keyof FormData]) => setForm(prev => ({ ...prev, [field]: value }));

  const isEarlyBird = true; // before 30 June 2026
  const feeAmount = form.category ? (getRegistrationFeeUsd(form.category, isEarlyBird) ?? 0) : 0;
  const selectedFeeRow = form.category ? REGISTRATION_FEES_USD[form.category] : undefined;

  const canProceed = () => {
    if (step === 1) return form.firstName && form.lastName && form.email && form.phone && form.country && form.salutation;
    if (step === 2) return form.organisation && form.jobTitle && form.sector;
    if (step === 3) return form.category && form.attendanceMode;
    if (step === 6) return form.paymentMethod;
    if (step === 7) return form.privacyConsent && form.termsAccepted;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length) { setStep(step + 1); return; }

    // Final submission → server API (service role) so RLS does not block public registration
    setSubmitting(true);
    setSubmitError("");
    setCardPaymentNotice("");
    try {
      const regRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "pending",
          adminNotes: "",
          salutation: form.salutation,
          firstName: form.firstName,
          lastName: form.lastName,
          gender: form.gender,
          dateOfBirth: form.dateOfBirth,
          nationality: form.nationality,
          passportNumber: form.passportNumber,
          organisation: form.organisation,
          department: form.department,
          jobTitle: form.jobTitle,
          sector: form.sector,
          organisationWebsite: form.orgWebsite,
          email: form.email,
          phone: form.phone,
          whatsapp: form.whatsapp,
          country: form.country,
          city: form.city,
          category: form.category,
          attendanceMode: form.attendanceMode,
          daysAttending: form.daysAttending,
          requiresAccommodation: form.requiresAccommodation === "yes",
          arrivalDate: form.arrivalDate,
          departureDate: form.departureDate,
          roomType: form.roomType,
          airportTransfer: form.airportTransfer === "yes",
          specialNeeds: form.specialNeeds,
          dietaryRequirements: form.dietaryRequirements,
          sessionInterests: form.sessionInterests,
          excursionPreference: form.excursionPreference,
          applyInnovation: form.applyInnovation === "yes",
          startupName: form.startupName,
          startupStage: form.startupStage,
          startupDescription: form.startupDescription,
          bilateralMeetings: form.bilateralMeetings === "yes",
          investmentInterests: form.investmentInterests,
          isMedia: form.isMedia === "yes",
          mediaOrganisation: form.mediaOrganisation,
          mediaType: form.mediaType,
          paymentMethod: form.paymentMethod,
          invoiceRequired: form.invoiceRequired === "yes",
          billingOrganisation: form.billingOrganisation,
          feeAmount,
          paymentStatus: "unpaid",
          privacyConsent: form.privacyConsent,
          photoConsent: form.photoConsent,
          newsletterOptIn: form.newsletterOptIn,
          termsAccepted: form.termsAccepted,
        }),
      });
      const regJson = (await regRes.json().catch(() => ({}))) as { error?: string; trackId?: string };
      if (!regRes.ok) {
        throw new Error(regJson.error || "Registration failed");
      }
      const trackId = regJson.trackId;
      if (!trackId) throw new Error("No registration reference returned");
      setRegId(trackId);

      if (form.paymentMethod === "Credit / Debit Card" && feeAmount > 0) {
        setIveriRedirecting(true);
        try {
          const res = await fetch("/api/payments/iveri/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              trackId,
              email: form.email,
              category: form.category,
              isEarlyBird,
            }),
          });
          const data = (await res.json().catch(() => ({}))) as {
            action?: string;
            fields?: Record<string, string>;
            error?: string;
          };
          if (res.ok && data.action && data.fields) {
            const formEl = document.createElement("form");
            formEl.method = "POST";
            formEl.action = data.action;
            formEl.style.display = "none";
            for (const [name, value] of Object.entries(data.fields)) {
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
          setCardPaymentNotice(
            data.error
              ? `Card checkout could not start (${data.error}). Use bank transfer or another method — we will invoice you by email.`
              : "Card checkout is unavailable. Use bank transfer or another method — we will invoice you by email."
          );
        } catch {
          setCardPaymentNotice(
            "Card checkout could not be reached. Use bank transfer or another method — we will invoice you by email."
          );
        } finally {
          setIveriRedirecting(false);
        }
      }

      // Auto-subscribe if opted in
      if (form.newsletterOptIn) {
        await subscribeEmail(form.email, "registration").catch(() => {});
      }
      setSubmitted(true);
    } catch (err: unknown) {
      console.error(err);
      setSubmitError("Submission failed. Please check your connection and try again, or email info@tnfzim.com.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] pt-20 flex items-center justify-center px-4 relative">
        {iveriRedirecting && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-primary)]/95 backdrop-blur-sm">
            <div className="w-12 h-12 border-2 border-[#C9921A] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white font-semibold">Redirecting to secure card payment…</p>
            <p className="text-sm text-theme-primary mt-2 max-w-sm text-center">You are being sent to our payment partner (iVeri). Do not close this window.</p>
          </div>
        )}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-3xl w-full">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-4xl font-black text-white mb-3">Registration Submitted!</h2>
          {cardPaymentNotice && (
            <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90 text-left max-w-xl mx-auto">
              {cardPaymentNotice}
            </div>
          )}
          <p className="text-lg mb-2 text-theme-primary">Welcome to the Zimbabwe TNF Global Summit 2026, <strong className="text-[#F5B730]">{form.salutation} {form.firstName} {form.lastName}</strong></p>
          <p className="mb-8 text-theme-primary">A confirmation and invoice will be sent to <strong className="text-white">{form.email}</strong> within 24 hours.</p>
          <div className="glass-gold rounded-2xl p-6 mb-6 text-left space-y-3">
            <h3 className="text-[#F5B730] font-bold text-lg mb-4">Registration Summary</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-theme-primary">Registration ID:</span><div className="text-white font-bold text-lg tracking-wide">{regId}</div></div>
              <div><span className="text-theme-primary">Status:</span><div className="text-amber-400 font-bold">Pending Confirmation</div></div>
              <div><span className="text-theme-primary">Name:</span><div className="text-white">{form.salutation} {form.firstName} {form.lastName}</div></div>
              <div><span className="text-theme-primary">Organisation:</span><div className="text-white">{form.organisation}</div></div>
              <div><span className="text-theme-primary">Category:</span><div className="text-white">{form.category}</div></div>
              <div><span className="text-theme-primary">Attendance:</span><div className="text-white capitalize">{form.attendanceMode}</div></div>
              <div><span className="text-theme-primary">Country:</span><div className="text-white">{form.country}</div></div>
              <div><span className="text-theme-primary">Payment Method:</span><div className="text-white">{form.paymentMethod}</div></div>
            </div>
            {feeAmount > 0 && (
              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="text-theme-primary">Registration fee (flat rate):</span>
                <span className="text-[#F5B730] text-2xl font-black">USD {feeAmount}</span>
              </div>
            )}
          </div>
          <div className="glass rounded-xl p-4 text-sm text-theme-primary mb-6">
            <strong className="text-white">Next steps:</strong> You will receive an invoice by email. Payment is due within 14 days. Your badge will be ready for collection at Delegate Registration on <strong className="text-white">21 September 2026</strong>.
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/" className="btn-gold px-8 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2">Back to Home <ArrowRight className="w-4 h-4" /></a>
            <a href="/program" className="btn-outline-gold px-8 py-3 rounded-xl text-sm font-semibold">View Programme</a>
          </div>
          <p className="text-xs mt-6 text-theme-primary">Questions? Contact <a href="mailto:info@tnfzim.com" className="text-[#C9921A]">info@tnfzim.com</a> · +263 242 783 030</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20">
      {/* Header */}
      <section className="py-12 hero-bg pattern-overlay relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-primary)]" />
        <div className="relative z-10 text-center px-4">
          <span className="text-[#C9921A] text-sm font-bold uppercase tracking-widest">Secure Your Seat</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-2 mb-2">
            Delegate <span className="gradient-text">Registration</span>
          </h1>
          <p className="text-theme-primary">Zimbabwe TNF Global Summit 2026 · Victoria Falls, Zimbabwe · Flat registration fee <strong className="text-white">USD 1,500</strong> per delegate</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* Fee summary bar */}
        {form.category && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-gold rounded-xl px-5 py-3 mb-6 flex items-center justify-between">
            <div className="text-sm text-theme-primary">{form.category}</div>
            <div className="text-[#F5B730] font-black text-lg">USD {feeAmount} <span className="text-xs font-normal text-theme-primary">flat fee</span></div>
          </motion.div>
        )}

        {/* Step indicators — full width, no scroll */}
        <div className="mb-8">
          <div className="flex items-center w-full">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="flex items-center flex-1 min-w-0">
                  {/* Step button */}
                  <button
                    type="button"
                    onClick={() => done && setStep(s.id)}
                    className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 px-2 py-2.5 rounded-xl text-xs font-bold transition-all w-full justify-center
                      ${active ? "bg-[#C9921A] text-[#0A1628] shadow-lg shadow-[#C9921A]/20"
                        : done ? "bg-[#C9921A]/15 text-[#F5B730] cursor-pointer hover:bg-[#C9921A]/25"
                        : "glass text-theme-primary"}`}
                  >
                    {done
                      ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      : <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
                    <span className="hidden sm:inline truncate">{t.registration.steps[i]?.label ?? s.label}</span>
                    <span className="sm:hidden text-[9px] font-bold">{s.id}</span>
                  </button>
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className={`h-px flex-shrink-0 w-2 sm:w-3 transition-colors ${step > s.id ? "bg-[#C9921A]" : "bg-white/10"}`} />
                  )}
                </div>
              );
            })}
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#C9921A] to-[#F5B730] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-theme-primary">Step {step} of {STEPS.length}</span>
            <span className="text-[10px] text-theme-primary">{Math.round(((step - 1) / (STEPS.length - 1)) * 100)}% complete</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="glass rounded-2xl p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>

                {/* ── STEP 1: Personal ── */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div className="mb-2">
                      <h2 className="text-xl font-black text-white">Personal Information</h2>
                      <p className="text-sm mt-1 text-theme-primary">Enter your personal details as they should appear on your delegate badge and certificate.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Field label="Salutation" required>
                        <div className="relative">
                          <select required value={form.salutation} onChange={e => set("salutation", e.target.value)} className={selectClass}>
                            <option value="">Select</option>
                            {salutations.map(s => <option key={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary pointer-events-none" />
                        </div>
                      </Field>
                      <Field label="First Name" required>
                        <input required type="text" placeholder="Given name" value={form.firstName} onChange={e => set("firstName", e.target.value)} className={inputClass} />
                      </Field>
                      <Field label="Last Name" required>
                        <input required type="text" placeholder="Family name" value={form.lastName} onChange={e => set("lastName", e.target.value)} className={inputClass} />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Gender">
                        <div className="relative">
                          <select value={form.gender} onChange={e => set("gender", e.target.value)} className={selectClass}>
                            <option value="">Select</option>
                            {genders.map(g => <option key={g}>{g}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary pointer-events-none" />
                        </div>
                      </Field>
                      <Field label="Date of Birth">
                        <input type="date" value={form.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)} className={inputClass} />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Nationality" required>
                        <div className="relative">
                          <select required value={form.nationality} onChange={e => set("nationality", e.target.value)} className={selectClass}>
                            <option value="">{t.registration.selectCountry}</option>
                            {countries.map(c => <option key={c}>{c}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary pointer-events-none" />
                        </div>
                      </Field>
                      <Field label="Passport / ID Number">
                        <input type="text" placeholder="Optional — for accreditation" value={form.passportNumber} onChange={e => set("passportNumber", e.target.value)} className={inputClass} />
                      </Field>
                    </div>
                    <div className="divider-gold" />
                    <div>
                      <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2"><Mail className="w-4 h-4 text-[#C9921A]" /> Contact Details</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Email Address" required>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary" />
                              <input required type="email" placeholder="your@email.com" value={form.email} onChange={e => set("email", e.target.value)} className={inputClass + " pl-10"} />
                            </div>
                          </Field>
                          <Field label="Confirm Email" required>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary" />
                              <input required type="email" placeholder="Confirm email" value={form.confirmEmail} onChange={e => set("confirmEmail", e.target.value)} className={inputClass + " pl-10"} />
                            </div>
                          </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Phone Number (with country code)" required>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary" />
                              <input required type="tel" placeholder="+263 77 000 0000" value={form.phone} onChange={e => set("phone", e.target.value)} className={inputClass + " pl-10"} />
                            </div>
                          </Field>
                          <Field label="WhatsApp Number">
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary" />
                              <input type="tel" placeholder="If different from above" value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} className={inputClass + " pl-10"} />
                            </div>
                          </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Country of Residence" required>
                            <div className="relative">
                              <select required value={form.country} onChange={e => set("country", e.target.value)} className={selectClass}>
                                <option value="">{t.registration.selectCountry}</option>
                                {countries.map(c => <option key={c}>{c}</option>)}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary pointer-events-none" />
                            </div>
                          </Field>
                          <Field label="City / Town" required>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary" />
                              <input required type="text" placeholder="City" value={form.city} onChange={e => set("city", e.target.value)} className={inputClass + " pl-10"} />
                            </div>
                          </Field>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Professional ── */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div className="mb-2">
                      <h2 className="text-xl font-black text-white">Professional Details</h2>
                      <p className="text-sm mt-1 text-theme-primary">Your professional information as it will appear in the Summit directory and on your badge.</p>
                    </div>
                    <Field label="Organisation / Institution" required>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary" />
                        <input required type="text" placeholder="Ministry / Company / NGO / University name" value={form.organisation} onChange={e => set("organisation", e.target.value)} className={inputClass + " pl-10"} />
                      </div>
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Department / Unit">
                        <input type="text" placeholder="e.g. Investment Promotion Division" value={form.department} onChange={e => set("department", e.target.value)} className={inputClass} />
                      </Field>
                      <Field label="Job Title / Position" required>
                        <input required type="text" placeholder="e.g. Minister / Director / CEO" value={form.jobTitle} onChange={e => set("jobTitle", e.target.value)} className={inputClass} />
                      </Field>
                    </div>
                    <Field label="Sector / Type of Organisation" required>
                      <div className="relative">
                        <select required value={form.sector} onChange={e => set("sector", e.target.value)} className={selectClass}>
                          <option value="">Select sector</option>
                          {sectors.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary pointer-events-none" />
                      </div>
                    </Field>
                    <Field label="Organisation Website">
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary" />
                        <input type="url" placeholder="https://yourorganisation.org" value={form.orgWebsite} onChange={e => set("orgWebsite", e.target.value)} className={inputClass + " pl-10"} />
                      </div>
                    </Field>
                    <div className="glass rounded-xl p-4 flex items-start gap-3">
                      <Info className="w-5 h-5 text-[#C9921A] flex-shrink-0 mt-0.5" />
                      <p className="text-xs leading-relaxed text-theme-primary">
                        Your professional details will be included in the official delegate directory distributed to all Summit participants, unless you opt out. You can request exclusion by emailing <a href="mailto:info@tnfzim.com" className="text-[#C9921A]">info@tnfzim.com</a>.
                      </p>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Attendance ── */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="mb-2">
                      <h2 className="text-xl font-black text-white">Attendance & Category</h2>
                      <p className="text-sm mt-1 text-theme-primary">Select your delegate category for reporting and networking. The registration fee is a flat USD 1,500 per delegate (all categories).</p>
                    </div>

                    <Field label="Delegate Category" required>
                      <div className="grid grid-cols-1 gap-2">
                        {registrationFees.map(fee => (
                          <button key={fee.category} type="button" onClick={() => set("category", fee.category)}
                            className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${form.category === fee.category ? "border-[#C9921A] bg-[#C9921A]/10" : "glass border-white/10 hover:border-white/25"}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${form.category === fee.category ? "border-[#C9921A] bg-[#C9921A]" : "border-slate-500"}`} />
                              <span className={`text-sm font-medium ${form.category === fee.category ? "text-white" : "text-theme-primary"}`}>{fee.category}</span>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                              <div className="text-[#F5B730] font-black">USD {fee.earlyBird}</div>
                              {fee.standard !== fee.earlyBird && (
                                <div className="text-xs line-through text-theme-primary">USD {fee.standard}</div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </Field>

                    <Field label="Attendance Mode" required>
                      <div className="flex gap-3">
                        {[["in-person", "🏛 In-Person"], ["virtual", "💻 Virtual / Online"], ["hybrid", "🔀 Hybrid"]].map(([val, label]) => (
                          <ToggleButton key={val} value={val} current={form.attendanceMode} onChange={v => set("attendanceMode", v)}>{label}</ToggleButton>
                        ))}
                      </div>
                    </Field>

                    <Field label="Days You Will Attend">
                      <CheckboxGroup options={sessionOptions} selected={form.daysAttending} onChange={v => set("daysAttending", v)} />
                    </Field>

                    {form.attendanceMode !== "virtual" && (
                      <>
                        <div className="divider-gold" />
                        <h3 className="text-white font-bold text-sm flex items-center gap-2"><Building className="w-4 h-4 text-[#C9921A]" />Accommodation at Elephant Hills Resort</h3>
                        <Field label="Do you require accommodation assistance?">
                          <div className="flex gap-3">
                            <ToggleButton value="yes" current={form.requiresAccommodation} onChange={v => set("requiresAccommodation", v)}>Yes, please</ToggleButton>
                            <ToggleButton value="no" current={form.requiresAccommodation} onChange={v => set("requiresAccommodation", v)}>No, self-arranged</ToggleButton>
                          </div>
                        </Field>
                        {form.requiresAccommodation === "yes" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <Field label="Arrival Date"><input type="date" value={form.arrivalDate} onChange={e => set("arrivalDate", e.target.value)} className={inputClass} /></Field>
                              <Field label="Departure Date"><input type="date" value={form.departureDate} onChange={e => set("departureDate", e.target.value)} className={inputClass} /></Field>
                            </div>
                            <Field label="Room Type Preference">
                              <div className="relative">
                                <select value={form.roomType} onChange={e => set("roomType", e.target.value)} className={selectClass}>
                                  <option value="">Select room type</option>
                                  {roomTypes.map(r => <option key={r}>{r}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary pointer-events-none" />
                              </div>
                            </Field>
                          </div>
                        )}
                        <Field label="Airport Transfer Required?">
                          <div className="flex gap-3">
                            <ToggleButton value="yes" current={form.airportTransfer} onChange={v => set("airportTransfer", v)}>Yes</ToggleButton>
                            <ToggleButton value="no" current={form.airportTransfer} onChange={v => set("airportTransfer", v)}>No</ToggleButton>
                          </div>
                        </Field>
                        <Field label="Special Access / Mobility Requirements">
                          <textarea rows={2} placeholder="Please describe any mobility, accessibility or medical requirements..." value={form.specialNeeds} onChange={e => set("specialNeeds", e.target.value)} className={inputClass + " resize-none"} />
                        </Field>
                      </>
                    )}
                  </div>
                )}

                {/* ── STEP 4: Preferences ── */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="mb-2">
                      <h2 className="text-xl font-black text-white">Session & Dining Preferences</h2>
                      <p className="text-sm mt-1 text-theme-primary">Help us personalise your Summit experience.</p>
                    </div>
                    <Field label="Dietary Requirements">
                      <div className="relative">
                        <select value={form.dietaryRequirements} onChange={e => set("dietaryRequirements", e.target.value)} className={selectClass}>
                          <option value="">No special requirements</option>
                          {dietaryOptions.map(d => <option key={d}>{d}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary pointer-events-none" />
                      </div>
                    </Field>
                    <Field label="Sessions of Primary Interest">
                      <CheckboxGroup options={sessionOptions} selected={form.sessionInterests} onChange={v => set("sessionInterests", v)} />
                    </Field>
                    {form.attendanceMode !== "virtual" && (
                      <Field label="Excursion Preference (Fri 25 September)">
                        <div className="space-y-2">
                          {excursions.map(ex => (
                            <label key={ex} className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-all ${form.excursionPreference === ex ? "border-[#C9921A] bg-[#C9921A]/10" : "glass border-white/10 hover:border-white/20"}`}>
                              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${form.excursionPreference === ex ? "border-[#C9921A] bg-[#C9921A]" : "border-slate-500"}`} />
                              <input type="radio" name="excursion" value={ex} checked={form.excursionPreference === ex} onChange={e => set("excursionPreference", e.target.value)} className="hidden" />
                              <span className={`text-sm ${form.excursionPreference === ex ? "text-white font-medium" : "text-theme-primary"}`}>{ex}</span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs mt-2 text-theme-primary">Excursion places are limited. First-come, first-served. Additional activities available at own cost.</p>
                      </Field>
                    )}
                  </div>
                )}

                {/* ── STEP 5: Extras ── */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div className="mb-2">
                      <h2 className="text-xl font-black text-white">Additional Registrations</h2>
                      <p className="text-sm mt-1 text-theme-primary">Innovation Challenge, bilateral meetings, and media accreditation.</p>
                    </div>

                    {/* Bilateral meetings */}
                    <div className="glass rounded-xl p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <Handshake className="w-5 h-5 text-[#C9921A] flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-white font-bold text-sm">Bilateral Meeting Platform</h3>
                          <p className="text-xs mt-1 text-theme-primary">Register to book one-on-one meetings with ministers, investors, and organisations via the Summit App.</p>
                        </div>
                      </div>
                      <Field label="Register for bilateral meetings?">
                        <div className="flex gap-3">
                          <ToggleButton value="yes" current={form.bilateralMeetings} onChange={v => set("bilateralMeetings", v)}>Yes, interested</ToggleButton>
                          <ToggleButton value="no" current={form.bilateralMeetings} onChange={v => set("bilateralMeetings", v)}>Not at this time</ToggleButton>
                        </div>
                      </Field>
                      {form.bilateralMeetings === "yes" && (
                        <div className="mt-4">
                          <Field label="Investment / Partnership Areas of Interest">
                            <CheckboxGroup options={investmentAreas} selected={form.investmentInterests} onChange={v => set("investmentInterests", v)} />
                          </Field>
                        </div>
                      )}
                    </div>

                    {/* Innovation Challenge */}
                    <div className="glass rounded-xl p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <Rocket className="w-5 h-5 text-[#C9921A] flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-white font-bold text-sm">TNF Innovation Challenge 2026</h3>
                          <p className="text-xs mt-1 text-theme-primary">African youth entrepreneurs pitch digital and green solutions to a global investor panel. Open to delegates under 35.</p>
                        </div>
                      </div>
                      <Field label="Apply for the TNF Innovation Challenge?">
                        <div className="flex gap-3">
                          <ToggleButton value="yes" current={form.applyInnovation} onChange={v => set("applyInnovation", v)}>Yes — apply</ToggleButton>
                          <ToggleButton value="no" current={form.applyInnovation} onChange={v => set("applyInnovation", v)}>No</ToggleButton>
                        </div>
                      </Field>
                      {form.applyInnovation === "yes" && (
                        <div className="space-y-4 mt-4">
                          <Field label="Start-up / Project Name">
                            <input type="text" placeholder="Your venture name" value={form.startupName} onChange={e => set("startupName", e.target.value)} className={inputClass} />
                          </Field>
                          <Field label="Stage of Development">
                            <div className="relative">
                              <select value={form.startupStage} onChange={e => set("startupStage", e.target.value)} className={selectClass}>
                                <option value="">Select stage</option>
                                {["Idea Stage", "Prototype / MVP", "Early Traction", "Growth Stage", "Scaling"].map(s => <option key={s}>{s}</option>)}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary pointer-events-none" />
                            </div>
                          </Field>
                          <Field label="Brief Description of Your Solution (max 250 words)">
                            <textarea rows={4} placeholder="Describe the problem you solve, your solution, and your impact..." value={form.startupDescription} onChange={e => set("startupDescription", e.target.value)} className={inputClass + " resize-none"} maxLength={1500} />
                          </Field>
                          <p className="text-[#F5B730] text-xs">★ A full application form will be emailed to you after registration is confirmed.</p>
                        </div>
                      )}
                    </div>

                    {/* Media */}
                    <div className="glass rounded-xl p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <Mic className="w-5 h-5 text-[#C9921A] flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-white font-bold text-sm">Media / Press Accreditation</h3>
                          <p className="text-xs mt-1 text-theme-primary">Media representatives require separate accreditation. Press access is subject to approval.</p>
                        </div>
                      </div>
                      <Field label="Are you representing a media organisation?">
                        <div className="flex gap-3">
                          <ToggleButton value="yes" current={form.isMedia} onChange={v => set("isMedia", v)}>Yes</ToggleButton>
                          <ToggleButton value="no" current={form.isMedia} onChange={v => set("isMedia", v)}>No</ToggleButton>
                        </div>
                      </Field>
                      {form.isMedia === "yes" && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <Field label="Media Organisation">
                            <input type="text" placeholder="Publication / Station / Channel" value={form.mediaOrganisation} onChange={e => set("mediaOrganisation", e.target.value)} className={inputClass} />
                          </Field>
                          <Field label="Media Type">
                            <div className="relative">
                              <select value={form.mediaType} onChange={e => set("mediaType", e.target.value)} className={selectClass}>
                                <option value="">Select type</option>
                                {["Print", "Online / Digital", "Television", "Radio", "Podcast", "Freelance"].map(t => <option key={t}>{t}</option>)}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary pointer-events-none" />
                            </div>
                          </Field>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── STEP 6: Payment ── */}
                {step === 6 && (
                  <div className="space-y-5">
                    <div className="mb-2">
                      <h2 className="text-xl font-black text-white">Payment Details</h2>
                      <p className="text-sm mt-1 text-theme-primary">Select your preferred payment method. An invoice will be issued within 24 hours.</p>
                    </div>

                    {selectedFeeRow && (
                      <div className="glass-gold rounded-2xl p-5">
                        <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-3">Registration Fee Summary</h3>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-theme-primary">{form.category}</span>
                        </div>
                        <div>
                          <div className="text-xs text-theme-primary">Flat delegate fee (all categories)</div>
                          <div className="text-[#F5B730] text-3xl font-black mt-1">USD {feeAmount}</div>
                          {selectedFeeRow.standard !== selectedFeeRow.early && (
                            <div className="mt-2 text-right text-xs">
                              <span className="text-theme-primary">Standard: </span>
                              <span className="line-through text-theme-primary">USD {selectedFeeRow.standard}</span>
                              <span className="text-emerald-400 font-bold ml-2">Save USD {selectedFeeRow.standard - selectedFeeRow.early}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <Field label="Payment Method" required>
                      <div className="space-y-2">
                        {paymentMethods.map(pm => (
                          <label key={pm} className={`flex items-center gap-3 cursor-pointer p-3.5 rounded-xl border transition-all ${form.paymentMethod === pm ? "border-[#C9921A] bg-[#C9921A]/10" : "glass border-white/10 hover:border-white/20"}`}>
                            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${form.paymentMethod === pm ? "border-[#C9921A] bg-[#C9921A]" : "border-slate-500"}`} />
                            <input type="radio" name="payment" value={pm} checked={form.paymentMethod === pm} onChange={e => set("paymentMethod", e.target.value)} className="hidden" />
                            <span className={`text-sm font-medium ${form.paymentMethod === pm ? "text-white" : "text-theme-primary"}`}>{pm}</span>
                          </label>
                        ))}
                      </div>
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Invoice Required?">
                        <div className="flex gap-2">
                          <ToggleButton value="yes" current={form.invoiceRequired} onChange={v => set("invoiceRequired", v)}>Yes</ToggleButton>
                          <ToggleButton value="no" current={form.invoiceRequired} onChange={v => set("invoiceRequired", v)}>No</ToggleButton>
                        </div>
                      </Field>
                      <Field label="Billing Organisation">
                        <input type="text" placeholder="If different from your org" value={form.billingOrganisation} onChange={e => set("billingOrganisation", e.target.value)} className={inputClass} />
                      </Field>
                    </div>

                    <div className="glass rounded-xl p-4 flex items-start gap-3">
                      <Info className="w-5 h-5 text-[#C9921A] flex-shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed space-y-1 text-theme-primary">
                        <p>Payment is due within <strong className="text-white">14 days</strong> of invoice date. Registration is only confirmed upon receipt of full payment.</p>
                        <p>Bank transfer details will be included in your invoice. For mobile money, contact <a href="mailto:info@tnfzim.com" className="text-[#C9921A]">info@tnfzim.com</a>.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 7: Confirm ── */}
                {step === 7 && (
                  <div className="space-y-5">
                    <div className="mb-2">
                      <h2 className="text-xl font-black text-white">Review & Submit</h2>
                      <p className="text-sm mt-1 text-theme-primary">Please review your registration and confirm your consents before submitting.</p>
                    </div>

                    {/* Summary */}
                    <div className="glass rounded-xl p-5 space-y-3">
                      <h3 className="text-[#C9921A] text-xs font-bold uppercase mb-3">Registration Summary</h3>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm">
                        {[
                          ["Name", `${form.salutation} ${form.firstName} ${form.lastName}`],
                          ["Email", form.email],
                          ["Phone", form.phone],
                          ["Organisation", form.organisation],
                          ["Job Title", form.jobTitle],
                          ["Country", form.country],
                          ["Category", form.category],
                          ["Attendance", form.attendanceMode],
                          ["Payment", form.paymentMethod],
                        ].map(([label, value]) => value ? (
                          <div key={label}><span className="text-theme-primary">{label}: </span><span className="text-white font-medium">{value}</span></div>
                        ) : null)}
                      </div>
                      {feeAmount > 0 && (
                        <div className="border-t border-white/10 pt-3 flex justify-between">
                          <span className="text-sm text-theme-primary">Registration fee (flat):</span>
                          <span className="text-[#F5B730] font-black text-lg">USD {feeAmount}</span>
                        </div>
                      )}
                    </div>

                    {/* Consents */}
                    <div className="space-y-3">
                      {[
                        { key: "termsAccepted", required: true, label: <>I have read and agree to the <a href="/terms" target="_blank" className="text-[#C9921A] underline">Terms of Use</a> and understand that payment is due within 14 days of invoice.</> },
                        { key: "privacyConsent", required: true, label: <>I have read and agree to the <a href="/privacy" target="_blank" className="text-[#C9921A] underline">Privacy Policy</a> and consent to the processing of my personal data for Summit administration purposes.</> },
                        { key: "photoConsent", required: false, label: "I consent to being photographed and filmed at Summit sessions and events. Images may be used in official Summit publications and social media." },
                        { key: "newsletterOptIn", required: false, label: "I would like to receive TNF Summit news, programme updates, and post-summit reports by email. I can unsubscribe at any time." },
                      ].map(({ key, required, label }) => (
                        <label key={key} className={`flex items-start gap-3 cursor-pointer p-3.5 rounded-xl border transition-all ${(form as Record<string, unknown>)[key] ? "border-[#C9921A]/30 bg-[#C9921A]/5" : "glass border-white/10 hover:border-white/20"}`}>
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${!!(form as Record<string, unknown>)[key] ? "bg-[#C9921A] border-[#C9921A]" : "border-white/20"}`}>
                            {!!(form as Record<string, unknown>)[key] && <CheckCircle className="w-3 h-3 text-[#0A1628]" />}
                          </div>
                          <input type="checkbox" checked={!!(form as Record<string, unknown>)[key]} onChange={e => set(key as keyof FormData, e.target.checked)} className="hidden" required={required} />
                          <span className="text-sm leading-relaxed text-theme-primary">
                            {label}
                            {required && <span className="text-[#C9921A] ml-1">*</span>}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="glass rounded-xl p-4 text-center">
                      <FileText className="w-5 h-5 text-[#C9921A] mx-auto mb-2" />
                      <p className="text-xs text-theme-primary">
                        By submitting you confirm all information is accurate. A confirmation email and invoice will be sent to <strong className="text-white">{form.email}</strong> within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {submitError && (
              <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <Info className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-xs leading-relaxed">{submitError}</p>
              </div>
            )}
            <div className="flex gap-3 mt-6 pt-6 border-t border-white/5">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-theme-primary hover:text-white text-sm font-semibold transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              <button
                type="submit"
                disabled={!canProceed() || submitting}
                className="flex-1 btn-gold py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting
                  ? <><div className="w-4 h-4 border-2 border-[#0A1628]/30 border-t-[#0A1628] rounded-full animate-spin" />Submitting…</>
                  : step < STEPS.length
                    ? <>Continue to {STEPS[step].label} <ArrowRight className="w-4 h-4" /></>
                    : <>Submit Registration <CheckCircle className="w-4 h-4" /></>}
              </button>
            </div>
          </div>
        </form>

        {/* Help */}
        <div className="text-center mt-6 space-y-1">
          <p className="text-xs text-theme-primary">Need help? <a href="mailto:info@tnfzim.com" className="text-[#C9921A] hover:text-[#F5B730]">info@tnfzim.com</a> · <a href="tel:+2632427830" className="text-[#C9921A] hover:text-[#F5B730]">+263 242 783 030</a></p>
          <p className="text-xs text-theme-primary">Group registrations (5+ delegates): contact the Secretariat for rates.</p>
        </div>
      </div>
    </div>
  );
}
