import Image from 'next/image';
import Link from 'next/link';
import { FiFileText } from 'react-icons/fi';
import SocialIcon from './SocialIcon';
import { socialMediaIcons } from '../data/socialMedia';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    // Using icon-based links instead of image-based
    const socialLinks = socialMediaIcons;
    
    return (
        <footer className="text-[var(--textLight1)] bg-[var(--bgLight3)] py-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-8 flex flex-wrap justify-between items-start">
                    {/* Connect Section */}
                    <div className="w-full md:w-1/2 mb-6 md:mb-0">
                        <h2 className="font-dancing-script text-2xl md:text-3xl mb-4 text-center md:text-left">Let&apos;s Connect</h2>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            {socialLinks.map((social) => (
                                <SocialIcon
                                    key={social.name}
                                    name={social.name}
                                    url={social.url}
                                    imagePath={social.imagePath}
                                    icon={social.icon}
                                    altText={social.altText}
                                />
                            ))}
                        </div>
                    </div>
                    
                    {/* Quick Links */}
                    <div className="w-full md:w-1/4 mb-6 md:mb-0">
                        <h2 className="text-xl font-medium mb-4 text-center md:text-left">Quick Links</h2>
                        <ul className="flex flex-col space-y-2 items-center md:items-start">
                            <li><Link href="#about" className="hover:text-[var(--accentColor)] transition-colors">About</Link></li>
                            <li><Link href="#education" className="hover:text-[var(--accentColor)] transition-colors">Education</Link></li>
                            <li><Link href="#skills" className="hover:text-[var(--accentColor)] transition-colors">Skills</Link></li>
                            <li><Link href="#projects" className="hover:text-[var(--accentColor)] transition-colors">Projects</Link></li>
                            <li><Link href="#contact" className="hover:text-[var(--accentColor)] transition-colors">Contact</Link></li>
                            <li>
                                <a 
                                    href="/Raunak_Seksaria_CV.pdf" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center hover:text-[var(--accentColor)] transition-colors"
                                    download="Raunak_Seksaria_CV.pdf"
                                >
                                    <FiFileText className="inline mr-1" />
                                    Resume
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="w-full md:w-1/4">
                        <h2 className="text-xl font-medium mb-4 text-center md:text-left">Contact Info</h2>
                        <div className="flex flex-col space-y-2 items-center md:items-start">
                            <a href="mailto:seksariaraunak@gmail.com" className="hover:text-[var(--accentColor)] transition-colors">
                                seksariaraunak@gmail.com
                            </a>
                            <a href="mailto:raunak.seksaria@research.iiit.ac.in" className="hover:text-[var(--accentColor)] transition-colors">
                                raunak.seksaria@research.iiit.ac.in
                            </a>
                            <a href="tel:+917003121509" className="hover:text-[var(--accentColor)] transition-colors">
                                +91 7003121509
                            </a>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-[var(--bgLight2)] pt-6 mt-6 text-center text-sm opacity-80">
                    <p>© {currentYear} Raunak Seksaria. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
