const fs = require('fs');
const f = 'c:/Users/aryan/Pictures/Screenshots/TheShadowBridge/src/app/admin/dashboard/page.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');

// 1. Shadow Teachers (around line 1294)
const shadowBlock = [
  '                             <td className="p-4 text-center">',
  '                               <div className="flex items-center justify-center gap-2">',
  '                                 <button',
  '                                   onClick={() => {',
  '                                     setEditStatus(r.status);',
  '                                     setEditNotes(r.notes || \'\');',
  '                                     setEditMatchId((r as any).suggestedMatchId || \'\');',
  '                                     setSelectedRecord({ type: \'shadow_teachers\', data: r });',
  '                                   }}',
  '                                   className="px-3 py-1.5 border border-primary hover:bg-primary/5 text-primary rounded-xl font-bold text-[10px] transition-all cursor-pointer shadow-sm"',
  '                                 >',
  '                                   View Details',
  '                                 </button>',
  '                                 <button',
  '                                   onClick={() => setDeleteTarget({',
  '                                     type: \'shadow_teachers\',',
  '                                     id: r.id,',
  '                                     name: r.name || r.registration_id || \'Shadow Teacher\',',
  '                                     label: `Shadow Teacher Record ${r.registration_id || \'\'} (${r.name})`',
  '                                   })}',
  '                                   className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg transition-all cursor-pointer"',
  '                                   title="Delete Shadow Teacher Record Permanently"',
  '                                 >',
  '                                   <Trash2 size={13} />',
  '                                 </button>',
  '                               </div>',
  '                             </td>'
].map(l => l + '\r');

// Replace lines 1294 to 1306 (0-indexed: 1293 to 1306)
lines.splice(1293, 13, ...shadowBlock);

// 2. Parent Requests (around line 1502 + offset from inserted lines)
// Find 'type: parentSubTab === \'shadow\''
let parentIdx = lines.findIndex(l => l.includes("type: parentSubTab === 'shadow'"));
if (parentIdx !== -1) {
  let startIdx = parentIdx - 6; // start <td className="p-4 text-center">
  const parentBlock = [
    '                             <td className="p-4 text-center">',
    '                               <div className="flex items-center justify-center gap-2">',
    '                                 <button',
    '                                   onClick={() => {',
    '                                     setEditStatus(r.status);',
    '                                     setEditNotes(r.notes || \'\');',
    '                                     setEditMatchId((r as any).suggestedMatchId || \'\');',
    '                                     setSelectedRecord({ ',
    '                                       type: parentSubTab === \'shadow\' ? \'parent_shadow_requests\' : \'parent_tutor_requests\', ',
    '                                       data: r ',
    '                                     });',
    '                                   }}',
    '                                   className="px-3 py-1.5 border border-primary hover:bg-primary/5 text-primary rounded-xl font-bold text-[10px] transition-all cursor-pointer shadow-sm"',
    '                                 >',
    '                                   View Details',
    '                                 </button>',
    '                                 <button',
    '                                   onClick={() => setDeleteTarget({',
    '                                     type: parentSubTab === \'shadow\' ? \'parent_shadow_requests\' : \'parent_tutor_requests\',',
    '                                     id: r.id,',
    '                                     name: r.parentName || r.registration_id || \'Parent Request\',',
    '                                     label: `Parent Request ${r.registration_id || \'\'} (${r.parentName})`',
    '                                   })}',
    '                                   className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg transition-all cursor-pointer"',
    '                                   title="Delete Parent Request Permanently"',
    '                                 >',
    '                                   <Trash2 size={13} />',
    '                                 </button>',
    '                               </div>',
    '                             </td>'
  ].map(l => l + '\r');

  lines.splice(startIdx, 16, ...parentBlock);
  console.log('✅ Parent Requests Delete button inserted at line:', startIdx + 1);
}

// 3. Parent Reviews (find 'setIsRejectingReview(true)')
let revIdx = lines.findIndex(l => l.includes('setIsRejectingReview(true)'));
if (revIdx !== -1) {
  let insertIdx = revIdx + 5; // after button closing
  const revBlock = [
    '                                   <button',
    '                                     onClick={() => setDeleteTarget({',
    '                                       type: \'reviews\',',
    '                                       id: rev.id,',
    '                                       name: rev.parent_name || rev.parent_registration_id || \'Review\',',
    '                                       label: `Review by ${rev.parent_name} (${rev.parent_registration_id})`',
    '                                     })}',
    '                                     className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg transition-all cursor-pointer ml-1"',
    '                                     title="Delete Review Permanently"',
    '                                   >',
    '                                     <Trash2 size={13} />',
    '                                   </button>'
  ].map(l => l + '\r');

  lines.splice(insertIdx, 0, ...revBlock);
  console.log('✅ Parent Reviews Delete button inserted at line:', insertIdx + 1);
}

fs.writeFileSync(f, lines.join('\n'));
console.log('Done modifying dashboard file!');
