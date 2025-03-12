import { Router } from 'express'
import { getMessages } from '../../controllers/MessagesHistory'

const messageHistoryRoutes: Router = Router()

messageHistoryRoutes.get('/messages', getMessages )


export default messageHistoryRoutes