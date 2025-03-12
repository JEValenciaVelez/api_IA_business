
import { Router } from 'express'
import { postMessage} from '../../controllers/chatBotControllers'
import { getBds, getColumnsTables, getTables } from '../../controllers/dataAnalitics'
import { deleteUser, getUser, postUser, putUser, setActiveUser } from '../../controllers/userController'



const userRoutes : Router = Router()



userRoutes.post('/user', postUser )
userRoutes.get('/user', getUser )
userRoutes.put('/user', putUser )
userRoutes.get('/setActiveUser', setActiveUser )
userRoutes.get('/deleteUser', deleteUser)
// router.delete('/users/:id', deleteUser)
// router.put('/users/:id', putUser)


export default userRoutes