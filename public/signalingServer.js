class SignalingServer {
    constructor() {
      this.rooms = {};
    }
  
    joinRoom(roomId, socketId) {
      if (!this.rooms[roomId]) {
        this.rooms[roomId] = [];
      }
  
      this.rooms[roomId].push(socketId);
    }
  
    leaveRoom(socketId) {
      Object.values(this.rooms).forEach((room) => {
        const index = room.indexOf(socketId);
        if (index !== -1) {
          room.splice(index, 1);
        }
      });
    }
  
    handleSignal(data) {
      const { type, from, to, signal } = data;
  
      if (type === 'ice') {
        this.sendICECandidate(from, to, signal);
      } else if (type === 'offer') {
        this.sendOffer(from, to, signal);
      } else if (type === 'answer') {
        this.sendAnswer(from, to, signal);
      }
    }
  
    sendICECandidate(from, to, candidate) {
      const socket = this.getSocketById(to);
      if (socket) {
        socket.emit('signal', {
          type: 'ice',
          from,
          to,
          candidate
        });
      }
    }
  
    sendOffer(from, to, offer) {
      const socket = this.getSocketById(to);
      if (socket) {
        socket.emit('signal', {
          type: 'offer',
          from,
          to,
          offer
        });
      }
    }
  
    sendAnswer(from, to, answer) {
      const socket = this.getSocketById(to);
      if (socket) {
        socket.emit('signal', {
          type: 'answer',
          from,
          to,
          answer
        });
      }
    }
  
    getSocketById(socketId) {
      const sockets = io.sockets.sockets;
      for (const socket of Object.values(sockets)) {
        if (socket.id === socketId) {
          return socket;
        }
      }
  
      return null;
    }
  }
  