
import React from 'react';
import { FacebookIcon } from './icons/FacebookIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { YoutubeIcon } from './icons/YoutubeIcon';
import { TelegramIcon } from './icons/TelegramIcon';

interface FooterProps {
  onNavigateStatic: (key: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateStatic }) => {
  const socialLinks = [
    { Icon: TelegramIcon, href: 'https://t.me/CineflixMoviesOfficial', label: 'Telegram' },
    { Icon: FacebookIcon, href: '#', label: 'Facebook' },
    { Icon: InstagramIcon, href: '#', label: 'Instagram' },
    { Icon: TwitterIcon, href: '#', label: 'Twitter' },
    { Icon: YoutubeIcon, href: '#', label: 'YouTube' },
  ];

  const footerLinks = [
    [
      { label: 'FAQ', key: 'faq' },
      { label: 'About Us', key: 'about-us' },
      { label: 'Contact Us', key: 'contact-us' },
    ],
    [
      { label: 'Account', key: 'account' },
      { label: 'Terms of Service', key: 'terms-of-service' },
      { label: 'Privacy Policy', key: 'privacy-policy' },
    ],
    [
      { label: 'Legal', key: 'legal' },
      { label: 'Cookie Policy', key: 'cookie-policy' },
      { label: 'DMCA', key: 'dmca' },
    ],
  ];

  return (
    <footer className="bg-brand-darker text-gray-400 py-12 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-4 mb-8">
          {socialLinks.map(({ Icon, href, label }) => (
            <a key={label} href={href} aria-label={label} className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
              <Icon className="h-6 w-6" />
            </a>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          {footerLinks.map((column, colIndex) => (
            <div key={colIndex}>
              <ul className="space-y-3">
                {column.map((link) => (
                   <li key={link.key}>
                    <button onClick={() => onNavigateStatic(link.key)} className="hover:underline text-left">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-8">&copy; {new Date().getFullYear()} CineFlix. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;