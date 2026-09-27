import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Lock, 
  User, 
  ShieldAlert, 
  Sparkles
} from 'lucide-react';
import Crea8orzLogo from './Crea8orzLogo';

export default function LoginPage({ onBackToHome, onLoginSuccess }) {
  const [role, setRole] = useState('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuickDemo = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'student') {
      setIdentifier('CR8/2026/0142');
      setPassword('student123');
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
            subject: "Physics & Computer Studies",
            assignedClass: "SSS 2 Sapphire (Tech/Science)"
          },
          role: "teacher",
          token: "teacher-offline-token"
        });
        return;
      }
    } else if (selectedRole === 'student') {
      onLoginSuccess({
        user: { 
          id: 1, 
          name: "Tariq Emmanuel Johnson", 
          admissionNo: ident || "CR8/2026/0142", 
          role: "student",
          class: "SSS 2 Sapphire (Tech/Science)"
        },
        role: "student",
        token: "student-offline-token"
      });
      return;
    }

    setError('Invalid login credentials. Please use the quick demo fill buttons below.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f4f7f5' }}>
      
      {/* Top Header */}
      <header style={{ padding: '18px 0', borderBottom: '1px solid #e2e8e4', backgroundColor: 'white' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={onBackToHome}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#003024', fontWeight: 700, fontSize: '0.95rem' }}
          >
            <ArrowLeft size={18} /> Back to Public Website
          </button>

          <Crea8orzLogo height={42} />
        </div>
      </header>

      {/* Main Login Card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '480px', backgroundColor: 'white', borderRadius: '22px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0, 48, 36, 0.12)', border: '1px solid #e2e8e4' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-block', marginBottom: '14px' }}>
              <Crea8orzLogo height={54} />
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#003024', fontWeight: 800, marginBottom: '6px' }}>Portal Authentication</h2>
            <p style={{ color: '#5e7970', fontSize: '0.92rem' }}>Sign in to your academic dashboard</p>
          </div>

          {/* Role Tabs with Brand Highlight */}
          <div style={{ display: 'flex', backgroundColor: '#eef3f0', padding: '4px', borderRadius: '12px', marginBottom: '24px' }}>
            {[
              { id: 'student', label: 'Student' },
              { id: 'teacher', label: 'Class Teacher' },
              { id: 'admin', label: 'Main Admin' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setRole(tab.id); setError(''); }}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  transition: 'all 0.2s',
                  backgroundColor: role === tab.id ? '#003024' : 'transparent',
                  color: role === tab.id ? '#A8F044' : '#5e7970',
                  boxShadow: role === tab.id ? '0 2px 8px rgba(0, 48, 36, 0.2)' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#b91c1c', fontSize: '0.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                  type={role === 'student' ? 'text' : 'email'}
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={role === 'student' ? 'e.g. CR8/2026/0142' : 'e.g. staff@crea8orz.academy'}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5d0',
                    fontSize: '0.95rem',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#003024'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5d0'}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#003024' }}>Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Please contact Crea8orz Academy ICT helpdesk to reset your password."); }} style={{ fontSize: '0.82rem', color: '#003024', fontWeight: 600 }}>
                  Forgot password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5e7970' }}>
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5d0',
                    fontSize: '0.95rem',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#003024'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5d0'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-lime"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '6px' }}
            >
              {loading ? 'Authenticating...' : `Sign In as ${role === 'student' ? 'Student' : role === 'teacher' ? 'Class Teacher' : 'Main Admin'}`}
            </button>
          </form>

          {/* Quick Demo Autofill section */}
          <div style={{ marginTop: '30px', paddingTop: '24px', borderTop: '1px solid #eef3f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#003024', fontWeight: 800, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <Sparkles size={14} color="#003024" /> One-Click Quick Login Demos:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                type="button" 
                onClick={() => handleQuickDemo('student')}
                style={{ padding: '8px 12px', textAlign: 'left', backgroundColor: '#f8faf9', border: '1px solid #e2e8e4', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span><strong>Student:</strong> Tariq Johnson (SSS 2)</span>
                <span style={{ color: '#003024', fontWeight: 800 }}>Auto Fill &rarr;</span>
              </button>

              <button 
                type="button" 
                onClick={() => handleQuickDemo('teacher')}
                style={{ padding: '8px 12px', textAlign: 'left', backgroundColor: '#f8faf9', border: '1px solid #e2e8e4', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span><strong>Teacher:</strong> Dr. Sarah Adebayo (Physics)</span>
                <span style={{ color: '#003024', fontWeight: 800 }}>Auto Fill &rarr;</span>
              </button>

              <button 
                type="button" 
                onClick={() => handleQuickDemo('admin')}
                style={{ padding: '8px 12px', textAlign: 'left', backgroundColor: '#f8faf9', border: '1px solid #e2e8e4', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span><strong>Admin:</strong> System Administrator</span>
                <span style={{ color: '#003024', fontWeight: 800 }}>Auto Fill &rarr;</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
