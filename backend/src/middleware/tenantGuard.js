export function enforceTenantAccess(req, res, next) {
  if (req.user.role === 'admin') return next();
  const paramTenantId = parseInt(req.params.tenantId || req.query.tenantId || req.body.tenant_id, 10);
  if (!paramTenantId || req.user.tenant_id !== paramTenantId) {
    return res.status(403).json({ error: 'Tenant access denied' });
  }
  next();
}
