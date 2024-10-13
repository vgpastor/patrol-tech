import express, {Request, Response} from "express";
import sequelize from "../db";
import {User} from "../models/User";
import {Organization} from "../models/Organization";
import {v4 as uuidv4} from "uuid";
import {Location} from "../models/Location";
import {Patroller} from "../models/Patroller";
import {Checkpoint} from "../models/Checkpoint";
import crypto from "crypto";
import {Scan} from "../models/Scan";
import {ScanList} from "../entity/ScanList";
import Checkpoints from "./checkpoints";

const router = express.Router();

function generateUniqueIdentifier(): string {
	return crypto.randomBytes(4).toString('hex').toUpperCase();
}

router.put('/organization', async (req: Request, res: Response) => {
	const t = await sequelize.transaction();

	console.log('req.users:', (req as any).user);

	try {
		const { name: orgName, type: orgType, address } = req.body;

		const user = await User.findByPk((req as any).user.id, { transaction: t });
		if (!user) {
			await t.rollback();
			return res.status(404).json({ message: 'User not found' });
		}

		// Crear la organización (el ID se generará automáticamente)
		const organization = await Organization.create({
			id: uuidv4(),
			name: orgName,
			type: orgType
		}, { transaction: t });

		// Crear la ubicación por defecto (el ID se generará automáticamente)
		const location = await Location.create({
			id: uuidv4(),
			address,
			owner: organization.id,
		}, { transaction: t });

		// Asociar la ubicación con la organización
		await organization.addLocation(location, { transaction: t });

		// Vincular el usuario a la organización
		await user.update({ organizationId: organization.id }, { transaction: t });

		await t.commit();

		res.status(200).json({
			message: 'User linked to organization and default location created successfully',
			userId: user.id,
			organizationId: organization.id,
			locationId: location.id,
		});
	} catch (error) {
		await t.rollback();
		console.error('Organization and location creation error:', error);
		res.status(500).json({ message: 'Error linking user to organization and creating location', error });
	}
});

router.put('/organization/:organizationId/patrollers', async (req: Request, res: Response) => {
	const t = await sequelize.transaction();

	try {
		const { organizationId } = req.params;
		const patrollers = req.body.patrollers as Array<{ name: string; email?: string }>;

		// Verificar si la organización existe
		const organization = await Organization.findByPk(organizationId, { transaction: t });
		if (!organization) {
			await t.rollback();
			return res.status(404).json({ message: 'Organization not found' });
		}

		const createdPatrollers = [];

		for (const patrollerData of patrollers) {
			// Generar identificador único
			let identifier: string = generateUniqueIdentifier();
			let isUnique = false;
			while (!isUnique) {
				const existingPatroller = await Patroller.findOne({ where: { identifier }, transaction: t });
				if (!existingPatroller) {
					isUnique = true;
				}else{
					identifier = generateUniqueIdentifier();
				}
			}

			// Crear el nuevo Patroller
			const patroller = await Patroller.create({
				id: uuidv4(),
				name: patrollerData.name,
				identifier,
				email: patrollerData?.email ?? undefined,
				organizationId,
			}, { transaction: t });

			createdPatrollers.push({
				id: patroller.id,
				name: patroller.name,
				identifier: patroller.identifier,
				email: patroller.email,
			});
		}

		await t.commit();

		res.status(201).json({
			message: 'Patrollers registered successfully',
			patrollers: createdPatrollers,
		});
	} catch (error) {
		await t.rollback();
		console.error('Patroller registration error:', error);
		res.status(500).json({ message: 'Error registering patrollers', error });
	}
});

router.put('/location/:locationId/checkpoints', async (req: Request, res: Response) => {
	const t = await sequelize.transaction();

	try {
		const { locationId } = req.params;
		const checkpoints = req.body.checkpoints as Array<{
			name: string;
			category: string;
			tags: string[];
			latitude: number;
			longitude: number;
		}>;

		// Verificar si la ubicación existe
		const location = await Location.findByPk(locationId, { transaction: t });
		if (!location) {
			await t.rollback();
			return res.status(404).json({ message: 'Location not found' });
		}

		const createdCheckpoints = [];

		for (const checkpointData of checkpoints) {
			// Generar identificador único
			let identifier: string = generateUniqueIdentifier();
			let isUnique = false;
			while (!isUnique) {
				const existingCheckpoint = await Checkpoint.findOne({ where: { identifier }, transaction: t });
				if (!existingCheckpoint) {
					isUnique = true;
				}else{
					identifier = generateUniqueIdentifier();
				}
			}

			// Crear el nuevo Checkpoint
			const checkpoint = await Checkpoint.create({
				id: uuidv4(),
				...checkpointData,
				identifier,
				locationId,
			}, { transaction: t });

			createdCheckpoints.push({
				id: checkpoint.id,
				name: checkpoint.name,
				identifier: checkpoint.identifier,
				category: checkpoint.category,
				tags: checkpoint.tags,
				latitude: checkpoint.latitude,
				longitude: checkpoint.longitude,
			});
		}

		await t.commit();

		res.status(201).json({
			message: 'Checkpoints registered successfully',
			checkpoints: createdCheckpoints,
		});
	} catch (error) {
		await t.rollback();
		console.error('Checkpoint registration error:', error);
		res.status(500).json({ message: 'Error registering checkpoints', error });
	}
});

router.get('/organization/list', async (req: Request, res: Response) => {
	try {
		const organizations = await Organization.findAll();
		res.status(200).json(organizations);
	} catch (error) {
		console.error('Error retrieving organizations:', error);
		res.status(500).json({ message: 'Error retrieving organizations', error });
	}
});

router.get('/scans', async (req: Request, res: Response) => {
	try {
		const scans = await Scan.findByOrganizationId((req as any).user.organizationId);

		// Recolectar todos los identificadores únicos
		const checkpointIds = [...new Set(scans.map(scan => scan.tag))];
		const patrollerIds = [...new Set(scans.map(scan => scan.patrollerIdentification))];

		// Hacer una sola consulta para cada modelo
		const [checkpoints, patrollers] = await Promise.all([
			Checkpoint.findAll({ where: { identifier: checkpointIds } }),
			Patroller.findAll({ where: { identifier: patrollerIds } })
		]);

		// Crear mapas para búsqueda rápida
		const checkpointMap = new Map(checkpoints.map(cp => [cp.identifier, cp.name]));
		const patrollerMap = new Map(patrollers.map(p => [p.identifier, p.name]));

		const scanList = scans.map(scan => ({
			checkpointName: checkpointMap.get(scan.tag) ?? scan.tag,
			patrollerName: patrollerMap.get(scan.patrollerIdentification) ?? scan.patrollerIdentification,
			timestamp: scan.timestamp,
		}));

		res.status(200).json(scanList);
	} catch (error) {
		console.error('Error retrieving scans:', error);
		res.status(500).json({ message: 'Error retrieving scans', error: error instanceof Error ? error.message : 'Unknown error' });
	}
});

export default router;
