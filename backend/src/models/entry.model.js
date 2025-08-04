import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';
import User from './users.model.js';

const Entry = sequelize.define('Entry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  type: {
    type: DataTypes.ENUM('entry', 'exit'),
    allowNull: false
  }
}, {
  timestamps: false
});

User.hasMany(Entry, { foreignKey: 'userId', onDelete: 'CASCADE' });
Entry.belongsTo(User, { foreignKey: 'userId' });

export default Entry;
