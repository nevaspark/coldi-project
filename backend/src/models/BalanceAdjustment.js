export default (sequelize, DataTypes) => {
  const BalanceAdjustment = sequelize.define('BalanceAdjustment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    delta_cents: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.STRING, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'balance_adjustments',
    timestamps: false,
  });
  return BalanceAdjustment;
};
