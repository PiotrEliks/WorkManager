import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('administrator', 'pracownik'),
    allowNull: false,
    defaultValue: 'pracownik'
  },
  cardId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  changedDefaultPassword: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

export default User;
