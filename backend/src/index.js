import express from 'express';
import cors from 'cors';
import { PORT } from './config.js';
import { syncAll } from './models/index.js';
import authRoutes from './routes/auth.js';
import tenantRoutes from './routes/tenants.js';
import adminRoutes from './routes/admin.js';
import eventsRoutes from './routes/events.js';
import { authRequired } from './middleware/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Coldi backend up'));

app.use('/auth', authRoutes);
app.use('/events', eventsRoutes);
app.use('/tenant', tenantRoutes);
app.use('/admin', adminRoutes);

app.get('/healthz', (req, res) => res.json({ ok: true }));

await syncAll();

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
