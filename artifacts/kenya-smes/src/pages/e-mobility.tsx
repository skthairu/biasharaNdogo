import { Zap, MapPin, BatteryCharging, Leaf, Briefcase, ChevronRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function EMobility() {
  return (
    <div className="min-h-screen bg-muted/20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-black flex items-center flag-border-bottom">
        <div className="absolute inset-0 z-0">
          <img src="/images/e-mobility-boda.png" alt="E-Boda" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
        </div>
        
        <div className="app-shell relative z-10">
          <div className="max-w-3xl">
            <Badge className="bg-emerald-500 text-white border-0 font-bold mb-4 px-3 py-1 flex w-max items-center gap-2" data-testid="badge-emobility">
              <Zap className="w-4 h-4" /> BNAK E-MOBILITY & GREEN ECONOMY
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
              The Future of Transport is Clean & Electric
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8">
              BNAK connects operators, owners, and SMEs to the evolving electric mobility network in Kenya. Lower running costs, better margins, and a cleaner environment.
            </p>
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-8" asChild data-testid="button-emobility-join">
              <Link href="/membership">Register as an Operator</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Notice */}
      <section className="app-shell py-8">
        <div className="bg-card border border-border rounded-xl p-4 flex gap-3 text-sm shadow-sm max-w-4xl mx-auto">
          <Briefcase className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Platform Notice:</strong> BNAK acts as a connector, advocate, and information platform for the informal sector. We are not a direct lender, manufacturer, or vehicle provider. We connect our members to verified partners.
          </p>
        </div>
      </section>

      {/* Vehicle Categories */}
      <section className="py-12 bg-background border-y">
        <div className="app-shell">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-4">The E-Mobility Ecosystem</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Exploring the segments transforming the transport industry across Kenyan roads.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* E-Boda */}
            <Card className="overflow-hidden border-border group hover:border-emerald-500/30 transition-all shadow-sm" data-testid="card-emobility-boda">
              <div className="h-48 overflow-hidden relative">
                <img src="/images/e-mobility-boda.png" alt="Electric Boda" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap className="w-5 h-5 text-emerald-500" /> E-Boda (Motorcycles)</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  The fastest-growing segment. Electric bodas offer up to 40% lower operating costs, saving riders money on fuel and maintenance through battery-swapping networks.
                </p>
              </CardContent>
            </Card>

            {/* E-Matatu */}
            <Card className="overflow-hidden border-border group hover:border-emerald-500/30 transition-all shadow-sm" data-testid="card-emobility-matatu">
              <div className="h-48 overflow-hidden relative">
                <img src="/images/e-mobility-matatu.png" alt="Electric Matatu" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap className="w-5 h-5 text-emerald-500" /> E-Matatu & E-Bus</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Pioneering public transport. Silent, emission-free commutes with structured charging depots designed to keep fleets moving profitably.
                </p>
              </CardContent>
            </Card>

            {/* Commercial */}
            <Card className="overflow-hidden border-border group hover:border-emerald-500/30 transition-all shadow-sm" data-testid="card-emobility-commercial">
              <div className="h-48 bg-muted flex items-center justify-center">
                 <Briefcase className="w-16 h-16 text-muted-foreground/30" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap className="w-5 h-5 text-emerald-500" /> E-Tuktuk & Commercial</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Last-mile delivery and localized transit. Electric 3-wheelers and light trucks lower logistics costs for SMEs delivering goods.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Infrastructure & Opportunities */}
      <section className="py-20">
        <div className="app-shell max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 font-bold uppercase tracking-wider">Beyond the Vehicles</Badge>
              <h2 className="text-3xl md:text-4xl font-black leading-tight">Infrastructure & New Business Opportunities</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The shift to electric creates entirely new value chains. BNAK advocates for SME inclusion in this emerging infrastructure.
              </p>
              
              <ul className="space-y-4 pt-4">
                {[
                  { title: "Charging & Battery Swap Networks", text: "New businesses acting as nodes for riders to swap batteries instantly.", icon: BatteryCharging },
                  { title: "Finance Finder Concept", text: "Connecting members to green financiers offering asset-backed loans for EVs.", icon: Briefcase },
                  { title: "Green Jobs & Skills", text: "Training mechanics, technicians, and operators for the electric era.", icon: CheckCircle2 }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-card border p-6 rounded-3xl shadow-sm">
                  <h4 className="font-black text-3xl text-emerald-600 mb-2">40%</h4>
                  <p className="text-sm font-medium">Potential reduction in daily operating costs for riders.</p>
                </div>
                <img src="/images/e-mobility-boda.png" alt="Details" className="w-full h-48 object-cover rounded-3xl" />
              </div>
              <div className="space-y-4 pt-8">
                 <img src="/images/e-mobility-matatu.png" alt="Details" className="w-full h-48 object-cover rounded-3xl" />
                 <div className="bg-foreground text-background p-6 rounded-3xl shadow-sm">
                  <Leaf className="w-8 h-8 text-emerald-400 mb-4" />
                  <p className="text-sm font-medium">Zero tailpipe emissions, leading to healthier streets and markets.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Business Environment */}
      <section className="relative py-24 overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0">
          <img src="/images/clean-business-market.png" alt="Clean Market" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>
        
        <div className="app-shell relative z-10 text-center max-w-3xl mx-auto">
          <Leaf className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black mb-6">Clean Business Environments</h2>
          <p className="text-lg text-white/80 leading-relaxed mb-8">
            A thriving business requires a healthy environment. BNAK advocates for improved sanitation, structured waste management, and sustainable practices in local markets across Kenya.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
             <Button variant="outline" className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 font-bold" asChild data-testid="button-emobility-contact">
              <a href="https://wa.me/254711422163" target="_blank" rel="noreferrer">
                Discuss E-Mobility Initiatives
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}