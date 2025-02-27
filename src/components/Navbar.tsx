'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check for user preference in localStorage or system preference
        const storedDarkMode = localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(storedDarkMode);
        
        if (storedDarkMode) {
            document.body.classList.add('dark-mode');
        }
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleMode = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', (!isDarkMode).toString());
    };

    return (
        <nav className="topNav bg-[var(--bgHeader)] overflow-hidden w-full">
            <div className="flex justify-between items-center p-4 md:p-0 w-full">
                <div className="flex items-center md:hidden">
                    <button id="toggleButton" className="text-[var(--textLight1)] focus:outline-none" onClick={toggleMenu}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>
                <ul className={`${isMenuOpen ? 'block' : 'hidden'} md:flex flex-col md:flex-row md:space-x-4 w-full md:w-auto`} id="menu">
                    <li className="list-none">
                        <Link href="#about" className="block text-[var(--textLight1)] text-center py-6 px-9 text-lg hover:bg-[var(--bgLight1)] hover:text-[var(--bgLight4)]" onClick={toggleMenu}>About Me</Link>
                    </li>
                    <li className="list-none">
                        <Link href="#edu" className="block text-[var(--textLight1)] text-center py-6 px-9 text-lg hover:bg-[var(--bgLight1)] hover:text-[var(--bgLight4)]" onClick={toggleMenu}>Educational Background</Link>
                    </li>
                    <li className="list-none">
                        <Link href="#achievements" className="block text-[var(--textLight1)] text-center py-6 px-9 text-lg hover:bg-[var(--bgLight1)] hover:text-[var(--bgLight4)]" onClick={toggleMenu}>Achievements</Link>
                    </li>
                    <li className="list-none">
                        <Link href="#skills" className="block text-[var(--textLight1)] text-center py-6 px-9 text-lg hover:bg-[var(--bgLight1)] hover:text-[var(--bgLight4)]" onClick={toggleMenu}>Skill Set</Link>
                    </li>
                    <li className="list-none">
                        <a href="/Raunak_Seksaria_CV.pdf" download className="block text-[var(--textLight1)] text-center py-6 px-9 text-lg hover:bg-[var(--bgLight1)] hover:text-[var(--bgLight4)]" onClick={toggleMenu}>Download CV</a>
                    </li>
                </ul>
                <div className="flex items-center ml-auto">
                    <input 
                        type="checkbox" 
                        className="checkbox hidden" 
                        id="checkbox" 
                        checked={isDarkMode}
                        onChange={toggleMode}
                    />
                    <label htmlFor="checkbox" className="checkbox-label flex items-center cursor-pointer ml-4">
                        <span className="ball"></span>
                    </label>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
