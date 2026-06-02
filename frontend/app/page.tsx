import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import {
  AboutSection,
  BecomeVolunteerSection,
  CausesSection,
  HeroSection,
  ImpactStrip,
  VolunteersSection,
} from '@/components/landing';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <ImpactStrip />
      <AboutSection />
      <CausesSection />
      <VolunteersSection />
      <BecomeVolunteerSection />
      <Footer />
    </div>
  );
}
