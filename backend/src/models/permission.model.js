import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Permission = sequelize.define('Permission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    view_permission: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    edit_permission: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    add_permission: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    delete_permission: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'Permissions',
    timestamps: false,
});

export default Permission;
