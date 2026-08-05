import Navbar from "../../components/common/Navbar";
import HeroSection from "../../components/common/HeroSection";
import JobList from "../../components/common/JobList";
import EmployerBanner from "../../components/common/EmployerBanner";

export default function JobsPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Recommended Jobs */}
      <JobList />

      {/* Employer CTA */}
      <EmployerBanner />

    </main>
  );
}