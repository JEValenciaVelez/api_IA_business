
import { Request, Response } from 'express';
import { getMessagesHistory, getResponseIA, getResponseIAClaude } from '../services/chatBotServices';
import { iaBedrock } from '../config/bedrockAI.config';
import { createMessage } from '../functions';

export const postMessage = async (req: Request, res: Response) => {
    // Obtenemos la respuesta de la IA
    const rawResponse = await getResponseIA(req.body.message, req.body.databaseSchema, req.body.userId);

    // Validar si viene id por query y sino devolver el status de error al cliente
    if (!req.query.id) {
        return res.status(400).json({ error: 'No id provided' });
    }
    if (!req.body.message) {
        return res.status(400).json({ error: 'No message provided' });
    }

    

    // Verificar si `rawResponse` es un string o un objeto IAResponse
    let responseText: string;
    if (typeof rawResponse === 'string') {
        responseText = rawResponse;
    } else {
        responseText = rawResponse.response;
    }

    // Crear el objeto dataMessage con el texto de respuesta correcto
    const dataMessage = {
        prompt: req.body.message,
        response: responseText, // Ahora usamos el texto de respuesta correcto
        messageType: 'system',
        userId: req.query.id as string, // Conversión si id es siempre un string
    };


    const test = req.body.test;

    if (test) {
        return res.json(rawResponse);
    }

    // Crear mensaje
    await createMessage(dataMessage);

    return res.json(rawResponse);
};


export const postMessageClaude = async (req : Request, res : Response) => {
    const response = await getResponseIAClaude(req.body.message, req.body.databaseSchema)
    return res.json({response})
}

export const postMessageBedrock = async (req : Request, res : Response) => {
    const response = await iaBedrock()
    return res.json({response})
}


export const getHistory = async (req: Request, res: Response) => {
    try {
        // Obtenemos idUser de req.query
        const { idUser } = req.query;

        // Verificamos que idUser exista y que sea un string convertible a número
        if (!idUser || Array.isArray(idUser) || isNaN(Number(idUser))) {
            return res.status(400).json({ message: "El idUser es requerido y debe ser un número válido" });
        }

        // Convertimos idUser a número
        const numericIdUser = Number(idUser);

        // Obtenemos el historial de mensajes con el idUser convertido
        const response = await getMessagesHistory(numericIdUser);

        // Devolvemos la respuesta
        return res.json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
