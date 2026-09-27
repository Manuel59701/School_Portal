// Initial seed and default mock data for offline preview and development
export const INITIAL_CLASSES = [
  { id: 1, name: "Nursery 1 Diamond", level: "nursery", section: "Early Years", studentCount: 18 },
  { id: 2, name: "Primary 4 Emerald", level: "primary", section: "Primary School", studentCount: 24 },
  { id: 3, name: "JSS 2 Gold", level: "secondary", section: "Junior Secondary", studentCount: 28 },
  { id: 4, name: "SSS 2 Sapphire (Science)", level: "secondary", section: "Senior Secondary", studentCount: 30 }
];

export const INITIAL_TEACHERS = [
  { id: 1, name: "Dr. Sarah Adebayo", email: "sarah.adebayo@academy.edu", subject: "Mathematics & Physics", classAssigned: "SSS 2 Sapphire (Science)", status: "Active" },
  { id: 2, name: "Mr. Chukwuemeka Obi", email: "c.obi@academy.edu", subject: "English Language & Literature", classAssigned: "JSS 2 Gold", status: "Active" },
  { id: 3, name: "Mrs. Fatima Bello", email: "f.bello@academy.edu", subject: "Integrated Basic Science", classAssigned: "Primary 4 Emerald", status: "Active" },
  { id: 4, name: "Miss Grace Johnson", email: "g.johnson@academy.edu", subject: "Early Childhood Development", classAssigned: "Nursery 1 Diamond", status: "Active" }
];

export const INITIAL_STUDENTS = [
  {
    id: 1,
    admissionNo: "STU/2026/0142",
    name: "Tariq Emmanuel Johnson",
    email: "tariq.johnson@student.academy.edu",
    class: "SSS 2 Sapphire (Science)",
    guardian: "Mr. & Mrs. Johnson",
    guardianPhone: "+234 803 123 4567",
    term: "Second Term 2025/2026",
    attendance: "96%",
    position: "2nd out of 30",
    remarks: "Exceptional analytical and scientific mindset. Demonstrates high leadership aptitude.",
    results: [
      { code: "MTH", subject: "Mathematics", caScore: 28, examScore: 64, total: 92, grade: "A1", remark: "Distinction" },
      { code: "ENG", subject: "English Language", caScore: 25, examScore: 61, total: 86, grade: "A1", remark: "Distinction" },
      { code: "PHY", subject: "Physics", caScore: 27, examScore: 62, total: 89, grade: "A1", remark: "Distinction" },
      { code: "CHM", subject: "Chemistry", caScore: 26, examScore: 59, total: 85, grade: "A1", remark: "Distinction" },
      { code: "BIO", subject: "Biology", caScore: 24, examScore: 54, total: 78, grade: "B2", remark: "Very Good" },
      { code: "DAT", subject: "Data Processing / ICT", caScore: 29, examScore: 66, total: 95, grade: "A1", remark: "Distinction" },
      { code: "CIV", subject: "Civic Education", caScore: 23, examScore: 57, total: 80, grade: "B2", remark: "Very Good" }
    ]
  },
  {
    id: 2,
    admissionNo: "STU/2026/0219",
    name: "Amina Zainab Usman",
    email: "amina.usman@student.academy.edu",
    class: "JSS 2 Gold",
    guardian: "Alhaji Bello Usman",
    guardianPhone: "+234 802 987 6543",
    term: "Second Term 2025/2026",
    attendance: "98%",
    position: "1st out of 28",
    remarks: "Outstanding academic performance and exemplary conduct in all subjects.",
    results: [
      { code: "MTH", subject: "Mathematics", caScore: 29, examScore: 65, total: 94, grade: "A1", remark: "Distinction" },
      { code: "ENG", subject: "English Studies", caScore: 28, examScore: 63, total: 91, grade: "A1", remark: "Distinction" },
      { code: "BST", subject: "Basic Science & Tech", caScore: 27, examScore: 61, total: 88, grade: "A1", remark: "Distinction" },
      { code: "SOS", subject: "Social Studies", caScore: 26, examScore: 58, total: 84, grade: "A1", remark: "Distinction" },
      { code: "AGR", subject: "Agricultural Science", caScore: 27, examScore: 60, total: 87, grade: "A1", remark: "Distinction" }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Second Term Mid-Term Break & Result Publication",
    date: "March 15, 2026",
    category: "Academic",
    summary: "Official second term assessment results have been compiled and published on student portals. Parents are advised to review performance profiles."
  },
  {
    id: 2,
    title: "National Science & Robotics Olympiad Qualifiers",
    date: "March 10, 2026",
    category: "Achievement",
    summary: "Our senior STEM team clinched 1st position in the Regional Robotics Challenge and proceeds to the National Finals."
  },
  {
    id: 3,
    title: "Annual Inter-House Sports & Cultural Festival",
    date: "February 28, 2026",
    category: "Campus Life",
    summary: "Join us for our signature sporting spectacle featuring track and field, gymnastics, and cultural showcase."
  }
];
