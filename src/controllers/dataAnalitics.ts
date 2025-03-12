import { Request, Response}  from 'express'
import { getBdsServices, getColumnsTablesServices, getTablesServices } from '../services/dataAnaliticsServices'
import { Company } from '../models/Company'




export const getBds = async ( req : Request , res : Response)  => {
    const response = await getBdsServices(Number(req.query.userId))
    return res.json({response})
}

export const getTables = async (req : Request , res : Response ) => {
    const response = await getTablesServices(String(req.query.db), req.body.company as unknown as Company)
    return res.json({response})
}

export const getColumnsTables = async (req : Request , res : Response ) => {
    const response = await getColumnsTablesServices(String(req.query.db), String(req.query.table),req.body.company as unknown as Company)
    return res.json({response})
}