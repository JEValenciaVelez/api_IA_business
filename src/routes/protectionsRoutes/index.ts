import {  Router } from 'express'
import { dataProtection } from '../../controllers/proyecciones'


const protectionsRoutes : Router = Router()

protectionsRoutes.post('/analitixData', dataProtection)

export default protectionsRoutes