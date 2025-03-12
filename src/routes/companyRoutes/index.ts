import { Router } from 'express';
import { getCompany, postCompanyController, putCompany } from '../../controllers/companyControllers';

const companyRoutes : Router = Router()

companyRoutes.post('/company', postCompanyController)
companyRoutes.get('/company', getCompany)
companyRoutes.put('/company', putCompany)
companyRoutes.delete('/company', putCompany)


export default companyRoutes