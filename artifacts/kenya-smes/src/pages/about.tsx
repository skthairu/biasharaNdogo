import { Link } from "wouter";
import { useGetStats } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { KENYA_COUNTIES } from "@/lib/constants";

export default function About() {
  const { data: stats } = useGetStats();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Championing Kenya's Everyday Entrepreneurs</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We are the unified voice of Small and Medium Enterprises across Kenya. From the bustling streets of Nairobi to the agricultural heartlands of the Rift Valley, we exist to ensure that every entrepreneur has the support, advocacy, and resources they need to thrive.
            </p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To foster an enabling environment for Kenyan SMEs through robust advocacy, capacity building, market linkages, and access to finance, driving sustainable economic growth and job creation across all 47 counties.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-secondary">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A globally competitive and innovative SME sector that serves as the primary engine for Kenya's socioeconomic transformation and prosperity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide our work and our commitment to the entrepreneurs we serve.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Integrity", desc: "We operate with transparency, accountability, and honesty in all our engagements." },
              { title: "Inclusivity", desc: "We ensure representation from every county, sector, and demographic, leaving no SME behind." },
              { title: "Innovation", desc: "We embrace new ideas, technologies, and approaches to solve challenges." },
              { title: "Resilience", desc: "Like the businesses we represent, we are adaptable and steadfast in the face of adversity." }
            ].map((value, i) => (
              <Card key={i} className="border-none shadow-sm bg-background">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">National Reach, Grassroots Impact</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our strength lies in our structure. We don't just sit in boardrooms in the capital; our network of coordinators ensures that policies and programs reach the ward level.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                    47
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Counties</h4>
                    <p className="text-muted-foreground">Full national coverage</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-bold text-2xl">
                    290
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Constituencies</h4>
                    <p className="text-muted-foreground">Regional representation</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center text-accent-foreground font-bold text-2xl">
                    1.4k
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Wards</h4>
                    <p className="text-muted-foreground">True grassroots connection</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t">
                <Button asChild size="lg" className="bg-primary text-white">
                  <Link href="/coordinators">Become a Local Coordinator</Link>
                </Button>
              </div>
            </div>

            <div className="bg-muted rounded-3xl p-8 border">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                <MapPin className="text-primary" /> Active Counties
              </h3>
              <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {KENYA_COUNTIES.map((county) => (
                  <span key={county} className="px-3 py-1.5 bg-background border rounded-full text-sm font-medium text-foreground">
                    {county}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
