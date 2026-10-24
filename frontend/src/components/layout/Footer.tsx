import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 glass mt-auto py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <span className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
              Authrix
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Authrix. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
