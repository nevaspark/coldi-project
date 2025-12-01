export default (sequelize, DataTypes) => {
  const Call = sequelize.define('Call', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    bot_id: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('started', 'in_progress', 'ended'), allowNull: false, defaultValue: 'started' },
    started_at: { type: DataTypes.DATE, allowNull: true },
    ended_at: { type: DataTypes.DATE, allowNull: true },
    billed_seconds: { type: DataTypes.INTEGER, allowNull: true },
    cost_cents: { type: DataTypes.INTEGER, allowNull: true },
  }, {
    tableName: 'calls',
    timestamps: false,
  });
  return Call;
};
