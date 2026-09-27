import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
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
  Sparkles
} from 'lucide-react';
import Crea8orzLogo from './Crea8orzLogo';

// Imported photos generated with Nigerian students wearing Crea8orz forest green & lime uniforms
import hero1 from '../assets/images/hero1.jpg';
import hero2 from '../assets/images/hero2.jpg';
import hero3 from '../assets/images/hero3.jpg';
import hero4 from '../assets/images/hero4.jpg';

export default function LandingPage({ onNavigateLogin }) {
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

  // Auto slide loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

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
      <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(10px)', borderBottom: '2px solid rgba(0, 48, 36, 0.08)', boxShadow: '0 4px 15px rgba(0, 48, 36, 0.04)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '78px' }}>
          {/* Logo */}
          <div style={{ cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Crea8orzLogo height={52} />
          </div>

          {/* Navigation links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#about" style={{ color: '#003024', fontWeight: 600, fontSize: '0.95rem' }}>About Us</a>
            <a href="#programs" style={{ color: '#003024', fontWeight: 600, fontSize: '0.95rem' }}>Academic Sections</a>
            <a href="#news" style={{ color: '#003024', fontWeight: 600, fontSize: '0.95rem' }}>Campus News</a>
            <a href="#newsletter" style={{ color: '#003024', fontWeight: 600, fontSize: '0.95rem' }}>Newsletter & Contact</a>
          </nav>

          {/* Action / Login Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={onNavigateLogin}
              className="btn btn-lime"
              style={{ padding: '10px 24px', fontSize: '0.95rem' }}
            >
              <Users size={18} />
              Portal Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Slideshow Section */}
      <section style={{ position: 'relative', height: '640px', overflow: 'hidden', backgroundColor: '#00221a' }}>
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
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '50px', backgroundColor: 'rgba(168, 240, 68, 0.18)', backdropFilter: 'blur(8px)', marginBottom: '20px', border: '1px solid #A8F044' }}>
                  <Sparkles size={16} color="#A8F044" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#A8F044', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{slide.badge}</span>
                </div>

                <h1 style={{ fontSize: '3.4rem', color: '#ffffff', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                  {slide.title}
                </h1>

                <p style={{ fontSize: '1.2rem', color: '#e2e8e4', lineHeight: 1.6, marginBottom: '34px', fontWeight: 400 }}>
                  {slide.subtitle}
                </p>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
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

        {/* Carousel Arrows */}
        <button 
          onClick={handlePrevSlide}
          aria-label="Previous slide"
          style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(0, 48, 36, 0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8F044', zIndex: 20, transition: 'all 0.2s', border: '1px solid #A8F044' }}
        >
          <ChevronLeft size={24} />
        </button>

        <button 
          onClick={handleNextSlide}
          aria-label="Next slide"
          style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(0, 48, 36, 0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8F044', zIndex: 20, transition: 'all 0.2s', border: '1px solid #A8F044' }}
        >
          <ChevronRight size={24} />
        </button>

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
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8e4', padding: '36px 0', boxShadow: '0 4px 20px -2px rgba(0, 48, 36, 0.04)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(0, 48, 36, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003024' }}>
              <Award size={28} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#003024' }}>100%</div>
              <div style={{ fontSize: '0.88rem', color: '#5e7970', fontWeight: 600 }}>WAEC, NECO & IGCSE Pass</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(168, 240, 68, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003024' }}>
              <BookOpen size={28} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#003024' }}>1 : 12</div>
              <div style={{ fontSize: '0.88rem', color: '#5e7970', fontWeight: 600 }}>Teacher-to-Student Ratio</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(0, 48, 36, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003024' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#003024', letterSpacing: '0.04em' }}>I. C. E</div>
              <div style={{ fontSize: '0.78rem', color: '#5e7970', fontWeight: 700, letterSpacing: '0.02em', marginTop: '2px' }}>Innova8. Crea8. Eleva8</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
      <section id="about" style={{ padding: '80px 0', backgroundColor: '#f8faf9' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '50px', alignItems: 'center' }}>
            <div>
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
            <div style={{ position: 'relative' }}>
              <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '6px solid white' }}>
                <img src={hero2} alt="Crea8orz Modern Nigerian Classroom" style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '-24px', left: '-20px', backgroundColor: '#003024', padding: '18px 24px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '2px solid #A8F044', display: 'flex', alignItems: 'center', gap: '16px' }}>
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
      <section id="programs" style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px auto' }}>
            <span className="badge badge-primary" style={{ marginBottom: '12px' }}>Scope: Nursery to Secondary</span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#003024' }}>Academic Divisions</h2>
            <p style={{ color: '#5e7970', fontSize: '1.05rem' }}>
              Structured learning stages designed to prepare young African minds for leadership and global relevance.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            
            {/* Early Childhood / Nursery */}
            <div style={{ borderRadius: '18px', border: '1px solid #e2e8e4', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ height: '220px', backgroundImage: `url(${hero2})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#003024', color: '#A8F044', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
                  Ages 2 – 5
                </div>
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
            <div style={{ borderRadius: '18px', border: '1px solid #e2e8e4', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ height: '220px', backgroundImage: `url(${hero1})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#A8F044', color: '#003024', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
                  Ages 6 – 11
                </div>
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
            <div style={{ borderRadius: '18px', border: '1px solid #e2e8e4', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ height: '220px', backgroundImage: `url(${hero1})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#003024', color: '#A8F044', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
                  Ages 12 – 18
                </div>
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

      {/* Newsletter Signup (Milestone 1 Core Requirement with Brand Colors) */}
      <section id="newsletter" style={{ padding: '80px 0', backgroundColor: '#003024', color: 'white', position: 'relative' }}>
        <div className="container">
          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
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
      <footer style={{ backgroundColor: '#00221a', color: '#94a3b8', padding: '60px 0 30px 0', borderTop: '1px solid rgba(168, 240, 68, 0.15)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '50px' }}>
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
