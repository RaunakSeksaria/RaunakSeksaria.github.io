'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Achievements from "@/components/sections/Achievements";
import Footer from "@/components/Footer";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";

export default function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bgLight1)]">
      <Navbar isScrolled={scrollPosition > 50} />
      <Hero />
      <main>
        <section id="about" className="scroll-mt-20">
          <About />
        </section>
        <section id="education" className="scroll-mt-20">
          <Education />
        </section>
        <section id="achievements" className="scroll-mt-20">
          <Achievements />
        </section>
        <section id="skills" className="scroll-mt-20">
          <Skills />
        </section>
        <section id="projects" className="scroll-mt-20">
          <Projects />
        </section>
        <section id="contact" className="scroll-mt-20">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
}
