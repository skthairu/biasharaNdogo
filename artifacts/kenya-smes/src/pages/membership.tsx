import { useMemo, useState } from "react";
import { Link } from "wouter";
import { CheckCircle2, ChevronLeft, ChevronRight, CreditCard, ShieldCheck, UserRound, Building2 } from "lucide-react";
import { useRegisterMember, useGetMemberCategories } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { KENYA_COUNTIES } from "@/lib/constants";

const plans = [
  { name: "ORDINARY MEMBER", fee: 150, target: ["Mama mboga", "Kiosk/duka operators", "Street vendors", "Market traders", "Informal service providers", "Small-scale farmers", "Boda boda operators", "Other informal/unregistered Biashara Ndogo"] },
  { name: "GRASSROOTS COORDINATOR", fee: 250, target: ["Grassroots representatives across counties, constituencies and wards"], note: "Payment does not automatically appoint a person as a coordinator. Appointment is controlled by authorised administrators." },
  { name: "RETAIL DEVELOPMENT MEMBER", fee: 5000, target: ["Retail businesses", "Commercial businesses", "Wholesalers", "Distributors", "Growing enterprises", "Suppliers", "Commercial traders", "Retail chains", "Expansion-focused businesses"] },
  { name: "BUSINESS DEVELOPMENT MEMBER", fee: 10000, target: ["Established businesses", "Companies", "Manufacturers", "Distributors", "Investors", "Entrepreneurs", "Professional businesses", "Large retailers", "Strategic growth businesses"] },
];

const emptyForm = {
  fullName: "", ageBracket: "", gender: "", nationalId: "", email: "", phone: "",
  businessName: "", businessType: "", category: plans[0].name, county: "", constituency: "", ward: "", estate: "",
  businessLocation: "", businessRegistrationNumber: "", kraPin: "",
};

type FormState = typeof emptyForm;

