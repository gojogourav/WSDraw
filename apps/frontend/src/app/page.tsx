import Navbar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Solutions from "@/components/Solutions";
import Features from "@/components/Features";
import Integrations from "@/components/Integrations";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <div className="dot-bg" />
      <Navbar />
      <Hero />
      <Solutions />
      <Features />
      <Integrations />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  );
}
