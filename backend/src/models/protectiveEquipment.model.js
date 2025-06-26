import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const ProtectiveEquipment = sequelize.define('ProtectiveEquipment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    factoryNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    protocolNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    checkDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    nextCheckDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: true
    },
    editedBy: {
      type: DataTypes.STRING,
      allowNull: false
    },
}, {
    tableName: 'ProtectiveEquipments',
    timestamps: true
});

export default ProtectiveEquipment;
