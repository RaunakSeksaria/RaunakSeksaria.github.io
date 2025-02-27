import { IconType } from 'react-icons';
import Image from 'next/image';

interface SocialIconProps {
    name: string;
    url: string;
    imagePath?: string;
    icon?: IconType;
    altText: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ name, url, imagePath, icon: Icon, altText }) => {
    return (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block p-2 rounded-full bg-[var(--bgLight2)] hover:bg-[var(--accentColor)] transition-colors duration-300"
            aria-label={name}
        >
            {Icon ? (
                <Icon className="w-6 h-6" />
            ) : imagePath ? (
                <Image 
                    src={imagePath} 
                    alt={altText} 
                    width={24} 
                    height={24} 
                    className="w-6 h-6"
                />
            ) : (
                name.charAt(0)
            )}
        </a>
    );
};

export default SocialIcon;
