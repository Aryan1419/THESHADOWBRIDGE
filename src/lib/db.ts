import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

export interface ConsultationBooking {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  childAge: string;
  requirement: string;
  message: string;
  paymentStatus: 'pending' | 'paid';
  amount: number;
  createdAt: string;
}

export interface ParentRegistration {
  id: string;
  parentName: string;
  phone: string;
  email: string;
  city: string;
  childName: string;
  childAge: string;
  childGrade: string;
  challenges: string;
  supportNeeded: string;
  createdAt: string;
}

export interface TeacherRegistration {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  qualification: string;
  experience: string;
  skills: string;
  resumeUrl?: string;
  createdAt: string;
}

export interface TutorRegistration {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  subjects: string;
  grades: string;
  experience: string;
  qualification: string;
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
  createdAt: string;
}

// ==========================================
// NEW DB RECORDS DEFINITIONS
// ==========================================

export interface TutorRecord {
  id: string;
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  qualification: string;
  specialization?: string;
  experience: string;
  certificates?: string;
  subjects: string; // comma-separated
  grades: string; // comma-separated
  expectedSalary: string;
  mode: string;
  notes?: string;
  registration_id: string; // TUT-2026-XXXX
  status: 'Interview Awaiting' | 'Interview Scheduled' | 'Shortlisted' | 'Onboarding' | 'Active' | 'Rejected';
  created_at: string;
  terms_accepted_at?: string;
}

export interface ShadowTeacherRecord {
  id: string;
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  preferredLocations: string; // comma-separated tags
  qualification: string;
  specialization?: string;
  experience: string;
  certificates?: string;
  specialNeedsExp: 'Yes' | 'No';
  comfortableAreas: string; // comma-separated
  otherComfortable?: string;
  openToTravel: 'Yes' | 'No';
  preferredWorkType: 'Full-time' | 'Part-time' | 'Flexible';
  status: 'Interview Awaiting' | 'Interview Scheduled' | 'Shortlisted' | 'Onboarding' | 'Active' | 'Rejected';
  aadharCardName?: string;
  qualificationCertName?: string;
  experienceCertName?: string;
  profilePhotoName?: string;
  registration_id: string; // TSB-2026-XXXX
  created_at: string;
  notes?: string;
  terms_accepted_at?: string;
}

export interface ParentShadowRequestRecord {
  id: string;
  parentName: string;
  relationship: string;
  phone: string;
  email: string;
  childName: string;
  childDob: string;
  childGender: string;
  childGrade: string;
  hasDiagnosis: 'Yes' | 'No';
  diagnosis?: string;
  difficulties: string; // comma-separated
  otherDifficulty?: string;
  city: string;
  schoolLocation: string;
  homeLocation: string;
  takesTherapy: 'Yes' | 'No';
  therapies: string; // comma-separated
  otherTherapy?: string;
  status: 'Consultation Scheduled' | 'Requirement Analysis' | 'Match Proposed' | 'Introduction Call' | 'Support Started' | 'Closed';
  consultation_paid: boolean;
  registration_id: string; // SB-2026-XXXX
  created_at: string;
  suggestedMatchId?: string; // Links to tutor or shadow teacher ID
  notes?: string;
  terms_accepted_at?: string;
}

export interface ParentTutorRequestRecord {
  id: string;
  parentName: string;
  relationship: string;
  phone: string;
  email: string;
  childName: string;
  childDob: string;
  childGender: string;
  childGrade: string;
  tutorType: string;
  otherTutorType?: string;
  subjects: string; // comma-separated
  city: string;
  homeLocation: string;
  status: 'Consultation Scheduled' | 'Requirement Analysis' | 'Match Proposed' | 'Introduction Call' | 'Support Started' | 'Closed';
  consultation_paid: boolean;
  registration_id: string; // SB-2026-XXXX
  created_at: string;
  suggestedMatchId?: string; // Links to tutor ID
  notes?: string;
  terms_accepted_at?: string;
}

export interface ReviewRecord {
  id: string;
  parent_registration_id: string;
  parent_name: string;
  child_first_name?: string;
  rating: number;
  review_text: string;
  city: string;
  service_type: 'Shadow Teacher' | 'Home Tutor';
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  approved_at?: string;
  rejection_note?: string;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  password: string;
  role: 'admin';
}

export interface DatabaseSchema {
  bookings: ConsultationBooking[];
  parentRegistrations: ParentRegistration[];
  teacherRegistrations: TeacherRegistration[];
  tutorRegistrations: TutorRegistration[];
  contacts: ContactSubmission[];

  // Real Database tables
  tutors: TutorRecord[];
  shadow_teachers: ShadowTeacherRecord[];
  parent_shadow_requests: ParentShadowRequestRecord[];
  parent_tutor_requests: ParentTutorRequestRecord[];
  admin_users: AdminUserRecord[];
  notifications: any[];
  reviews: ReviewRecord[];
}

