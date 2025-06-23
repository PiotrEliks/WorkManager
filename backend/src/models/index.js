import sequelize from '../lib/db.js';
import User from './users.model.js';
import Permission from './permission.model.js';
import Entry from './entry.model.js';

const syncDb = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('🟢 Models synced');
  } catch (err) {
    console.error('🔴 Error syncing models:', err);
  }
};

export {
  sequelize,
  User,
  Permission,
  Entry,
  syncDb
};
