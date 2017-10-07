import PouchDB from 'pouchdb';
import socketPouchServer from 'socket-pouch/server';
import socketPouchClient from 'socket-pouch/client';

import { onNewConnection, startSwarm, getConnections } from '../swarm';

// Notify PouchDB of client Adapter
PouchDB.adapter('socket', socketPouchClient);

const SERVER_PORT = 5051;

// Implement Database as a Class

class Database {
  constructor(port) {
    this.port = port || SERVER_PORT;
    this.localDB = null;
    this.remoteDB = null;
    this.team = null;
    this.listening = false;
  }

  startDB(team) {
    if (!team) {
      throw new Error('You must pass a valid Team ID');
    }
    if (this.localDB) {
      // DB has already been setup. ABORT
      console.log('Local DB has already been setup. ABORT');
      return this;
    }
    this.team = team;
    this.localDB = new PouchDB(team);
    console.log('Started DB!');
    socketPouchServer.listen(this.port, {}, async () => {
      console.log('PouchDB Socket Server now listening on Port: ' + this.port);
      await startSwarm();
      this.onSwarmConnection();
    });
  }

  onSwarmConnection() {
    if (this.listening) {
      console.log('Already Listening for Connections on Swarm!!!');
      return this;
    }
    this.listening = true;
    onNewConnection((connection, info) => {
      console.log('Host Connected: ', info);
      if (!this.remoteDB && !info.host.includes(':')) {
        let remoteHost = info.host;
        let url = `ws://${remoteHost}:${this.port}`;
        this.remoteDB = new PouchDB({
          adapter: 'socket',
          name: this.team,
          url,
        });
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
        console.log(JSON.stringify(err));
        //TODO: Reset remoteDB here and restart Sync;
      });
    return this;
  }

  getSwarmConnections() {
    return getConnections();
  }

  closeDB() {
    this.localDB = null;
    this.remoteDB = null;
    // Cancel Synchronization;
    this.sync ? this.sync.cancel() : '';
    return this;
  }
}

let DB = new Database(5051);

export const startDB = team => DB.startDB(team);

export const closeDB = () => DB.closeDB();