const DEFAULT_DB: DatabaseSchema = {
  bookings: [],
  parentRegistrations: [],
  teacherRegistrations: [],
  tutorRegistrations: [],
  contacts: [],
  notifications: [],
  reviews: [],

  // Seed default admin and mock records
  admin_users: [
    {
      id: 'admin-1',
      email: 'pratibha@theshadowbridge.com',
      password: 'adminpassword',
      role: 'admin'
    }
  ],
  tutors: [
    {
      id: 'tutor-seed-1',
      name: 'Rohan Sen',
      dob: '1998-05-15',
      gender: 'Male',
      phone: '9876543201',
      email: 'rohan.sen@example.com',
      city: 'Hyderabad',
      address: 'Flat 302, Hitech Heights, Gachibowli',
      qualification: 'B.Sc. in Mathematics, B.Ed',
      specialization: 'Algebra & Physics',
      experience: '2-5 Years',
      certificates: 'Advanced Remedial Math Trainer Certificate',
      subjects: 'Science, Mathematics',
      grades: 'Middle School (6th-8th), High School (9th-10th)',
      expectedSalary: '₹15,000/month',
      mode: 'Offline at Home',
      registration_id: 'TUT-2026-3829',
      status: 'Interview Awaiting',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      notes: 'Strong mathematical background. Available in Gachibowli area.'
    }
  ],
  shadow_teachers: [
    {
      id: 'shadow-seed-1',
      name: 'Priya Nair',
      dob: '1995-10-22',
      gender: 'Female',
      phone: '9812345602',
      email: 'priya.nair@example.com',
      city: 'Noida',
      address: 'Tower D, Royal Residency, Sector 62',
      preferredLocations: 'Sector 62, Sector 120',
      qualification: 'B.Ed Special Education',
      specialization: 'Autism Spectrum Disorder support',
      experience: '2-5 Years',
      certificates: 'ABA Therapy Certification, Dyslexia Workshop',
      specialNeedsExp: 'Yes',
      comfortableAreas: 'Autism Spectrum Disorder ASD, ADHD, Learning Disabilities',
      openToTravel: 'Yes',
      preferredWorkType: 'Full-time',
      status: 'Interview Scheduled',
      aadharCardName: 'aadhar_priya.pdf',
      qualificationCertName: 'bed_cert_priya.pdf',
      profilePhotoName: 'photo_priya.jpg',
      registration_id: 'TSB-2026-4928',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      notes: 'Very articulate, well-certified in ABA techniques.'
    }
  ],
  parent_shadow_requests: [
    {
      id: 'parent-shadow-seed-1',
      parentName: 'Meera Sharma',
      relationship: 'Mother',
      phone: '9888877701',
      email: 'meera.sharma@example.com',
      childName: 'Aarav Sharma',
      childDob: '2019-03-12',
      childGender: 'Boy',
      childGrade: 'Kindergarten',
      hasDiagnosis: 'Yes',
      diagnosis: 'Autism Spectrum Disorder (Mild)',
      difficulties: 'Attention/Focus, Social Interaction',
      city: 'Noida',
      schoolLocation: 'DPS Sector 62, Noida',
      homeLocation: 'Royal Residency, Sector 62',
      takesTherapy: 'Yes',
      therapies: 'Occupational Therapy, Speech Therapy',
      status: 'Consultation Scheduled',
      consultation_paid: true,
      registration_id: 'SB-2026-8849',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      notes: 'Parent is eager for trial matching before school reopen next month.'
    }
  ],
  parent_tutor_requests: [
    {
      id: 'parent-tutor-seed-1',
      parentName: 'Amit Patel',
      relationship: 'Father',
      phone: '9777788802',
      email: 'amit.patel@example.com',
      childName: 'Jiya Patel',
      childDob: '2017-08-04',
      childGender: 'Girl',
      childGrade: '3rd Grade',
      tutorType: 'Concept Clarity/Homework Help',
      subjects: 'Science, Social Science',
      city: 'Ahmedabad',
      homeLocation: 'Satellite, Ahmedabad',
      status: 'Consultation Scheduled',
      consultation_paid: true,
      registration_id: 'SB-2026-9048',
      created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
      notes: 'Looking for a female tutor with specialized experience in dyscalculia.'
    }
  ]
};

function ensureDbFile() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
  }
}

export function readDb(): DatabaseSchema {
  try {
    ensureDbFile();
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data) as any;
    
    // Automatically migrate new schema keys if not present
    let modified = false;
    for (const key of Object.keys(DEFAULT_DB)) {
      if (!parsed[key]) {
        parsed[key] = (DEFAULT_DB as any)[key];
        modified = true;
      }
    }
    if (modified) {
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed as DatabaseSchema;
  } catch (error) {
    console.error('Failed to read database', error);
    return DEFAULT_DB;
  }
}

export function writeDb(data: DatabaseSchema): boolean {
  try {
    ensureDbFile();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Failed to write database', error);
    return false;
  }
}

export function addRecord<K extends keyof DatabaseSchema>(
  collection: K,
  record: DatabaseSchema[K][number]
): boolean {
  const db = readDb();
  // @ts-ignore
  db[collection].push(record);
  return writeDb(db);
}
