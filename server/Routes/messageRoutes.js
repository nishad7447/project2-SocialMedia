import express from 'express'
import { auth } from '../middleware/auth.js'
import messageController from '../controller/messageController.js'

const messageRoutes=express.Router()

messageRoutes.post('/',auth,messageController.sendMessage)
messageRoutes.get('/:chatId',auth,messageController.allMessages)

export default messageRoutes