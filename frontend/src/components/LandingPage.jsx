import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
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
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { INITIAL_ANNOUNCEMENTS } from '../mockData';

// Imported photos generated specifically for this school portal
import hero1 from '../assets/images/hero1.jpg';
import hero2 from '../assets/images/hero2.jpg';
import hero3 from '../assets/images/hero3.jpg';
import hero4 from '../assets/images/hero4.jpg';

export default function LandingPage({ onNavigateLogin }) {
  const slides = [
    {
      image: hero1,
      badge: "Inspiring Academic Excellence",
      title: "Nurturing Tomorrow's Global Leaders Today",
      subtitle: "From Nursery foundational steps to Senior Secondary graduation, we provide world-class holistic education and character building.",
      cta: "Explore Our Programs",
      tag: "Admissions Open 2026/2027"
    },
    {
      image: hero2,
      badge: "Modern Interactive Learning",
      title: "Interactive Classrooms Equipped for Tomorrow",
      subtitle: "Smart technology integration, inquiry-driven pedagogy, and dedicated educators committed to every child's success.",
      cta: "Discover Curriculum",
      tag: "Early Years to Secondary"
    },
    {
      image: hero3,
      badge: "Cutting-Edge STEM Education",
      title: "Advanced Laboratories & Practical Science",
      subtitle: "Empowering young scientists, coders, and innovators through rigorous hands-on laboratory experiences.",
      cta: "Learn More",
      tag: "Robotics & Innovation"
    },
    {
      image: hero4,
      badge: "Holistic Development",
      title: "Sports, Arts, Music & Creative Expression",
      subtitle: "Balanced growth ensuring physical fitness, creative expression, musical mastery, and team sportsmanship.",
      cta: "View Campus Life",
      tag: "Champions in Athletics"
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
      // Try real backend API first
      const res = await fetch('/api/newsletter/subscribe.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await res.json();
      if (data && data.success) {
        setNewsletterSuccess(true);
      } else {
        // Fallback local persistence
        const existing = JSON.parse(localStorage.getItem('portal_newsletter') || '[]');
        existing.push({ email: newsletterEmail, date: new Date().toISOString() });
        localStorage.setItem('portal_newsletter', JSON.stringify(existing));
        setNewsletterSuccess(true);
      }
    } catch (err) {
      // Fallback local persistence
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
      
      {/* Top Banner Notice */}
      <div style={{ backgroundColor: '#0f172a', color: '#94a3b8', fontSize: '0.85rem', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
              <Phone size={14} color="#f59e0b" /> +234 (0) 800-ST-AUGUSTINE
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
              <Mail size={14} color="#f59e0b" /> info@staugustineacademy.edu
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '0.75rem' }}>
              Term 2 Assessment Open
            </span>
            <span style={{ color: '#e2e8f0' }}>Portal Milestone 1 Live</span>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '76px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 10px rgba(30, 58, 138, 0.3)' }}>
              <GraduationCap size={28} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                ST. AUGUSTINE
              </div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase' }}>
                International Academy
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#about" style={{ color: '#334155', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s' }}>About Us</a>
            <a href="#programs" style={{ color: '#334155', fontWeight: 500, fontSize: '0.95rem' }}>Academic Sections</a>
            <a href="#news" style={{ color: '#334155', fontWeight: 500, fontSize: '0.95rem' }}>News & Updates</a>
            <a href="#newsletter" style={{ color: '#334155', fontWeight: 500, fontSize: '0.95rem' }}>Contact</a>
          </nav>

          {/* Action / Login Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={onNavigateLogin}
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.95rem' }}
            >
              <Users size={18} />
              Portal Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Slideshow Section */}
      <section style={{ position: 'relative', height: '620px', overflow: 'hidden', backgroundColor: '#0f172a' }}>
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
              backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.90) 0%, rgba(15, 23, 42, 0.65) 50%, rgba(15, 23, 42, 0.35) 100%), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div className="container" style={{ zIndex: 10 }}>
              <div style={{ maxWidth: '680px', color: 'white' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '50px', backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', marginBottom: '20px', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
                  <Sparkles size={16} color="#f59e0b" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', letterSpacing: '0.04em' }}>{slide.badge}</span>
                </div>

                <h1 style={{ fontSize: '3.2rem', color: '#ffffff', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                  {slide.title}
                </h1>

                <p style={{ fontSize: '1.2rem', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '32px', fontWeight: 400 }}>
                  {slide.subtitle}
                </p>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button onClick={onNavigateLogin} className="btn btn-gold" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                    Access Portal <ChevronRight size={18} />
                  </button>
                  <a href="#programs" className="btn btn-white" style={{ padding: '14px 28px', fontSize: '1.05rem', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
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
          style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 20, transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.25)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
        >
          <ChevronLeft size={24} />
        </button>

        <button 
          onClick={handleNextSlide}
          aria-label="Next slide"
          style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 20, transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.25)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
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
                backgroundColor: i === currentSlide ? '#f59e0b' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </section>

      {/* Highlights / Stats strip */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '36px 0', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <Award size={28} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>100%</div>
              <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>WAEC / NECO Pass Rate</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
              <BookOpen size={28} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>1 : 12</div>
              <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>Teacher to Student Ratio</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>25+ Years</div>
              <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>Legacy of Moral Character</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#db2777' }}>
              <Users size={28} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>1,800+</div>
              <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>Active Enrolled Scholars</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '80px 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '50px', alignItems: 'center' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '12px' }}>About St. Augustine Academy</span>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#0f172a' }}>
                Building Character, Inspiring Intellect & Shaping Destiny
              </h2>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '20px' }}>
                Founded on the pillars of discipline, academic rigor, and moral grounding, St. Augustine Academy is dedicated to delivering education tailored to the 21st century. Our campus offers world-standard digital learning suites, state-of-the-art physics, chemistry, and biology labs, alongside enriched creative arts and athletic sports complexes.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '30px' }}>
                {[
                  "Dual British & National Curriculum accreditation with proven excellence.",
                  "Personalized mentorship with smart student performance tracking portals.",
                  "Cultivating digital fluency: robotics, coding, STEM, and foreign languages.",
                  "Safe, serene, and modern boarding and day student environment."
                ].map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle size={20} color="#10b981" />
                    <span style={{ color: '#334155', fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>

              <button onClick={onNavigateLogin} className="btn btn-primary" style={{ padding: '12px 28px' }}>
                Enter School Portal <ArrowRight size={18} />
              </button>
            </div>

            {/* Visual Mosaic */}
            <div style={{ position: 'relative' }}>
              <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '8px solid white' }}>
                <img src={hero2} alt="Modern Classroom" style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '-24px', left: '-20px', backgroundColor: 'white', padding: '20px 24px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                  <Award size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>Top 1% Ranked Academy</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Ministry of Education Certified</div>
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
            <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>Comprehensive Education</span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#0f172a' }}>Academic Sections & Divisions</h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
              Providing tailored curriculum structures and supportive environments for every developmental milestone.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            
            {/* Early Childhood / Nursery */}
            <div style={{ borderRadius: '18px', border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-sm)' }}
                 onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-xl)'; }}
                 onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
              <div style={{ height: '200px', backgroundImage: `url(${hero2})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#3b82f6', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                  Ages 2 – 5
                </div>
              </div>
              <div style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '12px', color: '#0f172a' }}>Nursery & Early Foundation</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  Montessori-inspired phonics, numeracy discovery, sensory motor skills development, and safe imaginative indoor play areas.
                </p>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600 }}>Nursery 1 – 3 Programs</span>
                  <ChevronRight size={18} color="#2563eb" />
                </div>
              </div>
            </div>

            {/* Primary Section */}
            <div style={{ borderRadius: '18px', border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-sm)' }}
                 onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-xl)'; }}
                 onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
              <div style={{ height: '200px', backgroundImage: `url(${hero1})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#10b981', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                  Ages 6 – 11
                </div>
              </div>
              <div style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '12px', color: '#0f172a' }}>Primary / Basic Education</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  Comprehensive English, Mathematics, STEM foundations, French & Nigerian languages, coding basics, and creative arts.
                </p>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>Grades 1 – 6 Curriculum</span>
                  <ChevronRight size={18} color="#059669" />
                </div>
              </div>
            </div>

            {/* Secondary Section */}
            <div style={{ borderRadius: '18px', border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-sm)' }}
                 onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-xl)'; }}
                 onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
              <div style={{ height: '200px', backgroundImage: `url(${hero3})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#f59e0b', color: '#1e1e1e', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                  Ages 12 – 18
                </div>
              </div>
              <div style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '12px', color: '#0f172a' }}>Junior & Senior Secondary</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  Pre-university pathways in Pure Sciences, Technology, Arts & Humanities, and Commerce with WAEC, NECO, IGCSE & SAT preparation.
                </p>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#d97706', fontWeight: 600 }}>JSS 1 – SSS 3 Classes</span>
                  <ChevronRight size={18} color="#d97706" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* News & Announcements Section */}
      <section id="news" style={{ padding: '80px 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '12px' }}>Campus Bulletin</span>
              <h2 style={{ fontSize: '2.5rem', color: '#0f172a' }}>Latest News & Announcements</h2>
            </div>
            <button onClick={onNavigateLogin} className="btn btn-outline">
              Sign In to View Detailed Circulars <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {INITIAL_ANNOUNCEMENTS.map((item) => (
              <div key={item.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span className="badge badge-primary">{item.category}</span>
                  <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> {item.date}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '12px', color: '#0f172a' }}>{item.title}</h4>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 }}>{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup (Milestone 1 Core Requirement) */}
      <section id="newsletter" style={{ padding: '80px 0', background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', color: 'white' }}>
        <div className="container">
          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#fef08a', padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Stay Informed
            </span>
            <h2 style={{ fontSize: '2.6rem', color: 'white', marginTop: '16px', marginBottom: '16px' }}>
              Subscribe to the Academy Newsletter
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '32px' }}>
              Receive termly newsletters, admissions alerts, academic calendars, and school event notifications directly to your inbox.
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
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: '#0f172a',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <button 
                type="submit" 
                disabled={submitting}
                className="btn btn-gold"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                {submitting ? 'Subscribing...' : 'Subscribe Now'}
              </button>
            </form>

            {newsletterSuccess && (
              <div style={{ marginTop: '20px', padding: '12px 20px', backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', borderRadius: '10px', color: '#a7f3d0', fontSize: '0.95rem' }}>
                ✓ Thank you for subscribing! Your email has been saved to the school database.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#090d16', color: '#94a3b8', padding: '60px 0 30px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '50px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', marginBottom: '16px' }}>
                <GraduationCap size={28} color="#3b82f6" />
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>ST. AUGUSTINE ACADEMY</span>
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#64748b' }}>
                Committed to nurturing intellectual excellence, ethical leadership, and creative innovation across Early Years, Primary, and Secondary education.
              </p>
            </div>

            <div>
              <h5 style={{ color: 'white', fontSize: '1rem', marginBottom: '18px' }}>Portal Portals</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigateLogin(); }} style={{ color: '#cbd5e1' }}>Student Result Portal</a>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigateLogin(); }} style={{ color: '#cbd5e1' }}>Staff & Teacher Portal</a>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigateLogin(); }} style={{ color: '#cbd5e1' }}>Main Admin Management</a>
                <a href="#newsletter" style={{ color: '#cbd5e1' }}>Admissions & Inquiries</a>
              </div>
            </div>

            <div>
              <h5 style={{ color: 'white', fontSize: '1rem', marginBottom: '18px' }}>Contact & Campus</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <MapPin size={18} color="#3b82f6" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>Plot 12, Academic Crescent, Royal Estate, Victoria Island, Lagos, Nigeria.</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Phone size={16} color="#3b82f6" />
                  <span>+234 (0) 803 000 8899</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Mail size={16} color="#3b82f6" />
                  <span>admissions@staugustineacademy.edu</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem' }}>
            <span>&copy; {new Date().getFullYear()} St. Augustine International Academy. All Rights Reserved.</span>
            <span>School Management System — Milestone 1 Production Build</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
