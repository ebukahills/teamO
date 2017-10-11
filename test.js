var PouchDB = require('pouchdb');
var server = require('socket-pouch/server');
var client = require('socket-pouch/client');

PouchDB.adapter('socket', client);

server.listen(
  5000,
  {
    pouchCreator: function(dbName) {
      return new PouchDB(dbName, {
        db: require('leveldown'),
      });
    },
  },
  () => {
    console.log('Hiiii!');
  }
);

// let local = new PouchDB('testa');
// setTimeout(function() {
//   let remote = new PouchDB({
//     adapter: 'socket',
//     name: 'testa',
//     url: 'ws://192.168.43.230:5000',
//   });
//   local
//     .sync(remote, { live: true, retry: true })
//     .on('change', info => console.log('Info: ', info.docs))
//     .on('error', err => console.log('Error: ', err));
// }, 5000);

// setInterval(() => {
//   local
//     .allDocs({
//       include_docs: true,
//     })
//     .then(docs => console.log(docs))
//     .catch(err => console.log(err));
// }, 10000);
