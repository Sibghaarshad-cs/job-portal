import HowItWorks from "../components/landing/HowItWorks/HowItWorks";
import Navbar from "../components/landing/Navbar/navbar";
import Hero from "../components/landing/Hero/Hero";
import Features from "../components/landing/Features/Features";
import FeaturedJobs from "../components/landing/FeaturedJobs/FeaturedJobs";
import EmployerBanner from "../components/common/EmployerBanner"; 
import Statistics from "../components/landing/Statistics/Statistics";
import CTA from "../components/landing/CTA/CTA";
import Footer from "../components/landing/Footer/Footer";
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <FeaturedJobs />
       <EmployerBanner redirectTo="/login" />

      <HowItWorks />
      <Statistics />
      <CTA />

      <Footer />
    </>
  );
}