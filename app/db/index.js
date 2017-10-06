import PouchDB from 'pouchdb'
import socketPouchServer from 'socket-pouch/server';
import socketPouchClient from 'socket-pouch/client'

import {onNewConnection} from '../swarm'

const SERVER_PORT = 5051;

// Notify PouchDB of client Adapter
PouchDB.adapter('socket', socketPouchClient);

let localDB;
let remoteDB;

export const startDB = async (team) => {
  console.log('Started DB!');
  localDB = new PouchDB(team);
  socketPouchServer.listen(SERVER_PORT, {
    pouchCreator: team => new PouchDB(team)
  }, () => {
    console.log('PouchDB Server now listening on Port: ' + SERVER_PORT);
    onNewConnection((connection, info) => {
      console.log('Host Connected: ', info.host);
      // Check if remoteDB has not been setup and set it up
      if(!remoteDB) {
        let remoteHostStrArr = info.host.split(':')
        let remoteHost = remoteHostStrArr[remoteHostStrArr.length - 1];
        remoteDB = new PouchDB({
          adapter: 'socket', 
          name: 'remote', 
          url: `ws://${remoteHost}:${SERVER_PORT}`
        })
        localDB.sync(remoteDB);
      }
    })
  })
}