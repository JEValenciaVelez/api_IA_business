import { Router } from 'express'
import userRoutes from './userRoutes'
import IAroutes from './IAroutes'
import companyRoutes from './companyRoutes'
import proccessRoutes from './proccessRoutes/index';
import { exportQuery } from '../controllers/exports';
import kpiRoutes from './kpiRoutes';
import graphRouter from './graphRoutes';
import protectionsRoutes from './protectionsRoutes';
import messageHistoryRoutes from './messagesHistoryRoutes/index';

const router : Router = Router()

router.post('/exportQuery', exportQuery)
router.use('/', userRoutes )
router.use('/', IAroutes )
router.use('/', companyRoutes )
router.use('/', proccessRoutes )
router.use('/', kpiRoutes )
router.use('/', graphRouter )
router.use('/', protectionsRoutes )
router.use('/', messageHistoryRoutes )

export default router