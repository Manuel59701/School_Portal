import React from 'react';
import logoImg from '../assets/images/crea8orz_logo.png';

export default function Crea8orzLogo({ height = 48, variant = 'dark' }) {
  // Balanced container with generous width and modest zoom
  // so no lettering or brandmark is cut off, while removing the excessive outer margin.
  const width = Math.round(height * 4.4);

  if (variant === 'light' || variant === 'on-dark') {
    return (
      <div 
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          backgroundColor: '#ffffff', 
          padding: '6px 14px', 
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0, 48, 36, 0.25)',
          border: '1.5px solid #A8F044'
        }}
      >
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img 
            src={logoImg} 
            alt="Crea8orz Academy - Innova8 • Crea8 • Eleva8" 
            style={{ 
              width: `${Math.round(width * 1.25)}px`,
              height: 'auto',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: 'none',
              pointerEvents: 'none'
            }} 
          />
        </div>
      </div>
    );
  }

  // Standard display on light / white backgrounds
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'hidden',
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
    >
      <img 
        src={logoImg} 
        alt="Crea8orz Academy - Innova8 • Crea8 • Eleva8" 
        style={{ 
          width: `${Math.round(width * 1.25)}px`,
          height: 'auto',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 'none',
          pointerEvents: 'none'
        }} 
      />
    </div>
  );
}
