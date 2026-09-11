import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 border-t mt-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-white font-black text-sm">
                BN
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-black text-base text-white">BNAK</span>
                <span className="text-[10px] text-white/60 font-medium leading-none">Biashara Ndogo Association of Kenya</span>
              </div>
            </Link>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              The National Apex Voice of MSMEs in Kenya — unifying, representing, and empowering small businesses across all 47 counties, 290 constituencies, and 1,450 wards.
            </p>
            <p className="text-xs font-semibold text-primary italic">"Pamoja, Biashara Yetu, Maisha Yetu"</p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-white/60 hover:text-primary transition-colors">About BNAK</Link></li>
               <li><Link href="/sectors" className="text-sm text-white/60 hover:text-primary transition-colors">SME Sectors</Link></li>
               <li><Link href="/programs" className="text-sm text-white/60 hover:text-primary transition-colors">BNAK Programmes</Link></li>
               <li><Link href="/partners" className="text-sm text-white/60 hover:text-primary transition-colors">Partners</Link></li>
               <li><Link href="/marketplace" className="text-sm text-white/60 hover:text-primary transition-colors">Classified Market</Link></li>
              <li><Link href="/events" className="text-sm text-white/60 hover:text-primary transition-colors">Upcoming Events</Link></li>
              <li><Link href="/membership" className="text-sm text-white/60 hover:text-primary transition-colors">Become a Member</Link></li>
              <li><Link href="/coordinators" className="text-sm text-white/60 hover:text-primary transition-colors">Coordinator Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-white/60 hover:text-primary transition-colors">Policy Briefs</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-primary transition-colors">Market Insights</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-primary transition-colors">Funding Guide</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-primary transition-colors">SME Registry</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-primary transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>P.O Box 12345-00100</li>
              <li>Nairobi, Kenya</li>
               <li><a href="mailto:biasharandogoassociation@gmail.com" className="hover:text-primary transition-colors">biasharandogoassociation@gmail.com</a></li>
               <li><a href="https://biasharandogo.co.ke" className="hover:text-primary transition-colors">biasharandogo.co.ke</a></li>
               <li><a href="tel:+254711422163" className="hover:text-primary transition-colors">0711 422 163</a></li>
               <li><a href="https://wa.me/254711422163" className="hover:text-primary transition-colors">WhatsApp us</a></li>
            </ul>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2">Follow Us</p>
              <div className="flex gap-3">
                 {["Facebook", "X / Twitter", "Instagram", "LinkedIn", "TikTok"].map((s) => (
                   <a key={s} href="https://wa.me/254711422163" className="text-xs text-white/50 hover:text-primary transition-colors">{s}</a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Biashara Ndogo Association of Kenya (BNAK). All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-white/40 hover:text-primary transition-colors text-sm">Terms</a>
            <a href="#" className="text-white/40 hover:text-primary transition-colors text-sm">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
