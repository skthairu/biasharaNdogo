import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-muted py-12 border-t mt-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                K
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                Kenya SMEs
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              The national body representing Small and Medium Enterprises across Kenya's 47 counties, 290 constituencies, and 1,450 wards.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/sectors" className="text-sm text-muted-foreground hover:text-primary transition-colors">SME Sectors</Link></li>
              <li><Link href="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">Upcoming Events</Link></li>
              <li><Link href="/membership" className="text-sm text-muted-foreground hover:text-primary transition-colors">Become a Member</Link></li>
              <li><Link href="/coordinators" className="text-sm text-muted-foreground hover:text-primary transition-colors">Coordinator Portal</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Policy Briefs</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Market Insights</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Funding Guide</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>P.O Box 12345-00100</li>
              <li>Nairobi, Kenya</li>
              <li><a href="mailto:info@kenyasmes.org" className="hover:text-primary transition-colors">info@kenyasmes.org</a></li>
              <li>+254 700 000 000</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Kenya SMEs Association. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
