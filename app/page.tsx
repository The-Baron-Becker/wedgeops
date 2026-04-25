import Hero from "@/components/wedgeops/Hero";
import Features from "@/components/wedgeops/Features";
import HowItWorks from "@/components/wedgeops/HowItWorks";
import Dashboard from "@/components/wedgeops/Dashboard";
import Compare from "@/components/wedgeops/Compare";
import Testimonials from "@/components/wedgeops/Testimonials";
import Pricing from "@/components/wedgeops/Pricing";
import FAQ from "@/components/wedgeops/FAQ";
import WaitlistCTA from "@/components/wedgeops/WaitlistCTA";
import SiteHeader from "@/components/wedgeops/SiteHeader";
import SiteFooter from "@/components/wedgeops/SiteFooter";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <SiteHeader />
      <main id="main" className="flex flex-col">
        <Hero />
        <Features />
        <HowItWorks />
        <Dashboard />
        <Compare />
        <Testimonials />
        <Pricing />
        <FAQ />
        <WaitlistCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
