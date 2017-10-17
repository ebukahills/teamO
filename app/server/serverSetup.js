import { ipcMain, BrowserWindow } from 'electron';
import Bonjour from 'bonjour';
// import {PeerServer} from 'peer';
const PeerServer = require('peer').PeerServer;

const RAND_TIMEOUT = Math.round(Math.random() * 20000 + 10000); // Random 10 - 30 seconds;
const SERVER_PORT = 8000;
const SERVICE_PORT = 8001;

const bonjour = Bonjour({
  loopback: false,
  multicast: true,
  reuseAddr: true,
});

class Server {
  constructor() {
    this.team = null;
    this.remote = null;
    this.connections = new Set();
    this.server = null;
    this.service = null; // Bonjour Service
    this.browser = null; // Bonjour Service Browser
    this.SERVER_PORT = SERVER_PORT || 9000;
    this.SERVICE_PORT = SERVICE_PORT || 9001;
    this.clientWindow = null;

    // Listen for Disconnected Event from Client
    ipcMain.on('client:disconnected', (e, data) => {
      this.reset().start(this.team);
    });
  }

  start(team) {
    if (!team) throw new Error('No Team Name passed to Start Server!!!');
    this.team = team;
    this.clientWindow = BrowserWindow.getAllWindows()[0].webContents;
    this.browser = bonjour.findOne({ type: team });
    let listenTimeout = setTimeout(() => {
      this.browser.stop();
      this.browser = null;
      this.startServer();
    }, RAND_TIMEOUT);

    this.browser.on('up', service => {
      console.log('Remote Service: ', service);
      clearTimeout(listenTimeout);
      // Remote Service Found. Set Host Peer to Discovered Service Address
      this.remote = { host: service.referer.address, port: this.SERVER_PORT };
      this.startClient();
    });
  }

  startServer() {
    console.log('Starting Server...');
    this.service = bonjour.publish({
      name: 'TeamO Service Server',
      type: this.team,
      port: this.SERVICE_PORT,
    });
    this.service.on('up', () => {
      this.remote = { host: 'localhost', port: this.SERVER_PORT };
    });
    this.service.on('error', err => {
      console.log('Error Starting Bonjour Service: ', err);
      this.reset().startClient();
    });

    if (!this.server) {
      // Start Server if it hasn't been setup
      // RTC Server may be left to run indefinitely once started
      this.server = PeerServer({
        port: this.SERVER_PORT,
        path: '/teamO',
        proxied: true,
      });
      this.server.on('connection', id => {
        this.connections.add(id);
        // Send connected Set to Client
        console.log(this.connections);
        this.sendToClient();
      });
      this.server.on('disconnect', id => {
        if (this.connections.delete(id)) {
          // Send updated connected Set to Client
          this.sendToClient();
        }
      });
    }
  }

  stopService() {
    if (this.service) {
      this.service.stop();
      this.service = null;
    }
    if (this.browser) {
      this.browser.stop();
      // this.browser = null;
    }
    this.remote = null;
    console.log('Service Stopped');
    return this;
  }

  startClient() {
    // Client has been started after discovering Service on Network
    let sendToClientInterval = setInterval(() => {
      this.sendToClient();
    }, 2000);
    // Listen for when the client notifies server that it has received list of remote connections
    ipcMain.once('client:started', (e, data) => {
      clearInterval(sendToClientInterval);
    });
    this.browser.on('down', () => {
      // Service Down. Do Something
      // this.reset()
      console.log('Bonjour Browser Service Down. Check Server');
    });
  }

  sendToClient() {
    this.clientWindow.send('server:update', {
      remote: this.remote,
      connections: Array.from(this.connections),
    });
  }

  reset() {
    console.log('RESETTING......');
    this.stopService();
    return this;
  }
}

let S = new Server();

export function startServer(team) {
  S.reset().start(team);
}
