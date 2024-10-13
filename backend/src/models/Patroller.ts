import {Model, DataTypes, Association, FindOptions} from 'sequelize';
import sequelize from '../db';
import { v4 as uuidv4 } from 'uuid';
import { Organization } from './Organization';
import {PaginationOptions} from "../shared/domain/PaginationOptions";
import {PaginatedResults} from "../shared/domain/PaginatedResults";

interface PatrollerAttributes {
	id: string;
	name: string;
	identifier: string;
	email?: string;
	phone?: string;
	organizationId: string;
}

export class Patroller extends Model<PatrollerAttributes> implements PatrollerAttributes {
	public id!: string;
	public name!: string;
	public identifier!: string;
	public email?: string;
	public phone?: string;
	public organizationId!: string;

	public static associations: {
		organization: Association<Patroller, Organization>;
	};

	public static async findByOrganizationId(
		organizationId: string,
		{ page = 1, limit = 10 }: PaginationOptions = { page : 1, limit : 10 }
	): Promise<PaginatedResults<Patroller>> {
		const offset = (page - 1) * limit;

		const options: FindOptions = {
			where: { organizationId },
			limit,
			offset,
			include: [{ model: Organization }]
		};

		const { count, rows } = await this.findAndCountAll(options);

		return {
			results: rows,
			count,
			totalPages: Math.ceil(count / limit),
		};
	}
}

Patroller.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: () => uuidv4(),
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		identifier: {
			type: DataTypes.STRING(8),
			allowNull: false,
			unique: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		organizationId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Patroller',
	}
);

Patroller.belongsTo(Organization, { foreignKey: 'organizationId' });
Organization.hasMany(Patroller, { foreignKey: 'organizationId' });
