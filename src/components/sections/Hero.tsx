import { useEffect, useState } from 'react';
import ResumeButton from '@/components/ResumeButton';
import Link from 'next/link';

const Hero = () => {
    const [typedText, setTypedText] = useState('');
    const fullText = 'Raunak.';
    const typingSpeed = 150; // ms per character
    const startDelay = 500; // ms before typing starts

    useEffect(() => {
        const timeout = setTimeout(() => {
            let currentIndex = 0;
            const typeInterval = setInterval(() => {
                if (currentIndex <= fullText.length) {
                    setTypedText(fullText.substring(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(typeInterval);
                }
            }, typingSpeed);
            
            return () => clearInterval(typeInterval);
        }, startDelay);
        
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div 
            id="beginning" 
            className="min-h-screen flex flex-col justify-center bg-[var(--bgHead)] p-4 md:p-8 relative overflow-hidden"
        >
            {/* Background decoration elements */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 blur-3xl"
                 style={{ backgroundColor: 'rgba(var(--accentColorRGB), 0.1)' }}></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full -ml-48 -mb-48 blur-3xl"
                 style={{ backgroundColor: 'rgba(var(--accentColorRGB), 0.05)' }}></div>
            
            <div className="max-w-7xl mx-auto w-full">
                <div 
                    className="font-lato uppercase px-4 md:px-0 pt-12 text-sm md:text-base text-[var(--bgLight4)]/80 
                    animate-fadeIn animate-delay-200"
                >
                    <span className="border-b-2 border-[var(--accentColor)] pb-1">A personal Portfolio Website</span>
                </div>
                
                <div className="mt-4 md:mt-8">
                    <div 
                        className="text-[8vw] md:text-8xl lg:text-9xl text-[var(--bgLight4)] font-medium font-fira-code tracking-tight"
                    >
                        <span className="typewriter">
                            <span className="typewriter-text inline-block">
                                R<span className="text-[var(--accentColor)]">au</span>nak.
                            </span>
                        </span>
                    </div>
                </div>
                
                <div 
                    className="font-fira-code text-lg md:text-xl lg:text-2xl mt-4 md:mt-6 text-[var(--bgLight4)]/80
                    animate-fadeIn animate-delay-400"
                >
                    <p className="max-w-2xl">
                        Programmer, Full-Stack Developer,<br className="md:hidden" /> Tech and AI/ML Enthusiast.
                    </p>
                </div>
                
                <div className="mt-8 md:mt-12 flex flex-col md:flex-row gap-4 animate-fadeIn animate-delay-500">
                    <Link href="#contact" className="btn-primary">
                        Contact Me
                    </Link>
                    <ResumeButton variant="outline" />
                </div>
                
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accentColor)]">
                        <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Hero;
