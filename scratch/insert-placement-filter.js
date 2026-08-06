const fs = require('fs');
const f = 'c:/Users/aryan/Pictures/Screenshots/TheShadowBridge/src/app/admin/dashboard/page.tsx';
let content = fs.readFileSync(f, 'utf8');
let lines = content.split('\n');

// 1. Update grid from 2 cols to 3 cols in Parent Requests filter panel (line 1317)
lines[1316] = lines[1316].replace('grid-cols-2 gap-4 max-w-md', 'grid-cols-3 gap-4 max-w-xl');

// 2. Insert Placement Fee filter after line 1352 (end of Filter Status div)
const newBlock = [
  '',
  '                <div className="flex flex-col gap-1">',
  '                  <span className="text-[10px] text-brand-muted uppercase font-bold flex items-center gap-1">',
  '                    <CreditCard size={10} /> Placement Fee',
  '                  </span>',
  '                  <select',
  '                    value={filterPlacementPaid}',
  '                    onChange={(e) => setFilterPlacementPaid(e.target.value)}',
  '                    className="p-2 border border-brand-border bg-white rounded-xl text-xs text-brand-dark focus:outline-none"',
  '                  >',
  '                    <option value="">All</option>',
  '                    <option value="yes">Paid</option>',
  '                    <option value="no">Not Paid</option>',
  '                  </select>',
  '                </div>',
].map(l => l + '\r');

lines.splice(1352, 0, ...newBlock);

fs.writeFileSync(f, lines.join('\n'));
console.log('Done! Inserted Placement Fee filter. New total lines:', lines.length);
