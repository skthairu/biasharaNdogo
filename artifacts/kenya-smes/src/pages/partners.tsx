import { Handshake, Landmark, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const types = [
  ["Strategic Partner", "Long-term institutions aligned to BNAK's national MSME mandate."],
  ["Programme Partner", "Co-design and deliver practical support through BNAK programmes."],
  ["Implementing Partner", "Bring trusted county, market and grassroots delivery capacity."],
  ["Funding Partner", "Finance inclusive enterprise growth, research and market access."],
  ["Sponsor", "Support events, campaigns and visibility for Kenyan entrepreneurs."],
  ["Technical Partner", "Offer technology, systems and expert implementation support."],
  ["Knowledge Partner", "Share research, training, standards and practical enterprise knowledge."],
  ["Market Partner", "Open routes to buyers, supply chains, distributors and new markets."],
];

const institutions = ["IEBC", "Kenya Revenue Authority", "National Cohesion and Integration Commission"];

export default function Partners() {
  return (
    <div className="min-h-screen bg-muted/30">
      <section className="bg-foreground text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <Badge className="bg-primary text-white border-0 mb-4">BNAK PARTNERS</Badge>
          <h1 className="text-4xl md:text-6xl font-black max-w-3xl">Partnerships that move biashara forward.</h1>
          <p className="mt-5 text-white/70 text-lg max-w-2xl">BNAK convenes public, private and community partners to make enterprise support practical, trusted and accessible at market level.</p>
        </div>
      </section>
      <section className="py-16 container mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div><p className="text-sm font-bold uppercase tracking-widest text-primary">Partnership types</p><h2 className="text-3xl font-black mt-2">Find your place in the ecosystem</h2></div>
          <Button asChild className="hidden sm:flex"><a href="mailto:biasharandogoassociation@gmail.com?subject=BNAK%20Partnership%20Enquiry">Partner with BNAK <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {types.map(([title, body], index) => (
            <Card key={title} className="border-border hover:border-primary/50 hover:-translate-y-1 transition-all">
              <CardHeader><div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2"><Handshake className="h-5 w-5" /></div><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{body}</p><span className="mt-5 block text-xs font-bold text-primary">0{index + 1} / BNAK ecosystem</span></CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="py-16 bg-background border-y">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-[1fr_1.4fr] gap-10 items-center">
          <div><p className="text-sm font-bold uppercase tracking-widest text-secondary">Institutional collaboration</p><h2 className="text-3xl font-black mt-2">Trusted partners for a stronger formal and informal economy</h2><p className="text-muted-foreground mt-4">BNAK's partner network supports civic education, tax awareness, cohesion, compliance and market opportunity.</p></div>
          <div className="grid sm:grid-cols-3 gap-4">{institutions.map((name) => <div key={name} className="rounded-2xl border bg-card p-5 min-h-32 flex flex-col justify-between"><Landmark className="h-6 w-6 text-secondary" /><span className="font-bold text-sm">{name}</span></div>)}</div>
        </div>
      </section>
    </div>
  );
}