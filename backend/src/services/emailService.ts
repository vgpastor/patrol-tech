import nodemailer from "nodemailer";
import { User } from "../models/User";
import * as fs from "node:fs";

// Configuración del cliente SMTP
const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: parseInt(process.env.SMTP_PORT || "587"),
	secure: process.env.SMTP_SECURE === "true",
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD,
	},
});

const sendCreateAccountEmail = async (user: User, password: string): Promise<void> => {
	let html = fs.readFileSync("assets/emails/new-account.html", "utf8");
	html = parseContent(html, { password, email: user.email, name: user.name });

	let text = fs.readFileSync("assets/emails/new-account.txt", "utf8");
	text = parseContent(text, { password, email: user.email, name: user.name });


	const mailOptions = {
		from: '"PatrolTech" <info@patroltech.online>',
		to: user.email,
		subject: "Bienvenido a PatrolTech",
		text: text,
		html: html,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Password email sent successfully", info.messageId);
	} catch (error) {
		console.error("Error sending password email:", error);
		throw new Error("Failed to send password email");
	}
};

const sendRecoverPasswordEmail = async (user: User, password: string): Promise<void> => {
	let html = fs.readFileSync("assets/emails/recover-password.html", "utf8");
	html = parseContent(html, { password, email: user.email, name: user.name });

	let text = fs.readFileSync("assets/emails/recover-password.txt", "utf8");
	text = parseContent(text, { password, email: user.email, name: user.name });

	const mailOptions = {
		from: '"PatrolTech" <info@patroltech.online>',
		to: user.email,
		subject: "Recuperación de contraseña",
		text: text,
		html: html,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Password email sent successfully", info.messageId);
	} catch (error) {
		console.error("Error sending password email:", error);
		throw new Error("Failed to send password email");
	}
}

export { sendCreateAccountEmail, sendRecoverPasswordEmail };

function parseContent(content: string, data: any): string {
	let parsedContent = content;
	for (const key in data) {
		parsedContent = parsedContent.replace(`{{${key}}}`, data[key]);
	}
	return parsedContent;
}
