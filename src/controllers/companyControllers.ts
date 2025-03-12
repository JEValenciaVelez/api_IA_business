import {Request, Response}  from 'express'
import { deleteCompanyService, getCompanyService, postcompany, putCompanyService } from '../services/companyServices'

export const postCompanyController = async (req : Request , res : Response )  => {
    const response = await postcompany(req.body)
    return res.json(response)
}

export const getCompany = async (req : Request, res : Response) => {
    const id = req.query.id ? parseInt(req.query.id as string, 10) : undefined
    const response = await getCompanyService(id)
    return res.json(response)
}

export const putCompany = async (req : Request , res : Response) => {
    const id = parseInt(req.query.id as string, 10) 
    if(!id) return res.send('Debe proveer id')
    const response = await putCompanyService(id, req.body)
    return res.json(response)
}

export const deleteCompanyControllers = async (req: Request, res: Response) => {
    try {
      const id = req.query.id ? parseInt(req.query.id as string, 10) : null
      if (id === null || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' })
      }
      const response = await deleteCompanyService(id)
      res.status(200).json(response)
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while setting the user as active' })
    }
  }