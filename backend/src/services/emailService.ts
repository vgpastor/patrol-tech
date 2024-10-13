import nodemailer from "nodemailer";
import { User } from "../models/User";

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

export const sendPasswordEmail = async (user: User, password: string): Promise<void> => {
	const mailOptions = {
		from: '"PatrolTech" <info@patroltech.online>',
		to: user.email,
		subject: "Your New Account Password",
		text: `Your account has been created successfully. Your temporary password is: ${password}. Please change this password after your first login.`,
		html: `<p>Your account has been created successfully.</p><p>Your temporary password is: <strong>${password}</strong></p><p>Please change this password after your first login.</p>`,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Password email sent successfully", info.messageId);
	} catch (error) {
		console.error("Error sending password email:", error);
		throw new Error("Failed to send password email");
	}
};
