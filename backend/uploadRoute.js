import { uploadMiddleware } from "./middleware.js";
import express from 'express'

export function configureRoutes(app) {
  app.post('/upload', uploadMiddleware, (req, res) => {
    const fileUrl = req.file.location
    res.status(200).json({message: 'File uploaded sucessfully', fileUrl})
  })
}