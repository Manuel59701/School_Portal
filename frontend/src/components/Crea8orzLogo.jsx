import React from 'react';

// Custom SVG Logo for Crea8orz Academy (matching the user's brandmark)
export default function Crea8orzLogo({ size = 36, textColor = "#003024", accentColor = "#A8F044", showMotto = false }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
      {/* Brand Icon SVG: The 8-shape icon from the brandmark */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <rect width="100" height="100" rx="26" fill="#003024" />
        {/* Upper rounded loop */}
        <path d="M30 46C24 46 22 41 22 34C22 25 32 20 50 20C68 20 78 25 78 34C78 41 76 46 70 46H30Z" fill="#A8F044" />
        {/* Lower loop */}
        <path d="M30 54H70C76 54 78 59 78 66C78 75 68 80 50 80C32 80 22 75 22 66C22 59 24 54 30 54Z" fill="#A8F044" />
        {/* Center cutout intersection */}
        <ellipse cx="50" cy="33" rx="14" ry="6" fill="#003024" />
        <ellipse cx="50" cy="67" rx="14" ry="6" fill="#003024" />
      </svg>

      <div>
        <div style={{ 
          fontFamily: "'Outfit', sans-serif", 
          fontWeight: 800, 
          fontSize: `${size * 0.52}px`, 
          color: textColor, 
          letterSpacing: '0.04em',
          lineHeight: 1
        }}>
          CREA<span style={{ color: accentColor === textColor ? '#A8F044' : accentColor }}>8</span>ORZ
        </div>
        <div style={{ 
          fontSize: `${size * 0.24}px`, 
          color: textColor === '#ffffff' ? '#A8F044' : '#003024', 
          fontWeight: 700, 
          letterSpacing: '0.12em', 
          textTransform: 'uppercase',
          marginTop: '2px'
        }}>
          ACADEMY
        </div>
        {showMotto && (
          <div style={{ fontSize: `${size * 0.18}px`, fontStyle: 'italic', color: '#5e7970', letterSpacing: '0.08em', marginTop: '2px' }}>
            Innova8 . Crea8 . Eleva8
          </div>
        )}
      </div>
    </div>
  );
}
