import swarm from 'discovery-swarm';

class NetworkSwarm {
  constructor(port) {
    this.port = port || 5050;
    this.opts = {
      utp: false
    }
  }
  
  init(swarmId, userId) {
    this.swarmId = swarmId
    this.userId = userId
    this.sw = swarm({
      ...this.opts,
      id: userId
    });
  }

  listen() {
    this.sw.listen(this.port);
    return this.sw;
  }

  start(cb) {
    this.sw.join(
      this.swarmId,
      (cb = () => { // Optional Callback
        console.log(`Swarm ${this.swarmId} Started...`);
      })
    );
    return this.sw;
  }

  close() {
    if(!this.swarmId) return;
    this.sw.leave(this.swarmId);
  }

  on(event, cb) {
    this.sw.on(event, cb);
    return this.sw;
  }
}

let NS = new NetworkSwarm(5050);

export const initSwarm = (swarmId, userId) => {
  return NS.init()
}

export const startListen = () => {
  return NS.listen();
};

export const startSwarm = () => {
  return NS.start();
};

export const closeSwarm = () => {
  return NS.close();
}

export const onNewConnection = cb => {
  return NS.on('connection', cb);
};

export const OnEvent = (event, cb) => {
  return NS.on(event, cb);
};

export const getPeerCount = () => {
  return NS.sw.connected;
};
