import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Meter = sequelize.define('Meter', {
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
    editedBy: {
      type: DataTypes.STRING,
      allowNull: false
    },
    inspectionExpiryDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    nextInspectionDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
}, {
    tableName: 'Meters',
    timestamps: true
});

export default Meter;
