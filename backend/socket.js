import { getUserData, getUserCourses, generateRoomName } from "./utils/onboardingHelpers.js";
import { saveMessage, fetchMessages } from "./utils/awsConfig.js";

export function configureSocket(io) {
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
      await saveMessage(room, userData.username, message)
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
}