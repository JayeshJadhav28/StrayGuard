import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
