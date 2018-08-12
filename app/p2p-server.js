const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;

// ws://localhost:5001, ws://localhost:5002 ....
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen() {
    const server = new Websocket.Server({port: P2P_PORT});

    // Connect incoming socket requests to server - event listener
    server.on('connection', socket => this.connectSocket(socket));

    // Connect this server to all its peers
    this.connectToPeers();

    console.log(`Listening for peer to peer connections on ${P2P_PORT}`);
  }

  connectToPeers() {
    peers.forEach(peer => {
      const socket = new Websocket(peer);

      socket.on('open', () => this.connectSocket(socket));
    });
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('Socket connected');

    // All connected sockets
    this.messageHandler(socket);

    socket.send(JSON.stringify(this.blockchain.chain));
  }

  messageHandler(socket) {
    socket.on('message', message => {
      console.log('data ' + message);
    });
  }
};

module.exports = P2pServer;