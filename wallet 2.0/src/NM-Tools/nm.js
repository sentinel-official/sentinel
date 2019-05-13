const SSHManager = require('./ssh_manager');


class NMTools {
  constructor() {
    this.sshManager = new SSHManager();
  }
  
  connect(ip, username, password, cb) {
    this.sshManager.connect(ip, username, password, cb);
  }
  
  listDockerImages(cb) {
    var command = `docker images -a --format '{{json .}}'`;
    this.sshManager.execute(command, cb);
  }
  
  listDockerContainers(cb) {
    var command = `docker ps -a --format '{{json .}}'`;
    this.sshManager.execute(command, cb);
  }
  
  numberOfClients(containerName, cb) {
    var command = `echo "cat /etc/openvpn/openvpn-status.log|grep -v '10.8.0'|grep client|sort|wc -l"|docker exec -i ${containerName} sh -`;
    this.sshManager.execute(command, cb);
  }
  
  nodeConfig(containerName, cb) {
    var command = `echo "cat /root/.sentinel/config"|docker exec -i ${containerName} sh -`;
    this.sshManager.execute(command, cb);
  }
}

module.exports = NMTools;
