import express from 'express';
import { register,login,forgotPass} from '../controller/userAuth.js';
const authRoutes = express.Router();

authRoutes.post('/signup',register)
authRoutes.post('/login',login)
authRoutes.post('/forgot-pass',forgotPass)

export default authRoutes;