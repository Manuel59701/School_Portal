import React, { useState } from 'react';
import { 
  GraduationCap, 
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

export default function StudentDashboard({ user, onLogout }) {
  const [selectedTerm, setSelectedTerm] = useState('Second Term 2025/2026');
  
  // Results data for Tariq or logged in student
  const studentProfile = {
    name: user?.name || "Tariq Emmanuel Johnson",
    admissionNo: user?.admissionNo || "STU/2026/0142",
    class: user?.class || "SSS 2 Sapphire (Science)",
    session: "2025/2026 Academic Session",
    term: selectedTerm,
    attendance: "96.4%",
    rank: "2nd out of 30 Students",
    totalMarks: 601,
    maxMarks: 700,
    average: "85.86%",
    principalRemarks: "Remarkable performance demonstrating exceptional academic diligence and deep understanding of STEM subjects.",
    teacherRemarks: "Keen analytical thinker. Consistent class participation and excellent conduct.",
    results: [
      { code: "MTH 201", subject: "Mathematics", ca: 28, exam: 64, total: 92, grade: "A1", remark: "Distinction" },
      { code: "ENG 201", subject: "English Language", ca: 25, exam: 61, total: 86, grade: "A1", remark: "Distinction" },
      { code: "PHY 201", subject: "Physics", ca: 27, exam: 62, total: 89, grade: "A1", remark: "Distinction" },
      { code: "CHM 201", subject: "Chemistry", ca: 26, exam: 59, total: 85, grade: "A1", remark: "Distinction" },
      { code: "BIO 201", subject: "Biology", ca: 24, exam: 54, total: 78, grade: "B2", remark: "Very Good" },
      { code: "ICT 201", subject: "Data Processing / ICT", ca: 29, exam: 66, total: 95, grade: "A1", remark: "Distinction" },
      { code: "CIV 201", subject: "Civic Education", ca: 23, exam: 57, total: 80, grade: "B2", remark: "Very Good" }
    ]
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <nav className="no-print" style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <GraduationCap size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>ST. AUGUSTINE ACADEMY</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Student Assessment Portal</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>{studentProfile.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{studentProfile.admissionNo} • {studentProfile.class}</div>
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
              <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '4px' }}>Termly Result Sheet</h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Official cumulative performance record and grading transcript</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: 'white', fontWeight: 600, fontSize: '0.9rem', color: '#334155', outline: 'none' }}
              >
                <option value="Second Term 2025/2026">Second Term 2025/2026</option>
                <option value="First Term 2025/2026">First Term 2025/2026</option>
                <option value="Third Term 2024/2025">Third Term 2024/2025</option>
              </select>

              <button 
                onClick={triggerCelebration}
                className="btn btn-outline"
                style={{ padding: '10px 16px', backgroundColor: '#fef3c7', color: '#b45309', borderColor: '#fde68a' }}
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
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>AVERAGE SCORE</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#2563eb' }}>{studentProfile.average}</div>
              <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, marginTop: '4px' }}>Grade Category: Distinction (A1)</div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>CLASS POSITION</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f59e0b' }}>2nd</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Out of 30 Students in Class</div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>TOTAL SCORE</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>{studentProfile.totalMarks} <span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>/ {studentProfile.maxMarks}</span></div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Across 7 Core Subjects</div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>ATTENDANCE RATE</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981' }}>{studentProfile.attendance}</div>
              <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>Regular & Punctual</div>
            </div>
          </div>

          {/* Official Printable Result Sheet */}
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '40px', border: '1px solid #cbd5e1', boxShadow: 'var(--shadow-md)' }}>
            
            {/* School Official Header on Sheet */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #1e3a8a', paddingBottom: '24px', marginBottom: '28px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <GraduationCap size={26} />
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e3a8a', letterSpacing: '-0.02em' }}>
                  ST. AUGUSTINE INTERNATIONAL ACADEMY
                </h2>
              </div>
              <p style={{ color: '#475569', fontSize: '0.9rem' }}>
                Plot 12, Academic Crescent, Royal Estate, Victoria Island, Lagos | info@staugustineacademy.edu
              </p>
              <div style={{ marginTop: '10px', display: 'inline-block', backgroundColor: '#f1f5f9', padding: '4px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a', textTransform: 'uppercase' }}>
                Official Termly Academic Transcript & Progress Report
              </div>
            </div>

            {/* Student Biodata Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '28px', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Student Name</span>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>{studentProfile.name}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Admission Number</span>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>{studentProfile.admissionNo}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Class / Section</span>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>{studentProfile.class}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Term & Session</span>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>{studentProfile.term}</div>
              </div>
            </div>

            {/* Grades Table */}
            <div style={{ overflowX: 'auto', marginBottom: '28px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1e293b', color: 'white' }}>
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
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#475569' }}>{row.code}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>{row.subject}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: '#334155' }}>{row.ca}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: '#334155' }}>{row.exam}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>{row.total}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '6px', 
                          fontWeight: 700, 
                          fontSize: '0.85rem',
                          backgroundColor: row.grade.startsWith('A') ? '#d1fae5' : '#e0e7ff',
                          color: row.grade.startsWith('A') ? '#065f46' : '#3730a3'
                        }}>
                          {row.grade}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 500, color: '#059669' }}>{row.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grading Scale Guide */}
            <div style={{ backgroundColor: '#f1f5f9', padding: '14px 18px', borderRadius: '8px', fontSize: '0.8rem', color: '#475569', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <span><strong>Grading Scale:</strong> A1 (75-100% Distinction)</span>
              <span>B2 (70-74% Very Good)</span>
              <span>B3 (65-69% Good)</span>
              <span>C4-C6 (50-64% Credit)</span>
              <span>D7-E8 (40-49% Pass)</span>
              <span>F9 (0-39% Fail)</span>
            </div>

            {/* Remarks Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', backgroundColor: '#ffffff' }}>
                <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Class Teacher's Remark
                </div>
                <p style={{ color: '#475569', fontSize: '0.92rem', fontStyle: 'italic' }}>
                  "{studentProfile.teacherRemarks}"
                </p>
                <div style={{ marginTop: '16px', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', fontSize: '0.8rem', color: '#64748b' }}>
                  Signature: <strong>Dr. Sarah Adebayo</strong> (Class Master)
                </div>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', backgroundColor: '#ffffff' }}>
                <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Principal / Head of Academics Remark
                </div>
                <p style={{ color: '#475569', fontSize: '0.92rem', fontStyle: 'italic' }}>
                  "{studentProfile.principalRemarks}"
                </p>
                <div style={{ marginTop: '16px', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', fontSize: '0.8rem', color: '#64748b' }}>
                  School Stamp: <strong>Academic Verification Seal Confirmed</strong>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              This electronic document is valid without an embossed physical seal when authenticated online through the portal verification code: <strong>SEC-2026-AUTHTQ7729</strong>.
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}
