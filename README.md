# 🌉 The Shadow Bridge

> **Bridging the Gap in Inclusive Education & Special Needs Care**  
> *Founded by Pratibha Mishra* — A specialized platform connecting parents of neurodivergent children with background-verified Shadow Teachers, Special Needs Tutors, and Academic Educators across India.

🌐 **Live Website**: [https://theshadowbridge.com](https://theshadowbridge.com)

---

## 📋 Table of Contents

- [About The Shadow Bridge](#-about-the-shadow-bridge)
- [Key Features](#-key-features)
  - [For Parents](#1-for-parents-5-step-onboarding)
  - [For Shadow Teachers & Tutors](#2-for-shadow-teachers--tutors)
  - [Admin Command Center](#3-admin-command-center)
  - [Technical SEO & Performance](#4-technical-seo--performance)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables Setup](#environment-variables-setup)
  - [Local Installation](#local-installation)
- [Database Schema (Supabase)](#-database-schema-supabase)
- [Deployment](#-deployment)
- [License & Credits](#-license--credits)

---

## 🎯 About The Shadow Bridge

Every child deserves an equitable learning environment. **The Shadow Bridge** was established to address the critical shortage of qualified, compassionate shadow teachers and specialized educators for children with Autism Spectrum Disorder (ASD), ADHD, Down Syndrome, Learning Disabilities, and developmental delay challenges.

We provide a seamless 5-step matching process for parents, rigorous background verification for educators, and a centralized management platform for administrative operations.

---

## ✨ Key Features

### 1. For Parents (5-Step Onboarding)
- **Step 1: Consultation Booking**: Schedule a 1-on-1 assessment consultation (₹99 via Razorpay) or redeem a secret VIP Access Code (`SHADOW100`) for direct fee waiver.
- **Step 2: Status & Tracking**: Track application progress via phone, email, or unified Registration ID (`SB-2026-XXXX`).
- **Step 3: Assessment & Evaluation**: Diagnostic assessment led by Founder Pratibha Mishra.
- **Step 4: Detailed Child Registration Form**: Comprehensive submission covering academic goals, behavioral milestones, school placement needs, and IEP details.
- **Step 5: Onboarding Placement Fee**: Finalize placement matching (₹5,000 / ₹3,000) with instant admin notification alerts.

### 2. For Shadow Teachers & Tutors
- **Multi-Step Application Form**: Dedicated registration for Shadow Teachers (`/register/shadow-teacher`) and Special Needs Tutors (`/register/tutor`).
- **Document & Qualification Submission**: Resume upload, educational background, certifications, and preferred operating zones.
- **Verification Pipeline**: Review and status updates through the admin panel.

### 3. Admin Command Center (`/admin/dashboard`)
- **Secure Password Access**: Password-protected portal (`ShadowBridge@2026`).
- **Unified Registration Engine**: Manage parent requests, shadow teacher applications, tutor profiles, contact queries, and reviews.
- **Real-Time SQL Runner & Metrics**: Monitor key statistics, run administrative database queries, update candidate statuses, and export reports.
- **Resend Email Integration**: Automatic notification emails to parents and administrative alerts on placement fee payments.

### 4. Technical SEO & Performance
- **Search Engine Indexing**: Dynamic Sitemap (`sitemap.xml`) and `robots.txt` configuration.
- **Structured Data**: Schema.org JSON-LD for `LocalBusiness` and `EducationalOrganization` covering 5 major Indian metros: **Delhi NCR, Bangalore, Hyderabad, Pune, and Ahmedabad**.
- **Canonical URLs & Metadata**: Unique meta titles, descriptions, OpenGraph headers, and canonical URL mapping across all public pages.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router, Server Actions, API Routes)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React Icons](https://lucide.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Service-Role Admin Client)
- **Payment Gateway**: [Razorpay API](https://razorpay.com/) (SDK integration for consultation & placement fees)
- **Email Dispatch**: [Resend API](https://resend.com/) (Transactional HTML emails)
- **SEO & Microdata**: Schema.org Structured Data, Next.js Metadata API

---

## 📁 Project Architecture

```
THESHADOWBRIDGE/
├── public/                     # Static assets (favicons, logos, images)
├── src/
│   ├── app/                    # Next.js App Router routes
│   │   ├── admin/              # Admin login & dashboard portal
│   │   ├── api/                # Backend API endpoints
│   │   │   ├── admin/          # Admin CRUD & SQL query routes
│   │   │   ├── bookings/       # Consultation booking handlers
│   │   │   ├── parent/         # Gated access checks & VIP unlocks
│   │   │   ├── payments/       # Razorpay order creation & signature verification
│   │   │   └── register/       # Unified parent, shadow teacher & tutor registration
│   │   ├── book/               # Booking consultation page
│   │   ├── check-status/       # Parent registration status lookup
│   │   ├── dashboard/          # Parent portal dashboard
│   │   ├── register/           # Registration forms (parent, shadow, tutor)
│   │   │   ├── parent/         # Step 1 consultation page
│   │   │   │   ├── form/       # Step 4 child registration form
│   │   │   │   └── placement-fee/ # Step 5 placement fee payment
│   │   │   ├── shadow-teacher/ # Shadow teacher registration
│   │   │   └── tutor/          # Special needs & academic tutor registration
│   │   ├── services/           # Services overview
│   │   ├── shadow-teachers/    # Shadow teachers landing page
│   │   ├── tutors/             # Special needs tutors landing page
│   │   ├── layout.tsx          # Root layout with global metadata & Schema.org JSON-LD
│   │   ├── page.tsx            # Home landing page
│   │   ├── robots.ts           # Robots.txt generator
│   │   └── sitemap.ts          # Sitemap.xml generator
│   ├── components/             # Reusable UI components (Navbar, Footer, Modals)
│   └── lib/                    # Supabase client, auth helpers, email dispatchers
├── .env.local                  # Environment configuration (git-ignored)
├── next.config.mjs             # Next.js build & header configuration
├── tailwind.config.js          # Tailwind CSS theme extension
└── tsconfig.json               # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Environment Variables Setup

Create a `.env.local` file in the root directory and configure the following credentials:

```env
# NEXT.JS PUBLIC CONFIGURATION
NEXT_PUBLIC_SITE_URL=https://theshadowbridge.com
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id

# SUPABASE SERVICE ROLE (Required for server-side admin API routes)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# RAZORPAY SERVER SECRET
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# RESEND TRANSACTIONAL EMAIL API
RESEND_API_KEY=your-resend-api-key
ADMIN_NOTIFICATION_EMAIL=support@theshadowbridge.com
```

### Local Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aryan1419/THESHADOWBRIDGE.git
   cd THESHADOWBRIDGE
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🗄️ Database Schema (Supabase)

The application utilizes PostgreSQL managed via Supabase with the following primary tables:

- **`bookings`**: Stores consultation bookings, payment IDs, Razorpay signatures, and VIP promo code waivers.
- **`parent_shadow_requests`**: Parent applications requesting shadow teacher placement for their child.
- **`parent_tutor_requests`**: Parent requests for home or special needs academic tutors.
- **`shadow_teacher_applications`**: Educator profiles, qualification documents, experience, and availability.
- **`tutor_applications`**: Specialized tutor applications and subject proficiencies.
- **`contacts`**: Public contact form submissions.
- **`reviews`**: Parent and educator testimonial submissions.

---

## 📦 Deployment

The project is optimized for deployment on **Vercel**:

```bash
npm run build
```

1. Import the repository into your Vercel Dashboard.
2. Add the environment variables listed in `.env.local`.
3. Set the build command to `npm run build` and root directory to `./`.
4. Deploy!

---

## 📜 License & Credits

© 2026 **The Shadow Bridge** by Pratibha Mishra. All Rights Reserved.  
Dedicated to providing inclusive, high-quality educational support for every child.
