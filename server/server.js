import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose' 
import cors from 'cors'
import morgan from 'morgan'
import helmet  from 'helmet'
import path  from 'path'
import {fileURLToPath} from 'url'
import dotenv from 'dotenv'
import authRoutes from './Routes/authRoutes.js'
import userRoutes from './Routes/userRoutes.js'
import errorHandler from './middleware/errorHandler.js'

// config
const __filename=fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}))
app.use(morgan('common'))
app.use(bodyParser.json({limit:'30mb',extended:true}))
app.use(bodyParser.urlencoded({limit:'30',extended:true}))
app.use(cors())
app.use('/assets',express.static(path.join(__dirname,'public/assets')))
app.use(errorHandler);
app.use('/auth',authRoutes)
app.use('/',userRoutes)

//monogdb
mongoose.connect(process.env.MONGO_URL,{
    // useNewUrlParse:true,
    useUnifiedTopology:true,
})
.then(()=>{console.log('DB connected');})
.catch((err)=>{console.log(err,'DB error');})



const port=process.env.PORT 
app.listen(port,()=>{console.log(`Server running on port ${port}`)})
