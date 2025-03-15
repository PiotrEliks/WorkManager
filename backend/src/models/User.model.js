import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';
import UserPermissions from './userPermissions.model.js';
import Permission from './permission.model.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('administrator', 'pracownik'),
        allowNull: false,
        defaultValue: 'pracownik'
    }
}, {
    tableName: 'Users',
    timestamps: true
});

User.belongsToMany(Permission, {
    through: UserPermissions,
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Permission.belongsToMany(User, {
    through: UserPermissions,
    foreignKey: 'permission_id',
    onDelete: 'CASCADE'
});

UserPermissions.associate({ User, Permission });

export default User;
