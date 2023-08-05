import express from 'express'
import adminController from '../controller/adminController.js'
import { auth } from '../middleware/auth.js'

const adminRoutes=express.Router()

adminRoutes.get('/',auth,adminController.verifyAdmin)
adminRoutes.post('/login',adminController.login)

//UserManagement
adminRoutes.get('/allUsers',auth,adminController.allUsers)
adminRoutes.put('/userBlockOrUnblock',auth,adminController.userBlockOrUnblock)


export default adminRoutes