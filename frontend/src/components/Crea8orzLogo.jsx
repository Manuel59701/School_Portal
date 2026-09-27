import React from 'react';
import logoImg from '../assets/images/crea8orz_logo.png';

export default function Crea8orzLogo({ height = 48, variant = 'dark' }) {
  // The original image has significant square whitespace around the logo.
  // We use a tight container with overflow:hidden and a zoomed/centered image 
  // to crop directly to the brandmark, making it prominently visible.

  // Target aspect ratio of the actual mark is ~ 4.8 : 1
  const width = Math.round(height * 4.6);

  if (variant === 'light' || variant === 'on-dark') {
    return (
      <div 
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          backgroundColor: '#ffffff', 
          padding: '6px 16px', 
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
              width: `${Math.round(width * 1.55)}px`,
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
          width: `${Math.round(width * 1.55)}px`,
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
