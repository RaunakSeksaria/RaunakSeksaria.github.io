import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { IconType } from 'react-icons';

export type SocialMediaIcon = {
  name: string;
  url: string;
  icon: IconType;
  altText: string;
  /** Shown as the mono label beside the icon. */
  handle: string;
};

/**
 * Verified with an unauthenticated HTTP check.
 *
 * Two corrections against the previous version of this file:
 *  - the GitHub URL was github.com/raunak-seksaria, which 404s; the account is
 *    github.com/RaunakSeksaria.
 *  - the Twitter entry pointed at twitter.com/raunak_seksaria, which also 404s,
 *    and no working handle was available, so it is gone rather than broken.
 *
 * The LinkedIn URL is the one resume.tex itself links to. LinkedIn answers
 * automated requests with HTTP 999, so it cannot be machine-verified.
 */
export const socialMediaIcons: SocialMediaIcon[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/RaunakSeksaria',
    handle: 'RaunakSeksaria',
    icon: FaGithub,
    altText: 'GitHub profile',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/raunak-seksaria-60435a210/',
    handle: 'raunak-seksaria',
    icon: FaLinkedin,
    altText: 'LinkedIn profile',
  },
  {
    name: 'Email',
    url: 'mailto:seksariaraunak@gmail.com',
    handle: 'seksariaraunak@gmail.com',
    icon: FaEnvelope,
    altText: 'Send an email',
  },
];
