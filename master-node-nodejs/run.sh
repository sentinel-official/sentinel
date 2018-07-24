nohup mongod >> /dev/null &
nohup mongo >> /dev/null &
nohup redis-server >> /dev/null &
cd /root/sentinel/src && npm install
npm run dev
