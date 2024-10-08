import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const PORT = 8000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "PUT", "POST"],
    optionsSuccessStatus: 200,
    credentials: true,
  },
});

app.use(express.json());
app.use(cors());

app.use("/", (req, res) => {
  res.send("This is the home route of lobby testing");
});

// Handling socket.io
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for creator or participant joining the room
  socket.on("joinRoom", (data) => {
    const { roomId, username } = data;
    socket.join(roomId);
    console.log(`${username} joined room: ${roomId}`);

    // Store username in socket for later use
    socket.username = username;

    // Notify everyone in the room that someone has joined
    io.in(roomId).emit("roomUpdate", { message: `${username} has joined the room.` });

    // Send list of users currently in the room
    const clientsInRoom = io.sockets.adapter.rooms.get(roomId);
    if (clientsInRoom) {
      const usersInRoom = Array.from(clientsInRoom).map(clientId => {
        return io.sockets.sockets.get(clientId)?.username; 
      }).filter(Boolean);

      io.in(roomId).emit("roomUserList", {
        message: `There are ${usersInRoom.length} users in the room.`,
        usersInRoom: usersInRoom,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  try {
    console.log(`Server is running at: http://localhost:${PORT}`);
  } catch (error) {
    console.error("Error starting server:", error);
  }
});
