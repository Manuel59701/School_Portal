export const CARD_W = 1600;
export const CARD_H = 1120;
export const CARD_GUTTER = 44;
export const PANEL_TOP = 872;
export const PANEL_HEIGHT = 204;

export const RESULT_THEME = {
  ink: '#0a1f18',
  body: '#334d44',
  muted: '#5e7970',
  green: '#003024',
  greenSoft: '#004635',
  lime: '#A8F044',
  line: '#d7e0db',
  rowAlt: '#f6f9f7',
  panel: '#fbfdfc',
  stamp: '#b91c1c'
};

export const RESULT_SUBJECTS = [
  'Mathematics',
  'English Language',
  'Igbo Language',
  'Computer Language / ICT',
  'Agric Science',
  'Civic Education',
  'C.R.K',
  'Basic Science',
  'Basic Technology',
  'French Language',
  'Social Studies',
  'Physical and Health Education',
  'Creative Arts',
  'Business Studies',
  'Reading'
];

export const SUBJECT_MAX = { classWork: 10, homeWork: 10, test: 20, exam: 60 };
export const SUBJECT_TOTAL_MAX = 100;

export const TABLE_COLUMNS = [
  { key: 'subject', label: 'SUBJECT', sub: '', width: 470, align: 'left' },
  { key: 'classWork', label: 'Class Work', sub: '(10%)', width: 150, align: 'center' },
  { key: 'homeWork', label: 'Home Work', sub: '(10%)', width: 150, align: 'center' },
  { key: 'test', label: 'Test', sub: '(20%)', width: 150, align: 'center' },
  { key: 'exam', label: 'Exam', sub: '(60%)', width: 160, align: 'center' },
  { key: 'total', label: 'Total', sub: '(100%)', width: 160, align: 'center' },
  { key: 'grade', label: 'Grade', sub: '', width: 272, align: 'center' }
];

export const GRADE_BANDS = [
  { min: 75, grade: 'A1', remark: 'Distinction' },
  { min: 70, grade: 'B2', remark: 'Very Good' },
  { min: 65, grade: 'B3', remark: 'Good' },
  { min: 60, grade: 'C4', remark: 'Credit' },
  { min: 55, grade: 'C5', remark: 'Credit' },
  { min: 50, grade: 'C6', remark: 'Credit' },
  { min: 45, grade: 'D7', remark: 'Pass' },
  { min: 40, grade: 'E8', remark: 'Pass' },
  { min: 0, grade: 'F9', remark: 'Fail' }
];

const GRADE_TONES = {
  A1: { fill: '#A8F044', text: '#003024' },
  B2: { fill: '#d1fae5', text: '#065f46' },
  B3: { fill: '#d1fae5', text: '#065f46' },
  C4: { fill: '#fef3c7', text: '#92400e' },
  C5: { fill: '#fef3c7', text: '#92400e' },
  C6: { fill: '#fef3c7', text: '#92400e' },
  D7: { fill: '#ffedd5', text: '#9a3412' },
  E8: { fill: '#ffedd5', text: '#9a3412' },
  F9: { fill: '#fee2e2', text: '#9f1239' }
};

export function gradeTone(grade) {
  return GRADE_TONES[grade] || { fill: '#e2e8e4', text: '#334d44' };
}

export function gradeFor(total) {
  const score = Number(total) || 0;
  const band = GRADE_BANDS.find((entry) => score >= entry.min);
  return band ? band.grade : 'F9';
}

export function remarkFor(total) {
  const score = Number(total) || 0;
  const band = GRADE_BANDS.find((entry) => score >= entry.min);
  return band ? band.remark : 'Fail';
}

export const SCHOOL = {
  name: 'CREA8ORZ ACADEMY',
  motto: 'INNOVA8  •  CREA8  •  ELEVA8',
  crest: 'C8',
  campuses: [
    {
      label: 'CAMPUS',
      address: 'Crea8orz Campus, Innovation Drive, Lekki Phase 1, Lagos, Nigeria'
    },
    {
      label: 'OFFICE',
      address: 'Admissions & Registry, Crea8orz Academy, Lagos, Nigeria'
    }
  ],
  contacts: '+234 (0) 812 000 8899',
  email: 'admissions@crea8orz.academy',
  principal: 'Dr. Sarah Adebayo',
  headTeacher: 'Dr. Sarah Adebayo',
  classTeacher: 'Dr. Sarah Adebayo'
};

function two(value) {
  return String(value).padStart(2, '0');
}

export function cameraStamp(date = new Date()) {
  return `${two(date.getDate())}/${two(date.getMonth() + 1)}/${date.getFullYear()} ${two(date.getHours())}:${two(date.getMinutes())}:${two(date.getSeconds())}`;
}

