import express from 'express'
import adminController from '../controller/adminController.js'
import { auth } from '../middleware/auth.js'

const adminRoutes=express.Router()

adminRoutes.get('/',auth,adminController.verifyAdmin)
adminRoutes.post('/login',adminController.login)

export default adminRoutes