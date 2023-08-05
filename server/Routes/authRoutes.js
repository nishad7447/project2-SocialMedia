import express from 'express';
import { register,login,forgotOtpSend,forgotOtpSubmit ,forgotPass, getUser,googleSignUp,googleSignIn,emailResetPass} from '../controller/userAuth.js';
import {auth} from '../middleware/auth.js';
const authRoutes = express.Router();

authRoutes.get('/',auth,getUser)
authRoutes.post('/signup',register)
authRoutes.post('/login',login)
authRoutes.post('/forgot-otpSend',forgotOtpSend)
authRoutes.post('/forgot-otpSubmit',forgotOtpSubmit)
authRoutes.post('/forgot-pass',forgotPass)
authRoutes.get("/password-reset/:userId/:token",emailResetPass)
authRoutes.post('/googleSignUp',googleSignUp)
authRoutes.post('/googleSignIn',googleSignIn)


export default authRoutes;