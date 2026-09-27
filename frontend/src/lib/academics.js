export const CLASS_LEVELS = ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'];
export const CLASS_ARMS = ['A', 'B', 'C'];
export const TERMS = ['First Term', 'Second Term', 'Third Term'];
export const ACADEMIC_YEARS = ['2025/2026', '2024/2025', '2023/2024'];

const LEVEL_CODES = {
  'JSS 1': 'J1',
  'JSS 2': 'J2',
  'JSS 3': 'J3',
  'SSS 1': 'S1',
  'SSS 2': 'S2',
  'SSS 3': 'S3'
};

export const SUBJECT_CATALOG = [
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

export const ROSTER_SIZE = 20;

const MALE_NAMES = [
  'Chukwuma', 'Tariq', 'Emeka', 'Oluwaseun', 'Ibrahim', 'Yusuf', 'Adebayo', 'Kelechi',
  'Chinedu', 'Oluwatosin', 'Mohammed', 'Suleiman', 'Femi', 'Kunle', 'David', 'Michael',
  'Segun', 'Tunde', 'Obinna', 'Aliyu', 'Ibrahim', 'Musa', 'Chidi', 'Kelechi', 'Bolaji',
  'Damilola', 'Ayodeji', 'Nnamdi', 'Somtochukwu', 'Ebere'
];

const FEMALE_NAMES = [
  'Amina', 'Zainab', 'Chiamaka', 'Adaeze', 'Fatima', 'Bukola', 'Oluwakemi', 'Ngozi',
  'Halima', 'Yewande', 'Chinaza', 'Ijeoma', 'Omolara', 'Temilade', 'Aisha', 'Khadija',
  'Blessing', 'Precious', 'Favour', 'Gift', 'Mercy', 'Joy', 'Deborah', 'Esther',
  'Rebecca', 'Maryam', 'Asabe', 'Shade', 'Titilayo', 'Nwosu'
];

const MALE_MIDDLE = ['Emmanuel', 'Chinedu', 'Oluwaseun', 'Ibrahim', 'Adebayo', 'Kelechi', 'Olumide', 'Suleiman', 'Chukwudi', 'Temidayo'];
const FEMALE_MIDDLE = ['Zainab', 'Chiamaka', 'Adaeze', 'Fatima', 'Oluwakemi', 'Ngozi', 'Chinaza', 'Ijeoma', 'Halima', 'Yewande'];
const SURNAMES = [
  'Johnson', 'Usman', 'Okafor', 'Mustapha', 'Adeleke', 'Bello', 'Eze', 'Obi',
  'Adebayo', 'Chukwu', 'Olawale', 'Ibrahim', 'Nnaji', 'Okonkwo', 'Balogun', 'Sanni',
  'Uche', 'Agu', 'Onyeka', 'Mohammed'
];

export function levelCode(level) {
  return LEVEL_CODES[level] || 'J1';
}

export function classKey(level, arm) {
  return `${level} ${arm}`;
}

export function parseClassKey(key) {
  const match = String(key).trim().match(/^(JSS|SSS)\s*(\d)\s*([ABC])$/i);
  if (!match) return { level: '', arm: '', code: '' };
  const level = `${match[1].toUpperCase()} ${match[2]}`;
  const arm = match[3].toUpperCase();
  return { level, arm, code: levelCode(level) };
}

export function allClassKeys() {
  return CLASS_LEVELS.flatMap((level) => CLASS_ARMS.map((arm) => classKey(level, arm)));
}

export function classKeyFromStudentId(studentId) {
  const match = String(studentId).match(/\/([JS])(\d)([ABC])\//i);
  if (!match) return '';
  const stream = match[1].toUpperCase() === 'J' ? 'JSS' : 'SSS';
  return classKey(`${stream} ${match[2]}`, match[3].toUpperCase());
}

export function hashString(text) {
  let h = 2166136261;
  const source = String(text);
  for (let i = 0; i < source.length; i += 1) {
    h ^= source.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rosterCache = new Map();

export function buildRoster(key, size = ROSTER_SIZE) {
  if (rosterCache.has(key)) return rosterCache.get(key);

  const { code, arm } = parseClassKey(key);
  const random = seededRandom(hashString(`roster:${key}`));

  const students = Array.from({ length: size }, (_, index) => {
    const sex = random() > 0.5 ? 'Male' : 'Female';
    const pool = sex === 'Male' ? MALE_NAMES : FEMALE_NAMES;
    const middles = sex === 'Male' ? MALE_MIDDLE : FEMALE_MIDDLE;

    const first = pool[Math.floor(random() * pool.length)];
    const middle = middles[Math.floor(random() * middles.length)];
    const surname = SURNAMES[Math.floor(random() * SURNAMES.length)];

    const serial = String(index + 1).padStart(3, '0');
    const studentId = `CR8/2026/${code}${arm}/${serial}`;

    return {
      id: `${key}|${serial}`,
      studentId,
      admissionNo: studentId,
      name: `${first} ${middle} ${surname}`,
      sex,
      classKey: key,
      ability: Math.round(44 + random() * 48)
    };
  });

  rosterCache.set(key, students);
  return students;
}

export function findStudent(key, studentId) {
  return buildRoster(key).find((student) => student.studentId === studentId || student.id === studentId) || null;
}
