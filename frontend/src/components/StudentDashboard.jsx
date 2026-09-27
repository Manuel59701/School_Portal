import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  Award, 
  CheckCircle2, 
  LogOut, 
  Calendar, 
  User, 
  BookOpen, 
  Sparkles,
  BarChart3,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Crea8orzLogo from './Crea8orzLogo';

export default function StudentDashboard({ user, onLogout }) {
  const [selectedTerm, setSelectedTerm] = useState('Second Term 2025/2026');
  
  const studentProfile = {
    name: user?.name || "Tariq Emmanuel Johnson",
    admissionNo: user?.admissionNo || "CR8/2026/0142",
    class: user?.class || "SSS 2 Sapphire (Tech/Science)",
    session: "2025/2026 Academic Session",
    term: selectedTerm,
    attendance: "96.4%",
    rank: "2nd out of 30 Students",
    totalMarks: 601,
    maxMarks: 700,
    average: "85.86%",
    principalRemarks: "Remarkable performance demonstrating exceptional academic diligence, creative aptitude, and deep understanding of STEM subjects.",
    teacherRemarks: "Keen analytical thinker. Active contributor during tech labs, coding practicals, and exemplary discipline.",
    results: [
      { code: "MTH 201", subject: "Mathematics", ca: 28, exam: 64, total: 92, grade: "A1", remark: "Distinction" },
      { code: "ENG 201", subject: "English Studies", ca: 25, exam: 61, total: 86, grade: "A1", remark: "Distinction" },
      { code: "PHY 201", subject: "Physics", ca: 27, exam: 62, total: 89, grade: "A1", remark: "Distinction" },
      { code: "CHM 201", subject: "Chemistry", ca: 26, exam: 59, total: 85, grade: "A1", remark: "Distinction" },
      { code: "BIO 201", subject: "Biology", ca: 24, exam: 54, total: 78, grade: "B2", remark: "Very Good" },
      { code: "CMP 201", subject: "Computer Science & Robotics", ca: 29, exam: 66, total: 95, grade: "A1", remark: "Distinction" },
      { code: "CIV 201", subject: "Civic Education", ca: 23, exam: 57, total: 80, grade: "B2", remark: "Very Good" }
    ]
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      colors: ['#003024', '#A8F044', '#ffffff', '#fbbf24'],
      origin: { y: 0.6 }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8faf9', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <nav className="no-print" style={{ backgroundColor: 'white', borderBottom: '2px solid rgba(0, 48, 36, 0.08)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>
          <Crea8orzLogo size={36} showMotto={false} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#003024' }}>{studentProfile.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#5e7970' }}>{studentProfile.admissionNo} • {studentProfile.class}</div>
            </div>
            <button 
              onClick={onLogout}
              className="btn btn-outline"
              style={{ padding: '8px 14px', fontSize: '0.85rem', color: '#b91c1c', borderColor: '#fecaca' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main style={{ flex: 1, padding: '36px 0' }}>
        <div className="container">
          
          {/* Header Action Bar */}
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '2rem', color: '#003024', marginBottom: '4px' }}>Termly Result Sheet</h1>
              <p style={{ color: '#5e7970', fontSize: '0.95rem' }}>Official cumulative performance record and grading transcript</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #cbd5d0', backgroundColor: 'white', fontWeight: 600, fontSize: '0.9rem', color: '#003024', outline: 'none' }}
              >
                <option value="Second Term 2025/2026">Second Term 2025/2026</option>
                <option value="First Term 2025/2026">First Term 2025/2026</option>
                <option value="Third Term 2024/2025">Third Term 2024/2025</option>
              </select>

              <button 
                onClick={triggerCelebration}
                className="btn btn-lime"
                style={{ padding: '10px 16px' }}
              >
                <Sparkles size={18} /> Celebrate
              </button>

              <button 
                onClick={handlePrint}
                className="btn btn-primary"
                style={{ padding: '10px 20px' }}
              >
                <Printer size={18} /> Print / Export PDF
              </button>
            </div>
          </div>

          {/* Performance Overview Banner */}
          <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.82rem', color: '#5e7970', fontWeight: 700, marginBottom: '6px' }}>AVERAGE SCORE</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#003024' }}>{studentProfile.average}</div>
              <div style={{ fontSize: '0.8rem', color: '#003024', fontWeight: 700, marginTop: '4px' }}>
                <span style={{ backgroundColor: '#A8F044', padding: '2px 8px', borderRadius: '4px' }}>Distinction (A1)</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.82rem', color: '#5e7970', fontWeight: 700, marginBottom: '6px' }}>CLASS POSITION</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#003024' }}>2nd</div>
              <div style={{ fontSize: '0.8rem', color: '#5e7970', marginTop: '4px' }}>Out of 30 Students in Class</div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.82rem', color: '#5e7970', fontWeight: 700, marginBottom: '6px' }}>TOTAL SCORE</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#003024' }}>{studentProfile.totalMarks} <span style={{ fontSize: '1.2rem', color: '#5e7970' }}>/ {studentProfile.maxMarks}</span></div>
              <div style={{ fontSize: '0.8rem', color: '#5e7970', marginTop: '4px' }}>Across 7 Core Subjects</div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.82rem', color: '#5e7970', fontWeight: 700, marginBottom: '6px' }}>ATTENDANCE RATE</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#003024' }}>{studentProfile.attendance}</div>
              <div style={{ fontSize: '0.8rem', color: '#003024', fontWeight: 700, marginTop: '4px' }}>Regular & Punctual</div>
            </div>
          </div>

          {/* Official Printable Result Sheet */}
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px', border: '2px solid #003024', boxShadow: 'var(--shadow-md)' }}>
            
            {/* School Official Header on Sheet */}
            <div style={{ textAlign: 'center', borderBottom: '3px solid #003024', paddingBottom: '24px', marginBottom: '28px' }}>
              <div style={{ display: 'inline-block', marginBottom: '10px' }}>
                <Crea8orzLogo size={46} showMotto={true} />
              </div>
              <p style={{ color: '#334d44', fontSize: '0.9rem', marginTop: '4px' }}>
                Crea8orz Innovation Drive, Lekki Phase 1, Lagos, Nigeria | info@crea8orz.academy
              </p>
              <div style={{ marginTop: '10px', display: 'inline-block', backgroundColor: '#003024', color: '#A8F044', padding: '5px 20px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Official Termly Academic Transcript & Progress Report
              </div>
            </div>

            {/* Student Biodata Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', backgroundColor: '#f4f7f5', padding: '20px', borderRadius: '12px', marginBottom: '28px', border: '1px solid #e2e8e4' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#5e7970', fontWeight: 700, textTransform: 'uppercase' }}>Student Name</span>
                <div style={{ fontWeight: 800, color: '#003024', fontSize: '1rem' }}>{studentProfile.name}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#5e7970', fontWeight: 700, textTransform: 'uppercase' }}>Admission Number</span>
                <div style={{ fontWeight: 800, color: '#003024', fontSize: '1rem' }}>{studentProfile.admissionNo}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#5e7970', fontWeight: 700, textTransform: 'uppercase' }}>Class / Arm</span>
                <div style={{ fontWeight: 800, color: '#003024', fontSize: '1rem' }}>{studentProfile.class}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#5e7970', fontWeight: 700, textTransform: 'uppercase' }}>Term & Session</span>
                <div style={{ fontWeight: 800, color: '#003024', fontSize: '1rem' }}>{studentProfile.term}</div>
              </div>
            </div>

            {/* Grades Table */}
            <div style={{ overflowX: 'auto', marginBottom: '28px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#003024', color: 'white' }}>
                    <th style={{ padding: '12px 16px', borderTopLeftRadius: '8px' }}>Subject Code</th>
                    <th style={{ padding: '12px 16px' }}>Subject Title</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Continuous Ass. (30)</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Exam (70)</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Total Score (100)</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Grade</th>
                    <th style={{ padding: '12px 16px', borderTopRightRadius: '8px' }}>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {studentProfile.results.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8e4', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fbf9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#5e7970' }}>{row.code}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#003024' }}>{row.subject}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: '#0a1f18', fontWeight: 600 }}>{row.ca}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: '#0a1f18', fontWeight: 600 }}>{row.exam}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 800, color: '#003024', fontSize: '1rem' }}>{row.total}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '6px', 
                          fontWeight: 800, 
                          fontSize: '0.85rem',
                          backgroundColor: row.grade.startsWith('A') ? '#A8F044' : '#d1fae5',
                          color: '#003024'
                        }}>
                          {row.grade}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#003024' }}>{row.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grading Scale Guide */}
            <div style={{ backgroundColor: '#f4f7f5', padding: '14px 18px', borderRadius: '8px', fontSize: '0.8rem', color: '#334d44', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <span><strong>Crea8orz Grading Standard:</strong> A1 (75-100% Distinction)</span>
              <span>B2 (70-74% Very Good)</span>
              <span>B3 (65-69% Good)</span>
              <span>C4-C6 (50-64% Credit)</span>
              <span>D7-E8 (40-49% Pass)</span>
              <span>F9 (0-39% Fail)</span>
            </div>

            {/* Remarks Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div style={{ border: '1px solid #e2e8e4', borderRadius: '12px', padding: '18px', backgroundColor: '#ffffff' }}>
                <div style={{ fontWeight: 700, color: '#003024', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Class Teacher's Remark
                </div>
                <p style={{ color: '#334d44', fontSize: '0.92rem', fontStyle: 'italic' }}>
                  "{studentProfile.teacherRemarks}"
                </p>
                <div style={{ marginTop: '16px', borderTop: '1px dashed #cbd5d0', paddingTop: '8px', fontSize: '0.8rem', color: '#5e7970' }}>
                  Signature: <strong>Dr. Sarah Adebayo</strong> (Class Master)
                </div>
              </div>

              <div style={{ border: '1px solid #e2e8e4', borderRadius: '12px', padding: '18px', backgroundColor: '#ffffff' }}>
                <div style={{ fontWeight: 700, color: '#003024', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Principal / Head of Academics Remark
                </div>
                <p style={{ color: '#334d44', fontSize: '0.92rem', fontStyle: 'italic' }}>
                  "{studentProfile.principalRemarks}"
                </p>
                <div style={{ marginTop: '16px', borderTop: '1px dashed #cbd5d0', paddingTop: '8px', fontSize: '0.8rem', color: '#5e7970' }}>
                  School Stamp: <strong>Crea8orz Academic Verification Seal Confirmed</strong>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#5e7970', borderTop: '1px solid #e2e8e4', paddingTop: '16px' }}>
              This electronic document is valid without an embossed physical seal when authenticated online through the portal verification code: <strong>CR8-2026-AUTHTQ7729</strong>.
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}
