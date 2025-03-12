import { Request, Response }  from 'express'
import { getProccessService, postProccessService, setMatchService } from '../services/proccessServices'




export const postProccess = async (req : Request , res : Response )  => {
  try {
    const data = req.body;
    const result = await postProccessService(data);
    res.status(201).json(result); // 201 Created si todo sale bien
} catch (error) {
    console.error((error as Error).message);
    res.status(500).json({ message:(error as Error).message }); // 500 Internal Server Error en caso de error
}
}


export const getProccess = async (req: Request, res: Response) => {
    try {
      const id = req.query.id ? parseInt(req.query.id as string, 10) : undefined
      const response = await getProccessService(id)
      res.status(200).json(response)
    } catch (error) {
      res.status(500).json({ error: `${error}` })
    }
}

export const setMatch = async (req: Request, res: Response) => {
    try {
      const id = req.query.id ? parseInt(req.query.id as string, 10) : null
      if (id === null || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' })
      }
      const response = await setMatchService(id)
      res.status(200).json(response)
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while setting the user as active' })
    }
  }
  