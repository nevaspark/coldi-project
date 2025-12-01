import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { User, Tenant } from '../models/index.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '2d' });
  const tenant = user.tenant_id ? await Tenant.findByPk(user.tenant_id) : null;
  res.json({ token, me: { id: user.id, role: user.role, email: user.email, tenant_id: user.tenant_id, tenant_name: tenant?.name || null } });
});

router.get('/me', authRequired, async (req, res) => {
  res.json({ me: req.user });
});

export default router;
