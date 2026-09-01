'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, User, GraduationCap, ClipboardList, Settings, LogOut,
  RefreshCw, Search, Filter, ShieldCheck, Mail, Phone, MapPin, Calendar,
  CheckCircle, X, XCircle, ChevronRight, ChevronLeft, FileText, AlertCircle, Save, Info, Sparkles, CreditCard,
  Star, CheckCircle2, MessageSquare, Reply, Send, MailCheck, MessageSquareQuote, CornerDownRight, Trash2, AlertTriangle, ExternalLink, Menu, School,
  Bell, Eye, Briefcase, BadgePercent, DollarSign, Wallet, TrendingUp, CheckSquare, PlusCircle, Clock3, CalendarDays, Percent
} from 'lucide-react';

import { DatabaseSchema, TutorRecord, ShadowTeacherRecord, ParentShadowRequestRecord, ParentTutorRequestRecord } from '@/lib/db';
import { areNearbyLocalities } from '@/lib/constants';

export default function AdminDashboard() {
  const router = useRouter();
  
  // Auth state
  const [adminEmail, setAdminEmail] = useState('');
  
  // Database states
  const [db, setDb] = useState<DatabaseSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Toast notifications log state
  const [toastLog, setToastLog] = useState<string | null>(null);

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'tutors' | 'shadows' | 'commissions' | 'parents' | 'schools' | 'bookings' | 'contacts' | 'payments' | 'notifications' | 'settings' | 'reviews'>('overview');

  // Mobile sidebar collapse state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Parent Requests sub-tab state
  const [parentSubTab, setParentSubTab] = useState<'shadow' | 'tutor' | 'therapy'>('shadow');

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPlacementPaid, setFilterPlacementPaid] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterSpecialNeeds, setFilterSpecialNeeds] = useState('');
  const [filterComfortableArea, setFilterComfortableArea] = useState('');

  // Selected item detail view modal state
  const [selectedRecord, setSelectedRecord] = useState<{
    type: 'tutors' | 'shadow_teachers' | 'parent_shadow_requests' | 'parent_tutor_requests' | 'parent_therapy_requests' | 'school_requests';
    data: any;
  } | null>(null);

  // Edit states inside details modal
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editCandidateMessage, setEditCandidateMessage] = useState('');
  const [editMatchId, setEditMatchId] = useState('');
  const [editTherapistAssigned, setEditTherapistAssigned] = useState('');
  const [modalSuccessMsg, setModalSuccessMsg] = useState<string | null>(null);
  const [modalErrorMsg, setModalErrorMsg] = useState<string | null>(null);

  // Contact Reply States
  const [replyModalContact, setReplyModalContact] = useState<any | null>(null);
  const [replyMessageText, setReplyMessageText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replySuccessMsg, setReplySuccessMsg] = useState<string | null>(null);
  const [replyErrorMsg, setReplyErrorMsg] = useState<string | null>(null);

  // Reviews moderation states
  const [reviews, setReviews] = useState<any[]>([]);
  const [moderatingReviewId, setModeratingReviewId] = useState<string | null>(null);
  const [reviewEditText, setReviewEditText] = useState<string>('');
  const [rejectionNote, setRejectionNote] = useState<string>('');
  const [isEditingReview, setIsEditingReview] = useState<boolean>(false);
  const [isRejectingReview, setIsRejectingReview] = useState<boolean>(false);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);

  // ─── LOCATION-BASED SHADOW TEACHER ALERT STATE ───────────────────
  type LocationAlert = {
    parentRequest: any;
    exactMatches: any[];
    nearbyMatches: any[];
    cityOnlyMatches: any[];
  };
  const [locationAlerts, setLocationAlerts] = useState<LocationAlert[]>([]);
  const [activeAlertIndex, setActiveAlertIndex] = useState(0);
  const [showLocationAlert, setShowLocationAlert] = useState(false);

  // ─── COMMISSION MANAGEMENT STATES ───────────────────────────────
  const [commissionSelectedMonth, setCommissionSelectedMonth] = useState<string>('current');
  const [commissionSearchQuery, setCommissionSearchQuery] = useState('');
  const [commissionStatusFilter, setCommissionStatusFilter] = useState<'All' | 'Pending' | 'Paid' | 'Partially Paid' | 'Overdue'>('All');

  // Commission Wizard Setup / Edit Modal
  const [commissionModalOpen, setCommissionModalOpen] = useState(false);
  const [commissionTeacherId, setCommissionTeacherId] = useState('');
  const [commissionSalary, setCommissionSalary] = useState<number | string>(16000);
  const [commissionPercentage, setCommissionPercentage] = useState<number>(40);
  const [commissionInstallmentCount, setCommissionInstallmentCount] = useState<number>(2);
  const [commissionInstallments, setCommissionInstallments] = useState<Array<{
    id: string;
    installmentNumber: number;
    month: string;
    dueDate: string;
    amount: number;
    status: 'Pending' | 'Paid' | 'Partially Paid' | 'Overdue';
    paidAmount?: number;
    paidDate?: string;
    paymentMethod?: string;
    transactionRef?: string;
    notes?: string;
  }>>([]);
  const [commissionSendEmail, setCommissionSendEmail] = useState(true);
  const [commissionNotes, setCommissionNotes] = useState('');
  const [savingCommission, setSavingCommission] = useState(false);
  const [commissionModalError, setCommissionModalError] = useState<string | null>(null);

  // Installment Payment Logger Modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentTargetTeacher, setPaymentTargetTeacher] = useState<any | null>(null);
  const [paymentTargetInstallment, setPaymentTargetInstallment] = useState<any | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Partially Paid' | 'Pending' | 'Overdue'>('Paid');
  const [paymentAmount, setPaymentAmount] = useState<number | string>(0);
  const [paymentDate, setPaymentDate] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  const [savingPayment, setSavingPayment] = useState(false);
  const [paymentModalError, setPaymentModalError] = useState<string | null>(null);

  const generateDefaultInstallments = (totalAmount: number, count: number) => {
    const installments = [];
    const validCount = Math.max(1, count || 1);
    const baseAmount = Math.floor(totalAmount / validCount);
    const remainder = totalAmount - (baseAmount * validCount);
    
    const now = new Date();
    for (let i = 0; i < validCount; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 10);
      const monthStr = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const dueStr = d.toISOString().split('T')[0];
      const instAmount = i === 0 ? baseAmount + remainder : baseAmount;
      installments.push({
        id: `inst-${i + 1}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        installmentNumber: i + 1,
        month: monthStr,
        dueDate: dueStr,
        amount: instAmount,
        status: 'Pending' as const,
        paidAmount: 0
      });
    }
    return installments;
  };

  // Authentication guard check
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const email = localStorage.getItem('admin_email');
    if (!token) {
      router.replace('/admin/login');
    } else {
      setAdminEmail(email || 'pratibha@theshadowbridge.com');
      fetchDatabase();
      fetchReviews();
    }
  }, [router]);

  const fetchDatabase = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch('/api/admin/records', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
      });
      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_email');
        router.replace('/admin/login');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setDb(data);
      }
    } catch (error) {
      console.error('Failed to load database:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch('/api/reviews', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews);
        }
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  // ─── LOCATION-BASED SHADOW TEACHER MATCHING LOGIC ────────────────
  // Runs after db is loaded. Finds parent shadow requests with location
  // matches among available shadow teachers. Skips dismissed alerts.
  useEffect(() => {
    if (!db) return;

    const parentRequests = db.parent_shadow_requests || [];
    const shadowTeachers = db.shadow_teachers || [];

    // Read dismissed alert IDs from localStorage
    let dismissedIds: string[] = [];
    try {
      dismissedIds = JSON.parse(localStorage.getItem('dismissed_location_alerts') || '[]');
    } catch { dismissedIds = []; }

    // Only consider early-stage parent requests that haven't been dismissed
    const eligibleStatuses = ['Consultation Booked', 'Consultation Completed', 'Registration Submitted', 'Requirement Analysis'];
    const candidateRequests = parentRequests.filter((pr: any) => {
      const prId = pr.id || pr.registration_id;
      if (dismissedIds.includes(prId)) return false;
      const status = (pr.status || '').trim();
      return eligibleStatuses.includes(status);
    });

    if (candidateRequests.length === 0) return;

    // Only consider shadow teachers not already Active or Rejected
    const availableStatuses = ['Interview Awaiting', 'Interview Scheduled', 'Shortlisted', 'Onboarding'];
    const availableTeachers = shadowTeachers.filter((st: any) =>
      availableStatuses.includes((st.status || '').trim())
    );

    if (availableTeachers.length === 0) return;

    const alerts: LocationAlert[] = [];

    for (const pr of candidateRequests) {
      const prAny = pr as any;
      const parentCity = (prAny.city || '').trim();
      const parentHomeLocation = (prAny.home_location || prAny.homeLocation || '').trim();
      const parentSchoolLocation = (prAny.school_location || prAny.schoolLocation || '').trim();

      if (!parentCity) continue;

      const exactMatches: any[] = [];
      const nearbyMatches: any[] = [];
      const cityOnlyMatches: any[] = [];
      const addedTeacherIds = new Set<string>();

      // For each available shadow teacher in the same city
      for (const st of availableTeachers) {
        const stAny = st as any;
        const teacherCity = (stAny.city || '').trim();
        if (teacherCity.toLowerCase() !== parentCity.toLowerCase()) continue;

        const teacherLocations = (stAny.preferred_locations || stAny.preferredLocations || '')
          .split(',')
          .map((l: string) => l.trim())
          .filter((l: string) => l && l !== 'Other (please specify)');

        const teacherId = stAny.id || stAny.registration_id;
        let matched = false;

        // Check for exact location match
        if (parentHomeLocation || parentSchoolLocation) {
          for (const tLoc of teacherLocations) {
            const tLocLower = tLoc.toLowerCase();
            if (
              (parentHomeLocation && (tLocLower.includes(parentHomeLocation.toLowerCase()) || parentHomeLocation.toLowerCase().includes(tLocLower))) ||
              (parentSchoolLocation && (tLocLower.includes(parentSchoolLocation.toLowerCase()) || parentSchoolLocation.toLowerCase().includes(tLocLower)))
            ) {
              if (!addedTeacherIds.has(teacherId)) {
                exactMatches.push(st);
                addedTeacherIds.add(teacherId);
                matched = true;
              }
              break;
            }
          }

          // Check for nearby match if not already exact
          if (!matched) {
            for (const tLoc of teacherLocations) {
              if (
                (parentHomeLocation && areNearbyLocalities(parentCity, parentHomeLocation, tLoc)) ||
                (parentSchoolLocation && areNearbyLocalities(parentCity, parentSchoolLocation, tLoc))
              ) {
                if (!addedTeacherIds.has(teacherId)) {
                  nearbyMatches.push(st);
                  addedTeacherIds.add(teacherId);
                  matched = true;
                }
                break;
              }
            }
          }
        }

        // City-only match (when parent has no specific locality yet, or teacher didn't match exact/nearby)
        if (!matched && !addedTeacherIds.has(teacherId)) {
          cityOnlyMatches.push(st);
          addedTeacherIds.add(teacherId);
        }
      }

      // Only create an alert if there are exact or nearby matches,
      // OR if the parent has no home_location yet and there are city-level matches
      const hasLocationData = Boolean(parentHomeLocation || parentSchoolLocation);
      if (exactMatches.length > 0 || nearbyMatches.length > 0 || (!hasLocationData && cityOnlyMatches.length > 0)) {
        alerts.push({
          parentRequest: pr,
          exactMatches,
          nearbyMatches,
          cityOnlyMatches: hasLocationData ? [] : cityOnlyMatches,
        });
      }
    }

    if (alerts.length > 0) {
      setLocationAlerts(alerts);
      setActiveAlertIndex(0);
      setShowLocationAlert(true);
    }
  }, [db]);

  // Dismiss a location alert and persist to localStorage
  const handleDismissLocationAlert = useCallback((parentRequestId: string) => {
    try {
      const dismissed: string[] = JSON.parse(localStorage.getItem('dismissed_location_alerts') || '[]');
      if (!dismissed.includes(parentRequestId)) {
        dismissed.push(parentRequestId);
        localStorage.setItem('dismissed_location_alerts', JSON.stringify(dismissed));
      }
    } catch {
      localStorage.setItem('dismissed_location_alerts', JSON.stringify([parentRequestId]));
    }

    setLocationAlerts(prev => {
      const updated = prev.filter(a => (a.parentRequest.id || a.parentRequest.registration_id) !== parentRequestId);
      if (updated.length === 0) {
        setShowLocationAlert(false);
      } else {
        setActiveAlertIndex(i => Math.min(i, updated.length - 1));
      }
      return updated;
    });
  }, []);

  const handleReviewAction = async (reviewId: string, action: 'approve' | 'reject' | 'edit', extraData?: { reviewText?: string; rejectionNote?: string }) => {
    setUpdating(true);
    setToastLog(null);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reviewId,
          action,
          reviewText: extraData?.reviewText,
          rejectionNote: extraData?.rejectionNote
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to moderate review');
      }

      if (data.success) {
        setToastLog(`[Review Moderated] Review ID ${reviewId} successfully set to action "${action}".`);
        fetchReviews();
        // Reset states
        setModeratingReviewId(null);
        setReviewEditText('');
        setRejectionNote('');
        setIsEditingReview(false);
        setIsRejectingReview(false);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    router.replace('/admin/login');
  };

  // Status updates in database
  const handleUpdateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    
    setUpdating(true);
    setToastLog(null);
    setModalSuccessMsg(null);
    setModalErrorMsg(null);

    const payload = {
      action: 'update_record',
      type: selectedRecord.type,
      id: selectedRecord.data.id,
      status: editStatus,
      notes: editNotes,
      candidateMessage: editCandidateMessage,
      suggestedMatchId: editMatchId,
      therapistAssigned: editTherapistAssigned
    };

    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch('/api/admin/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // Update local database state
        if (db) {
          const updatedCollection = [...(db[selectedRecord.type as keyof DatabaseSchema] as any[])];
          const idx = updatedCollection.findIndex((r: any) => r.id === selectedRecord.data.id);
          if (idx !== -1) {
            updatedCollection[idx] = result.record;
          }
          setDb(prev => ({
            ...prev!,
            [selectedRecord.type]: updatedCollection
          }));
          
          // Update selected modal view data
          setSelectedRecord(prev => ({
            ...prev!,
            data: result.record
          }));
        }

        setModalSuccessMsg('Changes saved successfully!');
        if (result.notificationLog) {
          setToastLog(result.notificationLog);
        }
        setTimeout(() => setModalSuccessMsg(null), 4000);
      } else {
        setModalErrorMsg(result.error || 'Failed to save changes.');
      }
    } catch (error: any) {
      console.error('Update failed:', error);
      setModalErrorMsg(error.message || 'Network error updating record.');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkConsultationCompleted = async (booking: any) => {
    setUpdating(true);
    setToastLog(null);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch('/api/admin/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'mark_consultation_completed',
          bookingId: booking.bookingId || booking.booking_id,
          regId: booking.registrationId || booking.registration_id,
          email: booking.email,
          phone: booking.phone
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToastLog(`✅ Consultation for ${booking.name || 'Parent'} marked Completed! Registration form link sent to parent email.`);
        fetchDatabase();
      } else {
        setToastLog(`❌ Error: ${data.error || 'Failed to update consultation status'}`);
      }
    } catch (err: any) {
      setToastLog(`❌ Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Reject Consultation States
  const [rejectModalBooking, setRejectModalBooking] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  const handleConfirmRejectConsultation = async () => {
    if (!rejectModalBooking) return;
    setRejecting(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch('/api/admin/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'reject_consultation',
          bookingId: rejectModalBooking.bookingId || rejectModalBooking.booking_id,
          regId: rejectModalBooking.registrationId || rejectModalBooking.registration_id,
          email: rejectModalBooking.email,
          phone: rejectModalBooking.phone,
          reason: rejectReason
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToastLog(`❌ Consultation marked as Declined. Polite update email sent to ${rejectModalBooking.email}.`);
        setRejectModalBooking(null);
        setRejectReason('');
        fetchDatabase();
      } else {
        setToastLog(`❌ Error: ${data.error || 'Failed to decline consultation'}`);
      }
    } catch (err: any) {
      setToastLog(`❌ Error: ${err.message}`);
    } finally {
      setRejecting(false);
    }
  };

  // Delete Record States
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string; label?: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteRecord = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch('/api/admin/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'delete_record',
          type: deleteTarget.type,
          id: deleteTarget.id
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToastLog(`[Record Deleted] ${deleteTarget.name} has been permanently deleted.`);
        setDeleteTarget(null);
        fetchDatabase();
        if (deleteTarget.type === 'reviews') fetchReviews();
        setTimeout(() => setToastLog(null), 4000);
      } else {
        alert(data.error || 'Failed to delete record.');
      }
    } catch (err: any) {
      console.error('Failed to delete record:', err);
      alert(err.message || 'Network error deleting record.');
    } finally {
      setDeleting(false);
    }
  };

  const handleQuickContactStatus = async (contactId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch('/api/admin/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'update_record',
          type: 'contacts',
          id: contactId,
          status: newStatus
        })
      });

      if (res.ok) {
        setToastLog(`[Contact Updated] Query status updated to "${newStatus}".`);
        fetchDatabase();
        setTimeout(() => setToastLog(null), 4000);
      }
    } catch (err) {
      console.error('Failed to update contact status:', err);
    }
  };

  const handleSendContactReply = async () => {
    if (!replyModalContact || !replyMessageText.trim()) return;
    setSendingReply(true);
    setReplySuccessMsg(null);
    setReplyErrorMsg(null);

    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch('/api/admin/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'reply_contact',
          id: replyModalContact.id,
          adminReply: replyMessageText.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReplySuccessMsg(`Reply email sent successfully to ${replyModalContact.email}!`);
        
        if (db && db.contacts) {
          const updatedContacts = db.contacts.map((c: any) => 
            c.id === replyModalContact.id ? data.record : c
          );
          setDb(prev => ({ ...prev!, contacts: updatedContacts }));
        }

        setToastLog(`[Reply Sent] Email sent to ${replyModalContact.email} & query status marked Responded.`);
        
        setTimeout(() => {
          setReplyModalContact(null);
          setReplyMessageText('');
          setReplySuccessMsg(null);
          fetchDatabase();
        }, 1800);
      } else {
        setReplyErrorMsg(data.error || 'Failed to send reply email.');
      }
    } catch (err: any) {
      console.error('Failed to send contact reply:', err);
      setReplyErrorMsg(err.message || 'Network error sending reply email.');
    } finally {
      setSendingReply(false);
    }
  };

  // Direct Match Proposal & Placement Payment request trigger
  const handleConfirmMatchAndRequestPayment = async (candidateId: string) => {
    if (!selectedRecord) return;
    setUpdating(true);
    setToastLog(null);

    const payload = {
      action: 'update_record',
      type: selectedRecord.type,
      id: selectedRecord.data.id,
      status: 'Match Proposed',
      notes: editNotes,
      suggestedMatchId: candidateId,
      candidateMessage: editCandidateMessage
    };

    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch('/api/admin/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        
        // Update local database state
        if (db) {
          const updatedCollection = [...(db[selectedRecord.type as keyof DatabaseSchema] as any[])];
          const idx = updatedCollection.findIndex((r: any) => r.id === selectedRecord.data.id);
          if (idx !== -1) {
            updatedCollection[idx] = result.record;
          }
          
          // Refresh notifications
          const notifRes = await fetch('/api/admin/records', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const notifData = await notifRes.json();

          setDb(prev => ({
            ...prev!,
            [selectedRecord.type]: updatedCollection,
            notifications: notifData.notifications || []
          }));
          
          setSelectedRecord(prev => ({
            ...prev!,
            data: result.record
          }));
          setEditStatus('Match Proposed');
        }

        if (result.notificationLog) {
          setToastLog(result.notificationLog);
          setTimeout(() => setToastLog(null), 8000);
        }
        alert('Match confirmed and placement payment requested successfully!');
      } else {
        alert('Failed to save match proposal');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error updating match: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Helper date formatter
  const formatDate = (isoStr: string) => {
    if (!isoStr) return '';
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return isoStr;
    }
  };

  // Helper date-time formatter for notifications
  const formatDateTime = (isoStr: string) => {
    if (!isoStr) return '';
    try {
      const date = new Date(isoStr);
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoStr;
    }
  };

  // Calculations for stats
  const totalTutors = db?.tutors?.length || 0;
  const totalShadows = db?.shadow_teachers?.length || 0;
  const totalParentShadows = db?.parent_shadow_requests?.length || 0;
  const totalParentTutors = db?.parent_tutor_requests?.length || 0;
  const totalRequests = totalParentShadows + totalParentTutors;

  // ─── COMMISSION ACTION HANDLERS ─────────────────────────────────
  const openCommissionWizard = (teacher?: any) => {
    setCommissionModalError(null);
    if (teacher) {
      setCommissionTeacherId(teacher.id || teacher.registration_id);
      if (teacher.commission) {
        const comm = teacher.commission;
        setCommissionSalary(comm.monthlySalary || 16000);
        setCommissionPercentage(comm.commissionPercentage || 40);
        setCommissionInstallmentCount(comm.numberOfInstallments || (comm.installments ? comm.installments.length : 2));
        setCommissionInstallments(comm.installments && comm.installments.length > 0 ? comm.installments : generateDefaultInstallments(comm.totalCommission || 6400, comm.numberOfInstallments || 2));
        setCommissionNotes(comm.notes || '');
      } else {
        const defaultSal = 16000;
        const defaultPct = 40;
        const defaultTotal = Math.round(defaultSal * defaultPct / 100);
        setCommissionSalary(defaultSal);
        setCommissionPercentage(defaultPct);
        setCommissionInstallmentCount(2);
        setCommissionInstallments(generateDefaultInstallments(defaultTotal, 2));
        setCommissionNotes('');
      }
    } else {
      const activeTeachers = (db?.shadow_teachers || []).filter((t: any) => t.status === 'Active' || t.status === 'Onboarding' || t.status === 'Shortlisted');
      const firstId = activeTeachers.length > 0 ? (activeTeachers[0].id || activeTeachers[0].registration_id) : ((db?.shadow_teachers || [])[0]?.id || '');
      setCommissionTeacherId(firstId);
      const defaultSal = 16000;
      const defaultPct = 40;
      const defaultTotal = Math.round(defaultSal * defaultPct / 100);
      setCommissionSalary(defaultSal);
      setCommissionPercentage(defaultPct);
      setCommissionInstallmentCount(2);
      setCommissionInstallments(generateDefaultInstallments(defaultTotal, 2));
      setCommissionNotes('');
    }
    setCommissionSendEmail(true);
    setCommissionModalOpen(true);
  };

  const handleSalaryChange = (newSalary: number | string) => {
    setCommissionSalary(newSalary);
    const numSal = Number(newSalary) || 0;
    const total = Math.round(numSal * (commissionPercentage / 100));
    setCommissionInstallments(generateDefaultInstallments(total, commissionInstallmentCount));
  };

  const handlePercentageChange = (newPct: number) => {
    setCommissionPercentage(newPct);
    const numSal = Number(commissionSalary) || 0;
    const total = Math.round(numSal * (newPct / 100));
    setCommissionInstallments(generateDefaultInstallments(total, commissionInstallmentCount));
  };

  const handleInstallmentCountChange = (newCount: number) => {
    const count = Math.max(1, newCount || 1);
    setCommissionInstallmentCount(count);
    const numSal = Number(commissionSalary) || 0;
    const total = Math.round(numSal * (commissionPercentage / 100));
    setCommissionInstallments(generateDefaultInstallments(total, count));
  };

  const handleInstallmentFieldChange = (index: number, field: string, value: any) => {
    setCommissionInstallments(prev => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], [field]: value };
      }
      return copy;
    });
  };

  const handleSaveCommissionPlan = async () => {
    if (!commissionTeacherId) {
      setCommissionModalError('Please select a Shadow Teacher.');
      return;
    }

    const numSalary = Number(commissionSalary) || 0;
    if (numSalary <= 0) {
      setCommissionModalError('Please enter a valid monthly salary amount.');
      return;
    }

    const expectedTotal = Math.round(numSalary * (commissionPercentage / 100));
    const currentSum = commissionInstallments.reduce((sum, inst) => sum + (Number(inst.amount) || 0), 0);

    if (currentSum !== expectedTotal) {
      setCommissionModalError(`Total installments (₹${currentSum.toLocaleString('en-IN')}) must exactly match calculated commission (₹${expectedTotal.toLocaleString('en-IN')}). Difference: ₹${(expectedTotal - currentSum).toLocaleString('en-IN')}`);
      return;
    }

    setSavingCommission(true);
    setCommissionModalError(null);

    const teacher = (db?.shadow_teachers || []).find((t: any) => t.id === commissionTeacherId || t.registration_id === commissionTeacherId);

    const totalPaid = commissionInstallments.reduce((sum, inst) => sum + (inst.status === 'Paid' ? (Number(inst.amount) || 0) : (Number(inst.paidAmount) || 0)), 0);
    const totalPending = Math.max(0, expectedTotal - totalPaid);

    const commissionPayload = {
      shadowTeacherId: commissionTeacherId,
      shadowTeacherName: teacher?.name || 'Shadow Teacher',
      shadowTeacherRegId: teacher?.registration_id || (teacher as any)?.registrationId || commissionTeacherId,
      shadowTeacherPhone: teacher?.phone || '',
      shadowTeacherEmail: teacher?.email || '',
      city: teacher?.city || '',
      monthlySalary: numSalary,
      commissionPercentage,
      totalCommission: expectedTotal,
      numberOfInstallments: commissionInstallmentCount,
      installments: commissionInstallments,
      totalPaid,
      totalPending,
      status: totalPaid >= expectedTotal ? 'Completed' : 'Active',
      createdAt: teacher?.commission?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: commissionNotes
    };

    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch('/api/admin/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'save_commission',
          id: commissionTeacherId,
          commission: commissionPayload,
          sendEmailNotification: commissionSendEmail
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToastLog(data.notificationLog || 'Commission plan saved successfully!');
        setCommissionModalOpen(false);

        // Update local database state
        if (db && db.shadow_teachers) {
          const updatedShadows = db.shadow_teachers.map((st: any) => 
            (st.id === commissionTeacherId || st.registration_id === commissionTeacherId)
              ? { ...st, commission: data.commission }
              : st
          );
          setDb(prev => ({ ...prev!, shadow_teachers: updatedShadows }));
          
          if (selectedRecord && (selectedRecord.data.id === commissionTeacherId || selectedRecord.data.registration_id === commissionTeacherId)) {
            setSelectedRecord(prev => ({
              ...prev!,
              data: { ...prev!.data, commission: data.commission }
            }));
          }
        }

        setTimeout(() => setToastLog(null), 4000);
      } else {
        setCommissionModalError(data.error || 'Failed to save commission plan');
      }
    } catch (err: any) {
      console.error(err);
      setCommissionModalError(err.message || 'Error communicating with server');
    } finally {
      setSavingCommission(false);
    }
  };

  const openPaymentLogger = (teacher: any, installment: any) => {
    setPaymentTargetTeacher(teacher);
    setPaymentTargetInstallment(installment);
    setPaymentStatus('Paid');
    const remainingForInst = installment.status === 'Paid' ? installment.amount : Math.max(0, installment.amount - (installment.paidAmount || 0));
    setPaymentAmount(remainingForInst || installment.amount);
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod(installment.paymentMethod || 'UPI');
    setPaymentRef(installment.transactionRef || '');
    setPaymentNotes(installment.notes || '');
    setPaymentModalError(null);
    setPaymentModalOpen(true);
  };

  const handleSavePayment = async () => {
    if (!paymentTargetTeacher || !paymentTargetInstallment) return;

    setSavingPayment(true);
    setPaymentModalError(null);

    const teacherId = paymentTargetTeacher.id || paymentTargetTeacher.registration_id;

    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch('/api/admin/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'update_commission_payment',
          id: teacherId,
          installmentId: paymentTargetInstallment.id,
          status: paymentStatus,
          paidAmount: Number(paymentAmount) || 0,
          paidDate: paymentDate,
          paymentMethod,
          transactionRef: paymentRef,
          installmentNotes: paymentNotes
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToastLog(data.notificationLog || 'Payment recorded successfully!');
        setPaymentModalOpen(false);

        if (db && db.shadow_teachers) {
          const updatedShadows = db.shadow_teachers.map((st: any) => 
            (st.id === teacherId || st.registration_id === teacherId)
              ? { ...st, commission: data.commission }
              : st
          );
          setDb(prev => ({ ...prev!, shadow_teachers: updatedShadows }));

          if (selectedRecord && (selectedRecord.data.id === teacherId || selectedRecord.data.registration_id === teacherId)) {
            setSelectedRecord(prev => ({
              ...prev!,
              data: { ...prev!.data, commission: data.commission }
            }));
          }
        }

        setTimeout(() => setToastLog(null), 4000);
      } else {
        setPaymentModalError(data.error || 'Failed to update installment payment');
      }
    } catch (err: any) {
      console.error(err);
      setPaymentModalError(err.message || 'Error updating payment');
    } finally {
      setSavingPayment(false);
    }
  };

  const handleOpenTeacherProfile = (st: any) => {
    setEditStatus(st.status || 'Active');
    setEditNotes(st.notes || '');
    setSelectedRecord({ type: 'shadow_teachers', data: st });
  };

  // Commission Calculations & Monthly Overview Helpers
  const getAllCommissionInstallments = () => {
    if (!db || !db.shadow_teachers) return [];
    const list: Array<{
      teacher: any;
      installment: any;
    }> = [];

    db.shadow_teachers.forEach((st: any) => {
      if (st.commission && st.commission.installments) {
        st.commission.installments.forEach((inst: any) => {
          list.push({
            teacher: st,
            installment: inst
          });
        });
      }
    });

    return list;
  };

  const getCommissionMonthlyStats = () => {
    const allInstallments = getAllCommissionInstallments();
    const now = new Date();
    const currentMonthStr = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Extract unique months
    const monthSet = new Set<string>();
    monthSet.add(currentMonthStr);
    
    // Add current and surrounding months to selector
    for (let i = -2; i <= 4; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      monthSet.add(d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    }

    allInstallments.forEach(({ installment }) => {
      if (installment.month) monthSet.add(installment.month);
    });

    const activeMonth = commissionSelectedMonth === 'current' ? currentMonthStr : commissionSelectedMonth;

    // Filter installments for selected month
    const matchingInstallments = activeMonth === 'all' 
      ? allInstallments 
      : allInstallments.filter(({ installment }) => {
          if (installment.month && installment.month.toLowerCase() === activeMonth.toLowerCase()) return true;
          if (installment.dueDate) {
            const dueMonth = new Date(installment.dueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            return dueMonth.toLowerCase() === activeMonth.toLowerCase();
          }
          return false;
        });

    const totalExpected = matchingInstallments.reduce((sum, { installment }) => sum + (Number(installment.amount) || 0), 0);
    const totalReceived = matchingInstallments.reduce((sum, { installment }) => {
      if (installment.status === 'Paid') return sum + (Number(installment.amount) || 0);
      if (installment.status === 'Partially Paid') return sum + (Number(installment.paidAmount) || 0);
      return sum;
    }, 0);
    const totalPending = Math.max(0, totalExpected - totalReceived);

    // Overdue count & amount (due date before today and status is Pending / Partially Paid)
    const todayIso = now.toISOString().split('T')[0];
    const overdueList = allInstallments.filter(({ installment }) => {
      if (installment.status === 'Paid') return false;
      if (installment.dueDate && installment.dueDate < todayIso) return true;
      return installment.status === 'Overdue';
    });
    const totalOverdueAmount = overdueList.reduce((sum, { installment }) => {
      const remaining = installment.amount - (installment.paidAmount || 0);
      return sum + Math.max(0, remaining);
    }, 0);

    return {
      activeMonth,
      availableMonths: Array.from(monthSet),
      matchingInstallments,
      totalExpected,
      totalReceived,
      totalPending,
      overdueCount: overdueList.length,
      totalOverdueAmount,
      currentMonthStr
    };
  };

  // New this week (last 7 days)
  const getNewThisWeek = () => {
    if (!db) return 0;
    const sevenDaysAgo = Date.now() - 7 * 24 * 3600000;
    let count = 0;
    const checkDate = (isoStr: string) => {
      return new Date(isoStr).getTime() > sevenDaysAgo;
    };

    db.tutors.forEach(r => checkDate(r.created_at) && count++);
    db.shadow_teachers.forEach(r => checkDate(r.created_at) && count++);
    db.parent_shadow_requests.forEach(r => checkDate(r.created_at) && count++);
    db.parent_tutor_requests.forEach(r => checkDate(r.created_at) && count++);
    
    return count;
  };

  const newThisWeek = getNewThisWeek();

  // Combine and sort recent registrations (last 10 across all)
  const getRecentRegistrations = () => {
    if (!db) return [];
    
    const allRecords: any[] = [];
    db.tutors.forEach(r => allRecords.push({ ...r, typeLabel: 'Tutor', typeCollection: 'tutors' }));
    db.shadow_teachers.forEach(r => allRecords.push({ ...r, typeLabel: 'Shadow Teacher', typeCollection: 'shadow_teachers' }));
    db.parent_shadow_requests.forEach(r => allRecords.push({ ...r, typeLabel: 'Parent (Shadow)', typeCollection: 'parent_shadow_requests' }));
    db.parent_tutor_requests.forEach(r => allRecords.push({ ...r, typeLabel: 'Parent (Tutor)', typeCollection: 'parent_tutor_requests' }));

    return allRecords
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);
  };

  const recentRegistrations = getRecentRegistrations();

  const getPaymentsList = () => {
    if (!db) return [];
    const list: any[] = [];

    const isRecordWaived = (r: any) => {
      const ps = (r.paymentStatus || r.payment_status || '').toLowerCase();
      const notesStr = ((r.notes || '') + ' ' + (r.message || '')).toUpperCase();
      const payId = (r.razorpayPaymentId || r.razorpay_payment_id || '').toUpperCase();
      return ps.includes('waived') || 
             notesStr.includes('SHADOW100') || 
             notesStr.includes('THERAPY99') || 
             payId.includes('SHADOW100') || 
             payId.includes('THERAPY99');
    };

    const getRealPaymentId = (r: any, isPlacement: boolean, isWaived: boolean) => {
      if (isWaived) {
        const notesStr = ((r.notes || '') + ' ' + (r.message || '')).toUpperCase();
        if (notesStr.includes('THERAPY99') || (r.razorpayPaymentId || '').includes('THERAPY99')) {
          return 'N/A (Coupon THERAPY99)';
        }
        return 'N/A (VIP Outreach)';
      }
      
      const pid = isPlacement 
        ? (r.placementPaymentId || r.placement_payment_id || r.razorpayPaymentId || r.razorpay_payment_id)
        : (r.razorpayPaymentId || r.razorpay_payment_id);
      
      if (pid && (pid.startsWith('pay_') || pid.startsWith('PAY_'))) return pid;

      const notesStr = (r.notes || '') + ' ' + (r.message || '');
      const match = notesStr.match(/(pay_[a-zA-Z0-9]+)/i);
      if (match && match[1]) return match[1];

      return 'N/A (No Razorpay ID)';
    };

    const getRealOrderId = (r: any, isPlacement: boolean, isWaived: boolean) => {
      if (isWaived) {
        const notesStr = ((r.notes || '') + ' ' + (r.message || '')).toUpperCase();
        if (notesStr.includes('THERAPY99') || (r.razorpayOrderId || '').includes('THERAPY99')) {
          return 'N/A (Coupon THERAPY99)';
        }
        return 'N/A (VIP Outreach)';
      }

      const oid = isPlacement
        ? (r.placementOrderId || r.placement_order_id || r.razorpayOrderId || r.razorpay_order_id)
        : (r.razorpayOrderId || r.razorpay_order_id);

      if (oid && (oid.startsWith('order_') || oid.startsWith('ORDER_'))) return oid;

      const notesStr = (r.notes || '') + ' ' + (r.message || '');
      const match = notesStr.match(/(order_[a-zA-Z0-9]+)/i);
      if (match && match[1]) return match[1];

      return 'N/A (No Order ID)';
    };

    db.parent_shadow_requests.forEach(r => {
      if ((r as any).consultationPaid || (r as any).consultation_paid) {
        const isWaived = isRecordWaived(r);
        const paymentId = getRealPaymentId(r, false, isWaived);
        const orderId = getRealOrderId(r, false, isWaived);
        const isRealSuccess = !isWaived && paymentId.startsWith('pay_');

        list.push({
          id: r.id + '-cons',
          date: r.created_at,
          regId: r.registration_id,
          parentName: r.parentName || (r as any).parent_name,
          childName: r.childName || (r as any).child_name,
          phone: r.phone,
          email: r.email,
          type: 'Consultation Fee (Shadow Teacher)',
          amount: isWaived ? '₹0 (Waived)' : (isRealSuccess ? '₹99' : '₹0 (Unverified)'),
          numericAmount: isRealSuccess ? 99 : 0,
          originalFee: 99,
          paymentId,
          orderId,
          status: isWaived ? 'WAIVED (Outreach Code)' : (isRealSuccess ? 'SUCCESS' : 'UNVERIFIED (No Razorpay ID)'),
          isWaived,
          isRealSuccess
        });
      }
      if ((r as any).placementPaid || (r as any).placement_paid) {
        const placementAmt = Number((r as any).placementAmount || 5000);
        const pidStr = (r as any).placementPaymentId || (r as any).placement_payment_id || '';
        const notesStr = ((r as any).notes || '').toUpperCase();
        const isPlacementWaived = pidStr.includes('HI5000') || notesStr.includes('HI5000') || pidStr === 'N/A (VIP HI5000)';

        const paymentId = isPlacementWaived ? 'N/A (VIP HI5000)' : getRealPaymentId(r, true, false);
        const orderId = isPlacementWaived ? 'N/A (VIP HI5000)' : getRealOrderId(r, true, false);
        const isRealSuccess = !isPlacementWaived && paymentId.startsWith('pay_');

        list.push({
          id: r.id + '-place',
          date: (r as any).placementPaidAt || r.created_at,
          regId: r.registration_id,
          parentName: r.parentName || (r as any).parent_name,
          childName: r.childName || (r as any).child_name,
          phone: r.phone,
          email: r.email,
          type: 'Placement Fee (Shadow Teacher)',
          amount: isPlacementWaived ? '₹0 (Waived)' : (isRealSuccess ? `₹${placementAmt.toLocaleString()}` : '₹0 (Unverified)'),
          numericAmount: isRealSuccess ? placementAmt : 0,
          originalFee: placementAmt,
          paymentId,
          orderId,
          status: isPlacementWaived ? 'WAIVED (Placement Code HI5000)' : (isRealSuccess ? 'SUCCESS' : 'UNVERIFIED (No Razorpay ID)'),
          isWaived: isPlacementWaived,
          isRealSuccess
        });
      }
    });

    db.parent_tutor_requests.forEach(r => {
      if ((r as any).consultationPaid || (r as any).consultation_paid) {
        const isWaived = isRecordWaived(r);
        const paymentId = getRealPaymentId(r, false, isWaived);
        const orderId = getRealOrderId(r, false, isWaived);
        const isRealSuccess = !isWaived && paymentId.startsWith('pay_');

        list.push({
          id: r.id + '-cons',
          date: r.created_at,
          regId: r.registration_id,
          parentName: r.parentName || (r as any).parent_name,
          childName: r.childName || (r as any).child_name,
          phone: r.phone,
          email: r.email,
          type: 'Consultation Fee (Home Tutor)',
          amount: isWaived ? '₹0 (Waived)' : (isRealSuccess ? '₹99' : '₹0 (Unverified)'),
          numericAmount: isRealSuccess ? 99 : 0,
          originalFee: 99,
          paymentId,
          orderId,
          status: isWaived ? 'WAIVED (Outreach Code)' : (isRealSuccess ? 'SUCCESS' : 'UNVERIFIED (No Razorpay ID)'),
          isWaived,
          isRealSuccess
        });
      }
      if ((r as any).placementPaid || (r as any).placement_paid) {
        const placementAmt = Number((r as any).placementAmount || 3000);
        const pidStr = (r as any).placementPaymentId || (r as any).placement_payment_id || '';
        const notesStr = ((r as any).notes || '').toUpperCase();
        const isPlacementWaived = pidStr.includes('HI5000') || notesStr.includes('HI5000') || pidStr === 'N/A (VIP HI5000)';

        const paymentId = isPlacementWaived ? 'N/A (VIP HI5000)' : getRealPaymentId(r, true, false);
        const orderId = isPlacementWaived ? 'N/A (VIP HI5000)' : getRealOrderId(r, true, false);
        const isRealSuccess = !isPlacementWaived && paymentId.startsWith('pay_');

        list.push({
          id: r.id + '-place',
          date: (r as any).placementPaidAt || r.created_at,
          regId: r.registration_id,
          parentName: r.parentName || (r as any).parent_name,
          childName: r.childName || (r as any).child_name,
          phone: r.phone,
          email: r.email,
          type: 'Placement Fee (Home Tutor)',
          amount: isPlacementWaived ? '₹0 (Waived)' : (isRealSuccess ? `₹${placementAmt.toLocaleString()}` : '₹0 (Unverified)'),
          numericAmount: isRealSuccess ? placementAmt : 0,
          originalFee: placementAmt,
          paymentId,
          orderId,
          status: isPlacementWaived ? 'WAIVED (Placement Code HI5000)' : (isRealSuccess ? 'SUCCESS' : 'UNVERIFIED (No Razorpay ID)'),
          isWaived: isPlacementWaived,
          isRealSuccess
        });
      }
    });

    (db.parent_therapy_requests || []).forEach(r => {
      if ((r as any).consultationPaid || (r as any).consultation_paid) {
        const isWaived = isRecordWaived(r);
        const paymentId = getRealPaymentId(r, false, isWaived);
        const orderId = getRealOrderId(r, false, isWaived);
        const isRealSuccess = !isWaived && paymentId.startsWith('pay_');
        const thType = (r as any).therapyType || (r as any).therapy_type || 'Therapy';

        list.push({
          id: r.id + '-cons',
          date: r.created_at,
          regId: r.registration_id,
          parentName: r.parentName || (r as any).parent_name,
          childName: r.childName || (r as any).child_name,
          phone: r.phone,
          email: r.email,
          type: `Consultation Fee (${thType})`,
          amount: isWaived ? '₹0 (Waived)' : (isRealSuccess ? '₹99' : '₹0 (Unverified)'),
          numericAmount: isRealSuccess ? 99 : 0,
          originalFee: 99,
          paymentId,
          orderId,
          status: isWaived ? (paymentId.includes('THERAPY99') ? 'WAIVED (Coupon THERAPY99)' : 'WAIVED (Outreach Code)') : (isRealSuccess ? 'SUCCESS' : 'UNVERIFIED (No Razorpay ID)'),
          isWaived,
          isRealSuccess
        });
      }
    });
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const paymentsList = getPaymentsList();

  // Filters mapping
  const getFilteredTutors = () => {
    if (!db) return [];
    return db.tutors.filter(r => {
      const matchSearch = (r.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.registration_id ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.phone ?? '').includes(searchQuery);
      const matchCity = filterCity ? r.city === filterCity : true;
      const matchStatus = filterStatus ? r.status === filterStatus : true;
      const matchExp = filterExperience ? r.experience === filterExperience : true;
      const matchSub = filterSubject ? (r.subjects ?? '').toLowerCase().includes(filterSubject.toLowerCase()) : true;

      return matchSearch && matchCity && matchStatus && matchExp && matchSub;
    });
  };

  const getFilteredShadows = () => {
    if (!db) return [];
    return db.shadow_teachers.filter(r => {
      const matchSearch = (r.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.registration_id ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.phone ?? '').includes(searchQuery);
      const matchCity = filterCity ? r.city === filterCity : true;
      const matchStatus = filterStatus ? r.status === filterStatus : true;
      const matchExp = filterExperience ? r.experience === filterExperience : true;
      const matchSpecial = filterSpecialNeeds ? r.specialNeedsExp === filterSpecialNeeds : true;
      const matchComfort = filterComfortableArea ? (r.comfortableAreas ?? '').toLowerCase().includes(filterComfortableArea.toLowerCase()) : true;

      return matchSearch && matchCity && matchStatus && matchExp && matchSpecial && matchComfort;
    });
  };

  const getFilteredParentRequests = () => {
    if (!db) return [];
    const collection = parentSubTab === 'shadow' 
      ? db.parent_shadow_requests 
      : (parentSubTab === 'therapy' ? (db.parent_therapy_requests || []) : db.parent_tutor_requests);
    return collection.filter(r => {
      const matchSearch = (r.parentName ?? (r as any).parent_name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.childName ?? (r as any).child_name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.registration_id ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.phone ?? '').includes(searchQuery);
      const matchCity = filterCity ? r.city === filterCity : true;
      const matchStatus = filterStatus ? r.status === filterStatus : true;

      return matchSearch && matchCity && matchStatus && (filterPlacementPaid === '' ? true : filterPlacementPaid === 'yes' ? ((r as any).placementPaid || (r as any).placement_paid || false) : !((r as any).placementPaid || (r as any).placement_paid || false));
    });
  };

  // Helper status color badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Consultation Scheduled':
      case 'Interview Scheduled':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      case 'Requirement Analysis':
      case 'Onboarding':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Match Proposed':
      case 'Shortlisted':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'Introduction Call':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Support Started':
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Rejected':
      case 'Closed':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden text-left font-sans">

      {/* MOBILE BACKDROP — closes sidebar when tapped outside */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 1. LEFT SIDEBAR — fixed drawer on mobile, static column on md+ */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-primary text-white flex flex-col justify-between shrink-0
          transform transition-transform duration-300 ease-in-out
          md:static md:w-64 md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="space-y-6 overflow-y-auto">
          {/* Brand header row — includes close button on mobile */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-primary font-black shadow-md shrink-0">
                SB
              </div>
              <div className="text-left">
                <h2 className="font-serif font-black text-sm tracking-wide">The Shadow Bridge</h2>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">by Pratibha Mishra</p>
              </div>
            </div>
            <button
              className="md:hidden text-white/60 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="px-4 space-y-1">
            {[
              { key: 'overview', label: 'Overview', icon: LayoutDashboard },
              { key: 'tutors', label: 'Tutors Registry', icon: Users },
              { key: 'shadows', label: 'Shadow Teachers', icon: GraduationCap },
              { key: 'commissions', label: 'Commission Management', icon: BadgePercent },
              { key: 'parents', label: 'Parent Requests', icon: ClipboardList },
              { key: 'schools', label: 'School Requests', icon: School },
              { key: 'bookings', label: 'Consultations (₹99)', icon: Calendar },
              { key: 'contacts', label: 'Contact Messages', icon: MessageSquare },
              { key: 'payments', label: 'Payments Ledger', icon: CreditCard },
              { key: 'reviews', label: 'Parent Reviews', icon: Star },
              { key: 'notifications', label: 'Notifications Log', icon: Mail },
              { key: 'settings', label: 'Settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key as any);
                    setSearchQuery('');
                    setFilterCity('');
                    setFilterStatus('');
                    setFilterExperience('');
                    setFilterSubject('');
                    setFilterSpecialNeeds('');
                    setFilterComfortableArea('');
                    setSidebarOpen(false); // auto-close on mobile after navigation
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === item.key
                      ? 'bg-accent text-primary shadow-md'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-5 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs text-white/70 overflow-hidden">
            <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <User size={12} />
            </div>
            <span className="truncate font-semibold">{adminEmail}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600 text-rose-200 hover:text-white rounded-xl font-bold text-xs transition-all border border-rose-600/30 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTAINER AREA */}
      <main className="flex-grow flex flex-col overflow-hidden min-w-0">

        {/* TOP STATUS BAR & TOAST LOGGER */}
        <header className="h-14 md:h-16 bg-white border-b border-brand-border/60 px-4 md:px-8 flex justify-between items-center shrink-0 gap-3">
          {/* Hamburger button — visible only on mobile */}
          <button
            className="md:hidden p-2 rounded-lg border border-brand-border text-primary hover:bg-brand-light transition-colors cursor-pointer shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider hidden sm:inline">Console Mode:</span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 rounded-full text-[10px] uppercase flex items-center gap-1 shrink-0">
              <ShieldCheck size={10} />
              <span className="hidden sm:inline">Active Database Connected</span>
              <span className="sm:hidden">Live DB</span>
            </span>
          </div>

          <button
            onClick={fetchDatabase}
            className="p-2 border border-brand-border hover:bg-brand-light rounded-lg text-primary flex items-center justify-center cursor-pointer transition-all shadow-sm shrink-0"
            title="Refresh Database Records"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </header>

        {/* NOTIFICATION LOG TOAST */}
        {toastLog && (
          <div className="bg-[#502C6E] text-accent p-3 px-4 md:px-8 text-xs font-bold font-sans flex items-center gap-2 border-b border-accent/20 animate-fade-in-down shadow-md shrink-0">
            <Info size={14} className="animate-bounce shrink-0" />
            <span className="flex-grow text-left text-white line-clamp-2">{toastLog}</span>
            <button onClick={() => setToastLog(null)} className="text-white/60 hover:text-white cursor-pointer ml-2 shrink-0">
              <X size={14} />
            </button>
          </div>
        )}

        {/* WORKSPACE AREA */}
        <div className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto min-w-0">
          

          {/* TAB 1: OVERVIEW PAGE */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in-up">
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white p-6 border border-brand-border rounded-2xl shadow-sm text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
                  <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider">Total Tutors</h4>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-primary">{totalTutors}</span>
                    <span className="text-[10px] text-brand-muted">Registered Tutors</span>
                  </div>
                </div>

                <div className="bg-white p-6 border border-brand-border rounded-2xl shadow-sm text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full blur-xl pointer-events-none"></div>
                  <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider">Shadow Teachers</h4>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-primary">{totalShadows}</span>
                    <span className="text-[10px] text-brand-muted">Registered Shadows</span>
                  </div>
                </div>

                <div className="bg-white p-6 border border-brand-border rounded-2xl shadow-sm text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/5 rounded-full blur-xl pointer-events-none"></div>
                  <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider">Parent Requests</h4>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-primary">{totalRequests}</span>
                    <span className="text-[10px] text-brand-muted">
                      ({totalParentShadows} Shadow / {totalParentTutors} Tutor)
                    </span>
                  </div>
                </div>

                <div className="bg-white p-6 border border-brand-border rounded-2xl shadow-sm text-left relative overflow-hidden bg-gradient-to-br from-[#F6F4FB] to-white">
                  <h4 className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={12} className="animate-spin" /> New This Week
                  </h4>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-secondary">{newThisWeek}</span>
                    <span className="text-[10px] text-brand-muted">New Submissions</span>
                  </div>
                </div>

              </div>

              {/* Expected Commission This Month Widget */}
              {(() => {
                const stats = getCommissionMonthlyStats();
                const thisMonthInstallments = stats.matchingInstallments;

                return (
                  <div className="bg-white rounded-3xl border border-brand-border/80 shadow-sm overflow-hidden space-y-4">
                    <div className="p-5 sm:p-6 border-b border-brand-border/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gradient-to-r from-purple-50/60 to-white">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-primary text-white rounded-lg">
                            <BadgePercent size={16} />
                          </span>
                          <h3 className="font-serif text-lg font-bold text-primary">
                            Expected Commission This Month ({stats.currentMonthStr})
                          </h3>
                        </div>
                        <p className="text-xs text-brand-muted mt-1">
                          Track one-time placement commission installments due in {stats.currentMonthStr}.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => openCommissionWizard()}
                          className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <PlusCircle size={14} />
                          <span>Add Commission</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('commissions');
                            setCommissionSelectedMonth('current');
                          }}
                          className="px-3.5 py-1.5 bg-brand-light hover:bg-brand-light/80 text-brand-dark font-bold text-xs rounded-xl border border-brand-border transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>Commission Dashboard</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="px-5 sm:px-6 py-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 bg-brand-light/40 rounded-2xl border border-brand-border/60">
                        <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block">Expected Revenue</span>
                        <span className="text-xl font-black text-primary mt-0.5 block">₹{stats.totalExpected.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/60">
                        <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Collected</span>
                        <span className="text-xl font-black text-emerald-700 mt-0.5 block">₹{stats.totalReceived.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60">
                        <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Pending Balance</span>
                        <span className="text-xl font-black text-amber-700 mt-0.5 block">₹{stats.totalPending.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200/60">
                        <span className="text-[10px] text-rose-800 font-bold uppercase tracking-wider block">Overdue Installments</span>
                        <span className="text-xl font-black text-rose-700 mt-0.5 block">{stats.overdueCount} ({`₹${stats.totalOverdueAmount.toLocaleString('en-IN')}`})</span>
                      </div>
                    </div>

                    {thisMonthInstallments.length > 0 ? (
                      <div className="overflow-x-auto border-t border-brand-border/60">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-brand-light/40 text-brand-muted text-[10px] uppercase font-bold border-b border-brand-border">
                              <th className="py-2.5 px-5">Shadow Teacher</th>
                              <th className="py-2.5 px-4">Installment</th>
                              <th className="py-2.5 px-4">Due Date</th>
                              <th className="py-2.5 px-4">Amount</th>
                              <th className="py-2.5 px-4">Status</th>
                              <th className="py-2.5 px-5 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-border/40">
                            {thisMonthInstallments.slice(0, 5).map(({ teacher, installment }) => {
                              const isOverdue = installment.status !== 'Paid' && installment.dueDate && installment.dueDate < new Date().toISOString().split('T')[0];
                              const effStatus = isOverdue ? 'Overdue' : installment.status;

                              return (
                                <tr key={`${teacher.id}-${installment.id}`} className="hover:bg-brand-light/20">
                                  <td className="py-2.5 px-5">
                                    <div className="font-bold text-primary">{teacher.name}</div>
                                    <div className="text-[10px] text-brand-muted font-mono">{teacher.registration_id} • {teacher.city}</div>
                                  </td>
                                  <td className="py-2.5 px-4 font-medium text-brand-dark">
                                    Inst #{installment.installmentNumber}
                                  </td>
                                  <td className="py-2.5 px-4 font-mono text-[11px] text-brand-dark">
                                    {installment.dueDate ? new Date(installment.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                                  </td>
                                  <td className="py-2.5 px-4 font-black text-primary">
                                    ₹{installment.amount.toLocaleString('en-IN')}
                                  </td>
                                  <td className="py-2.5 px-4">
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                      effStatus === 'Paid'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : (effStatus === 'Partially Paid' ? 'bg-blue-50 text-blue-700' : (effStatus === 'Overdue' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'))
                                    }`}>
                                      {effStatus}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-5 text-right">
                                    <button
                                      onClick={() => openPaymentLogger(teacher, installment)}
                                      className="px-2.5 py-1 bg-primary hover:bg-primary/90 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer shadow-sm"
                                    >
                                      Update
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs text-brand-muted">
                        No commission installments scheduled for {stats.currentMonthStr} yet.
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Recent Submissions Table */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-black text-primary border-b border-brand-border pb-2">
                  Recent Submissions (Last 10)
                </h3>
                
                <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
                  {loading ? (
                    <div className="p-12 text-center text-brand-muted">
                      <RefreshCw className="animate-spin mx-auto mb-2 text-primary" size={24} />
                      <span>Loading recent records...</span>
                    </div>
                  ) : recentRegistrations.length === 0 ? (
                    <div className="p-12 text-center text-brand-muted">No submissions found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-brand-light/60 border-b border-brand-border text-primary font-bold">
                            <th className="p-4">Date</th>
                            <th className="p-4">Reg ID</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">City</th>
                            <th className="p-4">Type</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border/40 text-brand-dark font-medium">
                          {recentRegistrations.map((r) => (
                            <tr key={r.id} className="hover:bg-brand-light/20">
                              <td className="p-4 text-brand-muted">{formatDate(r.created_at)}</td>
                              <td className="p-4 font-bold text-secondary">{r.registration_id}</td>
                              <td className="p-4 font-bold">{r.parentName || r.name}</td>
                              <td className="p-4">{r.city}</td>
                              <td className="p-4">
                                <span className="px-2 py-0.5 bg-brand-light border border-brand-border rounded-md text-[10px] font-bold text-primary uppercase">
                                  {r.typeLabel}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(r.status)}`}>
                                  {r.status}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => {
                                    setEditStatus(r.status);
                                    setEditNotes(r.notes || '');
                                    setEditMatchId((r as any).suggestedMatchId || '');
                                    setSelectedRecord({ type: r.typeCollection, data: r });
                                  }}
                                  className="px-3 py-1 bg-primary text-white rounded-lg font-bold text-[10px] hover:bg-primary/95 transition-all cursor-pointer shadow-sm"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: TUTORS TAB */}
          {activeTab === 'tutors' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="font-serif text-2xl font-black text-primary">Academic Tutors</h2>
                
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search by name, ID, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2.5 pl-9 border border-brand-border bg-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={14} />
                </div>
              </div>

              {/* Filters Panel */}
              <div className="bg-white border border-brand-border p-4 rounded-2xl shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-muted uppercase font-bold flex items-center gap-1">
                    <Filter size={10} /> Filter City
                  </span>
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="p-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"
                  >
                    <option value="">All Cities</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-muted uppercase font-bold flex items-center gap-1">
                    <Filter size={10} /> Filter Status
                  </span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"
                  >
                    <option value="">All Statuses</option>
                    <option value="Interview Awaiting">Interview Awaiting</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Active">Active</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-muted uppercase font-bold flex items-center gap-1">
                    <Filter size={10} /> Experience
                  </span>
                  <select
                    value={filterExperience}
                    onChange={(e) => setFilterExperience(e.target.value)}
                    className="p-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"
                  >
                    <option value="">All Experience</option>
                    <option value="Fresher">Fresher</option>
                    <option value="0-2 Years">0-2 Years</option>
                    <option value="2-5 Years">2-5 Years</option>
                    <option value="More than 5 Years">More than 5 Years</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-muted uppercase font-bold flex items-center gap-1">
                    <Filter size={10} /> Subject Focus
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Mathematics"
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="p-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"
                  />
                </div>
              </div>

              {/* Tutors Table */}
              <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center text-brand-muted">
                    <RefreshCw className="animate-spin mx-auto mb-2 text-primary" size={24} />
                    <span>Loading tutors database...</span>
                  </div>
                ) : getFilteredTutors().length === 0 ? (
                  <div className="p-12 text-center text-brand-muted">No tutors match the criteria.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-brand-light/60 border-b border-brand-border text-primary font-bold">
                          <th className="p-4">Reg ID</th>
                          <th className="p-4">Name</th>
                          <th className="p-4">City</th>
                          <th className="p-4">Experience</th>
                          <th className="p-4">Subjects & Grades</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-center">Registered</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/40 text-brand-dark font-medium">
                        {getFilteredTutors().map((r) => (
                          <tr key={r.id} className="hover:bg-brand-light/20">
                            <td className="p-4 font-bold text-secondary">{r.registration_id}</td>
                            <td className="p-4">
                              <p className="font-bold">{r.name}</p>
                              <p className="text-[10px] text-brand-muted">{r.phone} • {r.email}</p>
                            </td>
                            <td className="p-4">{r.city}</td>
                            <td className="p-4">{r.experience}</td>
                            <td className="p-4 max-w-xs truncate">
                              <p className="font-bold">{r.subjects}</p>
                              <p className="text-brand-muted text-[10px]">{r.grades}</p>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(r.status)}`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="p-4 text-center text-brand-muted">{formatDate(r.created_at)}</td>
                            <td className="p-4 text-center">
                               <div className="flex items-center justify-center gap-2">
                                 <button
                                   onClick={() => {
                                     setEditStatus(r.status);
                                     setEditNotes(r.notes || '');
                                     setEditMatchId((r as any).suggestedMatchId || '');
                                     setSelectedRecord({ type: 'tutors', data: r });
                                   }}
                                   className="px-3 py-1.5 border border-primary hover:bg-primary/5 text-primary rounded-xl font-bold text-[10px] transition-all cursor-pointer shadow-sm"
                                 >
                                   View Details
                                 </button>
                                 <button
                                   onClick={() => setDeleteTarget({
                                     type: 'tutors',
                                     id: r.id,
                                     name: r.name || r.registration_id || 'Tutor',
                                     label: `Tutor Record ${r.registration_id || ''} (${r.name})`
                                   })}
                                   className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg transition-all cursor-pointer"
                                   title="Delete Tutor Record Permanently"
                                 >
                                   <Trash2 size={13} />
                                 </button>
                               </div>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SHADOW TEACHERS TAB */}
          {activeTab === 'shadows' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="font-serif text-2xl font-black text-primary">Shadow Teachers</h2>
                
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search by name, ID, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2.5 pl-9 border border-brand-border bg-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={14} />
                </div>
              </div>

              {/* Filters Panel */}
              <div className="bg-white border border-brand-border p-4 rounded-2xl shadow-sm grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-muted uppercase font-bold flex items-center gap-1">
                    <Filter size={10} /> Filter City
                  </span>
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="p-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"
                  >
                    <option value="">All Cities</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-muted uppercase font-bold flex items-center gap-1">
                    <Filter size={10} /> Filter Status
                  </span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"
                  >
                    <option value="">All Statuses</option>
                    <option value="Interview Awaiting">Interview Awaiting</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Active">Active</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-muted uppercase font-bold flex items-center gap-1">
                    <Filter size={10} /> Special-Ed Exp
                  </span>
                  <select
                    value={filterSpecialNeeds}
                    onChange={(e) => setFilterSpecialNeeds(e.target.value)}
                    className="p-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"
                  >
                    <option value="">All Experience</option>
                    <option value="Yes">Yes (Experience)</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-muted uppercase font-bold flex items-center gap-1">
                    <Filter size={10} /> Comfortable Area
                  </span>
                  <select
                    value={filterComfortableArea}
                    onChange={(e) => setFilterComfortableArea(e.target.value)}
                    className="p-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"
                  >
                    <option value="">All Areas</option>
                    <option value="Autism">Autism ASD</option>
                    <option value="ADHD">ADHD</option>
                    <option value="Learning">Learning Disabilities</option>
                    <option value="Down">Down Syndrome</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-muted uppercase font-bold flex items-center gap-1">
                    <Filter size={10} /> Experience Years
                  </span>
                  <select
                    value={filterExperience}
                    onChange={(e) => setFilterExperience(e.target.value)}
                    className="p-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"
                  >
                    <option value="">All Experience</option>
                    <option value="Fresher">Fresher</option>
                    <option value="0-2 Years">0-2 Years</option>
                    <option value="2-5 Years">2-5 Years</option>
                    <option value="More than 5 Years">More than 5 Years</option>
                  </select>
                </div>
              </div>

              {/* Shadows Table */}
              <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center text-brand-muted">
                    <RefreshCw className="animate-spin mx-auto mb-2 text-primary" size={24} />
                    <span>Loading shadow teachers database...</span>
                  </div>
                ) : getFilteredShadows().length === 0 ? (
                  <div className="p-12 text-center text-brand-muted">No shadow teachers match the criteria.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-brand-light/60 border-b border-brand-border text-primary font-bold">
                          <th className="p-4">Reg ID</th>
                          <th className="p-4">Name</th>
                          <th className="p-4">City</th>
                          <th className="p-4">Qualification</th>
                          <th className="p-4">Special Needs Exp?</th>
                          <th className="p-4">Comfortable Areas</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/40 text-brand-dark font-medium">
                        {getFilteredShadows().map((r) => (
                          <tr key={r.id} className="hover:bg-brand-light/20">
                            <td className="p-4 font-bold text-secondary">{r.registration_id}</td>
                            <td className="p-4">
                              <p className="font-bold">{r.name}</p>
                              <p className="text-[10px] text-brand-muted">{r.phone} • {r.email}</p>
                            </td>
                            <td className="p-4">{r.city}</td>
                            <td className="p-4">{r.qualification}</td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                r.specialNeedsExp === 'Yes' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-600'
                              }`}>
                                {r.specialNeedsExp}
                              </span>
                            </td>
                            <td className="p-4 max-w-xs truncate">{r.comfortableAreas}</td>
                            <td className="p-4 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(r.status)}`}>
                                {r.status}
                              </span>
                            </td>
                             <td className="p-4 text-center">
                               <div className="flex items-center justify-center gap-2">
                                 <button
                                   onClick={() => {
                                     setEditStatus(r.status);
                                     setEditNotes(r.notes || '');
                                     setEditMatchId((r as any).suggestedMatchId || '');
                                     setSelectedRecord({ type: 'shadow_teachers', data: r });
                                   }}
                                   className="px-3 py-1.5 border border-primary hover:bg-primary/5 text-primary rounded-xl font-bold text-[10px] transition-all cursor-pointer shadow-sm"
                                 >
                                   View Details
                                 </button>
                                 <button
                                   onClick={() => setDeleteTarget({
                                     type: 'shadow_teachers',
                                     id: r.id,
                                     name: r.name || r.registration_id || 'Shadow Teacher',
                                     label: `Shadow Teacher Record ${r.registration_id || ''} (${r.name})`
                                   })}
                                   className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg transition-all cursor-pointer"
                                   title="Delete Shadow Teacher Record Permanently"
                                 >
                                   <Trash2 size={13} />
                                 </button>
                               </div>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: COMMISSION MANAGEMENT & PAYMENT TRACKING */}
          {activeTab === 'commissions' && (() => {
            const stats = getCommissionMonthlyStats();
            const allShadows = db?.shadow_teachers || [];

            // Filter placed/active teachers or teachers with commission configured
            const placedTeachers = allShadows.filter((st: any) => {
              const matchesSearch = (st.name || '').toLowerCase().includes(commissionSearchQuery.toLowerCase()) ||
                                    (st.registration_id || '').toLowerCase().includes(commissionSearchQuery.toLowerCase()) ||
                                    (st.city || '').toLowerCase().includes(commissionSearchQuery.toLowerCase()) ||
                                    (st.phone || '').includes(commissionSearchQuery);
              if (!matchesSearch) return false;

              if (commissionStatusFilter === 'All') return true;
              if (commissionStatusFilter === 'Pending') return st.commission?.status === 'Active' && st.commission?.totalPending > 0;
              if (commissionStatusFilter === 'Paid') return st.commission?.status === 'Completed' || (st.commission && st.commission.totalPending === 0);
              if (commissionStatusFilter === 'Overdue') {
                return (st.commission?.installments || []).some((inst: any) => inst.status === 'Overdue' || (inst.dueDate && inst.dueDate < new Date().toISOString().split('T')[0] && inst.status !== 'Paid'));
              }
              return true;
            });

            // Filter month installments by search
            const filteredMonthlyInstallments = stats.matchingInstallments.filter(({ teacher, installment }) => {
              const matchesSearch = (teacher.name || '').toLowerCase().includes(commissionSearchQuery.toLowerCase()) ||
                                    (teacher.registration_id || '').toLowerCase().includes(commissionSearchQuery.toLowerCase()) ||
                                    (teacher.city || '').toLowerCase().includes(commissionSearchQuery.toLowerCase()) ||
                                    (teacher.phone || '').includes(commissionSearchQuery);
              if (!matchesSearch) return false;
              if (commissionStatusFilter !== 'All') {
                if (commissionStatusFilter === 'Overdue') {
                  const today = new Date().toISOString().split('T')[0];
                  return installment.status === 'Overdue' || (installment.dueDate && installment.dueDate < today && installment.status !== 'Paid');
                }
                return installment.status === commissionStatusFilter;
              }
              return true;
            });

            return (
              <div className="space-y-8 animate-fade-in-up">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-primary via-purple-900 to-[#4A3275] p-6 sm:p-8 rounded-3xl text-white shadow-md relative overflow-hidden">
                  <div className="space-y-1 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="p-2 bg-accent text-primary rounded-xl font-bold flex items-center justify-center">
                        <BadgePercent size={20} />
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-black">Commission Management</h2>
                    </div>
                    <p className="text-white/80 text-xs sm:text-sm max-w-2xl font-medium">
                      Automated tracking for Shadow Teacher one-time placement commissions, installment schedules, and monthly revenue collection.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 relative z-10">
                    <button
                      onClick={() => openCommissionWizard()}
                      className="px-5 py-3 bg-accent hover:bg-accent/90 text-primary font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <PlusCircle size={16} />
                      Setup New Commission
                    </button>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-96 bg-radial from-white/10 to-transparent pointer-events-none" />
                </div>

                {/* Overdue Alert Banner (if any) */}
                {stats.overdueCount > 0 && (
                  <div className="p-4 sm:p-5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start sm:items-center justify-between gap-4 text-rose-900">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rose-100 text-rose-700 rounded-xl shrink-0">
                        <AlertTriangle size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Overdue Commission Alert</h4>
                        <p className="text-xs text-rose-700">
                          <strong>{stats.overdueCount} installment(s)</strong> totaling <strong>₹{stats.totalOverdueAmount.toLocaleString('en-IN')}</strong> have passed their due date and remain unpaid.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setCommissionStatusFilter('Overdue')}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
                    >
                      View Overdue
                    </button>
                  </div>
                )}

                {/* Period Selector & Search Filter Bar */}
                <div className="bg-white p-5 rounded-3xl border border-brand-border/60 shadow-sm space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Month Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-thin">
                      <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-1">
                        <CalendarDays size={14} className="text-secondary" />
                        Month:
                      </span>
                      <button
                        onClick={() => setCommissionSelectedMonth('current')}
                        className={`px-4 py-2 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer ${
                          commissionSelectedMonth === 'current'
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-brand-light/60 text-brand-dark hover:bg-brand-light'
                        }`}
                      >
                        {stats.currentMonthStr} (Current)
                      </button>
                      {stats.availableMonths
                        .filter(m => m !== stats.currentMonthStr)
                        .slice(0, 5)
                        .map(m => (
                          <button
                            key={m}
                            onClick={() => setCommissionSelectedMonth(m)}
                            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer ${
                              commissionSelectedMonth === m
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-brand-light/60 text-brand-dark hover:bg-brand-light'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      <button
                        onClick={() => setCommissionSelectedMonth('all')}
                        className={`px-4 py-2 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer ${
                          commissionSelectedMonth === 'all'
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-brand-light/60 text-brand-dark hover:bg-brand-light'
                        }`}
                      >
                        All Time
                      </button>
                    </div>

                    {/* Search & Status Filter */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="relative flex-grow md:w-64">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                        <input
                          type="text"
                          placeholder="Search teacher, city, ID..."
                          value={commissionSearchQuery}
                          onChange={(e) => setCommissionSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-brand-light/40 border border-brand-border rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                      </div>
                      <select
                        value={commissionStatusFilter}
                        onChange={(e) => setCommissionStatusFilter(e.target.value as any)}
                        className="px-3 py-2 bg-brand-light/40 border border-brand-border rounded-xl text-xs font-bold text-brand-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary shrink-0 cursor-pointer"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Partially Paid">Partially Paid</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Top Monthly Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  
                  {/* Expected This Month */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-brand-border/80 shadow-sm space-y-2 relative overflow-hidden">
                    <div className="flex justify-between items-center text-brand-muted">
                      <span className="text-[11px] uppercase font-bold tracking-wider">
                        {commissionSelectedMonth === 'all' ? 'All-Time Expected' : `Expected (${stats.activeMonth})`}
                      </span>
                      <div className="p-2.5 bg-purple-50 text-purple-700 rounded-2xl">
                        <TrendingUp size={18} />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-serif text-2xl sm:text-3xl font-black text-primary">
                        ₹{stats.totalExpected.toLocaleString('en-IN')}
                      </h3>
                      <p className="text-[11px] text-brand-muted font-medium">
                        Across {stats.matchingInstallments.length} installment(s)
                      </p>
                    </div>
                  </div>

                  {/* Received This Month */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-brand-border/80 shadow-sm space-y-2 relative overflow-hidden">
                    <div className="flex justify-between items-center text-brand-muted">
                      <span className="text-[11px] uppercase font-bold tracking-wider">
                        {commissionSelectedMonth === 'all' ? 'Total Collected' : `Received (${stats.activeMonth})`}
                      </span>
                      <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                        <CheckCircle2 size={18} />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-serif text-2xl sm:text-3xl font-black text-emerald-700">
                        ₹{stats.totalReceived.toLocaleString('en-IN')}
                      </h3>
                      <p className="text-[11px] text-emerald-600 font-medium">
                        {stats.totalExpected > 0 ? Math.round((stats.totalReceived / stats.totalExpected) * 100) : 0}% collected
                      </p>
                    </div>
                  </div>

                  {/* Pending This Month */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-brand-border/80 shadow-sm space-y-2 relative overflow-hidden">
                    <div className="flex justify-between items-center text-brand-muted">
                      <span className="text-[11px] uppercase font-bold tracking-wider">
                        {commissionSelectedMonth === 'all' ? 'Total Outstanding' : `Pending (${stats.activeMonth})`}
                      </span>
                      <div className="p-2.5 bg-amber-50 text-amber-700 rounded-2xl">
                        <Clock3 size={18} />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-serif text-2xl sm:text-3xl font-black text-amber-700">
                        ₹{stats.totalPending.toLocaleString('en-IN')}
                      </h3>
                      <p className="text-[11px] text-amber-600 font-medium">
                        Awaiting payment clearance
                      </p>
                    </div>
                  </div>

                  {/* Overdue Total */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-brand-border/80 shadow-sm space-y-2 relative overflow-hidden">
                    <div className="flex justify-between items-center text-brand-muted">
                      <span className="text-[11px] uppercase font-bold tracking-wider">Overdue Installments</span>
                      <div className="p-2.5 bg-rose-50 text-rose-700 rounded-2xl">
                        <AlertCircle size={18} />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-serif text-2xl sm:text-3xl font-black text-rose-700">
                        ₹{stats.totalOverdueAmount.toLocaleString('en-IN')}
                      </h3>
                      <p className="text-[11px] text-rose-600 font-medium">
                        {stats.overdueCount} overdue installment(s)
                      </p>
                    </div>
                  </div>

                </div>

                {/* 1. MONTHLY EXPECTED INSTALLMENTS BREAKDOWN TABLE */}
                <div className="bg-white rounded-3xl border border-brand-border/80 shadow-sm overflow-hidden space-y-4">
                  <div className="p-5 sm:p-6 border-b border-brand-border/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
                        <Calendar size={18} className="text-secondary" />
                        Installments Scheduled for {stats.activeMonth}
                      </h3>
                      <p className="text-xs text-brand-muted mt-0.5">
                        Specific commission installments expected or due in {stats.activeMonth}.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold">
                      {filteredMonthlyInstallments.length} Installment(s)
                    </span>
                  </div>

                  {filteredMonthlyInstallments.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center mx-auto text-brand-muted">
                        <CalendarDays size={24} />
                      </div>
                      <h4 className="font-bold text-brand-dark text-sm">No Installments Scheduled for {stats.activeMonth}</h4>
                      <p className="text-xs text-brand-muted max-w-sm mx-auto">
                        There are no shadow teacher commission installments due in this month matching your search.
                      </p>
                      <button
                        onClick={() => openCommissionWizard()}
                        className="mt-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <PlusCircle size={14} />
                        Add New Commission
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-brand-light/50 text-brand-muted text-[11px] uppercase tracking-wider font-bold border-b border-brand-border">
                            <th className="py-3.5 px-5">Shadow Teacher</th>
                            <th className="py-3.5 px-4">Location</th>
                            <th className="py-3.5 px-4">Decided Salary</th>
                            <th className="py-3.5 px-4">Rate (%)</th>
                            <th className="py-3.5 px-4">Installment</th>
                            <th className="py-3.5 px-4">Due Date</th>
                            <th className="py-3.5 px-4">Amount Due</th>
                            <th className="py-3.5 px-4">Payment Status</th>
                            <th className="py-3.5 px-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border/60 text-xs">
                          {filteredMonthlyInstallments.map(({ teacher, installment }) => {
                            const isOverdue = installment.status !== 'Paid' && installment.dueDate && installment.dueDate < new Date().toISOString().split('T')[0];
                            const effectiveStatus = isOverdue ? 'Overdue' : installment.status;

                            return (
                              <tr key={`${teacher.id}-${installment.id}`} className="hover:bg-brand-light/30 transition-colors">
                                <td className="py-3.5 px-5">
                                  <div className="font-bold text-primary">{teacher.name}</div>
                                  <div className="text-[10px] text-brand-muted font-mono">{teacher.registration_id || teacher.id}</div>
                                </td>
                                <td className="py-3.5 px-4 text-brand-dark font-medium">
                                  {teacher.city || '—'}
                                </td>
                                <td className="py-3.5 px-4 text-brand-dark font-bold">
                                  ₹{(teacher.commission?.monthlySalary || 0).toLocaleString('en-IN')}
                                </td>
                                <td className="py-3.5 px-4 text-brand-dark font-medium">
                                  {teacher.commission?.commissionPercentage || 40}%
                                </td>
                                <td className="py-3.5 px-4 font-semibold text-brand-dark">
                                  Inst #{installment.installmentNumber}
                                  <span className="block text-[10px] text-brand-muted">{installment.month}</span>
                                </td>
                                <td className="py-3.5 px-4 text-brand-dark">
                                  {installment.dueDate ? (
                                    <span className={`font-mono text-[11px] ${isOverdue ? 'text-rose-700 font-bold' : ''}`}>
                                      {new Date(installment.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                  ) : '—'}
                                </td>
                                <td className="py-3.5 px-4 font-black text-primary text-sm">
                                  ₹{installment.amount.toLocaleString('en-IN')}
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    effectiveStatus === 'Paid'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : (effectiveStatus === 'Partially Paid'
                                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                          : (effectiveStatus === 'Overdue'
                                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                              : 'bg-amber-50 text-amber-700 border border-amber-200'))
                                  }`}>
                                    {effectiveStatus}
                                  </span>
                                  {installment.paidDate && (
                                    <span className="block text-[9px] text-emerald-600 font-mono mt-0.5">
                                      Paid on {new Date(installment.paidDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 px-5 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => openPaymentLogger(teacher, installment)}
                                      className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1"
                                    >
                                      <CheckSquare size={13} />
                                      <span>Update Status</span>
                                    </button>
                                    <button
                                      onClick={() => openCommissionWizard(teacher)}
                                      className="p-1.5 text-brand-muted hover:text-brand-dark hover:bg-brand-light rounded-lg transition-colors cursor-pointer"
                                      title="Edit Commission Plan"
                                    >
                                      <Settings size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleOpenTeacherProfile(teacher)}
                                      className="p-1.5 text-brand-muted hover:text-brand-dark hover:bg-brand-light rounded-lg transition-colors cursor-pointer"
                                      title="View Shadow Teacher Profile"
                                    >
                                      <Eye size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 2. ALL PLACED SHADOW TEACHERS COMMISSION REGISTRY */}
                <div className="bg-white rounded-3xl border border-brand-border/80 shadow-sm overflow-hidden space-y-4">
                  <div className="p-5 sm:p-6 border-b border-brand-border/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
                        <Users size={18} className="text-secondary" />
                        Placed Shadow Teachers Master Registry &amp; Commission Plans
                      </h3>
                      <p className="text-xs text-brand-muted mt-0.5">
                        Overview of all Shadow Teachers with active placements and overall commission collection status.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-brand-light text-brand-dark border border-brand-border rounded-xl text-xs font-bold">
                      {placedTeachers.length} Shadow Teachers
                    </span>
                  </div>

                  {placedTeachers.length === 0 ? (
                    <div className="p-12 text-center text-brand-muted text-xs">
                      No Shadow Teachers found matching your filters.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-brand-light/50 text-brand-muted text-[11px] uppercase tracking-wider font-bold border-b border-brand-border">
                            <th className="py-3.5 px-5">Shadow Teacher</th>
                            <th className="py-3.5 px-4">City</th>
                            <th className="py-3.5 px-4">Placement Status</th>
                            <th className="py-3.5 px-4">Decided Salary</th>
                            <th className="py-3.5 px-4">Total Commission</th>
                            <th className="py-3.5 px-4">Collection Progress</th>
                            <th className="py-3.5 px-4">Balance Pending</th>
                            <th className="py-3.5 px-4">Plan Status</th>
                            <th className="py-3.5 px-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border/60 text-xs">
                          {placedTeachers.map((st: any) => {
                            const comm = st.commission;
                            const hasComm = !!comm;
                            const salary = comm?.monthlySalary || 0;
                            const totalComm = comm?.totalCommission || 0;
                            const totalPaid = comm?.totalPaid || 0;
                            const pending = comm?.totalPending || totalComm;
                            const pct = totalComm > 0 ? Math.round((totalPaid / totalComm) * 100) : 0;

                            return (
                              <tr key={st.id} className="hover:bg-brand-light/30 transition-colors">
                                <td className="py-3.5 px-5">
                                  <div className="font-bold text-primary">{st.name}</div>
                                  <div className="text-[10px] text-brand-muted font-mono">{st.registration_id || st.id}</div>
                                  <div className="text-[10px] text-brand-muted">{st.phone}</div>
                                </td>
                                <td className="py-3.5 px-4 font-medium text-brand-dark">
                                  {st.city || '—'}
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(st.status)}`}>
                                    {st.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 font-bold text-brand-dark">
                                  {hasComm ? `₹${salary.toLocaleString('en-IN')}` : <span className="text-brand-muted italic">Not Set</span>}
                                </td>
                                <td className="py-3.5 px-4 font-black text-primary">
                                  {hasComm ? `₹${totalComm.toLocaleString('en-IN')}` : <span className="text-brand-muted italic">—</span>}
                                  {hasComm && (
                                    <span className="block text-[10px] font-normal text-brand-muted">{comm.commissionPercentage}% rate ({comm.numberOfInstallments} inst)</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 min-w-[140px]">
                                  {hasComm ? (
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-[10px] font-bold">
                                        <span className="text-emerald-700">₹{totalPaid.toLocaleString('en-IN')}</span>
                                        <span className="text-brand-muted">{pct}%</span>
                                      </div>
                                      <div className="w-full bg-brand-light h-2 rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full rounded-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                                          style={{ width: `${Math.min(100, pct)}%` }}
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-brand-muted italic text-[10px]">No Plan</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 font-bold">
                                  {hasComm ? (
                                    <span className={pending > 0 ? 'text-amber-700' : 'text-emerald-700'}>
                                      ₹{pending.toLocaleString('en-IN')}
                                    </span>
                                  ) : (
                                    <span className="text-brand-muted">—</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4">
                                  {hasComm ? (
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                      comm.status === 'Completed'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                    }`}>
                                      {comm.status || 'Active'}
                                    </span>
                                  ) : (
                                    <span className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium">
                                      Pending Setup
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 px-5 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => openCommissionWizard(st)}
                                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1 shadow-sm ${
                                        hasComm
                                          ? 'bg-brand-light text-primary hover:bg-brand-light/80 border border-brand-border'
                                          : 'bg-accent hover:bg-accent/90 text-primary'
                                      }`}
                                    >
                                      {hasComm ? <Settings size={12} /> : <PlusCircle size={12} />}
                                      <span>{hasComm ? 'Edit Plan' : 'Add Commission'}</span>
                                    </button>
                                    <button
                                      onClick={() => handleOpenTeacherProfile(st)}
                                      className="p-1.5 text-brand-muted hover:text-brand-dark hover:bg-brand-light rounded-lg transition-colors cursor-pointer"
                                      title="View Profile Details"
                                    >
                                      <Eye size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            );
          })()}

          {/* TAB 4: PARENT REQUESTS TAB */}
          {activeTab === 'parents' && (
            <div className="space-y-6 animate-fade-in-up">
              
              {/* Header and Sub-tabs */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="font-serif text-2xl font-black text-primary">Parent Requests</h2>
                  <div className="flex bg-brand-light p-1 rounded-xl">
                    <button
                      onClick={() => setParentSubTab('shadow')}
                      className={`px-4 py-1.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                        parentSubTab === 'shadow'
                          ? 'bg-primary text-white'
                          : 'text-brand-muted hover:text-brand-dark'
                      }`}
                    >
                      Shadow Requests
                    </button>
                    <button
                      onClick={() => setParentSubTab('tutor')}
                      className={`px-4 py-1.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                        parentSubTab === 'tutor'
                          ? 'bg-primary text-white'
                          : 'text-brand-muted hover:text-brand-dark'
                      }`}
                    >
                      Home Tutor Requests
                    </button>
                    <button
                      onClick={() => setParentSubTab('therapy')}
                      className={`px-4 py-1.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                        parentSubTab === 'therapy'
                          ? 'bg-purple-900 text-white'
                          : 'text-brand-muted hover:text-brand-dark'
                      }`}
                    >
                      Therapy Requests (Delhi NCR)
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search name, child, ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2.5 pl-9 border border-brand-border bg-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-brand-dark"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={14} />
                </div>
              </div>

              {/* Filters Panel */}
              <div className="bg-white border border-brand-border p-4 rounded-2xl shadow-sm grid grid-cols-3 gap-4 max-w-xl">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-muted uppercase font-bold flex items-center gap-1">
                    <Filter size={10} /> Filter City
                  </span>
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="p-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"
                  >
                    <option value="">All Cities</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-muted uppercase font-bold flex items-center gap-1">
                    <Filter size={10} /> Filter Status
                  </span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"
                  >
                    <option value="">All Statuses</option>
                    <option value="Consultation Scheduled">Consultation Scheduled</option>
                    <option value="Requirement Analysis">Requirement Analysis</option>
                    <option value="Match Proposed">Match Proposed</option>
                    <option value="Introduction Call">Introduction Call</option>
                    <option value="Support Started">Support Started</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-muted uppercase font-bold flex items-center gap-1">
                    <CreditCard size={10} /> Placement Fee
                  </span>
                  <select
                    value={filterPlacementPaid}
                    onChange={(e) => setFilterPlacementPaid(e.target.value)}
                    className="p-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"
                  >
                    <option value="">All</option>
                    <option value="yes">Paid</option>
                    <option value="no">Not Paid</option>
                  </select>
                </div>
              </div>

              {/* Parent Table */}
              <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center text-brand-muted">
                    <RefreshCw className="animate-spin mx-auto mb-2 text-primary" size={24} />
                    <span>Loading parent requests...</span>
                  </div>
                ) : getFilteredParentRequests().length === 0 ? (
                  <div className="p-12 text-center text-brand-muted">No parent requests match the criteria.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-brand-light/60 border-b border-brand-border text-primary font-bold">
                          <th className="p-4">Reg ID</th>
                          <th className="p-4">Parent Name</th>
                          <th className="p-4">Child Details</th>
                          <th className="p-4">City</th>
                          {parentSubTab === 'shadow' ? (
                            <>
                              <th className="p-4">Diagnosis</th>
                              <th className="p-4">Difficulties</th>
                            </>
                          ) : parentSubTab === 'therapy' ? (
                            <>
                              <th className="p-4">Therapy Type</th>
                              <th className="p-4">Assigned Therapist</th>
                            </>
                          ) : (
                            <>
                              <th className="p-4">Tutor Type</th>
                              <th className="p-4">Subjects</th>
                            </>
                          )}
                          <th className="p-4 text-center">Placement Fee?</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/40 text-brand-dark font-medium">
                        {getFilteredParentRequests().map((r) => (
                          <tr key={r.id} className="hover:bg-brand-light/20">
                            <td className="p-4 font-bold text-secondary">{r.registration_id}</td>
                            <td className="p-4">
                              <p className="font-bold">{r.parentName || (r as any).parent_name}</p>
                              <p className="text-[10px] text-brand-muted">{r.phone} • {r.email}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-bold">{r.childName || (r as any).child_name}</p>
                              <p className="text-brand-muted text-[10px]">{(r as any).childGrade || (r as any).child_grade || 'Preschool'} • DOB: {formatDate((r as any).childDob || (r as any).child_dob)}</p>
                            </td>
                            <td className="p-4">{r.city}</td>
                            
                            {parentSubTab === 'shadow' ? (
                              <>
                                <td className="p-4 truncate max-w-[120px]">
                                  {(r as any).hasDiagnosis === 'Yes' ? (
                                    <span className="text-accent font-bold">{(r as any).diagnosis}</span>
                                  ) : (
                                    <span className="text-brand-muted">None</span>
                                  )}
                                </td>
                                <td className="p-4 max-w-[150px] truncate">{(r as any).difficulties}</td>
                              </>
                            ) : parentSubTab === 'therapy' ? (
                              <>
                                <td className="p-4 max-w-[120px] truncate font-bold text-purple-900">
                                  {(r as any).therapyType || (r as any).therapy_type || 'ABA Therapy'}
                                </td>
                                <td className="p-4 max-w-[150px] truncate font-semibold text-emerald-800">
                                  {(r as any).therapist_assigned || (r as any).therapistAssigned || 'Not Assigned'}
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="p-4 max-w-[120px] truncate">{(r as any).tutorType}</td>
                                <td className="p-4 max-w-[150px] truncate">{(r as any).subjects}</td>
                              </>
                            )}

                            <td className="p-4 text-center">
                              {(() => {
                                const isPaid = Boolean((r as any).placementPaid || (r as any).placement_paid);
                                const amount = (r as any).placementAmount || (r as any).placement_amount || ((parentSubTab === 'shadow' || parentSubTab === 'therapy') ? 5000 : 3000);
                                return (
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  }`}>
                                    {isPaid ? `Yes (₹${amount.toLocaleString()})` : 'No'}
                                  </span>
                                );
                              })()}
                            </td>

                            <td className="p-4 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(r.status)}`}>
                                {r.status}
                              </span>
                            </td>

                             <td className="p-4 text-center">
                               <div className="flex items-center justify-center gap-2">
                                 <button
                                   onClick={() => {
                                     setEditStatus(r.status);
                                     setEditNotes(r.notes || '');
                                     setEditMatchId((r as any).suggestedMatchId || '');
                                     setEditTherapistAssigned((r as any).therapist_assigned || (r as any).therapistAssigned || '');
                                     setSelectedRecord({ 
                                       type: parentSubTab === 'shadow' ? 'parent_shadow_requests' : (parentSubTab === 'therapy' ? 'parent_therapy_requests' : 'parent_tutor_requests'), 
                                       data: r 
                                     });
                                   }}
                                   className="px-3 py-1.5 border border-primary hover:bg-primary/5 text-primary rounded-xl font-bold text-[10px] transition-all cursor-pointer shadow-sm"
                                 >
                                   View Details
                                 </button>
                                 <button
                                   onClick={() => setDeleteTarget({
                                     type: parentSubTab === 'shadow' ? 'parent_shadow_requests' : (parentSubTab === 'therapy' ? 'parent_therapy_requests' : 'parent_tutor_requests'),
                                     id: r.id,
                                     name: r.parentName || (r as any).parent_name || r.registration_id || 'Parent Request',
                                     label: `Parent Request ${r.registration_id || ''} (${r.parentName || (r as any).parent_name})`
                                   })}
                                   className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg transition-all cursor-pointer"
                                   title="Delete Parent Request Permanently"
                                 >
                                   <Trash2 size={13} />
                                 </button>
                               </div>
                             </td>
                           </tr>
                         ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3C: SCHOOL COLLABORATION REQUESTS TAB */}
          {activeTab === 'schools' && (
            <div className="space-y-6 animate-fade-in-up">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-primary">School Collaboration Requests</h3>
                  <p className="text-xs text-brand-muted mt-1">Review school partner inquiries for shadow teacher classroom placements & institution programs.</p>
                </div>
                <button
                  onClick={fetchDatabase}
                  className="px-3.5 py-2 bg-brand-light hover:bg-brand-border text-primary rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  <span>Refresh Data</span>
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white border border-brand-border p-4 rounded-2xl shadow-2xs text-left">
                  <div className="flex items-center justify-between text-brand-muted text-xs font-semibold mb-1">
                    <span>Total Inquiries</span>
                    <School size={16} className="text-primary" />
                  </div>
                  <div className="text-2xl font-black text-primary font-serif">
                    {db?.school_requests?.length || 0}
                  </div>
                </div>

                <div className="bg-white border border-brand-border p-4 rounded-2xl shadow-2xs text-left">
                  <div className="flex items-center justify-between text-brand-muted text-xs font-semibold mb-1">
                    <span>Booking Fee Paid</span>
                    <CreditCard size={16} className="text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-emerald-700 font-serif">
                    {(db?.school_requests || []).filter((r: any) => r.consultationPaid || r.consultation_paid).length}
                  </div>
                </div>

                <div className="bg-white border border-brand-border p-4 rounded-2xl shadow-2xs text-left">
                  <div className="flex items-center justify-between text-brand-muted text-xs font-semibold mb-1">
                    <span>Placement Fee Paid</span>
                    <CheckCircle2 size={16} className="text-purple-600" />
                  </div>
                  <div className="text-2xl font-black text-purple-700 font-serif">
                    {(db?.school_requests || []).filter((r: any) => r.placementPaid || r.placement_paid).length}
                  </div>
                </div>

                <div className="bg-white border border-brand-border p-4 rounded-2xl shadow-2xs text-left">
                  <div className="flex items-center justify-between text-brand-muted text-xs font-semibold mb-1">
                    <span>Active Support</span>
                    <ShieldCheck size={16} className="text-secondary" />
                  </div>
                  <div className="text-2xl font-black text-secondary font-serif">
                    {(db?.school_requests || []).filter((r: any) => (r.status || '').includes('Support Started') || (r.status || '').includes('Active')).length}
                  </div>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="bg-white border border-brand-border p-4 rounded-2xl shadow-2xs space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-brand-muted" size={16} />
                    <input
                      type="text"
                      placeholder="Search by school name, contact person, email, city or reg ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-brand-border rounded-xl text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <select
                      value={filterCity}
                      onChange={(e) => setFilterCity(e.target.value)}
                      className="px-3 py-2 border border-brand-border rounded-xl text-xs font-semibold text-brand-dark bg-white focus:outline-none"
                    >
                      <option value="">All Cities</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Pune">Pune</option>
                    </select>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-brand-border rounded-xl text-xs font-semibold text-brand-dark bg-white focus:outline-none"
                    >
                      <option value="">All Statuses</option>
                      <option value="Consultation Booked">Consultation Booked</option>
                      <option value="Requirement Analysis">Requirement Analysis</option>
                      <option value="Proposal Shared">Proposal Shared</option>
                      <option value="Placement Fee Pending">Placement Fee Pending</option>
                      <option value="Placement Fee Paid">Placement Fee Paid</option>
                      <option value="Profiles Shared">Profiles Shared</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Selection Completed">Selection Completed</option>
                      <option value="Support Started">Support Started</option>
                      <option value="Closed">Closed</option>
                    </select>

                    {(searchQuery || filterCity || filterStatus) && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setFilterCity('');
                          setFilterStatus('');
                        }}
                        className="px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Table / Empty State */}
              <div className="bg-white border border-brand-border rounded-2xl shadow-2xs overflow-hidden text-left">
                {loading ? (
                  <div className="p-12 text-center text-brand-muted space-y-2">
                    <RefreshCw className="animate-spin mx-auto text-primary" size={24} />
                    <p className="text-xs font-semibold">Loading school collaboration requests...</p>
                  </div>
                ) : (() => {
                  const list = (db?.school_requests || []).filter((r: any) => {
                    const q = searchQuery.toLowerCase();
                    const matchesSearch = !q || 
                      (r.schoolName || r.school_name || '').toLowerCase().includes(q) ||
                      (r.contactName || r.contact_name || '').toLowerCase().includes(q) ||
                      (r.email || '').toLowerCase().includes(q) ||
                      (r.phone || '').includes(q) ||
                      (r.city || '').toLowerCase().includes(q) ||
                      (r.registrationId || r.registration_id || '').toLowerCase().includes(q);

                    const matchesCity = !filterCity || (r.city || '').toLowerCase().includes(filterCity.toLowerCase());
                    const matchesStatus = !filterStatus || (r.status || '').toLowerCase() === filterStatus.toLowerCase();

                    return matchesSearch && matchesCity && matchesStatus;
                  });

                  if (list.length === 0) {
                    return (
                      <div className="p-12 text-center text-brand-muted space-y-3">
                        <div className="w-16 h-16 rounded-full bg-purple-50 text-primary flex items-center justify-center mx-auto border border-purple-100 shadow-2xs">
                          <School size={28} />
                        </div>
                        <h4 className="font-serif text-lg font-bold text-primary">No School Requests Found</h4>
                        <p className="text-xs text-brand-muted max-w-md mx-auto leading-relaxed">
                          {searchQuery || filterCity || filterStatus 
                            ? "No school requests match your current search and filter criteria. Try resetting filters." 
                            : "No school partnership or collaboration requests have been submitted yet. New school submissions from the /schools portal will automatically appear here."}
                        </p>
                        {searchQuery || filterCity || filterStatus ? (
                          <button
                            onClick={() => { setSearchQuery(''); setFilterCity(''); setFilterStatus(''); }}
                            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
                          >
                            Reset Search Filters
                          </button>
                        ) : (
                          <button
                            onClick={fetchDatabase}
                            className="px-4 py-2 bg-brand-light border border-brand-border text-primary rounded-xl text-xs font-bold hover:bg-white transition-all inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw size={13} />
                            <span>Check for Updates</span>
                          </button>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-brand-light/60 border-b border-brand-border text-primary font-bold">
                            <th className="p-4">Reg ID</th>
                            <th className="p-4">School &amp; Contact Person</th>
                            <th className="p-4">Phone / Email</th>
                            <th className="p-4">City</th>
                            <th className="p-4">Teachers Needed</th>
                            <th className="p-4 text-center">Booking Fee</th>
                            <th className="p-4 text-center">Placement Fee</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border/60">
                          {list.map((r: any) => {
                            const isConsultPaid = r.consultationPaid || r.consultation_paid;
                            const isPlacePaid = r.placementPaid || r.placement_paid;
                            const statusStr = r.status || 'Consultation Booked';

                            return (
                              <tr key={r.id || r.registration_id} className="hover:bg-brand-light/30 transition-colors">
                                <td className="p-4 font-mono font-bold text-secondary whitespace-nowrap">
                                  {r.registrationId || r.registration_id}
                                </td>
                                <td className="p-4">
                                  <div className="font-bold text-primary text-sm">{r.schoolName || r.school_name}</div>
                                  <div className="text-[11px] text-brand-muted mt-0.5">
                                    {r.contactName || r.contact_name} {r.designation ? `(${r.designation})` : ''}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="font-semibold text-brand-dark">{r.phone}</div>
                                  <div className="text-[11px] text-brand-muted">{r.email}</div>
                                </td>
                                <td className="p-4 font-semibold text-brand-dark whitespace-nowrap">
                                  {r.city}
                                </td>
                                <td className="p-4">
                                  <div className="font-bold text-primary">{r.teachersCount || r.teachers_count || 1} Shadow Teacher(s)</div>
                                  <div className="text-[11px] text-brand-muted">{r.levelsRequired || r.levels_required || 'General'}</div>
                                </td>
                                <td className="p-4 text-center whitespace-nowrap">
                                  {isConsultPaid ? (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase">
                                      ₹99 Paid
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase">
                                      Pending
                                    </span>
                                  )}
                                </td>
                                <td className="p-4 text-center whitespace-nowrap">
                                  {isPlacePaid ? (
                                    <span className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-black uppercase">
                                      ₹5,000 Paid
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                                      Unpaid
                                    </span>
                                  )}
                                </td>
                                <td className="p-4 text-center whitespace-nowrap">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                                    statusStr.includes('Support Started') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                    statusStr.includes('Paid') ? 'bg-purple-50 border-purple-200 text-purple-700' :
                                    statusStr.includes('Closed') ? 'bg-slate-100 border-slate-200 text-slate-600' :
                                    'bg-amber-50 border-amber-200 text-amber-800'
                                  }`}>
                                    {statusStr}
                                  </span>
                                </td>
                                <td className="p-4 text-center whitespace-nowrap">
                                  <button
                                    onClick={() => {
                                      setSelectedRecord({
                                        type: 'school_requests',
                                        data: r
                                      });
                                      setEditStatus(r.status || 'Consultation Booked');
                                      setEditNotes(r.notes || '');
                                    }}
                                    className="px-3 py-1.5 bg-primary text-white hover:bg-primary/90 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                  >
                                    View / Edit
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>

            </div>
          )}

          {/* TAB 4B: BOOKINGS & CONSULTATIONS TAB */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-primary">Booked Parent Consultations (₹99)</h3>
                  <p className="text-xs text-brand-muted mt-1">Review booked 1-on-1 consultation requests and mark them completed after calling the parent to unlock their registration form.</p>
                </div>
              </div>

              <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center text-brand-muted">
                    <RefreshCw className="animate-spin mx-auto mb-2 text-primary" size={24} />
                    <span>Loading consultation bookings...</span>
                  </div>
                ) : (!db?.bookings || db.bookings.length === 0) ? (
                  <div className="p-12 text-center text-brand-muted">No consultation bookings logged yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-brand-light/60 border-b border-brand-border text-primary font-bold">
                          <th className="p-4">Booking ID</th>
                          <th className="p-4">Parent Name</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">City</th>
                          <th className="p-4">Service Needed</th>
                          <th className="p-4 text-center">Fee Paid</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/60">
                        {db.bookings.map((bk: any) => {
                          const msgLower = (bk.message || bk.status || '').toLowerCase();
                          const isCompleted = msgLower.includes('completed');
                          const isDeclined = msgLower.includes('declined') || msgLower.includes('rejected');
                          
                          return (
                            <tr key={bk.id || bk.bookingId || bk.booking_id} className="hover:bg-brand-light/30 transition-all">
                              <td className="p-4 font-mono font-bold text-primary">
                                {bk.bookingId || bk.booking_id}
                              </td>
                              <td className="p-4 font-bold text-brand-dark">
                                {bk.name}
                              </td>
                              <td className="p-4 text-brand-dark">
                                {bk.phone}
                              </td>
                              <td className="p-4 text-brand-dark">
                                {bk.email}
                              </td>
                              <td className="p-4 text-brand-dark">
                                {bk.city}
                              </td>
                              <td className="p-4 font-semibold text-primary">
                                {bk.requirement || 'Shadow Teacher'}
                              </td>
                              <td className="p-4 text-center">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  ₹99 Paid
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  isCompleted ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                  isDeclined ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                                  'bg-yellow-50 text-yellow-800 border border-yellow-200'
                                }`}>
                                  {isCompleted ? 'Consultation Completed' : isDeclined ? 'Consultation Declined' : 'Consultation Booked (Call Pending)'}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  {isCompleted ? (
                                    <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                                      <CheckCircle size={12} /> Form Unlocked
                                    </span>
                                  ) : isDeclined ? (
                                    <span className="text-[10px] font-bold text-amber-700 flex items-center justify-center gap-1">
                                      <XCircle size={12} /> Declined
                                    </span>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => handleMarkConsultationCompleted(bk)}
                                        disabled={updating}
                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[10px] transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-1"
                                        title="Mark Consultation Completed (Unlocks Form)"
                                      >
                                        <CheckCircle size={12} /> Mark Completed
                                      </button>
                                      <button
                                        onClick={() => {
                                          setRejectModalBooking(bk);
                                          setRejectReason('');
                                        }}
                                        disabled={updating}
                                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-[10px] transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-1"
                                        title="Reject / Decline Consultation"
                                      >
                                        <XCircle size={12} /> Decline
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => setDeleteTarget({
                                      type: 'bookings',
                                      id: bk.id,
                                      name: bk.bookingId || bk.booking_id || 'Booking',
                                      label: `Booking ${bk.bookingId || bk.booking_id} (${bk.name})`
                                    })}
                                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg transition-all cursor-pointer"
                                    title="Delete Booking Record Permanently"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PAYMENTS LEDGER */}
          {activeTab === 'payments' && (() => {
            const realRevenueTotal = paymentsList
              .filter(p => !p.isWaived && p.status === 'SUCCESS')
              .reduce((sum, p) => sum + (p.numericAmount || 0), 0);

            const totalWaivedCount = paymentsList.filter(p => p.isWaived).length;
            const totalWaivedValue = paymentsList.filter(p => p.isWaived).reduce((sum, p) => sum + (p.originalFee || 99), 0);
            const realPaymentsCount = paymentsList.filter(p => !p.isWaived && p.status === 'SUCCESS').length;

            return (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl font-black text-primary">Payments Ledger</h2>
                    <p className="text-xs text-brand-muted mt-0.5">Real-time ledger of Razorpay collections and outreach waivers.</p>
                  </div>
                </div>

                {/* 3 STATS SUMMARY CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 shadow-sm text-left relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">Real Revenue Collected</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-3xl font-black text-emerald-950 mt-2">₹{realRevenueTotal.toLocaleString()}</p>
                    <p className="text-[11px] text-emerald-800 font-bold mt-1">
                      {realPaymentsCount} Successful Razorpay {realPaymentsCount === 1 ? 'Payment' : 'Payments'}
                    </p>
                  </div>

                    <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-5 shadow-sm text-left relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-purple-800 uppercase tracking-wider">Total Waived (Promo / Outreach)</span>
                        <Sparkles size={16} className="text-purple-600" />
                      </div>
                      <p className="text-3xl font-black text-purple-950 mt-2">{totalWaivedCount} <span className="text-sm font-semibold text-purple-800">Records</span></p>
                      <p className="text-[11px] text-purple-800 font-bold mt-1">
                        ₹{totalWaivedValue.toLocaleString()} Value Waived (SHADOW100 / THERAPY99)
                      </p>
                    </div>

                  <div className="bg-brand-light/60 border border-brand-border rounded-2xl p-5 shadow-sm text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-brand-muted uppercase tracking-wider">Total Ledger Activity</span>
                    </div>
                    <p className="text-3xl font-black text-primary mt-2">{paymentsList.length} <span className="text-sm font-semibold text-brand-muted">Entries</span></p>
                    <p className="text-[11px] text-brand-muted font-bold mt-1">
                      {realPaymentsCount} Real + {totalWaivedCount} Waived
                    </p>
                  </div>
                </div>

                {/* Test Mode warning banner */}
                {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_test') && (
                  <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-center gap-3 text-xs font-bold text-left shadow-sm">
                    <AlertCircle size={20} className="text-amber-600 flex-shrink-0 animate-pulse" />
                    <div>
                      <p className="font-bold text-amber-900 text-sm">TEST MODE — Razorpay Sandbox Credentials Active</p>
                      <p className="font-medium text-amber-700 text-xs mt-0.5">
                        Card details, payment receipts, and signatures are validated for development and testing.
                      </p>
                    </div>
                  </div>
                )}

                {/* Payments Table */}
                <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
                  {loading ? (
                    <div className="p-12 text-center text-brand-muted">
                      <RefreshCw className="animate-spin mx-auto mb-2 text-primary" size={24} />
                      <span>Loading transactions ledger...</span>
                    </div>
                  ) : paymentsList.length === 0 ? (
                    <div className="p-12 text-center text-brand-muted">No successful transactions found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-brand-light/60 border-b border-brand-border text-primary font-bold">
                            <th className="p-4">Transaction Date</th>
                            <th className="p-4">Registration ID</th>
                            <th className="p-4">Parent Name</th>
                            <th className="p-4">Child Name</th>
                            <th className="p-4">Booking Type</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Razorpay Payment ID</th>
                            <th className="p-4">Razorpay Order ID</th>
                            <th className="p-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border/40 text-brand-dark font-medium">
                          {paymentsList.map((p) => (
                            <tr key={p.id} className={p.isWaived ? 'bg-purple-50/20 hover:bg-purple-50/40' : 'hover:bg-brand-light/20'}>
                              <td className="p-4 text-brand-muted">{formatDate(p.date)}</td>
                              <td className="p-4 font-bold text-secondary">{p.regId}</td>
                              <td className="p-4">
                                <p className="font-bold">{p.parentName}</p>
                                <p className="text-[10px] text-brand-muted">{p.phone} • {p.email}</p>
                              </td>
                              <td className="p-4 font-bold">{p.childName}</td>
                              <td className="p-4">
                                <span className="px-2 py-0.5 bg-brand-light border border-brand-border rounded-md text-[10px] font-bold text-primary uppercase">
                                  {p.type}
                                </span>
                              </td>
                              <td className="p-4 font-extrabold text-brand-dark">
                                {p.isWaived ? (
                                  <span className="text-purple-700 font-extrabold bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200">
                                    ₹0 (Waived)
                                  </span>
                                ) : (
                                  <span className="text-emerald-700 font-extrabold">
                                    {p.amount}
                                  </span>
                                )}
                              </td>
                              <td className="p-4 font-mono text-[10px] text-brand-muted">{p.paymentId}</td>
                              <td className="p-4 font-mono text-[10px] text-brand-muted">{p.orderId}</td>
                              <td className="p-4 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase flex items-center justify-center gap-1.5 w-fit mx-auto ${
                                  p.isWaived 
                                    ? 'bg-purple-100 text-purple-900 border border-purple-300 shadow-xs' 
                                    : p.isRealSuccess
                                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs'
                                      : 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                                }`}>
                                  {p.isWaived ? (
                                    <Sparkles size={11} className="text-purple-700 shrink-0" />
                                  ) : p.isRealSuccess ? (
                                    <CheckCircle size={11} className="text-emerald-700 shrink-0" />
                                  ) : (
                                    <AlertCircle size={11} className="text-amber-700 shrink-0" />
                                  )}
                                  <span>{p.status}</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* TAB: NOTIFICATIONS LOG */}
          {activeTab === 'notifications' && (
            <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left animate-fade-in-up">
              <div className="flex justify-between items-center flex-wrap gap-4 border-b border-brand-border pb-4">
                <div className="text-left">
                  <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
                    <Mail className="text-secondary" size={20} />
                    Automated Notifications Log
                  </h3>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                    View real-time email dispatch logs generated via Resend API integrations.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const token = localStorage.getItem('admin_token') || '';
                      const res = await fetch('/api/admin/records', {
                        headers: {
                          'Authorization': `Bearer ${token}`
                        }
                      });
                      const data = await res.json();
                      if (data.notifications) {
                        setDb(prev => ({
                          ...prev!,
                          notifications: data.notifications
                        }));
                      }
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="px-4 py-2 border border-brand-border text-xs text-brand-muted hover:text-primary hover:bg-brand-light rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                  Refresh Logs
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-brand-border">
                {(!db?.notifications || db.notifications.length === 0) ? (
                  <div className="p-12 text-center text-brand-muted">No notifications logged yet.</div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-brand-light border-b border-brand-border font-bold text-brand-dark uppercase tracking-wider text-[10px]">
                        <th className="p-4">Recipient</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Subject</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Log Details / Error</th>
                        <th className="p-4">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border font-medium text-brand-dark font-mono">
                      {db.notifications.map((notif: any) => {
                        const isSent = notif.status === 'sent';
                        return (
                          <tr key={notif.id} className="hover:bg-brand-light/30 transition-colors">
                            <td className="p-4 font-bold font-sans">{notif.recipient}</td>
                            <td className="p-4 font-sans">
                              <span className="px-2 py-0.5 bg-brand-light text-primary border border-brand-border/60 rounded-full text-[9px] font-bold uppercase">
                                {notif.type}
                              </span>
                            </td>
                            <td className="p-4 font-serif text-brand-dark">{notif.subject}</td>
                            <td className="p-4 font-sans">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase inline-flex items-center gap-1 ${
                                isSent 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                {isSent ? 'Sent' : 'Failed'}
                              </span>
                            </td>
                            <td className="p-4 max-w-xs truncate text-[11px] text-brand-muted font-sans">
                              {notif.errorMessage || '-'}
                            </td>
                            <td className="p-4 text-brand-muted font-sans">
                              {formatDateTime(notif.createdAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS PLACEHOLDER */}
          {/* TAB 10: SETTINGS & SYSTEM STATUS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-black text-primary">System Overview &amp; Settings</h2>
                  <p className="text-xs text-brand-muted mt-1 font-medium">
                    Read-only status overview of active integrations, business parameters, and system environment.
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0">
                  <ShieldCheck size={14} /> System Operational
                </div>
              </div>

              {/* Status Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Card 1: Connected Services & Integrations */}
                <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b border-brand-border/60 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="font-serif text-sm font-bold text-primary">Connected Integrations</h3>
                      <p className="text-[10px] text-brand-muted font-medium">External APIs and database engines</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-brand-light/40 rounded-xl border border-brand-border/40 gap-2">
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="font-bold text-brand-dark">Database Engine</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 truncate">
                        Supabase PostgreSQL (Active)
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-brand-light/40 rounded-xl border border-brand-border/40 gap-2">
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="font-bold text-brand-dark">Email Dispatcher</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 truncate">
                        Resend API (Live Alerts)
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-brand-light/40 rounded-xl border border-brand-border/40 gap-2">
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="font-bold text-brand-dark">Payment Gateway</span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 truncate">
                        Razorpay API (₹99 &amp; Placement)
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-brand-light/40 rounded-xl border border-brand-border/40 gap-1.5">
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="font-bold text-brand-dark">Admin Notification Email</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 truncate">
                        theshadowbridgesupport@gmail.com
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Operating Parameters & Pricing */}
                <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b border-brand-border/60 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-primary font-bold shrink-0">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h3 className="font-serif text-sm font-bold text-primary">Business &amp; Fee Parameters</h3>
                      <p className="text-[10px] text-brand-muted font-medium">Standard fees and coverage rules</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-brand-light/40 rounded-xl border border-brand-border/40">
                      <span className="font-bold text-brand-dark">Consultation Booking Fee</span>
                      <span className="font-black text-primary">₹99</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-brand-light/40 rounded-xl border border-brand-border/40">
                      <span className="font-bold text-brand-dark">Shadow Teacher Placement Fee</span>
                      <span className="font-black text-primary">₹5,000</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-brand-light/40 rounded-xl border border-brand-border/40">
                      <span className="font-bold text-brand-dark">Home Tutor Placement Fee</span>
                      <span className="font-black text-primary">₹3,000</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-brand-light/40 rounded-xl border border-brand-border/40 gap-1.5">
                      <span className="font-bold text-brand-dark">Active Cities (5)</span>
                      <span className="text-[10px] font-bold text-primary">
                        Delhi NCR, Ahmedabad, Hyderabad, Bangalore, Pune
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Environment Security Note */}
              <div className="p-4 bg-brand-light/50 border border-brand-border rounded-2xl text-xs text-brand-dark flex items-start gap-3">
                <Info size={16} className="text-secondary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-primary">Environment-Controlled Configuration</p>
                  <p className="text-brand-muted text-[11px] leading-relaxed">
                    API secret keys, database credentials, and production settings are securely managed via environment variables. To update credentials or notification channels, update environment variables in your Vercel deployment project settings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CONTACT MESSAGES */}
          {activeTab === 'contacts' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-black text-primary">Contact Messages &amp; Inquiries</h2>
                  <p className="text-xs text-brand-muted mt-1 font-medium">
                    View and manage all inquiry messages submitted via the website contact form.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                    Total: {db?.contacts?.length || 0}
                  </span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                    New: {db?.contacts?.filter(c => !c.status || c.status === 'new').length || 0}
                  </span>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white p-4 border border-brand-border rounded-2xl shadow-sm flex flex-wrap gap-4 items-center justify-between">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-2.5 text-brand-muted" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, phone, city or message..."
                    className="w-full pl-9 pr-3 py-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-brand-muted uppercase font-bold flex items-center gap-1">
                      <Filter size={10} /> City
                    </span>
                    <select
                      value={filterCity}
                      onChange={(e) => setFilterCity(e.target.value)}
                      className="p-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"
                    >
                      <option value="">All Cities</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Bangalore">Bangalore</option>
                    <option value="Pune">Pune</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-brand-muted uppercase font-bold flex items-center gap-1">
                      <Filter size={10} /> Status
                    </span>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="p-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"
                    >
                      <option value="">All Statuses</option>
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="responded">Responded</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center text-brand-muted">
                    <RefreshCw className="animate-spin mx-auto mb-2 text-primary" size={24} />
                    <span>Loading contact messages...</span>
                  </div>
                ) : (db?.contacts || []).length === 0 ? (
                  <div className="p-12 text-center text-brand-muted">No contact messages received yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-brand-light/60 border-b border-brand-border text-primary font-bold">
                          <th className="p-4">Submitted Date</th>
                          <th className="p-4">Sender &amp; Location</th>
                          <th className="p-4">Contact Info</th>
                          <th className="p-4">Message</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/60">
                        {(db?.contacts || [])
                          .filter((c: any) => {
                            const q = searchQuery.toLowerCase();
                            const matchesQuery = !q || (
                              c.name?.toLowerCase().includes(q) ||
                              c.email?.toLowerCase().includes(q) ||
                              c.phone?.includes(q) ||
                              c.city?.toLowerCase().includes(q) ||
                              c.message?.toLowerCase().includes(q)
                            );
                            const matchesCity = !filterCity || c.city === filterCity;
                            const matchesStatus = !filterStatus || (c.status || 'new') === filterStatus;
                            return matchesQuery && matchesCity && matchesStatus;
                          })
                          .map((contact: any) => {
                            const dateStr = contact.created_at || contact.createdAt;
                            const status = contact.status || 'new';

                            return (
                              <tr key={contact.id} className="hover:bg-brand-light/20 transition-colors">
                                <td className="p-4 text-brand-muted font-medium whitespace-nowrap">
                                  {dateStr ? new Date(dateStr).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                  }) : 'N/A'}
                                </td>
                                <td className="p-4">
                                  <div className="font-bold text-primary text-sm">{contact.name}</div>
                                  <div className="text-brand-muted text-[11px] font-semibold">{contact.city}</div>
                                </td>
                                <td className="p-4 space-y-0.5">
                                  <div className="font-semibold text-brand-dark">{contact.phone}</div>
                                  <div className="text-primary hover:underline">{contact.email}</div>
                                </td>
                                <td className="p-4 max-w-md">
                                  <p className="text-brand-dark text-xs leading-relaxed whitespace-pre-wrap">
                                    {contact.message}
                                  </p>

                                  {(contact.adminReply || contact.admin_reply) && (
                                    <div className="mt-3 p-3 bg-emerald-50/90 border border-emerald-200/90 rounded-xl text-left shadow-sm">
                                      <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-emerald-900 mb-1">
                                        <span className="flex items-center gap-1.5">
                                          <MailCheck size={13} className="text-emerald-700" />
                                          <span>Admin Response Sent</span>
                                        </span>
                                        <span className="text-emerald-800/80 text-[10px] font-medium">
                                          {contact.repliedAt || contact.replied_at
                                            ? new Date(contact.repliedAt || contact.replied_at).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                              })
                                            : ''}
                                        </span>
                                      </div>
                                      <p className="text-emerald-950 text-xs leading-relaxed whitespace-pre-wrap font-medium">
                                        {contact.adminReply || contact.admin_reply}
                                      </p>
                                    </div>
                                  )}
                                </td>
                                <td className="p-4">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                    status === 'new' 
                                      ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                      : status === 'responded'
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                                  }`}>
                                    {status}
                                  </span>
                                </td>
                                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                  <button
                                    onClick={() => {
                                      setReplyModalContact(contact);
                                      setReplyMessageText('');
                                    }}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm"
                                  >
                                    <Reply size={13} />
                                    <span>{(contact.adminReply || contact.admin_reply) ? 'Reply Again' : 'Reply'}</span>
                                  </button>
                                  {status === 'new' && (
                                    <button
                                      onClick={() => handleQuickContactStatus(contact.id, 'read')}
                                      className="px-2.5 py-1.5 border border-brand-border bg-white hover:bg-brand-light text-brand-dark rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm"
                                    >
                                      Mark Read
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setDeleteTarget({ type: 'contacts', id: contact.id, name: contact.name, label: 'Contact Message' })}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm"
                                    title="Permanently Delete Message"
                                  >
                                    <Trash2 size={13} />
                                    <span>Delete</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: PARENT REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fade-in-up text-left">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
                    <Star className="text-accent fill-accent animate-pulse" size={22} />
                    Parent Reviews Moderation
                  </h2>
                  <p className="text-xs text-brand-muted font-medium">
                    Approve, reject, or edit parental reviews before they are published publicly on the website.
                  </p>
                </div>
                <button
                  onClick={fetchReviews}
                  disabled={loadingReviews}
                  className="flex items-center gap-1.5 px-4 py-2 border border-brand-border bg-white text-primary rounded-xl text-xs font-bold hover:bg-brand-light transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={14} className={loadingReviews ? 'animate-spin' : ''} />
                  Reload Reviews
                </button>
              </div>

              {loadingReviews ? (
                <div className="bg-white border border-brand-border rounded-3xl p-12 text-center shadow-sm">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-xs text-brand-muted uppercase font-bold tracking-wider">Fetching Reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-white border border-brand-border rounded-3xl p-12 text-center shadow-sm space-y-4">
                  <div className="w-14 h-14 bg-brand-light rounded-full flex items-center justify-center mx-auto text-brand-muted border border-brand-border/60">
                    <Star size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif text-base font-bold text-primary">No Reviews Logged</h4>
                    <p className="text-xs text-brand-muted max-w-sm mx-auto leading-relaxed">
                      Parents whose placement status is "Support Started" or "Active" will be able to submit their experience reviews here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-brand-border rounded-3xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-brand-light/60 border-b border-brand-border text-[10px] text-brand-muted uppercase font-bold tracking-wider">
                          <th className="p-4">Submitted Date</th>
                          <th className="p-4">Parent / ID</th>
                          <th className="p-4">Service & City</th>
                          <th className="p-4">Rating</th>
                          <th className="p-4">Review Text</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/60 text-xs font-medium text-brand-dark">
                        {reviews.map((rev) => {
                          const ratingStars = Array(5).fill(0).map((_, i) => (
                            <Star key={i} size={14} fill={i < rev.rating ? 'currentColor' : 'none'} className="text-amber-400" />
                          ));

                          return (
                            <tr key={rev.id} className="hover:bg-brand-light/20 transition-colors">
                              <td className="p-4 whitespace-nowrap text-brand-muted">
                                {new Date(rev.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="p-4">
                                <div className="font-bold text-primary">{rev.parent_name}</div>
                                <div className="text-[10px] text-brand-muted font-mono">{rev.parent_registration_id}</div>
                              </td>
                              <td className="p-4">
                                <div className="font-bold text-primary">{rev.service_type}</div>
                                <div className="text-[10px] text-brand-muted font-semibold">{rev.city}</div>
                              </td>
                              <td className="p-4">
                                <div className="flex gap-0.5">{ratingStars}</div>
                              </td>
                              <td className="p-4 max-w-sm">
                                <p className="leading-relaxed font-sans font-normal italic text-brand-muted line-clamp-3 hover:line-clamp-none transition-all duration-300">
                                  "{rev.review_text}"
                                </p>
                                {rev.child_first_name && (
                                  <div className="text-[10px] text-accent font-bold mt-1 uppercase tracking-wider">
                                    Child Display Name: {rev.child_first_name}
                                  </div>
                                )}
                              </td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block border ${
                                  rev.status === 'approved'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : rev.status === 'rejected'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {rev.status}
                                </span>
                                {rev.status === 'rejected' && rev.rejection_note && (
                                  <p className="text-[9px] text-rose-600 mt-1 italic leading-tight">
                                    Note: {rev.rejection_note}
                                  </p>
                                )}
                              </td>
                              <td className="p-4 text-right whitespace-nowrap">
                                <div className="flex justify-end items-center gap-2">
                                  {rev.status !== 'approved' && (
                                    <button
                                      onClick={() => handleReviewAction(rev.id, 'approve')}
                                      className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition-all cursor-pointer shadow-sm"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      setModeratingReviewId(rev.id);
                                      setReviewEditText(rev.review_text);
                                      setIsEditingReview(true);
                                    }}
                                    className="px-2.5 py-1.5 border border-brand-border bg-white text-primary rounded-lg text-[10px] font-bold hover:bg-brand-light transition-all cursor-pointer shadow-sm"
                                  >
                                    Edit Typos
                                  </button>
                                  {rev.status !== 'rejected' && (
                                    <button
                                      onClick={() => {
                                        setModeratingReviewId(rev.id);
                                        setIsRejectingReview(true);
                                      }}
                                      className="px-2.5 py-1.5 bg-rose-600 text-white rounded-lg text-[10px] font-bold hover:bg-rose-700 transition-all cursor-pointer shadow-sm"
                                    >
                                      Reject
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setDeleteTarget({
                                      type: 'reviews',
                                      id: rev.id,
                                      name: rev.parent_name || rev.parent_registration_id || 'Review',
                                      label: `Review by ${rev.parent_name} (${rev.parent_registration_id})`
                                    })}
                                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg transition-all cursor-pointer"
                                    title="Delete Review Permanently"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* 3. DETAILS MODAL / SIDE DRAWER (Overlays the right side) */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecord(null)}
              className="absolute inset-0 bg-black cursor-pointer"
            ></motion.div>

            {/* Modal Box */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between z-10 border-l border-brand-border"
            >
              
              {/* Modal Header */}
              <div className="p-6 border-b border-brand-border/60 bg-brand-light/20 flex justify-between items-center shrink-0">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                    {selectedRecord.type.replace('_', ' ').replace('parent ', 'Parent ')} Details
                  </span>
                  <h3 className="font-serif text-xl font-black text-primary">
                    {selectedRecord.data.parentName || selectedRecord.data.name}
                  </h3>
                  <p className="text-xs text-brand-muted font-bold">
                    Registration ID: <span className="text-secondary">{selectedRecord.data.registration_id}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 hover:bg-brand-light rounded-lg text-brand-muted hover:text-brand-dark cursor-pointer transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content Scrollable Area */}
              <div className="flex-grow p-6 overflow-y-auto space-y-6 text-xs text-brand-dark">
                
                {/* Form Fields Data Grid */}
                <div className="space-y-4">
                  <h4 className="font-serif text-sm font-bold text-primary border-b border-brand-border pb-1">Registration Fields</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    
                    {/* Common Fields */}
                    <div><strong>Email:</strong> {selectedRecord.data.email}</div>
                    <div><strong>Mobile Number:</strong> {selectedRecord.data.phone}</div>
                    <div><strong>Location City:</strong> {selectedRecord.data.city}</div>
                    
                    {/* Tutors / Shadows specific */}
                    {(selectedRecord.type === 'tutors' || selectedRecord.type === 'shadow_teachers') && (
                      <>
                        <div><strong>Gender:</strong> {selectedRecord.data.gender}</div>
                        <div><strong>Date of Birth:</strong> {formatDate(selectedRecord.data.dob)}</div>
                        <div className="col-span-2"><strong>Address:</strong> {selectedRecord.data.address || 'Not Provided'}</div>
                        <div className="col-span-2"><strong>Highest Qualification:</strong> {selectedRecord.data.qualification}</div>
                        {selectedRecord.data.specialization && <div className="col-span-2"><strong>Specialization:</strong> {selectedRecord.data.specialization}</div>}
                        <div><strong>Prior Experience:</strong> {selectedRecord.data.experience}</div>
                        {selectedRecord.data.certificates && <div className="col-span-2"><strong>Relevant Certificates:</strong> {selectedRecord.data.certificates}</div>}
                      </>
                    )}

                    {/* Tutor Specific */}
                    {selectedRecord.type === 'tutors' && (
                      <>
                        <div className="col-span-2"><strong>Subjects Comfortable:</strong> {selectedRecord.data.subjects}</div>
                        <div className="col-span-2"><strong>Grades Comfortable:</strong> {selectedRecord.data.grades}</div>
                        <div><strong>Expected Monthly Salary:</strong> {selectedRecord.data.expectedSalary || 'Not specified'}</div>
                        <div><strong>Mode of Teaching:</strong> {selectedRecord.data.mode}</div>
                      </>
                    )}

                    {/* Shadow Specific */}
                    {selectedRecord.type === 'shadow_teachers' && (
                      <>
                        <div className="col-span-2"><strong>Preferred Work Locations:</strong> {selectedRecord.data.preferredLocations}</div>
                        <div><strong>Special Needs Experience:</strong> {selectedRecord.data.specialNeedsExp}</div>
                        <div><strong>Travel Adaptability:</strong> {selectedRecord.data.openToTravel}</div>
                        <div><strong>Work Commitment:</strong> {selectedRecord.data.preferredWorkType}</div>
                        <div className="col-span-2"><strong>Comfortable Autism/ADHD Areas:</strong> {selectedRecord.data.comfortableAreas}</div>
                        {selectedRecord.data.otherComfortable && <div className="col-span-2"><strong>Other Comfort areas:</strong> {selectedRecord.data.otherComfortable}</div>}
                      </>
                    )}

                    {/* Parents request specific (Both Shadow & Tutor request) */}
                    {(selectedRecord.type === 'parent_shadow_requests' || selectedRecord.type === 'parent_tutor_requests') && (
                      <>
                        <div><strong>Relationship to Child:</strong> {selectedRecord.data.relationship}</div>
                        <div><strong>Child's Name:</strong> {selectedRecord.data.childName}</div>
                        <div><strong>Child DOB:</strong> {formatDate(selectedRecord.data.childDob)}</div>
                        <div><strong>Child Gender:</strong> {selectedRecord.data.childGender}</div>
                        <div><strong>Grade / Class:</strong> {selectedRecord.data.childGrade}</div>
                        <div className="col-span-2"><strong>Home Location Address:</strong> {selectedRecord.data.homeLocation}</div>
                      </>
                    )}

                    {/* Parent Shadow Requests specific */}
                    {selectedRecord.type === 'parent_shadow_requests' && (
                      <>
                        <div className="col-span-2"><strong>School Location Address:</strong> {selectedRecord.data.schoolLocation}</div>
                        <div><strong>Has Diagnosis?</strong> {selectedRecord.data.hasDiagnosis}</div>
                        {selectedRecord.data.hasDiagnosis === 'Yes' && <div><strong>Diagnosis:</strong> {selectedRecord.data.diagnosis}</div>}
                        <div className="col-span-2"><strong>Difficulties:</strong> {selectedRecord.data.difficulties}</div>
                        {(selectedRecord.data.difficulties ?? '').includes('Others') && <div className="col-span-2"><strong>Other difficulty notes:</strong> {selectedRecord.data.otherDifficulty}</div>}
                        <div><strong>Takes Therapy?</strong> {selectedRecord.data.takesTherapy}</div>
                        {selectedRecord.data.takesTherapy === 'Yes' && <div className="col-span-2"><strong>Therapies:</strong> {selectedRecord.data.therapies}</div>}
                        {(selectedRecord.data.therapies ?? '').includes('Others') && <div className="col-span-2"><strong>Other therapies:</strong> {selectedRecord.data.otherTherapy}</div>}
                      </>
                    )}

                    {/* Parent Tutor Requests specific */}
                    {selectedRecord.type === 'parent_tutor_requests' && (
                      <>
                        <div className="col-span-2"><strong>Tutoring Help:</strong> {selectedRecord.data.tutorType}</div>
                        {selectedRecord.data.tutorType === 'Other' && <div className="col-span-2"><strong>Tutoring Details:</strong> {selectedRecord.data.otherTutorType}</div>}
                        <div className="col-span-2"><strong>Subjects Needed:</strong> {selectedRecord.data.subjects}</div>
                      </>
                    )}

                    {/* School Requests specific */}
                    {selectedRecord.type === 'school_requests' && (
                      <>
                        <div className="col-span-2"><strong>School Name:</strong> {selectedRecord.data.schoolName || selectedRecord.data.school_name}</div>
                        <div><strong>Contact Person:</strong> {selectedRecord.data.contactName || selectedRecord.data.contact_name}</div>
                        <div><strong>Designation:</strong> {selectedRecord.data.designation || 'Not Specified'}</div>
                        <div className="col-span-2"><strong>Preferred Location:</strong> {selectedRecord.data.preferredLocation || selectedRecord.data.preferred_location}</div>
                        <div className="col-span-2"><strong>Levels Required:</strong> {selectedRecord.data.levelsRequired || selectedRecord.data.levels_required}</div>
                        <div className="col-span-2"><strong>Specific Grades:</strong> {selectedRecord.data.specificGrades || selectedRecord.data.specific_grades}</div>
                        <div><strong>Shadow Teachers Needed:</strong> {selectedRecord.data.teachersCount || selectedRecord.data.teachers_count || 1}</div>
                        <div><strong>Expected Start Date:</strong> {selectedRecord.data.startDate || selectedRecord.data.start_date || 'ASAP'}</div>
                      </>
                    )}

                  </div>
                </div>



                {/* Commission & Placement Details Section (Shadow Teachers Only) */}
                {selectedRecord.type === 'shadow_teachers' && (() => {
                  const comm = selectedRecord.data.commission;
                  const hasComm = !!comm;

                  return (
                    <div className="space-y-3 p-4 sm:p-5 bg-purple-50/50 border border-purple-200/80 rounded-2xl">
                      <div className="flex justify-between items-center">
                        <h4 className="font-serif text-sm font-bold text-primary flex items-center gap-1.5">
                          <BadgePercent size={16} className="text-secondary" />
                          Placement Commission &amp; Payment Schedule
                        </h4>
                        <button
                          type="button"
                          onClick={() => openCommissionWizard(selectedRecord.data)}
                          className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1"
                        >
                          {hasComm ? <Settings size={12} /> : <PlusCircle size={12} />}
                          <span>{hasComm ? 'Edit Terms' : 'Add Commission'}</span>
                        </button>
                      </div>

                      {hasComm ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white p-3 rounded-xl border border-purple-100">
                            <div>
                              <span className="text-[10px] text-brand-muted uppercase font-bold block">Monthly Salary</span>
                              <span className="font-bold text-brand-dark">₹{comm.monthlySalary?.toLocaleString('en-IN')}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-brand-muted uppercase font-bold block">Commission Rate</span>
                              <span className="font-bold text-brand-dark">{comm.commissionPercentage}%</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-brand-muted uppercase font-bold block">Total Commission</span>
                              <span className="font-bold text-primary">₹{comm.totalCommission?.toLocaleString('en-IN')}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-brand-muted uppercase font-bold block">Balance Pending</span>
                              <span className={`font-bold ${comm.totalPending > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                                ₹{comm.totalPending?.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          {/* Installments List */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Installments ({comm.installments?.length || 0})</span>
                            <div className="space-y-1.5">
                              {(comm.installments || []).map((inst: any) => {
                                const isOverdue = inst.status !== 'Paid' && inst.dueDate && inst.dueDate < new Date().toISOString().split('T')[0];
                                const effectiveStatus = isOverdue ? 'Overdue' : inst.status;

                                return (
                                  <div key={inst.id} className="flex items-center justify-between p-2.5 bg-white border border-brand-border/80 rounded-xl text-xs">
                                    <div className="space-y-0.5">
                                      <div className="font-bold text-brand-dark">
                                        Inst #{inst.installmentNumber} • {inst.month}
                                      </div>
                                      <div className="text-[10px] text-brand-muted">
                                        Due: {inst.dueDate ? new Date(inst.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <div className="text-right">
                                        <div className="font-bold text-primary">₹{inst.amount.toLocaleString('en-IN')}</div>
                                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                                          effectiveStatus === 'Paid'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : (effectiveStatus === 'Partially Paid'
                                                ? 'bg-blue-50 text-blue-700'
                                                : (effectiveStatus === 'Overdue' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'))
                                        }`}>
                                          {effectiveStatus}
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => openPaymentLogger(selectedRecord.data, inst)}
                                        className="px-2.5 py-1 bg-brand-light hover:bg-brand-light/80 text-primary font-bold text-[11px] rounded-lg border border-brand-border cursor-pointer transition-colors"
                                      >
                                        Update
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white p-4 rounded-xl border border-dashed border-purple-200 text-center space-y-2">
                          <p className="text-xs text-brand-muted">
                            No placement commission details configured yet for {selectedRecord.data.name}.
                          </p>
                          <button
                            type="button"
                            onClick={() => openCommissionWizard(selectedRecord.data)}
                            className="px-4 py-2 bg-accent hover:bg-accent/90 text-primary font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <PlusCircle size={14} />
                            Add Commission Details
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Matchmaking Section (Parent Requests Only) */}
                {(selectedRecord.type === 'parent_shadow_requests' || selectedRecord.type === 'parent_tutor_requests') && (
                  <div className="space-y-3 p-4 bg-brand-light/30 border border-brand-border rounded-2xl">
                    <h4 className="font-serif text-xs font-bold text-primary flex items-center gap-1.5">
                      <Sparkles size={14} className="text-secondary" />
                      Suggested Candidate Matches
                    </h4>
                    
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-brand-muted uppercase font-bold">Select Candidate Match Proposal</span>
                      <select
                        value={editMatchId}
                        onChange={(e) => setEditMatchId(e.target.value)}
                        className="p-2.5 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"
                      >
                        <option value="">No Match Proposed</option>
                        {selectedRecord.type === 'parent_shadow_requests' ? (
                          // List Shadow Teachers
                          (db?.shadow_teachers || []).map((t: ShadowTeacherRecord) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.experience} Experience • Status: {t.status})
                            </option>
                          ))
                        ) : (
                          // List Tutors
                          (db?.tutors || []).map((t: TutorRecord) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.experience} Experience • Status: {t.status})
                            </option>
                          ))
                        )}
                      </select>
                      {editMatchId && (
                        <div className="space-y-1.5 mt-2">
                          <button
                            type="button"
                            onClick={() => handleConfirmMatchAndRequestPayment(editMatchId)}
                            disabled={updating}
                            className="btn-gradient w-full py-2.5 rounded-xl text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center text-white"
                          >
                            {updating ? 'Processing Proposal...' : 'Confirm Match & Request Placement Payment'}
                          </button>
                          <p className="text-[9px] text-emerald-600 font-bold">
                            *Confirming this match proposals will update request status to 'Match Proposed' and requests placement onboarding fees of ₹5,000 / ₹3,000 on the parent dashboard.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Status Update Form (Footer of Modal) */}
              <form onSubmit={handleUpdateRecord} className="p-6 border-t border-brand-border bg-brand-light/20 space-y-4 shrink-0 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider">Update Current Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="p-2.5 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none font-bold"
                    >
                      {/* Statuses for Tutor/Shadow */}
                      {(selectedRecord.type === 'tutors' || selectedRecord.type === 'shadow_teachers') && (
                        <>
                          <option value="Interview Awaiting">Interview Awaiting</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Onboarding">Onboarding</option>
                          <option value="Active">Active</option>
                          <option value="Rejected">Rejected</option>
                        </>
                      )}
                      
                      {/* Statuses for Parent requests */}
                      {(selectedRecord.type === 'parent_shadow_requests' || selectedRecord.type === 'parent_tutor_requests') && (
                        <>
                          <option value="Consultation Scheduled">Consultation Scheduled</option>
                          <option value="Requirement Analysis">Requirement Analysis</option>
                          <option value="Match Proposed">Match Proposed</option>
                          <option value="Introduction Call">Introduction Call</option>
                          <option value="Support Started">Support Started</option>
                          <option value="Closed">Closed</option>
                        </>
                      )}

                      {/* Statuses for Therapy requests */}
                      {selectedRecord.type === 'parent_therapy_requests' && (
                        <>
                          <option value="Consultation Booked">Consultation Booked</option>
                          <option value="Consultation Completed">Consultation Completed</option>
                          <option value="Registration Form Submitted">Registration Form Submitted</option>
                          <option value="Placement Fee Paid">Placement Fee Paid</option>
                          <option value="Matching in Progress">Matching in Progress</option>
                          <option value="Therapist Assigned">Therapist Assigned</option>
                          <option value="Home Sessions Begin">Home Sessions Begin</option>
                          <option value="Closed">Closed</option>
                        </>
                      )}

                      {/* Statuses for School requests */}
                      {selectedRecord.type === 'school_requests' && (
                        <>
                          <option value="Consultation Booked">Consultation Booked</option>
                          <option value="Requirement Analysis">Requirement Analysis</option>
                          <option value="Proposal Shared">Proposal Shared</option>
                          <option value="Placement Fee Pending">Placement Fee Pending</option>
                          <option value="Placement Fee Paid">Placement Fee Paid</option>
                          <option value="Profiles Shared">Profiles Shared</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Selection Completed">Selection Completed</option>
                          <option value="Support Started">Support Started</option>
                          <option value="Closed">Closed</option>
                        </>
                      )}
                    </select>
                  </div>

                  {selectedRecord.type === 'parent_therapy_requests' && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wider">
                        Assigned Therapist (Internal Note)
                      </label>
                      <input
                        type="text"
                        value={editTherapistAssigned}
                        onChange={(e) => setEditTherapistAssigned(e.target.value)}
                        placeholder="e.g. Dr. Ananya Sharma (BCBA) / Team Lead"
                        className="p-2 border border-purple-200 bg-purple-50/40 rounded-xl text-xs font-semibold text-purple-950 focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider flex items-center justify-between">
                      <span>Internal Notes / Comments</span>
                      <span className="text-[9px] text-rose-500 font-bold lowercase">(private - admin eyes only)</span>
                    </label>
                    <textarea
                      rows={1}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Private administrative notes..."
                      className="p-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"
                    />
                  </div>
                </div>

                {/* Candidate Message (Emailed directly to recipient) */}
                <div className="flex flex-col gap-1 border-t border-brand-border/40 pt-3">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Mail size={12} className="text-secondary" />
                      Message to Candidate / User
                    </span>
                    <span className="text-[9px] text-emerald-600 font-bold lowercase bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      emailed to recipient on save
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    value={editCandidateMessage}
                    onChange={(e) => setEditCandidateMessage(e.target.value)}
                    placeholder="Type custom details to include in email (e.g. 'Your interview is scheduled for July 30th at 4 PM via Google Meet: https://meet.google.com/abc-xyz')..."
                    className="p-2.5 border border-primary/20 bg-white rounded-xl text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/30 leading-relaxed font-medium"
                  />
                </div>

                {modalSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in-up">
                    <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>{modalSuccessMsg}</span>
                  </div>
                )}

                {modalErrorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in-up">
                    <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                    <span>{modalErrorMsg}</span>
                  </div>
                )}

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRecord(null)}
                    className="px-4 py-2.5 border border-brand-border hover:bg-white text-brand-dark rounded-xl font-bold text-xs cursor-pointer transition-all"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-primary/95 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <Save size={14} />
                    <span>{updating ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. REVIEWS EDIT / REJECT MODALS */}
      {isEditingReview && moderatingReviewId && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-brand-border shadow-2xl text-left animate-fade-in-up">
            <h3 className="font-serif text-lg font-bold text-primary mb-2">Edit Review Text</h3>
            <p className="text-xs text-brand-muted mb-4">You are editing minor typos in the parent review text. Do not alter the substance or rating of the review.</p>
            
            <textarea
              rows={5}
              className="w-full bg-brand-light border border-brand-border rounded-2xl p-4 text-xs font-medium text-brand-dark focus:outline-none focus:border-accent"
              value={reviewEditText}
              onChange={(e) => setReviewEditText(e.target.value)}
            />
            
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => { setIsEditingReview(false); setModeratingReviewId(null); }}
                className="px-4 py-2 border border-brand-border rounded-xl text-xs font-bold text-brand-muted hover:bg-brand-light cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReviewAction(moderatingReviewId, 'edit', { reviewText: reviewEditText })}
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-secondary cursor-pointer"
              >
                Save Typos
              </button>
            </div>
          </div>
        </div>
      )}

      {isRejectingReview && moderatingReviewId && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-brand-border shadow-2xl text-left animate-fade-in-up">
            <h3 className="font-serif text-lg font-bold text-primary mb-2">Reject Review</h3>
            <p className="text-xs text-brand-muted mb-4 font-medium">Please enter an internal note explaining the reason for rejection (optional):</p>
            
            <input
              type="text"
              placeholder="e.g. Contains inappropriate language / fake entry"
              className="w-full bg-brand-light border border-brand-border rounded-2xl px-4 py-3 text-xs font-medium text-brand-dark focus:outline-none focus:border-accent"
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
            />
            
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => { setIsRejectingReview(false); setModeratingReviewId(null); }}
                className="px-4 py-2 border border-brand-border rounded-xl text-xs font-bold text-brand-muted hover:bg-brand-light cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReviewAction(moderatingReviewId, 'reject', { rejectionNote })}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
      {/* CONTACT REPLY MODAL */}
      {replyModalContact && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-brand-border shadow-2xl text-left animate-fade-in-up space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Reply size={10} /> Contact Response Email
                </div>
                <h3 className="font-serif text-xl font-bold text-primary">Reply to {replyModalContact.name}</h3>
                <p className="text-xs text-brand-muted font-medium">To: <span className="font-bold text-brand-dark">{replyModalContact.email}</span></p>
              </div>
              <button
                onClick={() => setReplyModalContact(null)}
                className="p-1 text-brand-muted hover:text-brand-dark rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quoted Original Message */}
            <div className="p-3.5 bg-brand-light/60 border border-brand-border rounded-2xl text-xs space-y-1">
              <div className="text-[10px] font-bold uppercase text-brand-muted tracking-wider flex items-center gap-1">
                <MessageSquareQuote size={11} className="text-secondary" /> Original Inquiry ({replyModalContact.city}):
              </div>
              <p className="text-brand-dark italic line-clamp-4 leading-relaxed font-medium">
                "{replyModalContact.message}"
              </p>
            </div>

            {/* Reply Text Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1">
                <Send size={11} className="text-secondary" /> Admin Reply Message
              </label>
              <textarea
                required
                rows={5}
                value={replyMessageText}
                onChange={(e) => setReplyMessageText(e.target.value)}
                placeholder={`Type your reply to ${replyModalContact.name}... (This will be emailed to ${replyModalContact.email} from noreply@theshadowbridge.com)`}
                className="w-full bg-white border border-brand-border rounded-2xl p-3.5 text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
              />
            </div>

            {replySuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in-up">
                <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                <span>{replySuccessMsg}</span>
              </div>
            )}

            {replyErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in-up">
                <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                <span>{replyErrorMsg}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end items-center gap-3 pt-2">
              <button
                onClick={() => setReplyModalContact(null)}
                disabled={sendingReply}
                className="px-4 py-2.5 border border-brand-border rounded-xl text-xs font-bold text-brand-muted hover:bg-brand-light cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendContactReply}
                disabled={sendingReply || !replyMessageText.trim()}
                className="btn-gradient px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {sendingReply ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Sending Email...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Send Reply &amp; Mark Responded</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-brand-border shadow-2xl text-left animate-fade-in-up space-y-5">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <AlertTriangle size={24} className="text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-primary">Confirm Permanent Deletion</h3>
                <p className="text-xs text-brand-muted font-medium">{deleteTarget.label || 'Record'} ID: {deleteTarget.id}</p>
              </div>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 leading-relaxed font-medium">
              Are you sure you want to permanently delete this {deleteTarget.label?.toLowerCase() || 'entry'} from <strong className="font-bold">{deleteTarget.name}</strong>? This action cannot be undone and will permanently erase the record from Supabase.
            </div>

            <div className="flex justify-end items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2.5 border border-brand-border rounded-xl text-xs font-bold text-brand-muted hover:bg-brand-light cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRecord}
                disabled={deleting}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* CONSULTATION REJECTION MODAL */}
      {rejectModalBooking && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-brand-border shadow-2xl text-left animate-fade-in-up space-y-5">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-3 bg-amber-100 rounded-2xl">
                <XCircle size={24} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-primary">Decline Consultation Request</h3>
                <p className="text-xs text-brand-muted font-medium">Booking ID: {rejectModalBooking.bookingId || rejectModalBooking.booking_id}</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed font-medium">
              You are marking consultation <strong>{rejectModalBooking.bookingId || rejectModalBooking.booking_id}</strong> for <strong>{rejectModalBooking.name}</strong> as <strong>Consultation Declined</strong>.
              This will <strong>NOT</strong> unlock their registration form. A polite update email will be sent to <strong>{rejectModalBooking.email}</strong>.
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                Reason for Rejection / Context (Internal &amp; Optional Email Note)
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Location unserviceable, specific specialized therapy required outside our scope, etc."
                className="w-full bg-white border border-brand-border rounded-2xl p-3 text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-amber-500/40 leading-relaxed"
              />
            </div>

            <div className="flex justify-end items-center gap-3 pt-2">
              <button
                onClick={() => setRejectModalBooking(null)}
                disabled={rejecting}
                className="px-4 py-2.5 border border-brand-border rounded-xl text-xs font-bold text-brand-muted hover:bg-brand-light cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejectConsultation}
                disabled={rejecting}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {rejecting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <XCircle size={14} />
                    <span>Confirm Decline &amp; Send Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── COMMISSION SETUP / EDIT WIZARD MODAL ─────────────────── */}
      {commissionModalOpen && (() => {
        const numSalary = Number(commissionSalary) || 0;
        const calcTotal = Math.round(numSalary * (commissionPercentage / 100));
        const sumInstallments = commissionInstallments.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
        const difference = calcTotal - sumInstallments;
        const isBalanced = difference === 0 && calcTotal > 0;

        const allTeachers = db?.shadow_teachers || [];

        return (
          <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-brand-border shadow-2xl text-left animate-fade-in-up space-y-6 my-8 max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-4 border-b border-brand-border shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 text-primary rounded-2xl">
                    <BadgePercent size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-primary">Commission Details &amp; Payment Schedule</h3>
                    <p className="text-xs text-brand-muted font-medium">Configure one-time placement commission terms for Shadow Teacher</p>
                  </div>
                </div>
                <button
                  onClick={() => setCommissionModalOpen(false)}
                  className="p-2 text-brand-muted hover:text-brand-dark rounded-xl hover:bg-brand-light transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="space-y-6 overflow-y-auto flex-grow pr-1">

                {/* Teacher Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                    Shadow Teacher <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={commissionTeacherId}
                    onChange={(e) => {
                      const selId = e.target.value;
                      setCommissionTeacherId(selId);
                      const t = allTeachers.find((st: any) => st.id === selId || st.registration_id === selId);
                      if (t && t.commission) {
                        setCommissionSalary(t.commission.monthlySalary || 16000);
                        setCommissionPercentage(t.commission.commissionPercentage || 40);
                        setCommissionInstallmentCount(t.commission.numberOfInstallments || 2);
                        setCommissionInstallments(t.commission.installments || generateDefaultInstallments(t.commission.totalCommission || 6400, 2));
                        setCommissionNotes(t.commission.notes || '');
                      }
                    }}
                    className="w-full p-3 bg-brand-light/40 border border-brand-border rounded-xl text-xs font-bold text-brand-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
                  >
                    <option value="">-- Select Shadow Teacher --</option>
                    {allTeachers.map((st: any) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.registration_id || st.id}) • {st.city || 'No City'} • Status: {st.status} {st.commission ? '✓ (Plan exists)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Salary & Percentage Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Decided Monthly Salary */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                      Decided Monthly Salary (₹) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-brand-muted text-sm">₹</span>
                      <input
                        type="number"
                        value={commissionSalary}
                        onChange={(e) => handleSalaryChange(e.target.value)}
                        placeholder="e.g. 16000"
                        className="w-full pl-8 pr-3 py-2.5 bg-brand-light/40 border border-brand-border rounded-xl text-xs font-bold text-brand-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>
                    {/* Quick Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] text-brand-muted font-bold">Presets:</span>
                      {[16000, 22000, 25000, 35000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleSalaryChange(amt)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                            Number(commissionSalary) === amt
                              ? 'bg-primary text-white border-primary'
                              : 'bg-brand-light text-brand-dark border-brand-border hover:bg-brand-light/80'
                          }`}
                        >
                          ₹{(amt / 1000)}k
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Commission Percentage */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                      Commission Percentage (%) <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {[40, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => handlePercentageChange(pct)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            commissionPercentage === pct
                              ? 'bg-secondary text-white border-secondary shadow-sm'
                              : 'bg-brand-light/60 text-brand-dark border-brand-border hover:bg-brand-light'
                          }`}
                        >
                          {pct}% of Salary
                        </button>
                      ))}
                      <div className="relative w-24">
                        <input
                          type="number"
                          value={commissionPercentage}
                          onChange={(e) => handlePercentageChange(Number(e.target.value) || 0)}
                          placeholder="Custom %"
                          className="w-full pr-6 pl-2.5 py-2.5 bg-brand-light/40 border border-brand-border rounded-xl text-xs font-bold text-brand-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary text-center"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-muted">%</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-brand-muted">
                      Standard placement commission is typically 40% or 50% of the first month's salary.
                    </p>
                  </div>

                </div>

                {/* Auto-Calculated Total Commission Banner */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/80 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                      Total One-Time Commission (Payable by Teacher)
                    </span>
                    <span className="text-xs text-brand-muted font-medium">
                      ₹{numSalary.toLocaleString('en-IN')} × {commissionPercentage}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-black text-primary">
                      ₹{calcTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Payment Schedule & Installment Splitter */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                      Payment Schedule &amp; Distribution
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-brand-muted font-bold">Split into:</span>
                      {[1, 2, 3, 4].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => handleInstallmentCountChange(count)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                            commissionInstallmentCount === count
                              ? 'bg-primary text-white border-primary shadow-sm'
                              : 'bg-brand-light text-brand-dark border-brand-border hover:bg-brand-light/80'
                          }`}
                        >
                          {count === 1 ? 'Full' : `${count} Inst.`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Installments Table / Editable Grid */}
                  <div className="border border-brand-border rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-brand-light/60 text-brand-muted text-[10px] uppercase font-bold border-b border-brand-border">
                          <th className="py-2.5 px-3">#</th>
                          <th className="py-2.5 px-3">Target Month</th>
                          <th className="py-2.5 px-3">Due Date</th>
                          <th className="py-2.5 px-3">Amount (₹)</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/60">
                        {commissionInstallments.map((inst, idx) => (
                          <tr key={inst.id || idx} className="hover:bg-brand-light/20">
                            <td className="py-2.5 px-3 font-bold text-brand-muted">
                              #{inst.installmentNumber}
                            </td>
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={inst.month}
                                onChange={(e) => handleInstallmentFieldChange(idx, 'month', e.target.value)}
                                placeholder="e.g. September 2026"
                                className="w-full p-1.5 bg-brand-light/40 border border-brand-border rounded-lg text-xs font-semibold text-brand-dark focus:bg-white"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <input
                                type="date"
                                value={inst.dueDate}
                                onChange={(e) => handleInstallmentFieldChange(idx, 'dueDate', e.target.value)}
                                className="w-full p-1.5 bg-brand-light/40 border border-brand-border rounded-lg text-xs font-mono text-brand-dark focus:bg-white"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-muted text-xs">₹</span>
                                <input
                                  type="number"
                                  value={inst.amount}
                                  onChange={(e) => handleInstallmentFieldChange(idx, 'amount', Number(e.target.value) || 0)}
                                  className="w-full pl-5 pr-2 py-1.5 bg-brand-light/40 border border-brand-border rounded-lg text-xs font-bold text-primary focus:bg-white"
                                />
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <select
                                value={inst.status}
                                onChange={(e) => handleInstallmentFieldChange(idx, 'status', e.target.value)}
                                className="w-full p-1.5 bg-brand-light/40 border border-brand-border rounded-lg text-[11px] font-bold text-brand-dark focus:bg-white cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Partially Paid">Partially Paid</option>
                                <option value="Overdue">Overdue</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Real-Time Live Sum Validation Indicator */}
                  <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between border ${
                    isBalanced
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {isBalanced ? (
                        <CheckCircle2 size={16} className="text-emerald-600" />
                      ) : (
                        <AlertTriangle size={16} className="text-rose-600" />
                      )}
                      <span>
                        {isBalanced
                          ? `Installment sum (₹${sumInstallments.toLocaleString('en-IN')}) exactly matches Total Commission ✓`
                          : `Sum mismatch: Installments total ₹${sumInstallments.toLocaleString('en-IN')} (Difference: ${difference > 0 ? `+₹${difference.toLocaleString('en-IN')} remaining` : `-₹${Math.abs(difference).toLocaleString('en-IN')} excess`})`}
                      </span>
                    </div>
                    {!isBalanced && (
                      <button
                        type="button"
                        onClick={() => setCommissionInstallments(generateDefaultInstallments(calcTotal, commissionInstallmentCount))}
                        className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Auto-Balance
                      </button>
                    )}
                  </div>
                </div>

                {/* Email Notification Option */}
                <div className="p-4 bg-brand-light/50 border border-brand-border rounded-2xl space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={commissionSendEmail}
                      onChange={(e) => setCommissionSendEmail(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-secondary cursor-pointer"
                    />
                    <span className="text-xs font-bold text-brand-dark">
                      Send branded confirmation email to Shadow Teacher with full payment schedule
                    </span>
                  </label>
                  <p className="text-[11px] text-brand-muted pl-6.5">
                    An official email will be sent to the teacher outlining their monthly salary, {commissionPercentage}% placement commission terms, and installment due dates.
                  </p>
                </div>

                {/* Internal Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                    Internal Notes / Terms (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={commissionNotes}
                    onChange={(e) => setCommissionNotes(e.target.value)}
                    placeholder="Any special remarks or placement conditions agreed with the teacher..."
                    className="w-full p-3 bg-brand-light/40 border border-brand-border rounded-xl text-xs text-brand-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                {/* Error Banner */}
                {commissionModalError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0 text-rose-600" />
                    <span>{commissionModalError}</span>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-brand-border flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setCommissionModalOpen(false)}
                  disabled={savingCommission}
                  className="px-4 py-2.5 border border-brand-border rounded-xl text-xs font-bold text-brand-muted hover:bg-brand-light cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCommissionPlan}
                  disabled={savingCommission || !isBalanced}
                  className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  {savingCommission ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Saving Plan...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Save Commission Plan</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ─── INSTALLMENT PAYMENT LOGGER MODAL ─────────────────────── */}
      {paymentModalOpen && paymentTargetTeacher && paymentTargetInstallment && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-brand-border shadow-2xl text-left animate-fade-in-up space-y-5">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-brand-border">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
                  <CreditCard size={22} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-primary">Record Commission Payment</h3>
                  <p className="text-xs text-brand-muted font-medium">
                    {paymentTargetTeacher.name} ({paymentTargetTeacher.registration_id || paymentTargetTeacher.id})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="p-1.5 text-brand-muted hover:text-brand-dark rounded-xl hover:bg-brand-light transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Installment Summary */}
            <div className="p-3.5 bg-brand-light/50 border border-brand-border rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-brand-dark block">
                  Installment #{paymentTargetInstallment.installmentNumber} ({paymentTargetInstallment.month})
                </span>
                <span className="text-[10px] text-brand-muted">
                  Due: {paymentTargetInstallment.dueDate ? new Date(paymentTargetInstallment.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-brand-muted uppercase font-bold block">Scheduled Due</span>
                <span className="font-serif font-black text-sm text-primary">
                  ₹{paymentTargetInstallment.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              
              {/* Payment Status */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-brand-light/40 border border-brand-border rounded-xl text-xs font-bold text-brand-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
                >
                  <option value="Paid">Paid (Full Payment Received)</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Pending">Pending (Not Yet Received)</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              {/* Amount Paid & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">
                    Amount Paid (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-muted font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full pl-6 pr-2.5 py-2 bg-brand-light/40 border border-brand-border rounded-xl text-xs font-bold text-brand-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full p-2 bg-brand-light/40 border border-brand-border rounded-xl text-xs font-mono text-brand-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              {/* Method & Ref */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2 bg-brand-light/40 border border-brand-border rounded-xl text-xs font-semibold text-brand-dark focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">
                    Txn Ref / UTR # (Optional)
                  </label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="e.g. 428192839120"
                    className="w-full p-2 bg-brand-light/40 border border-brand-border rounded-xl text-xs text-brand-dark focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Installment Notes */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider block">
                  Remarks / Note
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Received via GPay from Teacher"
                  className="w-full p-2 bg-brand-light/40 border border-brand-border rounded-xl text-xs text-brand-dark focus:bg-white focus:outline-none"
                />
              </div>

              {/* Error Banner */}
              {paymentModalError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800 font-bold">
                  {paymentModalError}
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="flex justify-end items-center gap-3 pt-2 border-t border-brand-border">
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                disabled={savingPayment}
                className="px-4 py-2 border border-brand-border rounded-xl text-xs font-bold text-brand-muted hover:bg-brand-light cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePayment}
                disabled={savingPayment}
                className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
              >
                {savingPayment ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <CheckSquare size={13} />
                    <span>Save Payment Status</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── LOCATION-BASED SHADOW TEACHER ALERT MODAL ───────────── */}
      <AnimatePresence>
        {showLocationAlert && locationAlerts.length > 0 && (() => {
          const alert = locationAlerts[activeAlertIndex];
          if (!alert) return null;
          const pr = alert.parentRequest;
          const parentName = pr.parent_name || pr.parentName || 'Unknown Parent';
          const parentCity = pr.city || 'N/A';
          const parentHome = pr.home_location || pr.homeLocation || '';
          const parentSchool = pr.school_location || pr.schoolLocation || '';
          const regId = pr.registration_id || pr.id || '';
          const hasLocationData = Boolean(parentHome || parentSchool);
          const totalMatches = alert.exactMatches.length + alert.nearbyMatches.length + alert.cityOnlyMatches.length;

          const renderTeacherCard = (st: any, matchType: string) => {
            const stName = st.name || 'Unknown';
            const stRegId = st.registration_id || st.id || '';
            const stLocations = (st.preferred_locations || st.preferredLocations || 'N/A').replace(/,/g, ', ');
            const stStatus = st.status || 'N/A';
            const stExperience = st.experience || 'N/A';
            const stPhone = st.phone || 'N/A';
            const stSpecialNeeds = st.special_needs_exp || st.specialNeedsExp || 'N/A';
            const stComfortAreas = (st.comfortable_areas || st.comfortableAreas || '').replace(/,/g, ', ') || 'N/A';

            return (
              <div key={st.id || stRegId} className="bg-white rounded-xl border border-brand-border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-primary">{stName}</span>
                      <span className="text-[10px] font-mono bg-brand-light text-brand-muted px-1.5 py-0.5 rounded">{stRegId}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        stStatus === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800' :
                        stStatus === 'Onboarding' ? 'bg-blue-100 text-blue-800' :
                        stStatus === 'Interview Scheduled' ? 'bg-amber-100 text-amber-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>{stStatus}</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-brand-muted flex items-center gap-1.5">
                        <MapPin size={11} className="text-accent shrink-0" />
                        <span className="truncate">{stLocations}</span>
                      </p>
                      <p className="text-xs text-brand-muted flex items-center gap-1.5">
                        <Briefcase size={11} className="text-accent shrink-0" />
                        <span>{stExperience} • Special Needs: {stSpecialNeeds}</span>
                      </p>
                      <p className="text-xs text-brand-muted flex items-center gap-1.5">
                        <Phone size={11} className="text-accent shrink-0" />
                        <span>{stPhone}</span>
                      </p>
                      {stComfortAreas !== 'N/A' && (
                        <p className="text-xs text-brand-muted flex items-center gap-1.5">
                          <ShieldCheck size={11} className="text-accent shrink-0" />
                          <span className="truncate">{stComfortAreas}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedRecord({ type: 'shadow_teachers', data: st });
                      setEditStatus(stStatus);
                      setEditNotes(st.notes || '');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-[11px] font-bold shrink-0 cursor-pointer transition-colors"
                  >
                    <Eye size={12} />
                    <span>View Profile</span>
                  </button>
                </div>
              </div>
            );
          };

          return (
            <motion.div
              key="location-alert-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              style={{ backgroundColor: 'rgba(30, 20, 50, 0.7)', backdropFilter: 'blur(4px)' }}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-secondary px-6 py-4 text-white relative">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Bell size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black tracking-tight">🔔 New Parent Requirement — Location Match</h2>
                      <p className="text-white/80 text-xs font-medium mt-0.5">
                        {totalMatches} Shadow {totalMatches === 1 ? 'Teacher' : 'Teachers'} found
                        {hasLocationData ? ' matching the parent\'s location' : ' in the same city'}
                      </p>
                    </div>
                  </div>
                  {locationAlerts.length > 1 && (
                    <div className="absolute top-4 right-5 flex items-center gap-2">
                      <button
                        onClick={() => setActiveAlertIndex(i => Math.max(0, i - 1))}
                        disabled={activeAlertIndex === 0}
                        className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center disabled:opacity-30 cursor-pointer transition-colors"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <span className="text-xs font-bold text-white/90">{activeAlertIndex + 1} / {locationAlerts.length}</span>
                      <button
                        onClick={() => setActiveAlertIndex(i => Math.min(locationAlerts.length - 1, i + 1))}
                        disabled={activeAlertIndex === locationAlerts.length - 1}
                        className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center disabled:opacity-30 cursor-pointer transition-colors"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Parent Info Card */}
                <div className="px-6 pt-4 pb-3">
                  <div className="bg-brand-light/60 rounded-xl border border-brand-border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User size={14} className="text-primary" />
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">Parent Requirement</span>
                      <span className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">{regId}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                      <p className="text-xs text-brand-dark"><span className="font-semibold">Parent:</span> {parentName}</p>
                      <p className="text-xs text-brand-dark"><span className="font-semibold">City:</span> {parentCity}</p>
                      {parentHome && (
                        <p className="text-xs text-brand-dark flex items-center gap-1">
                          <span className="font-semibold">Home Area:</span>
                          <span className="text-primary font-bold">{parentHome}</span>
                        </p>
                      )}
                      {parentSchool && (
                        <p className="text-xs text-brand-dark flex items-center gap-1">
                          <span className="font-semibold">School Area:</span>
                          <span className="text-primary font-bold">{parentSchool}</span>
                        </p>
                      )}
                      {!hasLocationData && (
                        <p className="text-xs text-amber-700 font-medium col-span-2 flex items-center gap-1">
                          <Info size={11} />
                          <span>Specific locality not yet submitted — showing all teachers in {parentCity}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Matched Teachers List */}
                <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4">
                  {alert.exactMatches.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={14} className="text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                          Exact Location Match ({alert.exactMatches.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {alert.exactMatches.map((st: any) => renderTeacherCard(st, 'exact'))}
                      </div>
                    </div>
                  )}

                  {alert.nearbyMatches.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={14} className="text-blue-600" />
                        <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                          Nearby Location Match ({alert.nearbyMatches.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {alert.nearbyMatches.map((st: any) => renderTeacherCard(st, 'nearby'))}
                      </div>
                    </div>
                  )}

                  {alert.cityOnlyMatches.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={14} className="text-purple-600" />
                        <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
                          Same City — {parentCity} ({alert.cityOnlyMatches.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {alert.cityOnlyMatches.slice(0, 5).map((st: any) => renderTeacherCard(st, 'city'))}
                        {alert.cityOnlyMatches.length > 5 && (
                          <p className="text-xs text-brand-muted text-center font-medium py-1">
                            + {alert.cityOnlyMatches.length - 5} more teachers in {parentCity}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {totalMatches === 0 && (
                    <div className="text-center py-6 text-brand-muted text-sm">
                      No matching Shadow Teachers found.
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="border-t border-brand-border px-6 py-3 bg-brand-light/30 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setShowLocationAlert(false);
                      setActiveTab('shadows');
                      setFilterCity(parentCity);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Users size={13} />
                    <span>View All Shadow Teachers</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setShowLocationAlert(false);
                        setActiveTab('parents');
                        setParentSubTab('shadow');
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      <Eye size={13} />
                      <span>View Parent Request</span>
                    </button>
                    <button
                      onClick={() => handleDismissLocationAlert(pr.id || pr.registration_id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-brand-dark/10 hover:bg-brand-dark/20 text-brand-dark rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      <X size={13} />
                      <span>Dismiss</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