export default function Membership() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [paymentState, setPaymentState] = useState<"idle" | "waiting">("idle");
  const { toast } = useToast();
  const mutation = useRegisterMember();
  const { data: apiCategories } = useGetMemberCategories();
  const activePlan = useMemo(() => plans.find((plan) => plan.name === form.category) ?? plans[0], [form.category]);
  const categories = apiCategories?.length ? apiCategories : plans;
  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const next = () => {
    const requiredByStep: Record<number, (keyof FormState)[]> = {
      1: ["fullName", "ageBracket", "gender", "nationalId", "email", "phone"],
      2: ["businessName", "businessType", "category"],
      3: ["county", "constituency", "ward", "estate", "businessLocation"],
    };
    const missing = requiredByStep[step]?.find((key) => !form[key].trim());
    if (missing) {
      toast({ title: "Complete this section", description: "Please fill in all required KYC fields before continuing.", variant: "destructive" });
      return;
    }
    if (step < 4) setStep((current) => current + 1);
  };

  const submit = () => {
    if (!form.nationalId || !form.phone.match(/^(?:\+254|0)7\d{8}$/)) {
      toast({ title: "Check your phone and ID", description: "Use a valid Kenyan mobile number such as 0711422163.", variant: "destructive" });
      return;
    }
    mutation.mutate({ data: form as any }, {
      onSuccess: () => { setSubmitted(true); setPaymentState("waiting"); window.scrollTo({ top: 0, behavior: "smooth" }); },
      onError: () => toast({ title: "Registration could not be sent", description: "Please try again or contact BNAK on WhatsApp.", variant: "destructive" }),
    });
  };

  if (submitted) return <div className="container mx-auto px-4 py-20 max-w-3xl"><Card className="text-center border-primary/20 shadow-xl"><CardContent className="p-10 md:p-16"><div className="mx-auto mb-6 h-20 w-20 rounded-full bg-secondary/10 text-secondary flex items-center justify-center"><CheckCircle2 className="h-10 w-10" /></div><Badge className="bg-secondary text-white border-0 mb-4">APPLICATION RECEIVED</Badge><h1 className="text-4xl font-black">Karibu BNAK, {form.fullName.split(" ")[0]}.</h1><p className="mt-4 text-muted-foreground text-lg">Your membership and KYC application is in review. Coordinator payment does not create an appointment automatically; an authorised administrator must approve it.</p><div className="mt-8 grid sm:grid-cols-2 gap-4 text-left"><div className="rounded-2xl bg-muted p-5"><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Selected membership</p><p className="font-black mt-2">{activePlan.name}</p><p className="text-primary font-bold">KSh {activePlan.fee.toLocaleString()}</p></div><div className="rounded-2xl bg-muted p-5"><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Payment status</p><p className="font-black mt-2">{paymentState === "waiting" ? "Awaiting M-Pesa verification" : "Not started"}</p><p className="text-sm text-muted-foreground mt-1">We will confirm the next step via WhatsApp.</p></div></div><Button asChild className="mt-8"><Link href="/marketplace">Visit the BNAK Market</Link></Button></CardContent></Card></div>;

  return <div className="min-h-screen bg-muted/30 py-12"><div className="container mx-auto px-4 md:px-6 max-w-6xl"><div className="text-center max-w-3xl mx-auto mb-10"><Badge className="bg-primary text-white border-0 mb-4">MEMBERSHIP SYSTEM</Badge><h1 className="text-4xl md:text-5xl font-black">Register your biashara with BNAK.</h1><p className="text-lg text-muted-foreground mt-4">One national network for informal traders, retailers, growing enterprises and strategic businesses. KYC helps us represent members responsibly.</p></div>
    <div className="grid lg:grid-cols-[340px_1fr] gap-8">
      <aside className="space-y-4"><h2 className="text-xl font-black">Choose your category</h2>{categories.map((plan) => { const local = plans.find((item) => item.name === plan.name); const fee = "annualFee" in plan ? plan.annualFee : local?.fee ?? 0; return <button type="button" key={plan.name} onClick={() => update("category", plan.name)} className={`w-full text-left rounded-2xl border p-5 transition-all ${form.category === plan.name ? "border-primary bg-primary/5 shadow-md" : "bg-background hover:border-primary/40"}`}><div className="flex items-start justify-between gap-3"><span className="font-black text-sm leading-tight">{plan.name}</span><span className="text-primary font-black whitespace-nowrap">KSh {Number(fee).toLocaleString()}</span></div><p className="text-xs text-muted-foreground mt-2">{local?.target.slice(0, 3).join(" • ")}</p></button>})}<Link href="/admin" className="flex items-center gap-2 text-xs font-bold text-secondary hover:underline pt-2">Admin fee settings <ChevronRight className="h-3 w-3" /></Link></aside>
      <main><Card className="border-none shadow-xl overflow-hidden"><CardHeader className="bg-foreground text-white p-6 md:p-8"><div className="flex items-center justify-between gap-4"><div><p className="text-white/60 text-xs font-bold uppercase tracking-widest">Application step {step} of 4</p><CardTitle className="text-2xl mt-2 text-white">{["Personal KYC", "Business profile", "Location", "Payment & consent"][step - 1]}</CardTitle></div><div className="flex gap-2">{[1, 2, 3, 4].map((item) => <span key={item} className={`h-2 w-8 rounded-full ${item <= step ? "bg-primary" : "bg-white/20"}`} />)}</div></div></CardHeader><CardContent className="p-6 md:p-8">
        {step === 1 && <div className="space-y-5"><div className="flex gap-3 items-center mb-4"><UserRound className="text-primary" /><div><h2 className="font-black text-xl">Personal KYC</h2><p className="text-sm text-muted-foreground">Your details are used for member verification and representation.</p></div></div><Field label="Full name" value={form.fullName} onChange={(value) => update("fullName", value)} placeholder="Your legal name" /><div className="grid sm:grid-cols-2 gap-4"><SelectField label="Age bracket" value={form.ageBracket} options={["18–24", "25–34", "35–44", "45–54", "55–64", "65+"]} onChange={(value) => update("ageBracket", value)} /><SelectField label="Gender" value={form.gender} options={["Female", "Male", "Non-binary", "Prefer not to say"]} onChange={(value) => update("gender", value)} /></div><div className="grid sm:grid-cols-2 gap-4"><Field label="National ID / passport" value={form.nationalId} onChange={(value) => update("nationalId", value)} placeholder="ID number" /><Field label="Kenya phone number" value={form.phone} onChange={(value) => update("phone", value)} placeholder="0711422163" /></div><Field label="Email address" value={form.email} onChange={(value) => update("email", value)} placeholder="you@example.com" type="email" /></div>}
        {step === 2 && <div className="space-y-5"><div className="flex gap-3 items-center mb-4"><Building2 className="text-secondary" /><div><h2 className="font-black text-xl">Business KYC</h2><p className="text-sm text-muted-foreground">Tell us about the enterprise you want BNAK to support.</p></div></div><Field label="Business / trading name" value={form.businessName} onChange={(value) => update("businessName", value)} placeholder="Business name" /><div className="grid sm:grid-cols-2 gap-4"><Field label="Business type / sector" value={form.businessType} onChange={(value) => update("businessType", value)} placeholder="e.g. grocery, tailoring, boda boda" /><SelectField label="Membership category" value={form.category} options={plans.map((plan) => plan.name)} onChange={(value) => update("category", value)} /></div><div className="grid sm:grid-cols-2 gap-4"><Field label="Business registration number (optional)" value={form.businessRegistrationNumber} onChange={(value) => update("businessRegistrationNumber", value)} placeholder="If registered" /><Field label="KRA PIN (optional)" value={form.kraPin} onChange={(value) => update("kraPin", value)} placeholder="If available" /></div><div className="rounded-2xl bg-primary/5 border border-primary/10 p-5"><p className="font-black">{activePlan.name} — KSh {activePlan.fee.toLocaleString()}</p><p className="text-sm text-muted-foreground mt-2">{activePlan.target.join(" • ")}</p>{activePlan.note && <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3">{activePlan.note}</p>}</div></div>}
        {step === 3 && <div className="space-y-5"><div className="flex gap-3 items-center mb-4"><ShieldCheck className="text-primary" /><div><h2 className="font-black text-xl">Business location</h2><p className="text-sm text-muted-foreground">Help us map BNAK's network down to the local market.</p></div></div><SelectField label="County" value={form.county} options={KENYA_COUNTIES} onChange={(value) => update("county", value)} /><div className="grid sm:grid-cols-2 gap-4"><Field label="Constituency" value={form.constituency} onChange={(value) => update("constituency", value)} placeholder="Constituency" /><Field label="Ward" value={form.ward} onChange={(value) => update("ward", value)} placeholder="Ward" /></div><div className="grid sm:grid-cols-2 gap-4"><Field label="Estate / market / village" value={form.estate} onChange={(value) => update("estate", value)} placeholder="Local area" /><Field label="Business location / landmark" value={form.businessLocation} onChange={(value) => update("businessLocation", value)} placeholder="Shop, stall or landmark" /></div></div>}
        {step === 4 && <div className="space-y-6"><div className="flex gap-3 items-center mb-4"><CreditCard className="text-primary" /><div><h2 className="font-black text-xl">Payment & consent</h2><p className="text-sm text-muted-foreground">M-Pesa STK Push will be enabled after a Safaricom/Daraja connection is authorised.</p></div></div><div className="rounded-3xl bg-primary text-white p-6"><div className="flex justify-between items-start gap-4"><div><p className="text-white/70 text-sm">Selected membership</p><p className="text-2xl font-black mt-1">{activePlan.name}</p></div><p className="text-3xl font-black">KSh {activePlan.fee.toLocaleString()}</p></div><Button type="button" variant="secondary" className="mt-5" onClick={() => setPaymentState("waiting")}>Request M-Pesa payment prompt</Button><p className="text-xs text-white/70 mt-3">No payment is marked as successful here. BNAK will confirm payment after the connected provider sends a verified callback.</p></div><label className="flex gap-3 items-start text-sm"><input type="checkbox" required className="mt-1" /><span>I consent to BNAK processing my personal and business KYC details for membership verification, programme access and responsible representation.</span></label><div className="rounded-2xl border p-4 text-sm text-muted-foreground">Need help? Call <a href="tel:+254711422163" className="font-bold text-primary">0711 422 163</a> or <a href="https://wa.me/254711422163" className="font-bold text-primary">WhatsApp BNAK</a>.</div></div>}
        <div className="flex justify-between mt-10 pt-6 border-t">{step > 1 ? <Button type="button" variant="outline" onClick={() => setStep((current) => current - 1)}><ChevronLeft className="mr-2 h-4 w-4" /> Back</Button> : <span />}{step < 4 ? <Button type="button" onClick={next}>Continue <ChevronRight className="ml-2 h-4 w-4" /></Button> : <Button type="button" onClick={submit} disabled={mutation.isPending}>{mutation.isPending ? "Sending application…" : "Submit membership application"}</Button>}</div>
      </CardContent></Card></main>
    </div></div></div>;
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return <label className="space-y-2 block"><span className="text-sm font-bold">{label} <span className="text-primary">*</span></span><Input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="space-y-2 block"><span className="text-sm font-bold">{label} <span className="text-primary">*</span></span><Select value={value} onValueChange={onChange}><SelectTrigger><SelectValue placeholder={`Select ${label.toLowerCase()}`} /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></label>;
}