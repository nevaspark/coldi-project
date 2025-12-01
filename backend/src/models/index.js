import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

import TenantModel from './Tenant.js';
import UserModel from './User.js';
import BalanceModel from './Balance.js';
import CallModel from './Call.js';
import BalanceAdjustmentModel from './BalanceAdjustment.js';

export const Tenant = TenantModel(sequelize, DataTypes);
export const User = UserModel(sequelize, DataTypes);
export const Balance = BalanceModel(sequelize, DataTypes);
export const Call = CallModel(sequelize, DataTypes);
export const BalanceAdjustment = BalanceAdjustmentModel(sequelize, DataTypes);

User.belongsTo(Tenant, { foreignKey: 'tenant_id' });
Tenant.hasMany(User, { foreignKey: 'tenant_id' });

Balance.belongsTo(Tenant, { foreignKey: 'tenant_id' });
Tenant.hasOne(Balance, { foreignKey: 'tenant_id' });

Call.belongsTo(Tenant, { foreignKey: 'tenant_id' });
Tenant.hasMany(Call, { foreignKey: 'tenant_id' });

BalanceAdjustment.belongsTo(Tenant, { foreignKey: 'tenant_id' });
Tenant.hasMany(BalanceAdjustment, { foreignKey: 'tenant_id' });

export async function syncAll() {
  await sequelize.sync();
}
