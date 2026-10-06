import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronRight, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  Users, 
  CheckCircle, 
  Calendar, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import Crea8orzLogo from './Crea8orzLogo';

// Imported photos generated with Nigerian students wearing Crea8orz forest green & lime uniforms
import hero1 from '../assets/images/hero1.jpg';
import hero2 from '../assets/images/hero2.jpg';
import hero3 from '../assets/images/hero3.jpg';
import hero4 from '../assets/images/hero4.jpg';

/* ── Scroll-reveal hook ──────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
}

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    category: 'Admissions',
    date: 'Sep 20, 2026',
    title: '2026/2027 Academic Session Admissions Now Open',
    summary:
      'Crea8orz Academy is accepting applications for Nursery, Primary, and Secondary intake. Entrance assessments begin October 10th — secure your child\'s spot today.'
  },
  {
    id: 2,
    category: 'Achievement',
    date: 'Sep 15, 2026',
    title: 'Our SS3 Students Achieve 100% WAEC Distinctions',
    summary:
      'Crea8orz Academy\'s graduating class recorded a historic 100% five-credit pass rate in the 2026 WAEC examinations, with 87% scoring A1 in Mathematics and English.'
  },
  {
    id: 3,
    category: 'Events',
    date: 'Sep 10, 2026',
    title: 'Annual STEM & Creative Arts Showcase — Oct 25th',
    summary:
      'Students from Nursery to SSS 3 will present robotics projects, AI models, drama performances, and digital art installations at our flagship Innovation Day celebration.'
  }
];

const NAV_LINKS = [
  { href: '#about', label: 'About Us' },
  { href: '#programs', label: 'Academic Sections' },
  { href: '#news', label: 'Campus News' },
  { href: '#newsletter', label: 'Newsletter & Contact' }
];

export default function LandingPage({ onNavigateLogin }) {
  useScrollReveal();
  const slides = [
    {
      image: hero1,
      badge: "Innova8 • Crea8 • Eleva8",
      title: "Nurturing Tomorrow's Creative African Visionaries",
      subtitle: "From Nursery foundations to Senior Secondary, Crea8orz Academy empowers Nigerian scholars with tech innovation, character, and academic mastery.",
      cta: "Explore Our Programs",
      tag: "Admissions Open 2026/2027"
    },
    {
      image: hero2,
      badge: "Smart Tech Classrooms",
      title: "Collaborative Learning With World-Class Nigerian Faculty",
      subtitle: "Interactive digital smart boards, individual tablet learning, and inspiring mentorship designed to unlock every child's full creative genius.",
      cta: "Discover Curriculum",
      tag: "Early Years to Senior Secondary"
    },
    {
      image: hero1,
      badge: "Prestige & Culture",
      title: "Proudly Inspiring Young Leaders Across Nigeria",
      subtitle: "Combining world-standard academic curriculum with African leadership integrity and 21st-century problem-solving skills.",
      cta: "Join The Academy",
      tag: "Excellence in Action"
    },
    {
      image: hero2,
      badge: "Future Innovators",
      title: "Coding, Robotics & Creative Arts Excellence",
      subtitle: "Equipping our boys and girls with foundational coding, mathematics, scientific inquiry, and design thinking from day one.",
      cta: "View Campus Life",
      tag: "STEM & Creative Labs"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  // Close the mobile menu when the viewport grows past the breakpoint,
  // when tapping outside the header, or with Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;

    const onResize = () => {
      if (window.innerWidth > 960) setMenuOpen(false);
    };
    const onPointerDown = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) setMenuOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  // Auto slide loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/newsletter/subscribe.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await res.json();
      if (data && data.success) {
        setNewsletterSuccess(true);
      } else {
        const existing = JSON.parse(localStorage.getItem('portal_newsletter') || '[]');
        existing.push({ email: newsletterEmail, date: new Date().toISOString() });
        localStorage.setItem('portal_newsletter', JSON.stringify(existing));
        setNewsletterSuccess(true);
      }
    } catch (err) {
      const existing = JSON.parse(localStorage.getItem('portal_newsletter') || '[]');
      existing.push({ email: newsletterEmail, date: new Date().toISOString() });
      localStorage.setItem('portal_newsletter', JSON.stringify(existing));
      setNewsletterSuccess(true);
    } finally {
      setSubmitting(false);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 5000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Navigation Header */}
      <header ref={headerRef} style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(10px)', borderBottom: '2px solid rgba(0, 48, 36, 0.08)', boxShadow: '0 4px 15px rgba(0, 48, 36, 0.04)' }}>
        <div className="container nav-bar" style={{ minHeight: 78 }}>
          {/* Logo */}
          <div style={{ cursor: 'pointer', minWidth: 0 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Crea8orzLogo height={58} />
          </div>

          {/* Navigation links - hidden below 960px, replaced by the menu dropdown */}
          <nav className="hide-lg-down" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} style={{ color: '#003024', fontWeight: 600, fontSize: '0.95rem' }}>{link.label}</a>
            ))}
          </nav>

          {/* Action / Login Button (desktop only) */}
          <div className="hide-lg-down" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={onNavigateLogin}
              className="btn btn-lime"
              style={{ padding: '10px 24px', fontSize: '0.95rem', whiteSpace: 'nowrap' }}
            >
              <Users size={18} />
              Portal Login
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-site-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown: all navbar options + Portal Login */}
        {menuOpen && (
          <div className="mobile-menu" id="mobile-site-menu">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
                <ArrowRight size={17} />
              </a>
            ))}
            <button
              type="button"
              className="mobile-menu-login"
              onClick={() => { setMenuOpen(false); onNavigateLogin(); }}
            >
              <Users size={18} />
              Portal Login
            </button>
          </div>
        )}
      </header>

      {/* Hero Slideshow Section */}
      <section style={{ position: 'relative', minHeight: 'min(640px, 82vh)', overflow: 'hidden', backgroundColor: '#00221a' }}>
        {slides.map((slide, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: idx === currentSlide ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              pointerEvents: idx === currentSlide ? 'auto' : 'none',
              backgroundImage: `linear-gradient(to right, rgba(0, 48, 36, 0.94) 0%, rgba(0, 48, 36, 0.72) 55%, rgba(0, 48, 36, 0.4) 100%), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div className="container" style={{ zIndex: 10 }}>
              <div style={{ maxWidth: '720px', color: 'white' }}>
                <div className="animate-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '50px', backgroundColor: 'rgba(168, 240, 68, 0.18)', backdropFilter: 'blur(8px)', marginBottom: '20px', border: '1px solid #A8F044' }}>
                  <Sparkles size={16} color="#A8F044" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#A8F044', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{slide.badge}</span>
                </div>

                <h1 className="animate-fade-up" style={{ fontSize: 'clamp(2rem, 7.5vw, 3.4rem)', color: '#ffffff', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                  {slide.title}
                </h1>

                <p className="animate-fade-up delay-100" style={{ fontSize: '1.2rem', color: '#e2e8e4', lineHeight: 1.6, marginBottom: '34px', fontWeight: 400 }}>
                  {slide.subtitle}
                </p>

                <div className="animate-fade-up delay-200" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button onClick={onNavigateLogin} className="btn btn-lime" style={{ padding: '14px 30px', fontSize: '1.05rem' }}>
                    Access Portal <ChevronRight size={18} />
                  </button>
                  <a href="#programs" className="btn btn-white" style={{ padding: '14px 28px', fontSize: '1.05rem', backgroundColor: 'rgba(255,255,255,0.12)', color: 'white', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                    Explore Curriculum
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Indicators */}
        <div style={{ position: 'absolute', bottom: '28px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '10px', zIndex: 20 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: i === currentSlide ? '36px' : '10px',
                height: '10px',
                borderRadius: '5px',
                backgroundColor: i === currentSlide ? '#A8F044' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </section>

      {/* Highlights / Stats strip */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8e4', padding: 'clamp(24px, 4vw, 36px) 0', boxShadow: '0 4px 20px -2px rgba(0, 48, 36, 0.04)' }}>
        <div className="container grid-strip" style={{ gap: 30 }}>
          <div className="interactive-card reveal reveal-up stagger-1" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8e4' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(0, 48, 36, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003024' }}>
              <Award size={28} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#003024' }}>100%</div>
              <div style={{ fontSize: '0.88rem', color: '#5e7970', fontWeight: 600 }}>WAEC, NECO & IGCSE Pass</div>
            </div>
          </div>

          <div className="interactive-card reveal reveal-up stagger-2" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8e4' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(168, 240, 68, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003024' }}>
              <BookOpen size={28} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#003024' }}>1 : 12</div>
              <div style={{ fontSize: '0.88rem', color: '#5e7970', fontWeight: 600 }}>Teacher-to-Student Ratio</div>
            </div>
          </div>

          <div className="interactive-card reveal reveal-up stagger-3" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8e4' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(0, 48, 36, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003024' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#003024', letterSpacing: '0.04em' }}>I. C. E</div>
              <div style={{ fontSize: '0.78rem', color: '#5e7970', fontWeight: 700, letterSpacing: '0.02em', marginTop: '2px' }}>Innova8. Crea8. Eleva8</div>
            </div>
          </div>

          <div className="interactive-card reveal reveal-up stagger-4" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8e4' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(168, 240, 68, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003024' }}>
              <Users size={28} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#003024' }}>1,500+</div>
              <div style={{ fontSize: '0.88rem', color: '#5e7970', fontWeight: 600 }}>Scholars in Lagos & Abuja</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-pad" style={{ backgroundColor: '#f8faf9' }}>
        <div className="container">
          <div className="grid-cards" style={{ gap: 50, alignItems: 'center' }}>
            <div className="reveal reveal-left">
              <span className="badge badge-lime" style={{ marginBottom: '12px' }}>About Crea8orz Academy</span>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#003024' }}>
                Igniting Innovation, Empowering Creators & Elevating Africa
              </h2>
              <p style={{ color: '#334d44', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '20px' }}>
                Crea8orz Academy is a premier Nigerian educational institution providing blended British and Nigerian curricula across Nursery, Primary, and Secondary divisions. Designed with innovation at its core, our students thrive in an environment centered on critical thinking, technology fluency, creative arts, and moral discipline.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '30px' }}>
                {[
                  "Dual British & Nigerian national curricula with exceptional academic records.",
                  "Classrooms equipped with interactive smart displays & digital tablets.",
                  "Coding, Robotics, AI literacy, and STEM research centers from basic education.",
                  "Dedicated Nigerian teachers certified in modern global instructional methodologies."
                ].map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle size={20} color="#003024" />
                    <span style={{ color: '#0a1f18', fontWeight: 600 }}>{item}</span>
                  </div>
                ))}
              </div>

              <button onClick={onNavigateLogin} className="btn btn-primary" style={{ padding: '12px 28px' }}>
                Enter School Portal <ArrowRight size={18} />
              </button>
            </div>

            {/* Visual Mosaic */}
            <div className="reveal reveal-right" style={{ position: 'relative' }}>
              <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '6px solid white' }}>
                <img src={hero2} alt="Crea8orz Modern Nigerian Classroom" style={{ width: '100%', height: 'clamp(200px, 34vw, 380px)', objectFit: 'cover', display: 'block' }} />
              </div>
              <div className="animate-float" style={{ position: 'absolute', bottom: '-24px', left: '-20px', backgroundColor: '#003024', padding: '18px 24px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '2px solid #A8F044', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#A8F044', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003024' }}>
                  <Award size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: 'white', fontSize: '1.05rem' }}>Top Rated STEM Academy</div>
                  <div style={{ fontSize: '0.85rem', color: '#A8F044' }}>Lagos State Ministry of Education Accredited</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Sections (Nursery, Primary, Secondary) */}
      <section id="programs" className="section-pad" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="reveal reveal-up" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px auto' }}>
            <span className="badge badge-primary" style={{ marginBottom: '12px' }}>Scope: Nursery to Secondary</span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#003024' }}>Academic Divisions</h2>
            <p style={{ color: '#5e7970', fontSize: '1.05rem' }}>
              Structured learning stages designed to prepare young African minds for leadership and global relevance.
            </p>
          </div>

          <div className="grid-cards-sm" style={{ gap: 32 }}>
            
            {/* Early Childhood / Nursery */}
            <div className="interactive-card reveal reveal-up stagger-1" style={{ borderRadius: '18px', border: '1px solid #e2e8e4', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
              <div className="zoom-container" style={{ height: '220px', position: 'relative' }}>
                <div className="zoom-image" style={{ width: '100%', height: '100%', backgroundImage: `url(${hero2})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              </div>
              <div style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '12px', color: '#003024' }}>Early Years Foundation (Nursery)</h3>
                <p style={{ color: '#5e7970', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  Montessori phonics, early numeracy, sensory discovery, and motor skills development in safe, air-conditioned play suites.
                </p>
                <div style={{ borderTop: '1px solid #f1f5f3', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#003024', fontWeight: 700 }}>Nursery 1 – 3 Programs</span>
                  <ChevronRight size={18} color="#003024" />
                </div>
              </div>
            </div>

            {/* Primary Section */}
            <div className="interactive-card reveal reveal-up stagger-2" style={{ borderRadius: '18px', border: '1px solid #e2e8e4', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
              <div className="zoom-container" style={{ height: '220px', position: 'relative' }}>
                <div className="zoom-image" style={{ width: '100%', height: '100%', backgroundImage: `url(${hero1})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              </div>
              <div style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '12px', color: '#003024' }}>Primary Education (Grades 1 – 6)</h3>
                <p style={{ color: '#5e7970', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  Core English Studies, Mathematics, Basic Science & Tech, Cultural & Creative Arts, French, and early Python coding.
                </p>
                <div style={{ borderTop: '1px solid #f1f5f3', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#003024', fontWeight: 700 }}>Primary Curriculum</span>
                  <ChevronRight size={18} color="#003024" />
                </div>
              </div>
            </div>

            {/* Secondary Section */}
            <div className="interactive-card reveal reveal-up stagger-3" style={{ borderRadius: '18px', border: '1px solid #e2e8e4', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
              <div className="zoom-container" style={{ height: '220px', position: 'relative' }}>
                <div className="zoom-image" style={{ width: '100%', height: '100%', backgroundImage: `url(${hero1})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              </div>
              <div style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '12px', color: '#003024' }}>Junior & Senior Secondary (JSS & SSS)</h3>
                <p style={{ color: '#5e7970', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  Pre-university pathways in Pure Sciences, Technology & Computing, Arts & Humanities, and Commercial Studies with WAEC/NECO excellence.
                </p>
                <div style={{ borderTop: '1px solid #f1f5f3', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#003024', fontWeight: 700 }}>JSS 1 – SSS 3 Arms</span>
                  <ChevronRight size={18} color="#003024" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* News & Announcements Section */}
      <section id="news" className="section-pad" style={{ backgroundColor: '#f8faf9' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
            <div className="reveal reveal-left">
              <span className="badge badge-lime" style={{ marginBottom: '12px' }}>Campus Bulletin</span>
              <h2 style={{ fontSize: '2.5rem', color: '#003024' }}>Latest News & Announcements</h2>
            </div>
            <button onClick={onNavigateLogin} className="btn btn-outline">
              Sign In to View Detailed Circulars <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid-cards-sm" style={{ gap: 28 }}>
            {INITIAL_ANNOUNCEMENTS.map((item, idx) => (
              <div key={item.id} className={`interactive-card reveal reveal-up stagger-${idx + 1}`} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span className="badge badge-primary">{item.category}</span>
                  <span style={{ fontSize: '0.82rem', color: '#5e7970', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> {item.date}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '12px', color: '#003024' }}>{item.title}</h4>
                <p style={{ color: '#334d44', fontSize: '0.92rem', lineHeight: 1.6 }}>{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section id="newsletter" className="section-pad" style={{ backgroundColor: '#003024', color: 'white', position: 'relative' }}>
        <div className="container">
          <div className="reveal reveal-scale" style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ backgroundColor: 'rgba(168, 240, 68, 0.2)', color: '#A8F044', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid #A8F044' }}>
              Stay Connected
            </span>
            <h2 style={{ fontSize: '2.6rem', color: 'white', marginTop: '18px', marginBottom: '16px' }}>
              Subscribe to the Crea8orz Bulletin
            </h2>
            <p style={{ color: '#cbd5d0', fontSize: '1.1rem', marginBottom: '32px' }}>
              Get direct updates on school terms, entrance examinations, academic competitions, and technological showcases.
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '12px', maxWidth: '520px', margin: '0 auto', flexWrap: 'wrap' }}>
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{
                  flex: '1 1 280px',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(168, 240, 68, 0.3)',
                  backgroundColor: '#ffffff',
                  color: '#003024',
                  fontSize: '1rem',
                  outline: 'none',
                  fontWeight: 500
                }}
              />
              <button 
                type="submit" 
                disabled={submitting}
                className="btn btn-lime"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                {submitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            {newsletterSuccess && (
              <div style={{ marginTop: '20px', padding: '12px 20px', backgroundColor: 'rgba(168, 240, 68, 0.2)', border: '1px solid #A8F044', borderRadius: '10px', color: '#A8F044', fontSize: '0.95rem', fontWeight: 600 }}>
                ✓ Thank you for subscribing! Your email has been added to the Crea8orz Academy records.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#00221a', color: '#94a3b8', padding: 'clamp(40px, 7vw, 60px) 0 30px 0', borderTop: '1px solid rgba(168, 240, 68, 0.15)' }}>
        <div className="container">
          <div className="grid-cards-sm" style={{ gap: 40, marginBottom: 50 }}>
            <div>
              <div style={{ marginBottom: '16px' }}>
                <Crea8orzLogo height={44} variant="on-dark" />
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#8fa39a' }}>
                Leading the future of African education through digital excellence, creative innovation, and disciplined moral leadership.
              </p>
            </div>

            <div>
              <h5 style={{ color: 'white', fontSize: '1rem', marginBottom: '18px' }}>Portal Links</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigateLogin(); }} style={{ color: '#cbd5d0' }}>Student Result Portal</a>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigateLogin(); }} style={{ color: '#cbd5d0' }}>Teacher Grading Suite</a>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigateLogin(); }} style={{ color: '#cbd5d0' }}>Main Admin Management</a>
                <a href="#newsletter" style={{ color: '#cbd5d0' }}>Admissions & Enquiries</a>
              </div>
            </div>

            <div>
              <h5 style={{ color: 'white', fontSize: '1rem', marginBottom: '18px' }}>Campuses & Contact</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <MapPin size={18} color="#A8F044" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ color: '#cbd5d0' }}>Crea8orz Campus, Innovation Drive, Lekki Phase 1, Lagos, Nigeria.</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Phone size={16} color="#A8F044" />
                  <span style={{ color: '#cbd5d0' }}>+234 (0) 812 000 8899</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Mail size={16} color="#A8F044" />
                  <span style={{ color: '#cbd5d0' }}>admissions@crea8orz.academy</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem' }}>
            <span style={{ color: '#8fa39a' }}>&copy; {new Date().getFullYear()} Crea8orz Academy. All Rights Reserved.</span>
            <span style={{ color: '#A8F044', fontWeight: 600 }}>Innova8 • Crea8 • Eleva8</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
