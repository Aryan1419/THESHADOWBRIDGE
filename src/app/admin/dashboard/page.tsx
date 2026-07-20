'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, User, GraduationCap, ClipboardList, Settings, LogOut,
  RefreshCw, Search, Filter, ShieldCheck, Mail, Phone, MapPin, Calendar,
  CheckCircle, X, ChevronRight, FileText, AlertCircle, Save, Info, Sparkles, CreditCard,
  Star, CheckCircle2, MessageSquare
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
  const [activeTab, setActiveTab] = useState<'overview' | 'tutors' | 'shadows' | 'parents' | 'contacts' | 'payments' | 'notifications' | 'settings' | 'reviews'>('overview');
  
  // Parent Requests sub-tab state
  const [parentSubTab, setParentSubTab] = useState<'shadow' | 'tutor'>('shadow');

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
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
  const [editMatchId, setEditMatchId] = useState('');

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
    if (token !== 'mock-admin-token-sb-2026') {
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

    const payload = {
      action: 'update_record',
      type: selectedRecord.type,
      id: selectedRecord.data.id,
      status: editStatus,
      notes: editNotes,
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

      if (res.ok) {
        const result = await res.json();
        
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

        // Show toast notification
        if (result.notificationLog) {
          setToastLog(result.notificationLog);
          // Hide toast log after 5 seconds
          setTimeout(() => setToastLog(null), 5000);
        }
      }
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setUpdating(false);
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
    db.parent_shadow_requests.forEach(r => {
      if (r.consultation_paid) {
        list.push({
          id: r.id,
          date: r.created_at,
          regId: r.registration_id,
          parentName: r.parentName,
          childName: r.childName,
          phone: r.phone,
          email: r.email,
          type: 'Shadow Teacher Request',
          amount: '₹99',
          paymentId: (r as any).razorpayPaymentId || 'Demo (Simulated)',
          orderId: (r as any).razorpayOrderId || 'Demo (Simulated)',
          status: 'Success'
        });
      }
    });
    db.parent_tutor_requests.forEach(r => {
      if (r.consultation_paid) {
        list.push({
          id: r.id,
          date: r.created_at,
          regId: r.registration_id,
          parentName: r.parentName,
          childName: r.childName,
          phone: r.phone,
          email: r.email,
          type: 'Home Tutor Request',
          amount: '₹99',
          paymentId: (r as any).razorpayPaymentId || 'Demo (Simulated)',
          orderId: (r as any).razorpayOrderId || 'Demo (Simulated)',
          status: 'Success'
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
      const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.registration_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.phone.includes(searchQuery);
      const matchCity = filterCity ? r.city === filterCity : true;
      const matchStatus = filterStatus ? r.status === filterStatus : true;
      const matchExp = filterExperience ? r.experience === filterExperience : true;
      const matchSub = filterSubject ? r.subjects.toLowerCase().includes(filterSubject.toLowerCase()) : true;

      return matchSearch && matchCity && matchStatus && matchExp && matchSub;
    });
  };

  const getFilteredShadows = () => {
    if (!db) return [];
    return db.shadow_teachers.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.registration_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.phone.includes(searchQuery);
      const matchCity = filterCity ? r.city === filterCity : true;
      const matchStatus = filterStatus ? r.status === filterStatus : true;
      const matchExp = filterExperience ? r.experience === filterExperience : true;
      const matchSpecial = filterSpecialNeeds ? r.specialNeedsExp === filterSpecialNeeds : true;
      const matchComfort = filterComfortableArea ? r.comfortableAreas.toLowerCase().includes(filterComfortableArea.toLowerCase()) : true;

      return matchSearch && matchCity && matchStatus && matchExp && matchSpecial && matchComfort;
    });
  };

  const getFilteredParentRequests = () => {
    if (!db) return [];
    const collection = parentSubTab === 'shadow' ? db.parent_shadow_requests : db.parent_tutor_requests;
    return collection.filter(r => {
      const matchSearch = r.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.registration_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.phone.includes(searchQuery);
      const matchCity = filterCity ? r.city === filterCity : true;
      const matchStatus = filterStatus ? r.status === filterStatus : true;

      return matchSearch && matchCity && matchStatus;
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
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-primary text-white flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="p-6 border-b border-white/10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-primary font-black shadow-md">
              SB
            </div>
            <div className="text-left">
              <h2 className="font-serif font-black text-sm tracking-wide">The Shadow Bridge</h2>
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">by Pratibha Mishra</p>
            </div>
          </div>

          <nav className="px-4 space-y-1">
            {[
              { key: 'overview', label: 'Overview', icon: LayoutDashboard },
              { key: 'tutors', label: 'Tutors Registry', icon: Users },
              { key: 'shadows', label: 'Shadow Teachers', icon: GraduationCap },
              { key: 'parents', label: 'Parent Requests', icon: ClipboardList },
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

        <div className="p-6 border-t border-white/10 space-y-4">
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
      <main className="flex-grow flex flex-col overflow-hidden">
        
        {/* TOP STATUS BAR & TOAST LOGGER */}
        <header className="h-16 bg-white border-b border-brand-border/60 px-8 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">Console Mode:</span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 rounded-full text-[10px] uppercase flex items-center gap-1">
              <ShieldCheck size={10} /> Active Database Connected
            </span>
          </div>
          <button
            onClick={fetchDatabase}
            className="p-2 border border-brand-border hover:bg-brand-light rounded-lg text-primary flex items-center justify-center cursor-pointer transition-all shadow-sm"
            title="Refresh Database Records"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </header>

        {/* NOTIFICATION LOG TOAST */}
        {toastLog && (
          <div className="bg-[#502C6E] text-accent p-3.5 px-8 text-xs font-bold font-sans flex items-center gap-2 border-b border-accent/20 animate-fade-in-down shadow-md shrink-0">
            <Info size={14} className="animate-bounce shrink-0" />
            <span className="flex-grow text-left text-white">{toastLog}</span>
            <button onClick={() => setToastLog(null)} className="text-white/60 hover:text-white cursor-pointer ml-4">
              <X size={14} />
            </button>
          </div>
        )}

        {/* WORKSPACE AREA */}
        <div className="flex-grow p-8 overflow-y-auto">
          
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
              <div className="bg-white border border-brand-border p-4 rounded-2xl shadow-sm grid grid-cols-2 gap-4 max-w-md">
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
                          <th className="p-4 text-center">Consultation Paid?</th>
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
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                r.consultation_paid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700'
                              }`}>
                                {r.consultation_paid ? 'Yes (₹99)' : 'No'}
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
                                  setSelectedRecord({ 
                                    type: parentSubTab === 'shadow' ? 'parent_shadow_requests' : 'parent_tutor_requests', 
                                    data: r 
                                  });
                                }}
                                className="px-3 py-1.5 border border-primary hover:bg-primary/5 text-primary rounded-xl font-bold text-[10px] transition-all cursor-pointer shadow-sm"
                              >
                                View Details
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
          )}

          {/* TAB 5: PAYMENTS LEDGER */}
          {activeTab === 'payments' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex justify-between items-center">
                <h2 className="font-serif text-2xl font-black text-primary">Payments Ledger</h2>
                <div className="text-xs text-brand-muted font-bold">
                  Total Revenue: <span className="text-emerald-600 font-extrabold text-sm">₹{paymentsList.length * 99}</span>
                </div>
              </div>

              {/* Test Mode warning banner */}
              {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_test') && (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-center gap-3 text-xs font-bold text-left shadow-sm">
                  <AlertCircle size={20} className="text-amber-600 flex-shrink-0 animate-pulse" />
                  <div>
                    <p className="font-bold text-amber-900 text-sm">TEST MODE — No real payments are being processed</p>
                    <p className="font-medium text-amber-700 text-xs mt-0.5">
                      Using Razorpay credentials in Sandbox environment. Card details, payment receipts, and signatures are validated for development and testing.
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
                          <tr key={p.id} className="hover:bg-brand-light/20">
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
                            <td className="p-4 font-extrabold text-brand-dark">{p.amount}</td>
                            <td className="p-4 font-mono text-[10px] text-brand-muted">{p.paymentId}</td>
                            <td className="p-4 font-mono text-[10px] text-brand-muted">{p.orderId}</td>
                            <td className="p-4 text-center">
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold uppercase flex items-center justify-center gap-1 max-w-[80px] mx-auto">
                                <CheckCircle size={10} /> {p.status}
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
          )}

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
          {activeTab === 'settings' && (
            <div className="bg-white border border-brand-border rounded-3xl p-8 shadow-sm space-y-6 text-center max-w-xl mx-auto animate-fade-in-up">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Settings size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-primary">Admin Portal Settings</h3>
                <p className="text-xs text-brand-muted max-w-md mx-auto leading-relaxed">
                  Here you can configure diagnostic tools parameters, placement rules, notification channels (Twilio SMS and Resend Email keys), and adjust system variables.
                </p>
              </div>
              <div className="p-4 bg-brand-light/50 border border-brand-border rounded-xl text-xs text-brand-dark flex items-center gap-2">
                <Info size={16} className="text-secondary shrink-0" />
                <span className="text-left font-medium">Settings modifications will be enabled in the final deployment phase.</span>
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
                                <td className="p-4 max-w-xs">
                                  <p className="text-brand-dark text-xs line-clamp-3 leading-relaxed">
                                    {contact.message}
                                  </p>
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
                                  {status !== 'responded' && (
                                    <button
                                      onClick={() => handleQuickContactStatus(contact.id, 'responded')}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-all cursor-pointer shadow-sm"
                                    >
                                      Mark Responded
                                    </button>
                                  )}
                                  {status === 'new' && (
                                    <button
                                      onClick={() => handleQuickContactStatus(contact.id, 'read')}
                                      className="px-2.5 py-1 bg-primary hover:bg-primary/80 text-white rounded-lg font-bold text-[11px] transition-all cursor-pointer shadow-sm"
                                    >
                                      Mark Read
                                    </button>
                                  )}
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
                        {selectedRecord.data.difficulties.includes('Others') && <div className="col-span-2"><strong>Other difficulty notes:</strong> {selectedRecord.data.otherDifficulty}</div>}
                        <div><strong>Takes Therapy?</strong> {selectedRecord.data.takesTherapy}</div>
                        {selectedRecord.data.takesTherapy === 'Yes' && <div className="col-span-2"><strong>Therapies:</strong> {selectedRecord.data.therapies}</div>}
                        {selectedRecord.data.therapies.includes('Others') && <div className="col-span-2"><strong>Other therapies:</strong> {selectedRecord.data.otherTherapy}</div>}
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

                {/* File Uploads (Shadow Teachers Only) */}
                {selectedRecord.type === 'shadow_teachers' && (
                  <div className="space-y-3 p-4 bg-brand-light/30 border border-brand-border rounded-2xl">
                    <h4 className="font-serif text-xs font-bold text-primary flex items-center gap-1.5">
                      <FileText size={14} className="text-secondary" />
                      Uploaded Documents Vetting
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {selectedRecord.data.aadharCardName && (
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); alert(`Vetting document: ${selectedRecord.data.aadharCardName}`); }}
                          className="flex items-center gap-2 p-2 bg-white border border-brand-border rounded-xl hover:bg-brand-light transition-all"
                        >
                          <FileText size={14} className="text-primary" />
                          <span className="font-bold truncate">Aadhar: {selectedRecord.data.aadharCardName}</span>
                        </a>
                      )}
                      {selectedRecord.data.qualificationCertName && (
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); alert(`Vetting document: ${selectedRecord.data.qualificationCertName}`); }}
                          className="flex items-center gap-2 p-2 bg-white border border-brand-border rounded-xl hover:bg-brand-light transition-all"
                        >
                          <FileText size={14} className="text-primary" />
                          <span className="font-bold truncate">Degree: {selectedRecord.data.qualificationCertName}</span>
                        </a>
                      )}
                      {selectedRecord.data.experienceCertName && (
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); alert(`Vetting document: ${selectedRecord.data.experienceCertName}`); }}
                          className="flex items-center gap-2 p-2 bg-white border border-brand-border rounded-xl hover:bg-brand-light transition-all"
                        >
                          <FileText size={14} className="text-primary" />
                          <span className="font-bold truncate">Exp Cert: {selectedRecord.data.experienceCertName}</span>
                        </a>
                      )}
                      {selectedRecord.data.profilePhotoName && (
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); alert(`Vetting photo: ${selectedRecord.data.profilePhotoName}`); }}
                          className="flex items-center gap-2 p-2 bg-white border border-brand-border rounded-xl hover:bg-brand-light transition-all"
                        >
                          <FileText size={14} className="text-primary" />
                          <span className="font-bold truncate">Photo: {selectedRecord.data.profilePhotoName}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

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
                    <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider">Internal Notes / Comments</label>
                    <textarea
                      rows={1}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Add administrative review notes..."
                      className="p-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"
                    />
                  </div>
                </div>

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

    </div>
  );
}
