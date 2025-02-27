'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
        <Link href="/" className="flex items-center">
          <Image 
            src="/images/personal_logo_4.png"
            alt="Raunak Seksaria Logo"
            width={40}
            height={40}
            className="h-8 md:h-10 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center space-x-4 md:hidden">
          {/* Theme switcher for mobile - always visible */}
          <div className="flex items-center my-auto">
            <ThemeSwitcher />
          </div>
          
          {/* Mobile menu button */}
          <button
            className="text-[var(--bgLight4)] focus:outline-none"
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
        </div>

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
          <div className="flex items-center my-auto">
            <ThemeSwitcher />
          </div>
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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
