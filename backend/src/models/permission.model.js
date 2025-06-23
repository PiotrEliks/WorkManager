import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';
import User from './users.model.js';

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  can_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  can_write: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  can_edit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  can_delete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: false
});

User.hasOne(Permission, { foreignKey: 'userId', onDelete: 'CASCADE' });
Permission.belongsTo(User, { foreignKey: 'userId' });

export default Permission;
