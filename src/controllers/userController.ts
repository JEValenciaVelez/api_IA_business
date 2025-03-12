import { Request, Response } from 'express'
import { deleteUserService, getUserServices, postUserServices, putUserService, setUserService } from '../services/userServices'

export const postUser = async (req: Request, res: Response) => {
  try {
    const response = await postUserServices(req.body)
    res.status(201).json(response)
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the user' })
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.query.id ? parseInt(req.query.id as string, 10) : null
    const response = await getUserServices(id)
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the user(s)' })
  }
}

export const putUser = async (req: Request, res: Response) => {
  try {
    const id = req.query.id ? parseInt(req.query.id as string, 10) : null
    if (id === null) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }
    const response = await putUserService(id, req.body)
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the user' })
  }
}

export const setActiveUser = async (req: Request, res: Response) => {
  try {
    const id = req.query.id ? parseInt(req.query.id as string, 10) : null
    if (id === null || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }
    const response = await setUserService(id)
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while setting the user as active' })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.query.id ? parseInt(req.query.id as string, 10) : null
    if (id === null || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }
    const response = await deleteUserService(id)
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while setting the user as active' })
  }
}