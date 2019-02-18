var SSH = window.require('ssh2').Client;

class SSHManager {
  constructor() {
    this.ssh = null;
    this.isReady = false;
  }

  connect(ip, username, password, cb) {
    this.ssh = new SSH();
    this.ssh.on('error', (error) => {
      this.isReady = false;
      cb(error);
    }).on('ready', () => {
      this.isReady = true;
      cb(null);
    }).on('end', () => {
      this.isReady = false
    }).on('close', () => {
      this.isReady = false
    });
    this.ssh.connect({host: ip, username, password});
  }
  
  end() {
    return this.ssh.end();
  }
  
  execute(command, cb) {
    this.ssh.exec(command, (error, stream) => {
      if(error) cb(error);
      var stdout = '';
      var stderr = '';
      
      stream.on('exit', (code, signal) => {
        cb(null, stderr, stdout);
      }).on('data', (data) => {
        stdout += data.toString();
      }).stderr.on('data', (data) => {
        stderr += data.toString();
        cb(null, stderr, stdout);
      });
    });
  }
}

module.exports = SSHManager;
