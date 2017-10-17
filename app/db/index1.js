import PouchDB from 'pouchdb';
import pouchdbFind from 'pouchdb-find';
import express from 'express';
import expressPouch from 'express-pouchdb';
// import socketPouchServer from 'socket-pouch/server';
// import socketPouchClient from 'socket-pouch/client';

import path from 'path';
import fs from 'fs';

import { app, ipcMain, BrowserWindow } from 'electron';

// Lodash Utils
import { throttle } from 'lodash';

import {
  initSwarm,
  onNewConnection,
  startSwarm,
  getConnections,
  leaveSwarm,
} from '../swarm';

// Setup Express Server
const server = express();
server.use('/db', expressPouch(PouchDB));

const APP_DATA_PATH = path.join(app.getPath('appData'), 'teamO');

// Setup Database Folder if it does not exist
if (!fs.existsSync(APP_DATA_PATH)) {
  fs.mkdirSync(APP_DATA_PATH);
}

// USE socket pouch client as Socket Adapter for PouchDB
// PouchDB.adapter('socket', socketPouchClient);
PouchDB.plugin(pouchdbFind);

const SERVER_PORT = 5051;

// Implement Database as a Class

class Database {
  constructor(port) {
    this.port = port || SERVER_PORT;
    this.localDB = null;
    this.remoteDB = null;
    this.team = null;
    this.server = null;
    this.sync = null;
    this.listening = false;
    this.serverListening = false;
  }

  startDB(team, username) {
    if (!team) {
      throw new Error('You must pass a valid Team ID');
    }
    // Initialize Swarm here instead so it's initialized even after connection Teardown during auth
    if (!initSwarm(team, username)) {
      throw new Error('Error Joining Swarm: ' + team);
    }

    // Set reusable webContents in class here. Might change
    let { webContents } = BrowserWindow.getAllWindows()[0];
    this.webContents = webContents;

    if (this.localDB) {
      // DB has already been setup. ABORT DB SETUP
      console.log('Local DB has already been setup. ABORT');
      return this;
    }
    try {
      this.team = team;
      // Create Database in appData Path
      this.localDB = new PouchDB(path.join(APP_DATA_PATH, this.team));
      console.log('Started DB!');

      if (!this.serverListening) {
        // Start Express PouchDB here
        this.server = server.listen(this.port, async err => {
          if (err) {
            throw new Error('Express Listen Error: ' + JSON.stringify(err));
          }
          console.log('Express Server listening on ' + this.port);
          this.serverListening = true;
          await startSwarm();
          this.onSwarmConnection();
        });
      }
    } catch (err) {
      console.error(err);
    }
    return this;
  }

  authenticate(username, password, retry) {
    let db = this.localDB || this.remoteDB;
    if (!db) {
      console.error('No Database connected!');
      if (retry) {
        console.log('Retrying Auth.....');
        setTimeout(() => {
          this.authenticate(username, password, false);
        }, 5000);
      }
    } else {
      console.log('Authenticating.....');
      this.createIndex('username').then(() => {
        db
          .find({
            selector: { username },
          })
          .then(result => {
            console.log(result);
            let doc = result.docs[0];
            if (doc) {
              // If password === true Bypass password Verification
              // This is for the Login Action coming from restored state
              if (doc.password === password || password === true) {
                this.webContents.send('auth:login', {
                  authenticated: true,
                  details: doc,
                });
              } else {
                this.webContents.send('auth:login', {
                  authenticated: false,
                  error: 'Error Logging In to Team. Wrong Username or Password',
                });
              }
            } else {
              this.webContents.send('auth:login', {
                authenticated: false,
                error:
                  'User Not Found on this team. Please Create an Account to join this Team',
              });
            }
          });
      });
    }
  }

  register(name, username, password, retry) {
    let db = this.localDB || this.remoteDB;
    if (!db) {
      console.error('No Database connected!');
      if (retry) {
        console.log('Retrying Register.....');
        setTimeout(() => {
          this.authenticate(name, username, password, false);
        }, 5000);
      }
    } else {
      this.createIndex('username').then(() => {
        db
          .find({
            selector: { username },
          })
          .then(result => {
            console.log('Register Result: ', result);
            if (result.docs[0]) {
              // User was found with username. No Register
              this.webContents.send('auth:register', {
                authenticated: false,
                error: 'User Exists with this Username. Please Login',
              });
            } else {
              // No User Found. Create User
              db
                .post({ type: 'user', name, username, password })
                .then(result => {
                  // User Created. Send back data verbatim for now
                  this.webContents.send('auth:register', {
                    authenticated: true,
                    details: { name, username, password },
                  });
                });
            }
          });
      });
    }
  }

  createIndex(...indexes) {
    return new Promise((resolve, reject) => {
      if (!this.localDB) {
        reject('No Database Connected to Index!');
      }
      this.localDB
        .createIndex({
          index: { fields: indexes },
        })
        .then(index => resolve(index))
        .catch(err => reject(err));
    });
  }

  onSwarmConnection() {
    console.log('New Connection Listener started');
    // if (this.listening) {
    //   console.log('Already Listening for Connections on Swarm!!!');
    //   return this;
    // }
    // this.listening = true;
    onNewConnection((connection, info) => {
      console.log('Host Connected: ', info);
      if (!this.remoteDB && !info.host.includes(':')) {
        // Build Remote DB connection string from Remote Host and Port
        this.remoteDB = `http://${info.host}:${this.port}/db/${this.team}`;
        this.startSync();
      }
    });
    return this;
  }

  startSync() {
    if (!this.localDB || !this.remoteDB) {
      console.log('Local or Remote DB not setup. Please Check');
      return this;
    }

    this.sync = this.localDB
      .sync(this.remoteDB, { live: true, retry: true })
      .on('error', err => {
        console.log('Sync Error: ', JSON.stringify(err));
        //TODO: Reset remoteDB here and restart Sync;
      })
      .on('change', () => {
        console.log('Syncing....');
      });
    return this;
  }

  getSwarmConnections() {
    return getConnections();
  }

  getAllUsers() {
    if (!this.webContents) return [];
    this.createIndex('user')
      .then(index => {
        this.localDB
          .find({
            selector: { type: 'user' },
          })
          .then(result => {
            this.webContents.send('data:users', result.docs);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Force Close DB and Sync before any initiator calls
  closeDB() {
    this.localDB = null;
    this.remoteDB = null;
    // Leave Swarm
    leaveSwarm();
    // Cancel Synchronization;
    if (this.sync) this.sync.cancel();
    this.sync = null;
    return this;
  }
}

let DB = new Database(SERVER_PORT);

export const startDB = (team, username) => {
  return DB.startDB(team, username);
};

// Throttle these functions for 5 seconds to avoid database/network race conditions
export const login = throttle((team, username, password) => {
  DB.closeDB()
    .startDB(team, username)
    .authenticate(username, password, true);
}, 5000);

export const register = throttle((name, username, password, team) => {
  DB.closeDB()
    .startDB(team, username)
    .register(name, username, password, true);
}, 5000);

export const closeDB = () => DB.closeDB();

export const getAllUsers = () => {
  return DB.getAllUsers();
};
