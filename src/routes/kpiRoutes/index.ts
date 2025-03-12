import { Router } from 'express'
import { createKPI, getAllKPIs, getKPIById } from '../../controllers/kpiControllers'

const kpiRoutes : Router = Router()

kpiRoutes.get('/kpis', getAllKPIs)
kpiRoutes.get("/kpis/:id", getKPIById)
kpiRoutes.post("/createKpi", createKPI)


export default kpiRoutes