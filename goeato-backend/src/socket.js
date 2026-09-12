let io = null;

function setIo(ioInstance) {
  io = ioInstance;
}

function getIo() {
  return io;
}

function emitToUser(userId, event, payload) {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
}

module.exports = { setIo, getIo, emitToUser };
