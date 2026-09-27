import React from 'react';
import logoImg from '../assets/images/crea8orz_logo.png';

// Official Crea8orz Logo using the user's uploaded brand image
export default function Crea8orzLogo({ height = 44, variant = 'dark' }) {
  // If placed on a dark background (#003024 / #00221a), provide a sleek white pill container so the dark-green logo is crisp and punchy
  if (variant === 'light' || variant === 'on-dark') {
    return (
      <div 
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          backgroundColor: '#ffffff', 
          padding: '4px 14px', 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 48, 36, 0.25)',
          border: '1.5px solid #A8F044'
        }}
      >
        <img 
          src={logoImg} 
          alt="Crea8orz Academy - Innova8 • Crea8 • Eleva8" 
          style={{ 
            height: `${height}px`, 
            width: 'auto', 
            objectFit: 'contain',
            display: 'block' 
          }} 
        />
      </div>
    );
  }

  // Standard display on white / neutral light backgrounds
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      <img 
        src={logoImg} 
        alt="Crea8orz Academy - Innova8 • Crea8 • Eleva8" 
        style={{ 
          height: `${height}px`, 
          width: 'auto', 
          objectFit: 'contain',
          display: 'block'
        }} 
      />
    </div>
  );
}
