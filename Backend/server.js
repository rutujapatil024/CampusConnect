const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const jobRoutes = require("./routes/job");
const inchargeRoutes = require("./routes/incharge");
const statsRoutes = require("./routes/stats");

// MongoDB Message Schema
const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  message: String,
  read: { type: Boolean, default: false },
  delivered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

// App Setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api", statsRoutes);
app.use("/api", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api", jobRoutes);
app.use("/api/incharge", inchargeRoutes);


// Fetch chat history
app.get("/api/messages/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params;
  const messages = await Message.find({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  }).sort({ createdAt: 1 });

  res.json({ success: true, messages });
});

// WebSocket Logic
io.on("connection", (socket) => {
  console.log("📲 Socket connected:", socket.id);

  socket.on("join", async ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join("-");
    socket.join(roomId);
    console.log(`🟢 ${socket.id} joined room: ${roomId}`);

    // Set delivered = true for any undelivered messages to this user
    await Message.updateMany(
      { receiverId: senderId, senderId: receiverId, delivered: false },
      { delivered: true }
    );

    // Emit updated messages with delivered=true
    const deliveredMessages = await Message.find({
      receiverId: senderId,
      senderId: receiverId,
      delivered: true,
    });

    deliveredMessages.forEach((msg) => {
      io.to(roomId).emit("receive_message", msg);
    });
  });

  socket.on("send_message", async (msg) => {
    const saved = await Message.create({ ...msg, delivered: true }); // default delivered true for now
    const roomId = [msg.senderId, msg.receiverId].sort().join("-");
    io.to(roomId).emit("receive_message", saved);
  });

  socket.on("mark_read", async ({ messageId }) => {
    const updated = await Message.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    );

    if (updated) {
      const roomId = [updated.senderId, updated.receiverId].sort().join("-");
      io.to(roomId).emit("message_read", { messageId });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Start MongoDB & Server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
