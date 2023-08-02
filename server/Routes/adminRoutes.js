import express from 'express'
import adminController from '../controller/adminController.js'
import { auth } from '../middleware/auth.js'

const adminRoutes=express.Router()

adminRoutes.post('/login',adminController.login)

export default adminRoutes