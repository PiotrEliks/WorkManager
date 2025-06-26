import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Meter = sequelize.define('Meter', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    producer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: true
    },
    checkdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    nextcheckdate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    nextcheckin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: true
    },
    editedBy: {
      type: DataTypes.STRING,
      allowNull: false
    },
}, {
    tableName: 'Meters',
    timestamps: true
});

export default Meter;
