import { getUserData, getUserCourses, generateRoomName } from "./utils/onboardingHelpers.js";
import { saveMessage, fetchMessages } from "./utils/awsConfig.js";

/*export function configureSocket(io) {
  io.on('connection', async (socket) => {
    const userId = socket.handshake.query.userId
    const userData = await getUserData(userId)
    const userCourses = await getUserCourses(userId)

    userCourses.forEach(course => {
      const generalRoom = generateRoomName(course.courseCode, course.courseNumber, course.professorName)
      const sectionRoom = generateRoomName(course.courseCode, course.courseNumber, course.professorName, course.sectionCode)

      socket.join(generalRoom)
      socket.join(sectionRoom)
    });

    socket.on('chatMessage', async (data) => {
      const { room, message } = data
      await saveMessage(room, userData.userId, message)
      console.log(message)
      io.to(room).emit('message', { userId: userData.username, message });
    });

    socket.on('fetchMessages', async (data) => {
      const { room } = data
      const messages = await fetchMessages(room)
      socket.emit('messageHistory', messages)
    })

    socket.on('fileUploaded', (data) => {
      const { room, fileUrl } = data
      io.to(room).emit('fileUploaded', { userId: userData.username, fileUrl });
    });
  });
}*/

export function configureSocket(io) {
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
        console.log(`User ${userId} disconnected from room ${roomId}`);
      }
    });
  });
}