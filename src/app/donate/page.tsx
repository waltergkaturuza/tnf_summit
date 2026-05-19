"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, CreditCard, Copy, Check, Building2, Hash, Globe, Loader2, ChevronDown } from "lucide-react";
import { getSetting } from "@/lib/db";
import PageHeader from "@/components/PageHeader";
import {
  donationCategories,
  themes,
  getThemeSponsorshipTiers,
  getThemeSponsorshipOfferTier,
  getSponsorSpotlightDropdownOptions,
  getSponsorshipTiersForSelectValue,
  summitWidePartnershipTiers,
  parseUsdFromPriceBand,
  type ThemeSponsorshipPackageTier,
  type SummitWidePartnershipTierId,
} from "@/lib/data";

const SPONSORSHIP_CATEGORY_KEYS = new Set([
  "theme_sponsorship",
  "summit_wide_sponsorship",
  "event_package_sponsorship",
]);

const donationCategoryOptions = donationCategories.filter((c) => !SPONSORSHIP_CATEGORY_KEYS.has(c.key));

const PAYMENT_KEYS = [
  "payment_bank_name",
  "payment_account_name",
  "payment_account_number",
  "payment_branch_code",
  "payment_swift",
  "payment_currency",
] as const;

function CopyField({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-2 glass rounded-xl px-4 py-3 border border-white/10">
      <div className="flex items-center gap-3 min-w-0">
        <Icon className="w-4 h-4 text-[#C9921A] flex-shrink-0" />
        <div>
          <h4 className="text-white font-semibold text-sm">{label}</h4>
          <p className="text-theme-primary text-sm font-mono truncate">{value}</p>
        </div>
      </div>
      <button onClick={copy} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-[#C9921A] transition-colors flex-shrink-0">
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

type DonorType = "individual" | "organisation";
type ContributionMode = "donation" | "sponsorship";
type SponsorshipScope = "theme" | "event_package" | "summit_wide";

/**
 * Visually clear dropdown shell: prominent label, a "click to choose" hint, and a
 * visible chevron so users immediately recognise the field as a dropdown menu.
 */
function SelectField({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactElement<React.SelectHTMLAttributes<HTMLSelectElement>>;
}) {
  const select = React.cloneElement(children, {
    className: [
      "w-full appearance-none cursor-pointer pl-3 pr-10 py-3 rounded-xl",
      "bg-[var(--bg-primary)] border-2 border-[#C9921A]/40 hover:border-[#C9921A]/70",
      "text-white text-sm font-medium",
      "focus:outline-none focus:ring-2 focus:ring-[#d49a26]/50 focus:border-[#C9921A]",
      "transition-colors",
      children.props.className ?? "",
    ].join(" "),
  });
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-bold text-white mb-1.5">
        <ChevronDown className="w-4 h-4 text-[#C9921A]" aria-hidden />
        <span>{label}</span>
        {required && <span className="text-[#C9921A]">*</span>}
      </label>
      {hint && <p className="text-xs text-slate-300 mb-2">{hint}</p>}
      <div className="relative">
        {select}
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9921A]"
          aria-hidden
        />
      </div>
    </div>
  );
}

export default function DonatePage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loadingSettings, setLoadingSettings] = useState(true);

  const [donorType, setDonorType] = useState<DonorType>("individual");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [categoryKey, setCategoryKey] = useState(donationCategoryOptions[0]?.key ?? "general");
  const [themeId, setThemeId] = useState("");
  const [categoryOther, setCategoryOther] = useState("");
  const [amountUsd, setAmountUsd] = useState<string>("");
  const [message, setMessage] = useState("");

  const [contributionMode, setContributionMode] = useState<ContributionMode>("donation");
  const [sponsorshipScope, setSponsorshipScope] = useState<SponsorshipScope>("theme");
  const [eventPackageId, setEventPackageId] = useState(
    () => getSponsorSpotlightDropdownOptions()[0]?.id ?? ""
  );
  const [packageTier, setPackageTier] = useState<ThemeSponsorshipPackageTier>("platinum");
  const [summitWideTierId, setSummitWideTierId] = useState<SummitWidePartnershipTierId>("platinum");

  const [cardSubmitting, setCardSubmitting] = useState(false);
  const [iveriRedirecting, setIveriRedirecting] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all(PAYMENT_KEYS.map((k) => getSetting(k))).then((vals) => {
      const map: Record<string, string> = {};
      PAYMENT_KEYS.forEach((k, i) => {
        map[k] = vals[i] ?? "";
      });
      setSettings(map);
      setLoadingSettings(false);
    });
  }, []);

  useEffect(() => {
    if (contributionMode !== "sponsorship" || sponsorshipScope !== "theme" || !themeId) return;
    const tiers = getThemeSponsorshipTiers(themeId);
    if (tiers.length === 0) return;
    if (!tiers.some((t) => t.packageTier === packageTier)) {
      setPackageTier(tiers[0].packageTier);
    }
  }, [contributionMode, sponsorshipScope, themeId, packageTier]);

  useEffect(() => {
    if (contributionMode !== "sponsorship" || sponsorshipScope !== "event_package" || !eventPackageId) return;
    const tiers = getSponsorshipTiersForSelectValue(eventPackageId);
    if (tiers.length === 0) return;
    if (!tiers.some((t) => t.packageTier === packageTier)) {
      setPackageTier(tiers[0].packageTier);
    }
  }, [contributionMode, sponsorshipScope, eventPackageId, packageTier]);

  useEffect(() => {
    if (contributionMode !== "sponsorship") return;
    let usd: number | null = null;
    if (sponsorshipScope === "summit_wide") {
      const sw = summitWidePartnershipTiers.find((t) => t.id === summitWideTierId);
      if (sw) usd = parseUsdFromPriceBand(sw.priceBand);
    } else if (sponsorshipScope === "event_package" && eventPackageId) {
      const tiers = getSponsorshipTiersForSelectValue(eventPackageId);
      const o = tiers.find((t) => t.packageTier === packageTier) ?? tiers[0];
      usd = o?.priceUsd ?? null;
    } else if (sponsorshipScope === "theme" && themeId) {
      const o = getThemeSponsorshipOfferTier(themeId, packageTier);
      usd = o?.priceUsd ?? null;
    }
    setAmountUsd(usd != null ? String(usd) : "");
  }, [
    contributionMode,
    sponsorshipScope,
    themeId,
    eventPackageId,
    packageTier,
    summitWideTierId,
  ]);

  const bankName = settings.payment_bank_name || "";
  const accountName = settings.payment_account_name || "";
  const accountNumber = settings.payment_account_number || "";
  const branchCode = settings.payment_branch_code || "";
  const swift = settings.payment_swift || "";
  const currency = settings.payment_currency || "USD";

  const hasBankDetails = bankName || accountName || accountNumber || swift;

  async function submitCardDonation(e: React.FormEvent) {
    e.preventDefault();
    setCardError(null);
    setCardSubmitting(true);
    try {
      const amt = Number(amountUsd);
      if (!Number.isFinite(amt) || amt < 1) {
        setCardError("Enter a valid amount in USD (minimum 1).");
        setCardSubmitting(false);
        return;
      }
      if (contributionMode === "donation") {
        if (categoryKey === "global_themes_fund" && !themeId) {
          setCardError("Please select a Summit theme.");
          setCardSubmitting(false);
          return;
        }
        if (categoryKey === "other" && !categoryOther.trim()) {
          setCardError("Please provide your donation category under Other.");
          setCardSubmitting(false);
          return;
        }
      } else {
        if (sponsorshipScope === "theme") {
          if (!themeId) {
            setCardError("Please select a Summit theme for sponsorship.");
            setCardSubmitting(false);
            return;
          }
          const offer = getThemeSponsorshipOfferTier(themeId, packageTier);
          if (!offer) {
            setCardError("This theme has no published sponsorship package. Choose another theme or tier.");
            setCardSubmitting(false);
            return;
          }
        } else if (sponsorshipScope === "event_package") {
          if (!eventPackageId.trim()) {
            setCardError("Please select an event package.");
            setCardSubmitting(false);
            return;
          }
          const tiers = getSponsorshipTiersForSelectValue(eventPackageId);
          const offer = tiers.find((t) => t.packageTier === packageTier) ?? tiers[0];
          if (!offer) {
            setCardError("This event package has no published tier. Choose another package.");
            setCardSubmitting(false);
            return;
          }
        } else {
          const sw = summitWidePartnershipTiers.find((t) => t.id === summitWideTierId);
          const parsed = sw ? parseUsdFromPriceBand(sw.priceBand) : null;
          if (parsed == null || !Number.isFinite(parsed)) {
            setCardError("Could not read the selected summit-wide tier amount. Try again or contact us.");
            setCardSubmitting(false);
            return;
          }
        }
      }

      const payload: Record<string, unknown> = {
        donorType,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        organisation: organisation.trim(),
        email: email.trim(),
        phone: phone.trim(),
        categoryKey,
        categoryOther: categoryOther.trim(),
        amountUsd: amt,
        message: message.trim(),
        contributionType: contributionMode,
      };
      if (contributionMode === "donation") {
        if (themeId) payload.themeId = themeId;
      } else {
        payload.sponsorshipScope = sponsorshipScope;
        if (sponsorshipScope === "theme") {
          payload.themeId = themeId;
          payload.packageTier = packageTier;
        } else if (sponsorshipScope === "event_package") {
          payload.eventPackageId = eventPackageId;
          payload.packageTier = packageTier;
        } else {
          payload.summitWideTierId = summitWideTierId;
        }
      }

      const createRes = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const createJson = (await createRes.json().catch(() => ({}))) as { error?: string; trackId?: string };
      if (!createRes.ok) {
        throw new Error(createJson.error || "Could not start donation.");
      }
      const trackId = createJson.trackId;
      if (!trackId) throw new Error("No reference returned.");

      setIveriRedirecting(true);
      const payRes = await fetch("/api/payments/iveri/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId }),
      });
      const payData = (await payRes.json().catch(() => ({}))) as {
        redirectUrl?: string;
        action?: string;
        fields?: Record<string, string>;
        error?: string;
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
      setCardError(payData.error || "Secure checkout could not start. Try bank transfer or try again later.");
    } catch (err: unknown) {
      setCardError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setCardSubmitting(false);
      setIveriRedirecting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <PageHeader
        title="Support the Zimbabwe TNF Global Summit"
        subtitle="Support the summit with a flexible donation or a fixed sponsorship package. Use the card form below (choose Donating or Sponsoring), or pay by bank transfer in the panel on the right."
      />
      <div className="pb-20 px-4">
      {iveriRedirecting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-primary)]/95 backdrop-blur-sm">
          <div className="w-12 h-12 border-2 border-[#d49a26] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white font-semibold">Redirecting to secure card payment…</p>
          <p className="text-sm text-theme-primary mt-2 max-w-sm text-center">You are being sent to our payment partner. Do not close this window.</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#C9921A] text-sm font-semibold mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            {/* Card donation, short form */}
            <div className="glass rounded-2xl p-6 border border-white/10 xl:col-span-2">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#d49a26]" /> Sponsor / Donate by card
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              {contributionMode === "donation"
                ? "Donating: enter any USD amount you wish (minimum 1). The charge matches what you enter, subject to our payment partner&apos;s limits."
                : "Sponsoring: pick theme spotlight, event packages (Welcome Cocktail, Ministerial Dinner, Magazine, Lanyards), or summit-wide, then tier. The USD amount is fixed by that package, filled in for you, and verified on our server before checkout."}
            </p>

            <form onSubmit={(e) => void submitCardDonation(e)} className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                  <input
                    type="radio"
                    name="contributionMode"
                    checked={contributionMode === "donation"}
                    onChange={() => {
                      setContributionMode("donation");
                      if (SPONSORSHIP_CATEGORY_KEYS.has(categoryKey)) {
                        setCategoryKey(donationCategoryOptions[0]?.key ?? "general");
                      }
                      setAmountUsd("");
                    }}
                    className="accent-[#d49a26]"
                  />
                  Donating
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                  <input
                    type="radio"
                    name="contributionMode"
                    checked={contributionMode === "sponsorship"}
                    onChange={() => {
                      setContributionMode("sponsorship");
                      setCategoryKey("theme_sponsorship");
                      setSponsorshipScope("theme");
                      const first =
                        themes.find((th) => getThemeSponsorshipTiers(th.id).length > 0)?.id ?? themes[0]?.id ?? "";
                      setThemeId(first);
                    }}
                    className="accent-[#d49a26]"
                  />
                  Sponsoring
                </label>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                  <input
                    type="radio"
                    name="donorType"
                    checked={donorType === "individual"}
                    onChange={() => setDonorType("individual")}
                    className="accent-[#d49a26]"
                  />
                  Individual
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                  <input
                    type="radio"
                    name="donorType"
                    checked={donorType === "organisation"}
                    onChange={() => setDonorType("organisation")}
                    className="accent-[#d49a26]"
                  />
                  Organisation
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First name</label>
                  <input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last name</label>
                  <input
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40"
                  />
                </div>
              </div>

              {donorType === "organisation" && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Organisation</label>
                  <input
                    required
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40"
                  />
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone (optional)</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40"
                  />
                </div>
              </div>

              {contributionMode === "donation" ? (
                <>
                  <SelectField label="Donation category" hint="Click to choose where your donation goes">
                    <select
                      value={categoryKey}
                      onChange={(e) => {
                        const next = e.target.value;
                        setCategoryKey(next);
                        if (next !== "global_themes_fund") setThemeId("");
                        if (next !== "other") setCategoryOther("");
                      }}
                    >
                      {donationCategoryOptions.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </SelectField>
                  <p className="-mt-2 text-xs text-slate-400">
                    {donationCategories.find((c) => c.key === categoryKey)?.description}
                  </p>
                  {categoryKey === "global_themes_fund" && (
                    <SelectField label="Select Summit theme" hint="Pick the theme you would like your donation to support" required>
                      <select required value={themeId} onChange={(e) => setThemeId(e.target.value)}>
                        <option value="">Choose a theme…</option>
                        {themes.map((th) => (
                          <option key={th.id} value={th.id}>
                            Theme {th.id}: {th.label}
                          </option>
                        ))}
                      </select>
                    </SelectField>
                  )}
                  {categoryKey === "other" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Other category</label>
                      <input
                        required
                        value={categoryOther}
                        onChange={(e) => setCategoryOther(e.target.value)}
                        placeholder="Enter donation category"
                        className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40"
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                      <input
                        type="radio"
                        name="sponsorshipScope"
                        checked={sponsorshipScope === "theme"}
                        onChange={() => {
                          setSponsorshipScope("theme");
                          setCategoryKey("theme_sponsorship");
                          const first =
                            themes.find((th) => getThemeSponsorshipTiers(th.id).length > 0)?.id ?? themes[0]?.id ?? "";
                          if (!themeId || getThemeSponsorshipTiers(themeId).length === 0) setThemeId(first);
                        }}
                        className="accent-[#d49a26]"
                      />
                      Theme spotlight
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                      <input
                        type="radio"
                        name="sponsorshipScope"
                        checked={sponsorshipScope === "event_package"}
                        onChange={() => {
                          setSponsorshipScope("event_package");
                          setCategoryKey("event_package_sponsorship");
                          const opts = getSponsorSpotlightDropdownOptions();
                          const first = opts[0]?.id ?? "";
                          setEventPackageId(first);
                          const tiers = getSponsorshipTiersForSelectValue(first);
                          setPackageTier(tiers[0]?.packageTier ?? "platinum");
                        }}
                        className="accent-[#d49a26]"
                      />
                      Event packages
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                      <input
                        type="radio"
                        name="sponsorshipScope"
                        checked={sponsorshipScope === "summit_wide"}
                        onChange={() => {
                          setSponsorshipScope("summit_wide");
                          setCategoryKey("summit_wide_sponsorship");
                        }}
                        className="accent-[#d49a26]"
                      />
                      Summit-wide
                    </label>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-[11px] font-bold text-slate-500 uppercase mb-1">Package category</p>
                    <p className="text-sm text-white font-semibold">
                      {donationCategories.find((c) => c.key === categoryKey)?.label}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {donationCategories.find((c) => c.key === categoryKey)?.description}
                    </p>
                  </div>

                  {sponsorshipScope === "theme" ? (
                    <>
                      <SelectField
                        label="Select theme or event package"
                        hint="Click the menu below to choose which Summit theme you would like to spotlight"
                        required
                      >
                        <select required value={themeId} onChange={(e) => setThemeId(e.target.value)}>
                          <option value="">Choose a theme…</option>
                          {themes
                            .filter((th) => getThemeSponsorshipTiers(th.id).length > 0)
                            .map((th) => (
                              <option key={th.id} value={th.id}>
                                Theme {th.id}: {th.label}
                              </option>
                            ))}
                        </select>
                      </SelectField>
                      {themeId && getThemeSponsorshipTiers(themeId).length > 0 && (
                        <SelectField
                          label="Select package tier"
                          hint="Each tier sets a fixed contribution amount — verified at checkout"
                          required
                        >
                          <select
                            required
                            value={packageTier}
                            onChange={(e) => setPackageTier(e.target.value as ThemeSponsorshipPackageTier)}
                          >
                            {getThemeSponsorshipTiers(themeId).map((t) => (
                              <option key={t.packageTier} value={t.packageTier}>
                                {t.packageLabel} — USD {t.priceUsd.toLocaleString("en-US")}
                              </option>
                            ))}
                          </select>
                        </SelectField>
                      )}
                    </>
                  ) : sponsorshipScope === "event_package" ? (
                    <>
                      <SelectField
                        label="Select event package"
                        hint="Click the menu below — Welcome Cocktail, Ministerial Dinner, Summit Magazine, Lanyards and more"
                        required
                      >
                        <select
                          required
                          value={eventPackageId}
                          onChange={(e) => {
                            const id = e.target.value;
                            setEventPackageId(id);
                            const tiers = getSponsorshipTiersForSelectValue(id);
                            setPackageTier(tiers[0]?.packageTier ?? "platinum");
                          }}
                        >
                          {getSponsorSpotlightDropdownOptions().map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.optionLabel}
                            </option>
                          ))}
                        </select>
                      </SelectField>
                      {eventPackageId && getSponsorshipTiersForSelectValue(eventPackageId).length > 0 && (
                        <SelectField
                          label="Select package tier or placement"
                          hint="The chosen tier fixes the USD amount for this sponsorship"
                          required
                        >
                          <select
                            required
                            value={packageTier}
                            onChange={(e) => setPackageTier(e.target.value as ThemeSponsorshipPackageTier)}
                          >
                            {getSponsorshipTiersForSelectValue(eventPackageId).map((t) => (
                              <option key={t.offerKey} value={t.packageTier}>
                                {t.packageLabel} — USD {t.priceUsd.toLocaleString("en-US")}
                              </option>
                            ))}
                          </select>
                        </SelectField>
                      )}
                    </>
                  ) : (
                    <SelectField
                      label="Select summit-wide partnership tier"
                      hint="Click to choose the partnership tier that matches your contribution"
                      required
                    >
                      <select
                        required
                        value={summitWideTierId}
                        onChange={(e) => setSummitWideTierId(e.target.value as SummitWidePartnershipTierId)}
                      >
                        {summitWidePartnershipTiers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.title} — {t.priceBand}
                          </option>
                        ))}
                      </select>
                    </SelectField>
                  )}
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Amount (USD)
                  {contributionMode === "sponsorship" && (
                    <span className="text-slate-500 font-normal normal-case ml-2">(set by package)</span>
                  )}
                </label>
                <input
                  required
                  type="number"
                  min={1}
                  step="0.01"
                  readOnly={contributionMode === "sponsorship"}
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40 ${
                    contributionMode === "sponsorship" ? "opacity-90 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d49a26]/40 resize-y min-h-[72px]"
                />
              </div>

              {cardError && (
                <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-200">{cardError}</div>
              )}

              <button
                type="submit"
                disabled={cardSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-bold text-[#1a2b44] bg-[#d49a26] hover:bg-[#e0a82e] transition-colors disabled:opacity-60 disabled:pointer-events-none shadow-lg shadow-black/20"
              >
                {cardSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Please wait…
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-current" /> Sponsor/ Donate
                  </>
                )}
              </button>
            </form>
            </div>

            {/* Bank transfer details (side panel on desktop) */}
            <aside className="glass rounded-2xl p-6 border border-white/10 xl:sticky xl:top-24">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C9921A]" /> Bank transfer
              </h2>

              {loadingSettings ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#C9921A]/30 border-t-[#C9921A] rounded-full animate-spin" />
                </div>
              ) : hasBankDetails ? (
                <div className="space-y-3">
                  <CopyField label="Bank Name" value={bankName} icon={Building2} />
                  <CopyField label="Account Name" value={accountName} icon={CreditCard} />
                  <CopyField label="Account Number" value={accountNumber} icon={Hash} />
                  <CopyField label="Branch Code" value={branchCode} icon={Hash} />
                  <CopyField label="SWIFT / BIC" value={swift} icon={Globe} />
                  <div className="glass rounded-xl px-4 py-3 border border-white/10">
                    <h4 className="text-white font-semibold text-sm">Currency</h4>
                    <p className="text-theme-primary text-sm font-mono">{currency}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm py-4">
                  Bank details are being configured. Please contact{" "}
                  <a href="mailto:info@tnfzim.com" className="text-[#C9921A] hover:underline">
                    info@tnfzim.com
                  </a>{" "}
                  for donation instructions.
                </p>
              )}

              {hasBankDetails && (
                <div className="mt-6 p-4 rounded-xl bg-[#C9921A]/10 border border-[#C9921A]/20">
                  <p className="text-slate-300 text-xs leading-relaxed">
                    <strong className="text-[#F5B730]">Payment reference:</strong> Include your name or organisation when making the transfer so we can acknowledge your donation. For international transfers, use the SWIFT code above.
                  </p>
                </div>
              )}
            </aside>
          </div>

          <div className="text-center">
            <p className="text-slate-500 text-sm">
              Questions?{" "}
              <a href="mailto:info@tnfzim.com" className="text-[#C9921A] hover:underline font-medium">
                Contact us
              </a>
            </p>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
