import {Model, DataTypes, FindOptions} from 'sequelize';
import sequelize from '../db';
import {v4 as uuidv4} from "uuid";
import {PaginatedResults} from "../shared/domain/PaginatedResults";
import {ScanList} from "../entity/ScanList";
import {PaginationOptions} from "../shared/domain/PaginationOptions";
import {Location} from "./Location";
import {Organization} from "./Organization";

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

    static async findByOrganizationId(
        organizationId: string,
        { page = 1, limit = 10 }: PaginationOptions  = { page : 1, limit : 10 }
    ):
        Promise<PaginatedResults<Scan>>{

        const offset = (page - 1) * limit;

        const options: FindOptions = {
            limit,
            offset,
            where: { organizationId },
            order: [['timestamp', 'DESC']],
        };

        const { count, rows } = await this.findAndCountAll(options);

        return {
            results: rows,
            count,
            totalPages: Math.ceil(count / limit),
        };
    }

    static async findFiltered(
        organizationId: string,
        checkPointId: string | null = null,
        patrollerId: string | null = null,
        { page = 1, limit = 10 }: PaginationOptions  = { page : 1, limit : 10 }
    ):Promise<PaginatedResults<Scan>> {

        const offset = (page - 1) * limit;

        const where: any = { organizationId };

        if (checkPointId && checkPointId !== 'null') {
            where.tag = checkPointId;
        }

        if (patrollerId && patrollerId !== 'null') {
            where.patrollerIdentification = patrollerId;
        }

        const options: FindOptions = {
            limit,
            offset,
            where: where,
            order: [['timestamp', 'DESC']],
        };

        const {count, rows} = await this.findAndCountAll(options);

        return {
            results: rows,
            count,
            totalPages: Math.ceil(count / limit),
        };
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
