import express from "express";
import { fetchMessages, dynamodb, s3, getChatRoom, saveMessage } from "../utils/awsConfig.js";
//import upload from "../utils/s3uploadHandler.js";
import { getSectionChatRooms } from "../utils/onboardingHelpers.js";

const router = express.Router()

router.get('/messages/:roomId', async (req, res) => {
  try {
      const { roomId } = req.params;
      const { limit } = req.query;
      
      if (!roomId) {
          return res.status(400).json({ error: 'Room ID is required' });
      }

      const messages = await fetchMessages(roomId, limit ? parseInt(limit) : 50);
      console.log(`Fetched ${messages.length} messages for room ${roomId}`); // Debug log
      
      res.json(messages); // Return messages array directly
  }
  catch (error) {
      console.error('Error fetching messages: ', error);
      res.status(500).json({error: 'An error occurred while fetching messages'});
  }
});

router.post('/messages', async (req, res) => {
  try {
    const { roomId, userId, message, type = 'text' } = req.body;
    
    // Validate required fields
    if (!roomId || !userId || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { roomId, userId, message }
      });
    }

    // Save the message to DynamoDB
    await saveMessage(roomId, userId, message, type);

    res.status(200).json({ 
      success: true, 
      message: 'Message saved successfully',
      data: { roomId, userId, message, type }
    });
  } catch (error) {
    console.error('Error saving message: ', error);
    res.status(500).json({ error: 'An error occurred while saving the message' });
  }
});

router.get('/chatroom/:roomId', async (req, res) => {
  const { roomId } = req.params;

  try {
    const chatRoom = await getChatRoom(roomId);
    return res.status(200).json(chatRoom);
  } catch (error) {
    console.error(`Error retrieving chat room: ${error}`);
    return res.status(500).json({ message: 'Unable to retrieve chat room', error: error.message });
  }
});

/*
router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { roomId, userId } = req.body;
  const imageUrl = req.file.location;

  try {
    await saveMessage(roomId, userId, imageUrl, 'image');
    res.status(200).json({ message: 'File uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'An error occurred while saving the message' });
  }
});
*/

router.get('/sectionChatRooms/:userId', getSectionChatRooms);

export default router