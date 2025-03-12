import { Router } from 'express'
import { getHistory, postMessage, postMessageBedrock, postMessageClaude} from '../../controllers/chatBotControllers'
import { getBds, getColumnsTables, getTables } from '../../controllers/dataAnalitics'

const IAroutes : Router = Router()

IAroutes.post('/responseAiGpt', postMessage )
IAroutes.post('/responseAiClaude', postMessageClaude )
IAroutes.post('/responseAiBedrock', postMessageBedrock )
IAroutes.get('/bds', getBds )
IAroutes.get('/tables', getTables )
IAroutes.get('/ColumnsTables', getColumnsTables )
IAroutes.get('/history',  getHistory)


export default IAroutes