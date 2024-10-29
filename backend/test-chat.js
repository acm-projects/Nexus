import { io } from 'socket.io-client';

const URL = 'http://localhost:3000';

function createUser(userId, roomId) {
  const socket = io(URL, {
    query: { userId }
  });

  socket.on('connect', () => {
    console.log(`User ${userId} connected`);

    // Join a room
    socket.emit('joinRoom', roomId);

    // Send a test message
    socket.emit('chatMessage', { room: roomId, message: `Hello from ${userId}` });
  });

  socket.on('message', (message) => {
    console.log(`${userId} received: `, message);
  });

  return socket;
}

// Create two test users
const user1 = createUser('testUser1', 'room1');
const user2 = createUser('testUser2', 'room1');

// Keep the script running
setInterval(() => {}, 1000);
