import { type ReactNode, useMemo, useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, CircleAlert, CreditCard, LockKeyhole, MessageCircle, ShieldCheck, UserRound, Building2, RefreshCw } from "lucide-react";
import { useRegisterMember, useGetMemberCategories, useGetVerificationChallenge, getGetVerificationChallengeQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const plans = [
  { name: "ORDINARY MEMBER", fee: 150, target: ["Mama mboga", "Kiosk/duka operators", "Street vendors", "Market traders", "Informal service providers", "Small-scale farmers", "Boda boda operators"] },
  { name: "GRASSROOTS COORDINATOR", fee: 250, target: ["Grassroots representatives across counties, constituencies and wards"], note: "Payment does not automatically appoint a person as a coordinator. Appointment is controlled by authorised administrators." },
  { name: "RETAIL DEVELOPMENT MEMBER", fee: 5000, target: ["Retail businesses", "Commercial businesses", "Wholesalers", "Distributors", "Growing enterprises", "Suppliers", "Commercial traders"] },
  { name: "BUSINESS DEVELOPMENT MEMBER", fee: 10000, target: ["Established businesses", "Companies", "Manufacturers", "Distributors", "Investors", "Entrepreneurs", "Professional businesses"] },
];

const emptyForm = {
  fullName: "", ageBracket: "", gender: "", nationalId: "", email: "", phone: "", mpesaNumber: "",
  businessName: "", businessType: "", category: plans[0].name, monthlyTransactionBracket: "",
  county: "", constituency: "", ward: "", estate: "", businessLocation: "",
  businessRegistrationNumber: "", kraPin: "", verificationAnswer: "", website: ""
};

type FormState = typeof emptyForm;
type ExtraKycPayload = { monthlyTransactionBracket: string; mpesaNumber: string; verificationToken: string; formStartedAt: number };

export default function Membership() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [paymentState, setPaymentState] = useState<"idle" | "waiting">("idle");
  const [consent, setConsent] = useState(false);
  const [formStartedAt] = useState(() => Date.now());
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useRegisterMember();
  const { data: challenge, refetch: refetchChallenge, isFetching: challengeLoading } = useGetVerificationChallenge({
    query: { queryKey: getGetVerificationChallengeQueryKey() }
  });
  
  const { data: apiCategories } = useGetMemberCategories();
  const activePlan = useMemo(() => plans.find((plan) => plan.name === form.category) ?? plans[0], [form.category]);
  const categories = apiCategories?.length ? apiCategories : plans;
  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const phoneIsValid = (value: string) => /^(?:\+254|0)7\d{8}$/.test(value.replace(/\s/g, ""));

  const next = () => {
    const requiredByStep: Record<number, (keyof FormState)[]> = {
      1: ["fullName", "ageBracket", "gender", "nationalId", "email", "phone"],
      2: ["businessName", "businessType", "category", "monthlyTransactionBracket"],
      3: ["county", "constituency", "ward", "estate", "businessLocation"],
      4: ["mpesaNumber"],
    };
    const missing = requiredByStep[step]?.find((key) => !form[key].trim());
    if (missing) {
      toast({ title: "Complete this section", description: "Please fill in every required field before continuing.", variant: "destructive" });
      return;
    }
    if (step === 1 && (!phoneIsValid(form.phone) || !phoneIsValid(form.mpesaNumber || form.phone))) {
      toast({ title: "Check your Kenyan number", description: "Use a valid mobile number such as 0711422163.", variant: "destructive" });
      return;
    }
    if (step < 4) setStep((current) => current + 1);
  };

  const requestPayment = () => {
    if (!phoneIsValid(form.mpesaNumber)) {
      toast({ title: "Add a valid M-Pesa number", description: "This separate number receives the STK Push.", variant: "destructive" });
      return;
    }
    setPaymentState("waiting");
  };

  const submit = () => {
    if (!phoneIsValid(form.phone) || !phoneIsValid(form.mpesaNumber) || !consent) {
      toast({ title: "Review your application", description: "Check both Kenyan phone numbers and confirm your consent before submitting.", variant: "destructive" });
      return;
    }
    if (!challenge) {
      toast({ title: "Security verification missing", description: "Please complete the security question.", variant: "destructive" });
      return;
    }
    if (new Date(challenge.expiresAt).getTime() < Date.now()) {
      toast({ title: "Verification expired", description: "Security question expired. Please refresh and answer again.", variant: "destructive" });
      refetchChallenge();
      return;
    }
    if (!form.verificationAnswer.trim()) {
      toast({ title: "Security verification required", description: "Please answer the security question at the bottom of the form.", variant: "destructive" });
      return;
    }
    const payload = { ...form, verificationToken: challenge.token, formStartedAt } as FormState & ExtraKycPayload;
    mutation.mutate({ data: payload as never }, {
      onSuccess: () => { setSubmitted(true); setPaymentState("waiting"); window.scrollTo({ top: 0, behavior: "smooth" }); },
      onError: () => toast({ title: "Registration could not be sent", description: "Please check your security answer or contact BNAK on WhatsApp.", variant: "destructive" }),
    });
  };

  if (submitted) return <div className="app-shell py-16 md:py-24"><Card className="mx-auto max-w-3xl overflow-hidden border-card-border shadow-xl" data-testid="card-membership-received"><CardContent className="p-8 text-center md:p-14"><div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary"><CheckCircle2 className="h-8 w-8" /></div><Badge className="mb-4 border-0 bg-secondary text-white" data-testid="status-application-received">APPLICATION RECEIVED</Badge><h1 className="text-4xl font-bold">Karibu BNAK, {form.fullName.split(" ")[0]}.</h1><p className="mt-4 text-lg leading-relaxed text-muted-foreground">Your membership and KYC application is in review. Your M-Pesa payment is not marked successful here; verification will happen after a connected provider confirms the transaction.</p><div className="mt-8 grid gap-4 text-left sm:grid-cols-2"><div className="rounded-2xl bg-muted p-5"><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Selected membership</p><p className="mt-2 font-bold" data-testid="text-selected-membership">{activePlan.name}</p><p className="font-bold text-primary">KSh {activePlan.fee.toLocaleString()}</p></div><div className="rounded-2xl bg-muted p-5"><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Payment status</p><p className="mt-2 font-bold" data-testid="status-payment">Awaiting M-Pesa verification</p><p className="mt-1 text-sm text-muted-foreground">We will confirm the next step via WhatsApp.</p></div></div><div className="mt-8 flex flex-wrap justify-center gap-3"><Button asChild data-testid="button-membership-market"><Link href="/marketplace">Visit the BNAK Market <ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button asChild variant="outline" data-testid="button-membership-whatsapp"><a href="https://wa.me/254711422163" target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> Ask on WhatsApp</a></Button></div></CardContent></Card></div>;

  return <div className="min-h-[100dvh] bg-muted/30"><div className="app-shell py-12 md:py-20"><div className="mx-auto mb-10 max-w-3xl text-center"><Badge className="mb-4 border-0 bg-primary text-white" data-testid="badge-membership">MEMBERSHIP SYSTEM</Badge><h1 className="text-balance text-4xl font-bold md:text-6xl">Register your biashara with BNAK.</h1><p className="mt-4 text-lg leading-relaxed text-muted-foreground">One national network for informal traders, retailers, growing enterprises and strategic businesses. KYC helps us represent members responsibly.</p></div>
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-3"><h2 className="mb-5 text-xl font-bold">Choose your category</h2>{categories.map((plan) => { const local = plans.find((item) => item.name === plan.name); const fee = "annualFee" in plan ? plan.annualFee : local?.fee ?? 0; return <button type="button" key={plan.name} onClick={() => update("category", plan.name)} className={`w-full rounded-2xl border p-5 text-left transition-all ${form.category === plan.name ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card hover:border-primary/40"}`} data-testid={`button-plan-${plan.name.toLowerCase().replace(/\s+/g, "-")}`}><div className="flex items-start justify-between gap-3"><span className="text-sm font-bold leading-tight">{plan.name}</span><span className="whitespace-nowrap font-bold text-primary">KSh {Number(fee).toLocaleString()}</span></div><p className="mt-2 text-xs text-muted-foreground">{local?.target.slice(0, 3).join(" • ")}</p></button>})}<div className="flex items-start gap-2 rounded-2xl border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-secondary" /> Your details are collected for membership verification and responsible representation.</div></aside>
      <main><Card className="overflow-hidden border-card-border shadow-xl"><CardHeader className="bg-foreground p-6 text-background md:p-8"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-background/60">Application step {step} of 4</p><CardTitle className="mt-2 text-2xl text-background">{["Personal KYC", "Business profile", "Location", "STK Push & consent"][step - 1]}</CardTitle></div><div className="flex gap-2">{[1, 2, 3, 4].map((item) => <span key={item} className={`h-2 w-8 rounded-full ${item <= step ? "bg-primary" : "bg-background/20"}`} data-testid={`progress-membership-${item}`} />)}</div></div></CardHeader><CardContent className="p-6 md:p-8">
        {step === 1 && <div className="space-y-5" data-testid="section-personal-kyc"><SectionHeading icon={<UserRound />} title="Personal KYC" body="Your details are used for member verification and representation." /><Field label="Full name" value={form.fullName} onChange={(value) => update("fullName", value)} placeholder="Your legal name" testId="input-full-name" /><div className="grid gap-4 sm:grid-cols-2"><SelectField label="Age bracket" value={form.ageBracket} options={["18–24", "25–34", "35–44", "45–54", "55–64", "65+"]} onChange={(value) => update("ageBracket", value)} testId="select-age-bracket" /><SelectField label="Gender" value={form.gender} options={["Female", "Male"]} onChange={(value) => update("gender", value)} testId="select-gender" /></div><div className="grid gap-4 sm:grid-cols-2"><Field label="National ID / passport" value={form.nationalId} onChange={(value) => update("nationalId", value)} placeholder="ID number" testId="input-national-id" /><Field label="Contact phone" value={form.phone} onChange={(value) => update("phone", value)} placeholder="0711422163" testId="input-contact-phone" /></div><Field label="Email address" value={form.email} onChange={(value) => update("email", value)} placeholder="you@example.com" type="email" testId="input-email" /></div>}
        {step === 2 && <div className="space-y-5" data-testid="section-business-kyc"><SectionHeading icon={<Building2 />} title="Business KYC" body="Tell us about the enterprise you want BNAK to support." /><Field label="Business / trading name" value={form.businessName} onChange={(value) => update("businessName", value)} placeholder="Business name" testId="input-business-name" /><div className="grid gap-4 sm:grid-cols-2"><Field label="Business type / sector" value={form.businessType} onChange={(value) => update("businessType", value)} placeholder="e.g. grocery, tailoring, service" testId="input-business-type" /><SelectField label="Membership category" value={form.category} options={plans.map((plan) => plan.name)} onChange={(value) => update("category", value)} testId="select-membership-category" /></div><SelectField label="Average monthly transaction bracket" value={form.monthlyTransactionBracket} options={["Below KSh 10,000", "KSh 10,000–50,000", "KSh 50,001–150,000", "KSh 150,001–500,000", "Above KSh 500,000"]} onChange={(value) => update("monthlyTransactionBracket", value)} testId="select-monthly-transactions" /><div className="grid gap-4 sm:grid-cols-2"><Field label="Business registration number (optional)" value={form.businessRegistrationNumber} onChange={(value) => update("businessRegistrationNumber", value)} placeholder="If registered" testId="input-registration-number" /><Field label="KRA PIN (optional)" value={form.kraPin} onChange={(value) => update("kraPin", value)} placeholder="If available" testId="input-kra-pin" /></div><div className="rounded-2xl border border-primary/10 bg-primary/5 p-5"><p className="font-bold">{activePlan.name} — KSh {activePlan.fee.toLocaleString()}</p><p className="mt-2 text-sm text-muted-foreground">{activePlan.target.join(" • ")}</p>{activePlan.note && <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{activePlan.note}</p>}</div></div>}
        {step === 3 && <div className="space-y-5" data-testid="section-business-location"><SectionHeading icon={<ShieldCheck />} title="Business location" body="Help us map BNAK's network down to the local market." /><Field label="County" value={form.county} onChange={(value) => update("county", value)} placeholder="Type your county" testId="input-county" /><div className="grid gap-4 sm:grid-cols-2"><Field label="Constituency" value={form.constituency} onChange={(value) => update("constituency", value)} placeholder="Constituency" testId="input-constituency" /><Field label="Ward" value={form.ward} onChange={(value) => update("ward", value)} placeholder="Ward" testId="input-ward" /></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Estate / market / village" value={form.estate} onChange={(value) => update("estate", value)} placeholder="Local area" testId="input-estate" /><Field label="Business location / landmark" value={form.businessLocation} onChange={(value) => update("businessLocation", value)} placeholder="Shop, stall or landmark" testId="input-business-location" /></div></div>}
        {step === 4 && <div className="space-y-6" data-testid="section-payment-consent"><SectionHeading icon={<CreditCard />} title="STK Push & consent" body="The payment prompt is sent to your dedicated M-Pesa number. Payment stays pending until a provider callback is verified." /><Field label="M-Pesa number for STK Push" value={form.mpesaNumber} onChange={(value) => update("mpesaNumber", value)} placeholder="0711422163" testId="input-mpesa-number" /><div className="rounded-3xl bg-primary p-6 text-white" data-testid="card-stk-push"><div className="flex items-start justify-between gap-4"><div><p className="text-sm text-white/70">Amount due</p><p className="mt-1 text-2xl font-bold">{activePlan.name}</p></div><p className="text-3xl font-bold">KSh {activePlan.fee.toLocaleString()}</p></div><Button type="button" variant="secondary" className="mt-5" onClick={requestPayment} data-testid="button-request-stk-push">{paymentState === "waiting" ? "STK Push requested" : "Request STK Push"}</Button><div className="mt-4 flex items-start gap-2 text-xs text-white/75"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {paymentState === "waiting" ? <span data-testid="status-stk-push">Pending provider verification — do not submit another payment.</span> : "No payment is marked successful here. BNAK will confirm payment after a connected provider sends a verified callback."}</div></div><label className="flex items-start gap-3 text-sm" data-testid="label-membership-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-primary" /><span>I consent to BNAK processing my personal and business KYC details for membership verification, programme access and responsible representation.</span></label>
        
        {/* Security Verification */}
        <div className="rounded-xl border p-5 space-y-3 bg-muted/20">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold flex gap-2 items-center">
              Security Question <span className="text-primary">*</span>
            </label>
            <Button type="button" variant="ghost" size="sm" onClick={() => refetchChallenge()} disabled={challengeLoading} data-testid="button-refresh-challenge" className="h-8 text-xs px-2">
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${challengeLoading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
          {challenge ? (
            <div className="flex items-center gap-3">
              <span className="font-mono bg-background border px-3 py-1.5 rounded-md text-sm">{challenge.question}</span>
              <Input type="text" value={form.verificationAnswer} onChange={(e) => update("verificationAnswer", e.target.value)} placeholder="Answer" className="max-w-[120px]" data-testid="input-verification-answer" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading security verification...</p>
          )}
          {/* Honeypot field (hidden visually) */}
          <div className="absolute opacity-0 -z-10 pointer-events-none" aria-hidden="true">
            <label htmlFor="website">Leave this field empty</label>
            <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border p-4 text-sm text-muted-foreground"><MessageCircle className="h-4 w-4 shrink-0 text-secondary" /> Need help? Call <a href="tel:+254711422163" className="font-bold text-primary" data-testid="link-membership-call">0711422163</a> or <a href="https://wa.me/254711422163" target="_blank" rel="noreferrer" className="font-bold text-primary" data-testid="link-membership-whatsapp">WhatsApp BNAK</a>.</div></div>}
        <div className="mt-10 flex justify-between border-t pt-6">{step > 1 ? <Button type="button" variant="outline" onClick={() => setStep((current) => current - 1)} data-testid="button-membership-back"><ChevronLeft className="mr-2 h-4 w-4" /> Back</Button> : <span />}{step < 4 ? <Button type="button" onClick={next} data-testid="button-membership-continue">Continue <ChevronRight className="ml-2 h-4 w-4" /></Button> : <Button type="button" onClick={submit} disabled={mutation.isPending} data-testid="button-membership-submit">{mutation.isPending ? "Sending application…" : "Submit membership application"}</Button>}</div>
      </CardContent></Card></main>
    </div>
  </div></div>;
}

function SectionHeading({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return <div className="mb-4 flex items-start gap-3"><div className="mt-1 text-primary">{icon}</div><div><h2 className="text-xl font-bold">{title}</h2><p className="text-sm text-muted-foreground">{body}</p></div></div>;
}

function Field({ label, value, onChange, placeholder, type = "text", testId }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string; testId: string }) {
  return <label className="block space-y-2"><span className="text-sm font-bold">{label} <span className="text-primary">*</span></span><Input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} data-testid={testId} /></label>;
}

function SelectField({ label, value, options, onChange, testId }: { label: string; value: string; options: string[]; onChange: (value: string) => void; testId: string }) {
  return <label className="block space-y-2"><span className="text-sm font-bold">{label} <span className="text-primary">*</span></span><Select value={value} onValueChange={onChange}><SelectTrigger data-testid={testId}><SelectValue placeholder={`Select ${label.toLowerCase()}`} /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></label>;
}