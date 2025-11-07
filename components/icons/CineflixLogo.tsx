import React from 'react';

export const CineflixLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    viewBox="0 0 200 50"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="CineFlix Logo"
  >
    <text
      x="10"
      y="38"
      fontFamily="'Bebas Neue', sans-serif"
      fontSize="40"
      fontWeight="400"
      fill="#E50914"
      textAnchor="start"
      letterSpacing="3"
    >
      CINEFLIX
    </text>
  </svg>
);