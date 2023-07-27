import express from 'express'
import userController from '../controller/userController.js'
import {auth} from '../middleware/auth.js'
import upload from '../Utils/multer.js'
const userRoutes =express.Router()

userRoutes.post('/post',auth,upload.array('file'),userController.createPost)
userRoutes.get('/getAllPosts',userController.getAllPosts)

export default userRoutes 