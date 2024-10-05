import express, { Request, Response } from 'express';
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { Location } from '../models/Location';
import sequelize from '../db';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import {Patroller} from "../models/Patroller";
import {Checkpoint} from "../models/Checkpoint";

const router = express.Router();

function generateRandomPassword(length: number = 12): string {
	return crypto.randomBytes(length).toString('hex').slice(0, length);
}

function generateUniqueIdentifier(): string {
	return crypto.randomBytes(4).toString('hex').toUpperCase();
}


router.post('/register', async (req: Request, res: Response) => {
	try {
		const { id, name, email } = req.body;

		// Verificar si el usuario ya existe
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' });
		}

		// Generar contraseña aleatoria
		const randomPassword = generateRandomPassword();

		// Crear nuevo usuario
		const newUser = await User.create({ id, name, email, password: randomPassword });

		// Aquí deberías enviar un correo electrónico al usuario con su contraseña
		// Por ahora, solo lo incluiremos en la respuesta (no hacer esto en producción)
		res.status(201).json({
			message: 'User registered successfully',
			userId: newUser.id,
		});
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({ message: 'Error registering user', error });
	}
});

router.put('/register/:userId/organization', async (req: Request, res: Response) => {
	const t = await sequelize.transaction();

	try {
		const { userId } = req.params;
		const { name: orgName, type: orgType, address } = req.body;

		// Verificar si el usuario existe
		const user = await User.findByPk(userId, { transaction: t });
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

router.put('/register/:organizationId/patrollers', async (req: Request, res: Response) => {
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

router.put('/register/:locationId/checkpoints', async (req: Request, res: Response) => {
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



export default router;
