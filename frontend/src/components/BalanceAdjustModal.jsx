import React, { useState } from 'react';

export default function BalanceAdjustModal({ open, onClose, onSubmit, tenant }) {
  const [delta, setDelta] = useState(0);
  const [reason, setReason] = useState('');

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <div className="text-xl font-semibold">Adjust Balance — {tenant?.name}</div>
        <div className="mt-4">
          <label className="label">Delta (cents)</label>
          <input type="number" className="input" value={delta} onChange={e=>setDelta(parseInt(e.target.value||'0',10))} />
        </div>
        <div className="mt-3">
          <label className="label">Reason</label>
          <input className="input" value={reason} onChange={e=>setReason(e.target.value)} />
        </div>
        <div className="mt-5 flex gap-3 justify-end">
          <button className="btn bg-gray-700 hover:bg-gray-600" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={()=>onSubmit(delta, reason)}>Apply</button>
        </div>
      </div>
    </div>
  );
}
