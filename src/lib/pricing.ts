/**
 * THE SHADOW BRIDGE - CENTRAL PRICING SINGLE SOURCE OF TRUTH
 * 
 * Every fee amount across the entire application MUST be sourced from here.
 * Never hardcode fee numbers (99, 199, 3000, 5000) elsewhere in the codebase.
 */

export type ServiceType = 
  | 'shadow' 
  | 'tutor' 
  | 'therapy' 
  | 'online_parent_training' 
  | 'school';

export interface PlacementFeeOptions {
  teachersCount?: number;
}

export const PRICING = {
  CONSULTATION: {
    PARENT_DEFAULT: 99,
    SHADOW: 99,
    TUTOR: 99,
    THERAPY: 99,
    ONLINE_PARENT_TRAINING: 99,
    SCHOOL: 199,
  },
  PLACEMENT: {
    SHADOW: 5000,
    TUTOR: 3000,
    THERAPY: 3000,
    ONLINE_PARENT_TRAINING: 3000,
    SCHOOL_PER_TEACHER: 5000,
  },
  PROMO_CODES: {
    SHADOW_CONSULTATION_WAIVER: 'SHADOW100',
    THERAPY_CONSULTATION_WAIVER: 'THERAPY99',
    SCHOOL_CONSULTATION_WAIVER: 'SCHOOL199',
    PLACEMENT_WAIVER: 'HI5000',
  }
} as const;

/**
 * Normalizes any free-form service string, table name, or subType into a canonical ServiceType.
 */
export function normalizeServiceType(input?: string | null, fallback: ServiceType = 'shadow'): ServiceType {
  if (!input) return fallback;
  const s = input.trim().toLowerCase();

  // 1. School check
  if (s.includes('school') || s === 'sch') {
    return 'school';
  }

  // 2. Online Parent Training check (check before generic therapy)
  if (s.includes('parent training') || s.includes('parent-training') || s.includes('parent_training')) {
    return 'online_parent_training';
  }

  // 3. Shadow Teacher check
  if (s.includes('shadow') || s === 'parent_shadow_requests') {
    return 'shadow';
  }

  // 4. Home Tutor check
  if (s.includes('tutor') || s === 'parent_tutor_requests') {
    return 'tutor';
  }

  // 5. Therapy check
  if (s.includes('therapy') || s === 'parent_therapy_requests' || s.includes('aba') || s.includes('speech') || s.includes('occupational')) {
    return 'therapy';
  }

  return fallback;
}

/**
 * Returns the consultation fee for a given service type.
 * School = ₹199, all Parent flows = ₹99
 */
export function getConsultationFee(service?: string | null): number {
  const norm = normalizeServiceType(service, 'shadow');
  if (norm === 'school') {
    return PRICING.CONSULTATION.SCHOOL;
  }
  return PRICING.CONSULTATION.PARENT_DEFAULT;
}

/**
 * Returns the placement / onboarding fee for a given service type.
 * - Shadow Teacher: ₹5,000 flat
 * - Home Tutor: ₹3,000 flat
 * - Therapy Sessions: ₹3,000 flat
 * - Online Parent Training: ₹3,000 flat
 * - School Collaboration: ₹5,000 × number of shadow teachers requested
 */
export function getPlacementFee(service?: string | null, options?: PlacementFeeOptions): number {
  const norm = normalizeServiceType(service, 'shadow');

  switch (norm) {
    case 'school': {
      const count = Math.max(1, Number(options?.teachersCount || 1));
      return PRICING.PLACEMENT.SCHOOL_PER_TEACHER * count;
    }
    case 'shadow':
      return PRICING.PLACEMENT.SHADOW;
    case 'tutor':
      return PRICING.PLACEMENT.TUTOR;
    case 'therapy':
      return PRICING.PLACEMENT.THERAPY;
    case 'online_parent_training':
      return PRICING.PLACEMENT.ONLINE_PARENT_TRAINING;
    default:
      return PRICING.PLACEMENT.SHADOW;
  }
}

/**
 * Returns a human-friendly display name for the service.
 */
export function getServiceDisplayName(service?: string | null): string {
  const norm = normalizeServiceType(service, 'shadow');
  switch (norm) {
    case 'school':
      return 'School Collaboration';
    case 'shadow':
      return 'Shadow Teacher';
    case 'tutor':
      return 'Special Needs Home Tutor';
    case 'therapy':
      return 'Therapy Sessions';
    case 'online_parent_training':
      return 'Online Parent Training';
    default:
      return 'Shadow Teacher';
  }
}

/**
 * Formats a numeric currency amount into INR format (e.g. ₹5,000).
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
