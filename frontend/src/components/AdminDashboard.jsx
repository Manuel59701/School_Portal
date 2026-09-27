import React, { useState } from 'react';
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
  RotateCcw
} from 'lucide-react';
import { INITIAL_CLASSES, INITIAL_TEACHERS, INITIAL_STUDENTS } from '../mockData';
import Crea8orzLogo from './Crea8orzLogo';
import { clearAllResults } from '../lib/portalStore';

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('classes');
  
  const [classesList, setClassesList] = useState(INITIAL_CLASSES);
  const [teachersList, setTeachersList] = useState(INITIAL_TEACHERS);
  const [newClassModal, setNewClassModal] = useState(false);
  const [newTeacherModal, setNewTeacherModal] = useState(false);

  const [newClassName, setNewClassName] = useState('');
  const [newClassLevel, setNewClassLevel] = useState('secondary');
  const [newClassSection, setNewClassSection] = useState('Senior Secondary');

  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('');
  const [newTeacherClass, setNewTeacherClass] = useState('SSS 2 Sapphire (Tech/Science)');

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
    if (!newClassName) return;
    const newEntry = {
      id: Date.now(),
      name: newClassName,
      level: newClassLevel,
      section: newClassSection,
      studentCount: 0
    };
    setClassesList([...classesList, newEntry]);
    setNewClassName('');
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
      status: "Active"
    };
    setTeachersList([...teachersList, newEntry]);
    setNewTeacherName('');
    setNewTeacherEmail('');
    setNewTeacherSubject('');
    setNewTeacherModal(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8faf9', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header with Crea8orz Deep Green & Lime */}
      <nav style={{ backgroundColor: '#00221a', color: 'white', position: 'sticky', top: 0, zIndex: 50, borderBottom: '2px solid rgba(168, 240, 68, 0.2)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>
          <Crea8orzLogo height={36} variant="light" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>System Administrator</div>
              <div style={{ fontSize: '0.8rem', color: '#A8F044' }}>Executive Console Authority</div>
            </div>
            <button
              onClick={handleResetAll}
              className="btn btn-outline"
              title="Clear every score and published subject in the portal"
              style={{ padding: '8px 14px', fontSize: '0.85rem', color: '#fcd34d', borderColor: '#78350f', backgroundColor: 'transparent' }}
            >
              <RotateCcw size={16} /> Reset Results
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
      <main style={{ flex: 1, padding: '36px 0' }}>
        <div className="container">
          
          {/* Admin Stats Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#5e7970', fontWeight: 700 }}>TOTAL CLASS ARMS</span>
                <School size={20} color="#003024" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#003024' }}>{classesList.length}</div>
              <div style={{ fontSize: '0.8rem', color: '#5e7970' }}>Nursery, Primary & Secondary</div>
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
          <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e2e8e4', marginBottom: '28px', paddingBottom: '4px' }}>
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
            <div style={{ backgroundColor: 'white', borderRadius: '18px', padding: '32px', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: '#003024', fontWeight: 800 }}>Class Structure & Academic Divisions</h3>
                  <p style={{ color: '#5e7970', fontSize: '0.9rem' }}>Configure Nursery, Primary, and Secondary grade classes and arms</p>
                </div>
                <button onClick={() => setNewClassModal(true)} className="btn btn-lime">
                  <Plus size={18} /> Create New Class Arm
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
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
                    {classesList.map((cls) => (
                      <tr key={cls.id} style={{ borderBottom: '1px solid #f1f5f3' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 800, color: '#003024' }}>{cls.name}</td>
                        <td style={{ padding: '14px 16px', textTransform: 'capitalize' }}>
                          <span className={`badge ${cls.level === 'nursery' ? 'badge-primary' : cls.level === 'primary' ? 'badge-emerald' : 'badge-lime'}`}>
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
            </div>
          )}

          {/* TAB 2: TEACHERS MANAGEMENT */}
          {activeTab === 'teachers' && (
            <div style={{ backgroundColor: 'white', borderRadius: '18px', padding: '32px', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: '#003024', fontWeight: 800 }}>Teacher Staff Accounts</h3>
                  <p style={{ color: '#5e7970', fontSize: '0.9rem' }}>Create and assign teachers to class arms and academic subjects</p>
                </div>
                <button onClick={() => setNewTeacherModal(true)} className="btn btn-lime">
                  <Plus size={18} /> Register Teacher Account
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#003024', color: 'white' }}>
                      <th style={{ padding: '14px 16px', borderTopLeftRadius: '8px' }}>Faculty Name</th>
                      <th style={{ padding: '14px 16px' }}>Institutional Email</th>
                      <th style={{ padding: '14px 16px' }}>Specialization Subject</th>
                      <th style={{ padding: '14px 16px' }}>Assigned Class Master</th>
                      <th style={{ padding: '14px 16px', borderTopRightRadius: '8px' }}>Account Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachersList.map((tch) => (
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
                          <span className="badge badge-lime">Verified Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: OVERSEE RESULTS */}
          {activeTab === 'results' && (
            <div style={{ backgroundColor: 'white', borderRadius: '18px', padding: '32px', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: '#003024', fontWeight: 800 }}>Crea8orz Result Registry Overview</h3>
                  <p style={{ color: '#5e7970', fontSize: '0.9rem' }}>Audit and review uploaded termly performance sheets across all departments</p>
                </div>
                <span className="badge badge-lime" style={{ padding: '6px 14px' }}>Second Term 2025/2026 Session</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#003024', color: 'white' }}>
                      <th style={{ padding: '14px 16px', borderTopLeftRadius: '8px' }}>Class</th>
                      <th style={{ padding: '14px 16px' }}>Subject Track</th>
                      <th style={{ padding: '14px 16px' }}>Class Master</th>
                      <th style={{ padding: '14px 16px' }}>Submission Method</th>
                      <th style={{ padding: '14px 16px' }}>Status</th>
                      <th style={{ padding: '14px 16px', borderTopRightRadius: '8px' }}>Approval</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f3' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 800 }}>SSS 2 Sapphire (Tech/Science)</td>
                      <td style={{ padding: '14px 16px' }}>Physics & Computer Science</td>
                      <td style={{ padding: '14px 16px' }}>Dr. Sarah Adebayo</td>
                      <td style={{ padding: '14px 16px', color: '#003024', fontWeight: 600 }}>OCR Snapshot + Direct Form</td>
                      <td style={{ padding: '14px 16px' }}><span className="badge badge-lime">Published to Students</span></td>
                      <td style={{ padding: '14px 16px', color: '#003024', fontWeight: 800 }}>Approved</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f3' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 800 }}>JSS 2 Gold</td>
                      <td style={{ padding: '14px 16px' }}>English Studies</td>
                      <td style={{ padding: '14px 16px' }}>Mr. Chukwuemeka Obi</td>
                      <td style={{ padding: '14px 16px' }}>Direct Form</td>
                      <td style={{ padding: '14px 16px' }}><span className="badge badge-lime">Published to Students</span></td>
                      <td style={{ padding: '14px 16px', color: '#003024', fontWeight: 800 }}>Approved</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f3' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 800 }}>Primary 4 Emerald</td>
                      <td style={{ padding: '14px 16px' }}>Basic Science & Tech</td>
                      <td style={{ padding: '14px 16px' }}>Mrs. Fatima Bello</td>
                      <td style={{ padding: '14px 16px' }}>Direct Form</td>
                      <td style={{ padding: '14px 16px' }}><span className="badge badge-gold">Under Review</span></td>
                      <td style={{ padding: '14px 16px', color: '#d97706', fontWeight: 700 }}>Pending Lock</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: NEWSLETTER SUBSCRIBERS */}
          {activeTab === 'newsletter' && (
            <div style={{ backgroundColor: 'white', borderRadius: '18px', padding: '32px', border: '1px solid #e2e8e4', boxShadow: 'var(--shadow-sm)' }}>
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

              <div style={{ overflowX: 'auto' }}>
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 34, 26, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '18px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: 'var(--shadow-xl)', border: '2px solid #003024' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#003024', fontWeight: 800, marginBottom: '8px' }}>Create New Class Arm</h3>
            <p style={{ color: '#5e7970', fontSize: '0.9rem', marginBottom: '20px' }}>Register an academic class arm for Crea8orz Academy</p>

            <form onSubmit={handleAddClass} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#003024', marginBottom: '6px' }}>Class Arm Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SSS 1 Ruby (Tech/Engineering)"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5d0', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#003024', marginBottom: '6px' }}>Level Scope</label>
                <select
                  value={newClassLevel}
                  onChange={(e) => setNewClassLevel(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5d0', outline: 'none' }}
                >
                  <option value="nursery">Nursery / Early Years</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#003024', marginBottom: '6px' }}>Section</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Secondary"
                  value={newClassSection}
                  onChange={(e) => setNewClassSection(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5d0', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setNewClassModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-lime">Create Class</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register Teacher */}
      {newTeacherModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 34, 26, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '18px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: 'var(--shadow-xl)', border: '2px solid #003024' }}>
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setNewTeacherModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-lime">Register Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
