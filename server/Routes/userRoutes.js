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
userRoutes.delete('/deleteComment/:id',auth,userController.deleteComment)

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
userRoutes.put('/editUser',auth,upload.array('file'),userController.editUser)
userRoutes.put('/editUserPass',auth,userController.editUserPass)
userRoutes.put('/deactivateUserAcc',auth,userController.deactivateUserAcc)

//ad and payment
userRoutes.post('/createOrder',auth,userController.createOrder)
userRoutes.post('/createAd',auth,upload.array('file'),userController.createAd)

//userEditPost
userRoutes.post('/editPost',auth,userController.editPost)

//follow
userRoutes.post('/follow',auth,userController.follow)

//unfollow
userRoutes.post('/unfollow',auth,userController.unfollow)

//followersPage
userRoutes.get('/getFollowers/:id',auth,userController.getFollowers)

//followingPage
userRoutes.get('/getFollowings/:id',auth,userController.getFollowings)

//notification
userRoutes.get('/notifications',auth,userController.notifications)
userRoutes.get('/removeMsgCount/:id',auth,userController.removeMsgCount)

//clear clearAllNotifi
userRoutes.get('/clearAllNotifi',auth,userController.clearAllNotifi)

//DelAllNotifi
userRoutes.get('/delAllNotifi',auth,userController.delAllNotifi)


//logout
userRoutes.get('/logout/:id',userController.logout)
export default userRoutes 