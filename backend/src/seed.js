import bcrypt from 'bcryptjs';
import { sequelize } from './db.js';
import { Tenant, User, Balance, Call, BalanceAdjustment, syncAll } from './models/index.js';
import { START_BALANCE_CENTS } from './services/billing.js';

async function run() {
  await sequelize.sync({ force: true });

  const tA = await Tenant.create({ name: 'Client A', bot_id: 'BOT_A_XXXX' });
  const tB = await Tenant.create({ name: 'Client B', bot_id: 'BOT_B_YYYY' });

  await Balance.create({ tenant_id: tA.id, current_cents: START_BALANCE_CENTS });
  await Balance.create({ tenant_id: tB.id, current_cents: START_BALANCE_CENTS });

  const adminPw = await bcrypt.hash('Admin123!', 10);
  const aPw = await bcrypt.hash('ClientA123!', 10);
  const bPw = await bcrypt.hash('ClientB123!', 10);

  await User.create({ email: 'admin@coldi.ai', password_hash: adminPw, role: 'admin', tenant_id: null });
  await User.create({ email: 'a@client.local', password_hash: aPw, role: 'client', tenant_id: tA.id });
  await User.create({ email: 'b@client.local', password_hash: bPw, role: 'client', tenant_id: tB.id });

  console.log('Seed complete.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
