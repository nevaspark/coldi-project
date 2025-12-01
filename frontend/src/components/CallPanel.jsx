import React, { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api';
import dayjs from 'dayjs';

function centsToUSD(c) { return `$${(c/100).toFixed(2)}`; }

export default function CallPanel({ tenantId, bot }) {
  const [activeCall, setActiveCall] = useState(null);
  const [now, setNow] = useState(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timerRef.current);
  }, []);

  const durationSec = useMemo(() => {
    if (!activeCall) return 0;
    const start = new Date(activeCall.started_at).getTime();
    return Math.max(0, Math.floor((now - start) / 1000));
  }, [activeCall, now]);

  const estCostCents = Math.max(40, Math.round((durationSec/60) * 40));

  const startCall = async () => {
    try {
      const { data } = await api.post(`/tenant/${tenantId}/calls`);
      setActiveCall(data);
    } catch (err) {
      console.error('startCall error', err);
      alert(err.response?.data?.error || err.message || 'Failed to start call');
    }
  };

  const endCall = async () => {
    if (!activeCall) return;
    try {
      const { data } = await api.post(`/tenant/${tenantId}/calls/${activeCall.id}/end`);
      setActiveCall(null);
    } catch (err) {
      console.error('endCall error', err);
      alert(err.response?.data?.error || err.message || 'Failed to end call');
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400">Bot ID</div>
          <div className="text-2xl font-semibold">{bot?.bot_id}</div>
        </div>
        <span className="badge">Tenant #{tenantId}</span>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-sm text-gray-400">Status</div>
          <div className="mt-2 text-xl">{activeCall ? 'In Call' : 'Idle'}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-400">Duration</div>
          <div className="mt-2 text-xl">{durationSec}s</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-400">Live Cost (est.)</div>
          <div className="mt-2 text-xl">{centsToUSD(estCostCents)}</div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        {!activeCall ? (
          <button className="btn" onClick={startCall}>Start Test Call</button>
        ) : (
          <button className="btn bg-rose-600 hover:bg-rose-500" onClick={endCall}>End Call</button>
        )}
      </div>
    </div>
  )
}
