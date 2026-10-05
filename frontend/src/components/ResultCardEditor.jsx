import React, { useEffect, useMemo, useState } from 'react';
import { Download, Camera, CheckCircle2, Eye, FileCheck2, Search, X } from 'lucide-react';
import ResultCard from './ResultCard';
import { downloadResultCardPdf, ensureLogo } from '../lib/resultCardImage';
import {
  CLASS_LEVELS,
  CLASS_ARMS,
  TERMS,
  ACADEMIC_YEARS,
  SUBJECT_CATALOG,
  buildRoster,
  classKey as makeClassKey,
  classKeyFromStudentId
} from '../lib/academics';
import { usePortalState, getCommittedRows, getCommittedSubjects, sessionKey } from '../lib/portalStore';
import { buildRecord, SCHOOL, cardFileName } from '../lib/resultCard';

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
  marginBottom: '6px'
};

const readOnlyStyle = {
  ...fieldStyle,
  backgroundColor: '#f1f5f3',
  color: '#003024',
  cursor: 'default'
};

export default function ResultCardEditor({
  fixedStudentId = '',
  defaultLevel = 'JSS 2',
  defaultArm = 'A',
  defaultTerm = 'Second Term',
  defaultAcademicYear = '2025/2026',
  defaultClassTeacher = SCHOOL.classTeacher,
  readOnly = false
}) {
  const initialKey = makeClassKey(defaultLevel, defaultArm);
  const resolvedKey = classKeyFromStudentId(fixedStudentId);

  const [level, setLevel] = useState(defaultLevel);
  const [arm, setArm] = useState(defaultArm);
  const [studentId, setStudentId] = useState('');
  const [studentQuery, setStudentQuery] = useState('');
  const [term, setTerm] = useState(defaultTerm);
  const [academicYear, setAcademicYear] = useState(defaultAcademicYear);
  const [reportDate, setReportDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [classTeacher, setClassTeacher] = useState(defaultClassTeacher);
  const [principal, setPrincipal] = useState(SCHOOL.principal);
  const [includeDraft, setIncludeDraft] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [status, setStatus] = useState('');
  const [downloading, setDownloading] = useState(false);

  const state = usePortalState();
  const classKey = resolvedKey || makeClassKey(level, arm);
  const session = sessionKey(academicYear, term);
  const roster = useMemo(() => buildRoster(classKey), [classKey]);

  useEffect(() => {
    if (fixedStudentId) {
      const match = roster.find((student) => student.studentId === fixedStudentId);
      if (match) {
        setStudentId(match.id);
        return;
      }
    }
    setStudentId((prev) => (roster.some((student) => student.id === prev) ? prev : roster[0].id));
  }, [classKey, fixedStudentId, roster]);

  useEffect(() => {
    ensureLogo();
  }, []);

  const studentMatches = useMemo(() => {
    const needle = studentQuery.trim().toLowerCase();
    if (!needle) return roster;
    return roster.filter(
      (entry) =>
        entry.name.toLowerCase().includes(needle) ||
        entry.studentId.toLowerCase().includes(needle)
    );
  }, [roster, studentQuery]);

  useEffect(() => {
    setStudentQuery('');
  }, [classKey]);

  const student = roster.find((entry) => entry.id === studentId) || roster[0];
  const rows = useMemo(
    () => getCommittedRows(state, session, classKey, student.id, { includeDraft }),
    [state, session, classKey, student.id, includeDraft]
  );

  const committedSubjects = useMemo(() => getCommittedSubjects(state, session, classKey), [state, session, classKey]);

  const record = useMemo(
    () =>
      buildRecord({
        studentName: student.name,
        studentId: student.studentId,
        studentClass: classKey,
        sex: student.sex,
        reportDate,
        academicYear,
        term,
        classTeacher,
        principal,
        rows
      }),
    [student, classKey, reportDate, academicYear, term, classTeacher, principal, rows]
  );

  const fileName = cardFileName({ studentName: student.name, term, academicYear });
  const pendingSubjects = SUBJECT_CATALOG.filter((subject) => !committedSubjects.includes(subject));

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadResultCardPdf(record, { scale: 1, frame: true, quality: 0.95 });
      setStatus(`Saved to your downloads folder as ${fileName}`);
    } catch (error) {
      setStatus('Could not generate the PDF. Please try again.');
    } finally {
      setDownloading(false);
      setTimeout(() => setStatus(''), 6000);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', color: '#003024', fontWeight: 800, marginBottom: '4px' }}>Termly Progress Report Card</h3>
          <span style={{ fontSize: '0.88rem', color: '#5e7970' }}>
            {readOnly
              ? 'Your official report card, compiled from committed gradebook entries'
              : 'Scores are compiled automatically from committed gradebook entries'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: 10,
              backgroundColor: 'rgba(0, 48, 36, 0.06)',
              border: '1px dashed #003024',
              fontFamily: 'Consolas, "Courier New", monospace',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#003024'
            }}
          >
            <Camera size={15} /> {fileName}
          </span>
          <button type="button" onClick={handleDownload} disabled={downloading} className="btn btn-lime" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
            <Download size={16} /> {downloading ? 'Rendering...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {status && (
        <div style={{ padding: '12px 18px', backgroundColor: 'rgba(168, 240, 68, 0.2)', border: '1px solid #A8F044', borderRadius: 12, color: '#003024', fontSize: '0.9rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} />
          <span>{status}</span>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: readOnly ? 'minmax(0, 1fr)' : 'minmax(0, 420px) minmax(0, 1fr)',
          gap: '28px',
          alignItems: 'start'
        }}
        className="rc-layout"
      >
        {!readOnly && (
        <div className="no-print">
          <div style={{ backgroundColor: '#ffffff', borderRadius: 18, padding: 24, border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Class Level</label>
                <select
                  value={level}
                  disabled={Boolean(resolvedKey)}
                  onChange={(e) => setLevel(e.target.value)}
                  style={resolvedKey ? readOnlyStyle : fieldStyle}
                >
                  {CLASS_LEVELS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Class Arm</label>
                <select
                  value={arm}
                  disabled={Boolean(resolvedKey)}
                  onChange={(e) => setArm(e.target.value)}
                  style={resolvedKey ? readOnlyStyle : fieldStyle}
                >
                  {CLASS_ARMS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Student</label>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#5e7970' }}>
                  {studentQuery.trim()
                    ? `${studentMatches.length} of ${roster.length} match`
                    : `${roster.length} enrolled`}
                </span>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5e7970', display: 'flex' }}>
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  value={studentQuery}
                  onChange={(e) => setStudentQuery(e.target.value)}
                  placeholder="Search by student name or ID"
                  aria-label="Search students by name or student ID"
                  style={{ ...fieldStyle, paddingLeft: '38px', paddingRight: studentQuery ? '38px' : '14px' }}
                  onFocus={(e) => (e.target.style.borderColor = '#003024')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5d0')}
                />
                {studentQuery && (
                  <button
                    type="button"
                    onClick={() => setStudentQuery('')}
                    aria-label="Clear search"
                    title="Clear search"
                    style={{
                      position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '26px', height: '26px', padding: 0,
                      border: 'none', borderRadius: '7px',
                      backgroundColor: 'transparent', color: '#5e7970', cursor: 'pointer'
                    }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div
                style={{
                  marginTop: '10px',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  border: '1px solid #e2e8e4',
                  borderRadius: 10,
                  backgroundColor: '#ffffff'
                }}
              >
                {studentMatches.length === 0 && (
                  <div style={{ padding: '16px 14px', textAlign: 'center', fontSize: '0.85rem', color: '#5e7970', fontWeight: 600 }}>
                    No students match &ldquo;{studentQuery.trim()}&rdquo;.
                  </div>
                )}

                {studentMatches.map((entry) => {
                  const isSelected = entry.id === student.id;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      disabled={Boolean(fixedStudentId)}
                      onClick={() => {
                        setStudentId(entry.id);
                        setStudentQuery('');
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        textAlign: 'left',
                        padding: '10px 14px',
                        border: 'none',
                        borderBottom: '1px solid #e2e8e4',
                        backgroundColor: isSelected ? 'rgba(168, 240, 68, 0.22)' : '#ffffff',
                        cursor: fixedStudentId ? 'default' : 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#003024' }}>{entry.name}</span>
                      <span style={{ fontSize: '0.78rem', color: '#5e7970', fontFamily: 'Consolas, "Courier New", monospace', whiteSpace: 'nowrap' }}>{entry.studentId}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: '16px', padding: '14px 16px', backgroundColor: '#f4f7f5', border: '1px solid #e2e8e4', borderRadius: 12 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#5e7970', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Auto-loaded from student ID</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#003024', marginTop: '6px' }}>{student.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#334d44', marginTop: '3px' }}>
                {student.studentId} &nbsp;•&nbsp; {classKey} &nbsp;•&nbsp; {student.sex}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
              <div>
                <label style={labelStyle}>Date of Progress Report</label>
                <input type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} style={fieldStyle} />
              </div>
              <div>
                <label style={labelStyle}>Academic Year</label>
                <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} style={fieldStyle}>
                  {ACADEMIC_YEARS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Term</label>
                <select value={term} onChange={(e) => setTerm(e.target.value)} style={fieldStyle}>
                  {TERMS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Class</label>
                <input type="text" value={classKey} readOnly style={readOnlyStyle} />
              </div>
              <div>
                <label style={labelStyle}>Class Teacher's Name</label>
                <input type="text" value={classTeacher} onChange={(e) => setClassTeacher(e.target.value)} placeholder="Name in block letters" style={fieldStyle} />
              </div>
              <div>
                <label style={labelStyle}>Principal's Name</label>
                <input type="text" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="Name in block letters" style={fieldStyle} />
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: 18, padding: 24, border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)', marginTop: 24 }}>
            <h4 style={{ fontSize: '1rem', color: '#003024', fontWeight: 800, marginBottom: '14px' }}>Published Subjects</h4>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {committedSubjects.length === 0 && (
                <span style={{ fontSize: '0.85rem', color: '#b45309' }}>
                  Nothing committed yet. Use Gradebook Entry to enter and commit scores.
                </span>
              )}
              {committedSubjects.map((entry) => (
                <span key={entry} className="badge badge-lime" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <FileCheck2 size={12} /> {entry}
                </span>
              ))}
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.87rem', color: '#003024', fontWeight: 600, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeDraft}
                onChange={(e) => setIncludeDraft(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#003024' }}
              />
              Include uncommitted draft scores in the preview
            </label>

            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e2e8e4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-primary">Average {record.averageText}</span>
                <span className="badge badge-gold">{record.certificates} certificate{record.certificates === 1 ? '' : 's'}</span>
                {record.draftSubjects > 0 && (
                  <span className="badge badge-gold">{record.draftSubjects} uncommitted draft{record.draftSubjects === 1 ? '' : 's'}</span>
                )}
                {!record.hasResults && (
                  <span className="badge badge-primary">No results published yet</span>
                )}
              </div>
              <button type="button" onClick={() => setShowPreview((prev) => !prev)} className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                <Eye size={14} /> {showPreview ? 'Hide card' : 'Show card'}
              </button>
            </div>

            {pendingSubjects.length > 0 && (
              <p style={{ fontSize: '0.8rem', color: '#5e7970', marginTop: '12px' }}>
                Awaiting commit: {pendingSubjects.join(', ')}
              </p>
            )}

            <p style={{ fontSize: '0.8rem', color: '#92400e', marginTop: '10px', fontWeight: 600 }}>
              Amber rows are uncommitted drafts. They are preview-only and are excluded from the average, certificates and
              honour roll &mdash; a subject counts once a teacher commits it.
            </p>
          </div>
        </div>
        )}

        {showPreview && (
          <div
            style={{
              aspectRatio: '1720 / 1216',
              boxSizing: 'border-box',
              padding: '2.79% 3.49%',
              borderRadius: 18,
              border: '1px solid #e2e8e4',
              background: 'linear-gradient(135deg, #e6ece9 0%, #c3cfc9 100%)'
            }}
          >
            <ResultCard record={record} />
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .rc-layout { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
