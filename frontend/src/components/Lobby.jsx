import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:8000");

const LobbyPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [userNames, setUserNames] = useState(() => {
    // Retrieve user names from sessionStorage or initialize as an empty array
    const storedNames = sessionStorage.getItem("userNames");
    return storedNames ? JSON.parse(storedNames) : [];
  });

  // Retrieve username and room ID from sessionStorage
  const creatorData = JSON.parse(sessionStorage.getItem("creator"));
  const participentData = JSON.parse(sessionStorage.getItem("participent"));

  // Determine if the user is a creator or a participant
  const username = creatorData
    ? creatorData.cname
    : participentData
    ? participentData.pname
    : "";
  const roomId = creatorData
    ? creatorData.room
    : participentData
    ? participentData.room
    : "";

  useEffect(() => {
    if (username && roomId) {
      socket.emit("joinRoom", { roomId, username });
    }

    socket.on("roomUpdate", (data) => {
      setMessage(data.message);
    });

    socket.on("roomUserList", (data) => {
      setUsersInRoom(data.usersInRoom);

      // Update user names and store in sessionStorage
      const updatedUserNames = [...new Set([...userNames, ...data.usersInRoom])];
      setUserNames(updatedUserNames);
      sessionStorage.setItem("userNames", JSON.stringify(updatedUserNames));
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      // Remove the user's name from the session storage
      const updatedUserNames = userNames.filter((name) => name !== username);
      setUserNames(updatedUserNames);
      sessionStorage.setItem("userNames", JSON.stringify(updatedUserNames));
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [username, roomId]);

  const handleGameStart = () => {
    navigate("/game"); // Navigate to game page
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lobby Page</h1>
      <div>
        {message && <p>{message}</p>}
        <h2>Users in Room:</h2>
        <ul>
          {usersInRoom.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
      {/* Show the "Game" button only if there are 2 or more users in the room */}
      {userNames.length >= 2 && <button onClick={handleGameStart}>Start Game</button>}
    </div>
  );
};

export default LobbyPage;
