import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth';
import { api, sseUrl } from '../api';
import StatCard from '../components/StatCard';
import CallPanel from '../components/CallPanel';

function centsToUSD(c) { return `$${(c/100).toFixed(2)}`; }

export default function ClientDashboard() {
  const { me, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [bot, setBot] = useState(null);

  const refresh = async () => {
    if (!me?.tenant_id) return;
    const s = await api.get(`/tenant/${me.tenant_id}/summary`);
    const b = await api.get(`/tenant/${me.tenant_id}/bot`);
    setSummary(s.data);
    setBot(b.data);
  };

  useEffect(() => { if (me?.tenant_id) refresh(); }, [me?.tenant_id]);

  useEffect(() => {
    if (!me?.tenant_id) return;
    const es = new EventSource(sseUrl(me.tenant_id), { withCredentials: false });
    es.onmessage = () => {};
    es.addEventListener('balance_adjusted', refresh);
    es.addEventListener('call_started', refresh);
    es.addEventListener('call_ended', refresh);
    return () => es.close();
  }, [me?.tenant_id]);

  if (!summary || !bot) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-semibold">Client Dashboard</div>
          <div className="text-gray-400 text-sm">Signed in as {me.email}</div>
        </div>
        <button className="btn bg-gray-700 hover:bg-gray-600" onClick={logout}>Logout</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <StatCard title="Total Calls" value={summary.total_calls} />
        <StatCard title="Total Minutes" value={summary.total_minutes} />
        <StatCard title="Current Balance" value={centsToUSD(summary.current_balance_cents)} />
      </div>

      <div className="mt-6">
        <CallPanel tenantId={me.tenant_id} bot={bot} />
      </div>
    </div>
  );
}
