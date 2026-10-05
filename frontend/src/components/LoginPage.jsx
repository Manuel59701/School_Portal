import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Lock,
  User,
  ShieldAlert,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import Crea8orzLogo from './Crea8orzLogo';
import { buildRoster, classKeyFromStudentId, ROSTER_MIN, ROSTER_MAX } from '../lib/academics';
import hero1 from '../assets/images/hero1.jpg';
import hero2 from '../assets/images/hero2.jpg';

const DEMO_CLASS = 'SSS 2 A';
const DEMO_STUDENT = buildRoster(DEMO_CLASS)[0];
const STUDENT_TEST_PASSWORD = 'test123';

/* ─── Slideshow scenes ───────────────────────────────────────────── */
const SLIDES = [
  {
    image: hero1,
    tag: 'Aerial Campus View',
    tagEmoji: '🛸',
    title: 'Crea8orz Academy',
    subtitle: 'A world-class campus nestled in the heart of Lagos — innovation architecture meets lush greenery.',
    kenBurns: 'kbZoomOut',
    overlay: 'rgba(0,34,26,0.55)'
  },
  {
    image: hero2,
    tag: 'Computer & ICT Lab',
    tagEmoji: '💻',
    title: 'Digital Pioneers',
    subtitle: 'Students code, design AI models, and build web apps in our cutting-edge ICT suites.',
    kenBurns: 'kbPanRight',
    overlay: 'rgba(0,34,26,0.52)'
  },
  {
    image: hero1,
    tag: 'Chemistry & Physics Labs',
    tagEmoji: '⚗️',
    title: 'Science Explorers',
    subtitle: 'Hands-on experiments in fully equipped chemistry and physics labs — safety-certified and world-standard.',
    kenBurns: 'kbZoomIn',
    overlay: 'rgba(0,34,26,0.58)'
  },
  {
    image: hero2,
    tag: 'Biology Lab',
    tagEmoji: '🔬',
    title: 'Future Scientists',
    subtitle: "Microscopes, anatomical models, and live lab work forming Nigeria's next generation of doctors.",
    kenBurns: 'kbPanLeft',
    overlay: 'rgba(0,34,26,0.52)'
  },
  {
    image: hero1,
    tag: 'Sports & Athletics',
    tagEmoji: '🏃',
    title: 'Champions in the Making',
    subtitle: 'From football and track to swimming and chess — our athletes wear green and lime with pride on every field.',
    kenBurns: 'kbZoomOut',
    overlay: 'rgba(0,34,26,0.50)'
  }
];

const LOGIN_CSS = `
@keyframes kbZoomIn {
  0%   { transform: scale(1.0); }
  100% { transform: scale(1.18) translate(-2%, -2%); }
}
@keyframes kbZoomOut {
  0%   { transform: scale(1.18); }
  100% { transform: scale(1.0) translate(2%, 1%); }
}
@keyframes kbPanRight {
  0%   { transform: scale(1.12) translate(-4%, 0); }
  100% { transform: scale(1.12) translate(2%, -1%); }
}
@keyframes kbPanLeft {
  0%   { transform: scale(1.12) translate(3%, 0); }
  100% { transform: scale(1.12) translate(-3%, 1%); }
}
@keyframes captionIn {
  0%   { opacity: 0; transform: translateY(18px); }
  100% { opacity: 1; transform: translateY(0); }
}
.lgn-slide-panel { display: block !important; }
.lgn-mob-header  { display: none !important; }
@media (max-width: 860px) {
  .lgn-slide-panel { display: none !important; }
  .lgn-mob-header  { display: flex !important; }
}
.lgn-arrow:hover { background-color: rgba(168,240,68,0.2) !important; border-color: #A8F044 !important; }
.lgn-demo:hover  { border-color: #003024 !important; }
`;

