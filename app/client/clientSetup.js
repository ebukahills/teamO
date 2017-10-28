import { ipcRenderer } from 'electron';
import Peer from 'peerjs';
import _ from 'lodash';

import { store } from '../';
import { initDB, saveMessages } from '../db';

import { loadUsers } from '../actions/appActions';
import { newMessage } from '../actions/messageActions';
import { showError } from '../actions/feedbackActions';

class Client {
  constructor() {
    this.connected = false; // Peer connection succeeded with Server;
    this.connections = null; // Array of online connections from server or other peers
    this.remote = null;
    this.peer = null;
    this.username = null;
    this.team = null;
    this.mediaStreams = {};
  }

  start(username, team) {
    initDB(team, username); // Start Client DB
    this.username = username;
    this.team = team;

    // Notify Main of initialization
    ipcRenderer.send('get:update');
    // Setup Listener for Server Events
    ipcRenderer.on('server:update', (e, data) => {
      if (!data.remote) {
        console.log('Server not ready to send remote host id');
        return;
      }
      console.log('Got Server Update Message ', data);
      this.remote = data.remote;
      this.connections = data.connections;

      ipcRenderer.send('client:started', {
        started: !!this.connections.length,
      });

      if (!this.peer) {
        // No Peer Connection. Connect PeerJS
        this.peer = new Peer(username, {
          ...this.remote,
          path: '/teamO',
          debug: 2,
        });

        this.peer.on('error', err => {
          console.error('Peer Connection Error, ', err.type, err);
          this.reset().start(this.username, this.team);
        });

        this.peer.on('disconnected', () => {
          console.log('Peer Server Disconnected: ');
          // TODO: Handle Network Renegotiation Here!;
          this.reset().start(this.username, this.team);
        });

        this.peer.on('open', id => {
          console.log('Peer Connection to Server Opened Successfully!');
          this.connected = true;
          this.startListening();
        });
      }

      if (data.remote.host === 'localhost') {
        // This Peer is the server. Broadcast to all Active RTC connections
        this.connections = data.connections;
        store.dispatch(loadUsers(this.connections)); // Set this guy's state here cuz he's excluded from receiving
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
    console.log('Peer Connection Listener Started!');
    // Connect Listener
    this.peer.on('connection', dataConnection => {
      console.log('New Client Peer Connection', dataConnection.peer);
      dataConnection.on('data', data => {
        console.log('Data Received: ', data);
        switch (data.type) {
          case 'message':
            console.log('Received Peer Message');
            dataConnection.send('ack');
            let receivedMessage = { ...data.message, delivered: true };
            saveMessages(receivedMessage);
            store.dispatch(newMessage(receivedMessage));
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

    // Call Listener
    this.peer.on('call', mediaConnection => {
      let { id } = mediaConnection;
      let { type } = mediaConnection.metadata;
      // Answer Call Automatically
      // Start Listener for when this call is ended
      ipcRenderer.once(`call:end:${id}`, () => {
        if (this.mediaStreams[id]) {
          // If stream exists, stop track and release Webcam & Audio
          _.forEach(this.mediaStreams[id].getTracks(), track => track.stop());
          this.mediaStreams[id] = null;
        }
      });

      let callOpts = { voice: true };
      if (type === 'video') {
        callOpts.video = true;
      }
      navigator.mediaDevices
        .getUserMedia(callOpts)
        .then(stream => {
          console.log('My stream for Receive: \n', stream);
          // Save this call's mediaStream to class scope so we can tear it down later;
          this.mediaStreams[id] = stream;
          ipcRenderer.send('new:call', { call: mediaConnection, stream });
        })
        .catch(err => {
          store.dispatch(showError(err));
        });

      // TODO
      // Received call. Show Notification
    });
  }

  makeCall(id, type) {
    // Start Listener for when this call is ended
    ipcRenderer.once(`call:end:${id}`, () => {
      if (this.mediaStreams[id]) {
        // If stream exists, stop track and release Webcam & Audio
        _.forEach(this.mediaStreams[id].getTracks(), track => track.stop());
        this.mediaStreams[id] = null;
      }
    });

    let callOpts = { voice: true };
    if (type === 'video') {
      callOpts.video = true;
    }
    navigator.mediaDevices
      .getUserMedia(callOpts)
      .then(stream => {
        console.log('My stream for Making Call: \n', stream);
        // Save this call's mediaStream to class scope so we can tear it down later;
        this.mediaStreams[id] = stream;
        // Send along the media connection type so receiver knows what type of call to initiate;
        let metadata = { initiator: true, type }; // type === voice || video
        // Call user with peer id
        let mediaConnection = this.peer.call(id, stream, { metadata });
        // Send off Call to ipcMain to Start call Window
        ipcRenderer.send('new:call', { call: mediaConnection, stream });
      })
      .catch(err => {
        // console.log(err)
        store.dispatch(showError(err));
      });
  }

  broadcastMessage(type = 'default', connections, message = connections) {
    // connections is an array of IDs to broadcast message to
    // Message Format { type: type, message: message }
    _.forEach(_.filter(connections, id => id !== this.peer.id), id => {
      let conn = this.peer.connect(id);
      conn.on('open', () => {
        conn.send({ type, message });
      });
    });
  }

  sendMessage(message) {
    // Dispatch newMessage Redux Action here now. Will definitely Change
    store.dispatch(newMessage(message));
    if (message.from === message.to) {
      // Sending Message from Me to Me, Save Directly to DB
      saveMessages({ ...message, delivered: true });
      return;
    }
    let saved = false;
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
    this.connected = false;
    this.connections = null;
    this.remote = null;
    this.peer = null;
    this.mediaStreams = {};
    // this.username = null;
    // this.team = null;
    return this;
  }
}

let C = new Client();

export function startClient(username) {
  let { team } = store.getState().user;
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

export function makeCall(id, type) {
  C.makeCall(id, type);
}