export function longDate(value) {
  if (!value) return '';
  const raw = String(value);
  const dateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const parsed = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function sessionStamp(academicYear) {
  const years = String(academicYear || '')
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean);
  if (!years.length) return '';
  return `${years.join(' / ')} SESSION`;
}

function slug(value) {
  return String(value || '')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function cardFileName({ studentName, term, academicYear }) {
  const parts = [slug(studentName), slug(term), slug(academicYear)].filter(Boolean);
  const name = parts.length ? parts.join('_') : 'Crea8orz_Result_Card';
  return `${name}.pdf`;
}

function hash(text) {
  let h = 2166136261;
  const source = String(text);
  for (let i = 0; i < source.length; i += 1) {
    h ^= source.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clampScore(value, max) {
  const num = Math.round(Number(value) || 0);
  return Math.min(max, Math.max(0, num));
}

function totalOf(row) {
  return (
    clampScore(row.classWork, SUBJECT_MAX.classWork) +
    clampScore(row.homeWork, SUBJECT_MAX.homeWork) +
    clampScore(row.test, SUBJECT_MAX.test) +
    clampScore(row.exam, SUBJECT_MAX.exam)
  );
}

export function withComputed(row) {
  const total = totalOf(row);
  return { ...row, total, grade: gradeFor(total), remark: remarkFor(total) };
}

export function summarise(rows) {
  const list = Array.isArray(rows) ? rows : [];
  const graded = list.map(withComputed);
  const average = graded.length
    ? graded.reduce((sum, row) => sum + row.total, 0) / graded.length
    : 0;
  const certificates = graded.filter((row) => row.total >= 90).length;
  return {
    rows: graded,
    average,
    averageText: `${average.toFixed(2)}%`,
    certificates,
    honoursEligible: average >= 75
  };
}

export function seedSubjectRows(seedValue, ability = 72) {
  const random = mulberry32(hash(seedValue || 'Crea8orz'));
  return RESULT_SUBJECTS.map((subject, index) => {
    const drift = (random() - 0.5) * 20;
    const bias = (index % 5) * 1.6;
    const target = Math.min(99, Math.max(34, ability + drift + bias - 3));
    const classWork = clampScore((target * SUBJECT_MAX.classWork) / SUBJECT_TOTAL_MAX + random() * 1.4, SUBJECT_MAX.classWork);
    const homeWork = clampScore((target * SUBJECT_MAX.homeWork) / SUBJECT_TOTAL_MAX + random() * 1.4, SUBJECT_MAX.homeWork);
    const test = clampScore((target * SUBJECT_MAX.test) / SUBJECT_TOTAL_MAX + random() * 1.8, SUBJECT_MAX.test);
    const examRaw = (target * SUBJECT_MAX.exam) / SUBJECT_TOTAL_MAX + random() * 2.2;
    const exam = clampScore(examRaw, SUBJECT_MAX.exam);
    return withComputed({ subject, classWork, homeWork, test, exam });
  });
}

export function emptySubjectRows() {
  return RESULT_SUBJECTS.map((subject) =>
    withComputed({ subject, classWork: 0, homeWork: 0, test: 0, exam: 0 })
  );
}

export function buildRecord(input = {}) {
  const rows = Array.isArray(input.rows) && input.rows.length ? input.rows : emptySubjectRows();
  const stats = summarise(rows);
  const stampDate = input.stampDate ? new Date(input.stampDate) : new Date();
  const safeDate = Number.isNaN(stampDate.getTime()) ? new Date() : stampDate;
  const committedRows = rows.filter((row) => !row.pending);
  const committedStats = summarise(committedRows.length ? committedRows : rows);

  return {
    school: { ...SCHOOL },
    studentName: input.studentName || '',
    studentId: input.studentId || '',
    studentClass: input.studentClass || '',
    sex: input.sex || '',
    reportDate: input.reportDate || safeDate.toISOString().slice(0, 10),
    reportDateLabel: longDate(input.reportDate || safeDate.toISOString().slice(0, 10)),
    academicYear: input.academicYear || '',
    term: input.term || '',
    honourRoll: typeof input.honourRoll === 'boolean' ? input.honourRoll : committedStats.honoursEligible,
    classTeacher: input.classTeacher || SCHOOL.headTeacher,
    principal: input.principal || SCHOOL.principal,
    rows: stats.rows,
    averageText: committedStats.averageText,
    certificates: committedStats.certificates,
    honoursEligible: committedStats.honoursEligible,
    committedSubjects: committedRows.length,
    totalSubjects: stats.rows.length,
    label: cardFileName({
      studentName: input.studentName,
      term: input.term,
      academicYear: input.academicYear
    }),
    cameraStamp: cameraStamp(safeDate)
  };
}
