import { Router } from 'express'
import { getProccess, postProccess, setMatch } from '../../controllers/proccesController'

const proccessRoutes : Router = Router()

proccessRoutes.get('/proccess', getProccess)
proccessRoutes.post('/proccess', postProccess)
proccessRoutes.get('/matchProccess', setMatch)


export default proccessRoutes