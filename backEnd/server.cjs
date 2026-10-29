require('dotenv').config();   // must be the FIRST line
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const userRoutes = require('./routes/userRoutes.cjs');
const postRoutes = require('./routes/postRoutes.cjs');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
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

io.on('connection', socket => {
  socket.on('join-user', userId => {
    if (userId) socket.join(`user:${userId}`);
  });
  socket.on('private-message', ({ to, from, message }) => {
    if (!to || !from || !message?.trim()) return;
    io.to(`user:${to}`).emit('private-message', {
      from,
      message: message.trim(),
      sentAt: new Date().toISOString()
    });
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    httpServer.listen(PORT, () => console.log(`Server on port ${PORT}`));
  })
  .catch(err => console.log('DB connection error:', err));