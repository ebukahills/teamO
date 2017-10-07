var PouchDB = require('pouchdb');
var server = require('socket-pouch/server');
var client = require('socket-pouch/client');

PouchDB.adapter('socket', client);

server.listen(5000, {}, () => {
  console.log('Hiiii!');
});

let local = new PouchDB('test');

let remote = new PouchDB({
  adapter: 'socket',
  name: 'test',
  url: 'ws://192.168.43.230:5000',
});
// local.sync(remote, {live: true, retry: true}).on('change', info => console.log('Info: ', ...info.docs)).on('error', err => console.log('Error: ', err));
remote
  .allDocs({
    include_docs: true,
  })
  .then(docs => console.log(docs))
  .catch(err => console.log(err));
