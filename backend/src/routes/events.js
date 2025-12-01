import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { enforceTenantAccess } from '../middleware/tenantGuard.js';
import { subscribe } from '../services/sse.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { User } from '../models/index.js';

const router = Router();
router.get('/', async (req, res, next) => {
  const tenantId = req.query.tenantId ? parseInt(req.query.tenantId, 10) : null;

  const header = req.headers.authorization || '';
  const headerToken = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!headerToken && req.query.token) {
    try {
      const payload = jwt.verify(req.query.token, JWT_SECRET);
      const user = await User.findByPk(payload.userId);
      if (!user) return res.status(401).end();
      req.user = { id: user.id, role: user.role, tenant_id: user.tenant_id, email: user.email };
    } catch (e) {
      return res.status(401).end();
    }
  }

  if (!req.user) {
    return authRequired(req, res, () => {
      if (req.user.role === 'client') {
        if (!tenantId || tenantId !== req.user.tenant_id) return res.status(403).end();
      }
      subscribe(res, tenantId);
    });
  }

  if (req.user.role === 'client') {
    if (!tenantId || tenantId !== req.user.tenant_id) return res.status(403).end();
  }
  subscribe(res, tenantId);
});

export default router;
