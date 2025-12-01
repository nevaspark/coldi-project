import { Router } from 'express';
import { authRequired, role } from '../middleware/auth.js';
import { Balance, Call, Tenant } from '../models/index.js';
import { publishAdmin, publishTenant } from '../services/sse.js';

const router = Router();

router.get('/tenants', authRequired, role('admin'), async (req, res) => {
  const tenants = await Tenant.findAll();
  const balances = await Balance.findAll();
  const calls = await Call.findAll();
  const rows = tenants.map(t => {
    const bal = balances.find(b => b.tenant_id === t.id);
    const tcalls = calls.filter(c => c.tenant_id === t.id);
    const totalMinutes = tcalls.reduce((acc, c) => acc + ((c.billed_seconds || 0) / 60), 0);
    return {
      id: t.id,
      name: t.name,
      bot_id: t.bot_id,
      total_calls: tcalls.length,
      total_minutes: +totalMinutes.toFixed(2),
      current_balance_cents: bal?.current_cents || 0,
    };
  });
  res.json(rows);
});

router.post('/tenants/:id/balance_adjustment', authRequired, role('admin'), async (req, res) => {
  const { delta_cents, reason } = req.body;
  const tenantId = parseInt(req.params.id, 10);
  if (!Number.isFinite(delta_cents)) return res.status(400).json({ error: 'delta_cents required' });
  const { BalanceAdjustment, Balance } = await import('../models/index.js');
  const adj = await BalanceAdjustment.create({ tenant_id: tenantId, delta_cents, reason });
  const balance = await Balance.findByPk(tenantId);
  if (!balance) {
    await Balance.create({ tenant_id: tenantId, current_cents: delta_cents });
  } else {
    balance.current_cents += delta_cents;
    balance.updated_at = new Date();
    await balance.save();
  }
  publishTenant(tenantId, 'balance_adjusted', { delta_cents, reason });
  publishAdmin('tenant_update', { tenant_id: tenantId, type: 'balance_adjusted' });
  res.json({ ok: true });
});

export default router;
