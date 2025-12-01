export default (sequelize, DataTypes) => {
  const Tenant = sequelize.define('Tenant', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    bot_id: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'tenants',
    timestamps: false,
  });
  return Tenant;
};
