import React, { useMemo, useState } from 'react';
import { Download, LogOut, Sparkles, FileCheck2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import Crea8orzLogo from './Crea8orzLogo';
import ResultCardEditor from './ResultCardEditor';
import { TERMS, ACADEMIC_YEARS, buildRoster, classKeyFromStudentId } from '../lib/academics';
import { usePortalState, getCommittedSubjects, sessionKey } from '../lib/portalStore';
import { cardFileName } from '../lib/resultCard';

export default function StudentDashboard({ user, onLogout }) {
  const [term, setTerm] = useState('Second Term');
  const [academicYear, setAcademicYear] = useState('2025/2026');

  const admissionNo = user?.admissionNo || user?.studentId || '';
  const classKey = classKeyFromStudentId(admissionNo) || 'JSS 2 A';

  const state = usePortalState();
  const session = sessionKey(academicYear, term);
  const student = useMemo(() => {
    const roster = buildRoster(classKey);
    return roster.find((entry) => entry.studentId === admissionNo) || roster[0];
  }, [classKey, admissionNo]);

  const committedSubjects = useMemo(() => getCommittedSubjects(state, session, classKey), [state, session, classKey]);
  const fileName = cardFileName({ studentName: student.name, term, academicYear });

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      colors: ['#003024', '#A8F044', '#ffffff', '#fbbf24'],
      origin: { y: 0.6 }
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8faf9', display: 'flex', flexDirection: 'column' }}>
      <nav className="no-print" style={{ backgroundColor: 'white', borderBottom: '2px solid rgba(0, 48, 36, 0.08)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>
          <Crea8orzLogo height={36} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#003024' }}>{student.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#5e7970' }}>{student.studentId} • {classKey}</div>
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

      <main style={{ flex: 1, padding: '36px 0' }}>
        <div className="container">
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '2rem', color: '#003024', marginBottom: '4px' }}>My Termly Result</h1>
              <p style={{ color: '#5e7970', fontSize: '0.95rem' }}>
                Official Crea8orz Academy progress report card, released by your class teachers
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #cbd5d0', backgroundColor: 'white', fontWeight: 600, fontSize: '0.9rem', color: '#003024', outline: 'none' }}
              >
                {ACADEMIC_YEARS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #cbd5d0', backgroundColor: 'white', fontWeight: 600, fontSize: '0.9rem', color: '#003024', outline: 'none' }}
              >
                {TERMS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <button onClick={triggerCelebration} className="btn btn-lime" style={{ padding: '10px 16px' }}>
                <Sparkles size={18} /> Celebrate
              </button>
            </div>
          </div>

          <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 22, border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.82rem', color: '#5e7970', fontWeight: 700, marginBottom: '6px' }}>SUBJECTS RELEASED</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#003024' }}>
                {committedSubjects.length}<span style={{ fontSize: '1.2rem', color: '#5e7970' }}> / 15</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#5e7970', marginTop: '4px' }}>Published by your subject teachers</div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 22, border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)', gridColumn: 'span 2' }}>
              <div style={{ fontSize: '0.82rem', color: '#5e7970', fontWeight: 700, marginBottom: '10px' }}>RELEASED SUBJECTS</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {committedSubjects.length === 0 && (
                  <span style={{ fontSize: '0.87rem', color: '#b45309' }}>
                    No results released yet for {classKey}. Your teachers are still entering scores.
                  </span>
                )}
                {committedSubjects.map((entry) => (
                  <span key={entry} className="badge badge-lime" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <FileCheck2 size={12} /> {entry}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <ResultCardEditor
            key={session}
            fixedStudentId={student.studentId}
            defaultLevel={classKey.split(' ')[0]}
            defaultArm={classKey.split(' ')[1]}
            defaultTerm={term}
            defaultAcademicYear={academicYear}
            readOnly
          />

          <div className="no-print" style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.83rem', color: '#5e7970' }}>
              Downloaded file: <strong style={{ color: '#003024', fontFamily: 'Consolas, "Courier New", monospace' }}>{fileName}</strong>
            </p>
            <button onClick={triggerCelebration} className="btn btn-primary" style={{ padding: '11px 20px', marginTop: '10px' }}>
              <Download size={17} /> Use the Download JPG button on the card to save a copy
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
