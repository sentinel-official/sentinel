import subprocess


class OpenVPN(object):
    def __init__(self, show_output=True):
        self.init_cmd = 'sh /root/sentinel/shell_scripts/init.sh'
        self.start_cmd = 'openvpn --config /etc/openvpn/server.conf \
                          --status /etc/openvpn/openvpn-status.log 5 \
                          --ping-exit 60'
        if show_output is False:
            self.init_cmd += ' >> /dev/null 2>&1'
            self.start_cmd += ' >> /dev/null 2>&1'
        self.vpn_proc = None
        self.pid = None

        init_proc = subprocess.Popen(self.init_cmd, shell=True)
        init_proc.wait()

    def start(self):
        self.vpn_proc = subprocess.Popen(
            self.start_cmd, shell=True, stdout=subprocess.PIPE)
        pid_cmd = 'pidof openvpn'
        pid_proc = subprocess.Popen(
            pid_cmd, shell=True, stdout=subprocess.PIPE)
        self.pid = pid_proc.stdout.readline().strip()

    def stop(self):
        cmd = 'kill -2 {}'.format(self.pid)
        kill_proc = subprocess.Popen(cmd, shell=True)
        kill_proc.wait()
        if kill_proc.returncode == 0:
            self.vpn_proc, self.pid = None, None
        return kill_proc.returncode


class Keys(object):
    def __init__(self, show_output=True):
        self.gen_cmd = 'sh /root/sentinel/shell_scripts/gen_keys.sh'
        self.ovpn_path = '/etc/openvpn/client.ovpn'
        if show_output is False:
            self.gen_cmd += ' >> /dev/null 2>&1'

    def generate(self):
        gen_proc = subprocess.Popen(self.gen_cmd, shell=True)
        gen_proc.wait()
        return gen_proc.returncode

    def ovpn(self):
        with open(self.ovpn_path) as ovpn_file:
            ovpn_data = ovpn_file.readlines()
        return ovpn_data
