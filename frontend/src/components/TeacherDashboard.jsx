import React, { useMemo, useState } from 'react';
import {
  Save,
  LogOut,
  Layers,
  FileImage,
  CheckCircle2,
  Check,
  GraduationCap,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import Crea8orzLogo from './Crea8orzLogo';
import ResultCardEditor from './ResultCardEditor';
import {
  CLASS_LEVELS,
  CLASS_ARMS,
  TERMS,
  ACADEMIC_YEARS,
  SUBJECT_CATALOG,
  buildRoster,
  classKey as makeClassKey
} from '../lib/academics';
import {
  usePortalState,
  getScores,
  setScore,
  commitSubject,
  getCommittedSubjects,
  sessionKey,
  clearAllResults
} from '../lib/portalStore';
import { SUBJECT_MAX, SCHOOL, withComputed } from '../lib/resultCard';

const fieldStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #cbd5d0',
  backgroundColor: '#ffffff',
  fontWeight: 700,
  fontSize: '0.9rem',
  color: '#003024',
  outline: 'none'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 700,
  color: '#003024',
  marginBottom: '8px'
};

const gradeTone = (grade) => {
  if (grade === 'A1') return { fill: '#A8F044', text: '#003024' };
  if (grade.startsWith('B')) return { fill: '#d1fae5', text: '#065f46' };
  if (grade.startsWith('C')) return { fill: '#fef3c7', text: '#92400e' };
  if (grade.startsWith('D') || grade.startsWith('E')) return { fill: '#ffedd5', text: '#9a3412' };
  return { fill: '#fee2e2', text: '#9f1239' };
};

