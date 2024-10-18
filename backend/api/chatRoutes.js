import express from "express";
import { fetchMessages } from "../utils/awsConfig.js";

const router = express.Router()

router.get('/messages/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params
    const { limit } = req.query
    const messages = await fetchMessages(roomId, limit ? parseInt(limit) : 50)

    res.json(messages)
  }
  catch (error) {
    console.error('Error fetching messages: ', error)
    res.status(500).json({error: 'An error occurred while fetching messages'})
  }
})

export default router