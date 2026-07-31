'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, User, GraduationCap, ClipboardList, Settings, LogOut,
  RefreshCw, Search, Filter, ShieldCheck, Mail, Phone, MapPin, Calendar,
  CheckCircle, X, XCircle, ChevronRight, FileText, AlertCircle, Save, Info, Sparkles, CreditCard,
  Star, CheckCircle2, MessageSquare, Reply, Send, MailCheck, MessageSquareQuote, CornerDownRight, Trash2, AlertTriangle, ExternalLink, Menu
} from 'lucide-react';

import { DatabaseSchema, TutorRecord, ShadowTeacherRecord, ParentShadowRequestRecord, ParentTutorRequestRecord } from '@/lib/db';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'tutors' | 'shadows' | 'parents' | 'bookings' | 'contacts' | 'payments' | 'notifications' | 'settings' | 'reviews'>('overview');

  // Mobile sidebar collapse state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Parent Requests sub-tab state
  const [parentSubTab, setParentSubTab] = useState<'shadow' | 'tutor'>('shadow');

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
    type: 'tutors' | 'shadow_teachers' | 'parent_shadow_requests' | 'parent_tutor_requests';
    data: any;
  } | null>(null);

  // Edit states inside details modal
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editCandidateMessage, setEditCandidateMessage] = useState('');
  const [editMatchId, setEditMatchId] = useState('');
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
      suggestedMatchId: editMatchId
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
      suggestedMatchId: candidateId
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
      return ps === 'waived_shadow100' || notesStr.includes('SHADOW100') || r.razorpayPaymentId === 'VIP-SHADOW100' || r.razorpay_payment_id === 'VIP-SHADOW100';
    };

    const getRealPaymentId = (r: any, isPlacement: boolean, isWaived: boolean) => {
      if (isWaived) return 'N/A (VIP Outreach)';
      
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
      if (isWaived) return 'N/A (VIP Outreach)';

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
        const paymentId = getRealPaymentId(r, true, false);
        const orderId = getRealOrderId(r, true, false);
        const isRealSuccess = paymentId.startsWith('pay_');

        list.push({
          id: r.id + '-place',
          date: (r as any).placementPaidAt || r.created_at,
          regId: r.registration_id,
          parentName: r.parentName || (r as any).parent_name,
          childName: r.childName || (r as any).child_name,
          phone: r.phone,
          email: r.email,
          type: 'Placement Fee (Shadow Teacher)',
          amount: isRealSuccess ? `₹${placementAmt.toLocaleString()}` : '₹0 (Unverified)',
          numericAmount: isRealSuccess ? placementAmt : 0,
          originalFee: placementAmt,
          paymentId,
          orderId,
          status: isRealSuccess ? 'SUCCESS' : 'UNVERIFIED (No Razorpay ID)',
          isWaived: false,
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
        const paymentId = getRealPaymentId(r, true, false);
        const orderId = getRealOrderId(r, true, false);
        const isRealSuccess = paymentId.startsWith('pay_');

        list.push({
          id: r.id + '-place',
          date: (r as any).placementPaidAt || r.created_at,
          regId: r.registration_id,
          parentName: r.parentName || (r as any).parent_name,
          childName: r.childName || (r as any).child_name,
          phone: r.phone,
          email: r.email,
          type: 'Placement Fee (Home Tutor)',
          amount: isRealSuccess ? `₹${placementAmt.toLocaleString()}` : '₹0 (Unverified)',
          numericAmount: isRealSuccess ? placementAmt : 0,
          originalFee: placementAmt,
          paymentId,
          orderId,
          status: isRealSuccess ? 'SUCCESS' : 'UNVERIFIED (No Razorpay ID)',
          isWaived: false,
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
    const collection = parentSubTab === 'shadow' ? db.parent_shadow_requests : db.parent_tutor_requests;
    return collection.filter(r => {
      const matchSearch = (r.parentName ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.childName ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
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
              { key: 'parents', label: 'Parent Requests', icon: ClipboardList },
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
                              <p className="font-bold">{r.parentName}</p>
                              <p className="text-[10px] text-brand-muted">{r.phone} • {r.relationship}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-bold">{r.childName}</p>
                              <p className="text-brand-muted text-[10px]">{r.childGrade} • DOB: {formatDate(r.childDob)}</p>
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
                            ) : (
                              <>
                                <td className="p-4 max-w-[120px] truncate">{(r as any).tutorType}</td>
                                <td className="p-4 max-w-[150px] truncate">{(r as any).subjects}</td>
                              </>
                            )}

                            <td className="p-4 text-center">
                              {(() => {
                                const isPaid = Boolean((r as any).placementPaid || (r as any).placement_paid);
                                const amount = (r as any).placementAmount || (r as any).placement_amount || (parentSubTab === 'shadow' ? 5000 : 3000);
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
                                     setSelectedRecord({ 
                                       type: parentSubTab === 'shadow' ? 'parent_shadow_requests' : 'parent_tutor_requests', 
                                       data: r 
                                     });
                                   }}
                                   className="px-3 py-1.5 border border-primary hover:bg-primary/5 text-primary rounded-xl font-bold text-[10px] transition-all cursor-pointer shadow-sm"
                                 >
                                   View Details
                                 </button>
                                 <button
                                   onClick={() => setDeleteTarget({
                                     type: parentSubTab === 'shadow' ? 'parent_shadow_requests' : 'parent_tutor_requests',
                                     id: r.id,
                                     name: r.parentName || r.registration_id || 'Parent Request',
                                     label: `Parent Request ${r.registration_id || ''} (${r.parentName})`
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
                      <span className="text-[11px] font-extrabold text-purple-800 uppercase tracking-wider">Total Waived (Outreach)</span>
                      <Sparkles size={16} className="text-purple-600" />
                    </div>
                    <p className="text-3xl font-black text-purple-950 mt-2">{totalWaivedCount} <span className="text-sm font-semibold text-purple-800">Records</span></p>
                    <p className="text-[11px] text-purple-800 font-bold mt-1">
                      ₹{totalWaivedValue.toLocaleString()} Value Waived (Outreach Code `SHADOW100`)
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

                  </div>
                </div>



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
                    </select>
                  </div>

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
    </div>
  );
}
