import {Model, DataTypes, Association, FindOptions} from 'sequelize';
import sequelize from '../db';
import { v4 as uuidv4 } from 'uuid';
import { Location } from './Location';
import {PaginationOptions} from "../shared/domain/PaginationOptions";
import {PaginatedResults} from "../shared/domain/PaginatedResults";
import {Organization} from "./Organization";

interface CheckpointAttributes {
	id: string;
	name: string;
	identifier: string;
	category: string;
	tags: string[];
	latitude: number;
	longitude: number;
	locationId: string;
}

export class Checkpoint extends Model<CheckpointAttributes> implements CheckpointAttributes {
	public id!: string;
	public name!: string;
	public identifier!: string;
	public category!: string;
	public tags!: string[];
	public latitude!: number;
	public longitude!: number;
	public locationId!: string;

	public static associations: {
		location: Association<Checkpoint, Location>;
	};

	public static async findByOrganizationId(
		organizationId: string,
		{ page = 1, limit = 10 }: PaginationOptions  = { page : 1, limit : 10 }
	): Promise<PaginatedResults<Checkpoint>> {
		const offset = (page - 1) * limit;

		const options: FindOptions = {
			limit,
			offset,
			include: [{
				model: Location,
				where: { owner: organizationId },
				include: [{ model: Organization }]
			}]
		};

		const { count, rows } = await this.findAndCountAll(options);

		return {
			results: rows,
			count,
			totalPages: Math.ceil(count / limit),
		};
	}

}

Checkpoint.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: () => uuidv4(),
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		identifier: {
			type: DataTypes.STRING(8),
			allowNull: false,
			unique: true,
		},
		category: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		tags: {
			type: DataTypes.JSON,
			allowNull: false,
		},
		latitude: {
			type: DataTypes.FLOAT,
			allowNull: true,
			defaultValue: null
		},
		longitude: {
			type: DataTypes.FLOAT,
			allowNull: true,
			defaultValue: null
		},
		locationId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Checkpoint',
	}
);

Checkpoint.belongsTo(Location, { foreignKey: 'locationId' });
Location.hasMany(Checkpoint, { foreignKey: 'locationId' });
