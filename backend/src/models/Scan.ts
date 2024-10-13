import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import {v4 as uuidv4} from "uuid";

interface ScanAttributes {
    id?: string;
    timestamp: Date;
    organizationId: string;
    patrollerIdentification: string;
    tag: string;
    location: string;
    status: string;
}

export class Scan extends Model<ScanAttributes> implements ScanAttributes {
    public id!: string;
    public timestamp!: Date;
    public location!: string;
    public status!: string;
    public organizationId!: string;
    public patrollerIdentification!: string;
    public tag!: string;

    static async findByOrganizationId(organizationId: string) {
        return await this.findAll({where: {organizationId}, order: [['timestamp', 'DESC']], limit: 10});
    }
}

Scan.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        location: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        organizationId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        patrollerIdentification: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tag: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'Scan',
    }
);
