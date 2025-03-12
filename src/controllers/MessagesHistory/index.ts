import { Request, Response } from 'express'
import { MessageHistoryService } from '../../services/messagesServices/index';


const messageHistory = new MessageHistoryService()

export async function getMessages(req: Request, res: Response) {
    
    try {
        const { idUser } = req.query;
        //validar que venga idUser
        if (!idUser) {
            return res.status(404).send('Debe proveer usuario');
        }
        const data = await messageHistory.getMessages(Number(idUser))
        return res.status(200).json(data)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: `${err}` });
    }
}



