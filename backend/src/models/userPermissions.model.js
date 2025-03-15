import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const UserPermissions = sequelize.define('UserPermissions', {
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'User_permissions',
    timestamps: false,
});

UserPermissions.associate = (models) => {
    UserPermissions.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
    });
    UserPermissions.belongsTo(models.Permission, {
        foreignKey: 'permission_id',
        onDelete: 'CASCADE'
    });
};

export default UserPermissions;
