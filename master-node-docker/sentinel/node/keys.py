import subprocess

import falcon


class SignRSAKey(object):
    def on_post(self, req, resp):
        csr = str(req.body['csr'])
        ip = str(req.headers['X-REAL-IP'])

        if len(csr) == 0:
            resp.status = falcon.HTTP_400
            return

        filename = '/root/issued/{}.csr'.format(ip)
        with open(filename, 'w') as f:
            f.write(csr)
            f.close()

        command = 'echo subjectAltName=IP:{},DNS:{} > /root/issued/{}.ext'.format(ip, ip, ip)
        proc = subprocess.Popen(command, shell=True)
        proc.wait()

        command = 'openssl x509 ' + \
                  '-req ' + \
                  '-CA /root/ca.crt ' + \
                  '-CAkey /root/ca.key ' + \
                  '-CAcreateserial ' + \
                  '-extfile /root/issued/{}.ext '.format(ip) + \
                  '-in /root/issued/{}.csr '.format(ip) + \
                  '-out /root/issued/{}.crt '.format(ip) + \
                  '-days 365 ' + \
                  '-sha256'
        proc = subprocess.Popen(command, shell=True)
        proc.wait()

        filename = '/root/issued/{}.crt'.format(ip)
        with open(filename, 'r') as f:
            body = ''.join(f.readlines())
            f.close()

        resp.status = falcon.HTTP_200
        resp.body = body
