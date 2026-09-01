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
  status?: string;
  createdAt?: string;
  created_at?: string;
  adminReply?: string;
  admin_reply?: string;
  repliedAt?: string;
  replied_at?: string;
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

export interface CommissionInstallment {
  id: string; // e.g. "inst-1"
  installmentNumber: number; // 1, 2, 3...
  month: string; // e.g. "September 2026"
  dueDate: string; // e.g. "2026-09-10"
  amount: number; // e.g. 4000
  status: 'Pending' | 'Paid' | 'Partially Paid' | 'Overdue';
  paidAmount?: number; // e.g. 4000
  paidDate?: string; // e.g. "2026-09-08"
  paymentMethod?: string; // e.g. "UPI", "Bank Transfer", "Cash", etc.
  transactionRef?: string;
  notes?: string;
}

export interface ShadowTeacherCommission {
  shadowTeacherId: string;
  shadowTeacherName: string;
  shadowTeacherRegId: string;
  shadowTeacherPhone: string;
  shadowTeacherEmail: string;
  city: string;
  monthlySalary: number; // e.g. 16000
  commissionPercentage: number; // e.g. 40 or 50
  totalCommission: number; // e.g. 6400 (salary * percentage / 100)
  numberOfInstallments: number; // 1, 2, 3, etc.
  installments: CommissionInstallment[];
  totalPaid: number;
  totalPending: number;
  status: 'Active' | 'Completed' | 'Overdue';
  createdAt: string;
  updatedAt: string;
  notes?: string;
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
  commission?: ShadowTeacherCommission;
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

export interface ParentTherapyRequestRecord {
  id: string;
  parentName: string;
  relationship?: string;
  phone: string;
  email: string;
  childName: string;
  childDob?: string;
  childAge?: string;
  childGender?: string;
  hasDiagnosis?: 'Yes' | 'No';
  diagnosis?: string;
  challenges?: string;
  goals?: string;
  therapyType: string; // 1 of 8 therapy types
  city: string; // Restricted to Delhi NCR
  address?: string;
  flatHouse?: string;
  buildingSociety?: string;
  streetSector?: string;
  landmark?: string;
  state?: string;
  pincode?: string;
  schoolDaycare?: string;
  preferredDays?: string;
  preferredTime?: string;
  status: 'Consultation Booked' | 'Consultation Scheduled' | 'Consultation Completed' | 'Registration Form Submitted' | 'Matching in Progress' | 'Therapist Assigned' | 'Home Sessions Begin' | 'Closed';
  consultation_paid: boolean;
  consultation_amount?: number;
  placement_paid?: boolean;
  placement_amount?: number;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  placement_payment_id?: string;
  placement_order_id?: string;
  therapist_assigned?: string;
  registration_id: string; // SB-2026-XXXX
  created_at: string;
  notes?: string;
  terms_accepted_at?: string;
}

export interface SchoolRequestRecord {
  id: string;
  registration_id: string; // SCH-2026-XXXX
  school_name: string;
  contact_name: string;
  designation: string;
  email: string;
  phone: string;
  city: string;
  preferred_location: string;
  levels_required: string; // comma-separated
  specific_grades: string; // comma-separated
  teachers_count: number;
  start_date: string;
  notes?: string;
  status: 'Consultation Booked' | 'Requirement Analysis' | 'Proposal Shared' | 'Placement Fee Pending' | 'Placement Fee Paid' | 'Profiles Shared' | 'Interview Scheduled' | 'Selection Completed' | 'Support Started' | 'Closed';
  consultation_paid: boolean;
  consultation_amount?: number;
  placement_paid: boolean;
  placement_amount?: number;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  placement_payment_id?: string;
  placement_order_id?: string;
  detailed_address?: string;
  street_landmark?: string;
  pincode?: string;
  state?: string;
  alternate_number?: string;
  expected_joining_date?: string;
  working_days?: string;
  working_hours?: string;
  terms_accepted?: boolean;
  terms_accepted_at?: string;
  suggested_match_ids?: string[];
  created_at: string;
}

export interface ReviewRecord {
  id: string;
  parent_registration_id: string;
  parent_name: string;
  child_first_name?: string;
  rating: number;
  review_text: string;
  city: string;
  service_type: 'Shadow Teacher' | 'Home Tutor' | 'Therapy Sessions';
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
  parent_therapy_requests: ParentTherapyRequestRecord[];
  school_requests: SchoolRequestRecord[];
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
  school_requests: [],
  parent_therapy_requests: [],

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
