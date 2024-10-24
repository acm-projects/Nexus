import express from "express"
import dotenv from 'dotenv'
import cors from "cors"
import { Server } from "socket.io"
import { createServer} from 'http'
import multer from "multer"
import multerS3 from "multer-s3"
import register from './api/auth.js'
import login from './api/auth.js'
import chatRoutes from './api/chatRoutes.js';
import onboarding from './api/auth.js'
import { configureRoutes } from "./uploadRoute.js"
import { configureSocket } from "./socket.js"
import addCategory from './api/gradeCalculator.js'
import addAssignment from './api/gradeCalculator.js'
import calculateGrade from './api/gradeCalculator.js'
import getCourses from './api/gradeCalculator.js'
import getOnboardedCourses from './api/misc.js' 

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

configureSocket(io)
configureRoutes(app)

app.use(cors( {
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );
  next();
});

app.use(express.json())


app.use('/api/auth', register)
app.use('/api/auth', login)
app.use('/api/auth', onboarding)
app.use('/api/chat', chatRoutes)
app.use('/api/gradeCalculator', addCategory)
app.use('/api/gradeCalculator', addAssignment)
app.use('/api/gradeCalculator', calculateGrade)
app.use('/api/gradeCalculator', getCourses)
app.use('/api/misc', getOnboardedCourses)




const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`)
});

