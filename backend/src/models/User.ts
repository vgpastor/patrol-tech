import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import { Organization } from './Organization';
import bcrypt from 'bcrypt';
import {hashPassword} from "../services/authService";

interface UserAttributes {
	id: string;
	name: string;
	email: string;
	password: string;
	organizationId?: string;
}

export class User extends Model<UserAttributes> implements UserAttributes {
	public id!: string;
	public name!: string;
	public email!: string;
	public password!: string;
	public organizationId?: string;

	async comparePassword(password: string): Promise<boolean> {
		return await bcrypt.compare(password, this.password);
	}
}

User.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		organizationId: {
			type: DataTypes.UUID,
			allowNull: true,
		},
	},
	{
		sequelize,
		modelName: 'User',
		hooks: {
			beforeCreate: async (user: User) => {
				user.password = await hashPassword(user.password);
			},
			beforeUpdate: async (user: User) => {
				if (user.changed('password')) {
					user.password = await hashPassword(user.password);
				}
			},
		},
	}
);

User.belongsTo(Organization, { foreignKey: 'organizationId' });
Organization.hasMany(User, { foreignKey: 'organizationId' });
