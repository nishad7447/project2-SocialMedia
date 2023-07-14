import express from 'express';
import { register,login,forgotPass, getUser} from '../controller/userAuth.js';
import {auth} from '../middleware/auth.js';
const authRoutes = express.Router();

authRoutes.get('/',auth,getUser)
authRoutes.post('/signup',register)
authRoutes.post('/login',login)
authRoutes.post('/forgot-pass',forgotPass)


export default authRoutes;