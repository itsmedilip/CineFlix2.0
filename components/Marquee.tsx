import React from 'react';

interface MarqueeProps {
  text: string;
  link: string;
  icon: React.ReactNode;
}

const Marquee: React.FC<MarqueeProps> = ({ text, link, icon }) => {
  const repeatedContent = Array(4).fill(null).map((_, i) => (
      <React.Fragment key={i}>
        {icon && React.cloneElement(icon as React.ReactElement, { className: 'h-5 w-5 mx-4 flex-shrink-0' })}
        <span className="font-semibold text-sm tracking-wide mr-8 text-gray-300">{text}</span>
      </React.Fragment>
  ));
    
  return (
    <div className="bg-brand-darker group border-y border-gray-800">
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="relative flex overflow-x-hidden py-3"
      >
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {repeatedContent}
        </div>
        <div className="absolute top-0 py-3 flex items-center animate-marquee2 whitespace-nowrap">
           {repeatedContent}
        </div>
      </a>
    </div>
  );
};

export default Marquee;