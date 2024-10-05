import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import {User} from "../models/User";

// Configuración del cliente SES
const sesClient = new SESClient({
	region: process.env.AWS_REGION || "us-west-2", // Asegúrate de configurar la región correcta
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
	}
});

export const sendPasswordEmail = async (user: User, password: string): Promise<void> => {
	const params = {
		Destination: {
			ToAddresses: [user.email]
		},
		Message: {
			Body: {
				Html: {
					Charset: "UTF-8",
					Data: `<p>Your account has been created successfully.</p><p>Your temporary password is: <strong>${password}</strong></p><p>Please change this password after your first login.</p>`
				},
				Text: {
					Charset: "UTF-8",
					Data: `Your account has been created successfully. Your temporary password is: ${password}. Please change this password after your first login.`
				}
			},
			Subject: {
				Charset: "UTF-8",
				Data: "Your New Account Password"
			}
		},
		Source: "your_verified_email@example.com" // Este debe ser un correo verificado en SES
	};

	try {
		const command = new SendEmailCommand(params);
		const response = await sesClient.send(command);
		console.log("Password email sent successfully", response.MessageId);
	} catch (error) {
		console.error("Error sending password email:", error);
		throw new Error("Failed to send password email");
	}
};
