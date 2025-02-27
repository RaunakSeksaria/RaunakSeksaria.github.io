import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Achievements from "@/components/sections/Achievements";
import Footer from "@/components/Footer";
import Education from "@/components/sections/Education";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bgLight1)]">
      <Navbar />
      <Hero />
      <main>
        <About />
        <Education />
        <Achievements />
        <Skills />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}