export default function TeacherDashboard({ user, onLogout }) {
  const [level, setLevel] = useState('JSS 2');
  const [arm, setArm] = useState('A');
  const [subject, setSubject] = useState(SUBJECT_CATALOG[0]);
  const [term, setTerm] = useState('Second Term');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [activePanel, setActivePanel] = useState('gradebook');
  const [notice, setNotice] = useState(null);

  const state = usePortalState();
  const classKey = makeClassKey(level, arm);
  const session = sessionKey(academicYear, term);
  const roster = useMemo(() => buildRoster(classKey), [classKey]);
  const committed = useMemo(() => getCommittedSubjects(state, session, classKey), [state, session, classKey]);
  const subjectCommitted = committed.includes(subject);

  const rows = roster.map((student) => {
    const scores = getScores(state, session, classKey, student.id);
    const entry = scores[subject];
    return {
      student,
      scores: withComputed({
        classWork: entry ? entry.classWork : 0,
        homeWork: entry ? entry.homeWork : 0,
        test: entry ? entry.test : 0,
        exam: entry ? entry.exam : 0
      }),
      hasEntry: Boolean(entry)
    };
  });

  const enteredCount = rows.filter((row) => row.hasEntry).length;
  const classAverage = (() => {
    const filled = rows.filter((row) => row.hasEntry);
    if (!filled.length) return '—';
    const total = filled.reduce((sum, row) => sum + row.scores.total, 0);
    return `${(total / filled.length).toFixed(2)}%`;
  })();

  const handleScoreChange = (studentId, field, value) => {
    const max = SUBJECT_MAX[field];
    const num = Math.min(max, Math.max(0, Number(value) || 0));
    setScore(session, classKey, studentId, subject, field, num);
  };

  const handleCommit = () => {
    if (enteredCount === 0) {
      setNotice({ type: 'error', text: `Enter scores for at least one student in ${subject} before committing.` });
      setTimeout(() => setNotice(null), 5000);
      return;
    }
    const touched = commitSubject(session, classKey, subject);
    setNotice({
      type: 'success',
      text: `${subject} committed for ${touched} students in ${classKey} • ${term} ${academicYear}. The progress report card now shows these scores.`
    });
    setTimeout(() => setNotice(null), 6000);
  };

  const handleResetAll = () => {
    const ok = window.confirm(
      'Reset ALL results?\n\nThis clears every score, draft and published subject for all classes, terms and academic years. Students will see empty report cards until you commit again.'
    );
    if (!ok) return;
    clearAllResults();
    setNotice({ type: 'success', text: 'All results cleared. The portal is back to zero scores.' });
    setTimeout(() => setNotice(null), 5000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8faf9', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ backgroundColor: 'white', borderBottom: '2px solid rgba(0, 48, 36, 0.08)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>
          <Crea8orzLogo height={36} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#003024' }}>{user?.name || 'Dr. Sarah Adebayo'}</div>
              <div style={{ fontSize: '0.8rem', color: '#5e7970' }}>Class Master • {subject}</div>
            </div>
            <button
              onClick={handleResetAll}
              className="btn btn-outline"
              title="Clear every score and published subject in the portal"
              style={{ padding: '8px 14px', fontSize: '0.85rem', color: '#b45309', borderColor: '#fcd34d' }}
            >
              <RotateCcw size={16} /> Reset Results
            </button>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '2rem', color: '#003024', marginBottom: '4px' }}>Result Submission &amp; Grading</h1>
              <p style={{ color: '#5e7970', fontSize: '0.95rem' }}>
                Enter Continuous Assessment and Examination marks per class arm, then commit to publish onto the progress report card
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setActivePanel('gradebook')}
                className={activePanel === 'gradebook' ? 'btn btn-primary' : 'btn btn-outline'}
                style={{ padding: '10px 18px', fontSize: '0.9rem' }}
              >
                <Layers size={17} /> Gradebook Entry
              </button>
              <button
                type="button"
                onClick={() => setActivePanel('reportCard')}
                className={activePanel === 'reportCard' ? 'btn btn-primary' : 'btn btn-outline'}
                style={{ padding: '10px 18px', fontSize: '0.9rem' }}
              >
                <FileImage size={17} /> Progress Report Card
              </button>
            </div>
          </div>

          {notice && (
            <div
              style={{
                padding: '14px 20px',
                backgroundColor: notice.type === 'success' ? 'rgba(168, 240, 68, 0.2)' : '#fef2f2',
                border: `1px solid ${notice.type === 'success' ? '#A8F044' : '#fecaca'}`,
                borderRadius: 12,
                color: notice.type === 'success' ? '#003024' : '#b91c1c',
                fontSize: '0.93rem',
                fontWeight: 600,
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              {notice.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span>{notice.text}</span>
            </div>
          )}

          {activePanel === 'gradebook' && (
            <>
              <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, border: '1px solid #e2e8e4', marginBottom: 28, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '18px' }}>
                  <div>
                    <label style={labelStyle}>Class Level</label>
                    <select value={level} onChange={(e) => setLevel(e.target.value)} style={fieldStyle}>
                      {CLASS_LEVELS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Class Arm</label>
                    <select value={arm} onChange={(e) => setArm(e.target.value)} style={fieldStyle}>
                      {CLASS_ARMS.map((option) => (
                        <option key={option} value={option}>{`${level} ${option}`}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Subject</label>
                    <select value={subject} onChange={(e) => setSubject(e.target.value)} style={fieldStyle}>
                      {SUBJECT_CATALOG.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Academic Term</label>
                    <select value={term} onChange={(e) => setTerm(e.target.value)} style={fieldStyle}>
                      {TERMS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Academic Year</label>
                    <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} style={fieldStyle}>
                      {ACADEMIC_YEARS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                  <span className="badge badge-primary">
                    <GraduationCap size={13} style={{ marginRight: 6 }} />
                    {level} {arm}
                  </span>
                  <span className="badge badge-emerald">{roster.length} students enrolled</span>
                  <span className={subjectCommitted ? 'badge badge-lime' : 'badge badge-gold'}>
                    {subjectCommitted ? <Check size={13} style={{ marginRight: 6 }} /> : null}
                    {subject} {subjectCommitted ? 'committed' : 'not committed'}
                  </span>
                  <span className="badge badge-gold">{committed.length} of {SUBJECT_CATALOG.length} subjects published</span>
                </div>
              </div>

              <div style={{ backgroundColor: 'white', borderRadius: 18, padding: 28, border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: '#003024', fontWeight: 800 }}>{level} {arm} — {subject}</h3>
                    <span style={{ fontSize: '0.85rem', color: '#5e7970' }}>
                      {enteredCount} of {roster.length} students scored • class average {classAverage} • {term}, {academicYear}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#5e7970' }}>CW 10 • HW 10 • Test 20 • Exam 60</span>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#003024', color: 'white' }}>
                        <th style={{ padding: '13px 14px', borderTopLeftRadius: 8, width: 130 }}>Student ID</th>
                        <th style={{ padding: '13px 14px' }}>Student Full Name</th>
                        <th style={{ padding: '13px 10px', textAlign: 'center', width: 60 }}>Sex</th>
                        <th style={{ padding: '13px 10px', textAlign: 'center', width: 104 }}>Class Work (10)</th>
                        <th style={{ padding: '13px 10px', textAlign: 'center', width: 104 }}>Home Work (10)</th>
                        <th style={{ padding: '13px 10px', textAlign: 'center', width: 104 }}>Test (20)</th>
                        <th style={{ padding: '13px 10px', textAlign: 'center', width: 104 }}>Exam (60)</th>
                        <th style={{ padding: '13px 10px', textAlign: 'center', width: 88 }}>Total (100)</th>
                        <th style={{ padding: '13px 14px', textAlign: 'center', width: 86, borderTopRightRadius: 8 }}>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map(({ student, scores }) => {
                        const tone = gradeTone(scores.grade);
                        return (
                          <tr key={student.id} style={{ borderBottom: '1px solid #e2e8e4' }}>
                            <td style={{ padding: '10px 14px', fontWeight: 700, color: '#5e7970', whiteSpace: 'nowrap' }}>{student.studentId}</td>
                            <td style={{ padding: '10px 14px', fontWeight: 700, color: '#003024' }}>{student.name}</td>
                            <td style={{ padding: '10px', textAlign: 'center', color: '#5e7970', fontSize: '0.85rem' }}>{student.sex}</td>

                            {['classWork', 'homeWork', 'test', 'exam'].map((key) => (
                              <td key={key} style={{ padding: '10px' }}>
                                <input
                                  type="number"
                                  min="0"
                                  max={SUBJECT_MAX[key]}
                                  value={scores[key]}
                                  onChange={(e) => handleScoreChange(student.id, key, e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '8px 6px',
                                    borderRadius: 8,
                                    border: '1px solid #cbd5d0',
                                    textAlign: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    color: '#003024',
                                    outline: 'none',
                                    backgroundColor: '#ffffff'
                                  }}
                                />
                              </td>
                            ))}

                            <td style={{ padding: '10px', textAlign: 'center', fontWeight: 800, color: '#003024', fontSize: '1rem' }}>{scores.total}</td>
                            <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                              <span style={{ display: 'inline-block', minWidth: 42, padding: '4px 8px', borderRadius: 6, fontWeight: 800, fontSize: '0.82rem', backgroundColor: tone.fill, color: tone.text }}>
                                {scores.grade}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <span style={{ fontSize: '0.83rem', color: '#5e7970' }}>
                    Totals and grades recalculate automatically. Committing publishes {subject} to every student&apos;s progress report card in {level} {arm}.
                  </span>
                  <button onClick={handleCommit} className="btn btn-lime" style={{ padding: '12px 26px' }}>
                    <Save size={18} /> Commit Gradebook Entries
                  </button>
                </div>
              </div>
            </>
          )}

          {activePanel === 'reportCard' && (
            <ResultCardEditor
              defaultLevel={level}
              defaultArm={arm}
              defaultTerm={term}
              defaultAcademicYear={academicYear}
              defaultClassTeacher={user?.name || SCHOOL.classTeacher}
            />
          )}
        </div>
      </main>
    </div>
  );
}
