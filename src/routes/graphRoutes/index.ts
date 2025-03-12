import { Router} from 'express'
import { getSalesChart } from '../../controllers/chartController'
import generateGraphs from '../../controllers/graphs'


const graphRouter : Router = Router()


graphRouter.post('/graphs', generateGraphs)

export default graphRouter