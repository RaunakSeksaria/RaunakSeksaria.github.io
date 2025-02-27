import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    return (
        <div id="socials" className="text-[var(--textLight1)] bg-[var(--bgLight2)] p-4 md:p-20 flex flex-wrap justify-between items-center">
            <div className="w-full md:w-2/3 p-4 md:p-10">
                <h2 id="ConnectHead" className="w-full font-dancing-script text-2xl md:text-4xl mb-6 text-center md:text-left">Let's Connect</h2>
                <div className="flex flex-wrap justify-between items-center">
                    <a href="https://github.com/RaunakSeksaria" target="_blank" rel="noopener noreferrer" className="w-1/6 flex items-center justify-center p-2">
                        <Image src="/images/logos/GitHub-Logo.png" alt="Github" width={100} height={48} className="max-w-full max-h-12" />
                    </a>
                    <a href="https://www.linkedin.com/in/raunak-seksaria-60435a210/" target="_blank" rel="noopener noreferrer" className="w-1/6 flex items-center justify-center p-2">
                        <Image src="/images/logos/linkedIn-logo.webp" alt="LinkedIn" width={100} height={48} className="max-w-full max-h-12" />
                    </a>
                    <a href="https://www.instagram.com/raunak_seksaria/" target="_blank" rel="noopener noreferrer" className="w-1/6 flex items-center justify-center p-2">
                        <Image src="/images/logos/Instagram_logo_2016.svg.webp" alt="Instagram" width={100} height={48} className="max-w-full max-h-12" />
                    </a>
                    <a href="mailto:seksariaraunak@gmail.com" target="_blank" rel="noopener noreferrer" className="w-1/6 flex items-center justify-center p-2">
                        <Image src="/images/logos/Gmail-logo.png" alt="Gmail" width={100} height={48} className="max-w-full max-h-12" />
                    </a>
                </div>
                <div className="mt-4 text-center md:text-left">
                    <p>Academic Email: raunak.seksaria@research.iiit.ac.in</p>
                    <p>Phone: +91 7003121509</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
