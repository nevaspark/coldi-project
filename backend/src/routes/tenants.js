import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { enforceTenantAccess } from '../middleware/tenantGuard.js';
import { Balance, Call, Tenant } from '../models/index.js';
import { publishAdmin, publishTenant } from '../services/sse.js';
import dayjs from 'dayjs';
import { calculateCostCents } from '../services/billing.js';

const router = Router();

router.get('/:tenantId/summary', authRequired, enforceTenantAccess, async (req, res) => {
  const tenantId = parseInt(req.params.tenantId, 10);
  const balance = await Balance.findByPk(tenantId);
  const calls = await Call.findAll({ where: { tenant_id: tenantId } });
  const totalCalls = calls.length;
  const totalMinutes = calls.reduce((acc, c) => acc + ((c.billed_seconds || 0) / 60), 0);
  res.json({
    total_calls: totalCalls,
    total_minutes: +totalMinutes.toFixed(2),
    current_balance_cents: balance?.current_cents ?? 0,
  });
});

router.get('/:tenantId/bot', authRequired, enforceTenantAccess, async (req, res) => {
  const tenantId = parseInt(req.params.tenantId, 10);
  const tenant = await Tenant.findByPk(tenantId);
  res.json({ bot_id: tenant.bot_id, tenant_name: tenant.name });
});

router.get('/:tenantId/calls', authRequired, enforceTenantAccess, async (req, res) => {
  const tenantId = parseInt(req.params.tenantId, 10);
  const calls = await Call.findAll({ where: { tenant_id: tenantId }, order: [['id','DESC']], limit: 50 });
  res.json(calls);
});

router.post('/:tenantId/calls', authRequired, enforceTenantAccess, async (req, res) => {
  const tenantId = parseInt(req.params.tenantId, 10);
  const tenant = await Tenant.findByPk(tenantId);
  const balance = await Balance.findByPk(tenantId);
  if (!balance || balance.current_cents < 0) {
    return res.status(402).json({ error: 'Insufficient balance' });
  }
  const call = await Call.create({
    tenant_id: tenantId,
    bot_id: tenant.bot_id,
    status: 'started',
    started_at: new Date(),
  });
  publishTenant(tenantId, 'call_started', { id: call.id, started_at: call.started_at });
  publishAdmin('tenant_update', { tenant_id: tenantId, type: 'call_started' });
  res.json(call);
});

router.post('/:tenantId/calls/:id/end', authRequired, enforceTenantAccess, async (req, res) => {
  const tenantId = parseInt(req.params.tenantId, 10);
  const id = parseInt(req.params.id, 10);
  const call = await Call.findOne({ where: { id, tenant_id: tenantId } });
  if (!call) return res.status(404).json({ error: 'Call not found' });
  if (call.status === 'ended') return res.json(call);

  call.ended_at = new Date();
  call.status = 'ended';
  const started = dayjs(call.started_at);
  const ended = dayjs(call.ended_at);
  const billedSeconds = Math.max(1, ended.diff(started, 'second'));
  call.billed_seconds = billedSeconds;
  const costCents = calculateCostCents(billedSeconds);
  call.cost_cents = costCents;
  await call.save();

  const balance = await Balance.findByPk(tenantId);
  balance.current_cents = (balance.current_cents || 0) - costCents;
  balance.updated_at = new Date();
  await balance.save();

  publishTenant(tenantId, 'call_ended', { id: call.id, billed_seconds: billedSeconds, cost_cents: costCents, new_balance_cents: balance.current_cents });
  publishAdmin('tenant_update', { tenant_id: tenantId, type: 'call_ended' });

  res.json(call);
});

export default router;
