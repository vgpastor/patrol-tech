import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';

interface ScanAttributes {
    id?: number;
    timestamp: Date;
    location: string;
    status: string;
}

export class Scan extends Model<ScanAttributes> implements ScanAttributes {
    public id!: number;
    public timestamp!: Date;
    public location!: string;
    public status!: string;
}

Scan.init(
    {
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Scan',
    }
);
