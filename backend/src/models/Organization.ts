import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../db';
import { v4 as uuidv4 } from 'uuid';
import { Location } from './Location';

interface OrganizationAttributes {
	id: string;
	name: string;
	type: string;
}

export class Organization extends Model<OrganizationAttributes> implements OrganizationAttributes {
	public id!: string;
	public name!: string;
	public type!: string;

	// Añadir métodos de asociación
	public addLocation!: (location: Location, options?: any) => Promise<void>;
	public getLocations!: (options?: any) => Promise<Location[]>;
	public setLocations!: (locations: Location[], options?: any) => Promise<void>;
	public removeLocation!: (location: Location, options?: any) => Promise<void>;

	public static associations: {
		locations: Association<Organization, Location>;
	};
}

Organization.init(
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
		type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Organization',
	}
);
