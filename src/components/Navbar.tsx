'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';

interface NavbarProps {
  isScrolled?: boolean;
}

const Navbar = ({ isScrolled = false }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`${isScrolled ? 'sticky-nav' : 'bg-[var(--bgHead)]'} py-4 px-4 md:px-8 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-fira-code text-xl md:text-2xl font-bold text-[var(--bgLight4)]">
          &lt;<span className="text-[var(--accentColor)]">rs</span>/&gt;
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[var(--bgLight4)] focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="#about"
            className="text-[var(--linkColor)] hover:text-[var(--accentColor)] transition-colors duration-300"
          >
            About
          </Link>
          <Link 
            href="#education"
            className="text-[var(--linkColor)] hover:text-[var(--accentColor)] transition-colors duration-300"
          >
            Education
          </Link>
          <Link 
            href="#skills"
            className="text-[var(--linkColor)] hover:text-[var(--accentColor)] transition-colors duration-300"
          >
            Skills
          </Link>
          <Link 
            href="#projects"
            className="text-[var(--linkColor)] hover:text-[var(--accentColor)] transition-colors duration-300"
          >
            Projects
          </Link>
          <Link 
            href="#contact"
            className="text-[var(--linkColor)] hover:text-[var(--accentColor)] transition-colors duration-300"
          >
            Contact
          </Link>
          <ThemeSwitcher />
        </nav>

        {/* Mobile nav menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-[var(--bgHead)] shadow-lg z-50 p-4 md:hidden animate-fadeIn">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="#about"
                className="text-[var(--linkColor)] hover:text-[var(--accentColor)] transition-colors duration-300 py-2"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link 
                href="#education"
                className="text-[var(--linkColor)] hover:text-[var(--accentColor)] transition-colors duration-300 py-2"
                onClick={closeMenu}
              >
                Education
              </Link>
              <Link 
                href="#skills"
                className="text-[var(--linkColor)] hover:text-[var(--accentColor)] transition-colors duration-300 py-2"
                onClick={closeMenu}
              >
                Skills
              </Link>
              <Link 
                href="#projects"
                className="text-[var(--linkColor)] hover:text-[var(--accentColor)] transition-colors duration-300 py-2"
                onClick={closeMenu}
              >
                Projects
              </Link>
              <Link 
                href="#contact"
                className="text-[var(--linkColor)] hover:text-[var(--accentColor)] transition-colors duration-300 py-2"
                onClick={closeMenu}
              >
                Contact
              </Link>
              <div className="pt-2">
                <ThemeSwitcher />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
