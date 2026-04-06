import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Zap, PenTool, CheckCircle } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex-1">
        {/* Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/20 to-transparent opacity-50 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
              AI Detection & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Humanization</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Detect AI-generated text with sentence-level precision, check for plagiarism, and rewrite content to sound authentically human—all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 text-base font-semibold shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-14 px-8 text-base font-semibold glass border-white/10 hover:bg-white/5">
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-neutral-900/50 border-t border-white/5 relative">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Everything you need in one powerful suite</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Built for creators, educators, and professionals who demand authenticity.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard 
              icon={<ShieldAlert className="w-6 h-6 text-red-400" />}
              title="AI Detection"
              description="Identify AI-generated content instantly with our advanced detection model that highlights specific sentences."
              borderColor="border-red-500/20"
            />
            <FeatureCard 
              icon={<CheckCircle className="w-6 h-6 text-green-400" />}
              title="Plagiarism Checker"
              description="Scan billions of web pages to ensure your content is 100% original and properly cited."
              borderColor="border-green-500/20"
            />
            <FeatureCard 
              icon={<PenTool className="w-6 h-6 text-primary" />}
              title="AI Humanizer"
              description="Rewrite stiff, robotic text into natural, human-sounding content with customizable tone options."
              borderColor="border-primary/20"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description, borderColor }: { icon: React.ReactNode, title: string, description: string, borderColor: string }) {
  return (
    <div className={`glass-card p-8 rounded-2xl border-t-2 ${borderColor} hover:bg-neutral-800/50 transition-colors`}>
      <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
