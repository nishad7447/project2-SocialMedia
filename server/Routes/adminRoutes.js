import express from 'express'
import adminController from '../controller/adminController.js'
import { auth } from '../middleware/auth.js'
import userController from '../controller/userController.js'

const adminRoutes=express.Router()

adminRoutes.get('/',auth,adminController.verifyAdmin)
adminRoutes.post('/login',adminController.login)

//UserManagement
adminRoutes.get('/allUsers',auth,adminController.allUsers)
adminRoutes.put('/userBlockOrUnblock',auth,adminController.userBlockOrUnblock)
adminRoutes.get('/allposts',auth,adminController.allposts)

//postManagement
adminRoutes.delete('/deletePost/:id',auth,userController.deletePost)


export default adminRoutes