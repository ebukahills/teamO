import swarm from 'discovery-swarm';

class NetworkSwarm {
  constructor(port) {
    this.port = port || 5050;
    this.sw = null;
    this.listening = false;
    this.opts = {
      // utp: false,
    };
  }

  init(swarmId, username) {
    if (this.sw) {
      // Swarm was already setup
      console.log('Swarm was already setup');
      return this;
    }
    try {
      this.swarmId = swarmId.toUpperCase().trim();
      // Passing Swarm client id as username here
      this.sw = swarm({ ...this.opts, id: username });
    } catch (err) {
      console.log(err);
    }
    return this;
  }

  listen() {
    if (this.listening) {
      // Already Listening on Port
      console.log('Already Listening on Port');
      return this.sw;
    }
    this.listening = true;
    try {
      if (!this.sw) {
        console.error('You need to initiate a Swarm before listening');
        return false;
      }
      this.sw.listen(this.port);
    } catch (err) {
      console.log(err);
    }
    return this.sw;
  }

  start(cb) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.swarmId) {
          return reject('No Valid Team name passed');
        }
        this.sw.join(
          this.swarmId,
          (cb = () => {
            // Optional Callback
            console.log(`Swarm ${this.swarmId} Started...`);
            return resolve(this);
          })
        );
      } catch (err) {
        console.log(err);
        reject(err);
        this.close();
      }
    });
  }

  leave() {
    if (!this.swarmId) return;
    if (this.sw != null) {
      this.sw.leave(this.swarmId);
    }
    // Disable setting sw to null => Race Condition
    // this.sw = null;
    // this.listening = false;
    console.log(`Swarm ${this.swarmId} left!`);
  }

  on(event, cb) {
    this.sw.on(event, cb);
    return this.sw;
  }
}

let NS = new NetworkSwarm(5050);

export const initSwarm = (swarmId, username) => {
  return NS.init(swarmId, username).listen();
};

export const listenSwarm = () => {
  return NS.listen();
};

export const startSwarm = () => {
  return NS.start();
};

export const leaveSwarm = () => {
  return NS.leave();
};

export const onNewConnection = cb => {
  return NS.on('connection', cb);
};

export const OnEvent = (event, cb) => {
  return NS.on(event, cb);
};

export const getPeerCount = () => {
  return NS.sw.connected;
};

export const getConnections = () => {
  return NS.sw.connections;
};
