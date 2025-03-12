import { Request, Response} from 'express'
import jwt from 'jsonwebtoken'


import { JWT_SECRET } from '../../config/envs'
import { AppDataSource } from '../../config/data-source'
import { User } from '../../models/User'
import { Company } from '../../models/Company'

export async function login (req : Request, res : Response) {

    const secret = JWT_SECRET as string
    const { email, password } = req.body

    if(!email || !password) return res.status(400).json({error : 'Debe proveer email y password'})
    
    //verificar en base de datos si elo usuario existe
    const user = await AppDataSource.getRepository(User).findOne({
        where: {
            email
        }
    })

    // obtener compañia del usuario
    const company = await AppDataSource.getRepository(Company).findOne({
        where: {
            userId : user?.id
        }
    })

    if(!user) return res.status(404).json({error: 'Usuario no encontrado'})

    //verificar password
    if(user.password !== password) return res.status(401).json({error: 'Password incorrecto'})
    
    //crear token
    const token = jwt.sign({
        id: user.id,
        email: user.email
    }, secret)

   return res.status(200).json(
    {
    user ,
    company,
    token
    }
    )

}