export default function LoginPage({ onBackToHome, onLoginSuccess }) {
  const [role, setRole]                 = useState('student');
  const [identifier, setIdentifier]     = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animKey, setAnimKey]           = useState(0);

  // Inject Ken Burns + responsive CSS once
  useEffect(() => {
    if (!document.getElementById('lgn-css')) {
      const s = document.createElement('style');
      s.id = 'lgn-css';
      s.textContent = LOGIN_CSS;
      document.head.appendChild(s);
    }
  }, []);

  // Auto-advance slideshow every 6s
  useEffect(() => {
    const t = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
      setAnimKey(k => k + 1);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const goTo = (idx) => { setCurrentSlide(idx); setAnimKey(k => k + 1); };
  const prev = () => goTo((currentSlide - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((currentSlide + 1) % SLIDES.length);

  const handleQuickDemo = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'student') {
      setIdentifier(DEMO_STUDENT.studentId);
      setPassword(STUDENT_TEST_PASSWORD);
    } else if (selectedRole === 'teacher') {
      setIdentifier('sarah.adebayo@crea8orz.academy');
      setPassword('teacher123');
    } else if (selectedRole === 'admin') {
      setIdentifier('admin@crea8orz.academy');
      setPassword('admin123');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, role })
      });

      const data = await res.json().catch(() => null);

      if (data && data.success) {
        onLoginSuccess({
          user: data.user,
          role: data.user.role,
          token: data.token
        });
      } else {
        authenticateOffline(role, identifier, password);
      }
    } catch (err) {
      authenticateOffline(role, identifier, password);
    } finally {
      setLoading(false);
    }
  };

  const authenticateOffline = (selectedRole, ident, pass) => {
    if (selectedRole === 'admin') {
      if (ident.toLowerCase().includes('admin') || ident.includes('crea8orz')) {
        onLoginSuccess({
          user: { id: 99, name: "System Administrator", email: ident, role: "admin" },
          role: "admin",
          token: "admin-offline-token"
        });
        return;
      }
    } else if (selectedRole === 'teacher') {
      if (ident.includes('@') || ident.toLowerCase().includes('teacher') || ident.includes('sarah') || ident.includes('adebayo')) {
        onLoginSuccess({
          user: { 
            id: 1, 
            name: "Dr. Sarah Adebayo", 
            email: ident, 
            role: "teacher",
            subject: "Mathematics",
            assignedClass: "JSS 2 A"
          },
          role: "teacher",
          token: "teacher-offline-token"
        });
        return;
      }
    } else if (selectedRole === 'student') {
      if (pass !== STUDENT_TEST_PASSWORD) {
        setError(`Invalid password. All students currently use the test password: ${STUDENT_TEST_PASSWORD}`);
        return;
      }

      const admissionNo = ident.trim() || DEMO_STUDENT.studentId;
      const resolvedKey = classKeyFromStudentId(admissionNo) || DEMO_CLASS;
      const match = buildRoster(resolvedKey).find((entry) => entry.studentId === admissionNo);

      if (!match) {
        setError(`No student found for "${admissionNo}". Use an admission number like ${DEMO_STUDENT.studentId}.`);
        return;
      }

      onLoginSuccess({
        user: {
          id: 1,
          name: match.name,
          admissionNo,
          role: "student",
          class: resolvedKey
        },
        role: "student",
        token: "student-offline-token"
      });
      return;
    }

    setError('Invalid login credentials. Please use the quick demo fill buttons below.');
  };

  const slide = SLIDES[currentSlide];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', overflow: 'hidden' }}>

      {/* ── LEFT: Cinematic Slideshow ─────────────────────────── */}
      <div
        className="lgn-slide-panel"
        style={{ flex: '0 0 55%', position: 'relative', overflow: 'hidden', display: 'none' }}
      >
        {/* Ken Burns animated background */}
        <div
          key={`bg-${animKey}`}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            animation: `${slide.kenBurns} 6.8s ease-in-out forwards`,
            willChange: 'transform'
          }}
        />
        {/* Colour overlay */}
        <div style={{ position: 'absolute', inset: 0, background: slide.overlay }} />
        {/* Bottom vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,18,12,0.95) 0%, rgba(0,18,12,0.08) 52%, transparent 100%)'
        }} />

        {/* Back button */}
        <button
          onClick={onBackToHome}
          style={{
            position: 'absolute', top: '28px', left: '28px', zIndex: 30,
            display: 'flex', alignItems: 'center', gap: '6px',
            color: 'rgba(255,255,255,0.88)', fontWeight: 700, fontSize: '0.87rem',
            backgroundColor: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(8px)',
            padding: '8px 18px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.2s', cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} /> Back to Website
        </button>


        {/* Caption */}
        <div
          key={`cap-${animKey}`}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '0 40px 52px 40px', zIndex: 30,
            animation: 'captionIn 0.65s ease forwards'
          }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(168,240,68,0.16)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(168,240,68,0.5)', borderRadius: '30px',
            padding: '5px 15px', marginBottom: '16px'
          }}>
            <span style={{ fontSize: '1rem' }}>{slide.tagEmoji}</span>
            <span style={{ fontSize: '0.81rem', fontWeight: 800, color: '#A8F044', letterSpacing: '0.05em' }}>
              {slide.tag}
            </span>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '10px', lineHeight: 1.15 }}>
            {slide.title}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.76)', fontSize: '0.98rem', lineHeight: 1.65, maxWidth: '470px' }}>
            {slide.subtitle}
          </p>
          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: '7px', marginTop: '26px', alignItems: 'center' }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  height: '5px', width: i === currentSlide ? '30px' : '7px',
                  borderRadius: '3px',
                  backgroundColor: i === currentSlide ? '#A8F044' : 'rgba(255,255,255,0.30)',
                  transition: 'all 0.35s ease', border: 'none', cursor: 'pointer', padding: 0
                }}
              />
            ))}
          </div>
        </div>

        {/* Arrow controls */}
        <button onClick={prev} aria-label="Previous slide" className="lgn-arrow"
          style={{
            position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)',
            width: '42px', height: '42px', borderRadius: '50%', zIndex: 30, cursor: 'pointer',
            backgroundColor: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.18)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
          }}
        >
          <ChevronLeft size={22} />
        </button>
        <button onClick={next} aria-label="Next slide" className="lgn-arrow"
          style={{
            position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)',
            width: '42px', height: '42px', borderRadius: '50%', zIndex: 30, cursor: 'pointer',
            backgroundColor: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.18)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
          }}
        >
          <ChevronRight size={22} />
        </button>

        {/* Counter */}
        <div style={{
          position: 'absolute', bottom: '52px', right: '28px', zIndex: 30,
          backgroundColor: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(6px)',
          color: 'rgba(255,255,255,0.65)', fontSize: '0.77rem', fontWeight: 700,
          padding: '4px 11px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)'
        }}>
          {currentSlide + 1} / {SLIDES.length}
        </div>
      </div>

      {/* ── RIGHT: Login Form ─────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f4f7f5', overflowY: 'auto' }}>

        {/* Mobile header */}
        <header className="lgn-mob-header" style={{
          padding: '16px 20px', borderBottom: '1px solid #e2e8e4',
          backgroundColor: 'white', display: 'none',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <button
            onClick={onBackToHome}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#003024', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <Crea8orzLogo height={38} />
        </header>

        {/* Centred form */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px' }}>
          <div style={{ width: '100%', maxWidth: '440px' }}>

            {/* Heading */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'inline-block', marginBottom: '16px' }}>
                <Crea8orzLogo height={52} />
              </div>
              <h1 style={{ fontSize: '1.7rem', color: '#003024', fontWeight: 800, marginBottom: '6px' }}>
                Portal Authentication
              </h1>
              <p style={{ color: '#5e7970', fontSize: '0.92rem' }}>Sign in to your academic dashboard</p>
            </div>

            {/* Role tabs */}
            <div style={{ display: 'flex', backgroundColor: '#eef3f0', padding: '4px', borderRadius: '12px', marginBottom: '24px' }}>
              {[
                { id: 'student', label: 'Student' },
                { id: 'teacher', label: 'Class Teacher' },
                { id: 'admin',   label: 'Main Admin' }
              ].map(tab => (
                <button
                  key={tab.id} type="button"
                  onClick={() => { setRole(tab.id); setError(''); }}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: '10px',
                    fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.2s', cursor: 'pointer',
                    backgroundColor: role === tab.id ? '#003024' : 'transparent',
                    color: role === tab.id ? '#A8F044' : '#5e7970',
                    boxShadow: role === tab.id ? '0 2px 8px rgba(0,48,36,0.2)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: '10px', color: '#b91c1c', fontSize: '0.9rem',
                marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <ShieldAlert size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#003024', marginBottom: '8px' }}>
                  {role === 'student' ? 'Admission Number or Email' : 'Institutional Email Address'}
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5e7970' }}>
                    <User size={18} />
                  </div>
                  <input
                    type={role === 'student' ? 'text' : 'email'} required
                    value={identifier} onChange={e => setIdentifier(e.target.value)}
                    placeholder={role === 'student' ? 'e.g. CR8/2026/S2A/001' : 'e.g. staff@crea8orz.academy'}
                    style={{
                      width: '100%', padding: '12px 14px 12px 42px',
                      borderRadius: '10px', border: '1px solid #cbd5d0',
                      fontSize: '0.95rem', outline: 'none', backgroundColor: '#ffffff'
                    }}
                    onFocus={e => (e.target.style.borderColor = '#003024')}
                    onBlur={e  => (e.target.style.borderColor = '#cbd5d0')}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#003024' }}>Password</label>
                  <a href="#forgot"
                    onClick={e => { e.preventDefault(); alert('Please contact Crea8orz Academy ICT helpdesk to reset your password.'); }}
                    style={{ fontSize: '0.82rem', color: '#003024', fontWeight: 600 }}
                  >Forgot password?</a>
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5e7970' }}>
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'} required
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{
                      width: '100%', padding: '12px 44px 12px 42px',
                      borderRadius: '10px', border: '1px solid #cbd5d0',
                      fontSize: '0.95rem', outline: 'none', backgroundColor: '#ffffff'
                    }}
                    onFocus={e => (e.target.style.borderColor = '#003024')}
                    onBlur={e  => (e.target.style.borderColor = '#cbd5d0')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute', right: '6px', top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '32px', height: '32px', padding: 0,
                      background: 'transparent', border: 'none', borderRadius: '8px',
                      color: showPassword ? '#003024' : '#5e7970',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(0, 48, 36, 0.07)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {role === 'student' && (
                  <p style={{
                    marginTop: '10px', padding: '9px 12px', borderRadius: '8px',
                    backgroundColor: 'rgba(168, 240, 68, 0.18)', border: '1px dashed #A8F044',
                    fontSize: '0.78rem', color: '#003024', lineHeight: 1.5
                  }}>
                    Testing mode: every student logs in with the password{' '}
                    <strong style={{ fontFamily: 'Consolas, "Courier New", monospace' }}>{STUDENT_TEST_PASSWORD}</strong>.
                    Admission numbers look like <strong>CR8/2026/J1A/001</strong>; each class arm holds between{' '}
                    {ROSTER_MIN} and {ROSTER_MAX} students, so try any serial in that range.
                  </p>
                )}
              </div>

              <button type="submit" disabled={loading} className="btn btn-lime"
                style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '4px', cursor: 'pointer' }}
              >
                {loading
                  ? 'Authenticating...'
                  : `Sign In as ${role === 'student' ? 'Student' : role === 'teacher' ? 'Class Teacher' : 'Main Admin'}`
                }
              </button>
            </form>

            {/* Quick Demo */}
            <div style={{ marginTop: '28px', paddingTop: '22px', borderTop: '1px solid #eef3f0' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem',
                color: '#003024', fontWeight: 800, marginBottom: '12px',
                textTransform: 'uppercase', letterSpacing: '0.04em'
              }}>
                <Sparkles size={14} color="#003024" /> One-Click Quick Login Demos:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
      { r: 'student', label: 'Student',  name: 'Amina Bello (SSS 2 A)' },
      { r: 'teacher', label: 'Teacher',  name: 'Dr. Sarah Adebayo (Mathematics)' },
                  { r: 'admin',   label: 'Admin',    name: 'System Administrator' }
                ].map(item => (
                  <button key={item.r} type="button" className="lgn-demo"
                    onClick={() => handleQuickDemo(item.r)}
                    style={{
                      padding: '9px 14px', textAlign: 'left', cursor: 'pointer',
                      backgroundColor: '#f8faf9', border: '1px solid #e2e8e4',
                      borderRadius: '8px', fontSize: '0.85rem',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <span><strong>{item.label}:</strong> {item.name}</span>
                    <span style={{ color: '#003024', fontWeight: 800 }}>Auto Fill &rarr;</span>
                  </button>
                ))}
              </div>
            </div>

            <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.78rem', color: '#8fa39a' }}>
              &copy; {new Date().getFullYear()} Crea8orz Academy &middot; Innova8 &bull; Crea8 &bull; Eleva8
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
