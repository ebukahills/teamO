import swarm from 'discovery-swarm';

class NetworkSwarm {
  constructor(port) {
    this.port = port || 5050;
    this.opts = {
      utp: false,
    };
  }

  init(swarmId) {
    try {
      this.swarmId = swarmId.toUpperCase().trim();
      this.sw = swarm(this.opts);
    } catch (err) {
      console.log(err);
    }
    return this
  }

  listen() {
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
        if(!this.swarmId) {
          console.log('No Valid Team name passed');
          return false
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
        this.close()
      }
      
    })
  }

  close() {
    if (!this.swarmId) return;
    this.sw.leave(this.swarmId);
  }

  on(event, cb) {
    this.sw.on(event, cb);
    return this.sw;
  }
}

let NS = new NetworkSwarm(5050);

export const initSwarm = (swarmId) => {
  return NS.init(swarmId).listen();
};

export const listenSwarm = () => {
  return NS.listen();
};

export const startSwarm = () => {
  return NS.start();
};

export const closeSwarm = () => {
  return NS.close();
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
