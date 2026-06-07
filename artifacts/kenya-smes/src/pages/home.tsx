import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Calendar, MapPin, Users, Briefcase, ChevronLeft } from "lucide-react";
import { 
  useGetStats, 
  useListSectors, 
  useListEvents,
  getListEventsQueryKey
} from "@workspace/api-client-react";
import { format } from "date-fns";

const HERO_SLIDES = [
  {
    image: "/images/hero-agribusiness.png",
    title: "Rooted in Agribusiness",
    description: "Growing Kenya's agricultural potential through SME empowerment and modern farming support."
  },
  {
    image: "/images/hero-textile.png",
    title: "Weaving Our Future",
    description: "Supporting local tailors and fashion designers to scale their vibrant creations."
  },
  {
    image: "/images/hero-tech.png",
    title: "Driving Digital Innovation",
    description: "Nurturing the tech startups that make Kenya the Silicon Savannah."
  },
  {
    image: "/images/hero-tourism.png",
    title: "Hospitality & Tourism",
    description: "Showcasing Kenya's beauty through world-class local tourism businesses."
  },
  {
    image: "/images/hero-retail.png",
    title: "Trade & Retail",
    description: "Empowering the merchants and shopkeepers who keep our communities running."
  },
  {
    image: "/images/hero-manufacturing.png",
    title: "Made in Kenya",
    description: "Building local manufacturing capacity for domestic and export markets."
  },
  {
    image: "/images/hero-artisanal.png",
    title: "Artisanal Crafts",
    description: "Taking Kenyan handmade artistry to the global stage."
  },
  {
    image: "/images/hero-finance.png",
    title: "Financial Inclusion",
    description: "Bringing vital financial services to every corner of the country."
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: sectors, isLoading: sectorsLoading } = useListSectors();
  const { data: events, isLoading: eventsLoading } = useListEvents(
    { upcoming: true, limit: 3 },
    { query: { enabled: true, queryKey: getListEventsQueryKey({ upcoming: true, limit: 3 }) } }
  );

  // Auto-advance hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] w-full overflow-hidden bg-black">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center container mx-auto px-4 md:px-6">
              <div className="max-w-2xl space-y-6 animate-in slide-in-from-left-8 duration-700">
                <Badge variant="outline" className="text-white border-white bg-white/10 backdrop-blur-md px-3 py-1 text-sm font-semibold tracking-wide">
                  Kenya SMEs Association
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white border-0 font-semibold" asChild>
                    <Link href="/membership">Become a Member</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white hover:text-black font-semibold backdrop-blur-sm" asChild>
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Controls */}
        <div className="absolute bottom-8 right-8 md:right-16 z-30 flex gap-4">
          <Button variant="outline" size="icon" className="rounded-full bg-black/50 text-white border-white/20 hover:bg-white hover:text-black" onClick={prevSlide}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full bg-black/50 text-white border-white/20 hover:bg-white hover:text-black" onClick={nextSlide}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-accent scale-125" : "bg-white/50 hover:bg-white/80"
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Who We Are & Stats */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">The Beating Heart of Kenya's Economy</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The Kenya SMEs Association is the premier national body representing the interests of small and medium enterprises across all 47 counties. We believe that when local businesses thrive, communities prosper and the nation grows.
              </p>
              <ul className="space-y-3 pt-4">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">Advocacy & Policy Representation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="font-medium">Capacity Building & Training</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <span className="font-medium">Grassroots Networking across 1,450 Wards</span>
                </li>
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-primary text-primary-foreground border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold">
                    {statsLoading ? <Skeleton className="h-10 w-20 bg-white/20" /> : stats?.totalMembers?.toLocaleString() || "0"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-white/90">Registered SMEs</p>
                </CardContent>
              </Card>
              <Card className="bg-secondary text-secondary-foreground border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold">
                    {statsLoading ? <Skeleton className="h-10 w-20 bg-white/20" /> : stats?.countiesCovered?.toLocaleString() || "0"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-white/90">Counties Covered</p>
                </CardContent>
              </Card>
              <Card className="bg-accent text-accent-foreground border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold">
                    {statsLoading ? <Skeleton className="h-10 w-20 bg-black/10" /> : stats?.totalCoordinators?.toLocaleString() || "0"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-black/80">Local Coordinators</p>
                </CardContent>
              </Card>
              <Card className="bg-card border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold text-foreground">
                    {statsLoading ? <Skeleton className="h-10 w-20" /> : stats?.wardsCovered?.toLocaleString() || "0"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-muted-foreground">Wards Represented</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sectors */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-foreground mb-4">Empowering Every Sector</h2>
              <p className="text-muted-foreground">From the farms to the tech hubs, we represent the diverse mosaic of Kenyan enterprise.</p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link href="/sectors">View All Sectors <ChevronRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sectorsLoading ? (
              Array(4).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : (
              sectors?.slice(0, 4).map((sector) => (
                <Card key={sector.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="h-48 overflow-hidden relative bg-muted">
                    {sector.imageUrl ? (
                      <img src={sector.imageUrl} alt={sector.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5">
                        <Briefcase className="w-12 h-12 text-primary/20" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white font-bold text-lg">{sector.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{sector.description}</p>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-foreground">{sector.totalSMEs.toLocaleString()} SMEs</span>
                      <span className="text-primary">{sector.annualContribution}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <Button variant="outline" asChild className="w-full mt-6 md:hidden">
            <Link href="/sectors">View All Sectors</Link>
          </Button>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Upcoming Events & Fairs</h2>
              <p className="text-muted-foreground">Network, learn, and grow with fellow entrepreneurs.</p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex text-primary hover:text-primary hover:bg-primary/5">
              <Link href="/events">View Calendar <ChevronRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {eventsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              events?.map((event) => (
                <Card key={event.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none">
                        {event.eventType}
                      </Badge>
                      {event.isFeatured && <Badge className="bg-accent text-accent-foreground border-none">Featured</Badge>}
                    </div>
                    <CardTitle className="text-xl leading-tight">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-3 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{format(new Date(event.eventDate), "MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{event.venue}, {event.county}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{event.currentAttendees} attendees</span>
                      </div>
                    </div>
                    <p className="text-sm line-clamp-3">{event.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/events?id=${event.id}`}>Register Now</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">Join the Movement</h2>
              <p className="text-lg md:text-xl opacity-90">
                Whether you're running a boutique in Nairobi or a farm in Nakuru, your voice matters. Become a member to access resources, funding opportunities, and policy advocacy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 font-bold" asChild>
                  <Link href="/membership">Register SME</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold" asChild>
                  <Link href="/coordinators">Become a Coordinator</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
                    <h3 className="font-bold text-xl mb-2">Network</h3>
                    <p className="text-sm opacity-80">Connect with thousands of peers across the nation.</p>
                  </div>
                  <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
                    <h3 className="font-bold text-xl mb-2">Grow</h3>
                    <p className="text-sm opacity-80">Access specialized training and capacity building.</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
                    <h3 className="font-bold text-xl mb-2">Advocate</h3>
                    <p className="text-sm opacity-80">Shape policies that affect your business sector.</p>
                  </div>
                  <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
                    <h3 className="font-bold text-xl mb-2">Fund</h3>
                    <p className="text-sm opacity-80">Discover grants and low-interest loan opportunities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
