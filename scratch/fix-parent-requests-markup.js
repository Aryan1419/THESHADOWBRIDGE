const fs = require('fs');
const f = 'c:/Users/aryan/Pictures/Screenshots/TheShadowBridge/src/app/admin/dashboard/page.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');

const cleanBlock = [
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
  '                             </td>',
  '                           </tr>',
  '                         ))}'
].map(l => l + '\r');

// Replace lines 1515 to 1548 (0-indexed: 1515 to 1548)
lines.splice(1515, 33, ...cleanBlock);

fs.writeFileSync(f, lines.join('\n'));
console.log('Cleaned Parent Requests markup successfully! Total lines:', lines.length);
