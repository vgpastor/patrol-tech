import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import { Organization } from './Organization';
import bcrypt from 'bcrypt';
import {hashPassword} from "../services/authService";
import {PaginatedResults} from "../shared/domain/PaginatedResults";

interface UserAttributes {
	id: string;
	name: string;
	email: string;
	password: string;
	organizationId?: string;
	lastLogin?: Date;
}

export class User extends Model<UserAttributes> implements UserAttributes {
	public id!: string;
	public name!: string;
	public email!: string;
	public password!: string;
	public organizationId?: string;
	public lastLogin?: Date;

	async comparePassword(password: string): Promise<boolean> {
		return await bcrypt.compare(password, this.password);
	}

	static async findByOrganizationId(organizationId: string): Promise<PaginatedResults<User>> {
		const users = await User.findAll({ where: { organizationId } });
		return {
			results: users,
			count: users.length,
			totalPages: 1,
		};
	}

	async updateLastLogin(): Promise<void> {
		await User.update({ lastLogin: new Date() }, { where: { id:this.id } });
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
		lastLogin:{
			type: DataTypes.DATE,
			allowNull: true,
		}
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
