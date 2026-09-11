import { useMemo, useState } from "react";
import { Search, MapPin, Phone, BadgeCheck, Plus, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const listings = [
  { title: "Fresh Farm Produce Basket", seller: "Mama Njeri Fresh Foods", category: "Food & Grocery", county: "Kiambu", price: "KSh 1,500", image: "/images/hero-agribusiness.png" },
  { title: "Quality Mitumba Bales", seller: "Pamoja Fashion Traders", category: "Clothing & Fashion", county: "Nairobi", price: "KSh 18,000", image: "/images/hero-textile.png" },
  { title: "Solar Phone Charging Kit", seller: "Mwangaza Digital Shop", category: "Electronics", county: "Kisumu", price: "KSh 4,500", image: "/images/hero-tech.png" },
  { title: "Handmade Beaded Baskets", seller: "Soko Creative Collective", category: "Crafts & Gifts", county: "Kajiado", price: "From KSh 800", image: "/images/hero-artisanal.png" },
  { title: "Wholesale Cooking Gas Accessories", seller: "Safe Gas Suppliers", category: "Fuel & Energy", county: "Mombasa", price: "KSh 2,200", image: "/images/hero-manufacturing.png" },
  { title: "Office & Home Cleaning Service", seller: "Jirani Clean Team", category: "Services", county: "Nakuru", price: "Request quote", image: "/images/hero-retail.png" },
];

export default function Marketplace() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(listings.map((item) => item.category)))];
  const filtered = useMemo(() => listings.filter((item) => (category === "All" || item.category === category) && `${item.title} ${item.seller} ${item.county}`.toLowerCase().includes(query.toLowerCase())), [query, category]);
  return (
    <div className="min-h-screen bg-muted/30">
      <section className="bg-foreground text-white py-16"><div className="container mx-auto px-4 md:px-6"><Badge className="bg-primary text-white border-0 mb-4">BNAK CLASSIFIED MARKET</Badge><h1 className="text-4xl md:text-6xl font-black max-w-3xl">A market built for Kenyan businesses.</h1><p className="mt-4 text-white/70 text-lg max-w-2xl">Discover products and services from registered BNAK members. Visitors can browse; verified members can list.</p></div></section>
      <section className="py-10 container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-3 mb-8"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, services, sellers or counties" className="pl-10 h-11 bg-background" /></div><div className="flex gap-2 overflow-x-auto pb-1">{categories.map((item) => <Button key={item} variant={category === item ? "default" : "outline"} onClick={() => setCategory(item)} className="whitespace-nowrap">{item}</Button>)}</div><Button asChild variant="outline" className="h-11"><Link href="/membership"><Plus className="mr-2 h-4 w-4" /> List your biashara</Link></Button></div>
        <div className="flex items-center justify-between mb-5"><p className="text-sm text-muted-foreground">{filtered.length} listings in the BNAK market</p><Button variant="ghost" size="sm"><SlidersHorizontal className="mr-2 h-4 w-4" /> More filters</Button></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{filtered.map((item) => <Card key={item.title} className="overflow-hidden group hover:shadow-lg transition-shadow"><div className="h-48 overflow-hidden relative"><img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><Badge className="absolute top-3 left-3 bg-white text-foreground">{item.category}</Badge></div><CardHeader className="pb-2"><div className="flex justify-between gap-3"><CardTitle className="text-lg">{item.title}</CardTitle><span className="text-primary font-black text-sm whitespace-nowrap">{item.price}</span></div></CardHeader><CardContent className="space-y-2"><p className="text-sm font-semibold flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-secondary" /> {item.seller}</p><p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {item.county}, Kenya</p></CardContent><CardFooter><Button className="w-full" variant="outline" asChild><a href="https://wa.me/254711422163?text=Hello%20BNAK%20market%20seller"><Phone className="mr-2 h-4 w-4" /> Enquire on WhatsApp</a></Button></CardFooter></Card>)}</div>
        {filtered.length === 0 && <div className="text-center py-20"><p className="font-bold text-lg">No listings match your search.</p><p className="text-muted-foreground mt-2">Try another keyword or browse all categories.</p></div>}
      </section>
    </div>
  );
}