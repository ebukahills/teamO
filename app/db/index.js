import Dexie from 'dexie';

/**
 * Message Schema
 * {
 *  message: string,
 *  from: username,
 *  to: receiver || groupID
 *  delivered: Boolean
 * }
 */

class Database {
  constructor() {
    this.db = null;
    this.username = null;
    this.pendingMessages = [];
  }

  init(db, username) {
    this.usernmae = username;
    this.db = new Dexie(db);
    this.db.version(1).stores({
      messages: '++id, message, from, to, time, delivered',
      users: '&uid, username, password',
    });
  }

  db() {
    return this.db;
  }

  async saveMessages(...messages) {
    try {
      await this.db.messages.bulkAdd(messages);
      console.log(
        ...messages.map(message => 'Message ' + message.message + ' Saved!')
      );
    } catch (err) {
      console.error('Error Saving Message! ', err);
    }
  }

  reset() {
    this.db = null;
    this.username = null;
    return this;
  }
}

let DB = new Database();

export function initDB(db, username) {
  // db is the team name
  DB.reset().init(db, username);
}

export function saveMessages(messages) {
  DB.saveMessages(messages);
}

export function db() {
  return DB.db();
}
