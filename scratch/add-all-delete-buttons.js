const fs = require('fs');
const f = 'c:/Users/aryan/Pictures/Screenshots/TheShadowBridge/src/app/admin/dashboard/page.tsx';
let content = fs.readFileSync(f, 'utf8');

// 1. Add Delete button to Shadow Teachers
const shadowTarget = `                              <button
                                onClick={() => {
                                  setEditStatus(r.status);
                                  setEditNotes(r.notes || '');
                                  setEditMatchId((r as any).suggestedMatchId || '');
                                  setSelectedRecord({ type: 'shadow_teachers', data: r });
                                }}
                                className="px-3 py-1.5 border border-primary hover:bg-primary/5 text-primary rounded-xl font-bold text-[10px] transition-all cursor-pointer shadow-sm"
                              >
                                View Details
                              </button>`;

const shadowReplacement = `                              <div className="flex items-center justify-center gap-2">
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
                                    label: \`Shadow Teacher Record \${r.registration_id || ''} (\${r.name})\`
                                  })}
                                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg transition-all cursor-pointer"
                                  title="Delete Shadow Teacher Record Permanently"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>`;

// 2. Add Delete button to Parent Requests
const parentTarget = `                              <button
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
                              </button>`;

const parentReplacement = `                              <div className="flex items-center justify-center gap-2">
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
                                    label: \`Parent Request \${r.registration_id || ''} (\${r.parentName})\`
                                  })}
                                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg transition-all cursor-pointer"
                                  title="Delete Parent Request Permanently"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>`;

// 3. Add Delete button to Parent Reviews
const reviewTarget = `                                   {rev.status !== 'rejected' && (
                                     <button
                                       onClick={() => {
                                         setModeratingReviewId(rev.id);
                                         setIsRejectingReview(true);
                                       }}
                                       className="px-2.5 py-1.5 bg-rose-600 text-white rounded-lg text-[10px] font-bold hover:bg-rose-700 transition-all cursor-pointer shadow-sm"
                                     >
                                       Reject
                                     </button>
                                   )}`;

const reviewReplacement = `                                   {rev.status !== 'rejected' && (
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
                                       label: \`Review by \${rev.parent_name} (\${rev.parent_registration_id})\`
                                     })}
                                     className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg transition-all cursor-pointer ml-1"
                                     title="Delete Review Permanently"
                                   >
                                     <Trash2 size={13} />
                                   </button>`;

if (content.includes(shadowTarget)) {
  content = content.replace(shadowTarget, shadowReplacement);
  console.log('✅ Added Delete button to Shadow Teachers');
} else {
  console.warn('⚠️ Shadow Teachers target not found');
}

if (content.includes(parentTarget)) {
  content = content.replace(parentTarget, parentReplacement);
  console.log('✅ Added Delete button to Parent Requests');
} else {
  console.warn('⚠️ Parent Requests target not found');
}

if (content.includes(reviewTarget)) {
  content = content.replace(reviewTarget, reviewReplacement);
  console.log('✅ Added Delete button to Parent Reviews');
} else {
  console.warn('⚠️ Parent Reviews target not found');
}

fs.writeFileSync(f, content);
console.log('Done!');
