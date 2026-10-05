import React, { useEffect, useRef, useState } from 'react';
import { CARD_W, CARD_H, PANEL_HEIGHT, RESULT_THEME, TABLE_COLUMNS, gradeTone, buildRecord, sessionStamp } from '../lib/resultCard';
import logoImg from '../assets/images/crea8orz_logo.png';

const MONO = 'Consolas, "Courier New", monospace';

const INFO_FIELDS = [
  { key: 'studentName', label: 'Student Name', flex: 2.6 },
  { key: 'studentClass', label: 'Class', flex: 1.4 },
  { key: 'sex', label: 'Sex', flex: 1 },
  { key: 'reportDateLabel', label: 'Date of Progress Report', flex: 2 },
  { key: 'academicYear', label: 'Academic Year', flex: 1.5 },
  { key: 'term', label: 'Term', flex: 1.4 }
];

const SANS = "'Inter', 'Segoe UI', Arial, Helvetica, sans-serif";

function useFitWidth(containerRef) {
  const [width, setWidth] = useState(CARD_W);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const measure = () => {
      const available = node.clientWidth;
      if (available > 0) setWidth(Math.min(available, CARD_W));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [containerRef]);

  return width;
}

export default function ResultCard({ record: input, width: forcedWidth }) {
  const containerRef = useRef(null);
  const fittedWidth = useFitWidth(containerRef);
  const width = forcedWidth || fittedWidth;
  const scale = width / CARD_W;
  const record = buildRecord(input);

  const colTemplate = TABLE_COLUMNS.map((col) => `${col.width}fr`).join(' ');
  const session = sessionStamp(record.academicYear);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <div
        style={{
          width: CARD_W,
          height: CARD_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          backgroundColor: '#ffffff',
          color: RESULT_THEME.ink,
          fontFamily: SANS,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 18px 40px -12px rgba(0, 48, 36, 0.35)',
          border: '1px solid #d7e0db',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Header band */}
        <div
          style={{
            height: 150,
            background: `linear-gradient(115deg, ${RESULT_THEME.green} 0%, ${RESULT_THEME.greenSoft} 58%, ${RESULT_THEME.green} 100%)`,
            borderBottom: `6px solid ${RESULT_THEME.lime}`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 44px',
            gap: 20,
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: 316,
              height: 114,
              borderRadius: 10,
              backgroundColor: '#ffffff',
              border: `2px solid ${RESULT_THEME.lime}`,
              flexShrink: 0,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <img
              src={logoImg}
              alt="Crea8orz Academy"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 292
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '0.6px',
                whiteSpace: 'nowrap',
                lineHeight: 1.1
              }}
            >
              {record.school.name}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: RESULT_THEME.lime, marginTop: 8, letterSpacing: '0.4px' }}>
              {record.school.motto}
            </div>
          </div>

          <div style={{ textAlign: 'right', color: 'rgba(255,255,255,0.88)', fontSize: 13, fontWeight: 600, lineHeight: 1.6, flexShrink: 0 }}>
            {record.school.campuses.map((campus) => (
              <div key={campus.label} style={{ whiteSpace: 'nowrap' }}>
                {campus.label}: {campus.address}
              </div>
            ))}
            <div style={{ color: RESULT_THEME.lime, whiteSpace: 'nowrap' }}>
              {record.school.contacts} &nbsp;•&nbsp; {record.school.email}
            </div>
          </div>
        </div>

        {/* Title band */}
        <div
          style={{
            height: 56,
            backgroundColor: RESULT_THEME.lime,
            color: RESULT_THEME.green,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 27,
            fontWeight: 800,
            letterSpacing: '3.4px',
            flexShrink: 0,
            borderLeft: `14px solid ${RESULT_THEME.green}`,
            borderRight: `14px solid ${RESULT_THEME.green}`
          }}
        >
          TERMLY ACADEMIC PERFORMANCE SUMMARY
        </div>

        {/* Student info row */}
        <div style={{ display: 'flex', gap: 0, padding: '18px 44px 6px', flexShrink: 0 }}>
          {INFO_FIELDS.map((field) => {
            const value = String(record[field.key] || '').trim() || '—';
            return (
              <div key={field.key} style={{ flex: field.flex, paddingRight: 16, minWidth: 0 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: RESULT_THEME.muted, letterSpacing: '0.4px' }}>
                  {field.label.toUpperCase()}
                </div>
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: 700,
                    color: RESULT_THEME.ink,
                    marginTop: 6,
                    borderBottom: '1.4px solid #d7e0db',
                    paddingBottom: 5,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Subject table */}
        <div style={{ padding: '12px 44px 0', flexShrink: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: colTemplate, border: `2px solid ${RESULT_THEME.green}` }}>
            <div style={{ display: 'contents' }}>
              {TABLE_COLUMNS.map((col) => (
                <div
                  key={col.key}
                  style={{
                    backgroundColor: RESULT_THEME.green,
                    color: '#ffffff',
                    height: 44,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: col.align === 'center' ? 'center' : 'flex-start',
                    justifyContent: 'center',
                    padding: col.align === 'center' ? 0 : '0 14px'
                  }}
                >
                  {col.sub ? (
                    <>
                      <span style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.1 }}>{col.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: RESULT_THEME.lime, lineHeight: 1.1 }}>{col.sub}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.5px' }}>{col.label}</span>
                  )}
                </div>
              ))}
            </div>

            {record.rows.map((row, index) => (
              <React.Fragment key={row.subject}>
                <div
                  style={{
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 14px',
                    fontSize: 15.5,
                    fontWeight: 600,
                    borderTop: '1px solid #d7e0db',
                    backgroundColor: index % 2 === 0 ? '#ffffff' : RESULT_THEME.rowAlt,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                  }}
                >
                  {row.subject}
                </div>
                {['classWork', 'homeWork', 'test', 'exam'].map((key) => (
                  <div
                    key={key}
                    style={{
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 15,
                      fontWeight: 600,
                      borderTop: '1px solid #d7e0db',
                      borderLeft: '1px solid #d7e0db',
                      color: row.pending ? '#b6c2bc' : RESULT_THEME.ink,
                      backgroundColor: index % 2 === 0 ? '#ffffff' : RESULT_THEME.rowAlt
                    }}
                  >
                    {row.pending ? '—' : row[key]}
                  </div>
                ))}
                <div
                  style={{
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 800,
                    color: row.pending ? '#b6c2bc' : RESULT_THEME.green,
                    borderTop: '1px solid #d7e0db',
                    borderLeft: '1px solid #d7e0db',
                    backgroundColor: index % 2 === 0 ? '#ffffff' : RESULT_THEME.rowAlt
                  }}
                >
                  {row.pending ? '—' : row.total}
                </div>
                <div
                  style={{
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTop: '1px solid #d7e0db',
                    borderLeft: '1px solid #d7e0db',
                    backgroundColor: index % 2 === 0 ? '#ffffff' : RESULT_THEME.rowAlt
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 58,
                      height: 23,
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 800,
                      backgroundColor: row.pending ? '#f1f5f3' : gradeTone(row.grade).fill,
                      color: row.pending ? '#9aa8a2' : gradeTone(row.grade).text
                    }}
                  >
                    {row.pending ? '—' : row.grade}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: RESULT_THEME.muted, marginTop: 12 }}>
            <span style={{ fontWeight: 600, color: RESULT_THEME.green }}>Student ID: {record.studentId || '—'}</span>
            <span>Grading: A1 75-100 • B2 70-74 • B3 65-69 • C4-C6 50-64 • D7-E8 40-49 • F9 0-39</span>
          </div>
        </div>

        {/* Status + sign-off */}
        <div style={{ display: 'flex', gap: 28, padding: '16px 44px 0', flexShrink: 0, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 700,
              height: PANEL_HEIGHT,
              border: `2px solid ${RESULT_THEME.green}`,
              borderRadius: 10,
              overflow: 'hidden',
              backgroundColor: RESULT_THEME.panel,
              flexShrink: 0
            }}
          >
            <div
              style={{
                height: 36,
                backgroundColor: RESULT_THEME.green,
                borderBottom: `2px solid ${RESULT_THEME.lime}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 18px'
              }}
            >
              <span style={{ color: '#ffffff', fontSize: 15, fontWeight: 800, letterSpacing: '1.4px' }}>TERMLY ACADEMIC STATUS</span>
              <span style={{ color: RESULT_THEME.lime, fontSize: 11, fontWeight: 600 }}>
                {record.committedSubjects} OF {record.totalSubjects} SUBJECTS COMMITTED
              </span>
            </div>

            <div style={{ padding: '18px 24px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    border: `2.4px solid ${record.honourRoll ? RESULT_THEME.green : '#94a3b8'}`,
                    borderRadius: 4,
                    backgroundColor: record.honourRoll ? RESULT_THEME.lime : '#ffffff',
                    color: RESULT_THEME.green,
                    fontSize: 16,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {record.honourRoll ? '✓' : ''}
                </span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>HONOUR ROLL</div>
                  <div style={{ fontSize: 11.5, color: RESULT_THEME.muted }}>Awarded automatically at 75% and above</div>
                </div>
              </div>

              {[
                { label: 'TERMLY AVERAGE', value: record.averageText },
                { label: 'CERTIFICATES (90% AND ABOVE)', value: `${record.certificates} subject${record.certificates === 1 ? '' : 's'}` }
              ].map((entry) => (
                <div
                  key={entry.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #d7e0db',
                    marginTop: 12,
                    paddingTop: 10
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: RESULT_THEME.muted }}>{entry.label}</span>
                  <span style={{ fontSize: 25, fontWeight: 800, color: RESULT_THEME.green }}>{entry.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              height: PANEL_HEIGHT,
              border: `2px solid ${RESULT_THEME.green}`,
              borderRadius: 10,
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              position: 'relative',
              flexShrink: 0
            }}
          >
            <div
              style={{
                height: 36,
                backgroundColor: RESULT_THEME.green,
                borderBottom: `2px solid ${RESULT_THEME.lime}`,
                display: 'flex',
                alignItems: 'center',
                padding: '0 18px'
              }}
            >
              <span style={{ color: '#ffffff', fontSize: 15, fontWeight: 800, letterSpacing: '1.4px' }}>SIGNATURE &amp; ENDORSEMENT</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              {[
                { title: 'CLASS TEACHER', name: record.classTeacher, fallback: record.school.headTeacher },
                { title: 'PRINCIPAL', name: record.principal, fallback: record.school.principal }
              ].map((col) => (
                <div key={col.title} style={{ padding: '14px 24px 16px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: RESULT_THEME.muted, letterSpacing: '0.5px' }}>{col.title}</div>
                  <div style={{ fontSize: 19, fontWeight: 800, marginTop: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {col.name || col.fallback}
                  </div>
                  <div style={{ fontSize: 11.5, color: RESULT_THEME.muted, marginTop: 2 }}>Name in block letters</div>
                  <div style={{ borderBottom: '1.4px dashed #94a3b8', marginTop: 28 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: RESULT_THEME.muted, marginTop: 5 }}>
                    <span>Signature</span>
                    <span>Date</span>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                position: 'absolute',
                top: 52,
                right: -50,
                width: 152,
                height: 152,
                borderRadius: '50%',
                border: '5px solid rgba(185, 28, 28, 0.55)',
                outline: '2px dashed rgba(185, 28, 28, 0.45)',
                outlineOffset: -13,
                transform: 'rotate(-14deg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(185, 28, 28, 0.6)',
                backgroundColor: 'rgba(185, 28, 28, 0.05)',
                pointerEvents: 'none'
              }}
            >
              <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '0.5px' }}>VERIFIED</span>
              <span style={{ fontSize: 9.5, fontWeight: 700, marginTop: 3 }}>CREA8ORZ ACADEMY</span>
              <span style={{ fontSize: 9.5, fontWeight: 700 }}>SECONDARY SCHOOL</span>
              <span style={{ fontSize: 8.5, fontWeight: 600, marginTop: 3 }}>OFFICIAL SCHOOL SEAL</span>
              {session && (
                <span style={{ fontSize: 8.5, fontWeight: 600, marginTop: 2 }}>{session}</span>
              )}
            </div>
          </div>
        </div>

        {/* Camera timestamp + file label */}
        <div
          style={{
            position: 'absolute',
            left: 66,
            bottom: 12,
            color: '#ff9a3c',
            fontFamily: MONO,
            fontSize: 20,
            fontWeight: 700,
            textShadow: '1px 1px 2px rgba(0,0,0,0.55)'
          }}
        >
          {record.cameraStamp}
        </div>
        <div
          style={{
            position: 'absolute',
            right: 22,
            bottom: 12,
            color: 'rgba(5, 47, 36, 0.45)',
            fontFamily: MONO,
            fontSize: 15,
            fontWeight: 600
          }}
        >
          {record.label}
        </div>
      </div>

      <div style={{ height: CARD_H * scale }} />
    </div>
  );
}
