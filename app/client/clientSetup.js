import { ipcRenderer } from 'electron';
import Peer from 'peerjs';
import _ from 'lodash';

import { store } from '../';
import { initDB, saveMessages } from '../db';

import { loadUsers } from '../actions/appActions';

class Client {
  constructor() {
    this.connected = false; // Peer connection succeeded with Server;
    this.connections = null; // Array of online connections from server or other peers
    this.remote = null;
    this.peer = null;
    this.username = null;
    this.team = null;
  }

  start(username, team) {
    initDB(team, username); // Start Client DB
    this.username = username;
    this.team = team;
    // Setup Listener for Server Events
    ipcRenderer.on('server:update', (e, data) => {
      console.log('Got Server Update Message ', data);
      this.remote = data.remote;
      this.connections = data.connections;

      ipcRenderer.send('client:started', 'Client Started!!!');

      if (!this.peer) {
        // No Peer Connection. Connect PeerJS
        this.peer = new Peer(username, {
          ...this.remote,
          path: '/teamO',
          debug: 2,
        });

        this.peer.on('error', err => {
          console.error('Peer Connection Error, ', err.type);
          throw new Error(err);
        });

        this.peer.on('disconnected', () => {
          console.log('Peer Server Disconnected: ');
          // this.reset().start(this.username, this.team)
          // TODO: Handle Network Renegotiation Here!;
        });

        this.peer.on('open', id => {
          this.connected = true;
          this.startListening();
        });
      }

      if (data.remote.host === 'localhost') {
        // This Peer is the server. Broadcast to all Active RTC connections
        this.connections = data.connections;
        this.broadcastMessage('connections', this.connections);
      }
    });
  }

  getPeerConnection() {
    return this.peer;
  }

  getUsername() {
    return this.username;
  }

  getTeam() {
    return this.team;
  }

  startListening() {
    // Connect Listener
    this.peer.on('connect', dataConnection => {
      console.log('New Client Peer Connection');
      dataConnection.on('data', data => {
        switch (data.type) {
          case 'message':
            console.log('Received Peer Message');
            dataConnection.send('ack');
            saveMessages({ ...data.message, delivered: true });
            break;

          case 'connections': // RTC Online users broadcast
            console.log('Received Peer Connections Broadcast');
            this.connections = data.message;
            store.dispatch(loadUsers(data.message));
            break;

          default:
            break;
        }
      });
    });
  }

  broadcastMessage(type = 'default', connections, message = connections) {
    console.log('Sending Broadcast Message', message);
    // connections is an array of IDs to broadcast message to
    // Message Format { type: type, message: message }
    _.forEach(_.filter(connections, id => id !== this.peer.id), id =>
      this.peer.connect(id).send({ type, message })
    );
  }

  sendMessage(message) {
    let sent = false;
    let dataConnection = this.peer.connect(message.to);
    dataConnection.on('error', err => {
      console.log('Error sending Message to Remote: ', err);
      // Message not sent. Save to DB as undelivered;
      saveMessages({ ...message, delivered: false });
    });
    dataConnection.on('open', () => {
      dataConnection.on('data', ack => {
        if (ack === 'ack') {
          saveMessages({ ...message, delivered: true });
          dataConnection.close();
        }
      });
      // Connection Opened. Send Message Here;
      dataConnection.send({ type: 'message', message });
    });
  }

  reset() {
    if (this.peer) {
      this.peer.disconnect();
    }
    ipcRenderer.removeAllListeners('server:update');
    this.connected = false; // Peer connection succeeded with Server;
    this.connections = null; // Array of online connections from server or other peers
    this.remote = null;
    // this.peer = null;
    // this.username = null;
    // this.team = null;
    return this;
  }
}

let C = new Client();

export function startClient() {
  let { username, team } = store.getState().user;
  C.reset().start(username, team);
}

export function getPeerConnection() {
  return C.getPeerConnection();
}

export function getUsername() {
  return C.getUsername();
}

export function sendMessage(message) {
  C.sendMessage(message);
}
