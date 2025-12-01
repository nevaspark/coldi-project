export default (sequelize, DataTypes) => {
  const Balance = sequelize.define('Balance', {
    tenant_id: { type: DataTypes.INTEGER, primaryKey: true },
    current_cents: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'balances',
    timestamps: false,
  });
  return Balance;
};
