-- =========================================================================
-- SQL Schema for The Shadow Bridge Supabase Integration
-- Execute this script in your Supabase SQL Editor (https://supabase.com)
-- =========================================================================

-- 1. Create Tutors Table
CREATE TABLE IF NOT EXISTS public.tutors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    dob TEXT,
    gender TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT,
    qualification TEXT NOT NULL,
    specialization TEXT,
    experience TEXT NOT NULL,
    certificates TEXT,
    subjects TEXT NOT NULL,
    grades TEXT NOT NULL,
    expected_salary TEXT,
    mode TEXT,
    notes TEXT,
    terms_accepted_at TEXT,
    registration_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Interview Awaiting',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Shadow Teachers Table
CREATE TABLE IF NOT EXISTS public.shadow_teachers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    dob TEXT,
    gender TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT,
    preferred_locations TEXT,
    qualification TEXT NOT NULL,
    specialization TEXT,
    experience TEXT NOT NULL,
    certificates TEXT,
    special_needs_exp TEXT NOT NULL DEFAULT 'No',
    comfortable_areas TEXT,
    other_comfortable TEXT,
    open_to_travel TEXT DEFAULT 'No',
    preferred_work_type TEXT DEFAULT 'Full-time',
    status TEXT NOT NULL DEFAULT 'Interview Awaiting',
    aadhar_card_name TEXT,
    qualification_cert_name TEXT,
    experience_cert_name TEXT,
    profile_photo_name TEXT,
    registration_id TEXT UNIQUE NOT NULL,
    terms_accepted_at TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    notes TEXT
);

-- 3. Create Parent Shadow Requests Table
CREATE TABLE IF NOT EXISTS public.parent_shadow_requests (
    id TEXT PRIMARY KEY,
    parent_name TEXT NOT NULL,
    relationship TEXT NOT NULL DEFAULT 'Mother',
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    child_name TEXT NOT NULL,
    child_dob TEXT,
    child_gender TEXT DEFAULT 'Boy',
    child_grade TEXT NOT NULL,
    has_diagnosis TEXT NOT NULL DEFAULT 'No',
    diagnosis TEXT,
    difficulties TEXT,
    other_difficulty TEXT,
    city TEXT NOT NULL,
    school_location TEXT,
    home_location TEXT,
    takes_therapy TEXT NOT NULL DEFAULT 'No',
    therapies TEXT,
    other_therapy TEXT,
    status TEXT NOT NULL DEFAULT 'Consultation Scheduled',
    consultation_paid BOOLEAN DEFAULT TRUE NOT NULL,
    registration_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    suggested_match_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_order_id TEXT,
    razorpay_signature TEXT,
    terms_accepted_at TEXT,
    notes TEXT
);

-- 4. Create Parent Tutor Requests Table
CREATE TABLE IF NOT EXISTS public.parent_tutor_requests (
    id TEXT PRIMARY KEY,
    parent_name TEXT NOT NULL,
    relationship TEXT NOT NULL DEFAULT 'Mother',
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    child_name TEXT NOT NULL,
    child_dob TEXT,
    child_gender TEXT DEFAULT 'Boy',
    child_grade TEXT NOT NULL,
    tutor_type TEXT NOT NULL DEFAULT 'Academic Tuition/Subjects',
    other_tutor_type TEXT,
    subjects TEXT,
    city TEXT NOT NULL,
    home_location TEXT,
    status TEXT NOT NULL DEFAULT 'Consultation Scheduled',
    consultation_paid BOOLEAN DEFAULT TRUE NOT NULL,
    registration_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    suggested_match_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_order_id TEXT,
    razorpay_signature TEXT,
    terms_accepted_at TEXT,
    notes TEXT
);

-- 5. Create Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin'
);

-- 6. Seed Initial Admin Account
INSERT INTO public.admin_users (id, email, password, role)
VALUES (
    'admin-1', 
    'pratibha@theshadowbridge.com', 
    'adminpassword', 
    'admin'
)
ON CONFLICT (email) DO NOTHING;

