const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const userRoutes = require('./routes/userRoutes.cjs');
const postRoutes = require('./routes/postRoutes.cjs');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
const onlineUsers = new Map();
app.use(express.json());

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'upload')));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message || 'Request failed' });
});

const broadcastOnlineUsers = () => {
  io.emit('online-users', Array.from(onlineUsers.keys()));
};

io.on('connection', socket => {
  let joinedUserId = null;

  socket.on('join-user', userId => {
    if (!userId) return;

    joinedUserId = String(userId);
    socket.join(`user:${joinedUserId}`);
    const userSockets = onlineUsers.get(joinedUserId) || new Set();
    userSockets.add(socket.id);
    onlineUsers.set(joinedUserId, userSockets);
    broadcastOnlineUsers();
  });

  socket.on('private-message', ({ to, from, message }) => {
    if (!to || !from || !message?.trim()) return;
    if (!onlineUsers.has(String(to))) {
      socket.emit('message-error', { message: 'Your friend is offline' });
      return;
    }

    io.to(`user:${to}`).emit('private-message', {
      from,
      message: message.trim(),
      sentAt: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    if (!joinedUserId) return;
    const userSockets = onlineUsers.get(joinedUserId);
    if (!userSockets) return;

    userSockets.delete(socket.id);
    if (userSockets.size === 0) onlineUsers.delete(joinedUserId);
    broadcastOnlineUsers();
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    httpServer.listen(PORT, () => console.log(`Server on port ${PORT}`));
  })
  .catch(err => console.log('DB connection error:', err));