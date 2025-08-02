import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const ChatModal = ({ open, onClose, senderId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  const roomId = [senderId, receiverId].sort().join("-");

  // Fetch messages on open
  useEffect(() => {
    if (!open || !senderId || !receiverId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/${senderId}/${receiverId}`
        );
        setMessages(res.data?.messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [open, senderId, receiverId]);

  // Join room and listen
  useEffect(() => {
    if (!open || !senderId || !receiverId) return;

    socket.emit("join", { senderId, receiverId });

    const handleReceive = (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        return exists ? prev : [...prev, msg];
      });
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [open, senderId, receiverId]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const messageObj = {
      senderId,
      receiverId,
      message: newMessage,
      roomId,
    };

    socket.emit("send_message", messageObj);
    setNewMessage("");
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getTickStatus = (msg) => {
    if (msg.senderId !== senderId) return "";
    if (msg.read) return <span style={{ color: "blue" }}>✔✔</span>;
    return "✔";
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chat</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ maxHeight: 300, overflowY: "auto", mb: 2 }}>
          {Array.isArray(messages) && messages.length > 0 ? (
            messages.map((msg) => {
              const isSender = msg.senderId === senderId;
              const time = formatTime(msg.createdAt);

              return (
                <Box
                  key={msg._id || `${msg.senderId}-${msg.createdAt}`}
                  sx={{ mb: 1, textAlign: isSender ? "right" : "left" }}
                >
                  <Box
                    sx={{
                      display: "inline-block",
                      bgcolor: isSender ? "#d1f5d3" : "#f1f1f1",
                      p: 1,
                      borderRadius: 1,
                      position: "relative",
                      maxWidth: "80%",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ wordWrap: "break-word" }}
                    >
                      {msg.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", fontSize: "0.7rem" }}
                    >
                      {time} {getTickStatus(msg)}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Typography variant="body2" color="text.secondary">
              No messages yet.
            </Typography>
          )}
          <div ref={chatEndRef} />
        </Box>
        <Divider />
        <TextField
          fullWidth
          multiline
          rows={2}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSend} variant="contained" color="primary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatModal;
