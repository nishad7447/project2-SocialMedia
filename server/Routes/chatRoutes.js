import express from 'express'
import {auth} from '../middleware/auth.js'
import chatController from '../controller/chatController.js'

const chatRoutes=express.Router()

chatRoutes.post('/search',chatController.search)
chatRoutes.post('/',auth,chatController.accessChat )
chatRoutes.get('/',auth,chatController.fetchChat )
chatRoutes.post('/group',auth,chatController.createGroupChat )
chatRoutes.put('/rename',auth,chatController.renameGroup )
chatRoutes.put('/groupRemove',auth,chatController.removeFromGroup )
chatRoutes.put('/groupAdd',auth,chatController.addToGroup )



export default chatRoutes
