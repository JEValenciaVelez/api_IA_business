import { Request, Response} from  'express'
import { analitixData } from '../../config/gpt.config'

export async function dataProtection (req: Request, res: Response) {
    try{
        const {data, idUser} = req.body
        if(!idUser){
            return res.status(400).json({error: 'Debe proveer el id del usuario'})
        }
        const proccess = await analitixData(data, idUser)
        res.json(proccess)
    }catch(err){
        console.error(err)
        res.status(500).json({error: `${err}`})
    }
}