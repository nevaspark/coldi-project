import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth';
import { api, sseUrl } from '../api';
import Table from '../components/Table';
import BalanceAdjustModal from '../components/BalanceAdjustModal';

function centsToUSD(c) { return `$${(c/100).toFixed(2)}`; }

export default function AdminPanel() {
  const { logout } = useAuth();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const refresh = async () => {
    const { data } = await api.get('/admin/tenants');
    setRows(data);
  };

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    const es = new EventSource(sseUrl(), { withCredentials: false });
    es.addEventListener('tenant_update', refresh);
    return () => es.close();
  }, []);

  const columns = ['Tenant', 'Bot ID', 'Total Calls', 'Total Minutes', 'Balance', 'Actions'];
  const tableRows = rows.map(r => [
    r.name,
    r.bot_id,
    r.total_calls,
    r.total_minutes,
    centsToUSD(r.current_balance_cents),
    <button className="btn" onClick={()=>{ setSelected(r); setOpen(true); }}>Adjust</button>
  ]);

  const onSubmit = async (delta, reason) => {
    await api.post(`/admin/tenants/${selected.id}/balance_adjustment`, { delta_cents: delta, reason });
    setOpen(false);
    setSelected(null);
    await refresh();
  };

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Admin Panel</div>
        <button className="btn bg-gray-700 hover:bg-gray-600" onClick={logout}>Logout</button>
      </div>

      <div className="mt-6">
        <Table columns={columns} rows={tableRows} />
      </div>

      <BalanceAdjustModal open={open} onClose={()=>setOpen(false)} onSubmit={onSubmit} tenant={selected} />
    </div>
  );
}
