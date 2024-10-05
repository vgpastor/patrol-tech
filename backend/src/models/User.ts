import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import { Organization } from './Organization';
import bcrypt from 'bcrypt';

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
				const salt = await bcrypt.genSalt(10);
				user.password = await bcrypt.hash(user.password, salt);
			},
		},
	}
);

User.belongsTo(Organization, { foreignKey: 'organizationId' });
Organization.hasMany(User, { foreignKey: 'organizationId' });
