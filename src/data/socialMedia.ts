import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { IconType } from 'react-icons';

// Type definition for social media links
export type SocialMediaLink = {
  name: string;
  url: string;
  imagePath?: string;
  altText: string;
};

// Type definition for social media icons
export type SocialMediaIcon = {
  name: string;
  url: string;
  imagePath?: string;
  icon?: IconType;
  altText: string;
};

// Icons using react-icons
export const socialMediaIcons: SocialMediaIcon[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/raunak-seksaria',
    icon: FaGithub,
    altText: 'GitHub'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/raunak-seksaria/',
    icon: FaLinkedin,
    altText: 'LinkedIn'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/raunak_seksaria',
    icon: FaTwitter,
    altText: 'Twitter'
  },
  {
    name: 'Email',
    url: 'mailto:seksariaraunak@gmail.com',
    icon: FaEnvelope,
    altText: 'Email'
  }
];
