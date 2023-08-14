import express from 'express'
import userController from '../controller/userController.js'
import {auth} from '../middleware/auth.js'
import upload from '../Utils/multer.js'
const userRoutes =express.Router()

userRoutes.post('/post',auth,upload.array('file'),userController.createPost)
userRoutes.get('/getAllPosts',auth,userController.getAllPosts)

//Comment
userRoutes.post('/commentPost',auth,userController.commentPost)
userRoutes.get('/getAllComments/:id',auth,userController.getAllComments)

//Like
userRoutes.get('/like/:id',auth,userController.like)

//SavedPost
userRoutes.get('/savedpost/:id',auth,userController.savedpost)
userRoutes.get('/getAllSavedPosts',auth,userController.getAllSavedPosts)

//deletePost
userRoutes.delete('/deletePost/:id',auth,userController.deletePost)

//reportPost
userRoutes.put('/reportPost',auth,userController.reportPost)

//userProfile
userRoutes.get('/userProfile/:id',auth,userController.userProfile)
userRoutes.get('/userDetail/:id',auth,userController.userDetail)

//userEditPost
userRoutes.post('/editPost',auth,userController.editPost)

//logout
userRoutes.get('/logout/:id',userController.logout)
export default userRoutes 