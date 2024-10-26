import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from 'http';
import multer from "multer";
import multerS3 from "multer-s3";
import authRoutes from './api/auth.js'; 
import chatRoutes from './api/chatRoutes.js';
import { configureRoutes } from "./uploadRoute.js";
import { configureSocket } from "./socket.js";
//import { addCategory, addAssignment, calculateGrade, getCourses } from './api/gradeCalculator.js';
import gradeCalculatorRoutes from './api/gradeCalculator.js'; 
import getOnboardedCourses from './api/misc.js';
import uploadRoutes from './api/fileUploadRoute.js'; 

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",//might need to use http://localhost:5173
    methods: ["GET", "POST"]
  }
});

configureSocket(io); 
configureRoutes(app); 

app.use(cors({
  origin: '*',//or http://localhost:5173
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );
  next();
});

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/gradeCalculator', gradeCalculatorRoutes);
//app.use('/api/gradeCalculator', addCategory);
//app.use('/api/gradeCalculator', addAssignment);
//app.use('/api/gradeCalculator', calculateGrade);
//app.use('/api/gradeCalculator', getCourses);
app.use('/api/misc', getOnboardedCourses);
app.use('/api/upload',uploadRoutes );

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
