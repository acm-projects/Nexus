import { getUserData, getUserCourses, generateRoomName } from "./utils/onboardingHelpers.js";
import { saveMessage, fetchMessages } from "./utils/awsConfig.js";

/*export function configureSocket(io) {
  io.on('connection', async (socket) => {
    const userId = socket.handshake.query.userId;
    const roomId = socket.handshake.query.roomId; 
    //const username = socket.handshake.query.username;

    

    console.log(`User ${userId} connecting to room ${roomId}`); 

    // Join the room directly using the roomId from the query
    if (roomId) {
      socket.join(roomId);
    }

    socket.on('chatMessage', async (data) => {
      try {
        const { roomId, userId, message, username} = data;
        
        // Save message with consistent structure
        await saveMessage(roomId, userId, message, 'text', username);
        
        // Emit to room with same structure as saved message
        io.to(roomId).emit('message', {
          messageId: Date.now().toString(),
          roomId,
          userId,
          username,
          message,
          timestamp: new Date().toISOString(),
          type: 'text'
        });

      } catch (error) {
        console.error('Error handling chat message:', error);
      }
    });

    socket.on('disconnect', () => {
      if (roomId) {
        socket.leave(roomId);
        //console.log(`User ${username} disconnected from room ${roomId}`);
      }
    });
  });
}

export function configureSocket(io) {
  io.on('connection', async (socket) => {
    const userId = socket.handshake.query.userId;
    const roomId = socket.handshake.query.roomId;

    // Fetch user data from OnboardingDB when socket connects
    let userData;
    try {
      userData = await getUserData(userId);
      console.log(`User ${userData.username} connecting to room ${roomId}`);
    } catch (error) {
      console.error('Error fetching user data:', error);
      return;
    }

    // Join the room if roomId is provided
    if (roomId) {
      socket.join(roomId);
    }

    socket.on('chatMessage', async (data) => {
      try {
        const { roomId, userId, message } = data;
        
        // Use username from userData fetched at connection
        const messageData = {
          messageId: `${Date.now()}-${userId}`,
          roomId,
          userId,
          username: userData.username, // Use username from OnboardingDB
          message,
          timestamp: new Date().toISOString(),
          type: 'text'
        };
        
        // Save message with username
        await saveMessage(
          messageData.roomId,
          messageData.userId,
          messageData.message,
          messageData.type,
          messageData.username // Pass username to saveMessage
        );
        
        // Emit to room with complete message data
        io.to(roomId).emit('message', messageData);

      } catch (error) {
        console.error('Error handling chat message:', error);
        socket.emit('messageError', { error: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      if (roomId) {
        socket.leave(roomId);
        console.log(`User ${userData?.username} disconnected from room ${roomId}`);
      }
    });

    // Handle file uploads with username
    socket.on('fileUploaded', (data) => {
      const { room, fileUrl } = data;
      io.to(room).emit('fileUploaded', { 
        userId,
        username: userData.username,
        fileUrl,
        timestamp: new Date().toISOString()
      });
    });
  });
}*/

export function configureSocket(io) {
  io.on('connection', async (socket) => {
    const userId = socket.handshake.query.userId;
    const roomId = socket.handshake.query.roomId;
    const username = socket.handshake.query.username; // Add this line

    console.log('Connection attempt:', { userId, roomId, username });

    try {
      // Get user data but don't block connection on it
      const userData = await getUserData(userId);
      
      // Store user data if available, otherwise use query params
      socket.userData = userData?.Item || {
        userId,
        username,
        // Add any other default fields you need
      };
      
      console.log(`User ${socket.userData.username} connecting to room ${roomId}`);
      
      if (roomId) {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Still allow connection with query params
      socket.userData = {
        userId,
        username,
        // Add any other default fields you need
      };
      
      if (roomId) {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
      }
    }

    // Chat message handler
    socket.on('chatMessage', async (data) => {
      try {
        const { roomId, userId, message } = data;
        
        const messageData = {
          messageId: `${Date.now()}-${userId}`,
          roomId,
          userId,
          username: socket.userData.username || username, // Fallback to query param
          message,
          timestamp: new Date().toISOString(),
          type: 'text'
        };
        
        console.log('Processing message:', messageData);
        
        await saveMessage(
          messageData.roomId,
          messageData.userId,
          messageData.message,
          messageData.type,
          messageData.username
        );
        
        console.log(`Emitting message to room ${roomId}`);
        io.to(roomId).emit('message', messageData);

      } catch (error) {
        console.error('Error handling chat message:', error);
        socket.emit('messageError', { error: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      if (roomId) {
        socket.leave(roomId);
        console.log(`User ${socket.userData?.username} disconnected from room ${roomId}`);
      }
    });
  });
}