-- 7. Seed Demo Records for testing
INSERT INTO public.tutors (id, name, dob, gender, phone, email, city, address, qualification, specialization, experience, subjects, grades, expected_salary, mode, registration_id, status, created_at, notes)
VALUES (
    'tutor-seed-1',
    'Rohan Sen',
    '1998-05-15',
    'Male',
    '9876543201',
    'rohan.sen@example.com',
    'Hyderabad',
    'Flat 302, Hitech Heights, Gachibowli',
    'B.Sc. in Mathematics, B.Ed',
    'Algebra & Physics',
    '2-5 Years',
    'Science, Mathematics',
    'Middle School (6th-8th), High School (9th-10th)',
    '₹15,000/month',
    'Offline at Home',
    'TUT-2026-3829',
    'Interview Awaiting',
    NOW() - INTERVAL '4 hours',
    'Strong mathematical background. Available in Gachibowli area.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.shadow_teachers (id, name, dob, gender, phone, email, city, address, preferred_locations, qualification, specialization, experience, special_needs_exp, comfortable_areas, open_to_travel, preferred_work_type, status, aadhar_card_name, qualification_cert_name, profile_photo_name, registration_id, created_at, notes)
VALUES (
    'shadow-seed-1',
    'Priya Nair',
    '1995-10-22',
    'Female',
    '9812345602',
    'priya.nair@example.com',
    'Noida',
    'Tower D, Royal Residency, Sector 62',
    'Sector 62, Sector 120',
    'B.Ed Special Education',
    'Autism Spectrum Disorder support',
    '2-5 Years',
    'Yes',
    'Autism Spectrum Disorder ASD, ADHD, Learning Disabilities',
    'Yes',
    'Full-time',
    'Interview Scheduled',
    'aadhar_priya.pdf',
    'bed_cert_priya.pdf',
    'photo_priya.jpg',
    'TSB-2026-4928',
    NOW() - INTERVAL '12 hours',
    'Very articulate, well-certified in ABA techniques.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.parent_shadow_requests (id, parent_name, relationship, phone, email, child_name, child_dob, child_gender, child_grade, has_diagnosis, diagnosis, difficulties, city, school_location, home_location, takes_therapy, therapies, status, consultation_paid, registration_id, created_at, notes)
VALUES (
    'parent-shadow-seed-1',
    'Meera Sharma',
    'Mother',
    '9888877701',
    'meera.sharma@example.com',
    'Aarav Sharma',
    '2019-03-12',
    'Boy',
    'Kindergarten',
    'Yes',
    'Autism Spectrum Disorder (Mild)',
    'Attention/Focus, Social Interaction',
    'Noida',
    'DPS Sector 62, Noida',
    'Royal Residency, Sector 62',
    'Yes',
    'Occupational Therapy, Speech Therapy',
    'Consultation Scheduled',
    TRUE,
    'SB-2026-8849',
    NOW() - INTERVAL '2 hours',
    'Parent is eager for trial matching before school reopen next month.'
) ON CONFLICT DO NOTHING;

INSERT INTO public.parent_tutor_requests (id, parent_name, relationship, phone, email, child_name, child_dob, child_gender, child_grade, tutor_type, subjects, city, home_location, status, consultation_paid, registration_id, created_at, notes)
VALUES (
    'parent-tutor-seed-1',
    'Amit Patel',
    'Father',
    '9777788802',
    'amit.patel@example.com',
    'Jiya Patel',
    '2017-08-04',
    'Girl',
    '3rd Grade',
    'Concept Clarity/Homework Help',
    'Science, Social Science',
    'Ahmedabad',
    'Satellite, Ahmedabad',
    'Consultation Scheduled',
    TRUE,
    'SB-2026-9048',
    NOW() - INTERVAL '18 hours',
    'Looking for a female tutor with specialized experience in dyscalculia.'
) ON CONFLICT DO NOTHING;

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shadow_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_shadow_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_tutor_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 9. Enable policies to let service_role bypass RLS
DROP POLICY IF EXISTS "Allow service_role full access on tutors" ON public.tutors;
CREATE POLICY "Allow service_role full access on tutors" ON public.tutors TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access on shadow_teachers" ON public.shadow_teachers;
CREATE POLICY "Allow service_role full access on shadow_teachers" ON public.shadow_teachers TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access on parent_shadow_requests" ON public.parent_shadow_requests;
CREATE POLICY "Allow service_role full access on parent_shadow_requests" ON public.parent_shadow_requests TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access on parent_tutor_requests" ON public.parent_tutor_requests;
CREATE POLICY "Allow service_role full access on parent_tutor_requests" ON public.parent_tutor_requests TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access on admin_users" ON public.admin_users;
CREATE POLICY "Allow service_role full access on admin_users" ON public.admin_users TO service_role USING (true) WITH CHECK (true);

-- 10. Bookings table definition (Consultation bookings)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    child_age VARCHAR(50) NOT NULL,
    requirement TEXT NOT NULL,
    message TEXT,
    payment_status VARCHAR(50) DEFAULT 'paid',
    amount NUMERIC DEFAULT 99,
    razorpay_payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow service_role full access on bookings" ON public.bookings;
CREATE POLICY "Allow service_role full access on bookings" ON public.bookings TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert on bookings" ON public.bookings;
CREATE POLICY "Allow public insert on bookings" ON public.bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin read on bookings" ON public.bookings;
CREATE POLICY "Allow admin read on bookings" ON public.bookings FOR SELECT USING (true);

-- 11. Create Notifications Log Table & Placement Payment columns
CREATE TABLE IF NOT EXISTS public.notifications_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient TEXT NOT NULL,
    type TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.notifications_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow service_role full access on notifications_log" ON public.notifications_log;
CREATE POLICY "Allow service_role full access on notifications_log" ON public.notifications_log TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin read on notifications_log" ON public.notifications_log;
CREATE POLICY "Allow admin read on notifications_log" ON public.notifications_log FOR SELECT USING (true);

-- Add placement payment columns to requests tables
ALTER TABLE public.parent_shadow_requests ADD COLUMN IF NOT EXISTS placement_paid BOOLEAN DEFAULT FALSE;
ALTER TABLE public.parent_shadow_requests ADD COLUMN IF NOT EXISTS placement_payment_id TEXT;
ALTER TABLE public.parent_shadow_requests ADD COLUMN IF NOT EXISTS placement_order_id TEXT;
ALTER TABLE public.parent_shadow_requests ADD COLUMN IF NOT EXISTS placement_signature TEXT;
ALTER TABLE public.parent_shadow_requests ADD COLUMN IF NOT EXISTS placement_amount NUMERIC;

ALTER TABLE public.parent_tutor_requests ADD COLUMN IF NOT EXISTS placement_paid BOOLEAN DEFAULT FALSE;
ALTER TABLE public.parent_tutor_requests ADD COLUMN IF NOT EXISTS placement_payment_id TEXT;
ALTER TABLE public.parent_tutor_requests ADD COLUMN IF NOT EXISTS placement_order_id TEXT;
ALTER TABLE public.parent_tutor_requests ADD COLUMN IF NOT EXISTS placement_signature TEXT;
ALTER TABLE public.parent_tutor_requests ADD COLUMN IF NOT EXISTS placement_amount NUMERIC;

-- Add terms_accepted_at columns to requests and profiles tables
ALTER TABLE public.tutors ADD COLUMN IF NOT EXISTS terms_accepted_at TEXT;
ALTER TABLE public.shadow_teachers ADD COLUMN IF NOT EXISTS terms_accepted_at TEXT;
ALTER TABLE public.parent_shadow_requests ADD COLUMN IF NOT EXISTS terms_accepted_at TEXT;
ALTER TABLE public.parent_tutor_requests ADD COLUMN IF NOT EXISTS terms_accepted_at TEXT;

-- 12. Create Contacts Table (Contact Us Form Queries)
CREATE TABLE IF NOT EXISTS public.contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow service_role full access on contacts" ON public.contacts;
CREATE POLICY "Allow service_role full access on contacts" ON public.contacts TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert on contacts" ON public.contacts;
CREATE POLICY "Allow public insert on contacts" ON public.contacts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin read on contacts" ON public.contacts;
CREATE POLICY "Allow admin read on contacts" ON public.contacts FOR SELECT USING (true);

-- 13. Create Reviews Table (Parent Testimonials & Reviews)
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    parent_registration_id TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    child_first_name TEXT,
    rating INTEGER NOT NULL,
    review_text TEXT NOT NULL,
    city TEXT NOT NULL,
    service_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_note TEXT
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow service_role full access on reviews" ON public.reviews;
CREATE POLICY "Allow service_role full access on reviews" ON public.reviews TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert on reviews" ON public.reviews;
CREATE POLICY "Allow public insert on reviews" ON public.reviews FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin read on reviews" ON public.reviews;
CREATE POLICY "Allow admin read on reviews" ON public.reviews FOR SELECT USING (true);


