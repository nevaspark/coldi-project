import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { User } from '../models/index.js';

export async function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(payload.userId);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = { id: user.id, role: user.role, tenant_id: user.tenant_id, email: user.email };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function role(required) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (req.user.role !== required) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
