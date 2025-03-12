import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"; // Asegúrate de tener instalada esta dependencia
import boom from "@hapi/boom"; // Si usas boom, asegúrate de tenerlo instalado
import { API_KEY, JWT_SECRET } from "../config/envs"; // JWT_SECRET debe estar en las variables de entorno

// Middleware de autenticación con API key
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['api-key'] as string; // Añadido casting explícito
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }
        if (authHeader !== API_KEY) {
            return res.status(401).json({ message: 'No autorizado' });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Middleware de verificación de JWT
export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers['token'] as string
       
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const secret = JWT_SECRET as string// JWT_SECRET debe estar definida en las variables de entorno

        // Verificación del token
        jwt.verify(token, secret, (err, payload) => {
            if (err) {
                return next(boom.unauthorized('Invalid token'));
            }

           
            next();
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
