# coding=utf-8
import subprocess


def disconnect_client(client_name):
    cmd = 'echo \'kill {}\' | nc 127.0.0.1 1195'.format(client_name)
    disconnect_proc = subprocess.Popen(cmd, shell=True)
    disconnect_proc.wait()
