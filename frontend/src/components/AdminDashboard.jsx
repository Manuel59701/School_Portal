import React, { useEffect, useMemo, useState } from 'react';
import { 
  School, 
  Users, 
  BookOpen, 
  FileSpreadsheet, 
  Mail, 
  Plus, 
  LogOut, 
  CheckCircle, 
  ShieldCheck,
  Search,
  Filter,
  BarChart2,
  RotateCcw,
  Pencil,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { INITIAL_CLASSES, INITIAL_TEACHERS, INITIAL_STUDENTS } from '../mockData';
import { CLASS_LEVELS, CLASS_ARMS, classKey, rosterSize, TERMS, ACADEMIC_YEARS } from '../lib/academics';
import Crea8orzLogo from './Crea8orzLogo';
import { clearAllResults, getResultsRegistry, sessionKey, usePortalState } from '../lib/portalStore';

const CLASS_PAGE_SIZE = 10;
const DELETE_GRACE_SECONDS = 30;

function paginate(items, page, size = CLASS_PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(page, totalPages);
  return {
    totalPages,
    current,
    visible: items.slice((current - 1) * size, current * size)
  };
}

function PaginationBar({ current, totalPages, total, noun, onChange }) {
  if (totalPages <= 1) return null;

  const buttonStyle = (isCurrent) => ({
    minWidth: '34px',
    padding: '7px 10px',
    borderRadius: 8,
    border: isCurrent ? '1px solid #003024' : '1px solid #cbd5d0',
    backgroundColor: isCurrent ? '#003024' : '#ffffff',
    color: isCurrent ? '#ffffff' : '#003024',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer'
  });

  const windowSize = Math.min(totalPages, 5);
  const start = Math.max(1, Math.min(current - Math.floor(windowSize / 2), totalPages - windowSize + 1));
  const numbers = Array.from({ length: windowSize }, (_, index) => start + index);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginTop: '18px', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '0.83rem', color: '#5e7970' }}>
        Showing {(current - 1) * CLASS_PAGE_SIZE + 1}&ndash;{Math.min(current * CLASS_PAGE_SIZE, total)} of {total} {noun}
      </span>

          <div className="page-numbers">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, current - 1))}
          disabled={current === 1}
          style={{ ...buttonStyle(false), opacity: current === 1 ? 0.45 : 1, cursor: current === 1 ? 'default' : 'pointer' }}
        >
          Prev
        </button>

        {numbers.map((number) => (
          <button
            key={number}
            type="button"
            onClick={() => onChange(number)}
            aria-current={number === current ? 'page' : undefined}
            style={buttonStyle(number === current)}
          >
            {number}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onChange(Math.min(totalPages, current + 1))}
          disabled={current === totalPages}
          style={{ ...buttonStyle(false), opacity: current === totalPages ? 0.45 : 1, cursor: current === totalPages ? 'default' : 'pointer' }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('classes');
  
  const [classesList, setClassesList] = useState(INITIAL_CLASSES);
  const [teachersList, setTeachersList] = useState(INITIAL_TEACHERS);
  const [newClassModal, setNewClassModal] = useState(false);
  const [newTeacherModal, setNewTeacherModal] = useState(false);

  const [newClassLevel, setNewClassLevel] = useState(CLASS_LEVELS[0]);
  const [newClassArm, setNewClassArm] = useState(CLASS_ARMS[0]);
  const [classError, setClassError] = useState('');

  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('');
  const [newTeacherClass, setNewTeacherClass] = useState('SSS 2 A');

  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editTeacherName, setEditTeacherName] = useState('');
  const [editTeacherEmail, setEditTeacherEmail] = useState('');
  const [editTeacherSubject, setEditTeacherSubject] = useState('');
  const [editTeacherClass, setEditTeacherClass] = useState('SSS 2 A');
  const [editTeacherPassword, setEditTeacherPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editTeacherError, setEditTeacherError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteCountdown, setDeleteCountdown] = useState(DELETE_GRACE_SECONDS);
  const [classPage, setClassPage] = useState(1);
  const [teacherPage, setTeacherPage] = useState(1);
  const [resultPage, setResultPage] = useState(1);
  const [resultTab, setResultTab] = useState('published');
  const [resultYear, setResultYear] = useState(ACADEMIC_YEARS[0]);
  const [resultTerm, setResultTerm] = useState(TERMS[1] || TERMS[0]);

  const portal = usePortalState();
  const registry = useMemo(
    () => getResultsRegistry(portal, sessionKey(resultYear, resultTerm)),
    [portal, resultYear, resultTerm]
  );

  const publishedRows = useMemo(() => registry.filter((row) => row.published), [registry]);
  const pendingRows = useMemo(() => registry.filter((row) => !row.published), [registry]);
  const activeResultRows = resultTab === 'published' ? publishedRows : pendingRows;

  const classPagination = paginate(classesList, classPage);
  const teacherPagination = paginate(teachersList, teacherPage);
  const resultPagination = paginate(activeResultRows, resultPage);

  const classMasterFor = (armName) => {
    const match = teachersList.find((t) => t.classAssigned === armName);
    return match ? match.name : 'Unassigned';
  };

  useEffect(() => {
    setClassPage(1);
  }, [classesList.length]);

  useEffect(() => {
    setTeacherPage(1);
  }, [teachersList.length]);

  useEffect(() => {
    setResultPage(1);
  }, [resultTab, resultYear, resultTerm, registry.length]);

  // Destructive-action grace period: the confirm button stays locked for 30s.
  useEffect(() => {
    if (!deleteTarget) return undefined;
    setDeleteCountdown(DELETE_GRACE_SECONDS);
    const timer = setInterval(() => {
      setDeleteCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [deleteTarget]);

  const handleResetAll = () => {
    const ok = window.confirm(
      'Reset ALL results?\n\nThis clears every score, draft and published subject for all classes, terms and academic years. Students will see empty report cards until teachers commit again.'
    );
    if (!ok) return;
    clearAllResults();
  };

  const [subscribers, setSubscribers] = useState(() => {
    const saved = localStorage.getItem('portal_newsletter');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      { email: 'patricia.smith@crea8orz.com', date: '2026-03-24' },
      { email: 'ibrahim.kalu@techafrica.org', date: '2026-03-22' },
      { email: 'dr.adeola@education.lagosstate.gov.ng', date: '2026-03-20' }
    ];
  });

  const handleAddClass = (e) => {
    e.preventDefault();
    const name = classKey(newClassLevel, newClassArm);

    if (classesList.some((c) => c.name === name)) {
      setClassError(`${name} already exists. All ${CLASS_LEVELS.length * CLASS_ARMS.length} class arms (${CLASS_LEVELS[0]} – ${CLASS_LEVELS[CLASS_LEVELS.length - 1]} × ${CLASS_ARMS.join(', ')}) are active.`);
      return;
    }

    setClassError('');
    setClassesList([
      ...classesList,
      {
        id: Date.now(),
        name,
        level: newClassLevel.startsWith('JSS') ? 'junior' : 'senior',
        section: newClassLevel.startsWith('JSS') ? 'Junior Secondary' : 'Senior Secondary',
        studentCount: rosterSize(name)
      }
    ]);
    setNewClassModal(false);
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!newTeacherName || !newTeacherEmail) return;
    const newEntry = {
      id: Date.now(),
      name: newTeacherName,
      email: newTeacherEmail,
      subject: newTeacherSubject,
      classAssigned: newTeacherClass,
      password: '',
      status: "Active"
    };
    setTeachersList([...teachersList, newEntry]);
    setNewTeacherName('');
    setNewTeacherEmail('');
    setNewTeacherSubject('');
    setNewTeacherModal(false);
  };

  const openEditTeacher = (tch) => {
    setEditingTeacher(tch);
    setEditTeacherName(tch.name || '');
    setEditTeacherEmail(tch.email || '');
    setEditTeacherSubject(tch.subject || '');
    setEditTeacherClass(tch.classAssigned || CLASS_LEVELS[0] + ' A');
    setEditTeacherPassword('');
    setShowEditPassword(false);
    setEditTeacherError('');
  };

  const handleSaveTeacher = (e) => {
    e.preventDefault();
    if (!editingTeacher) return;

    if (!editTeacherName.trim()) {
      setEditTeacherError('Faculty name is required.');
      return;
    }
    if (!editTeacherEmail.trim()) {
      setEditTeacherError('Institutional email is required.');
      return;
    }
    if (editTeacherPassword && editTeacherPassword.length < 6) {
      setEditTeacherError('New password must be at least 6 characters.');
      return;
    }
    const duplicateEmail = teachersList.some(
      (t) => t.id !== editingTeacher.id && t.email.trim().toLowerCase() === editTeacherEmail.trim().toLowerCase()
    );
    if (duplicateEmail) {
      setEditTeacherError('Another staff account already uses that email.');
      return;
    }

    setTeachersList(
      teachersList.map((t) =>
        t.id === editingTeacher.id
          ? {
              ...t,
              name: editTeacherName.trim(),
              email: editTeacherEmail.trim(),
              subject: editTeacherSubject.trim(),
              classAssigned: editTeacherClass,
              ...(editTeacherPassword ? { password: editTeacherPassword } : {})
            }
          : t
      )
    );
    setEditingTeacher(null);
  };

  const handleDeleteTeacher = (tch) => {
    setDeleteTarget(tch);
  };

  const cancelDeleteTeacher = () => {
    setDeleteTarget(null);
  };

  const confirmDeleteTeacher = () => {
    if (!deleteTarget || deleteCountdown > 0) return;
    setTeachersList(teachersList.filter((t) => t.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8faf9', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header with Crea8orz Deep Green & Lime */}
      <nav style={{ backgroundColor: '#00221a', color: 'white', position: 'sticky', top: 0, zIndex: 50, borderBottom: '2px solid rgba(168, 240, 68, 0.2)' }}>
          <div className="container nav-bar" style={{ minHeight: 68 }}>
            <Crea8orzLogo height={36} variant="light" />

            <div className="nav-actions" style={{ gap: 20 }}>
              <div className="hide-xs-down nav-user" style={{ textAlign: 'right' }}>
              <div className="nav-user-name" style={{ fontWeight: 800, color: '#ffffff' }}>System Administrator</div>
              <div className="nav-user-sub" style={{ color: '#A8F044' }}>Executive Console Authority</div>
            </div>
            <button
              onClick={handleResetAll}
              className="btn btn-outline"
              title="Clear every score and published subject in the portal"
              aria-label="Reset all results"
              style={{ padding: '8px 14px', fontSize: '0.85rem', color: '#fcd34d', borderColor: '#78350f', backgroundColor: 'transparent' }}
            >
              <RotateCcw size={16} /> <span className="btn-label">Reset Results</span>
            </button>
            <button 
              onClick={onLogout}
              className="btn btn-outline"
              style={{ padding: '8px 14px', fontSize: '0.85rem', color: '#fca5a5', borderColor: '#7f1d1d', backgroundColor: 'transparent' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main style={{ flex: 1, padding: 'clamp(20px, 4vw, 36px) 0' }}>
        <div className="container">
          
          {/* Admin Stats Strip */}
              <div className="grid-stats" style={{ marginBottom: 32 }}>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#5e7970', fontWeight: 700 }}>TOTAL CLASS ARMS</span>
                <School size={20} color="#003024" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#003024' }}>{classesList.length}</div>
                <div style={{ fontSize: '0.8rem', color: '#5e7970' }}>Junior &amp; Senior Secondary</div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#5e7970', fontWeight: 700 }}>TEACHER FACULTY</span>
                <Users size={20} color="#003024" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#003024' }}>{teachersList.length}</div>
              <div style={{ fontSize: '0.8rem', color: '#003024', fontWeight: 700 }}>Active Certified Educators</div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#5e7970', fontWeight: 700 }}>ENROLLED SCHOLARS</span>
                <BookOpen size={20} color="#003024" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#003024' }}>1,540</div>
              <div style={{ fontSize: '0.8rem', color: '#5e7970' }}>Active Registered Students</div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#5e7970', fontWeight: 700 }}>BULLETIN SUBSCRIBERS</span>
                <Mail size={20} color="#003024" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#003024' }}>{subscribers.length}</div>
              <div style={{ fontSize: '0.8rem', color: '#5e7970' }}>Public Leads Captured</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="tab-strip" style={{ gap: 12, borderBottom: '2px solid #e2e8e4', marginBottom: 28, paddingBottom: 4 }}>
            {[
              { id: 'classes', label: 'Manage Classes & Arms', icon: School },
              { id: 'teachers', label: 'Teacher Staff Accounts', icon: Users },
              { id: 'results', label: 'Oversee School Results', icon: FileSpreadsheet },
              { id: 'newsletter', label: 'Newsletter Subscribers', icon: Mail }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    borderRadius: '10px 10px 0 0',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    transition: 'all 0.2s',
                    backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                    color: activeTab === tab.id ? '#003024' : '#5e7970',
                    borderBottom: activeTab === tab.id ? '3px solid #003024' : '3px solid transparent'
                  }}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: CLASSES MANAGEMENT */}
          {activeTab === 'classes' && (
            <div style={{ backgroundColor: 'white', borderRadius: '18px', padding: 'var(--panel-pad)', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: '#003024', fontWeight: 800 }}>Class Structure & Academic Divisions</h3>
                  <p style={{ color: '#5e7970', fontSize: '0.9rem' }}>Class arms from {CLASS_LEVELS[0]} to {CLASS_LEVELS[CLASS_LEVELS.length - 1]} ({CLASS_ARMS.join(', ')}) &mdash; the same arms teachers and students select</p>
                </div>
                <button onClick={() => setNewClassModal(true)} className="btn btn-lime">
                  <Plus size={18} /> Create New Class Arm
                </button>
              </div>

              <div className="table-scroll">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#003024', color: 'white' }}>
                      <th style={{ padding: '14px 16px', borderTopLeftRadius: '8px' }}>Class Name</th>
                      <th style={{ padding: '14px 16px' }}>Academic Level</th>
                      <th style={{ padding: '14px 16px' }}>Division Section</th>
                      <th style={{ padding: '14px 16px' }}>Enrolled Students</th>
                      <th style={{ padding: '14px 16px', borderTopRightRadius: '8px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classPagination.visible.map((cls) => (
                      <tr key={cls.id} style={{ borderBottom: '1px solid #f1f5f3' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 800, color: '#003024' }}>{cls.name}</td>
                        <td style={{ padding: '14px 16px', textTransform: 'capitalize' }}>
                          <span className={`badge ${cls.level === 'junior' ? 'badge-emerald' : 'badge-lime'}`}>
                            {cls.level}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#334d44' }}>{cls.section}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: '#003024' }}>{cls.studentCount} Students</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ color: '#003024', fontWeight: 700, fontSize: '0.85rem' }}>Active Arm</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationBar
                current={classPagination.current}
                totalPages={classPagination.totalPages}
                total={classesList.length}
                noun="class arms"
                onChange={setClassPage}
              />
            </div>
          )}

          {/* TAB 2: TEACHERS MANAGEMENT */}
          {activeTab === 'teachers' && (
            <div style={{ backgroundColor: 'white', borderRadius: '18px', padding: 'var(--panel-pad)', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: '#003024', fontWeight: 800 }}>Teacher Staff Accounts</h3>
                  <p style={{ color: '#5e7970', fontSize: '0.9rem' }}>Create and assign teachers to class arms and academic subjects</p>
                </div>
                <button onClick={() => setNewTeacherModal(true)} className="btn btn-lime">
                  <Plus size={18} /> Register Teacher Account
                </button>
              </div>

              <div className="table-scroll">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#003024', color: 'white' }}>
                      <th style={{ padding: '14px 16px', borderTopLeftRadius: '8px' }}>Faculty Name</th>
                      <th style={{ padding: '14px 16px' }}>Institutional Email</th>
                      <th style={{ padding: '14px 16px' }}>Specialization Subject</th>
                      <th style={{ padding: '14px 16px' }}>Assigned Class Master</th>
                      <th style={{ padding: '14px 16px' }}>Credentials</th>
                      <th style={{ padding: '14px 16px' }}>Account Status</th>
                      <th style={{ padding: '14px 16px', borderTopRightRadius: '8px' }}>Manage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherPagination.visible.map((tch) => (
                      <tr key={tch.id} style={{ borderBottom: '1px solid #f1f5f3' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 800, color: '#003024' }}>{tch.name}</td>
                        <td style={{ padding: '14px 16px', color: '#003024', fontWeight: 600 }}>{tch.email}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: '#334d44' }}>{tch.subject}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ backgroundColor: '#eef3f0', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#003024' }}>
                            {tch.classAssigned}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className={`badge ${tch.password ? 'badge-emerald' : 'badge-gold'}`}>
                            {tch.password ? 'Password Set' : 'No Password'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className="badge badge-lime">Verified Active</span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div className="tab-strip">
                            <button type="button" onClick={() => openEditTeacher(tch)} className="btn btn-outline" style={{ padding: '7px 12px', fontSize: '0.78rem' }}>
                              <Pencil size={14} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTeacher(tch)}
                              className="btn btn-outline"
                              style={{ padding: '7px 12px', fontSize: '0.78rem', color: '#b91c1c', borderColor: '#fecaca' }}
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationBar
                current={teacherPagination.current}
                totalPages={teacherPagination.totalPages}
                total={teachersList.length}
                noun="staff accounts"
                onChange={setTeacherPage}
              />
            </div>
          )}

          {/* TAB 3: OVERSEE RESULTS */}
          {activeTab === 'results' && (
            <div style={{ backgroundColor: 'white', borderRadius: '18px', padding: 'var(--panel-pad)', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: '#003024', fontWeight: 800 }}>Crea8orz Result Registry Overview</h3>
                  <p style={{ color: '#5e7970', fontSize: '0.9rem' }}>Audit published results and track subjects teachers have yet to publish</p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    value={resultTerm}
                    onChange={(e) => setResultTerm(e.target.value)}
                    aria-label="Result term"
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5d0', outline: 'none', fontWeight: 700, color: '#003024' }}
                  >
                    {TERMS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <select
                    value={resultYear}
                    onChange={(e) => setResultYear(e.target.value)}
                    aria-label="Academic year"
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5d0', outline: 'none', fontWeight: 700, color: '#003024' }}
                  >
                    {ACADEMIC_YEARS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setResultTab('published')}
                  aria-pressed={resultTab === 'published'}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 10,
                    border: resultTab === 'published' ? '2px solid #003024' : '1px solid #cbd5d0',
                    backgroundColor: resultTab === 'published' ? '#003024' : '#ffffff',
                    color: resultTab === 'published' ? '#ffffff' : '#003024',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <CheckCircle size={16} /> Published ({publishedRows.length})
                </button>
                <button
                  type="button"
                  onClick={() => setResultTab('pending')}
                  aria-pressed={resultTab === 'pending'}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 10,
                    border: resultTab === 'pending' ? '2px solid #d97706' : '1px solid #cbd5d0',
                    backgroundColor: resultTab === 'pending' ? '#fef3c7' : '#ffffff',
                    color: '#92400e',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FileSpreadsheet size={16} /> Pending ({pendingRows.length})
                </button>
              </div>

              <div className="table-scroll">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#003024', color: 'white' }}>
                      <th style={{ padding: '14px 16px', borderTopLeftRadius: '8px' }}>Class</th>
                      <th style={{ padding: '14px 16px' }}>Subject</th>
                      <th style={{ padding: '14px 16px' }}>Class Master</th>
                      <th style={{ padding: '14px 16px' }}>Drafts Entered</th>
                      <th style={{ padding: '14px 16px' }}>Published</th>
                      <th style={{ padding: '14px 16px', borderTopRightRadius: '8px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultPagination.visible.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ padding: '32px 16px', textAlign: 'center', color: '#5e7970', fontWeight: 600 }}>
                          {resultTab === 'published'
                            ? `No published results for ${resultTerm} ${resultYear}. Teachers appear here once they commit a subject.`
                            : `Nothing pending. Every subject with entered drafts has been published for ${resultTerm} ${resultYear}.`}
                        </td>
                      </tr>
                    )}

                    {resultPagination.visible.map((row) => (
                      <tr key={`${row.classKey}-${row.subject}`} style={{ borderBottom: '1px solid #f1f5f3' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 800, color: '#003024' }}>{row.classKey}</td>
                        <td style={{ padding: '14px 16px', color: '#334d44', fontWeight: 600 }}>{row.subject}</td>
                        <td style={{ padding: '14px 16px' }}>{classMasterFor(row.classKey)}</td>
                        <td style={{ padding: '14px 16px', color: '#334d44' }}>{row.draftCount}</td>
                        <td style={{ padding: '14px 16px', color: '#334d44' }}>{row.publishedCount}</td>
                        <td style={{ padding: '14px 16px' }}>
                          {row.published ? (
                            <span className="badge badge-lime">Published to Students</span>
                          ) : (
                            <span className="badge badge-gold">Awaiting Publish</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationBar
                current={resultPagination.current}
                totalPages={resultPagination.totalPages}
                total={activeResultRows.length}
                noun={resultTab === 'published' ? 'published subjects' : 'pending subjects'}
                onChange={setResultPage}
              />
            </div>
          )}

          {/* TAB 4: NEWSLETTER SUBSCRIBERS */}
          {activeTab === 'newsletter' && (
            <div style={{ backgroundColor: 'white', borderRadius: '18px', padding: 'var(--panel-pad)', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: '#003024', fontWeight: 800 }}>Captured Newsletter Leads</h3>
                  <p style={{ color: '#5e7970', fontSize: '0.9rem' }}>Public email addresses captured through the landing page subscription form</p>
                </div>
                <button 
                  onClick={() => alert(`Exported ${subscribers.length} subscriber emails to CSV successfully.`)} 
                  className="btn btn-outline"
                >
                  Export CSV List
                </button>
              </div>

              <div className="table-scroll">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#003024', color: 'white' }}>
                      <th style={{ padding: '14px 16px', borderTopLeftRadius: '8px' }}>Subscriber Email</th>
                      <th style={{ padding: '14px 16px' }}>Capture Date</th>
                      <th style={{ padding: '14px 16px', borderTopRightRadius: '8px' }}>Channel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f3' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: '#003024' }}>{sub.email}</td>
                        <td style={{ padding: '14px 16px', color: '#5e7970' }}>{sub.date || 'Recent'}</td>
                        <td style={{ padding: '14px 16px' }}><span className="badge badge-lime">Landing Page Form</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Modal: Create Class */}
      {newClassModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 34, 26, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100 }}>
          <div className="modal-card" style={{ backgroundColor: 'white', borderRadius: '18px', width: '100%', maxWidth: '480px', boxShadow: 'var(--shadow-xl)', border: '2px solid #003024' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#003024', fontWeight: 800, marginBottom: '8px' }}>Create New Class Arm</h3>
            <p style={{ color: '#5e7970', fontSize: '0.9rem', marginBottom: '20px' }}>Register an academic class arm for Crea8orz Academy</p>

            <form onSubmit={handleAddClass} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#003024', marginBottom: '6px' }}>Academic Level</label>
                <select
                  value={newClassLevel}
                  onChange={(e) => setNewClassLevel(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5d0', outline: 'none' }}
                >
                  {CLASS_LEVELS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#003024', marginBottom: '6px' }}>Class Arm</label>
                <select
                  value={newClassArm}
                  onChange={(e) => setNewClassArm(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5d0', outline: 'none' }}
                >
                  {CLASS_ARMS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div style={{ padding: '14px 16px', backgroundColor: '#f4f7f5', border: '1px solid #e2e8e4', borderRadius: 12 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#5e7970', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Class name</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#003024', marginTop: '6px' }}>{classKey(newClassLevel, newClassArm)}</div>
                <div style={{ fontSize: '0.85rem', color: '#334d44', marginTop: '3px' }}>
                  {newClassLevel.startsWith('JSS') ? 'Junior Secondary' : 'Senior Secondary'} &middot; enrolled{' '}
                  {rosterSize(classKey(newClassLevel, newClassArm))} students
                </div>
              </div>

              {classError && (
                <div style={{ padding: '12px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: '#b91c1c', fontSize: '0.85rem', fontWeight: 600 }}>
                  {classError}
                </div>
              )}

              <div className="btn-row stack-sm" style={{ justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => { setNewClassModal(false); setClassError(''); }} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-lime">Create Class</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register Teacher */}
      {newTeacherModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 34, 26, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100 }}>
          <div className="modal-card" style={{ backgroundColor: 'white', borderRadius: '18px', width: '100%', maxWidth: '480px', boxShadow: 'var(--shadow-xl)', border: '2px solid #003024' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#003024', fontWeight: 800, marginBottom: '8px' }}>Register Teacher Account</h3>
            <p style={{ color: '#5e7970', fontSize: '0.9rem', marginBottom: '20px' }}>Create an authorized staff account for result submission</p>

            <form onSubmit={handleAddTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#003024', marginBottom: '6px' }}>Teacher Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mrs. Adeola Williams"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5d0', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#003024', marginBottom: '6px' }}>Institutional Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. a.williams@crea8orz.academy"
                  value={newTeacherEmail}
                  onChange={(e) => setNewTeacherEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5d0', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#003024', marginBottom: '6px' }}>Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Chemistry & Robotics"
                  value={newTeacherSubject}
                  onChange={(e) => setNewTeacherSubject(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5d0', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#003024', marginBottom: '6px' }}>Assigned Class Arm</label>
                <select
                  value={newTeacherClass}
                  onChange={(e) => setNewTeacherClass(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5d0', outline: 'none' }}
                >
                  {classesList.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div className="btn-row stack-sm" style={{ justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setNewTeacherModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-lime">Register Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Teacher */}
      {editingTeacher && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 34, 26, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100 }}>
          <div className="modal-card" style={{ backgroundColor: 'white', borderRadius: '18px', width: '100%', maxWidth: '480px', boxShadow: 'var(--shadow-xl)', border: '2px solid #003024' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#003024', fontWeight: 800, marginBottom: '8px' }}>Edit Staff Account</h3>
            <p style={{ color: '#5e7970', fontSize: '0.9rem', marginBottom: '20px' }}>
              Update {editingTeacher.name}&rsquo;s details or reset their portal password
            </p>

            <form onSubmit={handleSaveTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#003024', marginBottom: '6px' }}>Teacher Full Name</label>
                <input
                  type="text"
                  required
                  value={editTeacherName}
                  onChange={(e) => setEditTeacherName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5d0', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#003024', marginBottom: '6px' }}>Institutional Email</label>
                <input
                  type="email"
                  required
                  value={editTeacherEmail}
                  onChange={(e) => setEditTeacherEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5d0', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#003024', marginBottom: '6px' }}>Subject</label>
                <input
                  type="text"
                  value={editTeacherSubject}
                  onChange={(e) => setEditTeacherSubject(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5d0', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#003024', marginBottom: '6px' }}>Assigned Class Arm</label>
                <select
                  value={editTeacherClass}
                  onChange={(e) => setEditTeacherClass(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5d0', outline: 'none' }}
                >
                  {classesList.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#003024', marginBottom: '6px' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder={editingTeacher.password ? 'Leave blank to keep current password' : 'e.g. Crea8orz2026'}
                    value={editTeacherPassword}
                    onChange={(e) => setEditTeacherPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 44px 10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5d0',
                      outline: 'none'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#003024')}
                    onBlur={(e) => (e.target.style.borderColor = '#cbd5d0')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword((prev) => !prev)}
                    aria-label={showEditPassword ? 'Hide password' : 'Show password'}
                    title={showEditPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: '6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '30px',
                      height: '30px',
                      padding: 0,
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      color: showEditPassword ? '#003024' : '#5e7970',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 48, 36, 0.07)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {showEditPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                <span style={{ display: 'block', fontSize: '0.78rem', color: '#5e7970', marginTop: '5px' }}>
                  Minimum 6 characters. Leave blank to keep the existing password.
                </span>
              </div>

              {editTeacherError && (
                <div style={{ padding: '12px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: '#b91c1c', fontSize: '0.85rem', fontWeight: 600 }}>
                  {editTeacherError}
                </div>
              )}

              <div className="btn-row stack-sm" style={{ justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setEditingTeacher(null)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-lime">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Teacher */}
      {deleteTarget && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 34, 26, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100 }}>
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-teacher-heading"
            className="modal-card"
            style={{ backgroundColor: 'white', borderRadius: '18px', width: '100%', maxWidth: '480px', boxShadow: 'var(--shadow-xl)', border: '2px solid #b91c1c' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#fef2f2', color: '#b91c1c', flexShrink: 0 }}>
                <Trash2 size={20} />
              </span>
              <h3 id="delete-teacher-heading" style={{ fontSize: '1.3rem', color: '#b91c1c', fontWeight: 800, margin: 0 }}>
                Delete Staff Account
              </h3>
            </div>

            <p style={{ color: '#334d44', fontSize: '0.95rem', lineHeight: 1.55, marginBottom: '12px' }}>
              Performing this action deletes this account and is <strong>not reversible</strong>. Are you sure you want to delete
              the <strong style={{ color: '#003024' }}>&ldquo;{deleteTarget.name}&rdquo;</strong> account?
            </p>

            <div style={{ padding: '12px 14px', backgroundColor: '#f8faf9', border: '1px solid #e2e8e4', borderRadius: 10, fontSize: '0.85rem', color: '#334d44' }}>
              <div style={{ fontWeight: 700, color: '#003024' }}>{deleteTarget.email}</div>
              <div style={{ marginTop: '3px' }}>
                {deleteTarget.classAssigned}
                {deleteTarget.subject ? ` \u00b7 ${deleteTarget.subject}` : ''}
              </div>
              <div style={{ marginTop: '6px', color: '#5e7970' }}>
                Results this teacher already published stay in the registry, but the class will show as Unassigned.
              </div>
            </div>

            <div className="btn-row stack-sm" style={{ justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={cancelDeleteTeacher} className="btn btn-outline">
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTeacher}
                disabled={deleteCountdown > 0}
                aria-disabled={deleteCountdown > 0}
                style={{
                  backgroundColor: deleteCountdown > 0 ? '#e5e7eb' : '#b91c1c',
                  color: deleteCountdown > 0 ? '#9ca3af' : '#ffffff',
                  border: '1px solid ' + (deleteCountdown > 0 ? '#e5e7eb' : '#b91c1c'),
                  padding: '10px 18px',
                  borderRadius: 8,
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: deleteCountdown > 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {deleteCountdown > 0 ? `Confirm Delete (${deleteCountdown})` : 'Confirm Delete'}
              </button>
            </div>

            {deleteCountdown > 0 && (
              <p style={{ marginTop: '10px', textAlign: 'right', fontSize: '0.78rem', color: '#5e7970', fontWeight: 600 }}>
                Confirmation unlocks in {deleteCountdown} second{deleteCountdown === 1 ? '' : 's'}
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
